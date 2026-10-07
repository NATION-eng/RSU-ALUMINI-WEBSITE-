import React, { useState, useEffect, startTransition, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import TimelineSection from './components/TimelineSection';
import ScheduleSection from './components/ScheduleSection';
import HomeAccommodationTeaser from './components/HomeAccommodationTeaser';
import AccommodationPage from './components/AccommodationPage';
import DpGenerator from './components/DpGenerator';
import CensusRsvpSection from './components/CensusRsvpSection';
import HomeMediaTeaser from './components/HomeMediaTeaser';
import MediaHubPage from './components/MediaHubPage';
import DiasporaHub from './components/DiasporaHub';
import QrSection from './components/QrSection';
import Footer from './components/Footer';

import SupportDonatePortal from './components/SupportDonatePortal';
import CompendiumAdsPortal from './components/CompendiumAdsPortal';

// Code-split AdminDashboard for security and performance
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const isHashAds = (hash = '', path = '') => {
  const cleanHash = (hash || '').toLowerCase().replace(/^#[/]?/, '').split('?')[0].replace(/\/+$/, '');
  const cleanPath = (path || '').toLowerCase().replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  
  const keywords = [
    'compendium-ads', 'compendium-ad', 'compendiumads', 'compendium_ads',
    'compendium', 'ads', 'ad', 'ad-booking', 'ads-booking', 'compendium-booking',
    'sponsors-ads', 'sponsor-ads', 'book-ad', 'book-ads'
  ];
  return keywords.includes(cleanHash) || keywords.includes(cleanPath);
};

const isHashDonate = (hash = '', path = '') => {
  const cleanHash = (hash || '').toLowerCase().replace(/^#[/]?/, '').split('?')[0].replace(/\/+$/, '');
  const cleanPath = (path || '').toLowerCase().replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  
  const keywords = [
    'donate', 'support', 'sponsors', 'sponsor', 'donation', 'giving', 'pledge', 'partners'
  ];
  return keywords.includes(cleanHash) || keywords.includes(cleanPath);
};

const isHashMedia = (hash = '', path = '') => {
  const cleanHash = (hash || '').toLowerCase().replace(/^#[/]?/, '').split('?')[0].replace(/\/+$/, '');
  const cleanPath = (path || '').toLowerCase().replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  
  const keywords = [
    'media-hub', 'media', 'livestream', 'videos', 'living-archive', 'gallery-media'
  ];
  return keywords.includes(cleanHash) || keywords.includes(cleanPath);
};

const isHashAccommodation = (hash = '', path = '') => {
  const cleanHash = (hash || '').toLowerCase().replace(/^#[/]?/, '').split('?')[0].replace(/\/+$/, '');
  const cleanPath = (path || '').toLowerCase().replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  
  const keywords = [
    'accommodation', 'where-to-stay', 'hotels', 'hotel', 'lodging', 'stay'
  ];
  return keywords.includes(cleanHash) || keywords.includes(cleanPath);
};

const isHashAdmin = (hash = '', path = '') => {
  const cleanHash = (hash || '').toLowerCase().replace(/^#[/]?/, '').split('?')[0].replace(/\/+$/, '');
  const cleanPath = (path || '').toLowerCase().replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  return cleanHash === 'admin' || cleanPath === 'admin';
};

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return isHashAdmin(window.location.hash, window.location.pathname);
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

  const [isMediaView, setIsMediaView] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      const p = window.location.pathname;
      return isHashMedia(h, p);
    }
    return false;
  });

  const [isAccommodationView, setIsAccommodationView] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      const p = window.location.pathname;
      return isHashAccommodation(h, p);
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      startTransition(() => {
        const h = window.location.hash;
        const p = window.location.pathname;
        setIsAdminView(isHashAdmin(h, p));
        const ads = isHashAds(h, p);
        const donate = isHashDonate(h, p) && !ads;
        const media = isHashMedia(h, p);
        const accommodation = isHashAccommodation(h, p);
        setIsAdsView(ads);
        setIsDonateView(donate);
        setIsMediaView(media);
        setIsAccommodationView(accommodation);

        // If navigating to an in-page section on the homepage, scroll smoothly
        if (!isHashAdmin(h, p) && !ads && !donate && !media && !accommodation && h && h.length > 1) {
          const targetId = h.replace(/^#/, '');
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
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
      setIsDonateView(false);
      setIsAdsView(false);
      setIsMediaView(false);
      setIsAccommodationView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleOpenDonate = () => {
    window.location.hash = 'donate';
    startTransition(() => {
      setIsDonateView(true);
      setIsAdsView(false);
      setIsAdminView(false);
      setIsMediaView(false);
      setIsAccommodationView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleOpenAds = () => {
    window.location.hash = 'compendium-ads';
    startTransition(() => {
      setIsAdsView(true);
      setIsDonateView(false);
      setIsAdminView(false);
      setIsMediaView(false);
      setIsAccommodationView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleOpenMedia = () => {
    window.location.hash = 'media-hub';
    startTransition(() => {
      setIsMediaView(true);
      setIsDonateView(false);
      setIsAdsView(false);
      setIsAdminView(false);
      setIsAccommodationView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleOpenAccommodation = () => {
    window.location.hash = 'accommodation';
    startTransition(() => {
      setIsAccommodationView(true);
      setIsMediaView(false);
      setIsDonateView(false);
      setIsAdsView(false);
      setIsAdminView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setIsMediaView(false);
      setIsAccommodationView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // 1. Admin Console View
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

  // 2. Donate Hub View
  if (isDonateView) {
    return <SupportDonatePortal onBackToSite={handleBackToSite} onOpenAds={handleOpenAds} />;
  }

  // 3. Compendium Ads Booking View
  if (isAdsView) {
    return <CompendiumAdsPortal onBackToSite={handleBackToSite} onOpenDonate={handleOpenDonate} />;
  }

  // 4. Dedicated Media Hub & Living Archive View
  if (isMediaView) {
    return (
      <MediaHubPage 
        onBackToSite={handleBackToSite} 
        onOpenAdmin={handleOpenAdmin} 
        onOpenSponsors={handleOpenSponsors} 
      />
    );
  }

  // 5. Dedicated Accommodation Page View (User Request: "give accommodation its own page")
  if (isAccommodationView) {
    return (
      <AccommodationPage 
        onBackToSite={handleBackToSite}
        onOpenAdmin={handleOpenAdmin}
        onOpenSponsors={handleOpenSponsors}
      />
    );
  }

  // 6. Full Cohesive Homepage
  return (
    <div className="min-h-screen bg-jubilee-cream text-stone-900 selection:bg-emerald-900 selection:text-jubilee-lightgold font-sans antialiased w-full max-w-full overflow-x-hidden relative">
      {/* 1. Global Navigation */}
      <Navbar 
        onOpenAdmin={handleOpenAdmin} 
        onOpenSponsors={handleOpenSponsors} 
        onOpenMedia={handleOpenMedia}
        onOpenAccommodation={handleOpenAccommodation}
      />

      {/* 2. Hero Section with Live Countdown, Accommodation, RSVP & DP Buttons */}
      <Hero 
        onOpenSponsors={handleOpenSponsors} 
        onOpenAccommodation={handleOpenAccommodation} 
      />

      {/* 3. Milestone Impact Stats Bar */}
      <ImpactStats />

      {/* 4. Interactive 45-Year Milestone Journey (1981–2026) */}
      <TimelineSection />

      {/* 5. 45th Anniversary Homecoming Program Schedule */}
      <ScheduleSection />

      {/* 6. Partner Conference Hotels & Accommodation Gateway Teaser */}
      <HomeAccommodationTeaser onOpenAccommodation={handleOpenAccommodation} />

      {/* 7. In-Page Live "I Will Be There" DP Generator */}
      <DpGenerator />

      {/* 8. Dual-Purpose Alumni Census Directory & Event RSVP System (with WhatsApp Group CTA) */}
      <CensusRsvpSection onOpenSponsors={handleOpenSponsors} />

      {/* 9. Media Hub & Living Archive Invitation Teaser */}
      <HomeMediaTeaser onOpenMedia={handleOpenMedia} />

      {/* 10. Global Diaspora Fellowship Hub */}
      <DiasporaHub onOpenSponsors={handleOpenSponsors} />

      {/* 11. Official Scannable QR Code Share & Download Section */}
      <QrSection />

      {/* 12. Grand Footer & Governance Credits */}
      <Footer 
        onOpenAdmin={handleOpenAdmin} 
        onOpenSponsors={handleOpenSponsors} 
      />
    </div>
  );
}
