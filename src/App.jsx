import React, { useState, useEffect, startTransition, lazy, Suspense } from 'react';
import { ArrowLeft, Home, UserCheck, HeartHandshake, BookOpen } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import HomePillarsTeaser from './components/HomePillarsTeaser';
import HomeGatewayGrid from './components/HomeGatewayGrid';
import AccommodationPage from './components/AccommodationPage';
import TimelineSection from './components/TimelineSection';
import ScheduleSection from './components/ScheduleSection';
import DpGenerator from './components/DpGenerator';
import CensusRsvpSection from './components/CensusRsvpSection';
import MediaSection from './components/MediaSection';
import DiasporaHub from './components/DiasporaHub';
import QrSection from './components/QrSection';
import Footer from './components/Footer';

import SupportDonatePortal from './components/SupportDonatePortal';
import CompendiumAdsPortal from './components/CompendiumAdsPortal';

// Code-split AdminDashboard for security and performance
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

/**
 * Robust Multi-Page Hash Router Resolver
 * Maps browser hash / pathname to dedicated view keys
 */
const resolveRoute = (hash = '', path = '') => {
  const cleanHash = (hash || '').toLowerCase().replace(/^#[/]?/, '').split('?')[0].replace(/\/+$/, '');
  const cleanPath = (path || '').toLowerCase().replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  const target = cleanHash || cleanPath;

  if (target === 'admin') return 'admin';
  if (['donate', 'support', 'sponsors', 'sponsor', 'donation', 'giving', 'pledge', 'partners'].includes(target)) return 'donate';
  if ([
    'compendium-ads', 'compendium-ad', 'compendiumads', 'compendium_ads',
    'compendium', 'ads', 'ad', 'ad-booking', 'ads-booking', 'compendium-booking',
    'sponsors-ads', 'sponsor-ads', 'book-ad', 'book-ads'
  ].includes(target)) return 'compendium-ads';
  if (['accommodation', 'where-to-stay', 'hotels', 'hotel', 'lodging', 'stay'].includes(target)) return 'accommodation';
  if (['heritage', 'history', 'timeline', 'archives', 'gallery'].includes(target)) return 'heritage';
  if (['program', 'schedule', 'events', 'itinerary'].includes(target)) return 'program';
  if (['census-rsvp', 'census', 'rsvp', 'register', 'registration'].includes(target)) return 'census-rsvp';
  if (['dp-generator', 'dp', 'badge', 'avatar'].includes(target)) return 'dp-generator';
  if (['media-hub', 'media', 'livestream', 'videos', 'stream'].includes(target)) return 'media-hub';
  if (['diaspora', 'diaspora-hub', 'global'].includes(target)) return 'diaspora';

  return 'home';
};

/**
 * Reusable breadcrumb bar for dedicated standalone content pages
 */
function DedicatedPageBanner({ title, subtitle, badge, onBackToSite, onOpenDonate, onOpenRsvp }) {
  return (
    <div className="bg-gradient-to-r from-[#051A0F] via-[#082918] to-[#0D3821] text-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 border-b border-jubilee-gold/30 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-jubilee-lightgold text-xs font-semibold transition-all touch-manipulation active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-jubilee-gold" />
              <span>Back to Home</span>
            </button>
            <span className="text-stone-500 text-xs">/</span>
            <span className="text-jubilee-gold text-xs font-mono uppercase tracking-wider">{badge || 'Dedicated Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-retro font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onOpenRsvp && (
            <button
              onClick={onOpenRsvp}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all touch-manipulation active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-jubilee-gold" />
              <span>RSVP</span>
            </button>
          )}
          {onOpenDonate && (
            <button
              onClick={onOpenDonate}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-jubilee-gold to-amber-400 text-emerald-950 transition-all touch-manipulation active:scale-95"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-950" />
              <span>Donate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return resolveRoute(window.location.hash, window.location.pathname);
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      startTransition(() => {
        const route = resolveRoute(window.location.hash, window.location.pathname);
        setCurrentRoute(route);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (route) => {
    window.location.hash = route.replace(/^#/, '');
    startTransition(() => {
      setCurrentRoute(route.replace(/^#/, ''));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleBackToSite = () => {
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    startTransition(() => {
      setCurrentRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleOpenAdmin = () => navigateTo('admin');
  const handleOpenDonate = () => navigateTo('donate');
  const handleOpenAds = () => navigateTo('compendium-ads');
  const handleOpenRsvp = () => navigateTo('census-rsvp');
  const handleOpenAccommodation = () => navigateTo('accommodation');

  const handleOpenSponsors = (target = 'sponsors') => {
    if (target === 'ads') {
      handleOpenAds();
    } else {
      handleOpenDonate();
    }
  };

  // 1. Admin Console View
  if (currentRoute === 'admin') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#051A0F] text-white flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-jubilee-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-stone-300 font-mono tracking-wider">Loading Secretariat Console...</p>
          </div>
        </div>
      }>
        <AdminDashboard onBackToSite={handleBackToSite} />
      </Suspense>
    );
  }

  // 2. Donate & Fundraising Hub
  if (currentRoute === 'donate') {
    return <SupportDonatePortal onBackToSite={handleBackToSite} onOpenAds={handleOpenAds} />;
  }

  // 3. Compendium Ads Booking Portal
  if (currentRoute === 'compendium-ads') {
    return <CompendiumAdsPortal onBackToSite={handleBackToSite} onOpenDonate={handleOpenDonate} />;
  }

  // 4. Dedicated Accommodation Page (Requirement 1)
  if (currentRoute === 'accommodation') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <AccommodationPage onBackToSite={handleBackToSite} />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 5. Dedicated Heritage & Journey Page
  if (currentRoute === 'heritage') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <DedicatedPageBanner
          title="45-Year Milestone Journey & Archival Gallery"
          subtitle="Reflecting on 45 years of unbroken divine faithfulness, pioneer sacrifices, and sacred music at Rivers State University."
          badge="Heritage Module"
          onBackToSite={handleBackToSite}
          onOpenDonate={handleOpenDonate}
          onOpenRsvp={handleOpenRsvp}
        />
        <TimelineSection />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 6. Dedicated Program & Schedule Page
  if (currentRoute === 'program') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <DedicatedPageBanner
          title="Homecoming Weekend Program & Schedule"
          subtitle="Complete 3-day itinerary: Welcome reception, Grand Jubilee Sabbath cantata & love feast, and Sunday awards banquet."
          badge="Official Schedule"
          onBackToSite={handleBackToSite}
          onOpenDonate={handleOpenDonate}
          onOpenRsvp={handleOpenRsvp}
        />
        <ScheduleSection />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 7. Dedicated Alumni Census & RSVP Page (Requirement 3: WhatsApp CTA included)
  if (currentRoute === 'census-rsvp') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <DedicatedPageBanner
          title="Alumni Census Directory & Homecoming RSVP"
          subtitle="Confirm your attendance, record your set memories, and join the official WhatsApp fellowship community."
          badge="Accreditation Directory"
          onBackToSite={handleBackToSite}
          onOpenDonate={handleOpenDonate}
          onOpenRsvp={null}
        />
        <CensusRsvpSection onOpenSponsors={handleOpenSponsors} />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 8. Dedicated DP Generator Page
  if (currentRoute === 'dp-generator') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <DedicatedPageBanner
          title="45th Jubilee DP & Badge Generator"
          subtitle="Generate your customized 'I Will Be There' social badge to celebrate our 45th anniversary across social platforms."
          badge="Personalized Media Kit"
          onBackToSite={handleBackToSite}
          onOpenDonate={handleOpenDonate}
          onOpenRsvp={handleOpenRsvp}
        />
        <DpGenerator />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 9. Dedicated Media Hub & Living Archive Page
  if (currentRoute === 'media-hub') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <DedicatedPageBanner
          title="Media, Livestream Center & Living Archive"
          subtitle="Global livestream coverage, 45-year commemorative video documentary, studio audio jingle, and alumni picture vault."
          badge="Media Vault"
          onBackToSite={handleBackToSite}
          onOpenDonate={handleOpenDonate}
          onOpenRsvp={handleOpenRsvp}
        />
        <MediaSection />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 10. Dedicated Global Diaspora Hub Page
  if (currentRoute === 'diaspora') {
    return (
      <div className="min-h-screen bg-jubilee-cream text-stone-900 font-sans antialiased w-full max-w-full overflow-x-hidden relative">
        <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
        <DedicatedPageBanner
          title="Global Diaspora Fellowship Hub"
          subtitle="Connecting alumni abroad in North America, United Kingdom, Europe, and worldwide chapters."
          badge="Diaspora Network"
          onBackToSite={handleBackToSite}
          onOpenDonate={handleOpenDonate}
          onOpenRsvp={handleOpenRsvp}
        />
        <DiasporaHub onOpenSponsors={handleOpenSponsors} />
        <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
      </div>
    );
  }

  // 11. Streamlined Executive Homepage (Requirement 4)
  return (
    <div className="min-h-screen bg-jubilee-cream text-stone-900 selection:bg-emerald-900 selection:text-jubilee-lightgold font-sans antialiased w-full max-w-full overflow-x-hidden relative">
      {/* 1. Global Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />

      {/* 2. Executive Hero with Live Countdown, RSVP, Accommodation & DP Buttons */}
      <Hero onOpenSponsors={handleOpenSponsors} />

      {/* 3. Milestone Impact Stats Bar */}
      <ImpactStats />

      {/* 4. Executive 4 Fundraising Pillars Teaser with Live Progress Meters (Requirement 2) */}
      <HomePillarsTeaser onOpenDonate={handleOpenDonate} />

      {/* 5. Portal Gateway Grid Linking to All Dedicated Sub-Pages (Requirement 4) */}
      <HomeGatewayGrid onNavigate={navigateTo} />

      {/* 6. Scannable QR Code Share & Download Section */}
      <QrSection />

      {/* 7. Grand Footer & Governance Credits */}
      <Footer onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />
    </div>
  );
}
