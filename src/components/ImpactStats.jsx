import React from 'react';
import { Award, Users, Globe, BookOpen } from 'lucide-react';

export default function ImpactStats() {
  const stats = [
    {
      num: '45',
      unit: 'Years',
      title: 'Divine Faithfulness',
      desc: 'Founded 1981 at RSU'
    },
    {
      num: '4',
      unit: 'Cohorts',
      title: 'Pioneers to Jubilee',
      desc: '1981–2026 Graduating Sets'
    },
    {
      num: '25+',
      unit: 'Nations',
      title: 'Global Diaspora',
      desc: 'UK, USA, Canada & beyond'
    },
    {
      num: '1',
      unit: 'Family',
      title: 'United in Christ',
      desc: 'One Unbroken Heritage'
    },
  ];

  return (
    <section className="relative z-20 -mt-12 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-luxury border border-stone-200/90 p-6 sm:p-8 backdrop-blur-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`group flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 ${
                idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''
              }`}
            >
              <div className="flex items-baseline space-x-1.5 mb-1">
                <span className="font-retro text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 group-hover:text-emerald-800 transition-colors">
                  {stat.num}
                </span>
                <span className="font-editorial italic text-base sm:text-lg text-jubilee-darkgold font-semibold">
                  {stat.unit}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-stone-900 font-sans tracking-tight">
                {stat.title}
              </div>
              <div className="text-[11px] text-stone-500 font-light mt-0.5">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
