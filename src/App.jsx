import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import TimelineSection from './components/TimelineSection';
import ScheduleSection from './components/ScheduleSection';
import DpGenerator from './components/DpGenerator';
import CensusRsvpSection from './components/CensusRsvpSection';
import MediaSection from './components/MediaSection';
import DiasporaHub from './components/DiasporaHub';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-jubilee-cream text-stone-900 selection:bg-emerald-900 selection:text-jubilee-lightgold font-sans antialiased">
      {/* 1. Global Navigation */}
      <Navbar />

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
      <CensusRsvpSection />

      {/* 8. Media, Livestream Center & Institutional Coverage */}
      <MediaSection />

      {/* 9. Global Diaspora Fellowship Hub */}
      <DiasporaHub />

      {/* 10. Grand Footer & Governance Credits */}
      <Footer />
    </div>
  );
}
