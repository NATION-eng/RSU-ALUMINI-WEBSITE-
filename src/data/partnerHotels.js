/**
 * Partner Hotels & Accommodation Directory for ASF RSU 45th Jubilee Homecoming
 * Rivers State University (RSU), Nkpolu-Oroworukwo, Port Harcourt
 * 
 * Sourced from the Official WLA Committee Proposal & Public Listings.
 * Only hotels with verified published room rates are included.
 */

export const PARTNER_DISCOUNT_CODE = 'ASF45JUBILEE';

export const HOTEL_PRICE_DISCLAIMER = 
  'These are published room rates displayed on official hotel pages and verified booking channels. Final rates may vary by date, availability, taxes, or direct negotiation. Call or WhatsApp the hotel directly or contact the CPC Accommodation Coordinator before budgeting or paying.';

export const PARTNER_HOTELS = [
  {
    id: 'oak-haven-hotel',
    name: 'Oak Haven Hotel & Suites',
    tier: 'Executive Comfort & Luxury Suites',
    stars: 4,
    tag: 'Executive & Signature Suites',
    address: 'Port Harcourt Axis (Approx. 4.5 km from RSU)',
    distanceKm: 4.5,
    distanceFromRSU: '~4.5 km from RSU Campus',
    transitTime: 'Approx. 10 mins drive',
    startingRate: 91000,
    discountedRate: 'From ₦91,000 / night',
    standardRate: 'Up to ₦332,000 / night',
    savings: 'Deluxe & Signature Suites Available',
    phone: '+234 904 077 1900',
    whatsapp: '+2349040771900',
    website: '',
    roomCategories: [
      { name: 'Deluxe Room (Cheapest / Standard)', rate: '₦91,000', amount: 91000 },
      { name: 'Signature Suite (Most Expensive)', rate: '₦332,000', amount: 332000 }
    ],
    amenities: [
      'Deluxe & Signature Suites',
      'Air Conditioned Rooms',
      'High-Speed Wi-Fi',
      '24/7 Security & Power',
      'On-Site Executive Dining'
    ],
    mapQuery: 'Oak+Haven+Hotel+Suites+Port+Harcourt',
    recommendedFor: 'Diaspora delegates, corporate partners, and executive alumni.',
    isNearby: false,
    isBudget: false,
    isLuxury: true
  },
  {
    id: 'villa-toscana-luxe',
    name: 'Villa Toscana Luxe',
    tier: 'Luxury Boutique Hospitality',
    stars: 4,
    tag: 'Deluxe & Flavour Suites',
    address: 'Port Harcourt Axis (Approx. 4.5 km from RSU)',
    distanceKm: 4.5,
    distanceFromRSU: '~4.5 km from RSU Campus',
    transitTime: 'Approx. 10 mins drive',
    startingRate: 100000,
    discountedRate: 'From ₦100,000 / night',
    standardRate: 'Up to ₦300,000 / night',
    savings: 'Flavour Suite & Deluxe Comfort',
    phone: '+234 802 376 8799',
    secondaryPhone: '+234 704 130 0045',
    whatsapp: '+2348023768799',
    website: '',
    roomCategories: [
      { name: 'Deluxe Room (Cheapest / Standard)', rate: '₦100,000', amount: 100000 },
      { name: 'Flavour Suite (Most Expensive)', rate: '₦300,000', amount: 300000 }
    ],
    amenities: [
      'Luxury Boutique Atmosphere',
      'Flavour Suites',
      'Swimming Pool & Lounge',
      '24/7 Guaranteed Power',
      'VIP Concierge Support'
    ],
    mapQuery: 'Villa+Toscana+Luxe+Port+Harcourt',
    recommendedFor: 'Visiting dignitaries, senior alumni, and executive couples.',
    isNearby: false,
    isBudget: false,
    isLuxury: true
  },
  {
    id: 'golden-tulip-evergreen',
    name: 'Golden Tulip Evergreen',
    tier: '4-Star International Hotel',
    stars: 4,
    tag: 'Presidential & Standard Comfort',
    address: 'Evo Road / G.R.A Axis, Port Harcourt',
    distanceKm: 4.2,
    distanceFromRSU: '~4.2 km from RSU Campus',
    transitTime: 'Approx. 10–12 mins drive',
    startingRate: 135450,
    discountedRate: 'From ₦135,450 / night',
    standardRate: 'Up to ₦547,650 / night',
    savings: 'Standard to Presidential Suite',
    phone: '+234 906 243 5582',
    secondaryPhone: '+234 916 998 8444',
    whatsapp: '+2349062435582',
    website: 'https://goldentulip.com',
    roomCategories: [
      { name: 'Standard Room (Cheapest / Standard)', rate: '₦135,450', amount: 135450 },
      { name: 'Presidential Suite (Most Expensive)', rate: '₦547,650', amount: 547650 }
    ],
    amenities: [
      'International Brand Quality',
      'Presidential Suite Available',
      'Buffet Breakfast & Restaurant',
      'Modern Fitness Gym & Pool',
      'Full Security & Access Control'
    ],
    mapQuery: 'Golden+Tulip+Evergreen+Port+Harcourt',
    recommendedFor: 'Diaspora delegates, corporate sponsors, and senior pioneer elders.',
    isNearby: false,
    isBudget: false,
    isLuxury: true
  },
  {
    id: 'bougainvillea-hotel',
    name: 'Bougainvillea Hotel',
    tier: 'Premium Hospitality Partner',
    stars: 4,
    tag: 'Presidential & Standard Rooms',
    address: 'G.R.A Axis, Port Harcourt',
    distanceKm: 4.2,
    distanceFromRSU: '~4.2 km from RSU Campus',
    transitTime: 'Approx. 10 mins drive',
    startingRate: 60000,
    discountedRate: 'From ₦60,000 / night',
    standardRate: 'Up to ₦140,000 / night',
    savings: 'Standard & Presidential Options',
    phone: '+234 803 051 2293',
    whatsapp: '+2348030512293',
    website: '',
    roomCategories: [
      { name: 'Standard Room (Cheapest / Standard)', rate: '₦60,000', amount: 60000 },
      { name: 'Presidential Suite (Most Expensive)', rate: '₦140,000', amount: 140000 }
    ],
    amenities: [
      'Serene G.R.A Environment',
      'Spacious Presidential Suite',
      '24/7 Security Marshals',
      'High-Speed Wi-Fi',
      'Quality In-House Dining'
    ],
    mapQuery: 'Bougainvillea+Hotel+Port+Harcourt',
    recommendedFor: 'Alumni set leaders, professional pairs, and visiting families.',
    isNearby: false,
    isBudget: false,
    isLuxury: true
  },
  {
    id: 'stinson-hotel',
    name: 'Stinson Hotel',
    tier: 'Comfort & Multi-Tier Rooms',
    stars: 3,
    tag: 'Bronze, Silver & VIP Suites',
    address: 'Port Harcourt Axis (Approx. 5.0 km from RSU)',
    distanceKm: 5.0,
    distanceFromRSU: '~5.0 km from RSU Campus',
    transitTime: 'Approx. 12 mins drive',
    startingRate: 30000,
    discountedRate: 'From ₦30,000 / night',
    standardRate: 'Up to ₦52,000 / night',
    savings: '5 Room Tiers from ₦30k to ₦52k',
    phone: '+234 706 383 6336',
    email: 'reservations@stinsonhotels.com',
    whatsapp: '+2347063836336',
    website: '',
    roomCategories: [
      { name: 'Bronze Room (Cheapest)', rate: '₦30,000', amount: 30000 },
      { name: 'Silver Room (Standard)', rate: '₦33,000', amount: 33000 },
      { name: 'Gold Room', rate: '₦40,000', amount: 40000 },
      { name: 'Diamond Room', rate: '₦46,000', amount: 46000 },
      { name: 'VIP Room (Most Expensive)', rate: '₦52,000', amount: 52000 }
    ],
    amenities: [
      'Multiple Room Tiers to Fit Budget',
      'En-Suite Air Conditioned Rooms',
      'Quiet Residential Setting',
      '24/7 Generator Power',
      'Direct Reservations by Email & Liaison'
    ],
    mapQuery: 'Stinson+Hotel+Port+Harcourt',
    recommendedFor: 'Set delegates, budget-conscious alumni, and visiting groups.',
    isNearby: false,
    isBudget: true,
    isLuxury: false
  },
  {
    id: 'tocville-gardens',
    name: 'Tocville Gardens & Suites',
    tier: 'Ultra-Affordable Budget Partner',
    stars: 3,
    tag: 'Best Economy Rate (From ₦8,000)',
    address: 'Port Harcourt Axis (Approx. 5.0 km from RSU)',
    distanceKm: 5.0,
    distanceFromRSU: '~5.0 km from RSU Campus',
    transitTime: 'Approx. 12 mins drive',
    startingRate: 8000,
    discountedRate: 'From ₦8,000 / night',
    standardRate: 'Up to ₦20,000 / night',
    savings: 'Lowest Published Rate in Port Harcourt',
    phone: '+234 814 880 8800',
    secondaryPhone: '+234 700 880 8800',
    whatsapp: '+2348148808800',
    website: '',
    roomCategories: [
      { name: 'Studio 1 (Cheapest)', rate: '₦8,000', amount: 8000 },
      { name: 'Deluxe Room (Standard)', rate: '₦12,000', amount: 12000 },
      { name: 'Business Suite (Most Expensive)', rate: '₦20,000', amount: 20000 }
    ],
    amenities: [
      'Budget-Friendly Pricing',
      'Self-Contained Studio Units',
      'Deluxe & Business Suites',
      'Perimeter Security',
      'Convenient Access Route'
    ],
    mapQuery: 'Tocville+Gardens+Suites+Port+Harcourt',
    recommendedFor: 'Students, young alumni, choir delegates, and budget travelers.',
    isNearby: false,
    isBudget: true,
    isLuxury: false
  },
  {
    id: 'christine-apartment-hotel',
    name: 'Christine Apartment Hotel',
    tier: 'Campus Proximity & Apartment Suites',
    stars: 3,
    tag: 'Closest to Campus (~1.5 km)',
    address: 'RSU Axis, Nkpolu-Oroworukwo, Port Harcourt',
    distanceKm: 1.5,
    distanceFromRSU: '~1.5 km from RSU Campus',
    transitTime: 'Approx. 3–5 mins drive',
    startingRate: 25000,
    discountedRate: 'From ₦25,000 / night',
    standardRate: 'Up to ₦100,000 / night',
    savings: 'Walking / Quick Transit Proximity',
    phone: '+234 806 540 6380',
    whatsapp: '+2348065406380',
    website: '',
    roomCategories: [
      { name: 'Noela Standard (Cheapest)', rate: '₦25,000', amount: 25000 },
      { name: 'Christine Monarch (Standard)', rate: '₦30,000', amount: 30000 },
      { name: 'Presidential Suite 3-Bedroom (Most Expensive)', rate: '₦100,000', amount: 100000 }
    ],
    amenities: [
      'Immediate Campus Proximity (~1.5 km)',
      'Apartment & 3-Bedroom Suite Layouts',
      'Ideal for Alumni Sharing Blocks',
      '24/7 Power Support',
      'Secure Parking Area'
    ],
    mapQuery: 'Christine+Apartment+Hotel+Port+Harcourt',
    recommendedFor: 'Alumni groups desiring multi-room apartments and close campus proximity.',
    isNearby: true,
    isBudget: true,
    isLuxury: false
  },
  {
    id: 'servy-hotels',
    name: 'Servy Hotels',
    tier: 'Campus Proximity Executive Comfort',
    stars: 3,
    tag: 'Immediate Campus Proximity (~1.5 km)',
    address: 'Near RSU Campus, Nkpolu-Oroworukwo, Port Harcourt',
    distanceKm: 1.5,
    distanceFromRSU: '~1.5 km from RSU Campus',
    transitTime: 'Approx. 3–5 mins drive',
    startingRate: 45100,
    discountedRate: 'From ₦45,100 / night',
    standardRate: 'Up to ₦59,900 / night',
    savings: 'Online Discounted Tariff',
    phone: '+234 906 701 0941',
    secondaryPhone: '+234 911 206 7871',
    whatsapp: '+2349067010941',
    website: '',
    roomCategories: [
      { name: 'Deluxe Room (Online Rate)', rate: '₦45,100', amount: 45100 },
      { name: 'Executive Room (Online Rate)', rate: '₦59,900', amount: 59900 }
    ],
    amenities: [
      'Minutes Away from RSU Main Gates',
      'Modern Air-Conditioned Deluxe Rooms',
      'Executive Comfort Finishes',
      'Round-the-Clock Security Guard',
      'Reliable Power Supply'
    ],
    mapQuery: 'Servy+Hotels+Port+Harcourt',
    recommendedFor: 'Program speakers, planning committee officials, and visiting pairs.',
    isNearby: true,
    isBudget: false,
    isLuxury: false
  },
  {
    id: 'shabach-hotel',
    name: 'Shabach Hotel',
    tier: 'Economy Campus Proximity',
    stars: 3,
    tag: 'Economy Near Campus (~1.5 km)',
    address: 'Near RSU Campus, Port Harcourt Axis',
    distanceKm: 1.5,
    distanceFromRSU: '~1.5 km from RSU Campus',
    transitTime: 'Approx. 3–5 mins drive',
    startingRate: 11000,
    discountedRate: 'From ₦11,000 / night',
    standardRate: 'Up to ₦44,000 / night',
    savings: 'Affordable Rates from ₦11,000',
    phone: '+234 814 880 8800',
    secondaryPhone: '+234 700 880 8800',
    whatsapp: '+2348148808800',
    website: '',
    roomCategories: [
      { name: 'Royal Room (Cheapest)', rate: '₦11,000', amount: 11000 },
      { name: 'Single Room (Standard)', rate: '₦17,600', amount: 17600 },
      { name: 'Royal Room Highest Category', rate: '₦44,000', amount: 44000 }
    ],
    amenities: [
      'Proximity to University Campus (~1.5 km)',
      'Budget Royal & Single Rooms',
      'Air Conditioned Clean Accommodations',
      '24/7 Generator Power',
      'Convenient Check-In'
    ],
    mapQuery: 'Shabach+Hotel+Port+Harcourt',
    recommendedFor: 'Solo attendees, recent graduates, and budget travelers wanting fast campus access.',
    isNearby: true,
    isBudget: true,
    isLuxury: false
  }
];

export const TRAVEL_LOGISTICS_ADVISORY = {
  airport: {
    name: 'Port Harcourt International Airport (Omagwa - PHC)',
    distance: 'Approx. 32 km from RSU campus (35–45 mins via Airport Road & Port Harcourt Express).',
    protocol: 'The Central Planning Committee (CPC) Protocol Directorate will operate a dedicated Welcome Liaison Desk at the arrivals terminal on Friday, Nov 13, 2026.'
  },
  campusParking: {
    venue: 'RSU Main Campus, Nkpolu-Oroworukwo, Port Harcourt',
    security: 'Designated secure alumni parking zones near the RSU Chapel Pavilion and Amphitheatre with 24-hour campus security marshals and official event access stickers.'
  },
  hotline: {
    contactPerson: 'ENG. ELD JONATHAN DAVID JUNIOR (CPC Accommodation & Hospitality Coordinator)',
    phone: '+234 706 383 6336',
    email: 'Jonathandavidjunior@gmail.com'
  }
};
