import React from 'react';
import { Globe, Video, ArrowRight } from 'lucide-react';

export default function DiasporaHub() {
  const diasporaHubs = [
    {
      region: 'United Kingdom & Europe',
      time: 'London (GMT)',
      members: '350+ Alumni',
      focus: 'Virtual Sabbath School & Regional Fellowships'
    },
    {
      region: 'North America (USA & Canada)',
      time: 'New York (EST) / Texas (CST)',
      members: '500+ Alumni',
      focus: 'Student Scholarship Endowments & Mentorship'
    },
    {
      region: 'Middle East & Rest of World',
      time: 'Dubai (GST) / Asia',
      members: '120+ Alumni',
      focus: 'Diaspora Prayer Network & Homecoming Delegations'
    }
  ];

  return (
    <section id="diaspora" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative overflow-hidden vintage-texture">
      <div className="relative max-w-6xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest mb-3">
            <Globe className="w-3.5 h-3.5 text-jubilee-gold" />
            <span>Global Fellowship Hubs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-white tracking-tight mb-3">
            Our Worldwide Family
          </h2>
          <p className="text-emerald-100/75 text-sm sm:text-base font-light leading-relaxed">
            Distance cannot diminish our fellowship in Christ. Uniting members across timezones for the 45th Jubilee.
          </p>
        </div>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {diasporaHubs.map((hub, idx) => (
            <div
              key={idx}
              className="luxury-glass rounded-3xl p-6 shadow-luxury hover:border-jubilee-gold/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-black/40 text-jubilee-gold flex items-center justify-center mb-4 border border-white/10">
                  <Globe className="w-5 h-5 text-jubilee-gold" />
                </div>
                <h3 className="text-lg font-retro font-bold text-white mb-1">
                  {hub.region}
                </h3>
                <div className="text-xs text-jubilee-lightgold font-mono font-medium mb-3">
                  {hub.time} • {hub.members}
                </div>
                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  {hub.focus}
                </p>
              </div>

              <div className="text-[11px] text-emerald-300 font-medium flex items-center space-x-1.5 pt-3 border-t border-white/10">
                <Video className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>HD Stream Room Available</span>
              </div>
            </div>
          ))}
        </div>

        {/* Diaspora Prayer Callout Banner */}
        <div className="luxury-glass rounded-3xl p-7 sm:p-9 border border-jubilee-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
          <div className="max-w-xl">
            <h4 className="text-xl sm:text-2xl font-retro font-bold text-white mb-1.5">
              Diaspora Monthly Virtual Prayer & Planning
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Connect overseas as we lift up the 45th Anniversary, our Alma Mater, and student undergraduates.
            </p>
          </div>

          <a
            href="#census-rsvp"
            className="shrink-0 inline-flex items-center space-x-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 hover:shadow-gold-glow transition-all hover:scale-105"
          >
            <span>Register as Diaspora Delegate</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
