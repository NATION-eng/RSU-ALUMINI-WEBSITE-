import React from 'react';
import { Heart, Shield, Sparkles, MessageCircle, ExternalLink, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Fellowship Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/official-logo.png"
                alt="ASF RSU 45th Anniversary Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="font-retro font-bold text-white text-base tracking-wide">
                  ADVENTIST STUDENTS' FELLOWSHIP
                </span>
                <p className="text-xs text-stone-400 font-sans font-light">
                  Rivers State University (RSU), Port Harcourt, Nigeria
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-sm">
              Commemorating 45 years of divine guidance, spiritual growth, and servant leadership (1981–2026). Uniting generations of graduates in faith and fellowship.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-jubilee-lightgold italic max-w-sm font-editorial text-sm">
              “Rooted to Rise: Honouring our Heritage, Igniting our Future” — Isaiah 61:3
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-jubilee-gold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#heritage" className="hover:text-white transition-colors">45-Year Heritage</a></li>
              <li><a href="#program" className="hover:text-white transition-colors">Jubilee Schedule</a></li>
              <li><a href="#dp-generator" className="hover:text-white transition-colors">DP Generator</a></li>
              <li><a href="#census-rsvp" className="hover:text-white transition-colors">Alumni Census Directory</a></li>
              <li><a href="#media-hub" className="hover:text-white transition-colors">Media & Livestream</a></li>
              <li><a href="#diaspora" className="hover:text-white transition-colors">Diaspora Network</a></li>
            </ul>
          </div>

          {/* Graduating Sets */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-jubilee-gold">
              Alumni Sets
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><span className="text-stone-300">1981–1990:</span> Pioneer Altars</li>
              <li><span className="text-stone-300">1991–2000:</span> Golden Sanctuary</li>
              <li><span className="text-stone-300">2001–2010:</span> Millennium Builders</li>
              <li><span className="text-stone-300">2011–2020:</span> Modern Pioneers</li>
              <li><span className="text-stone-300">2021–2026:</span> Jubilee Generation</li>
            </ul>
          </div>

          {/* Governance & Technical Partnership */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-jubilee-gold">
              Sub-Committee Governance
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Produced by the <strong>Media, Publicity & Digital Strategy Sub-Committee</strong> for the Central Planning Committee (CPC).
            </p>

            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-[11px] text-emerald-200">
              <div className="flex items-center space-x-1.5 font-bold text-white mb-0.5">
                <Code className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Technical Partner</span>
              </div>
              <p>Developed with direct engineering support from the <strong>Adventists in Tech Organization</strong>.</p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 1981–2026 Adventist Students' Fellowship (RSU Chapter). All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#census-rsvp" className="hover:text-stone-300 transition-colors">Data Directory</a>
            <span>•</span>
            <a href="#dp-generator" className="hover:text-stone-300 transition-colors">Brand Assets & DP Kit</a>
            <span>•</span>
            <a href="#admin" className="hover:text-jubilee-lightgold transition-colors inline-flex items-center space-x-1 text-stone-400">
              <Shield className="w-3 h-3 text-jubilee-gold" />
              <span>CPC Secretariat Admin</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
