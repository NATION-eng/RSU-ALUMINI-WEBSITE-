import React, { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, UserCheck, ArrowRight, Camera } from 'lucide-react';

const HERITAGE_PHOTOS = [
  { id: 1, src: '/heritage/heritage_01.jpg', title: 'Pioneer Altar Handshake & Presentation' },
  { id: 2, src: '/heritage/heritage_02.jpg', title: 'Fellowship Award Presentation' },
  { id: 3, src: '/heritage/heritage_03.jpg', title: 'ASF Sacred Mass Choir in Formal Navy & Hats' },
  { id: 4, src: '/heritage/heritage_04.jpg', title: 'Sisterhood Token Presentation' },
  { id: 5, src: '/heritage/heritage_05.jpg', title: 'Fellowship Commendation Smiles' },
  { id: 6, src: '/heritage/heritage_06.jpg', title: 'Campus Prayer & Unity in Fellowship' },
  { id: 7, src: '/heritage/heritage_07.jpg', title: 'Celebratory Headwraps & Fellowship Attire' },
  { id: 8, src: '/heritage/heritage_08.jpg', title: 'Grand Staircase Native Attire Gathering' },
  { id: 9, src: '/heritage/heritage_09.jpg', title: 'NAAS UST Chapter 1998/99 Historic Congregation' },
  { id: 10, src: '/heritage/heritage_10.jpg', title: 'Hilltop Outreach & Nature Mission Retreat' }
];

export default function Hero() {
  // Target date: Saturday November 14, 2026 (Grand Jubilee Sabbath)
  const targetDate = new Date('2026-11-14T08:30:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#051A0F] text-white overflow-hidden vintage-texture">
      
      {/* 10-Square Heritage Background Photo Grid with Fillers & Contrast Masks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Responsive Square Mosaic Grid */}
        <div className="absolute -inset-4 sm:-inset-6 opacity-20 sm:opacity-25 transition-opacity duration-700">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-4 h-full w-full">
            {HERITAGE_PHOTOS.concat(HERITAGE_PHOTOS.slice(0, 5)).map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden border border-jubilee-gold/25 shadow-[inset_0_0_24px_rgba(0,0,0,0.85)] bg-black/50"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover object-center filter contrast-125 brightness-90 saturate-110 scale-105"
                  loading="eager"
                />
                {/* Micro-border & corner vignette filler */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-black/40 pointer-events-none" />
                <div className="absolute inset-0 border border-jubilee-gold/15 rounded-2xl pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* High-Contrast Luxury Gradient Fillers & Vignette Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#051A0F] via-[#051A0F]/80 to-[#051A0F] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,26,15,0.72)_0%,rgba(5,26,15,0.92)_70%,rgba(5,26,15,0.99)_100%)] pointer-events-none" />

        {/* Bespoke Luxury Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[850px] h-[400px] sm:h-[550px] bg-gradient-to-b from-emerald-800/25 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-36 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-jubilee-gold/10 rounded-full blur-[110px] animate-float-slow" />
        <div className="absolute bottom-10 -right-36 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-700/15 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '3.5s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10 w-full">
        
        {/* Heritage Pill Tag (Mobile-optimized text & wrap) */}
        <div className="inline-flex items-center space-x-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-jubilee-gold/30 text-jubilee-lightgold text-[10px] sm:text-xs font-semibold tracking-wider mb-5 sm:mb-7 shadow-luxury max-w-full">
          <span className="font-sans uppercase tracking-[0.15em] truncate">
            1981 – 2026 • 45TH JUBILEE CELEBRATION
          </span>
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-jubilee-gold shrink-0"></span>
          <span className="text-white/80 font-sans tracking-wider hidden xs:inline">RSU</span>
        </div>

        {/* OFFICIAL ROOTED TO RISE ARTWORK IMAGE (Replaces text headline) */}
        <div className="my-4 sm:my-7 flex justify-center px-2">
          <img
            src="/rooted-to-rise.png"
            alt="Rooted to Rise - Official 45th Anniversary Theme"
            className="w-[230px] xs:w-[270px] sm:w-[340px] md:w-[420px] lg:w-[480px] h-auto object-contain drop-shadow-[0_12px_30px_rgba(212,175,55,0.35)] animate-float-slow transition-all duration-300"
          />
        </div>
        
        {/* Scriptural Theme Banner */}
        <p className="font-editorial italic text-xl xs:text-2xl sm:text-3xl md:text-4xl text-emerald-100/95 font-medium max-w-3xl mx-auto mb-2 sm:mb-3 px-2">
          “Honouring our Heritage, Igniting our Future”
        </p>
        
        <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-jubilee-gold font-bold mb-5 sm:mb-6">
          — ISAIAH 61:3 —
        </p>

        {/* Official Date Badge (Clean wrap on all mobile viewports) */}
        <div className="inline-flex items-center space-x-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-emerald-900/60 border border-jubilee-gold/40 text-jubilee-lightgold text-[11px] sm:text-xs font-bold shadow-lg mb-6 sm:mb-8 backdrop-blur-sm max-w-full">
          <Calendar className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
          <span className="tracking-wide leading-tight">
            NOV 13–15, 2026 • GRAND JUBILEE: SATURDAY, NOV 14
          </span>
        </div>

        {/* Crisp Editorial Intro Paragraph */}
        <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-emerald-100/75 mb-7 sm:mb-10 leading-relaxed font-light px-3">
          Celebrating 45 years of divine faithfulness, spiritual leadership, and transformative brotherhood at Rivers State University. 
          Uniting our pioneers, contemporary alumni, and global diaspora in one sacred family.
        </p>

        {/* Luxury Grand Countdown Container (Mobile 4-grid responsive) */}
        <div className="luxury-glass rounded-2xl sm:rounded-3xl p-4 sm:p-7 max-w-xl mx-auto mb-8 sm:mb-10 shadow-luxury border border-jubilee-gold/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-jubilee-gold to-transparent"></div>
          
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-300 font-bold mb-3 sm:mb-4 flex items-center justify-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-jubilee-gold animate-ping"></span>
            <span>Countdown to Grand Jubilee Sabbath</span>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/35 border border-white/[0.08] rounded-xl sm:rounded-2xl p-2 sm:p-3.5 text-center">
                <span className="block text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-jubilee-gold font-retro tracking-tight leading-tight">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-xs text-emerald-200/80 uppercase tracking-widest font-sans font-semibold mt-0.5 sm:mt-1 block">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Action Triggers (Full width thumb-friendly on phones) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 px-3">
          <a
            href="#census-rsvp"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:shadow-gold-glow active:scale-[0.98] transition-all duration-200 font-sans"
          >
            <UserCheck className="w-4 h-4 text-emerald-950 shrink-0" />
            <span className="tracking-wide">Alumni Census & RSVP</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#dp-generator"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] border border-jubilee-gold/40 text-white backdrop-blur-md transition-all duration-200 shadow-md font-sans"
          >
            <ImageIcon className="w-4 h-4 text-jubilee-gold shrink-0" />
            <span className="tracking-wide">Create "I Will Be There" DP</span>
          </a>
        </div>

        {/* Subtle Archival Photography Attribution Badge */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-jubilee-lightgold/70 font-sans tracking-wide">
          <Camera className="w-3.5 h-3.5 text-jubilee-gold/80 shrink-0" />
          <span>Featuring Authentic 1981–2026 Historical Archive Photography</span>
        </div>

      </div>
    </section>
  );
}
