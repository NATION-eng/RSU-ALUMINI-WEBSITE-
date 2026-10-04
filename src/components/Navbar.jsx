import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, UserCheck, Sparkles, Image as ImageIcon, Video, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Heritage', href: '#heritage', icon: Shield },
    { name: 'Program', href: '#program', icon: Calendar },
    { name: 'DP Generator', href: '#dp-generator', icon: ImageIcon, badge: 'Popular' },
    { name: 'Reunion Roll Call', href: '#census-rsvp', icon: UserCheck },
    { name: 'Media Hub', href: '#media-hub', icon: Video },
    { name: 'Diaspora', href: '#diaspora', icon: Sparkles },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#051A0F]/95 backdrop-blur-md shadow-luxury py-3 border-b border-jubilee-gold/20' : 'bg-gradient-to-b from-[#051A0F]/90 via-[#051A0F]/50 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Identity */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-jubilee-gold via-amber-300 to-yellow-600 flex items-center justify-center p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#051A0F] rounded-full flex items-center justify-center flex-col">
                <span className="text-[9px] font-bold text-jubilee-gold tracking-tighter leading-none">ASF</span>
                <span className="text-xs font-black text-white leading-none font-retro">45th</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-retro font-bold text-white text-base tracking-wide group-hover:text-jubilee-lightgold transition-colors">
                  ASF RSU
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 font-semibold tracking-wider uppercase font-sans">
                  1981–2026
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 tracking-tight font-light hidden sm:block font-sans">
                Adventist Students' Fellowship • 45th Jubilee
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 font-sans">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-3.5 py-2 text-xs font-semibold text-emerald-100/90 hover:text-white rounded-lg hover:bg-white/[0.08] transition-all duration-200 flex items-center space-x-1.5"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-jubilee-leaf text-[9px] text-emerald-950 font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <a
              href="#census-rsvp"
              className="hidden sm:inline-flex items-center space-x-2 px-4.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 transition-all duration-200 font-sans"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>RSVP & Census</span>
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#051A0F]/98 border-b border-jubilee-gold/20 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-2xl backdrop-blur-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-white/10 hover:text-white font-sans"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-jubilee-gold" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="bg-jubilee-leaf text-[10px] text-emerald-950 font-bold px-2 py-0.5 rounded-full uppercase">
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}
          <div className="pt-3">
            <a
              href="#census-rsvp"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-lg font-sans"
            >
              <UserCheck className="w-4 h-4" />
              <span>RSVP for 45th Homecoming</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
