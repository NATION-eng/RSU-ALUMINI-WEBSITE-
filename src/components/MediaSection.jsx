import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { 
  Play, Volume2, Radio, X, Tv, Bell, UploadCloud, 
  Image as ImageIcon, Sparkles, ShieldCheck, Heart, User, Calendar, ExternalLink,
  BookOpen, Printer, Download, FileText, CheckCircle2, ChevronRight, Share2, Maximize2, Check, ArrowDownToLine
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import CommunityPhotoUploadModal from './CommunityPhotoUploadModal';

// Official YouTube Live Stream URL & Embed (Saturday, Nov 21, 2026 Grand Jubilee)
export const YOUTUBE_LIVE_URL = 'https://www.youtube.com/watch?v=VMCdL5WxFsE';
export const YOUTUBE_EMBED_URL = 'https://www.youtube-nocookie.com/embed/VMCdL5WxFsE?autoplay=1&rel=0';

// Official 45th Anniversary Compendium Curated Chapters Index
const COMPENDIUM_SECTIONS = [
  {
    id: 'cover-toc',
    title: 'Table of Content & Welcome',
    pageNumber: 2,
    pageLabel: 'Pages 1–2',
    description: 'Publication foreword, editorial index, and welcome greetings from the 45th Anniversary Directorate.',
    thumb: '/compendium/thumb_toc.jpg',
    tag: 'Introductory'
  },
  {
    id: 'editorial',
    title: "From the Editor's Pen",
    pageNumber: 3,
    pageLabel: 'Pages 3–7',
    description: '"Rooted to Rise" theme treatise (Colossians 2:7) by Godsplan Promise and the Editorial Board.',
    thumb: '/compendium/thumb_editors_pen.jpg',
    tag: 'Editorial'
  },
  {
    id: 'committee',
    title: 'Anniversary Planning Committee',
    pageNumber: 13,
    pageLabel: 'Pages 13–14',
    description: 'Leadership profiles of the Central Planning Committee led by Engr. S. Uchay Dapa & Egwele James.',
    thumb: '/compendium/thumb_committee.jpg',
    tag: 'Leadership'
  },
  {
    id: 'order-of-events',
    title: 'Official Order of Events',
    pageNumber: 15,
    pageLabel: 'Pages 15–22',
    description: 'Minute-by-minute homecoming schedule: Tree Planting, Accreditation, Sabbath Worship & Grand Cantata.',
    thumb: '/compendium/thumb_events.jpg',
    tag: 'Program'
  },
  {
    id: 'history',
    title: 'Comprehensive 45-Year History',
    pageNumber: 23,
    pageLabel: 'Pages 23–43',
    description: 'The monumental chronicle of 45 years of faith, spiritual altars, and campus evangelism (Psalm 127:1).',
    thumb: '/compendium/thumb_history.jpg',
    tag: 'History'
  },
  {
    id: 'pastoral',
    title: 'Pastoral Reflection & Pioneers',
    pageNumber: 44,
    pageLabel: 'Pages 44–49',
    description: 'Spiritual exhortations, pioneer citations, and honours for past leaders of the fellowship.',
    thumb: '/compendium/thumb_cover.jpg',
    tag: 'Reflections'
  },
  {
    id: 'testimonies',
    title: 'Alumni Testimonies & Excos',
    pageNumber: 50,
    pageLabel: 'Pages 50–65',
    description: 'Living testimonies of God’s faithfulness and the roster of Student Executive Presidents till date.',
    thumb: '/compendium/thumb_testimonies.jpg',
    tag: 'Testimonies'
  },
  {
    id: 'directory-adverts',
    title: 'Directory, Goodwill & Adverts',
    pageNumber: 66,
    pageLabel: 'Pages 66–94',
    description: 'The permanent Fellowship Membership Directory, partner compendium adverts, and valediction.',
    thumb: '/compendium/thumb_back_cover.jpg',
    tag: 'Directory'
  }
];

// Curated initial throwbacks if no community uploads are approved yet (module-level constant)
const FALLBACK_THROWBACKS = [
  {
    submission_id: 'ASF-HERITAGE-01',
    contributor_name: 'Pioneer Alumni Directorate',
    alumni_set: 'Pioneer Sets (1981–1990)',
    era: '1981–1990 Pioneer Era',
    caption: 'Inaugural student fellowship meeting at the old RSU campus quadrangle.',
    image_url: '/heritage/heritage_01.jpg',
    status: 'APPROVED'
  },
  {
    submission_id: 'ASF-HERITAGE-03',
    contributor_name: 'Choir Historical Archive',
    alumni_set: 'Mass Choir (1990s)',
    era: '1991–2000 Sacred Harmony & Mass Choir',
    caption: 'ASF Sacred Mass Choir in formal navy blazers and ceremonial hats at the Annual Cantata.',
    image_url: '/heritage/heritage_03.jpg',
    status: 'APPROVED'
  },
  {
    submission_id: 'ASF-HERITAGE-09',
    contributor_name: 'NAAS UST Chapter Exco',
    alumni_set: 'Class of 1998/1999',
    era: '1991–2000 Sacred Harmony & Mass Choir',
    caption: 'NAAS UST Chapter 1998/99 historic congregation on the main chapel steps.',
    image_url: '/heritage/heritage_09.jpg',
    status: 'APPROVED'
  },
  {
    submission_id: 'ASF-HERITAGE-08',
    contributor_name: 'Sisterhood Fellowship Directorate',
    alumni_set: 'Class of 2004',
    era: '2001–2010 Millennium Builders',
    caption: 'Grand staircase native attire fellowship gathering.',
    image_url: '/heritage/heritage_08.jpg',
    status: 'APPROVED'
  }
];

export default function MediaSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.toLowerCase();
      if (h.includes('live') || h.includes('stream') || h.includes('broadcast') || h.includes('youtube')) {
        return 'BROADCAST';
      }
      if (h.includes('compendium') || h.includes('brochure') || h.includes('souvenir') || h.includes('print')) {
        return 'COMPENDIUM';
      }
      if (h.includes('photo') || h.includes('archive') || h.includes('throwback')) {
        return 'COMMUNITY_PHOTOS';
      }
    }
    return 'BROADCAST'; // Default to Broadcast while YouTube live stream is ongoing!
  });
  const [approvedPhotos, setApprovedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [, startTransition] = useTransition();

  // YouTube Live Stream States
  const [isPlayingLiveStream, setIsPlayingLiveStream] = useState(false);
  const [copiedStreamLink, setCopiedStreamLink] = useState(false);

  // Compendium Reader & Print States
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [readerPage, setReaderPage] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTabChange = useCallback((tab) => {
    if (tab === activeMediaTab) return;
    setTimeout(() => {
      startTransition(() => {
        setActiveMediaTab(tab);
      });
    }, 0);
  }, [activeMediaTab, startTransition]);

  const handleShareLiveStream = useCallback(async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ASF RSU 45th Jubilee Grand Sabbath Divine Service Live Stream',
          text: 'Watch the official ASF RSU 45th Anniversary Grand Jubilee Celebration & Homecoming streaming live on YouTube now!',
          url: YOUTUBE_LIVE_URL
        });
        return;
      } catch (err) {}
    }
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(YOUTUBE_LIVE_URL);
        setCopiedStreamLink(true);
        setTimeout(() => setCopiedStreamLink(false), 2500);
      }
    } catch (e) {}
  }, []);

  const handlePrintCompendium = useCallback(() => {
    // Open the optimized printable PDF in a new window/tab for instant browser printing
    const printWindow = window.open('/ASF_RSU_45th_Jubilee_Compendium.pdf', '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  }, []);

  const handleShareCompendium = useCallback(async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/#compendium` : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ASF RSU 45th Jubilee Official Compendium',
          text: 'Read and print the official 94-page 45th Anniversary Souvenir Compendium ("Rooted to Rise").',
          url: url
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch (e) {}
  }, []);

  const openReaderAtPage = useCallback((pageNum = 1) => {
    setReaderPage(pageNum);
    setShowReaderModal(true);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('live') || h.includes('stream') || h.includes('broadcast') || h.includes('youtube')) {
        setActiveMediaTab('BROADCAST');
      } else if (h.includes('compendium') || h.includes('brochure') || h.includes('souvenir') || h.includes('print')) {
        setActiveMediaTab('COMPENDIUM');
      } else if (h.includes('photo') || h.includes('archive') || h.includes('throwback')) {
        setActiveMediaTab('COMMUNITY_PHOTOS');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const fetchApprovedPhotos = useCallback(async () => {
    setLoadingPhotos(true);
    let list = [];

    // 1. Fetch from Supabase (Only APPROVED photos go live publicly)
    try {
      const { data, error } = await supabase
        .from('community_photos')
        .select('*')
        .eq('status', 'APPROVED')
        .order('approved_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        list = data;
      }
    } catch (e) {}

    // 2. Fetch from LocalStorage fallback
    try {
      const local = JSON.parse(localStorage.getItem('asf_community_photos') || '[]');
      const localApproved = local.filter(p => p.status === 'APPROVED');
      localApproved.forEach(item => {
        if (!list.some(p => p.submission_id === item.submission_id)) {
          list.push(item);
        }
      });
    } catch (e) {}

    // 3. Fallback baseline if empty
    if (list.length === 0) {
      list = FALLBACK_THROWBACKS;
    }

    setApprovedPhotos(list);
    setLoadingPhotos(false);
  }, []);

  useEffect(() => {
    fetchApprovedPhotos();
  }, [fetchApprovedPhotos]);

  return (
    <section id="media-hub" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative vintage-texture">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest mb-3">
            <Radio className="w-3.5 h-3.5 text-jubilee-gold animate-pulse" />
            <span>Broadcast, Media &amp; Living Archive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-white tracking-tight mb-3">
            Media Hub &amp; Living Memories
          </h2>
          <p className="text-emerald-100/75 text-sm sm:text-base font-light leading-relaxed px-2">
            Connecting our worldwide alumni family in high-definition and preserving 45 years of community photographs.
          </p>

          {/* Segmented Switcher */}
          <div 
            role="tablist"
            aria-label="Media Categories"
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-black/70 border border-jubilee-gold/40 backdrop-blur-md shadow-2xl max-w-full"
          >
            <button
              type="button"
              role="tab"
              id="media-tab-compendium"
              aria-selected={activeMediaTab === 'COMPENDIUM'}
              aria-controls="media-tabpanel-compendium"
              onClick={() => handleTabChange('COMPENDIUM')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-150 flex items-center space-x-2 touch-manipulation active:scale-95 ${
                activeMediaTab === 'COMPENDIUM'
                  ? 'bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 pointer-events-none" />
              <span className="pointer-events-none">Jubilee Compendium</span>
              <span className={`pointer-events-none px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight ${
                activeMediaTab === 'COMPENDIUM' ? 'bg-emerald-950/90 text-jubilee-lightgold' : 'bg-jubilee-gold/20 text-jubilee-lightgold border border-jubilee-gold/30'
              }`}>
                94 Pgs • Print &amp; PDF
              </span>
            </button>

            <button
              type="button"
              role="tab"
              id="media-tab-broadcast"
              aria-selected={activeMediaTab === 'BROADCAST'}
              aria-controls="media-tabpanel-broadcast"
              onClick={() => handleTabChange('BROADCAST')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-150 flex items-center space-x-2 touch-manipulation active:scale-95 ${
                activeMediaTab === 'BROADCAST'
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 text-white shadow-luxury'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5 pointer-events-none" />
              <span className="pointer-events-none">Live Stream &amp; Documentary</span>
              <span className={`pointer-events-none flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeMediaTab === 'BROADCAST' ? 'bg-black/40 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                <span>LIVE</span>
              </span>
            </button>

            <button
              type="button"
              role="tab"
              id="media-tab-photos"
              aria-selected={activeMediaTab === 'COMMUNITY_PHOTOS'}
              aria-controls="media-tabpanel-photos"
              onClick={() => handleTabChange('COMMUNITY_PHOTOS')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-150 flex items-center space-x-2 touch-manipulation active:scale-95 ${
                activeMediaTab === 'COMMUNITY_PHOTOS'
                  ? 'bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 pointer-events-none" />
              <span className="pointer-events-none">Living Archive</span>
              <span className={`pointer-events-none px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeMediaTab === 'COMMUNITY_PHOTOS' ? 'bg-emerald-950/90 text-jubilee-lightgold' : 'bg-white/10 text-jubilee-lightgold'
              }`}>
                {approvedPhotos.length}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: BROADCAST & DOCUMENTARY */}
        <div
          id="media-tabpanel-broadcast"
          role="tabpanel"
          aria-labelledby="media-tab-broadcast"
          aria-hidden={activeMediaTab !== 'BROADCAST'}
          className={activeMediaTab === 'BROADCAST' ? 'space-y-8 animate-fade-in' : 'hidden'}
        >
          {/* Media Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Main Video Showcase: YouTube Live Stream Player */}
            <div className="lg:col-span-8 bg-black/60 rounded-3xl overflow-hidden border-2 border-jubilee-gold/40 shadow-luxury flex flex-col justify-between group">
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {isPlayingLiveStream ? (
                  <iframe
                    src={YOUTUBE_EMBED_URL}
                    title="ASF RSU 45th Anniversary Official YouTube Live Stream"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div 
                    onClick={() => setIsPlayingLiveStream(true)}
                    className="relative w-full h-full flex items-center justify-center cursor-pointer group/player bg-[#072013]"
                  >
                    {/* YouTube High-Res Thumbnail Backdrop */}
                    <img
                      src="https://img.youtube.com/vi/VMCdL5WxFsE/hqdefault.jpg"
                      alt="ASF RSU 45th Jubilee YouTube Live Stream Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/player:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    <div className="relative text-center p-6 z-10 space-y-3">
                      {/* Live Indicator Pill */}
                      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest shadow-lg border border-red-400/40 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span>Official Live Stream • Broadcasting Now</span>
                      </div>

                      {/* Prominent Play Button */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-300 text-white flex items-center justify-center mx-auto shadow-2xl group-hover/player:scale-110 transition-transform duration-300 ring-4 ring-white/20">
                        <Play className="w-8 h-8 ml-1 fill-white text-white" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-retro font-bold text-white drop-shadow-md">
                        45th Jubilee Grand Celebration Live
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-200 font-light font-editorial italic max-w-md mx-auto">
                        Rivers State University Amphitheatre • Multi-Camera High-Definition Feed
                      </p>
                    </div>

                    {/* Status footer bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs text-stone-300 font-sans z-10">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                        <span className="font-semibold text-white">Live Stream Active on YouTube</span>
                      </div>
                      <span className="text-[11px] text-jubilee-gold font-mono font-bold">1080p HD BONDED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video metadata & action row */}
              <div className="p-4 sm:p-5 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      YouTube Live
                    </span>
                    <h4 className="text-sm font-bold text-white font-sans truncate">
                      45th Anniversary Homecoming &amp; Grand Cantata
                    </h4>
                  </div>
                  <p className="text-xs text-stone-400 font-light mt-0.5">
                    Live from Port Harcourt: Sabbath Divine Service, Compendium Dedication &amp; Sacred Reunion.
                  </p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
                  <a
                    href={YOUTUBE_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Watch on YouTube</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowVideoModal(true)}
                    className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-jubilee-lightgold text-xs font-medium border border-white/10 transition-all"
                    title="Open Cinema Modal Player"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Cinema</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareLiveStream}
                    className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-medium border border-white/10 transition-all"
                    title="Share Live Stream Link"
                  >
                    {copiedStreamLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-jubilee-gold" />
                    )}
                    <span className="hidden xs:inline">{copiedStreamLink ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Audio Jingle & Choir Teaser */}
            <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
              
              {/* Audio Jingle Player Card */}
              <div className="luxury-glass rounded-3xl p-6 shadow-luxury">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-jubilee-gold text-emerald-950">
                    <Volume2 className="w-4 h-4 text-emerald-950" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-sans">
                      Official 45th Audio Jingle
                    </h4>
                    <p className="text-[11px] text-emerald-300 font-light">
                      30-Second Studio Broadcast Mix
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  Produced radio announcement featuring choir harmonies and event highlights.
                </p>

                {/* Player Controls */}
                <div className="bg-black/40 rounded-2xl p-3.5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-jubilee-gold text-emerald-950 text-xs font-bold hover:bg-amber-300 transition-colors shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isPlayingAudio ? 'Pause' : 'Play Jingle'}</span>
                    </button>
                    <span className="text-[11px] font-mono text-stone-400">0:30 Studio</span>
                  </div>

                  {/* Waveform */}
                  <div className="flex items-center justify-between gap-1 h-6 px-1 pt-1">
                    {[40, 75, 50, 90, 30, 85, 60, 95, 45, 70, 80, 55, 90, 65, 40, 85, 50, 75, 60].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'bg-jubilee-gold animate-pulse' : 'bg-stone-600'
                        }`}
                        style={{ height: `${isPlayingAudio ? Math.min(100, h * 1.1) : 25}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Mass Choir Rehearsals Teaser */}
              <div className="luxury-glass rounded-3xl p-6 shadow-luxury">
                <span className="text-[10px] uppercase tracking-widest text-jubilee-gold font-bold block mb-1">
                  Behind The Scenes
                </span>
                <h4 className="text-base font-retro font-bold text-white mb-1.5">
                  Combined Mass Choir Cantata
                </h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed mb-3">
                  Choir alumni from four decades uniting voices for the grand Sabbath afternoon sacred concert.
                </p>
                <div className="text-[11px] font-semibold text-emerald-300 flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-jubilee-gold" />
                  <span>Rehearsals in progress</span>
                </div>
              </div>

            </div>

          </div>

          {/* Cross-Link Banner to Community Upload */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#072414] to-black/80 border border-jubilee-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 text-xs text-jubilee-lightgold font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Have Fellowship Throwback Photos?</span>
              </div>
              <h4 className="text-base sm:text-lg font-retro font-bold text-white">
                Preserve Your Memories in the Official 45-Year Living Archive
              </h4>
              <p className="text-xs text-stone-300 font-light">
                Upload vintage campus pictures, choir cantatas, and fellowship memories for permanent preservation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-jubilee-gold hover:bg-amber-300 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all shrink-0 flex items-center justify-center space-x-2"
            >
              <UploadCloud className="w-4 h-4 text-emerald-950" />
              <span>Upload Throwback Photo</span>
            </button>
          </div>
        </div>

        {/* TAB 2: COMMUNITY LIVING ARCHIVE */}
        <div
          id="media-tabpanel-photos"
          role="tabpanel"
          aria-labelledby="media-tab-photos"
          aria-hidden={activeMediaTab !== 'COMMUNITY_PHOTOS'}
          className={activeMediaTab === 'COMMUNITY_PHOTOS' ? 'space-y-8 animate-fade-in' : 'hidden'}
        >
          {/* Top Bar with Upload CTA and Moderation Badge */}
          <div className="luxury-glass rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="font-bold text-white text-base">Community Living Archive</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Media Screened</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Photographs submitted by alumni &amp; students, verified by the Central Planning Committee media team.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-jubilee-gold hover:bg-amber-300 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all shrink-0 flex items-center justify-center space-x-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Your Photo</span>
            </button>
          </div>

          {/* Approved Community Photo Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {approvedPhotos.map((photo, idx) => (
              <div 
                key={photo.submission_id || photo.id || idx}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-black/40 rounded-2xl overflow-hidden border border-white/10 hover:border-jubilee-gold/60 shadow-luxury transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:scale-[1.02]"
                style={{ contentVisibility: 'auto', containIntrinsicSize: '300px' }}
              >
                <div className="relative aspect-square overflow-hidden bg-emerald-950">
                  <img
                    src={photo.image_url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-jubilee-lightgold text-[9px] font-bold uppercase tracking-wider border border-white/15">
                    {photo.era || 'Heritage'}
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5 bg-black/60 border-t border-white/10">
                  <p className="text-xs font-serif italic text-white line-clamp-2">
                    "{photo.caption}"
                  </p>
                  <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-400">
                    <span className="text-jubilee-lightgold font-medium truncate max-w-[130px]">
                      {photo.contributor_name}
                    </span>
                    <span className="font-mono text-stone-500">
                      {photo.alumni_set}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Invitation Notice */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1 max-w-xl mx-auto">
            <span className="text-[11px] text-stone-300 font-light block">
              Do you have photos from 1981 to 2026? Upload them today to be featured in the 45th Anniversary Commemorative Souvenir Compendium!
            </span>
          </div>
        </div>

        {/* TAB: JUBILEE COMPENDIUM (PRINT & DOWNLOAD) */}
        <div
          id="media-tabpanel-compendium"
          role="tabpanel"
          aria-labelledby="media-tab-compendium"
          aria-hidden={activeMediaTab !== 'COMPENDIUM'}
          className={activeMediaTab === 'COMPENDIUM' ? 'space-y-12 animate-fade-in' : 'hidden'}
        >
          {/* Hero Showcase Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#072415] via-[#051A0F] to-[#0A2E1C] border-2 border-jubilee-gold/40 shadow-luxury overflow-hidden p-6 sm:p-10">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-jubilee-gold/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: 3D Book Cover Presentation */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div 
                  onClick={() => openReaderAtPage(1)}
                  className="group relative cursor-pointer transform hover:-translate-y-2 transition-all duration-300 max-w-[280px] sm:max-w-[320px] w-full"
                >
                  {/* Decorative book spine and shadow */}
                  <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.25)] border-2 border-jubilee-gold/60 bg-black">
                    <img 
                      src="/compendium_cover.jpg" 
                      alt="ASF RSU 45th Jubilee Compendium Cover - Rooted to Rise" 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Metallic sheen overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Ribbon badges */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md text-jubilee-lightgold text-[10px] font-bold uppercase tracking-wider border border-jubilee-gold/40 shadow-md">
                      45th Jubilee Edition
                    </div>

                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-jubilee-gold text-emerald-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      94 Pages A4
                    </div>

                    {/* Bottom hover prompt */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-center space-x-2 text-xs font-bold text-jubilee-lightgold group-hover:text-white transition-colors">
                      <Maximize2 className="w-3.5 h-3.5 text-jubilee-gold group-hover:scale-110 transition-transform" />
                      <span>Click to Read Fullscreen</span>
                    </div>
                  </div>

                  {/* Realistic Book Reflection Floor */}
                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-mono text-stone-400">
                      Standard ISO 216 A4 (210 × 297 mm) • Full Color
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Metadata & Action Suite */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Badge & Edition Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/40 text-[11px] font-bold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-jubilee-gold" />
                    <span>Official Commemorative Publication</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-stone-300 text-[11px] font-mono">
                    1981–2026 Consecration
                  </span>
                </div>

                {/* Main Heading */}
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-retro font-bold text-white tracking-tight leading-tight">
                    The 45th Jubilee Grand Souvenir Compendium
                  </h3>
                  <p className="text-xs sm:text-sm text-jubilee-lightgold font-editorial italic mt-2">
                    “Rooted and built up in Him, established in the faith, as ye have been taught, abounding therein with thanksgiving.” — Colossians 2:7
                  </p>
                </div>

                {/* Narrative Summary */}
                <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                  The complete 94-page monumental archive celebrating 45 years of All-Saints' Fellowship at Rivers State University. 
                  Featuring the complete 45-year fellowship chronicle, pioneer roll-call, anniversary planning directory, past presidential registers, 
                  pastoral exhortations, alumni testimonies, and permanent membership directory.
                </p>

                {/* Key Technical & Print Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-left">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Extent</div>
                    <div className="text-sm font-bold text-white font-sans mt-0.5">94 Pages</div>
                    <div className="text-[10px] text-emerald-400">Complete Edition</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Format</div>
                    <div className="text-sm font-bold text-white font-sans mt-0.5">ISO A4</div>
                    <div className="text-[10px] text-emerald-400">Printable PDF</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">File Size</div>
                    <div className="text-sm font-bold text-white font-sans mt-0.5">13.9 MB</div>
                    <div className="text-[10px] text-emerald-400">Fast Mobile Load</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Print Ready</div>
                    <div className="text-sm font-bold text-white font-sans mt-0.5">Full Bleed</div>
                    <div className="text-[10px] text-emerald-400">Press / Desktop</div>
                  </div>
                </div>

                {/* Action Suite (Print, Download, Read Online, Share) */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  {/* 1. Print Compendium */}
                  <button
                    type="button"
                    onClick={handlePrintCompendium}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury hover:scale-105 active:scale-95 transition-all touch-manipulation"
                    title="Send to physical printer or save as print PDF"
                  >
                    <Printer className="w-4 h-4 text-emerald-950" />
                    <span>Print Compendium</span>
                  </button>

                  {/* 2. Download to Device */}
                  <a
                    href="/ASF_RSU_45th_Jubilee_Compendium.pdf"
                    download="ASF_RSU_45th_Jubilee_Compendium.pdf"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 shadow-md active:scale-95 transition-all touch-manipulation"
                    title="Download the 94-page PDF to your phone, tablet or PC"
                  >
                    <ArrowDownToLine className="w-4 h-4 text-jubilee-gold" />
                    <span>Download PDF (13.9 MB)</span>
                  </a>

                  {/* 3. Read Fullscreen */}
                  <button
                    type="button"
                    onClick={() => openReaderAtPage(1)}
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-jubilee-lightgold font-bold text-xs uppercase tracking-wider border border-jubilee-gold/30 active:scale-95 transition-all touch-manipulation"
                    title="Open in interactive in-browser reader"
                  >
                    <Maximize2 className="w-4 h-4 text-jubilee-gold" />
                    <span>Read Online</span>
                  </button>

                  {/* 4. Share Link */}
                  <button
                    type="button"
                    onClick={handleShareCompendium}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-3.5 rounded-full bg-black/50 hover:bg-black/70 text-stone-300 hover:text-white font-medium text-xs border border-white/10 active:scale-95 transition-all"
                    title="Share this publication link with fellowship alumni"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-jubilee-gold" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* Curated Chapter Directory & Quick Navigator */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-jubilee-gold uppercase tracking-wider block">
                  Table of Contents &amp; Milestones
                </span>
                <h4 className="text-xl sm:text-2xl font-retro font-bold text-white">
                  Curated Chapter Directory
                </h4>
              </div>
              <p className="text-xs text-stone-400 font-light max-w-md">
                Click any chapter to jump directly to its pages in the interactive reader or print that specific section.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {COMPENDIUM_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  onClick={() => openReaderAtPage(section.pageNumber)}
                  className="bg-black/50 rounded-2xl overflow-hidden border border-white/10 hover:border-jubilee-gold/60 shadow-luxury transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:scale-[1.02]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-emerald-950">
                    <img
                      src={section.thumb}
                      alt={section.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Page badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-jubilee-lightgold text-[10px] font-mono font-bold border border-jubilee-gold/30">
                      {section.pageLabel}
                    </div>

                    {/* Tag badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-900/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-white/20">
                      {section.tag}
                    </div>

                    <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-xs text-stone-300">
                      <span className="text-[10px] font-mono text-jubilee-gold">Page {section.pageNumber}</span>
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-white group-hover:text-jubilee-lightgold transition-colors">
                        <span>Read Chapter</span>
                        <ChevronRight className="w-3.5 h-3.5 text-jubilee-gold transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 bg-black/60 border-t border-white/10 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-jubilee-lightgold transition-colors">
                        {section.title}
                      </h5>
                      <p className="text-xs text-stone-400 font-light mt-1 line-clamp-2">
                        {section.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 font-mono">
                        A4 Full Resolution
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReaderAtPage(section.pageNumber);
                        }}
                        className="text-[11px] text-jubilee-gold hover:text-amber-300 font-bold flex items-center space-x-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Jump</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Site & Device Printing Guide Banner */}
          <div className="rounded-3xl bg-emerald-950/40 border border-jubilee-gold/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2 text-jubilee-gold">
              <Printer className="w-5 h-5 shrink-0" />
              <h4 className="text-base sm:text-lg font-bold font-retro text-white">
                How to Print or Keep Offline on Your Device
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light text-stone-300">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-jubilee-lightgold font-bold">
                  <span className="w-5 h-5 rounded-full bg-jubilee-gold/20 flex items-center justify-center text-[10px] font-mono text-jubilee-gold">1</span>
                  <span>On-Site RSU Homecoming Printing</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-300">
                  Attendees at the RSU Amphitheatre can have physical copies bound at the Media Registration Desk or send the PDF to any Wi-Fi/Bluetooth enabled printer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-jubilee-lightgold font-bold">
                  <span className="w-5 h-5 rounded-full bg-jubilee-gold/20 flex items-center justify-center text-[10px] font-mono text-jubilee-gold">2</span>
                  <span>Home &amp; Office Booklet Settings</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-300">
                  Select <strong>A4 Paper</strong>, set <strong>"Fit to Printable Area"</strong>, and choose <strong>"Print on Both Sides (Flip on short edge)"</strong> to produce a neat 47-sheet keepsake booklet.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-jubilee-lightgold font-bold">
                  <span className="w-5 h-5 rounded-full bg-jubilee-gold/20 flex items-center justify-center text-[10px] font-mono text-jubilee-gold">3</span>
                  <span>Direct Mobile Offline Storage</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-300">
                  Tap <strong>Download PDF</strong> and save to <em>Apple Books</em> (iPhone/iPad) or <em>Files / Google Drive</em> (Android/PC) for lifetime offline reference without data usage.
                </p>
              </div>
            </div>

            {/* Quick action button inside guide */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[11px] text-stone-400 font-mono">
                Official Document ID: <strong className="text-jubilee-lightgold">ASF-RSU-45TH-COMPENDIUM-2026</strong>
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handlePrintCompendium}
                  className="text-xs font-bold text-jubilee-gold hover:text-amber-300 flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Launch Print Dialog</span>
                </button>
                <a
                  href="/ASF_RSU_45th_Jubilee_Compendium.pdf"
                  download="ASF_RSU_45th_Jubilee_Compendium.pdf"
                  className="text-xs font-bold text-white hover:text-jubilee-lightgold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Copy</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Official Media & Broadcast Schedule Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-[#051A0F] border-2 border-jubilee-gold/50 rounded-2xl sm:rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative text-white space-y-4 max-h-[95vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono shrink-0">
                  LIVE BROADCAST
                </span>
                <span className="text-xs text-stone-500 hidden sm:inline">|</span>
                <span className="text-xs text-stone-300 font-sans truncate hidden sm:inline">
                  RSU Amphitheatre, Port Harcourt
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={YOUTUBE_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>Open in YouTube App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Responsive 16:9 YouTube Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-jubilee-gold/40 bg-black shadow-2xl">
              <iframe
                src={YOUTUBE_EMBED_URL}
                title="Official 45th Anniversary Grand Jubilee YouTube Live Stream"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Broadcast Details and Schedule */}
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-retro">
                  ASF RSU 45th Anniversary Homecoming &amp; Grand Dedication
                </h4>
                <p className="text-xs text-stone-300 font-light">
                  Theme: "Rooted to Rise" (Isaiah 61:3 • Colossians 2:7) — Connecting campus congregation &amp; global diaspora family.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleShareLiveStream}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-jubilee-lightgold font-bold text-xs flex items-center justify-center space-x-1.5 border border-white/10 transition-all"
                >
                  {copiedStreamLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-jubilee-gold" />}
                  <span>{copiedStreamLink ? 'Link Copied' : 'Share Broadcast'}</span>
                </button>

                <button
                  onClick={() => setShowVideoModal(false)}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Photo Lightbox Preview Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="bg-[#051A0F] border border-jubilee-gold/40 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-white space-y-4 max-h-[92vh] overflow-y-auto my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-jubilee-gold uppercase tracking-wider block">
                  {selectedPhoto.era}
                </span>
                <h4 className="text-sm sm:text-base font-retro font-bold text-white mt-0.5">
                  Contributed by {selectedPhoto.contributor_name}
                </h4>
                {selectedPhoto.alumni_set && (
                  <span className="text-[11px] text-stone-400">
                    {selectedPhoto.alumni_set}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-square sm:aspect-video flex items-center justify-center max-h-[55vh]">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-jubilee-lightgold block">Memory Story / Caption:</span>
              <p className="text-xs font-serif text-stone-200 italic leading-relaxed">
                "{selectedPhoto.caption}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>Ref: {selectedPhoto.submission_id}</span>
              <span className="text-emerald-400 font-sans font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified in Fellowship Living Archive</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Community Photo Upload Modal */}
      {showUploadModal && (
        <CommunityPhotoUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={() => {
            fetchApprovedPhotos();
          }}
        />
      )}

      {/* Official Fullscreen Interactive Compendium Reader Modal */}
      {showReaderModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Official 45th Anniversary Compendium Reader"
        >
          {/* Reader Top Bar */}
          <div className="bg-[#051A0F] border-b border-jubilee-gold/40 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shrink-0 shadow-lg">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-jubilee-gold/20 border border-jubilee-gold/40 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-jubilee-gold" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-retro font-bold text-white truncate">
                  ASF RSU 45th Jubilee Compendium ("Rooted to Rise")
                </h4>
                <p className="text-[10px] text-stone-400 font-mono hidden xs:block">
                  94 Pages • Complete A4 Souvenir Publication
                </p>
              </div>
            </div>

            {/* Middle Quick Jump dropdown */}
            <div className="hidden md:flex items-center space-x-2">
              <label htmlFor="compendium-chapter-jump" className="text-[11px] text-stone-300 uppercase font-mono">
                Jump to:
              </label>
              <select
                id="compendium-chapter-jump"
                value={readerPage}
                onChange={(e) => setReaderPage(Number(e.target.value))}
                className="bg-black/80 border border-jubilee-gold/40 text-jubilee-lightgold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-jubilee-gold"
              >
                <option value={1}>Page 1: Front Cover</option>
                {COMPENDIUM_SECTIONS.map((sec) => (
                  <option key={sec.id} value={sec.pageNumber}>
                    {sec.pageLabel}: {sec.title}
                  </option>
                ))}
                <option value={94}>Page 94: Back Cover</option>
              </select>
            </div>

            {/* Right Action Suite */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <button
                type="button"
                onClick={handlePrintCompendium}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-jubilee-gold text-emerald-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all"
                title="Print Compendium"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-950" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <a
                href="/ASF_RSU_45th_Jubilee_Compendium.pdf"
                download="ASF_RSU_45th_Jubilee_Compendium.pdf"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 active:scale-95 transition-all"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5 text-jubilee-gold" />
                <span className="hidden sm:inline">Download</span>
              </a>

              <a
                href={`/ASF_RSU_45th_Jubilee_Compendium.pdf#page=${readerPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
                title="Open in new browser tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setShowReaderModal(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-red-500/30 text-stone-300 hover:text-white transition-colors"
                title="Close Reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reader Frame Body */}
          <div className="flex-1 relative bg-[#1E2522] overflow-hidden flex flex-col">
            <iframe
              key={`reader-iframe-${readerPage}`}
              src={`/ASF_RSU_45th_Jubilee_Compendium.pdf#page=${readerPage}&view=FitH`}
              title="Official 45th Anniversary Compendium Document Viewer"
              className="w-full flex-1 border-0"
            />

            {/* Mobile Fallback Bar */}
            <div className="sm:hidden bg-[#051A0F] border-t border-white/10 p-2.5 flex items-center justify-between text-xs text-stone-300">
              <span className="text-[11px] text-stone-400">Viewing Page {readerPage} of 94</span>
              <div className="flex items-center space-x-2">
                <a
                  href={`/ASF_RSU_45th_Jubilee_Compendium.pdf#page=${readerPage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-jubilee-gold text-emerald-950 font-bold text-[11px]"
                >
                  Open Full PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
