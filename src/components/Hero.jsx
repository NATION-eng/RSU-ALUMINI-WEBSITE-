import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Image as ImageIcon, UserCheck, ArrowRight } from 'lucide-react';

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
    <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#051A0F] text-white overflow-hidden vintage-texture">
      
      {/* Bespoke Luxury Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-emerald-800/25 to-transparent rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -left-36 w-[450px] h-[450px] bg-jubilee-gold/10 rounded-full blur-[130px] animate-float-slow"></div>
        <div className="absolute bottom-10 -right-36 w-[500px] h-[500px] bg-emerald-700/15 rounded-full blur-[140px] animate-float-slow" style={{ animationDelay: '3.5s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">

        {/* Heritage Pill Tag */}
        <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-jubilee-gold/30 text-jubilee-lightgold text-xs sm:text-sm font-semibold tracking-wider mb-6 shadow-luxury">
          <Sparkles className="w-4 h-4 text-jubilee-gold" />
          <span className="font-sans uppercase tracking-[0.2em] text-[11px] sm:text-xs">
            1981 – 2026 • 45TH JUBILEE CELEBRATION
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-jubilee-gold"></span>
          <span className="text-white/80 font-sans tracking-wider text-[11px] sm:text-xs">RSU PORT HARCOURT</span>
        </div>

        {/* Master Throwback Typography Headline */}
        <div className="mb-4">
          <h1 className="font-retro text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] text-white">
            Rooted <span className="font-editorial italic font-normal text-jubilee-gold font-light tracking-normal">to</span> Rise
          </h1>
        </div>
        
        {/* Scriptural Theme Banner */}
        <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-emerald-100/95 font-medium max-w-3xl mx-auto mb-3">
          “Honouring our Heritage, Igniting our Future”
        </p>
        
        <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-jubilee-gold font-bold mb-6">
          — ISAIAH 61:3 —
        </p>

        {/* Official Date Badge */}
        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-900/60 border border-jubilee-gold/40 text-jubilee-lightgold text-xs sm:text-sm font-bold shadow-lg mb-8 backdrop-blur-sm">
          <Calendar className="w-4 h-4 text-jubilee-gold" />
          <span className="tracking-wide">NOVEMBER 13–15, 2026 • GRAND JUBILEE SABBATH: SATURDAY, NOV 14</span>
        </div>

        {/* Crisp Editorial Intro Paragraph */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/75 mb-10 leading-relaxed font-light">
          Celebrating 45 years of divine faithfulness, spiritual leadership, and transformative brotherhood at Rivers State University. 
          Uniting our pioneers, contemporary alumni, and global diaspora in one sacred family.
        </p>

        {/* Luxury Grand Countdown Container */}
        <div className="luxury-glass rounded-3xl p-6 sm:p-8 max-w-xl mx-auto mb-10 shadow-luxury border border-jubilee-gold/30 relative overflow-hidden group hover:border-jubilee-gold/50 transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-jubilee-gold to-transparent"></div>
          
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-emerald-300 font-bold mb-4 flex items-center justify-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-jubilee-gold animate-ping"></span>
            <span>Countdown to Grand Jubilee Sabbath</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/30 border border-white/[0.08] rounded-2xl p-3 sm:p-4 text-center hover:border-jubilee-gold/40 transition-colors">
                <span className="block text-3xl sm:text-5xl font-black text-jubilee-gold font-retro tracking-tight">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-200/80 uppercase tracking-widest font-sans font-semibold mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bespoke Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="#census-rsvp"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-9 py-4 rounded-full text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
          >
            <UserCheck className="w-4 h-4 text-emerald-950" />
            <span className="tracking-wide">Alumni Census & RSVP</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#dp-generator"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full text-sm font-bold bg-white/[0.05] hover:bg-white/[0.1] border border-jubilee-gold/40 hover:border-jubilee-gold text-white backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 shadow-md"
          >
            <ImageIcon className="w-4 h-4 text-jubilee-gold" />
            <span className="tracking-wide">Create "I Will Be There" DP</span>
          </a>
        </div>

      </div>
    </section>
  );
}
