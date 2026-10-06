import React from 'react';
import { 
  Building2, Shield, Calendar, UserCheck, Image as ImageIcon, 
  Video, Globe, BookOpen, ArrowRight, Sparkles, Phone, MessageCircle 
} from 'lucide-react';

export default function HomeGatewayGrid({ onNavigate }) {
  const portalCards = [
    {
      id: 'accommodation',
      hash: '#accommodation',
      title: 'Accommodation',
      badge: 'Official Hostels & Hotels',
      tagline: 'Partner conference hotels, negotiated discount codes, and direct coordination with Eng. Eld Jonathan David Junior.',
      icon: Building2,
      actionText: 'View Accommodation & Hotels',
      highlight: true
    },
    {
      id: 'heritage',
      hash: '#heritage',
      title: '45-Year Heritage & Journey',
      badge: '1981 – 2026 Milestone',
      tagline: 'Four decades of grace, pioneer altars, sacred memories, and the 10-photo historical fellowship gallery.',
      icon: Shield,
      actionText: 'Explore Fellowship History'
    },
    {
      id: 'program',
      hash: '#program',
      title: 'Program & Schedule',
      badge: 'Nov 13–15, 2026',
      tagline: 'Full 3-day jubilee weekend schedule, Grand Jubilee Sabbath cantata, banqueting, and timezone converter.',
      icon: Calendar,
      actionText: 'View 3-Day Program'
    },
    {
      id: 'census-rsvp',
      hash: '#census-rsvp',
      title: 'Alumni Census & RSVP',
      badge: 'Accreditation Directory',
      tagline: 'Register your attendance, record your legacy testimony, and join the official Alumni WhatsApp Group.',
      icon: UserCheck,
      actionText: 'Register for Homecoming'
    },
    {
      id: 'dp-generator',
      hash: '#dp-generator',
      title: 'DP Badge Generator',
      badge: 'Personalized Social Badge',
      tagline: 'Create and download your high-resolution custom "I Will Be There" display picture with live photo framing.',
      icon: ImageIcon,
      actionText: 'Create Your 45th DP'
    },
    {
      id: 'media-hub',
      hash: '#media-hub',
      title: 'Media Hub & Living Archive',
      badge: 'Livestream & Throwbacks',
      tagline: '4K live stream broadcast, historical video documentary, studio audio jingle, and community photo repository.',
      icon: Video,
      actionText: 'Enter Media Vault'
    },
    {
      id: 'diaspora',
      hash: '#diaspora',
      title: 'Global Diaspora Hub',
      badge: 'Worldwide Alumni Family',
      tagline: 'Connecting alumni chapters across North America, United Kingdom, Europe, and global fellowships.',
      icon: Globe,
      actionText: 'Connect with Diaspora'
    },
    {
      id: 'compendium-ads',
      hash: '#compendium-ads',
      title: 'Compendium Advertising',
      badge: 'Commemorative Print Edition',
      tagline: 'Book high-impact advert spaces in the prestigious 45th Jubilee Historical Compendium brochure.',
      icon: BookOpen,
      actionText: 'Book Compendium Advert'
    }
  ];

  const handleCardClick = (hash, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate(hash);
    } else {
      window.location.hash = hash.replace(/^#/, '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 px-3 xs:px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/10 text-emerald-950 text-xs font-bold uppercase tracking-widest border border-emerald-950/15">
            <Sparkles className="w-3.5 h-3.5 text-emerald-900" />
            <span>Dedicated Event Portals &amp; Sections</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight">
            Explore the 45th Jubilee
          </h2>

          <p className="text-stone-600 text-xs sm:text-base font-light leading-relaxed px-2">
            Each major area of the celebration now features its own dedicated, focused portal for effortless navigation, planning, and participation.
          </p>
        </div>

        {/* Portal Gateway Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {portalCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                onClick={(e) => handleCardClick(card.hash, e)}
                className={`rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group cursor-pointer border ${
                  card.highlight
                    ? 'bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0D3821] text-white border-jubilee-gold/60 shadow-luxury hover:scale-[1.02] hover:shadow-2xl'
                    : 'bg-white hover:bg-stone-50/80 text-stone-900 border-stone-200/90 shadow-luxury hover:scale-[1.02] hover:border-emerald-800/40 hover:shadow-xl'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      card.highlight
                        ? 'bg-jubilee-gold/20 text-jubilee-gold border border-jubilee-gold/40'
                        : 'bg-emerald-950/5 text-emerald-900 border border-emerald-950/10'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                      card.highlight
                        ? 'bg-black/40 text-jubilee-lightgold border-white/10'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-lg sm:text-xl font-retro font-bold tracking-tight ${
                      card.highlight ? 'text-white' : 'text-emerald-950 group-hover:text-emerald-900'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-xs mt-2 leading-relaxed font-light ${
                      card.highlight ? 'text-stone-300' : 'text-stone-600'
                    }`}>
                      {card.tagline}
                    </p>
                  </div>
                </div>

                <div className={`pt-5 mt-5 border-t flex items-center justify-between text-xs font-bold transition-all ${
                  card.highlight
                    ? 'border-white/10 text-jubilee-gold group-hover:text-amber-200'
                    : 'border-stone-100 text-emerald-950 group-hover:text-emerald-800'
                }`}>
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Community WhatsApp Group Banner at Bottom of Gateway */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0A331C] to-emerald-950 text-white border-2 border-emerald-600/40 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-jubilee-gold text-xs font-mono font-bold uppercase tracking-wider">
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 fill-current" />
              <span>Connect on WhatsApp</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
              Join the Official 45th Jubilee WhatsApp Community
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Never miss an update. Connect directly with fellow alumni across graduating sets, receive travel advisory bulletins, and stay informed ahead of November 13–15, 2026.
            </p>
          </div>

          <a
            href="https://chat.whatsapp.com/L7tCTNupT6y4BEg4my964K"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-full text-xs sm:text-sm font-black bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition-all active:scale-95 shrink-0 touch-manipulation border border-white/20"
          >
            <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
            <span>Join Our WhatsApp Group</span>
          </a>
        </div>

      </div>
    </section>
  );
}
