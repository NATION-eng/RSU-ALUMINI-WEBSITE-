import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Image as ImageIcon, UserCheck, ArrowRight, Heart } from 'lucide-react';

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
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
      
      {/* Decorative background glows & patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500 rounded-full blur-[140px] opacity-40"></div>
        <div className="absolute -top-24 right-10 w-96 h-96 bg-jubilee-gold rounded-full blur-[120px] opacity-25"></div>
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-emerald-600 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        
        {/* Jubilee Seal Header Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-jubilee-gold/40 text-jubilee-lightgold text-xs sm:text-sm font-semibold mb-6 shadow-lg animate-pulse-slow">
          <Sparkles className="w-4 h-4 text-jubilee-gold animate-spin" style={{ animationDuration: '8s' }} />
          <span>NOVEMBER 13–15, 2026 • 45TH JUBILEE ALUMNI HOMECOMING</span>
          <span className="w-1.5 h-1.5 rounded-full bg-jubilee-gold"></span>
          <span className="text-white/80">RIVERS STATE UNIVERSITY</span>
        </div>

        {/* Biblical Theme */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-4 drop-shadow-md">
          Rooted to <span className="bg-gradient-to-r from-jubilee-lightgold via-jubilee-gold to-amber-400 bg-clip-text text-transparent">Rise</span>
        </h1>
        
        <p className="font-serif italic text-lg sm:text-2xl text-emerald-200/90 font-medium max-w-3xl mx-auto mb-3">
          “Honouring our Heritage, Igniting our Future”
        </p>
        
        <p className="text-xs sm:text-sm uppercase tracking-widest text-jubilee-gold font-bold mb-4">
          — ISAIAH 61:3 —
        </p>

        <div className="inline-block px-4 py-1 rounded-full bg-jubilee-gold/15 border border-jubilee-gold/30 text-jubilee-lightgold text-xs font-bold mb-8">
          📅 November 13th – 15th, 2026 • Grand Jubilee Sabbath: Saturday, November 14th
        </div>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/80 mb-10 leading-relaxed font-light">
          Welcome to the official 45-year commemorative portal of the Adventist Students’ Fellowship (RSU Chapter). 
          Four decades of divine guidance, spiritual leadership, and transformative brotherhood—uniting our pioneers, contemporary alumni, and global diaspora.
        </p>

        {/* Countdown Box */}
        <div className="bg-emerald-950/80 border border-jubilee-gold/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md max-w-xl mx-auto mb-10 shadow-2xl">
          <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-3 flex items-center justify-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-jubilee-gold" />
            <span>Countdown to Grand Jubilee Sabbath (Saturday, Nov 14, 2026)</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-3 text-center">
                <span className="block text-2xl sm:text-4xl font-extrabold text-jubilee-gold font-mono">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <a
            href="#census-rsvp"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full text-base font-bold bg-gradient-to-r from-jubilee-gold via-amber-400 to-yellow-500 text-emerald-950 shadow-xl hover:shadow-jubilee-gold/40 hover:scale-105 transition-all duration-200 group"
          >
            <UserCheck className="w-5 h-5 text-emerald-950" />
            <span>Alumni Census & RSVP</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#dp-generator"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full text-base font-bold bg-white/10 hover:bg-white/20 border border-jubilee-gold/40 text-white backdrop-blur-md hover:scale-105 transition-all duration-200 shadow-md"
          >
            <ImageIcon className="w-5 h-5 text-jubilee-gold" />
            <span>Create "I Will Be There" DP</span>
          </a>
        </div>

        {/* Quick Assurance Badges */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-emerald-200/80">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-jubilee-gold font-bold">✓</span>
            <span>1981–2026 Sets Welcome</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-jubilee-gold font-bold">✓</span>
            <span>Worldwide Diaspora Access</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-jubilee-gold font-bold">✓</span>
            <span>Physical & Virtual RSVP</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-jubilee-gold font-bold">✓</span>
            <span>Permanent Cloud Archive</span>
          </div>
        </div>

      </div>
    </section>
  );
}
