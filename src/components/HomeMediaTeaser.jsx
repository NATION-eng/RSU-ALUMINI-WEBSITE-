import React from 'react';
import { Video, Play, Radio, UploadCloud, ArrowRight, Sparkles, BookOpen, Printer, ExternalLink, Tv } from 'lucide-react';

const YOUTUBE_LIVE_URL = 'https://www.youtube.com/live/2uRwL9Kblp4?si=bcfqiB7rGaL8a5rZ';

export default function HomeMediaTeaser({ onOpenMedia }) {
  const handleClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onOpenMedia) {
      onOpenMedia();
    } else {
      window.location.hash = 'media-hub';
    }
  };

  const handleCompendiumClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.location.hash = 'compendium';
  };

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative overflow-hidden border-y border-jubilee-gold/20">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-80 h-80 bg-jubilee-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#092B19] via-[#051A0F] to-[#0D3821] border border-jubilee-gold/40 shadow-luxury flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <a
                href={YOUTUBE_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white border border-red-400/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-pulse transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>🔴 Live Streaming on YouTube Now</span>
              </a>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                <span>Media Hub &amp; Archive</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-3xl font-retro font-bold text-white tracking-tight">
              Watch 45th Jubilee Live Stream &amp; 94-Page Compendium
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Experience the 45th Anniversary live from RSU Amphitheatre on <strong>YouTube Live</strong>, read, download and print the official <strong>94-Page Souvenir Compendium ("Rooted to Rise")</strong>, and preserve memories in the living fellowship archive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto flex-wrap justify-center">
            <a
              href={YOUTUBE_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-luxury hover:scale-105 active:scale-95 transition-all touch-manipulation"
            >
              <Play className="w-4 h-4 fill-white text-white shrink-0" />
              <span>Watch Live Stream</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="#compendium"
              onClick={handleCompendiumClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-md hover:scale-105 active:scale-95 transition-all touch-manipulation"
            >
              <BookOpen className="w-4 h-4 text-emerald-950 shrink-0" />
              <span>Print Compendium</span>
            </a>

            <a
              href="#media-hub"
              onClick={handleClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all touch-manipulation"
            >
              <Tv className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
              <span>Media Hub</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
