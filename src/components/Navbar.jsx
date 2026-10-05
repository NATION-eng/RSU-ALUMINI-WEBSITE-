import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, UserCheck, Globe, Image as ImageIcon, Video, Shield, QrCode, Award, BookOpen } from 'lucide-react';

export default function Navbar({ onOpenSponsors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Heritage', href: '#heritage', icon: Shield },
    { name: 'Program', href: '#program', icon: Calendar },
    { name: 'DP Generator', href: '#dp-generator', icon: ImageIcon, badge: 'Popular' },
    { name: 'Media Hub', href: '#media-hub', icon: Video },
    { name: 'Diaspora', href: '#diaspora', icon: Globe },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#051A0F]/95 backdrop-blur-md shadow-luxury py-2 sm:py-2.5 border-b border-jubilee-gold/20' 
        : 'bg-gradient-to-b from-[#051A0F]/95 via-[#051A0F]/60 to-transparent py-3 sm:py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Official 45th Anniversary Logo & Identity */}
          <a href="#" className="flex items-center space-x-1.5 sm:space-x-3 group shrink-0 min-w-0">
            <img
              src="/official-logo.png"
              alt="ASF RSU 45th Anniversary Logo"
              className="h-8 xs:h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="text-left flex flex-col justify-center min-w-0">
              <span className="font-retro font-bold text-white text-[11px] xs:text-sm sm:text-[15px] md:text-base tracking-tight sm:tracking-wide group-hover:text-jubilee-lightgold transition-colors leading-tight truncate">
                Anniversary Celebration &amp;
              </span>
              <span className="text-[9px] xs:text-[11px] sm:text-xs text-jubilee-lightgold font-sans font-semibold tracking-wider uppercase leading-tight mt-0.5 truncate">
                Alumni Homecoming
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 font-sans">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-3 py-2 text-xs font-semibold text-emerald-100/90 hover:text-white rounded-lg hover:bg-white/[0.08] transition-all duration-200 flex items-center space-x-1.5"
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

          {/* Action Area (Mobile-optimized touch buttons) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Corporate Sponsorship Button */}
            <a
              href="#sponsors"
              onClick={(e) => {
                if (onOpenSponsors) {
                  e.preventDefault();
                  onOpenSponsors('sponsors');
                }
              }}
              title="Corporate Sponsorship Tiers & Support Matrix"
              className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-black bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-400 text-emerald-950 shadow-luxury hover:shadow-gold-glow hover:scale-105 active:scale-95 transition-all duration-200 font-sans tracking-tight shrink-0 border border-amber-300 touch-manipulation"
            >
              <Award className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
              <span>Sponsor</span>
            </a>

            {/* Compendium Ad Booking */}
            <a
              href="#sponsors"
              onClick={(e) => {
                if (onOpenSponsors) {
                  e.preventDefault();
                  onOpenSponsors('ads');
                }
              }}
              title="Compendium Advertising Rates & Space Booking"
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-jubilee-lightgold border border-jubilee-gold/50 bg-white/[0.05] hover:border-jubilee-gold hover:bg-white/[0.12] transition-all hover:scale-105 shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
              <span>Compendium Ads</span>
            </a>

            {/* Quick QR Code Shortcut (Shown on tablets & desktop, accessible via mobile drawer on phones) */}
            <a
              href="#qr-share"
              title="Share & Download Official QR Code"
              className="hidden sm:inline-flex items-center space-x-1 p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-white/[0.08] hover:bg-white/15 text-jubilee-lightgold border border-jubilee-gold/30 hover:border-jubilee-gold text-xs font-semibold transition-all hover:scale-105 shrink-0 touch-manipulation active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-jubilee-gold shrink-0 pointer-events-none" />
              <span className="pointer-events-none">QR</span>
            </a>

            {/* RSVP & Census CTA Button */}
            <a
              href="#census-rsvp"
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all duration-200 font-sans tracking-tight shrink-0 touch-manipulation"
            >
              <UserCheck className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
              <span className="whitespace-nowrap font-black">RSVP</span>
            </a>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5 text-jubilee-gold" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Full slide down with glass blur) */}
      {isOpen && (
        <div className="lg:hidden bg-[#051A0F]/98 border-b border-jubilee-gold/30 px-4 pt-3 pb-6 space-y-1.5 mt-2 shadow-2xl backdrop-blur-xl animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-emerald-100 hover:bg-white/10 hover:text-white font-sans active:bg-emerald-900/50"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-jubilee-gold shrink-0" />
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
          
          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href="#sponsors"
              onClick={(e) => {
                setIsOpen(false);
                if (onOpenSponsors) {
                  e.preventDefault();
                  onOpenSponsors('sponsors');
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury font-sans"
            >
              <Award className="w-4 h-4 text-emerald-950 shrink-0" />
              <span>45th Jubilee Sponsorship Tiers (Support)</span>
            </a>

            <a
              href="#sponsors"
              onClick={(e) => {
                setIsOpen(false);
                if (onOpenSponsors) {
                  e.preventDefault();
                  onOpenSponsors('ads');
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 text-jubilee-lightgold border border-jubilee-gold/30 font-sans"
            >
              <BookOpen className="w-4 h-4 text-jubilee-gold shrink-0" />
              <span>Promote Your Brand / Compendium Adverts</span>
            </a>

            <a
              href="#census-rsvp"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white border border-white/15 font-sans"
            >
              <UserCheck className="w-4 h-4 text-jubilee-gold" />
              <span>Register for 45th Homecoming (RSVP)</span>
            </a>

            <a
              href="#qr-share"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 font-sans"
            >
              <QrCode className="w-4 h-4 text-jubilee-gold" />
              <span>Share &amp; Download Official QR Code</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
