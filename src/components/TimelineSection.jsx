import React, { useState } from 'react';
import { ChevronRight, Compass, Music, Shield, Flame, X, ZoomIn } from 'lucide-react';

const ARCHIVAL_GALLERY = [
  { id: 1, src: '/heritage/heritage_01.jpg', title: 'Pioneer Altar Handshake & Presentation', era: 'PIONEER ERA' },
  { id: 2, src: '/heritage/heritage_02.jpg', title: 'Fellowship Award Presentation', era: 'RECOGNITION' },
  { id: 3, src: '/heritage/heritage_03.jpg', title: 'ASF Sacred Mass Choir in Formal Navy & Hats', era: 'CHOIR CANTATA' },
  { id: 4, src: '/heritage/heritage_04.jpg', title: 'Sisterhood Token Presentation', era: 'HONOR CEREMONY' },
  { id: 5, src: '/heritage/heritage_05.jpg', title: 'Fellowship Commendation Smiles', era: 'FELLOWSHIP TOKEN' },
  { id: 6, src: '/heritage/heritage_06.jpg', title: 'Campus Prayer & Unity in Fellowship', era: 'CAMPUS RETREAT' },
  { id: 7, src: '/heritage/heritage_07.jpg', title: 'Celebratory Headwraps & Fellowship Attire', era: 'SABBATH BEST' },
  { id: 8, src: '/heritage/heritage_08.jpg', title: 'Grand Staircase Native Attire Gathering', era: 'ROYAL SISTERHOOD' },
  { id: 9, src: '/heritage/heritage_09.jpg', title: 'NAAS UST Chapter 1998/99 Historic Congregation', era: '1998/99 CONGREGATION' },
  { id: 10, src: '/heritage/heritage_10.jpg', title: 'Hilltop Outreach & Nature Mission Retreat', era: 'MISSION OUTREACH' }
];

export default function TimelineSection() {
  const [activeEra, setActiveEra] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const eras = [
    {
      period: '1981 – 1990',
      watermark: '1981',
      title: 'The Pioneer Altar',
      subtitle: 'Genesis of Faith at RSUST',
      cohort: '1980s Pioneer Sets',
      icon: Compass,
      quote: '“They were few in number, but mighty in prayer. They built an altar where none existed.”',
      milestones: [
        'Courageous students start the first Sabbath fellowship on Rivers State University campus.',
        'Official university chapter recognition and inaugural graduating set commissioning.',
        'Foundation laid for a 45-year spiritual brotherhood that still stands today.'
      ]
    },
    {
      period: '1991 – 2000',
      watermark: '1991',
      title: 'Sacred Harmony & Outreach',
      subtitle: 'Rise of the ASF Mass Choir',
      cohort: '1990s Sets',
      icon: Music,
      quote: '“Sacred anthems echoed across lecture theaters, turning student hearts toward heaven.”',
      milestones: [
        'Birth of the renowned ASF Mass Choir and annual sacred music cantatas.',
        'Campus-wide evangelism and student welfare initiatives established.',
        'Rapid chapter expansion across engineering, science, and management faculties.'
      ]
    },
    {
      period: '2001 – 2015',
      watermark: '2001',
      title: 'Consolidation & Mentorship',
      subtitle: 'From Campus to Global Industry',
      cohort: '2000s–2010s Sets',
      icon: Shield,
      quote: '“Graduates stepping into corporate boardrooms and industry as ambassadors of the King.”',
      milestones: [
        'Pioneer alumni launch structured career and spiritual mentorship pipelines.',
        'Establishment of the annual alumni homecoming reunion tradition.',
        'Graduates take leadership in energy, medicine, tech, and public service.'
      ]
    },
    {
      period: '2016 – 2026',
      watermark: '2026',
      title: 'The Jubilee Horizon',
      subtitle: 'Rooted to Rise Across Nations',
      cohort: 'Jubilee Cohort & Diaspora',
      icon: Flame,
      quote: '“45 unbroken years of divine guidance. The same God who led our pioneers will ignite our future.”',
      milestones: [
        'Global Diaspora network uniting members across the UK, North America, and Europe.',
        'Permanent fellowship cloud archive and landmark 45th Jubilee Compendium.',
        'Passing the torch to current undergraduates to carry the flame forward.'
      ]
    }
  ];

  return (
    <section id="heritage" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-950 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-900/15">
            <span>45-Year Heritage Journey (1981–2026)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight mb-3">
            Honouring Four Decades
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed px-2">
            From humble Sabbath prayers in 1981 to a global family spanning continents in 2026.
          </p>
        </div>

        {/* Sleek Era Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {eras.map((era, index) => {
            const Icon = era.icon;
            const isSelected = activeEra === index;
            return (
              <button
                key={index}
                onClick={() => setActiveEra(index)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 touch-manipulation ${
                  isSelected
                    ? 'bg-emerald-950 text-white shadow-luxury scale-105 border border-jubilee-gold/50'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-800/40 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isSelected ? 'text-jubilee-gold' : 'text-stone-400'}`} />
                <span className="font-sans">{era.period}</span>
              </button>
            );
          })}
        </div>

        {/* Active Era Editorial Showcase Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-luxury overflow-hidden transition-all duration-500 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Column: Era Identity Plaque */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0E3B23] text-white p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              
              {/* Giant Vintage Watermark Year */}
              <div className="absolute -bottom-8 -right-6 font-retro text-9xl sm:text-[11rem] font-black text-white/[0.04] select-none pointer-events-none leading-none">
                {eras[activeEra].watermark}
              </div>

              <div className="relative z-10">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-jubilee-lightgold text-xs font-semibold tracking-wider uppercase mb-4 border border-white/15">
                  {eras[activeEra].cohort}
                </span>
                <div className="text-3xl sm:text-5xl font-retro font-black text-jubilee-gold mb-2 tracking-tight">
                  {eras[activeEra].period}
                </div>
                <h3 className="font-retro text-2xl sm:text-3xl font-bold leading-tight mb-2 text-white">
                  {eras[activeEra].title}
                </h3>
                <p className="text-emerald-200/90 font-editorial italic text-base sm:text-xl font-normal">
                  {eras[activeEra].subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                <blockquote className="font-editorial italic text-sm sm:text-lg text-emerald-100/90 leading-snug">
                  {eras[activeEra].quote}
                </blockquote>
              </div>
            </div>

            {/* Right Column: Refined Milestones */}
            <div className="lg:col-span-7 p-5 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-emerald-950 font-bold mb-4 sm:mb-6 font-sans flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-jubilee-darkgold"></span>
                  <span>Chapter Milestones</span>
                </h4>

                <div className="space-y-3 sm:space-y-4">
                  {eras[activeEra].milestones.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start space-x-3 sm:space-x-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-800/20 hover:bg-emerald-50/40 transition-all duration-300"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-950 text-jubilee-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-retro">
                        {idx + 1}
                      </span>
                      <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <span className="text-xs text-stone-500 font-light">
                  Were you part of this era?
                </span>
                <a
                  href="#census-rsvp"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-950 hover:text-emerald-800 group transition-colors"
                >
                  <span>Submit your memories</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Archival Photography Gallery: 10 Historic Square Moments */}
        <div className="mt-14 sm:mt-20 pt-10 sm:pt-14 border-t border-stone-200">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl font-retro font-bold text-emerald-950">
              Photographic Memories of Our Journey
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              From sacred altars and choir cantatas to youth retreats and chapter congregations. Click any square photo to view in high resolution.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-4">
            {ARCHIVAL_GALLERY.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-stone-300/80 hover:border-jubilee-gold shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-stone-900 touch-manipulation active:scale-[0.98]"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center filter contrast-110 saturate-105 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 text-white">
                  <span className="text-[8px] sm:text-[9px] font-mono text-jubilee-gold block leading-tight font-bold tracking-wider uppercase">
                    {item.era}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold line-clamp-1 leading-snug text-stone-100 mt-0.5">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Full View (Mobile Optimized) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="bg-[#051A0F] border border-jubilee-gold/40 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-white space-y-3 sm:space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold text-jubilee-gold uppercase tracking-wider block">
                  {selectedPhoto.era}
                </span>
                <h4 className="text-sm sm:text-lg font-retro font-bold text-white truncate">
                  {selectedPhoto.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors shrink-0 touch-manipulation"
                aria-label="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-square max-h-[55vh] sm:max-h-[65vh] w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner mx-auto">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover object-center filter contrast-115 saturate-110"
              />
            </div>

            <div className="text-center text-[11px] sm:text-xs text-stone-400 font-sans font-light pt-1">
              ASF Rivers State University 45th Anniversary Historical Archive (1981–2026)
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
