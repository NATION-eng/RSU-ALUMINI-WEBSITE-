/**
 * Dynamic Live Fundraising Pillars Service
 * Connects directly to Supabase and LocalStorage to compute real-time
 * amounts raised, donor counts, and percentage targets across the 4 Jubilee Pillars.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { FUNDRAISING_PILLARS } from '../data/fundraisingPillars';

// Baseline contributions initialized to 0 until actual live database records arrive
const BASELINE_PILLARS = {
  celebration: {
    baselineRaised: 0,
    baselineDonors: 0
  },
  homecoming: {
    baselineRaised: 0,
    baselineDonors: 0
  },
  trust_fund: {
    baselineRaised: 0,
    baselineDonors: 0
  },
  centre_of_influence: {
    baselineRaised: 0,
    baselineDonors: 0
  }
};

/**
 * Maps support categories or pledge strings from alumni registrations to pillar keys
 */
const mapCategoryToPillar = (category = '') => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('choir') || cat.includes('cantata') || cat.includes('media') || cat.includes('broadcast') || cat.includes('jingle')) {
    return 'celebration';
  }
  if (cat.includes('hospitality') || cat.includes('banquet') || cat.includes('homecoming') || cat.includes('delegate') || cat.includes('logistics')) {
    return 'homecoming';
  }
  if (cat.includes('student') || cat.includes('scholarship') || cat.includes('tuition') || cat.includes('trust') || cat.includes('welfare')) {
    return 'trust_fund';
  }
  if (cat.includes('centre') || cat.includes('influence') || cat.includes('building') || cat.includes('sanctuary') || cat.includes('infrastructure')) {
    return 'centre_of_influence';
  }
  return 'celebration'; // default pillar fallback
};

/**
 * Extracts numeric value from a pledge string like "₦100,000 Support Pledge"
 */
const parsePledgeAmount = (pledgeStr) => {
  if (!pledgeStr) return 0;
  if (typeof pledgeStr === 'number') return pledgeStr;
  const cleaned = String(pledgeStr).replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Computes live pillars data by pulling from:
 * 1. Supabase sponsorship_payments
 * 2. Supabase alumni_registrations (pledges)
 * 3. LocalStorage backups
 * 4. Verified baseline seed
 */
export async function calculateLivePillars() {
  const pillarTotals = {
    celebration: { raised: BASELINE_PILLARS.celebration.baselineRaised, donorSet: new Set() },
    homecoming: { raised: BASELINE_PILLARS.homecoming.baselineRaised, donorSet: new Set() },
    trust_fund: { raised: BASELINE_PILLARS.trust_fund.baselineRaised, donorSet: new Set() },
    centre_of_influence: { raised: BASELINE_PILLARS.centre_of_influence.baselineRaised, donorSet: new Set() }
  };

  const processedReferences = new Set();

  // 1. Fetch from Supabase sponsorship_payments
  try {
    const { data: dbPayments, error: dbErr } = await supabase
      .from('sponsorship_payments')
      .select('reference, amount, pillar_key, donor_name, is_anonymous, status');

    if (!dbErr && Array.isArray(dbPayments)) {
      dbPayments.forEach((p) => {
        if (!p.reference || processedReferences.has(p.reference)) return;
        processedReferences.add(p.reference);

        const pillarKey = (p.pillar_key || '').toLowerCase();
        const amt = Number(p.amount) || 0;
        const validKey = pillarTotals[pillarKey] ? pillarKey : 'celebration';

        pillarTotals[validKey].raised += amt;
        const donorId = p.is_anonymous ? `anon_${p.reference}` : (p.donor_name || p.reference);
        pillarTotals[validKey].donorSet.add(donorId);
      });
    }
  } catch (err) {
    // Table may not yet exist in Supabase schema cache; ignore gracefully
  }

  // 2. Fetch from Supabase alumni_registrations for pledges
  try {
    const { data: dbRegistrations, error: regErr } = await supabase
      .from('alumni_registrations')
      .select('registration_tag, full_name, willing_to_support, support_category, support_pledge');

    if (!regErr && Array.isArray(dbRegistrations)) {
      dbRegistrations.forEach((reg) => {
        if (reg.willing_to_support && reg.support_pledge) {
          const ref = `pledge_${reg.registration_tag}`;
          if (processedReferences.has(ref)) return;
          processedReferences.add(ref);

          const amt = parsePledgeAmount(reg.support_pledge);
          if (amt > 0) {
            const pillarKey = mapCategoryToPillar(reg.support_category);
            pillarTotals[pillarKey].raised += amt;
            pillarTotals[pillarKey].donorSet.add(reg.full_name || ref);
          }
        }
      });
    }
  } catch (regErr) {
    // Non-fatal, proceed with offline storage
  }

  // 3. Merge LocalStorage offline records
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const localPayments = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
      if (Array.isArray(localPayments)) {
        localPayments.forEach((p) => {
          if (!p.reference || processedReferences.has(p.reference)) return;
          processedReferences.add(p.reference);

          const pillarKey = (p.pillar_key || '').toLowerCase();
          const amt = Number(p.amount) || 0;
          const validKey = pillarTotals[pillarKey] ? pillarKey : 'celebration';

          pillarTotals[validKey].raised += amt;
          const donorId = p.is_anonymous ? `anon_${p.reference}` : (p.donor_name || p.reference);
          pillarTotals[validKey].donorSet.add(donorId);
        });
      }

      const localCensus = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
      if (Array.isArray(localCensus)) {
        localCensus.forEach((reg) => {
          if (reg.willing_to_support && reg.support_pledge) {
            const ref = `local_pledge_${reg.registration_tag || Math.random()}`;
            if (processedReferences.has(ref)) return;
            processedReferences.add(ref);

            const amt = parsePledgeAmount(reg.support_pledge);
            if (amt > 0) {
              const pillarKey = mapCategoryToPillar(reg.support_category);
              pillarTotals[pillarKey].raised += amt;
              pillarTotals[pillarKey].donorSet.add(reg.full_name || ref);
            }
          }
        });
      }
    }
  } catch (lsErr) {
    console.warn('LocalStorage merge note:', lsErr);
  }

  // 4. Construct live dynamic result merged with static metadata
  const livePillars = {};
  let masterTotalRaised = 0;
  let masterTotalTarget = 0;
  let masterTotalDonors = 0;

  Object.keys(FUNDRAISING_PILLARS).forEach((key) => {
    const meta = FUNDRAISING_PILLARS[key];
    const computed = pillarTotals[key] || { raised: 0, donorSet: new Set() };
    const liveRaised = computed.raised;
    const liveDonorsCount = (BASELINE_PILLARS[key]?.baselineDonors || 0) + computed.donorSet.size;
    const percentage = meta.target > 0 ? Math.min(100, Math.round((liveRaised / meta.target) * 100)) : 0;

    livePillars[key] = {
      ...meta,
      raised: liveRaised,
      donorsCount: liveDonorsCount,
      percentage: percentage
    };

    masterTotalRaised += liveRaised;
    masterTotalTarget += meta.target;
    masterTotalDonors += liveDonorsCount;
  });

  return {
    pillars: livePillars,
    totalRaised: masterTotalRaised,
    totalTarget: masterTotalTarget,
    totalDonors: masterTotalDonors,
    overallPercentage: masterTotalTarget > 0 ? Math.min(100, Math.round((masterTotalRaised / masterTotalTarget) * 100)) : 0,
    timestamp: new Date().toISOString()
  };
}

/**
 * Custom React Hook to consume live fundraising pillar metrics.
 * Automatically subcribes to Supabase Realtime and window events to update instantaneously.
 */
export function useLivePillars() {
  const [data, setData] = useState(() => {
    // Immediate synchronous fallback from metadata (0 until live data arrives)
    let tRaised = 0;
    let tTarget = 0;
    let tDonors = 0;
    const initial = {};

    Object.keys(FUNDRAISING_PILLARS).forEach((k) => {
      const p = FUNDRAISING_PILLARS[k];
      const baseRaised = p.raised || 0;
      const baseDonors = p.donorsCount || 0;
      const pct = p.target > 0 ? Math.min(100, Math.round((baseRaised / p.target) * 100)) : 0;
      initial[k] = {
        ...p,
        raised: baseRaised,
        donorsCount: baseDonors,
        percentage: pct
      };
      tRaised += baseRaised;
      tTarget += p.target;
      tDonors += baseDonors;
    });

    return {
      pillars: initial,
      totalRaised: tRaised,
      totalTarget: tTarget,
      totalDonors: tDonors,
      overallPercentage: tTarget > 0 ? Math.min(100, Math.round((tRaised / tTarget) * 100)) : 0,
      isLoading: true
    };
  });

  const refreshData = useCallback(async () => {
    try {
      const live = await calculateLivePillars();
      setData({
        ...live,
        isLoading: false
      });
    } catch (err) {
      console.warn('Error refreshing live pillars:', err);
      setData((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    refreshData();

    // 1. Supabase Realtime channel subscription
    let channel;
    try {
      channel = supabase
        .channel('live-fundraising-pillars-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sponsorship_payments' },
          () => {
            refreshData();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'alumni_registrations' },
          () => {
            refreshData();
          }
        )
        .subscribe();
    } catch (rtErr) {
      console.info('Realtime channel fallback note:', rtErr);
    }

    // 2. Local window events (dispatched when user donates in this browser session)
    const handleDonationRecorded = () => {
      refreshData();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'asf_sponsorship_payments' || e.key === 'asf_census_submissions') {
        refreshData();
      }
    };

    window.addEventListener('asf-donation-recorded', handleDonationRecorded);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('asf-donation-recorded', handleDonationRecorded);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshData]);

  return {
    ...data,
    refreshPillars: refreshData
  };
}
