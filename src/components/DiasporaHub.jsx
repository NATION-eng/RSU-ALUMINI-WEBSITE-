import React from 'react';
import { Globe, Heart, Shield, Video, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function DiasporaHub() {
  const diasporaHubs = [
    {
      region: 'United Kingdom & Europe',
      time: 'London (GMT)',
      members: '350+ Alumni',
      focus: 'Virtual Sabbath School & Fellowship Outreach'
    },
    {
      region: 'North America (USA & Canada)',
      time: 'New York (EST) / Texas (CST)',
      members: '500+ Alumni',
      focus: 'Student Scholarship Endowments & Tech Sponsorship'
    },
    {
      region: 'Middle East & Rest of World',
      time: 'Dubai (GST) / Asia',
      members: '120+ Alumni',
      focus: 'Diaspora Prayer Network & Homecoming Delegations'
    }
  ];

  return (
    <section id="diaspora" className="py-24 px-4 sm:px-6 lg:px-8 bg-emerald-950 text-white relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-700/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-jubilee-gold/20 text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5 text-jubilee-gold" />
            <span>Global Diaspora Fellowship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Uniting Our Alumni Across Continents
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            Whether you are walking the streets of London, Toronto, Houston, or Port Harcourt, distance cannot diminish our fellowship in Christ.
          </p>
        </div>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {diasporaHubs.map((hub, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-jubilee-gold/40 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-jubilee-gold flex items-center justify-center mb-4 border border-white/10">
                <Globe className="w-5 h-5 text-jubilee-gold" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-1">
                {hub.region}
              </h3>
              <div className="text-xs text-jubilee-lightgold font-mono font-medium mb-3">
                {hub.time} • {hub.members}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                {hub.focus}
              </p>
              <div className="text-[11px] text-emerald-300 font-semibold flex items-center space-x-1">
                <Video className="w-3 h-3 text-jubilee-gold" />
                <span>Dedicated HD Stream Room Available</span>
              </div>
            </div>
          ))}
        </div>

        {/* Diaspora Sponsorship & Prayer Callout */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-850 rounded-3xl p-8 sm:p-10 border border-jubilee-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-2xl">
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
              Join the Diaspora Monthly Virtual Prayer & Planning Session
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Connect with fellow overseas alumni as we lift up the 45th Anniversary Celebration, our Alma Mater, and current campus undergraduates in continuous prayer.
            </p>
          </div>

          <a
            href="#census-rsvp"
            className="shrink-0 inline-flex items-center space-x-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-jubilee-gold text-emerald-950 hover:bg-amber-300 shadow-xl transition-all hover:scale-105"
          >
            <span>Register as Diaspora Delegate</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
