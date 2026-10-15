/**
 * Automated Email Dispatch & Template Generator for ASF RSU 45th Jubilee Sponsors
 * NAAS RSU Central Planning Committee (CPC) Financial Directorate
 */

export const TIER_DETAILS = {
  platinum: {
    name: 'Platinum Sponsor',
    minAmount: 250000,
    badge: '🏆 Platinum Partner',
    color: '#D4AF37',
    leadTime: 'Immediate VIP Liaison Assignment',
    perks: [
      'Headline recognition on official portal, digital broadcast & permanent cloud archive',
      'Prominent corporate branding & dedicated banner placement at all major plenary sessions',
      'Special VIP recognition and commemorative appreciation plaque presentation',
      'Full-page premium color advertisement in 45th Jubilee Compendium',
      'Prime exhibition & product display booth at the homecoming venue'
    ]
  },
  gold: {
    name: 'Gold Sponsor',
    minAmount: 150000,
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
    minAmount: 100000,
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
    minAmount: 50000,
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
    minAmount: 20000,
    badge: '🤝 Support Partner',
    color: '#10B981',
    leadTime: 'Roll of Honour Registration',
    perks: [
      'Listing in online "Friends of the Fellowship" donor directory',
      'Special mention and name recognition in the commemorative souvenir booklet',
      'Official digital donor certificate and pastoral blessing acknowledgment'
    ]
  },
  // Alumni Giving Categories
  sapphire_builder: {
    name: 'Sapphire Builder',
    minAmount: 100000,
    badge: '💎 Sapphire Builder',
    color: '#2563EB',
    leadTime: 'Secretariat VIP Roll of Honour',
    perks: [
      'Distinguished alumni recognition in the permanent 45th Jubilee Hall of Fame',
      'VIP reservation at the Sunday Legacy Awards Banquet',
      'Special feature in the Jubilee Compendium Roll of Honour'
    ]
  },
  legacy_partner: {
    name: 'Legacy Partner',
    minAmount: 50000,
    badge: '🏛️ Legacy Partner',
    color: '#D97706',
    leadTime: 'Roll of Honour Inclusion',
    perks: [
      'Substantial contribution acknowledged in commemorative souvenir publication',
      'Direct endowment towards student scholarships and welfare safety net',
      'Digital certificate of commemorative recognition'
    ]
  },
  covenant_partner: {
    name: 'Covenant Partner',
    minAmount: 40000,
    badge: '🤝 Covenant Partner',
    color: '#059669',
    leadTime: 'Roll of Honour Registration',
    perks: [
      'Covenant partnership acknowledgment in fellowship cloud archives',
      'Special mention during the 45th Homecoming consecration session'
    ]
  },
  fellowship_partner: {
    name: 'Fellowship Partner',
    minAmount: 30000,
    badge: '🕊️ Fellowship Partner',
    color: '#7C3AED',
    leadTime: 'Directory Listing',
    perks: [
      'Listed on digital alumni giving register',
      'Directly supports campus outreach and musical ministry'
    ]
  },
  friends_of_asf: {
    name: 'Friends of ASF',
    minAmount: 20000,
    badge: '🌟 Friends of ASF',
    color: '#0D9488',
    leadTime: 'Directory Listing',
    perks: [
      'Online recognition on Friends of ASF roll',
      'Commemorative digital blessing certificate'
    ]
  },
  general_support: {
    name: 'General Support',
    minAmount: 1000,
    badge: '🌱 General Support',
    color: '#57534E',
    leadTime: 'Secretariat Acknowledgment',
    perks: [
      'Sacrificial gift contributing to 45th Jubilee operations'
    ]
  },
  // Set Contribution Framework
  pioneer_senior: {
    name: 'Pioneer / Senior Sets Contribution',
    minAmount: 100000,
    badge: '👑 Pioneer / Senior Sets',
    color: '#D4AF37',
    leadTime: 'Set Presentation Ceremony',
    perks: [
      'Official set recognition during the Sabbath Homecoming plenary service',
      'Featured cohort profile in the 45th Jubilee Souvenir Compendium'
    ]
  },
  established_sets: {
    name: 'Established Alumni Sets Contribution',
    minAmount: 75000,
    badge: '⭐ Established Alumni Sets',
    color: '#F59E0B',
    leadTime: 'Set Presentation Ceremony',
    perks: [
      'Cohort commendation in official souvenir publication',
      'Set listing on legacy donor wall'
    ]
  },
  mid_level_sets: {
    name: 'Mid-Level Sets Contribution',
    minAmount: 50000,
    badge: '🚀 Mid-Level Sets',
    color: '#3B82F6',
    leadTime: 'Set Acknowledgment',
    perks: [
      'Cohort mention and appreciation during plenary ceremonies'
    ]
  },
  recent_graduates: {
    name: 'Recent Graduates Contribution',
    minAmount: 25000,
    badge: '🎓 Recent Graduates',
    color: '#10B981',
    leadTime: 'Set Acknowledgment',
    perks: [
      'Cohort mention on digital diaspora & alumni portals'
    ]
  },
  young_alumni: {
    name: 'Young Alumni Contribution',
    minAmount: 10000,
    badge: '🌱 Young Alumni',
    color: '#14B8A6',
    leadTime: 'Set Acknowledgment',
    perks: [
      'Cohort appreciation on alumni platforms'
    ]
  },
  // Vendor & Exhibition Options
  vendor_corporate_booth: {
    name: 'Corporate Exhibition Booth',
    minAmount: 15000,
    badge: '🏢 Corporate Exhibition Booth',
    color: '#0284C7',
    leadTime: 'On-Ground Booth Allocation',
    perks: [
      'Showcase your products and services',
      'Engage directly with alumni and conference participants',
      'Increase brand awareness and generate business relationships'
    ]
  },
  vendor_small_business: {
    name: 'Small Business Booth',
    minAmount: 10000,
    badge: '💼 Small Business Booth',
    color: '#6366F1',
    leadTime: 'On-Ground Booth Allocation',
    perks: [
      'Dedicated SME booth table space at homecoming venue',
      'Engage directly with alumni and delegates'
    ]
  },
  vendor_food: {
    name: 'Food Vendor',
    minAmount: 50000,
    badge: '🍽️ Food & Catering Vendor',
    color: '#EA580C',
    leadTime: 'Catering Concession Allotment',
    perks: [
      'Designated on-ground food and refreshment selling pavilion space',
      'Access to 1,500+ attendees across 3-day anniversary weekend'
    ]
  },
  vendor_book_literature: {
    name: 'Book / Literature Vendor',
    minAmount: 20000,
    badge: '📚 Book & Literature Vendor',
    color: '#8B5CF6',
    leadTime: 'Literature Table Allotment',
    perks: [
      'Prime book and publication display table in fellowship courtyard'
    ]
  },
  vendor_ngo_ministry: {
    name: 'NGO / Ministry Exhibition',
    minAmount: 10000,
    badge: '🕊️ NGO & Ministry Booth',
    color: '#059669',
    leadTime: 'Ministry Display Allotment',
    perks: [
      'Showcase charitable initiatives and mission outreaches to alumni'
    ]
  },
  // Advertisement Rates
  ad_back_cover: {
    name: 'Outer Back Cover (Premium Space)',
    minAmount: 150000,
    badge: '🌟 Outer Back Cover (Premium)',
    color: '#D4AF37',
    leadTime: 'Immediate Reservation & Placement',
    dimensions: '210mm × 297mm (+3mm bleed)',
    perks: [
      'Maximum visibility on the outer back cover; prime real estate for leading corporate partners or major alumni sets',
      'High-impact permanent placement in both print edition and digital cloud compendium',
      'Complimentary corporate feature & digital link inside the interactive PDF edition'
    ]
  },
  ad_inside_front: {
    name: 'Inside Front Cover',
    minAmount: 112000,
    badge: '💎 Inside Front Cover',
    color: '#0284C7',
    leadTime: 'Priority Placement Verification',
    dimensions: '210mm × 297mm (+3mm bleed)',
    perks: [
      'High-impact initial placement immediately inside the front cover for top-tier sponsors and businesses',
      'First advertising page seen by dignitaries, alumni, and conference delegates',
      'Full-page vibrant color layout in print & digital downloadable compendium'
    ]
  },
  ad_inside_back: {
    name: 'Inside Back Cover',
    minAmount: 90000,
    badge: '✨ Inside Back Cover',
    color: '#8B5CF6',
    leadTime: 'Priority Placement Verification',
    dimensions: '210mm × 297mm (+3mm bleed)',
    perks: [
      'Premium interior placement facing the final pages; excellent visibility for established brands and set tributes',
      'High-resolution archival finish in print and permanent cloud repository'
    ]
  },
  ad_center_spread: {
    name: 'Center Spread (Double Page)',
    minAmount: 130000,
    badge: '📖 Center Spread (Double Page)',
    color: '#F59E0B',
    leadTime: 'Two-Page Centerfold Layout',
    dimensions: '420mm × 297mm (+3mm bleed)',
    perks: [
      'Panoramic two-page horizontal layout for major corporate partners and large alumni cohorts'
    ]
  },
  ad_full: {
    name: 'Full Page Advert',
    minAmount: 65000,
    badge: '📖 Full Page Advert',
    color: '#3B82F6',
    leadTime: 'Artwork Submission within 7 days',
    dimensions: '210mm × 297mm (+3mm bleed)',
    perks: [
      'Full-page colorful editorial layout, business feature, or commemorative set tribute',
      'Full A4 color page in print & digital downloadable compendium archive',
      'Digital link inside the digital downloadable PDF compendium edition'
    ]
  },
  ad_half: {
    name: 'Half Page Advert',
    minAmount: 35000,
    badge: '📄 Half Page Advert',
    color: '#6366F1',
    leadTime: 'Artwork Submission within 7 days',
    dimensions: '210mm × 148mm (+3mm bleed)',
    perks: [
      'Standard half-page display ad for medium-scale businesses, professional services, or group shout-outs',
      'Ideal for family tributes, consultancy practices, clinics, law chambers, and tech agencies'
    ]
  },
  ad_quarter: {
    name: 'Quarter Page Advert',
    minAmount: 18000,
    badge: '📇 Quarter Page Advert',
    color: '#10B981',
    leadTime: 'Artwork Submission within 7 days',
    dimensions: '105mm × 148mm',
    perks: [
      'Compact quarter-page layout suitable for individual business card listings and personal congratulatory notes',
      'Perfect for personal congratulatory notes, alumni set milestones, and professional service listings'
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
  },
  celebration: {
    name: '45th Anniversary Celebration Pillar',
    minAmount: 25000,
    badge: '🎥 Media & Celebration Partner',
    color: '#D4AF37',
    leadTime: 'Production Directorate Liaison',
    perks: [
      'Directly funds bonded 4K multi-camera livestream reach for worldwide diaspora alumni',
      'Support for 45-year commemorative historical documentary production & studio jingles',
      'Name credit in official anniversary broadcast credits and permanent digital cloud archive'
    ]
  },
  homecoming: {
    name: 'Homecoming Weekend Pillar',
    minAmount: 20000,
    badge: '🤝 Hospitality & Logistics Partner',
    color: '#F59E0B',
    leadTime: 'Hospitality Directorate Liaison',
    perks: [
      'Directly covers delegate welcome materials, registration kits & commemorative badges',
      'Subsidizes intergenerational Sabbath Love Feast banqueting for visiting alumni and students',
      'Recognition in the official homecoming weekend guide and plenary roll call'
    ]
  },
  trust_fund: {
    name: 'ASF-RSU Education Trust Fund Pillar',
    minAmount: 25000,
    badge: '🎓 Education Trust Fund Benefactor',
    color: '#0284C7',
    leadTime: 'Scholarship Board Verification',
    perks: [
      'Direct payment of school fee subsidies for indigent Adventist undergraduates at RSU',
      'Funding final-year undergraduate laboratory research projects & emergency student welfare',
      'Permanent inscription on the Education Trust Fund Roll of Honor'
    ]
  },
  centre_of_influence: {
    name: 'Physical Legacy Project (Centre of Influence)',
    minAmount: 50000,
    badge: '🏛️ Centre of Influence Builder',
    color: '#059669',
    leadTime: 'Infrastructure Board Verification',
    perks: [
      'Direct contribution toward building the 3-winged ASF-RSU Centre of Influence complex on campus',
      'Permanent inscription on the Centre of Influence Founder’s Wall & commemorative plaza',
      'VIP ceremonial invitation to the ground-breaking and foundation stone laying ceremonies'
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
                  📌 Next Steps for Compendium &amp; Media Submission:
                </h4>
                <p style="margin: 0; font-size: 12.5px; color: #78350F; line-height: 1.6;">
                  All artwork, tributes, personal messages, or ad copy must be submitted in high-resolution print-ready format (PDF, TIFF, or high-DPI JPEG at 300 DPI) with a 3mm bleed.<br/><br/>
                  Please send your materials directly to <strong>Ekpor Jephta</strong> at <a href="mailto:ekporjephta@gmail.com" style="color: #92400E; font-weight: 700; text-decoration: underline;">ekporjephta@gmail.com</a>, with copy to the Jubilee Secretariat at <a href="mailto:Asfrsu@gmail.com" style="color: #92400E; font-weight: 700; text-decoration: underline;">Asfrsu@gmail.com</a>.
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
