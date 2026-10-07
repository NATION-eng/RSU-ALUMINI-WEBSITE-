/**
 * ASF RSU 45th Anniversary Jubilee Fundraising Pillars Data Model
 * 4 Distinct Fundraising Pillars for Targeted Donor Engagement & Transparency
 */

export const FUNDRAISING_PILLARS = {
  celebration: {
    id: 'celebration',
    title: '45th Anniversary Celebration',
    shortName: 'Anniversary Media & Logistics',
    badge: 'Media & Production Pillar',
    tagline: 'Directly funds general jubilee logistics, media production, public branding, studio audio jingles, and multi-camera live-streaming infrastructure.',
    target: 15000000,
    raised: 0,
    donorsCount: 0,
    leadQuote: '“Connecting our worldwide alumni family in high-definition across four continents.”',
    impactMetrics: [
      {
        label: 'Multi-Camera 4K Live Broadcast',
        desc: 'Enabling bonded multi-camera livestream reach for diaspora alumni across 14+ nations on YouTube & Facebook.',
        stat: '1080p / 4K Feed'
      },
      {
        label: 'Anniversary Historical Documentary',
        desc: 'Professional 45-year commemorative video documentary featuring pioneer elders, past chaplains & VC addresses.',
        stat: 'Archival Video'
      },
      {
        label: 'Broadcast Audio Jingles & Airtime',
        desc: 'Studio production of 30-second broadcast announcements aired across regional Port Harcourt radio & social media.',
        stat: 'Studio Mix'
      },
      {
        label: 'Campus Public Branding & Stage Design',
        desc: 'Grand stage backdrops, red-carpet interview media walls, and jubilee road banners across RSU campus.',
        stat: 'Amphitheatre Staging'
      }
    ],
    presets: [
      { amount: 25000, label: 'Broadcast Supporter', desc: 'Funds 1 hour of high-definition stream data bandwidth.' },
      { amount: 50000, label: 'Media Patron', desc: 'Sponsors archival documentary editing & audio mixing.' },
      { amount: 100000, label: 'Livestream Champion', desc: 'Directly subsidizes multi-camera wireless video transmission.' },
      { amount: 250000, label: 'Production Pillar', desc: 'Sponsors main plenary stage backdrop & amphitheatre sound.' },
      { amount: 500000, label: 'Executive Media Partner', desc: 'Full broadcast credit & special feature in documentary.' }
    ]
  },

  homecoming: {
    id: 'homecoming',
    title: 'Homecoming Weekend',
    shortName: 'Hospitality & Delegate Logistics',
    badge: 'Hospitality & Ground Logistics',
    tagline: 'Dedicated to covering hospitality, delegate materials, venue setup, and logistical coordination for on-ground attendees arriving in Port Harcourt.',
    target: 12500000,
    raised: 0,
    donorsCount: 0,
    leadQuote: '“Welcoming every returning alumnus home with royal Christian fellowship and honor.”',
    impactMetrics: [
      {
        label: 'Delegate Welcome Kits & Packs',
        desc: 'Commemorative delegate bags, personalized accreditation tags, Jubilee lapel pins & printed programs.',
        stat: '1,500+ Delegates'
      },
      {
        label: 'Sabbath Love Feast Banqueting',
        desc: 'Grand fellowship lunch banquet for visiting alumni, guests, current students & university leadership.',
        stat: 'Full Hospitality'
      },
      {
        label: 'Campus Logistics & Seating',
        desc: 'Tent pavilions, VIP seating, cooling infrastructure, power backup generators & acoustic line-arrays.',
        stat: '3 Days Active'
      },
      {
        label: 'Ground Shuttles & Protocol Liaison',
        desc: 'Port Harcourt Airport (Omagwa) arrival protocol desks, campus security liaison & local transit support.',
        stat: 'Safe Ground Transit'
      }
    ],
    presets: [
      { amount: 20000, label: 'Delegate Kit Sponsor', desc: 'Provides full registration welcome kits for 2 attendees.' },
      { amount: 50000, label: 'Banquet Table Sponsor', desc: 'Subsidizes Sabbath Love Feast lunch for 10 delegates.' },
      { amount: 100000, label: 'Hospitality Host', desc: 'Funds refreshment services across the 3-day weekend.' },
      { amount: 250000, label: 'Logistics Pillar', desc: 'Directly covers amphitheatre power generators & sound equipment.' },
      { amount: 500000, label: 'Grand Homecoming Patron', desc: 'Premier recognition at the Sunday legacy awards banquet.' }
    ]
  },

  trust_fund: {
    id: 'trust_fund',
    title: 'ASF-RSU Education Trust Fund',
    shortName: 'Indigent Student Scholarships',
    badge: 'Enduring Legacy Vehicle',
    tagline: 'A long-term financial vehicle aimed at supporting indigent students, academic mentorship initiatives, and student leadership development within the chapter.',
    target: 20000000,
    raised: 0,
    donorsCount: 0,
    leadQuote: '“No Adventist student at Rivers State University should drop out due to lack of tuition fees.”',
    impactMetrics: [
      {
        label: 'Tuition Grants for Indigent Undergrads',
        desc: 'Direct payment of verified university tuition and faculty registration for students in distress.',
        stat: 'Tuition Safety Net'
      },
      {
        label: 'Final-Year Project Research Subsidies',
        desc: 'Grants to cover laboratory, field testing & fabrication expenses for graduating seniors.',
        stat: 'Final-Year Grants'
      },
      {
        label: 'Emergency Student Welfare & Feeding',
        desc: 'Immediate food pantry subsidies and emergency medical assistance for needy campus members.',
        stat: 'Welfare Compassion'
      },
      {
        label: 'Academic Mentorship & Career Tech',
        desc: 'Software development, professional certification bootcamps, and executive career pipelines.',
        stat: 'Mentorship Academy'
      }
    ],
    presets: [
      { amount: 25000, label: 'Semester Welfare Aid', desc: 'Provides emergency food and book allowance for 1 student.' },
      { amount: 50000, label: 'Tuition Relief Grant', desc: 'Covers partial session university charges for an indigent student.' },
      { amount: 100000, label: 'Full Session Scholar', desc: 'Covers full annual academic fees and laboratory fees for 1 student.' },
      { amount: 250000, label: 'Research Project Grant', desc: 'Funds complete final-year engineering/medical research thesis.' },
      { amount: 500000, label: 'Trust Fund Fellow', desc: 'Endows a revolving scholarship named in honor of your set or family.' }
    ]
  },

  centre_of_influence: {
    id: 'centre_of_influence',
    title: 'Physical Legacy Project',
    shortName: 'Centre of Influence Complex',
    badge: 'Landmark Campus Infrastructure',
    tagline: 'Our landmark infrastructure campaign dedicated to building the proposed purpose-built 3-winged ASF-RSU Centre of Influence complex on campus.',
    target: 50000000,
    raised: 0,
    donorsCount: 0,
    leadQuote: '“A permanent spiritual, academic, and innovation lighthouse rooted at Rivers State University.”',
    impactMetrics: [
      {
        label: 'Wing A: Sanctuary & Plenary Hall',
        desc: '800-capacity acoustic sanctuary, fellowship auditorium, choir loft & baptismal pool.',
        stat: '800-Seat Sanctuary'
      },
      {
        label: 'Wing B: Student Innovation Hub',
        desc: 'Digital co-working tech space, academic e-library, conference pods & reliable solar power.',
        stat: 'Tech & Study Library'
      },
      {
        label: 'Wing C: Executive & Pastoral Wing',
        desc: 'Fellowship executive secretariat, private pastoral counselling chamber & historical archives.',
        stat: 'Secretariat & Archives'
      },
      {
        label: 'Structural Foundations & Solar Grid',
        desc: 'Heavy-duty piled foundation, structural columns, and off-grid 20kVA commercial solar inverter.',
        stat: 'Permanent Campus Build'
      }
    ],
    presets: [
      { amount: 50000, label: '100 Heritage Blocks', desc: 'Directly funds 100 structural high-density building blocks.' },
      { amount: 150000, label: 'Foundation Pillar Unit', desc: 'Sponsors reinforced concrete column pillar casting.' },
      { amount: 500000, label: 'Room Naming Sponsor', desc: 'Commemorative brass plaque naming on a study room or office.' },
      { amount: 1000000, label: 'Wing Builder Patron', desc: 'Permanent inscription on the Centre of Influence Founder’s Wall.' },
      { amount: 2500000, label: 'Grand Cornerstone Sponsor', desc: 'VIP ceremonial cornerstone stone laying & permanent recognition.' }
    ]
  }
};

export const PILLAR_KEYS = Object.keys(FUNDRAISING_PILLARS);
