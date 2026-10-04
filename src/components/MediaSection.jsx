import React, { useState } from 'react';
import { Video, Play, Volume2, Radio, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MediaSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <section id="media-hub" className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-900/80 text-jubilee-lightgold border border-emerald-700/60 text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-jubilee-gold animate-pulse" />
            <span>Official Media & Broadcast Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Live Feeds & Documentary Media
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Streaming Friday Vespers and Sabbath Communion live in high-definition to alumni across four continents.
          </p>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Main Livestream & Video Player Box */}
          <div className="lg:col-span-8 bg-stone-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
            <div className="relative aspect-video bg-emerald-950 flex items-center justify-center group overflow-hidden">
              
              {/* Background gradient & decorative art */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-emerald-950/70 to-black/40"></div>
              
              <div className="relative text-center p-6 z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-jubilee-gold/90 text-emerald-950 flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-8 h-8 ml-1 text-emerald-950 fill-current" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-extrabold uppercase tracking-widest mb-2 animate-pulse">
                  Broadcast Horizon • November 13–15, 2026
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Official 45th Anniversary Teaser Trailer
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto">
                  “45 Years of Faith at Rivers State University” — Featuring historical campus footage & pioneer testimonies.
                </p>
              </div>

              {/* Status footer bar inside video */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Bonded Multi-Camera Stream Ready</span>
                </div>
                <span>1080p Full HD</span>
              </div>
            </div>

            {/* Video metadata row */}
            <div className="p-6 bg-stone-900 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">
                  Institutional Courtesy Visit Coverage
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  ASF Alumni delegation visit to the Vice-Chancellor (VC), Deans & University Chaplaincy.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-jubilee-lightgold">
                Published across Campus Networks
              </span>
            </div>
          </div>

          {/* Right Column: Audio Jingle & Quick Media Links */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            
            {/* Audio Jingle Player Card */}
            <div className="bg-emerald-950/70 border border-jubilee-gold/30 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-jubilee-gold text-emerald-950">
                  <Volume2 className="w-5 h-5 text-emerald-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Official 45th Audio Jingle
                  </h4>
                  <p className="text-[11px] text-emerald-300">
                    30-Second Studio Broadcast Mix
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-5">
                Professionally produced studio theme announcement featuring background choir vocals, countdown announcements, and venue highlights.
              </p>

              {/* Interactive Player Controls */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-jubilee-gold text-emerald-950 text-xs font-bold hover:bg-amber-300 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPlayingAudio ? 'Pause Jingle' : 'Play Jingle'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-stone-400">0:30 Studio Cut</span>
                </div>

                {/* Animated Waveform Simulation */}
                <div className="flex items-center justify-between gap-1 h-8 px-1 pt-1">
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
            <div className="bg-stone-950 border border-white/10 rounded-3xl p-6">
              <div className="text-xs uppercase tracking-wider text-jubilee-gold font-bold mb-2">
                Behind The Scenes
              </div>
              <h4 className="text-base font-serif font-bold text-white mb-2">
                45-Voice Mass Choir Rehearsals
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Sopranos, altos, tenors, and basses across four decades preparing classical cantatas and sacred anthems for Sabbath worship.
              </p>
              <div className="text-xs font-semibold text-emerald-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Sacred Music Order coming soon in Phase 3</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
