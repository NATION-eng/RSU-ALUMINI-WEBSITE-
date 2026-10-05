import React from 'react';
import SupportDonatePortal from './SupportDonatePortal';
import CompendiumAdsPortal from './CompendiumAdsPortal';

export default function SponsorshipPortal({ onBackToSite, initialTab = 'sponsors' }) {
  if (initialTab === 'ads') {
    return <CompendiumAdsPortal onBackToSite={onBackToSite} />;
  }
  return <SupportDonatePortal onBackToSite={onBackToSite} />;
}
