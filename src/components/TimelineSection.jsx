import React, { useState } from 'react';
import { Sparkles, ChevronRight, Compass, Music, Shield, Flame } from 'lucide-react';

export default function TimelineSection() {
  const [activeEra, setActiveEra] = useState(0);

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
    <section id="heritage" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-950 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-900/15">
            <Sparkles className="w-3.5 h-3.5 text-jubilee-darkgold" />
            <span>45-Year Heritage Journey (1981–2026)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight mb-3">
            Honouring Four Decades
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            From humble Sabbath prayers in 1981 to a global family spanning continents in 2026.
          </p>
        </div>

        {/* Sleek Era Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12">
          {eras.map((era, index) => {
            const Icon = era.icon;
            const isSelected = activeEra === index;
            return (
              <button
                key={index}
                onClick={() => setActiveEra(index)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isSelected
                    ? 'bg-emerald-950 text-white shadow-luxury scale-105 border border-jubilee-gold/50'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-800/40 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-jubilee-gold' : 'text-stone-400'}`} />
                <span className="font-sans">{era.period}</span>
              </button>
            );
          })}
        </div>

        {/* Active Era Editorial Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-luxury overflow-hidden transition-all duration-500 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Column: Era Identity Plaque */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0E3B23] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              
              {/* Giant Vintage Watermark Year */}
              <div className="absolute -bottom-8 -right-6 font-retro text-9xl sm:text-[11rem] font-black text-white/[0.04] select-none pointer-events-none leading-none">
                {eras[activeEra].watermark}
              </div>

              <div className="relative z-10">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-jubilee-lightgold text-xs font-semibold tracking-wider uppercase mb-4 border border-white/15">
                  {eras[activeEra].cohort}
                </span>
                <div className="text-4xl sm:text-5xl font-retro font-black text-jubilee-gold mb-2 tracking-tight">
                  {eras[activeEra].period}
                </div>
                <h3 className="font-retro text-2xl sm:text-3xl font-bold leading-tight mb-2 text-white">
                  {eras[activeEra].title}
                </h3>
                <p className="text-emerald-200/90 font-editorial italic text-lg sm:text-xl font-normal">
                  {eras[activeEra].subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                <blockquote className="font-editorial italic text-base sm:text-lg text-emerald-100/90 leading-snug">
                  {eras[activeEra].quote}
                </blockquote>
              </div>
            </div>

            {/* Right Column: Refined Milestones */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-emerald-950 font-bold mb-6 font-sans flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-jubilee-darkgold"></span>
                  <span>Chapter Milestones</span>
                </h4>

                <div className="space-y-4">
                  {eras[activeEra].milestones.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start space-x-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-800/20 hover:bg-emerald-50/40 transition-all duration-300"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-950 text-jubilee-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-retro">
                        {idx + 1}
                      </span>
                      <p className="text-stone-700 text-sm leading-relaxed font-sans font-normal">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
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

      </div>
    </section>
  );
}
