import React from 'react';
import { HeartHandshake, Sparkles, TrendingUp, Radio, Users, GraduationCap, Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLivePillars } from '../lib/dynamicPillarsService';

export default function HomePillarsTeaser({ onOpenDonate }) {
  const { pillars, totalRaised, totalTarget, totalDonors, overallPercentage } = useLivePillars();

  const pillarCards = [
    {
      key: 'celebration',
      title: '45th Celebration',
      tag: 'Media & Livestream',
      icon: Radio,
      data: pillars.celebration
    },
    {
      key: 'homecoming',
      title: 'Homecoming Weekend',
      tag: 'Hospitality & Provisioning',
      icon: Users,
      data: pillars.homecoming
    },
    {
      key: 'trust_fund',
      title: 'Education Trust Fund',
      tag: 'Indigent Scholarships',
      icon: GraduationCap,
      data: pillars.trust_fund
    },
    {
      key: 'centre_of_influence',
      title: 'Centre of Influence',
      tag: '3-Wing Campus Complex',
      icon: Landmark,
      data: pillars.centre_of_influence
    }
  ];

  const handleDonateClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onOpenDonate) {
      onOpenDonate();
    } else {
      window.location.hash = 'donate';
    }
  };

  return (
    <section className="py-14 sm:py-20 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#051A0F] via-[#082918] to-[#051A0F] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Four Targeted Legacy Pillars</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Data Sync</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-retro font-bold text-white tracking-tight">
              Transparent Jubilee Giving
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Every donation directly powers one of four targeted jubilee initiatives with live financial progress tracking and verified bank reconciliation.
            </p>
          </div>

          {/* Master Overview Badge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-jubilee-gold/30 flex items-center space-x-4 shrink-0 shadow-lg">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider">Total Raised to Date</div>
              <div className="text-xl sm:text-2xl font-retro font-black text-jubilee-gold">
                ₦{Number(totalRaised).toLocaleString()}
              </div>
            </div>
            <div className="h-9 w-[1px] bg-white/20" />
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider">Donors</div>
              <div className="text-xl sm:text-2xl font-retro font-black text-emerald-300">
                {totalDonors}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid with Live Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {pillarCards.map((pillar) => {
            const Icon = pillar.icon;
            const pData = pillar.data || {};
            const raised = pData.raised || 0;
            const target = pData.target || 1;
            const pct = pData.percentage || Math.round((raised / target) * 100);

            return (
              <div
                key={pillar.key}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-jubilee-gold/50 shadow-luxury transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-jubilee-gold/15 border border-jubilee-gold/30 flex items-center justify-center text-jubilee-gold group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-jubilee-lightgold uppercase px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                      {pct}% Funded
                    </span>
                  </div>

                  <div>
                    <h3 className="font-retro font-bold text-base sm:text-lg text-white group-hover:text-jubilee-lightgold transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] text-emerald-200/70 font-sans mt-0.5">
                      {pillar.tag}
                    </p>
                  </div>

                  {/* Meter */}
                  <div className="space-y-1.5 pt-2">
                    <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-400 transition-all duration-1000"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
                      <span className="text-emerald-300 font-bold">{raised === 0 ? '₦0' : `₦${(raised / 1000000).toFixed(1)}M`}</span>
                      <span className="text-stone-400">Target: ₦{(target / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Donors: <strong className="text-white">{pData.donorsCount || 0}</strong></span>
                  <button
                    type="button"
                    onClick={handleDonateClick}
                    className="text-jubilee-gold hover:text-white font-bold transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Support</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout Bar */}
        <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-jubilee-gold/15 via-white/[0.05] to-jubilee-gold/15 border border-jubilee-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-retro font-bold text-base sm:text-lg text-white">
              Give with Complete Accountability &amp; Instant Receipting
            </h4>
            <p className="text-xs text-stone-300 max-w-xl font-light">
              Donations can be processed via Ecobank Direct Bank Transfer (0570076237) or Paystack with automated digital acknowledgment receipts.
            </p>
          </div>

          <a
            href="#donate"
            onClick={handleDonateClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-105 active:scale-95 transition-all shrink-0 touch-manipulation"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-950 shrink-0" />
            <span>Open Donate &amp; Fundraising Hub</span>
          </a>
        </div>

      </div>
    </section>
  );
}
