import React, { useState, useEffect, startTransition, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import TimelineSection from './components/TimelineSection';
import ScheduleSection from './components/ScheduleSection';
import DpGenerator from './components/DpGenerator';
import CensusRsvpSection from './components/CensusRsvpSection';
import MediaSection from './components/MediaSection';
import DiasporaHub from './components/DiasporaHub';
import QrSection from './components/QrSection';
import Footer from './components/Footer';

// Code-split AdminDashboard, SupportDonatePortal & CompendiumAdsPortal for fast initial load
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const SupportDonatePortal = lazy(() => import('./components/SupportDonatePortal'));
const CompendiumAdsPortal = lazy(() => import('./components/CompendiumAdsPortal'));

const isHashAds = (hash, path) => {
  return hash === '#compendium-ads' || hash === '#ads' || hash === '#sponsors-ads' || path === '/compendium-ads' || path === '/ads';
};

const isHashDonate = (hash, path) => {
  return hash === '#donate' || hash === '#support' || hash === '#sponsors' || path === '/donate' || path === '/support' || path === '/sponsors';
};

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname === '/admin';
    }
    return false;
  });

  const [isDonateView, setIsDonateView] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      const p = window.location.pathname;
      return isHashDonate(h, p) && !isHashAds(h, p);
    }
    return false;
  });

  const [isAdsView, setIsAdsView] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      const p = window.location.pathname;
      return isHashAds(h, p);
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      startTransition(() => {
        const h = window.location.hash;
        const p = window.location.pathname;
        setIsAdminView(h === '#admin' || p === '/admin');
        const ads = isHashAds(h, p);
        const donate = isHashDonate(h, p) && !ads;
        setIsAdsView(ads);
        setIsDonateView(donate);
      });
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    startTransition(() => {
      setIsAdminView(true);
      setIsDonateView(false);
      setIsAdsView(false);
    });
  };

  const handleOpenDonate = () => {
    window.location.hash = 'donate';
    startTransition(() => {
      setIsDonateView(true);
      setIsAdsView(false);
      setIsAdminView(false);
    });
  };

  const handleOpenAds = () => {
    window.location.hash = 'compendium-ads';
    startTransition(() => {
      setIsAdsView(true);
      setIsDonateView(false);
      setIsAdminView(false);
    });
  };

  const handleOpenSponsors = (target = 'sponsors') => {
    if (target === 'ads') {
      handleOpenAds();
    } else {
      handleOpenDonate();
    }
  };

  const handleBackToSite = () => {
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    startTransition(() => {
      setIsAdminView(false);
      setIsDonateView(false);
      setIsAdsView(false);
    });
  };

  if (isAdminView) {
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

  if (isDonateView) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#051A0F] text-white flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-jubilee-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-stone-300 font-mono tracking-wider">Loading Donate &amp; Support Portal...</p>
          </div>
        </div>
      }>
        <SupportDonatePortal onBackToSite={handleBackToSite} onOpenAds={handleOpenAds} />
      </Suspense>
    );
  }

  if (isAdsView) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#051A0F] text-white flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-jubilee-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-stone-300 font-mono tracking-wider">Loading Compendium Advertising Portal...</p>
          </div>
        </div>
      }>
        <CompendiumAdsPortal onBackToSite={handleBackToSite} onOpenDonate={handleOpenDonate} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-jubilee-cream text-stone-900 selection:bg-emerald-900 selection:text-jubilee-lightgold font-sans antialiased w-full max-w-full overflow-x-hidden relative">
      {/* 1. Global Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} onOpenSponsors={handleOpenSponsors} />

      {/* 2. Hero Section with Live Countdown and Jubilee Theme */}
      <Hero />

      {/* 3. Milestone Impact Stats Bar */}
      <ImpactStats />

      {/* 4. Interactive 45-Year Milestone Journey (1981–2026) */}
      <TimelineSection />

      {/* 5. 45th Anniversary Homecoming Program Schedule */}
      <ScheduleSection />

      {/* 6. In-Page Live "I Will Be There" DP Generator */}
      <DpGenerator />

      {/* 7. Dual-Purpose Alumni Census Directory & Event RSVP System */}
      <CensusRsvpSection onOpenSponsors={handleOpenSponsors} />

      {/* 8. Media, Livestream Center & Institutional Coverage */}
      <MediaSection />

      {/* 9. Global Diaspora Fellowship Hub */}
      <DiasporaHub onOpenSponsors={handleOpenSponsors} />

      {/* 10. Official Scannable QR Code Share & Download Section */}
      <QrSection />

      {/* 11. Grand Footer & Governance Credits */}
      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}
