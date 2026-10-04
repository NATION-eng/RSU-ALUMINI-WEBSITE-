import React, { useState, useEffect } from 'react';
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
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname === '/admin';
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin' || window.location.pathname === '/admin');
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
    setIsAdminView(true);
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  if (isAdminView) {
    return <AdminDashboard onBackToSite={handleBackToSite} />;
  }

  return (
    <div className="min-h-screen bg-jubilee-cream text-stone-900 selection:bg-emerald-900 selection:text-jubilee-lightgold font-sans antialiased">
      {/* 1. Global Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

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

      {/* 7. Dual-Purpose Alumni Census Directory & Event RSVP System (With Bold Support Card) */}
      <CensusRsvpSection />

      {/* 8. Media, Livestream Center & Institutional Coverage */}
      <MediaSection />

      {/* 9. Global Diaspora Fellowship Hub */}
      <DiasporaHub />

      {/* 10. Official Scannable QR Code Share & Download Section */}
      <QrSection />

      {/* 11. Grand Footer & Governance Credits */}
      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}
