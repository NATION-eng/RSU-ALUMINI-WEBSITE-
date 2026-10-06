import React, { useState } from 'react';
import { 
  Building2, MapPin, Clock, Phone, MessageSquare, ExternalLink, 
  Copy, Check, Star, ShieldCheck, Plane, Car, Sparkles, Tag, ChevronRight, Info
} from 'lucide-react';
import { PARTNER_HOTELS, PARTNER_DISCOUNT_CODE, TRAVEL_LOGISTICS_ADVISORY } from '../data/partnerHotels';

export default function PartnerHotelsSection() {
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
    <section id="where-to-stay" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-950 text-xs font-bold uppercase tracking-widest border border-emerald-900/15">
            <Building2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Homecoming Hospitality &amp; Lodging</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight">
            Where to Stay in Port Harcourt
          </h2>

          <p className="text-stone-600 text-xs sm:text-base font-light leading-relaxed px-2">
            To ensure a seamless, restful experience for physical delegates and diaspora alumni arriving for the 45th Jubilee, we have partnered with top-rated hotels offering verified security, proximity, and special conference tariffs.
          </p>
        </div>

        {/* Exclusive Delegate Discount Code Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#051A0F] via-[#092B19] to-[#0E3B23] text-white border-2 border-jubilee-gold/60 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-jubilee-gold/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 text-jubilee-lightgold text-xs font-mono font-bold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Negotiated Conference Booking Code</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
                Save Up to 20% on Your Hotel Stay
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-xl">
                Quote this official promo code when reserving directly via WhatsApp, telephone, or front-desk check-in at any partner hotel below.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-jubilee-gold/50 font-mono font-black text-jubilee-gold text-base sm:text-lg tracking-wider shadow-inner">
                {PARTNER_DISCOUNT_CODE}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-jubilee-gold hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all shadow-md active:scale-95 touch-manipulation"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-8 overflow-x-auto pb-2">
          {[
            { key: 'ALL', label: 'All Partner Hotels' },
            { key: '5STAR', label: '5-Star Luxury Host' },
            { key: 'GRA', label: 'Executive G.R.A.' },
            { key: 'CAMPUS', label: 'Closest to RSU Campus' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterCategory(tab.key)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
                filterCategory === tab.key
                  ? 'bg-emerald-950 text-white shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filteredHotels.map(hotel => {
            const encodedWaMessage = encodeURIComponent(
              `Hello ${hotel.name}! I am an alumnus attending the ASF RSU 45th Anniversary Jubilee Homecoming (Nov 13–15, 2026). I would like to reserve a room using the delegate conference promo code: ${PARTNER_DISCOUNT_CODE}.`
            );

            return (
              <div 
                key={hotel.id}
                className="bg-white rounded-3xl border border-stone-200/90 hover:border-jubilee-gold/60 shadow-luxury transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-2xl"
              >
                {/* Top Header Card */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Badge & Stars Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate">
                      {hotel.tag}
                    </span>

                    <div className="flex items-center space-x-0.5 shrink-0">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Title & Tier */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-retro font-bold text-emerald-950 group-hover:text-emerald-900 transition-colors leading-snug">
                      {hotel.name}
                    </h3>
                    <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                      {hotel.tier}
                    </p>
                  </div>

                  {/* Location & Transit Distance (Crucial for travel decision) */}
                  <div className="p-3 rounded-2xl bg-[#FAF7EE] border border-stone-200/60 space-y-2 text-xs">
                    <div className="flex items-start space-x-2 text-stone-700">
                      <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight font-medium">{hotel.address}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px] font-mono">
                      <span className="text-emerald-900 font-bold flex items-center space-x-1">
                        <Car className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{hotel.distanceFromRSU}</span>
                      </span>
                      <span className="text-amber-800 font-bold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{hotel.transitTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="border-t border-stone-100 pt-3">
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Special Delegate Rate</div>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className="text-xl sm:text-2xl font-retro font-black text-emerald-950">
                        {hotel.discountedRate}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        {hotel.standardRate}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-jubilee-gold" />
                      <span>{hotel.savings}</span>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Hotel Amenities:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {hotel.amenities.map((item, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[10px] font-medium"
                        >
                          • {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Note */}
                  <p className="text-[11px] text-stone-500 italic pt-1">
                    Ideal for: {hotel.recommendedFor}
                  </p>
                </div>

                {/* Bottom Action Buttons */}
                <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-stone-200/80 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedWaMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-sm transition-all touch-manipulation active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                    <span>Book via WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${hotel.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 transition-colors touch-manipulation active:scale-95 shrink-0"
                    title={`Call ${hotel.name}`}
                  >
                    <Phone className="w-4 h-4 text-emerald-900" />
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hotel.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 transition-colors touch-manipulation active:scale-95 shrink-0"
                    title="View Directions on Google Maps"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-900" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Travel & Ground Logistics Advisory Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white border border-stone-200 shadow-luxury space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-100 pb-4">
            <div className="p-2.5 rounded-2xl bg-emerald-900 text-jubilee-gold">
              <Plane className="w-5 h-5 text-jubilee-gold" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-retro font-bold text-emerald-950">
                Homecoming Travel &amp; Transit Protocol Advisory
              </h3>
              <p className="text-xs text-stone-500">
                Official information for interstate and diaspora delegates arriving in Port Harcourt.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-stone-700">
            {/* 1. Airport */}
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

            {/* 2. Campus Parking */}
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

            {/* 3. Protocol Hotline */}
            <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-1.5 shadow-sm">
              <div className="flex items-center space-x-1.5 font-bold text-jubilee-lightgold">
                <Info className="w-4 h-4 text-jubilee-gold" />
                <span>Hospitality &amp; Protocol Desk</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Contact: <strong>{TRAVEL_LOGISTICS_ADVISORY.hotline.contactPerson}</strong>
              </p>
              <div className="text-[11px] space-y-1 pt-1 font-mono text-emerald-200">
                <div>Phone: <a href={`tel:${TRAVEL_LOGISTICS_ADVISORY.hotline.phone}`} className="underline">{TRAVEL_LOGISTICS_ADVISORY.hotline.phone}</a></div>
                <div>Email: <a href="mailto:ekporjephta@gmail.com" className="underline">ekporjephta@gmail.com</a></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
