import React from 'react';
import { Award, Users, Globe, BookOpen } from 'lucide-react';

export default function ImpactStats() {
  const stats = [
    {
      icon: Award,
      value: '45 Years',
      label: 'Of Divine Guidance',
      subtext: 'Founded in 1981 at Rivers State University'
    },
    {
      icon: Users,
      value: '4 Cohorts',
      label: 'Pioneers to Contemporary',
      subtext: '1981–1999, 2000–2025, Diaspora & Undergrads'
    },
    {
      icon: Globe,
      value: '25+ Countries',
      label: 'Global Diaspora Network',
      subtext: 'UK, USA, Canada, Europe, Middle East & beyond'
    },
    {
      icon: BookOpen,
      value: '1 Landmark',
      label: '45th Jubilee Compendium',
      subtext: 'Permanent archival history of ASF RSU'
    },
  ];

  return (
    <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`flex items-start space-x-4 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-4' : ''}`}>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 shrink-0">
                <Icon className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-800 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                  {stat.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
