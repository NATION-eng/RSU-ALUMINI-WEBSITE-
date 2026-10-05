import React, { useState } from 'react';
import { Globe, Video, Clock, MessageSquare, HeartHandshake, ArrowRight, CheckCircle2, Tv, UploadCloud } from 'lucide-react';
import VideoUploadModal from './VideoUploadModal';

export default function DiasporaHub({ onOpenSponsors }) {
  const [activeZone, setActiveZone] = useState('WAT');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const timezoneSchedule = [
    { city: 'Port Harcourt (WAT)', region: 'Local Host Venue', time: '08:30 AM', note: 'Campus Sanctuary Live' },
    { city: 'London (GMT)', region: 'UK & Europe', time: '07:30 AM', note: 'Live Morning Watch' },
    { city: 'New York (EST)', region: 'US & Canada East', time: '02:30 AM', note: 'Live Stream / 10:00 AM Replay' },
    { city: 'Houston (CST)', region: 'US Central', time: '01:30 AM', note: 'Live Stream / 09:00 AM Replay' },
    { city: 'Dubai (GST)', region: 'Middle East', time: '11:30 AM', note: 'Live Midday Service' },
    { city: 'Johannesburg (SAST)', region: 'Southern Africa', time: '09:30 AM', note: 'Live Morning Service' },
  ];

  const diasporaPillars = [
    {
      icon: Tv,
      title: 'Interactive Sanctuary Broadcast',
      tag: 'November 13–15, 2026',
      description: 'Multi-camera 1080p live transmission of all main events directly from Rivers State University.',
      details: [
        'Live Friday Opening Vespers & Praise',
        'Grand Sabbath School & Divine Worship',
        'Combined Mass Choir 45th Cantata',
        'Auditorium stage LED projection of overseas attendees'
      ]
    },
    {
      icon: MessageSquare,
      title: '30-Second Video Goodwill Messages',
      tag: 'Grand Gala Feature',
      description: 'Record and submit a brief video congratulation with your family or chapter to be broadcast during the Sunday Jubilee Banquet.',
      details: [
        'State your name, graduation year & current city',
        'Featured during the Alumni Gala Dinner',
        'Preserved in the permanent 45th Digital Archive',
        'Direct WhatsApp Secretariat submission'
      ],
      actionType: 'UPLOAD_VIDEO'
    },
    {
      icon: HeartHandshake,
      title: 'Undergraduate Endowment Fund',
      tag: 'Alumni Giving Back',
      description: 'Diaspora-backed sponsorship initiative investing directly in current ASF student members on campus.',
      details: [
        'Tuition & textbook emergency subsidies',
        'Campus medical evangelism outreach funding',
        'Student professional mentorship network',
        'Directly stewarded by the Alumni Advisory Council'
      ],
      actionType: 'SUPPORT_ENDOWMENT'
    }
  ];

  return (
    <section id="diaspora" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative overflow-hidden vintage-texture">
      <div className="relative max-w-6xl mx-auto z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest mb-3">
            <Globe className="w-3.5 h-3.5 text-jubilee-gold" />
            <span>Global Alumni Connection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-white tracking-tight mb-4">
            One Family Across Continents
          </h2>
          <p className="text-emerald-100/75 text-sm sm:text-base font-light leading-relaxed">
            For our alumni across the United Kingdom, North America, Europe, the Middle East, and beyond who cannot be on-ground in Port Harcourt — connect live, submit greetings, and celebrate our 45-year heritage.
          </p>
        </div>

        {/* 3 Authentic Pillars of Diaspora Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {diasporaPillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="luxury-glass rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-jubilee-gold/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.06] text-jubilee-gold flex items-center justify-center border border-white/10">
                      <IconComponent className="w-5 h-5 text-jubilee-gold" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-jubilee-lightgold/80 px-2.5 py-1 rounded-full bg-jubilee-gold/10 border border-jubilee-gold/20">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-retro font-bold text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-light leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-white/10 mb-6">
                    {pillar.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start space-x-2 text-xs text-emerald-100/90 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-jubilee-gold shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Buttons */}
                {pillar.actionType === 'UPLOAD_VIDEO' && (
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-400 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-luxury hover:scale-[1.02] active:scale-95 transition-all font-sans"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-950" />
                    <span>Upload Video</span>
                  </button>
                )}

                {pillar.actionType === 'SUPPORT_ENDOWMENT' && (
                  <a
                    href="#sponsors"
                    onClick={(e) => {
                      if (onOpenSponsors) {
                        e.preventDefault();
                        onOpenSponsors('sponsors');
                      }
                    }}
                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-400 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-luxury hover:scale-[1.02] active:scale-95 transition-all font-sans text-center"
                  >
                    <HeartHandshake className="w-4 h-4 text-emerald-950" />
                    <span>Support</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Video Upload Modal */}
        <VideoUploadModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />

        {/* Official Sabbath Broadcast Worldwide Time Guide */}
        <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-jubilee-gold/30 mb-12 shadow-luxury">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-jubilee-lightgold text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Grand Jubilee Sabbath Broadcast Guide</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-retro font-bold text-white">
                Saturday, November 14, 2026 • Divine Worship Service
              </h4>
            </div>
            <p className="text-xs text-stone-300 max-w-sm font-light">
              Tune in in real time or join the scheduled regional rebroadcasts across international chapters.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {timezoneSchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:bg-white/[0.06] transition-colors"
              >
                <div className="text-[11px] text-stone-400 font-medium truncate mb-1">
                  {item.city}
                </div>
                <div className="text-lg sm:text-xl font-retro font-black text-jubilee-gold mb-1">
                  {item.time}
                </div>
                <div className="text-[10px] text-emerald-300/80 font-light leading-tight">
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Virtual Registration Callout */}
        <div className="luxury-glass rounded-3xl p-7 sm:p-9 border border-jubilee-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
          <div className="max-w-xl text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-retro font-bold text-white mb-2">
              Join the 45th Anniversary Census as a Virtual Delegate
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Register your current location so your name and graduation set are officially accredited in the 45th Anniversary Jubilee Roll of Honor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="#census-rsvp"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 hover:shadow-gold-glow transition-all hover:scale-105"
            >
              <span>Register as Virtual Delegate</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
