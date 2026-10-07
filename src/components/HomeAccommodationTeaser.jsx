import React from 'react';
import { Building2, Tag, Phone, Mail, MessageSquare, ArrowRight, Sparkles, MapPin, Check } from 'lucide-react';
import { PARTNER_DISCOUNT_CODE } from '../data/partnerHotels';

export default function HomeAccommodationTeaser({ onOpenAccommodation }) {
  const handleClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onOpenAccommodation) {
      onOpenAccommodation();
    } else {
      window.location.hash = 'accommodation';
    }
  };

  return (
    <section id="accommodation-preview" className="py-14 sm:py-20 px-3 xs:px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0D3821] text-white border-2 border-jubilee-gold/70 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-jubilee-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-4 max-w-2xl text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-jubilee-gold" />
                  <span>Homecoming Hospitality &amp; Lodging</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] font-mono">
                  <Tag className="w-3 h-3 text-jubilee-gold" />
                  <span>Promo Code: {PARTNER_DISCOUNT_CODE}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-retro font-bold text-white tracking-tight">
                Accommodation
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
                Enjoy negotiated delegate discounts (up to 20% off) across verified partner hotels including Hotel Presidential, Golden Tulip, Novotel, Swiss Spirit, Genesis Castle, and Mascot Suites near campus.
              </p>

              {/* Coordinator Chip */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-jubilee-gold font-mono tracking-wider">
                  Official Accommodation Coordinator:
                </div>
                <div className="text-sm sm:text-base font-bold font-retro text-white">
                  ENG. ELD JONATHAN DAVID JUNIOR
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-300 font-mono">
                  <a href="tel:+2347063836336" className="inline-flex items-center space-x-1 hover:text-jubilee-lightgold underline">
                    <Phone className="w-3 h-3 text-jubilee-gold" />
                    <span>+234 706 383 6336</span>
                  </a>
                  <span>•</span>
                  <a href="mailto:Jonathandavidjunior@gmail.com" className="inline-flex items-center space-x-1 hover:text-jubilee-lightgold underline">
                    <Mail className="w-3 h-3 text-jubilee-gold" />
                    <span>Jonathandavidjunior@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-[260px]">
              <a
                href="#accommodation"
                onClick={handleClick}
                className="inline-flex items-center justify-center space-x-2.5 px-7 py-4 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-105 active:scale-95 transition-all text-center touch-manipulation border border-amber-300"
              >
                <Building2 className="w-4 h-4 text-emerald-950 shrink-0" />
                <span>View All Partner Hotels</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/2347063836336?text=Hello%20Eng%20Jonathan%2C%20I%20am%20attending%20the%20ASF%20RSU%2045th%20Jubilee%20and%20need%20assistance%20with%20accommodation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md hover:scale-105 active:scale-95 transition-all text-center touch-manipulation"
              >
                <MessageSquare className="w-4 h-4 text-white fill-current shrink-0" />
                <span>Chat with Coordinator</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
