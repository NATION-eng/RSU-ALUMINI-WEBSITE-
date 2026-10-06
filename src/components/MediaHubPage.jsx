import React from 'react';
import { ArrowLeft, UserCheck, HeartHandshake, Video } from 'lucide-react';
import MediaSection from './MediaSection';
import Footer from './Footer';

export default function MediaHubPage({ onBackToSite, onOpenAdmin, onOpenSponsors }) {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141E18] font-sans antialiased selection:bg-emerald-900 selection:text-amber-200">
      
      {/* Top Banner Navigation */}
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
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-950" />
              <span>Donate</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Media Section */}
      <MediaSection />

      {/* Grand Footer */}
      <Footer onOpenAdmin={onOpenAdmin} onOpenSponsors={onOpenSponsors} />

    </div>
  );
}
