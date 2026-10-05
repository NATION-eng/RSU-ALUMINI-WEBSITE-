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
  if (!email) {
    return { success: false, error: 'Recipient email address is required.' };
  }

  const tier = TIER_DETAILS[tierKey] || TIER_DETAILS.custom;
  const subject = `Official Acknowledgment: 45th Jubilee Sponsorship - ${tier.name} (Ref: ${reference})`;
  const htmlContent = generateSponsorEmailHtml({
    donorName,
    tierKey,
    amount,
    reference,
    paymentMethod,
    organization
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
  let serviceResponse = null;

  // 1. Try Supabase Edge Function if available
  try {
    const { data, error } = await supabase.functions.invoke('send-sponsor-email', {
      body: emailPayload
    });

    if (!error && data) {
      dispatchStatus = 'DELIVERED';
      serviceResponse = data;
      console.log('Sponsor email successfully dispatched via Supabase Edge Function to:', email);
    } else if (error) {
      console.info('Edge function note (falling back to API/Database Queue):', error.message);
    }
  } catch (fnErr) {
    console.info('Supabase function invoke skipped or pending deployment:', fnErr.message);
  }

  // 2. Try Direct Resend API if VITE_RESEND_API_KEY is configured
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (dispatchStatus !== 'DELIVERED' && resendApiKey) {
    try {
      // First attempt sending directly from Asfrsu@gmail.com
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'NAAS RSU 45th Jubilee <Asfrsu@gmail.com>',
          reply_to: 'Asfrsu@gmail.com',
          to: [email.trim()],
          subject,
          html: htmlContent
        })
      });

      // If domain verification restricts direct @gmail.com on Resend, fallback to certified relay with reply_to
      if (!res.ok) {
        const errNotice = await res.json().catch(() => ({}));
        console.info('Resend direct sender note (delivering with reply_to Asfrsu@gmail.com):', errNotice);
        res = await fetch('https://api.resend.com/emails', {
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
      }

      if (res.ok) {
        const resData = await res.json();
        dispatchStatus = 'DELIVERED';
        serviceResponse = resData;
        console.log('Sponsor email successfully sent via Resend API to:', email);
      }
    } catch (resendErr) {
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

  // 4. Log into Supabase `outbound_emails` table for auditing and tracking
  try {
    const logRecord = {
      recipient_email: email.trim(),
      recipient_name: donorName.trim(),
      subject,
      tier_name: tier.name,
      amount: Number(amount),
      reference,
      status: dispatchStatus,
      sent_at: new Date().toISOString()
    };

    await supabase.from('outbound_emails').insert([logRecord]);

    // Also backup in localStorage
    const localLogs = JSON.parse(localStorage.getItem('asf_dispatched_emails') || '[]');
    localLogs.unshift(logRecord);
    localStorage.setItem('asf_dispatched_emails', JSON.stringify(localLogs));
  } catch (logErr) {
    console.warn('Email logging note:', logErr);
  }

  return {
    success: true,
    status: dispatchStatus,
    recipient: email,
    subject,
    response: serviceResponse
  };
}

/**
 * Creates a pre-populated mailto link for direct admin fallback emailing
 */
export function getMailtoLink({ email, donorName, tierName, amount, reference }) {
  const subject = encodeURIComponent(`Official Acknowledgment: 45th Jubilee Sponsorship - ${tierName} (Ref: ${reference})`);
  const body = encodeURIComponent(
`Dear ${donorName},

On behalf of the NAAS RSU Central Planning Committee (CPC) and the Adventist Students' Fellowship (RSU), we convey our heartfelt appreciation for your generous partnership towards our 45th Anniversary & Alumni Homecoming (1981–2026).

Contribution Details:
• Category: ${tierName}
• Amount: ₦${Number(amount).toLocaleString()}
• Reference: ${reference}
• Bank Account: ECOBANK | 0570076237 | NAAS RSU ALUMNI PROJECT

Next Steps for Advert & Media Submission:
Please send your print-ready artwork, tribute, or ad copy (PDF, TIFF, or 300 DPI JPEG with 3mm bleed) to:
• Ekpor Jephta: ekporjephta@gmail.com
• Secretariat: Asfrsu@gmail.com

Warm regards in Christ,
Central Planning Committee (CPC)
NAAS RSU 45th Jubilee Secretariat`
  );

  return `mailto:${email}?subject=${subject}&body=${body}`;
}
