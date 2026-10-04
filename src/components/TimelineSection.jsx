import React, { useState } from 'react';
import { Clock, Shield, Sparkles, BookOpen, ChevronRight, Award, Compass, Music, Flame } from 'lucide-react';

export default function TimelineSection() {
  const [activeEra, setActiveEra] = useState(0);

  const eras = [
    {
      id: 'pioneers',
      period: '1981 – 1990',
      title: 'The Pioneer Altar & Campus Genesis',
      subtitle: 'Planting Seeds of Faith at RSUST',
      theme: 'Pioneer Cohort',
      icon: Compass,
      highlights: [
        'Small gathering of courageous Adventist students begin Sabbath fellowship on campus.',
        'Initial official chapter recognition under university chaplaincy.',
        'First generation of engineering, agricultural, and science graduates commissioned for mission.',
        'Establishment of the fundamental fellowship traditions and Sabbath worship protocols.'
      ],
      quote: '“They were few in number, but mighty in prayer. They carved an altar where none existed.”',
      heritageBadge: '1980s Sets (The Foundation)'
    },
    {
      id: 'growth',
      period: '1991 – 2000',
      title: 'Spiritual Expansion & Sanctuary',
      subtitle: 'The Rise of the ASF Mass Choir & Outreach',
      theme: 'Consolidation Era',
      icon: Music,
      highlights: [
        'Growth of chapter membership across emerging faculties and departments.',
        'Establishment of the iconic ASF Mass Choir with annual sacred music cantatas.',
        'Campus-wide evangelistic efforts and student hospital/prison outreach programs.',
        'First structured alumni networking and student welfare loan fund initiative.'
      ],
      quote: '“Melodies of sacred music echoed through the lecture halls, turning hearts to the Creator.”',
      heritageBadge: '1990s Sets (The Harmonizers)'
    },
    {
      id: 'consolidation',
      period: '2001 – 2015',
      title: 'Professional Mentorship & Network',
      subtitle: 'Bridging Campus Life and Global Industry',
      theme: 'Millennial Era',
      icon: Shield,
      highlights: [
        'Alumni sets establish formal mentorship pipelines for graduating students in Port Harcourt.',
        'Fellowship expands digital footprint with SMS broadcasts and student study centers.',
        'Annual alumni homecomings emerge as a pillar tradition connecting generations.',
        'Pioneer members take senior leadership roles in academia, oil & gas, government, and medicine.'
      ],
      quote: '“Our graduates stepped into society not just as professionals, but as ambassadors of the King.”',
      heritageBadge: '2000s–2010s Sets (The Builders)'
    },
    {
      id: 'jubilee',
      period: '2016 – 2026',
      title: 'Digital Transformation & 45th Jubilee',
      subtitle: 'Rooted to Rise — Honouring Our Heritage, Igniting Our Future',
      theme: 'Jubilee Horizon',
      icon: Flame,
      highlights: [
        'Creation of the global Diaspora network spanning the UK, North America, and Europe.',
        'Launch of the Permanent Cloud Archive & Digital Fellowship Web Portal with Adventists in Tech.',
        'Publication of the landmark 45th Jubilee Alumni Magazine & Compendium (1981–2026).',
        'Unveiling of the 45th Anniversary Legacy Project to support future RSU Adventist students.'
      ],
      quote: '“45 years of unbroken divine guidance. The same God who led our pioneers will ignite our future.”',
      heritageBadge: '2020s Sets & Diaspora (The Future)'
    }
  ];

  return (
    <section id="heritage" className="py-24 px-4 sm:px-6 lg:px-8 bg-jubilee-cream text-stone-900 relative">
      
      {/* Subtle background decoration */}
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-emerald-800" />
            <span>45-Year Milestone Journey (1981 – 2026)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-emerald-950 tracking-tight mb-4">
            Honouring Four Decades of Grace
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            From humble Sabbath prayers in 1981 to a global family spanning continents in 2026. Explore the foundational eras that shaped the Adventist Students’ Fellowship at Rivers State University.
          </p>
        </div>

        {/* Era Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {eras.map((era, index) => {
            const Icon = era.icon;
            const isSelected = activeEra === index;
            return (
              <button
                key={era.id}
                onClick={() => setActiveEra(index)}
                className={`flex items-center space-x-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/20 scale-105'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-jubilee-gold' : 'text-stone-400'}`} />
                <span>{era.period}</span>
              </button>
            );
          })}
        </div>

        {/* Active Era Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Era Badge & Story Header */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-850 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-60 h-60 bg-jubilee-gold/10 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-jubilee-lightgold text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
                  {eras[activeEra].heritageBadge}
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-jubilee-gold mb-2">
                  {eras[activeEra].period}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-3">
                  {eras[activeEra].title}
                </h3>
                <p className="text-emerald-200/90 text-sm font-medium">
                  {eras[activeEra].subtitle}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15">
                <blockquote className="font-serif italic text-sm text-emerald-100/90 leading-relaxed">
                  {eras[activeEra].quote}
                </blockquote>
              </div>
            </div>

            {/* Right Column: Historical Highlights & Milestone Bulletins */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-emerald-800 font-bold mb-6 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-jubilee-darkgold" />
                  <span>Era Milestones & Significant Moments</span>
                </h4>

                <div className="space-y-4">
                  {eras[activeEra].highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-100 hover:bg-emerald-50/60 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-emerald-800 text-jubilee-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-stone-700 text-sm leading-relaxed">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action for this era */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  Are you an alumnus of the <span className="font-bold text-stone-800">{eras[activeEra].period}</span> sets?
                </div>
                <a
                  href="#census-rsvp"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-900 hover:text-emerald-700 group"
                >
                  <span>Submit your memory for the Compendium</span>
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
