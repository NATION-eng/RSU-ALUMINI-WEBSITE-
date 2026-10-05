// ASF RSU 45th Anniversary Souvenir Compendium: Ad Placement Specifications & Rates

export const COMPENDIUM_AD_TIERS = {
  ad_back_cover: {
    key: 'ad_back_cover',
    name: 'Outside Back Cover (Premium Gloss)',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    rate: 500000,
    specs: 'A4 Full Bleed, 300 DPI CMYK, High-Gloss Laminated Outer Cover',
    description: 'The premier back cover spot seen by all readers and VIP delegates worldwide.',
    badge: 'Exclusive 1 Slot Only'
  },
  ad_inside_front: {
    key: 'ad_inside_front',
    name: 'Inside Front Cover (Prime Spread)',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    rate: 350000,
    specs: 'A4 Full Bleed, 300 DPI CMYK, Inside Front Facing Opening Page',
    description: 'The highest-visibility inner page immediately facing the President & VC Welcome addresses.',
    badge: 'Prime Placement'
  },
  ad_inside_back: {
    key: 'ad_inside_back',
    name: 'Inside Back Cover (Feature Display)',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    rate: 300000,
    specs: 'A4 Full Bleed, 300 DPI CMYK, Inside Back Facing Closing Page',
    description: 'Prominent closing position with guaranteed maximum visibility for alumni and corporate features.',
    badge: 'High Visibility'
  },
  ad_center_spread: {
    key: 'ad_center_spread',
    name: 'Center Spread (Double Page Feature)',
    dimensions: '420mm × 297mm (+3mm bleed)',
    aspectRatio: 'Double A4 Landscape',
    rate: 400000,
    specs: 'Double A4 Panoramic Spread, 300 DPI CMYK, Center Fold Binding',
    description: 'Panoramic two-page horizontal layout for major corporate partners and large alumni cohorts.',
    badge: 'Panoramic Spread'
  },
  ad_full: {
    key: 'ad_full',
    name: 'Full Page Color Editorial (A4)',
    dimensions: '210mm × 297mm (+3mm bleed)',
    aspectRatio: 'A4 Portrait',
    rate: 150000,
    specs: '210mm × 297mm, 300 DPI CMYK High-Res Layout',
    description: 'Standard single full-page color feature for corporate brands, alumni sets, or family tributes.',
    badge: 'Top Seller'
  },
  ad_half: {
    key: 'ad_half',
    name: 'Half Page Standard Display',
    dimensions: '210mm × 148mm (+3mm bleed)',
    aspectRatio: 'Half A4 Landscape',
    rate: 75000,
    specs: '210mm × 148mm, 300 DPI CMYK High-Res Layout',
    description: 'Half-page display ad for medium-scale businesses, professional practices, or group shout-outs.',
    badge: 'Popular Choice'
  },
  ad_quarter: {
    key: 'ad_quarter',
    name: 'Quarter Page Compact Advert',
    dimensions: '105mm × 148mm',
    aspectRatio: 'Quarter A4 Portrait',
    rate: 40000,
    specs: '105mm × 148mm, 300 DPI CMYK High-Res Layout',
    description: 'Compact quarter-page slot for individual business card listings and personal congratulatory notes.',
    badge: 'Entry Slot'
  }
};

export const AD_EDITORIAL_STATUSES = [
  { key: 'RECEIVED', label: 'Received', color: 'bg-amber-950/60 text-amber-300 border-amber-700/50' },
  { key: 'IN_REVIEW', label: 'In Design / Review', color: 'bg-sky-950/60 text-sky-300 border-sky-700/50' },
  { key: 'PROOF_READY', label: 'Proof Ready', color: 'bg-purple-950/60 text-purple-300 border-purple-700/50' },
  { key: 'APPROVED_FOR_PRINT', label: 'Approved for Print', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' },
  { key: 'PRINTED', label: 'Published / Printed', color: 'bg-teal-950/60 text-teal-300 border-teal-700/50' }
];
