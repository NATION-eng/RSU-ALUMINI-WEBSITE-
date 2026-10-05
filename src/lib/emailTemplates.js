/**
 * Automated Email Dispatch & Template Generator for ASF RSU 45th Jubilee Sponsors
 * NAAS RSU Central Planning Committee (CPC) Financial Directorate
 */

export const TIER_DETAILS = {
  platinum: {
    name: 'Platinum Sponsor',
    minAmount: 2000000,
    badge: '🏆 Platinum Partner',
    color: '#D4AF37',
    leadTime: 'Immediate VIP Liaison Assignment',
    perks: [
      'Premium, large-format logo placement on homepage portal & permanent cloud archive',
      'Prominent corporate branding & dedicated banner placement at all major plenary sessions',
      'Special VIP recognition and commemorative appreciation plaque presentation',
      'Full-page premium color advertisement in 45th Jubilee Compendium + editorial spotlight',
      'Prime exhibition & product display booth at the homecoming venue'
    ]
  },
  gold: {
    name: 'Gold Sponsor',
    minAmount: 1000000,
    badge: '🥇 Gold Partner',
    color: '#F59E0B',
    leadTime: 'Priority Compendium Curation',
    perks: [
      'Prominent logo placement on fellowship website & event RSVP portal',
      'Corporate branding on key event materials and stage backdrops',
      'Verbal acknowledgement & appreciation during official weekend ceremonies',
      'Full-page color advertisement in the Alumni Magazine / Compendium',
      'Designated exhibition space during homecoming sessions'
    ]
  },
  silver: {
    name: 'Silver Sponsor',
    minAmount: 500000,
    badge: '🥈 Silver Partner',
    color: '#94A3B8',
    leadTime: 'Compendium Layout Verification',
    perks: [
      'Logo placement on event sponsor appreciation web pages',
      'Logo inclusion on selected printed publicity banners and program guides',
      'Public acknowledgement during Sabbath and weekend ceremonies',
      'Half-page color advertisement in the Alumni Compendium',
      'Shared exhibition opportunities where applicable'
    ]
  },
  bronze: {
    name: 'Bronze Sponsor',
    minAmount: 250000,
    badge: '🥉 Bronze Partner',
    color: '#CD7F32',
    leadTime: 'Digital Directory Listing',
    perks: [
      'Business or individual name listed on digital sponsor directory',
      'Inclusion on general event material acknowledgment lists',
      'Quarter-page advertisement or business card listing in Alumni Compendium'
    ]
  },
  support: {
    name: 'Support Partner',
    minAmount: 100000,
    badge: '🤝 Support Partner',
    color: '#10B981',
    leadTime: 'Roll of Honour Registration',
    perks: [
      'Listing in online "Friends of the Fellowship" donor directory',
      'Special mention and name recognition in the commemorative souvenir booklet'
    ]
  },
  ad_full: {
    name: 'Full Page Compendium Advert',
    minAmount: 150000,
    badge: '📖 Full Page Advert',
    color: '#3B82F6',
    leadTime: 'Artwork Submission within 7 days',
    perks: [
      'Full-page high-resolution color advert in the permanent 45th Jubilee Compendium',
      'Digital link inside the digital downloadable PDF compendium edition'
    ]
  },
  ad_half: {
    name: 'Half Page Compendium Advert',
    minAmount: 85000,
    badge: '📄 Half Page Advert',
    color: '#6366F1',
    leadTime: 'Artwork Submission within 7 days',
    perks: [
      'Half-page color advert or family congratulatory spotlight in the compendium'
    ]
  },
  custom: {
    name: 'Jubilee Goodwill Supporter',
    minAmount: 10000,
    badge: '✨ Jubilee Contributor',
    color: '#059669',
    leadTime: 'Secretariat Acknowledgment',
    perks: [
      'Official letter of appreciation from the Alumni Advisory Council',
      'Direct contribution towards student welfare & 45th Jubilee projects'
    ]
  }
};

/**
 * Generates tailor-made HTML Email for Sponsors
 */
export function generateSponsorEmailHtml({
  donorName,
  tierKey,
  amount,
  reference,
  paymentMethod = 'Paystack Online Gateway',
  organization = ''
}) {
  const tier = TIER_DETAILS[tierKey] || TIER_DETAILS.custom;
  const formattedAmount = Number(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Official Acknowledgment: 45th Jubilee Sponsorship</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141E18;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7EE; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #E5E0D2;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #051A0F; padding: 35px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="color: #F4E3A8; margin: 0 0 8px 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">
                ADVENTIST STUDENTS' FELLOWSHIP (RSU)
              </h1>
              <p style="color: #E2E8F0; margin: 0; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">
                45th Anniversary & Alumni Homecoming (1981–2026)
              </p>
              <div style="display: inline-block; background-color: rgba(212, 175, 55, 0.2); border: 1px solid #D4AF37; color: #F4E3A8; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 14px; text-transform: uppercase;">
                Theme: Rooted to Rise (Isaiah 61:3)
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 35px 25px 35px;">
              <p style="font-size: 16px; color: #141E18; margin-top: 0; line-height: 1.6;">
                Dear <strong>${donorName}${organization ? ` (${organization})` : ''}</strong>,
              </p>

              <p style="font-size: 14px; color: #374151; line-height: 1.6;">
                On behalf of the <strong>NAAS RSU Central Planning Committee (CPC)</strong> and the entire Fellowship across four decades of grace, we warmly convey our deepest appreciation for your generous partnership in celebrating the <strong>45th Grand Jubilee Anniversary</strong>.
              </p>

              <!-- Payment Voucher Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 24px 0; padding: 20px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">Sponsorship Category</td>
                  <td align="right" style="padding: 6px 0; font-size: 14px; color: #0F172A; font-weight: 800;">${tier.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">Contribution Amount</td>
                  <td align="right" style="padding: 6px 0; font-size: 18px; color: #059669; font-weight: 900;">${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">Transaction Ref</td>
                  <td align="right" style="padding: 6px 0; font-size: 12px; color: #0F172A; font-family: monospace; font-weight: 700;">${reference}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">Payment Channel</td>
                  <td align="right" style="padding: 6px 0; font-size: 12px; color: #0F172A; font-weight: 600;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">Date of Record</td>
                  <td align="right" style="padding: 6px 0; font-size: 12px; color: #0F172A; font-weight: 600;">${dateStr}</td>
                </tr>
              </table>

              <!-- Tailored Tier Benefits -->
              <h3 style="font-size: 15px; color: #051A0F; margin: 25px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #E5E0D2; padding-bottom: 8px;">
                Your Entitled Visibility & Engagement Benefits:
              </h3>
              <ul style="padding-left: 20px; margin: 0; color: #374151; font-size: 13.5px; line-height: 1.7;">
                ${tier.perks.map(p => `<li style="margin-bottom: 8px;">${p}</li>`).join('')}
              </ul>

              <!-- Next Steps for Advert & Branding Materials -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; padding: 16px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #92400E; text-transform: uppercase; font-weight: 800;">
                  📌 Next Steps for Compendium & Media Submission:
                </h4>
                <p style="margin: 0; font-size: 12.5px; color: #78350F; line-height: 1.5;">
                  Please reply to this email or send your high-resolution corporate logo, goodwill photo, and full-page/half-page advertisement artwork (PDF/TIFF/PNG 300DPI) to the Compendium Directorate at <strong>Asfrsu@gmail.com</strong> or WhatsApp <strong>+234 803 000 0000</strong>.
                </p>
              </div>

              <!-- Official Sign-off -->
              <p style="font-size: 13.5px; color: #4B5563; line-height: 1.6; margin-top: 25px;">
                May the Almighty God, who has preserved this sacred altar for 45 years, richly bless and replenish you a thousandfold for honoring this fellowship.
              </p>

              <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #CBD5E1;">
                <p style="margin: 0; font-size: 13px; font-weight: 800; color: #051A0F;">CENTRAL PLANNING COMMITTEE (CPC)</p>
                <p style="margin: 3px 0 0 0; font-size: 11.5px; color: #64748B;">Financial & Sponsorship Directorate • NAAS RSU 45th Jubilee</p>
                <p style="margin: 3px 0 0 0; font-size: 11px; color: #94A3B8;">Audited Account: ECOBANK | 0570076237 | NAAS RSU ALUMNI PROJECT</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F172A; padding: 18px 30px; text-align: center; color: #94A3B8; font-size: 11px;">
              Rivers State University, Port Harcourt, Nigeria • Rooted to Rise (1981–2026)
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
