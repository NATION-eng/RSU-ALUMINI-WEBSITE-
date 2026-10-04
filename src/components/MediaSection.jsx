import React, { useState } from 'react';
import { Play, Volume2, Radio, X, Tv, Bell } from 'lucide-react';

export default function MediaSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section id="media-hub" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative vintage-texture">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest mb-3">
            <Radio className="w-3.5 h-3.5 text-jubilee-gold animate-pulse" />
            <span>Broadcast & Archival Feeds</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-white tracking-tight mb-3">
            Live Stream & Documentary
          </h2>
          <p className="text-emerald-100/75 text-sm sm:text-base font-light leading-relaxed">
            Connecting our worldwide alumni family in high-definition across four continents.
          </p>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          
          {/* Main Video Showcase */}
          <div 
            onClick={() => setShowVideoModal(true)}
            className="lg:col-span-8 bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-luxury flex flex-col justify-between group cursor-pointer hover:border-jubilee-gold/40 transition-all"
          >
            <div className="relative aspect-video bg-[#072013] flex items-center justify-center overflow-hidden">
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="relative text-center p-6 z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-jubilee-gold to-amber-300 text-emerald-950 flex items-center justify-center mx-auto mb-4 shadow-luxury group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 ml-1 text-emerald-950 fill-current" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/90 text-jubilee-lightgold text-[10px] font-bold uppercase tracking-widest mb-2 border border-jubilee-gold/30">
                  Broadcast Horizon • Nov 13–15, 2026
                </span>
                <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
                  45th Anniversary Teaser Trailer
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto font-light font-editorial italic text-base">
                  “45 Years of Faith at Rivers State University”
                </p>
              </div>

              {/* Status footer bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs text-stone-300 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Bonded Multi-Camera Stream Feed</span>
                </div>
                <span className="text-[11px] text-jubilee-gold font-mono">1080p HD</span>
              </div>
            </div>

            {/* Video metadata row */}
            <div className="p-5 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white font-sans">
                  Institutional Courtesy Visit Coverage
                </h4>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  ASF Alumni delegation visit to the Vice-Chancellor (VC) & University Chaplaincy.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-jubilee-lightgold shrink-0">
                Official Release
              </span>
            </div>
          </div>

          {/* Right Column: Audio Jingle & Choir Teaser */}
          <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
            
            {/* Audio Jingle Player Card */}
            <div className="luxury-glass rounded-3xl p-6 shadow-luxury">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 rounded-xl bg-jubilee-gold text-emerald-950">
                  <Volume2 className="w-4 h-4 text-emerald-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-sans">
                    Official 45th Audio Jingle
                  </h4>
                  <p className="text-[11px] text-emerald-300 font-light">
                    30-Second Studio Broadcast Mix
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                Produced radio announcement featuring choir harmonies and event highlights.
              </p>

              {/* Player Controls */}
              <div className="bg-black/40 rounded-2xl p-3.5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-jubilee-gold text-emerald-950 text-xs font-bold hover:bg-amber-300 transition-colors shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isPlayingAudio ? 'Pause' : 'Play Jingle'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-stone-400">0:30 Studio</span>
                </div>

                {/* Waveform */}
                <div className="flex items-center justify-between gap-1 h-6 px-1 pt-1">
                  {[40, 75, 50, 90, 30, 85, 60, 95, 45, 70, 80, 55, 90, 65, 40, 85, 50, 75, 60].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-jubilee-gold animate-pulse' : 'bg-stone-600'
                      }`}
                      style={{ height: `${isPlayingAudio ? Math.min(100, h * 1.1) : 25}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mass Choir Rehearsals Teaser */}
            <div className="luxury-glass rounded-3xl p-6 shadow-luxury">
              <span className="text-[10px] uppercase tracking-widest text-jubilee-gold font-bold block mb-1">
                Behind The Scenes
              </span>
              <h4 className="text-base font-retro font-bold text-white mb-1.5">
                Combined Mass Choir Cantata
              </h4>
              <p className="text-xs text-stone-300 font-light leading-relaxed mb-3">
                Choir alumni from four decades uniting voices for the grand Sabbath afternoon sacred concert.
              </p>
              <div className="text-[11px] font-semibold text-emerald-300 flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Rehearsals in progress</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Official Media & Broadcast Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#051A0F] border-2 border-jubilee-gold/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white text-center space-y-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-jubilee-gold/40 text-jubilee-gold flex items-center justify-center mx-auto shadow-luxury">
              <Tv className="w-8 h-8 text-jubilee-gold" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-jubilee-gold animate-pulse" />
              <span>Official 45th Live Broadcast Channel</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
              Live Stream & Documentary Center
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              The official multi-camera high-definition livestream will broadcast live from the RSU Amphitheatre starting <strong>Friday, November 13, 2026</strong>.
            </p>

            <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2 font-sans">
              <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                <Bell className="w-4 h-4 text-jubilee-gold shrink-0" />
                <span>Streaming Schedule (Port Harcourt Local Time):</span>
              </div>
              <ul className="text-stone-300 space-y-1 pl-6 list-disc text-[11px]">
                <li><strong>Nov 13 (6:00 PM):</strong> Opening Sunset Vespers</li>
                <li><strong>Nov 14 (8:30 AM):</strong> Grand Jubilee Sabbath Service & Roll Call</li>
                <li><strong>Nov 14 (4:00 PM):</strong> Combined 4-Decade Mass Choir Cantata</li>
                <li><strong>Nov 15 (10:00 AM):</strong> Alumni Legacy Banquet & Awards</li>
              </ul>
            </div>

            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
