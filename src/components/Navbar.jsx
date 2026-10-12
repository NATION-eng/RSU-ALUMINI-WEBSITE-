import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, UserCheck, Globe, Image as ImageIcon, Video, Shield, QrCode, Award, BookOpen, HeartHandshake, Building2 } from 'lucide-react';

export default function Navbar({ onOpenSponsors, onOpenMedia, onOpenAccommodation }) {
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
    { name: 'Accommodation', href: '#accommodation', icon: Building2 },
    { name: 'Heritage', href: '#heritage', icon: Shield },
    { name: 'Program', href: '#program', icon: Calendar },
    { name: 'DP Generator', href: '#dp-generator', icon: ImageIcon },
    { name: 'Media Hub', href: '#media-hub', icon: Video },
    { name: 'Diaspora', href: '#diaspora', icon: Globe },
    { name: 'Compendium Ads', href: '#compendium-ads', icon: BookOpen },
  ];

  const handleNavClick = (e, href) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isOpen) setIsOpen(false);

    if (href === '#compendium-ads' && onOpenSponsors) {
      onOpenSponsors('ads');
      return;
    }
    if (href === '#donate' && onOpenSponsors) {
      onOpenSponsors('sponsors');
      return;
    }
    if (href === '#media-hub' && onOpenMedia) {
      onOpenMedia();
      return;
    }
    if (href === '#accommodation' && onOpenAccommodation) {
      onOpenAccommodation();
      return;
    }

    if (href.startsWith('#')) {
      const targetId = href.replace(/^#/, '');
      setTimeout(() => {
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          if (window.location.hash !== href) {
            window.history.replaceState(null, '', href);
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      }, 0);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-2 sm:py-2.5 ${
      scrolled 
        ? 'bg-[#051A0F]/95 backdrop-blur-md shadow-luxury border-b border-jubilee-gold/20' 
        : 'bg-[#051A0F]/90 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4">
          
          {/* Official 45th Anniversary Logo & Identity */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2.5 group min-w-0 shrink"
          >
            <img
              src="/official-logo.png"
              alt="ASF RSU 45th Anniversary Logo"
              className="h-7 xs:h-8 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="text-left flex flex-col justify-center min-w-0">
              {/* Mobile text: compact to guarantee zero overflow on all devices */}
              <div className="sm:hidden flex flex-col justify-center min-w-0 leading-tight">
                <span className="font-retro font-bold text-white text-[11px] xs:text-xs tracking-tight truncate">
                  45th Jubilee
                </span>
                <span className="text-[8px] xs:text-[9px] text-jubilee-lightgold font-sans font-semibold tracking-wider uppercase truncate">
                  Homecoming
                </span>
              </div>
              {/* Tablet & Desktop text: full title */}
              <div className="hidden sm:flex flex-col justify-center min-w-0 leading-tight">
                <span className="font-retro font-bold text-white text-sm md:text-base tracking-wide group-hover:text-jubilee-lightgold transition-colors truncate">
                  Anniversary Celebration &amp;
                </span>
                <span className="text-xs text-jubilee-lightgold font-sans font-semibold tracking-wider uppercase mt-0.5 truncate">
                  Alumni Homecoming
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-1.5 font-sans">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-2 xl:px-3 py-1.5 xl:py-2 text-[11px] xl:text-sm font-semibold tracking-wide text-emerald-100/90 hover:text-jubilee-lightgold rounded-xl hover:bg-white/[0.08] transition-all duration-200 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Area (Mobile-optimized touch buttons) */}
          <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Donate / Support Button */}
            <a
              href="#donate"
              onClick={(e) => handleNavClick(e, '#donate')}
              title="Donate / Support Tiers & Support Matrix"
              className="inline-flex items-center space-x-1 px-2 py-1.5 xs:px-2.5 xs:py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-black bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-400 text-emerald-950 shadow-luxury hover:shadow-gold-glow hover:scale-105 active:scale-95 transition-all duration-200 font-sans tracking-tight shrink-0 border border-amber-300 touch-manipulation"
            >
              <HeartHandshake className="w-3 xs:w-3.5 h-3 xs:h-3.5 text-emerald-950 shrink-0" />
              <span>Donate</span>
            </a>

            {/* Compendium Ad Booking - Available on mobile/tablet and ultra-wide screens */}
            <a
              href="#compendium-ads"
              onClick={(e) => handleNavClick(e, '#compendium-ads')}
              title="Compendium Advertising Rates & Space Booking"
              className="inline-flex lg:hidden 2xl:inline-flex items-center space-x-1 px-2 py-1.5 xs:px-2.5 xs:py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold text-jubilee-lightgold border border-jubilee-gold/50 bg-white/[0.08] hover:border-jubilee-gold hover:bg-white/[0.15] transition-all hover:scale-105 active:scale-95 shrink-0 touch-manipulation"
            >
              <BookOpen className="w-3 xs:w-3.5 h-3 xs:h-3.5 text-jubilee-gold shrink-0" />
              <span className="hidden sm:inline">Compendium Ads</span>
              <span className="sm:hidden">Ads</span>
            </a>

            {/* Quick QR Code Shortcut - Wide desktop only */}
            <a
              href="#qr-share"
              onClick={(e) => handleNavClick(e, '#qr-share')}
              title="Share & Download Official QR Code"
              className="hidden 2xl:inline-flex items-center space-x-1 p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-white/[0.08] hover:bg-white/15 text-jubilee-lightgold border border-jubilee-gold/30 hover:border-jubilee-gold text-xs font-semibold transition-all hover:scale-105 shrink-0 touch-manipulation active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-jubilee-gold shrink-0 pointer-events-none" />
              <span className="pointer-events-none">QR</span>
            </a>

            {/* RSVP & Census CTA Button - Desktop only (>= 1024px) */}
            <a
              href="#census-rsvp"
              onClick={(e) => handleNavClick(e, '#census-rsvp')}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all duration-200 font-sans tracking-tight shrink-0 touch-manipulation hover:border-jubilee-gold/50"
            >
              <UserCheck className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
              <span className="whitespace-nowrap font-black">RSVP</span>
            </a>

            {/* Three-Dash Nav Dropdown Button - Mobile & Tablet only (< 1024px) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 rounded-xl text-jubilee-lightgold hover:text-white bg-white/[0.08] hover:bg-white/15 border border-jubilee-gold/30 hover:border-jubilee-gold focus:outline-none transition-all duration-200 shrink-0 touch-manipulation active:scale-95 shadow-sm"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 xs:w-5 h-4 xs:h-5 text-jubilee-gold" /> : <Menu className="w-4 xs:w-5 h-4 xs:h-5 text-jubilee-gold" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Full slide down with glass blur) */}
      {isOpen && (
        <div className="lg:hidden bg-[#051A0F]/98 border-b border-jubilee-gold/30 px-4 pt-3 pb-8 space-y-1.5 mt-2 shadow-2xl backdrop-blur-xl animate-fade-in max-h-[82vh] overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-emerald-100 hover:bg-white/10 hover:text-white font-sans active:bg-emerald-900/50 transition-colors"
              >
                <Icon className="w-4 h-4 text-jubilee-gold shrink-0" />
                <span>{link.name}</span>
              </a>
            );
          })}
          
          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href="#donate"
              onClick={(e) => handleNavClick(e, '#donate')}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury font-sans touch-manipulation active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-950 shrink-0" />
              <span>Donate / Support (5 Tiers)</span>
            </a>

            <a
              href="#compendium-ads"
              onClick={(e) => handleNavClick(e, '#compendium-ads')}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 text-jubilee-lightgold border border-jubilee-gold/30 font-sans touch-manipulation active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-jubilee-gold shrink-0" />
              <span>Compendium Ad Booking (Rates)</span>
            </a>

            <a
              href="#census-rsvp"
              onClick={(e) => handleNavClick(e, '#census-rsvp')}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-jubilee-gold/40 shadow-sm font-sans touch-manipulation active:scale-95 transition-all"
            >
              <UserCheck className="w-4 h-4 text-jubilee-gold" />
              <span>Register for 45th Homecoming (RSVP)</span>
            </a>

            <a
              href="#qr-share"
              onClick={(e) => handleNavClick(e, '#qr-share')}
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
