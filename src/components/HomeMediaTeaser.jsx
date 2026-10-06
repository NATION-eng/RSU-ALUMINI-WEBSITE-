import React from 'react';
import { Video, Play, Radio, UploadCloud, ArrowRight, Sparkles } from 'lucide-react';

export default function HomeMediaTeaser({ onOpenMedia }) {
  const handleClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onOpenMedia) {
      onOpenMedia();
    } else {
      window.location.hash = 'media-hub';
    }
  };

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative overflow-hidden border-y border-jubilee-gold/20">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-80 h-80 bg-jubilee-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#092B19] via-[#051A0F] to-[#0D3821] border border-jubilee-gold/40 shadow-luxury flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
              <span>Official Media, Broadcast &amp; Throwbacks</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-retro font-bold text-white tracking-tight">
              Media Hub &amp; Living Fellowship Archive
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Experience the 45th Anniversary in high definition: 4K bonded livestream broadcast, 45-year commemorative historical documentary, studio broadcast audio jingles, and community photo repository.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href="#media-hub"
              onClick={handleClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-105 active:scale-95 transition-all touch-manipulation"
            >
              <Play className="w-4 h-4 fill-emerald-950 text-emerald-950 shrink-0" />
              <span>Enter Media Hub &amp; Livestream</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
