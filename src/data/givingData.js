/**
 * ASF RSU 45th Anniversary Jubilee Giving, Sponsorship & Commercial Frameworks
 * Official financial rates, sponsorship tiers, alumni giving categories,
 * set contribution framework, and vendor/exhibition options.
 */

export const SPONSORSHIP_LEVELS = [
  {
    key: 'platinum',
    name: 'Platinum Sponsor',
    contribution: 250000,
    formattedAmount: '₦250,000',
    badge: '🏆 Platinum Partner',
    color: 'from-amber-400 to-yellow-500',
    subtitle: 'Premier Executive Category',
    tagline: 'Maximum visibility across digital, broadcast, and on-ground physical venues.',
    perks: [
      'Headline recognition on the official portal, digital broadcast & permanent cloud archive',
      'Prominent corporate branding & dedicated banner placement at all major plenary sessions',
      'VIP recognition and commemorative 45th Jubilee appreciation plaque presentation',
      'Full-page premium color advertisement in the 45th Jubilee Compendium',
      'Prime exhibition & product display booth at the homecoming venue'
    ]
  },
  {
    key: 'gold',
    name: 'Gold Sponsor',
    contribution: 150000,
    formattedAmount: '₦150,000',
    badge: '🥇 Gold Partner',
    color: 'from-amber-500 to-amber-600',
    subtitle: 'Executive Tier',
    tagline: 'High-visibility corporate branding on stage backdrops, compendium, and media.',
    perks: [
      'Prominent logo placement on fellowship website & event RSVP portal',
      'Corporate branding on key event materials and stage backdrops',
      'Verbal acknowledgement & appreciation during official weekend ceremonies',
      'Full-page color advertisement in the Alumni Magazine / Compendium',
      'Designated exhibition space during homecoming sessions'
    ]
  },
  {
    key: 'silver',
    name: 'Silver Sponsor',
    contribution: 100000,
    formattedAmount: '₦100,000',
    badge: '🥈 Silver Partner',
    color: 'from-slate-400 to-slate-500',
    subtitle: 'Prominent Supporter',
    tagline: 'Featured brand presence in souvenir magazine and plenary acknowledgments.',
    perks: [
      'Logo placement on event sponsor appreciation web pages',
      'Logo inclusion on selected printed publicity banners and program guides',
      'Public acknowledgement during Sabbath and weekend ceremonies',
      'Half-page color advertisement in the Alumni Compendium',
      'Shared exhibition opportunities where applicable'
    ]
  },
  {
    key: 'bronze',
    name: 'Bronze Sponsor',
    contribution: 50000,
    formattedAmount: '₦50,000',
    badge: '🥉 Bronze Partner',
    color: 'from-amber-700 to-amber-800',
    subtitle: 'Valued Partner',
    tagline: 'Ideal for SMEs, consultancies, or alumni sets desiring dedicated inclusion.',
    perks: [
      'Business or individual name listed on digital sponsor directory',
      'Inclusion on general event material acknowledgment lists',
      'Quarter-page advertisement or business card listing in Alumni Compendium'
    ]
  },
  {
    key: 'support',
    name: 'Support Partner',
    contribution: 20000,
    formattedAmount: '₦20,000',
    badge: '🤝 Support Partner',
    color: 'from-emerald-600 to-teal-700',
    subtitle: 'Community Benefactor',
    tagline: 'Empowering student feeding, registration packages, and general operational logistics.',
    perks: [
      'Listing in online "Friends of the Fellowship" donor directory',
      'Special mention and name recognition in the commemorative souvenir booklet',
      'Official digital donor certificate and pastoral blessing acknowledgment'
    ]
  }
];

export const ALUMNI_GIVING_CATEGORIES = [
  {
    key: 'sapphire_builder',
    name: 'Sapphire Builder',
    range: '₦100,000 and above',
    suggestedAmount: 100000,
    minAmount: 100000,
    badge: '💎 Sapphire Builder',
    border: 'border-blue-400',
    color: 'from-blue-600 to-indigo-700',
    desc: 'Distinguished leadership giving powering enduring spiritual and institutional legacy for our chapter.'
  },
  {
    key: 'legacy_partner',
    name: 'Legacy Partner',
    range: '₦50,000 – ₦99,000',
    suggestedAmount: 50000,
    minAmount: 50000,
    badge: '🏛️ Legacy Partner',
    border: 'border-amber-400',
    color: 'from-amber-600 to-yellow-600',
    desc: 'Substantial investment preserving chapter heritage, student scholarships, and campus facilities.'
  },
  {
    key: 'covenant_partner',
    name: 'Covenant Partner',
    range: '₦40,000 – ₦49,000',
    suggestedAmount: 40000,
    minAmount: 40000,
    badge: '🤝 Covenant Partner',
    border: 'border-emerald-400',
    color: 'from-emerald-600 to-teal-700',
    desc: 'Dedicated covenant honoring God’s faithfulness through four and a half decades of unbroken grace.'
  },
  {
    key: 'fellowship_partner',
    name: 'Fellowship Partner',
    range: '₦30,000 – ₦39,999',
    suggestedAmount: 30000,
    minAmount: 30000,
    badge: '🕊️ Fellowship Partner',
    border: 'border-purple-400',
    color: 'from-purple-600 to-indigo-600',
    desc: 'Strengthening brotherly fellowship, active student outreach, and Mass Choir ministry.'
  },
  {
    key: 'friends_of_asf',
    name: 'Friends of ASF',
    range: '₦20,000 – ₦29,000',
    suggestedAmount: 20000,
    minAmount: 20000,
    badge: '🌟 Friends of ASF',
    border: 'border-teal-400',
    color: 'from-teal-600 to-emerald-700',
    desc: 'Valued partnership fueling student welfare, love feast banquets, and celebration provisioning.'
  },
  {
    key: 'general_support',
    name: 'General Support',
    range: 'Any amount',
    suggestedAmount: 10000,
    minAmount: 1000,
    badge: '🌱 General Support',
    border: 'border-stone-400',
    color: 'from-stone-600 to-stone-800',
    desc: 'Every sacrificial gift matters in advancing the mission and building our sacred fellowship.'
  }
];

export const SET_CONTRIBUTION_FRAMEWORK = [
  {
    key: 'pioneer_senior',
    category: 'Pioneer/Senior Sets',
    cohorts: '1981–1995 Sets',
    suggestedAmount: 100000,
    range: '₦100,000+',
    badge: '👑 Pioneer / Senior Sets',
    desc: 'Foundational cohorts leading by example in institutional giving and permanent legacy endowments.'
  },
  {
    key: 'established_sets',
    category: 'Established Alumni Sets',
    cohorts: '1996–2005 Sets',
    suggestedAmount: 75000,
    range: '₦75,000',
    badge: '⭐ Established Alumni Sets',
    desc: 'Seasoned professional cohorts fueling impactful fellowship infrastructure projects and trust funds.'
  },
  {
    key: 'mid_level_sets',
    category: 'Mid-Level Sets',
    cohorts: '2006–2015 Sets',
    suggestedAmount: 50000,
    range: '₦50,000',
    badge: '🚀 Mid-Level Sets',
    desc: 'Rising career leaders driving contemporary student mentorship and welfare relief funds.'
  },
  {
    key: 'recent_graduates',
    category: 'Recent Graduates',
    cohorts: '2016–2022 Sets',
    suggestedAmount: 25000,
    range: '₦25,000',
    badge: '🎓 Recent Graduates',
    desc: 'Early-career alumni giving back to build up the next generation of campus scholars.'
  },
  {
    key: 'young_alumni',
    category: 'Young Alumni',
    cohorts: '2023–2026 Sets',
    suggestedAmount: 10000,
    range: '₦10,000',
    badge: '🌱 Young Alumni',
    desc: 'Fresh graduates and newly minted professionals taking their first steps in alumni giving.'
  }
];

export const VENDOR_EXHIBITION_OPTIONS = [
  {
    key: 'vendor_corporate_booth',
    category: 'Corporate Exhibition Booth',
    proposedFee: 15000,
    formattedFee: '₦15,000',
    badge: '🏢 Corporate Booth',
    desc: 'Prominent exhibition space for corporate brands, financial institutions, and established agencies.'
  },
  {
    key: 'vendor_small_business',
    category: 'Small Business Booth',
    proposedFee: 10000,
    formattedFee: '₦10,000',
    badge: '💼 Small Business Booth',
    desc: 'Dedicated space for SMEs, artisans, tech startups, and entrepreneurial alumni businesses.'
  },
  {
    key: 'vendor_food',
    category: 'Food Vendor',
    proposedFee: 50000,
    formattedFee: '₦50,000',
    badge: '🍽️ Food & Catering Vendor',
    desc: 'Exclusive on-ground catering, meals, snacks, and beverage concession space during homecoming.'
  },
  {
    key: 'vendor_book_literature',
    category: 'Book/Literature Vendor',
    proposedFee: 20000,
    formattedFee: '₦20,000',
    badge: '📚 Book & Literature Vendor',
    desc: 'Exhibition table for Christian publishers, authors, educational media, and devotional books.'
  },
  {
    key: 'vendor_ngo_ministry',
    category: 'NGO/Ministry Exhibition',
    proposedFee: 10000,
    formattedFee: '₦10,000',
    badge: '🕊️ NGO & Ministry Booth',
    desc: 'Designated space for charitable initiatives, mission groups, and non-profit organizations.'
  }
];

export const VENDOR_PARTICIPATION_BENEFITS = [
  'Showcase your products and services.',
  'Engage directly with alumni and other participants.',
  'Increase brand awareness.',
  'Generate new business relationships.',
  'Associate your organisation with a historic 45-year milestone.'
];

export const ADVERTISEMENT_RATES = [
  {
    key: 'ad_back_cover',
    placement: 'Outer Back Cover',
    rate: 150000,
    formattedRate: '₦150,000',
    badge: '🌟 Outer Back Cover (Premium)',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    specs: 'A4 Full Bleed, 300 DPI CMYK, High-Gloss Laminated Outer Cover',
    desc: 'The premier back cover spot seen by all readers, VIP delegates, and global alumni.'
  },
  {
    key: 'ad_inside_front',
    placement: 'Inside Front Cover',
    rate: 112000,
    formattedRate: '₦112,000',
    badge: '💎 Inside Front Cover',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    specs: 'A4 Full Bleed, 300 DPI CMYK, Inside Front Facing Opening Page',
    desc: 'Highest-visibility inner page immediately facing the President & VC Welcome addresses.'
  },
  {
    key: 'ad_inside_back',
    placement: 'Inside Back Cover',
    rate: 90000,
    formattedRate: '₦90,000',
    badge: '✨ Inside Back Cover',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    specs: 'A4 Full Bleed, 300 DPI CMYK, Inside Back Facing Closing Page',
    desc: 'Prominent closing position with guaranteed maximum visibility for alumni and corporate features.'
  },
  {
    key: 'ad_full',
    placement: 'Full Page',
    rate: 65000,
    formattedRate: '₦65,000',
    badge: '📖 Full Page Advert',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    specs: '210mm × 297mm, 300 DPI CMYK High-Res Layout',
    desc: 'Standard single full-page color feature for corporate brands, alumni sets, or family tributes.'
  },
  {
    key: 'ad_half',
    placement: 'Half Page',
    rate: 35000,
    formattedRate: '₦35,000',
    badge: '📄 Half Page Advert',
    dimensions: '210mm × 148mm (+3mm bleed)',
    aspectRatio: 'Half A4 Landscape',
    specs: '210mm × 148mm, 300 DPI CMYK High-Res Layout',
    desc: 'Half-page display ad for medium-scale businesses, professional practices, or group shout-outs.'
  },
  {
    key: 'ad_quarter',
    placement: 'Quarter Page',
    rate: 18000,
    formattedRate: '₦18,000',
    badge: '📇 Quarter Page Advert',
    dimensions: '105mm × 148mm',
    aspectRatio: 'Quarter A4 Portrait',
    specs: '105mm × 148mm, 300 DPI CMYK High-Res Layout',
    desc: 'Compact quarter-page slot for individual business card listings and personal congratulatory notes.'
  }
];
