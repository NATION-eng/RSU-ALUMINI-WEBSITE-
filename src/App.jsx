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

// Code-split AdminDashboard & SponsorshipPortal for fast initial load and non-blocking view transitions
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const SponsorshipPortal = lazy(() => import('./components/SponsorshipPortal'));

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname === '/admin';
    }
    return false;
  });

  const [isSponsorsView, setIsSponsorsView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.startsWith('#sponsors') || window.location.pathname === '/sponsors';
    }
    return false;
  });

  const [sponsorsTab, setSponsorsTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('ads')) {
      return 'ads';
    }
    return 'sponsors';
  });

  useEffect(() => {
    const handleHashChange = () => {
      startTransition(() => {
        setIsAdminView(window.location.hash === '#admin' || window.location.pathname === '/admin');
        const isSponsors = window.location.hash.startsWith('#sponsors') || window.location.pathname === '/sponsors';
        setIsSponsorsView(isSponsors);
        if (window.location.hash.includes('ads')) {
          setSponsorsTab('ads');
        } else if (isSponsors) {
          setSponsorsTab('sponsors');
        }
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
    });
  };

  const handleOpenSponsors = (tab = 'sponsors') => {
    window.location.hash = tab === 'ads' ? 'sponsors-ads' : 'sponsors';
    startTransition(() => {
      setSponsorsTab(tab);
      setIsSponsorsView(true);
    });
  };

  const handleBackToSite = () => {
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    startTransition(() => {
      setIsAdminView(false);
      setIsSponsorsView(false);
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

  if (isSponsorsView) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#051A0F] text-white flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-jubilee-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-stone-300 font-mono tracking-wider">Loading Sponsorship &amp; Advertising Portal...</p>
          </div>
        </div>
      }>
        <SponsorshipPortal onBackToSite={handleBackToSite} initialTab={sponsorsTab} />
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
