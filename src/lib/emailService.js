/**
 * Direct Email Dispatch Service for ASF RSU 45th Jubilee Sponsors
 * Delivers tailored official letters directly to the sponsor's email inbox
 */

import { supabase } from './supabase';
import { TIER_DETAILS, generateSponsorEmailHtml } from './emailTemplates';

/**
 * Dispatches an official acknowledgment email directly to the sponsor's email address.
 * 
 * Supports:
 * 1. Supabase Edge Function (`send-sponsor-email`)
 * 2. Direct Resend / SendGrid / Custom SMTP Webhook REST API if configured
 * 3. Supabase `outbound_emails` database logging
 */
export async function sendSponsorAcknowledgmentEmail({
  donorName,
  email,
  tierKey,
  amount,
  reference,
  paymentMethod = 'Paystack Online Gateway',
  organization = '',
  phone = ''
}) {
  if (!email || !email.includes('@')) {
    return { success: false, status: 'FAILED', message: 'Recipient email address is required.' };
  }

  const tier = TIER_DETAILS[tierKey] || TIER_DETAILS.custom;
  const isAd = Boolean(tierKey && tierKey.startsWith('ad_'));
  const subject = `Official Acknowledgment: 45th Jubilee ${isAd ? 'Compendium Ad' : 'Sponsorship'} - ${tier.name} (Ref: ${reference})`;
  const htmlContent = generateSponsorEmailHtml({
    donorName,
    tierKey,
    amount,
    reference,
    paymentMethod,
    organization
  });

  const mailtoFallback = getMailtoLink({
    email,
    donorName,
    tierName: tier.name,
    amount,
    reference,
    isAd
  });

  const emailPayload = {
    to: email.trim(),
    recipientName: donorName.trim(),
    fromName: "NAAS RSU 45th Jubilee Central Planning Committee",
    fromEmail: "Asfrsu@gmail.com",
    replyTo: "Asfrsu@gmail.com",
    subject,
    html: htmlContent,
    tierName: tier.name,
    amount,
    reference,
    organization,
    phone,
    apiKey: import.meta.env.VITE_RESEND_API_KEY || ''
  };

  let dispatchStatus = 'QUEUED';
  let failureReason = '';
  let serviceResponse = null;

  // 1. Try Supabase Edge Function if available
  try {
    const { data, error } = await supabase.functions.invoke('send-sponsor-email', {
      body: emailPayload
    });

    if (!error && data && data.success) {
      dispatchStatus = 'DELIVERED';
      serviceResponse = data;
      console.log('Sponsor email successfully dispatched via Supabase Edge Function to:', email);
    } else if (error) {
      console.info('Edge function note:', error.message);
    }
  } catch (fnErr) {
    console.info('Supabase function invoke skipped or pending deployment:', fnErr.message);
  }

  // 2. Try Direct Resend API if VITE_RESEND_API_KEY is configured
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (dispatchStatus !== 'DELIVERED' && resendApiKey) {
    try {
      // First attempt sending from verified / default onboarding sender
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'NAAS RSU 45th Jubilee <onboarding@resend.dev>',
          reply_to: 'Asfrsu@gmail.com',
          to: [email.trim()],
          subject,
          html: htmlContent
        })
      });

      const resData = await res.json().catch(() => ({}));
      if (res.ok && resData.id) {
        dispatchStatus = 'DELIVERED';
        serviceResponse = resData;
        console.log('Sponsor email successfully sent via Resend API to:', email);
      } else {
        // Resend returned an error (e.g. 403 sandbox restriction: only sending to chiburoma51@gmail.com)
        if (res.status === 403 && resData.message && resData.message.includes('only send testing emails')) {
          dispatchStatus = 'PENDING_DOMAIN_VERIFICATION';
          failureReason = 'Resend account is in sandbox testing mode. Domain verification at resend.com/domains is required by the Secretariat to deliver to public email addresses.';
          console.warn('Resend Sandbox restriction:', resData.message);
        } else {
          dispatchStatus = 'FAILED';
          failureReason = resData.message || `Resend HTTP ${res.status}`;
          console.warn('Resend API error:', failureReason);
        }
      }
    } catch (resendErr) {
      dispatchStatus = 'FAILED';
      failureReason = resendErr.message;
      console.warn('Resend API dispatch error:', resendErr);
    }
  }

  // 3. Try custom Webhook URL if configured (e.g. Zapier, Make, or custom mailer)
  const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (dispatchStatus !== 'DELIVERED' && webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });
      if (res.ok) {
        dispatchStatus = 'DELIVERED';
      }
    } catch (whErr) {
      console.warn('Webhook dispatch note:', whErr);
    }
  }

  // 4. Log into Supabase `outbound_emails` table and localStorage for auditing
  const logRecord = {
    recipient_email: email.trim(),
    recipient_name: donorName.trim(),
    subject,
    tier_name: tier.name,
    amount: Number(amount),
    reference,
    status: dispatchStatus,
    reason: failureReason || null,
    sent_at: new Date().toISOString()
  };

  try {
    await supabase.from('outbound_emails').insert([logRecord]);
  } catch (logErr) {
    // Schema table may not be created yet in public
  }

  try {
    const localLogs = JSON.parse(localStorage.getItem('asf_dispatched_emails') || '[]');
    localLogs.unshift(logRecord);
    localStorage.setItem('asf_dispatched_emails', JSON.stringify(localLogs));
  } catch (lsErr) {}

  return {
    success: dispatchStatus === 'DELIVERED',
    status: dispatchStatus,
    reason: failureReason,
    recipient: email,
    subject,
    mailtoLink: mailtoFallback,
    response: serviceResponse
  };
}

/**
 * Creates a pre-populated mailto link for direct admin / donor fallback emailing
 */
export function getMailtoLink({ email, donorName, tierName, amount, reference, isAd = false }) {
  const subject = encodeURIComponent(`Official Acknowledgment: 45th Jubilee ${isAd ? 'Compendium Ad' : 'Sponsorship'} - ${tierName} (Ref: ${reference})`);
  const body = encodeURIComponent(
`Dear ${donorName || 'Valued Partner'},

On behalf of the NAAS RSU Central Planning Committee (CPC) and the Adventist Students' Fellowship (RSU), we convey our heartfelt appreciation for your generous partnership towards our 45th Anniversary & Alumni Homecoming (1981–2026).

Contribution Details:
• Category: ${tierName}
• Amount: ₦${Number(amount || 0).toLocaleString()}
• Reference: ${reference}
• Designated Bank Account: ECOBANK NIGERIA | 0570076237 | NAAS RSU ALUMNI PROJECT

${isAd ? `Next Steps for Advert & Media Submission:
Please send your print-ready artwork, tribute, or ad copy (PDF, TIFF, or 300 DPI JPEG with 3mm bleed) to:
• Ekpor Jephta: ekporjephta@gmail.com
• Secretariat: Asfrsu@gmail.com` : `Contribution Purpose:
Your partnership actively empowers the student scholarship endowment, chapel modernization, and 45th Jubilee homecoming logistics.`}

Warm regards in Christ,
Central Planning Committee (CPC)
NAAS RSU 45th Jubilee Secretariat
Email: Asfrsu@gmail.com`
  );

  return `mailto:${email}?subject=${subject}&body=${body}`;
}
