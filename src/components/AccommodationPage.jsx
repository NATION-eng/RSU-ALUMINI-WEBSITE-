import React, { useState } from 'react';
import { 
  Building2, MapPin, Clock, Phone, MessageSquare, ExternalLink, 
  Copy, Check, Star, ShieldCheck, Plane, Car, Sparkles, Tag, 
  ChevronRight, Info, ArrowLeft, Mail, UserCheck
} from 'lucide-react';
import { PARTNER_HOTELS, PARTNER_DISCOUNT_CODE, TRAVEL_LOGISTICS_ADVISORY } from '../data/partnerHotels';
import Footer from './Footer';

export default function AccommodationPage({ onBackToSite, onOpenAdmin, onOpenSponsors }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PARTNER_DISCOUNT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredHotels = PARTNER_HOTELS.filter(hotel => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === '5STAR') return hotel.stars === 5;
    if (filterCategory === 'GRA') return hotel.address.toLowerCase().includes('g.r.a') || hotel.stars === 4;
    if (filterCategory === 'CAMPUS') return hotel.id === 'campus-edge-suites';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141E18] font-sans antialiased selection:bg-emerald-900 selection:text-amber-200">
      
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-[#051A0F]/95 backdrop-blur-md border-b border-jubilee-gold/30 text-white py-2.5 sm:py-3.5 px-3 sm:px-6 shadow-luxury">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={onBackToSite || (() => { window.location.hash = ''; })}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-jubilee-lightgold text-xs sm:text-sm font-semibold transition-all shrink-0 touch-manipulation active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-jubilee-gold" />
              <span className="hidden xs:inline">Back to Jubilee Home</span>
              <span className="xs:hidden">Back</span>
            </button>
            <span className="hidden lg:inline-block text-xs text-stone-500">|</span>
            <div className="hidden lg:flex items-center space-x-2 truncate">
              <img src="/official-logo.png" alt="ASF Logo" className="w-5 h-5 object-contain shrink-0" />
              <span className="text-xs font-retro text-stone-300 truncate">
                ASF RSU 45th Anniversary Homecoming
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="#census-rsvp"
              onClick={() => { window.location.hash = 'census-rsvp'; }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all active:scale-95 touch-manipulation"
            >
              <UserCheck className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
              <span>RSVP</span>
            </a>
            <a
              href="#donate"
              onClick={() => { window.location.hash = 'donate'; }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-jubilee-gold to-amber-400 text-emerald-950 transition-all active:scale-95 touch-manipulation"
            >
              <span>Donate</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051A0F] via-[#082817] to-[#0D3821] text-white pt-8 sm:pt-14 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/[0.07] border border-jubilee-gold/40 text-jubilee-lightgold text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
            <span>Homecoming Hospitality &amp; Lodging Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-retro font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-amber-200 to-yellow-400 bg-clip-text text-transparent">
            ACCOMMODATION
          </h1>

          <p className="max-w-3xl mx-auto text-xs sm:text-base text-emerald-100/90 font-light leading-relaxed px-2">
            Ensuring a restful, seamless stay for physical delegates and diaspora alumni arriving for the 45th Jubilee. We have negotiated exclusive conference rates and dedicated protocol support across verified partner hotels.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
        {/* OFFICIAL COORDINATOR CONTACT CARD (Requirement 1 Focus) */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0D3821] text-white border-2 border-jubilee-gold/80 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-jubilee-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Central Planning Committee Hospitality Directorate</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-retro font-bold text-white tracking-tight">
                Official Accommodation Coordinator
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Need guidance selecting a partner hotel, booking set room blocks, arranging early check-in, or coordinating airport arrival shuttles? Contact the official CPC Accommodation Coordinator directly:
              </p>

              {/* Coordinator Bio Box */}
              <div className="pt-2">
                <div className="text-base sm:text-xl font-bold font-retro text-jubilee-gold tracking-wide">
                  ENG. ELD JONATHAN DAVID JUNIOR
                </div>
                <div className="text-xs text-stone-300 font-sans mt-0.5">
                  Coordinator, Accommodation &amp; Homecoming Hospitality
                </div>
              </div>
            </div>

            {/* Direct Contact Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-[280px]">
              {/* Clickable Phone Number */}
              <a
                href="tel:+2347063836336"
                className="inline-flex items-center justify-center space-x-2.5 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-jubilee-gold/50 text-white font-mono font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation hover:border-jubilee-gold"
                title="Call Eng. Eld Jonathan David Junior directly"
              >
                <Phone className="w-4 h-4 text-jubilee-gold shrink-0" />
                <span>+234 706 383 6336</span>
              </a>

              {/* Direct WhatsApp Liaison */}
              <a
                href="https://wa.me/2347063836336?text=Hello%20Eng.%20Jonathan%2C%20I%20am%20attending%20the%20ASF%20RSU%2045th%20Anniversary%20Jubilee%20and%20require%20assistance%20with%20accommodation%20booking."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition-all active:scale-95 touch-manipulation"
              >
                <MessageSquare className="w-4 h-4 text-white shrink-0 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Clickable Email */}
              <a
                href="mailto:Jonathandavidjunior@gmail.com?subject=ASF%20RSU%2045th%20Jubilee%20Accommodation%20Inquiry"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-jubilee-lightgold font-sans text-xs sm:text-sm font-semibold transition-all active:scale-95 touch-manipulation"
                title="Email Eng. Eld Jonathan David Junior"
              >
                <Mail className="w-4 h-4 text-jubilee-gold shrink-0" />
                <span className="truncate">Jonathandavidjunior@gmail.com</span>
              </a>
            </div>
          </div>
        </section>

        {/* Exclusive Delegate Discount Code Banner */}
        <section className="p-4 xs:p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#051A0F] via-[#092B19] to-[#0E3B23] text-white border-2 border-jubilee-gold/60 shadow-luxury relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 relative z-10 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 text-jubilee-lightgold text-xs font-mono font-bold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Negotiated Conference Booking Code</span>
              </div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-retro font-bold text-white">
                Save Up to 20% on Your Hotel Stay
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-xl">
                Quote this official promo code when reserving directly with the hotels or contacting the Accommodation Desk.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 shrink-0 w-full md:w-auto">
              <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-black/60 border border-jubilee-gold/50 font-mono font-black text-jubilee-gold text-sm sm:text-lg tracking-wider shadow-inner">
                {PARTNER_DISCOUNT_CODE}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-jubilee-gold hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all shadow-md active:scale-95 touch-manipulation"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter Category Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-retro font-bold text-emerald-950">
              Verified Partner Hotels Directory
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              Showing {filteredHotels.length} of {PARTNER_HOTELS.length} Hotels
            </span>
          </div>

          <div className="flex items-center justify-start space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {[
              { key: 'ALL', label: 'All Partner Hotels' },
              { key: '5STAR', label: '5-Star Luxury Host' },
              { key: 'GRA', label: 'Executive G.R.A.' },
              { key: 'CAMPUS', label: 'Closest to RSU Campus' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterCategory(tab.key)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation shrink-0 ${
                  filterCategory === tab.key
                    ? 'bg-emerald-950 text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map(hotel => {
            const encodedWaMessage = encodeURIComponent(
              `Hello! I am an alumnus attending the ASF RSU 45th Anniversary Jubilee Homecoming (Nov 13–15, 2026). I would like to reserve a room at ${hotel.name} with delegate promo code: ${PARTNER_DISCOUNT_CODE}.`
            );

            return (
              <div 
                key={hotel.id}
                className="bg-white rounded-3xl border border-stone-200/90 hover:border-jubilee-gold/60 shadow-luxury transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-2xl"
              >
                {/* Top Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate">
                      {hotel.tag}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      {[...Array(hotel.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg sm:text-xl font-retro font-bold text-emerald-950 group-hover:text-emerald-900 transition-colors">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-amber-800 font-semibold mt-0.5">
                      {hotel.tier}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span className="truncate">{hotel.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                      <span>{hotel.distanceFromRSU} • {hotel.transitTime}</span>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="p-3.5 rounded-2xl bg-[#051A0F] text-white border border-jubilee-gold/30 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-300">
                      <span>Standard Rate:</span>
                      <span className="line-through text-stone-400">{hotel.standardRate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-jubilee-lightgold">Jubilee Delegate:</span>
                      <span className="text-base sm:text-lg font-retro font-black text-jubilee-gold">
                        {hotel.discountedRate}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono text-right">
                      {hotel.savings}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-stone-700 block uppercase tracking-wider">
                      Hotel Amenities:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {hotel.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="text-[11px] leading-tight">{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {hotel.recommendedFor && (
                    <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-100">
                      <strong>Best for:</strong> {hotel.recommendedFor}
                    </p>
                  )}
                </div>

                {/* Bottom Booking CTAs */}
                <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Hotel Direct Liaison or Coordinator */}
                    <a
                      href={`https://wa.me/2347063836336?text=${encodedWaMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-emerald-950 text-white hover:bg-emerald-900 font-bold text-xs transition-all active:scale-95 touch-manipulation text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                      <span>Reserve via Desk</span>
                    </a>

                    <a
                      href={`tel:+2347063836336`}
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 font-bold text-xs transition-all active:scale-95 touch-manipulation text-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span>Call Coordinator</span>
                    </a>
                  </div>

                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-1 text-[11px] font-semibold text-emerald-900 hover:text-emerald-700 transition-colors pt-1"
                    >
                      <span>Visit Hotel Official Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Travel & Transit Protocol Advisory */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-luxury space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-100 pb-4">
            <Car className="w-6 h-6 text-emerald-800 shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-retro font-bold text-emerald-950">
                Homecoming Travel &amp; Transit Protocol Advisory
              </h3>
              <p className="text-xs text-stone-500">
                Official guidelines for interstate and diaspora delegates arriving in Port Harcourt.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-stone-700">
            {/* Airport */}
            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-stone-200/80 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-950">
                <Plane className="w-4 h-4 text-emerald-800" />
                <span>Airport Arrivals (PHC Omagwa)</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {TRAVEL_LOGISTICS_ADVISORY.airport.distance}
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                {TRAVEL_LOGISTICS_ADVISORY.airport.protocol}
              </p>
            </div>

            {/* Campus Parking */}
            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-stone-200/80 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Campus Parking &amp; Security</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Venue: <strong>{TRAVEL_LOGISTICS_ADVISORY.campusParking.venue}</strong>
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {TRAVEL_LOGISTICS_ADVISORY.campusParking.security}
              </p>
            </div>

            {/* Coordinator Hotline */}
            <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2 shadow-sm">
              <div className="flex items-center space-x-1.5 font-bold text-jubilee-lightgold">
                <Info className="w-4 h-4 text-jubilee-gold" />
                <span>Accommodation &amp; Protocol Desk</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Coordinator: <strong>ENG. ELD JONATHAN DAVID JUNIOR</strong>
              </p>
              <div className="text-[11px] space-y-1 pt-1 font-mono text-emerald-200">
                <div>
                  Phone: <a href="tel:+2347063836336" className="underline hover:text-white">+234 706 383 6336</a>
                </div>
                <div>
                  Email: <a href="mailto:Jonathandavidjunior@gmail.com" className="underline hover:text-white">Jonathandavidjunior@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Grand Footer */}
      <Footer onOpenAdmin={onOpenAdmin} onOpenSponsors={onOpenSponsors} />

    </div>
  );
}
