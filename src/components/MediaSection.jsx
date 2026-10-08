import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { 
  Play, Volume2, Radio, X, Tv, Bell, UploadCloud, 
  Image as ImageIcon, Sparkles, ShieldCheck, Heart, User, Calendar, ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import CommunityPhotoUploadModal from './CommunityPhotoUploadModal';

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
  const [activeMediaTab, setActiveMediaTab] = useState('BROADCAST'); // 'BROADCAST' | 'COMMUNITY_PHOTOS'
  const [approvedPhotos, setApprovedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [, startTransition] = useTransition();

  const handleTabChange = useCallback((tab) => {
    if (tab === activeMediaTab) return;
    startTransition(() => {
      setActiveMediaTab(tab);
    });
  }, [activeMediaTab]);

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
            className="mt-6 inline-flex p-1 rounded-full bg-black/60 border border-jubilee-gold/40 backdrop-blur-md shadow-lg max-w-full"
          >
            <button
              type="button"
              role="tab"
              id="media-tab-broadcast"
              aria-selected={activeMediaTab === 'BROADCAST'}
              aria-controls="media-tabpanel-broadcast"
              onClick={() => handleTabChange('BROADCAST')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-150 flex items-center space-x-2 touch-manipulation active:scale-95 ${
                activeMediaTab === 'BROADCAST'
                  ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Broadcast &amp; Documentary</span>
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
                  ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Community Living Archive</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-jubilee-lightgold font-mono font-bold">
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
            
            {/* Main Video Showcase */}
            <div 
              onClick={() => setShowVideoModal(true)}
              className="lg:col-span-8 bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-luxury flex flex-col justify-between group cursor-pointer hover:border-jubilee-gold/40 transition-all"
            >
              <div className="relative aspect-video bg-[#072013] flex items-center justify-center overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div className="relative text-center p-6 z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-jubilee-gold to-amber-300 text-emerald-950 flex items-center justify-center mx-auto mb-4 shadow-luxury group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 ml-1 text-emerald-950 fill-current" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/90 text-jubilee-lightgold text-[10px] font-bold uppercase tracking-widest mb-2 border border-jubilee-gold/30">
                    Broadcast Horizon • Nov 13–15, 2026
                  </span>
                  <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
                    45th Anniversary Teaser Trailer
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto font-light font-editorial italic text-base">
                    “45 Years of Faith at Rivers State University”
                  </p>
                </div>

                {/* Status footer bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs text-stone-300 font-sans">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Bonded Multi-Camera Stream Feed</span>
                  </div>
                  <span className="text-[11px] text-jubilee-gold font-mono">1080p HD</span>
                </div>
              </div>

              {/* Video metadata row */}
              <div className="p-5 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white font-sans">
                    Institutional Courtesy Visit Coverage
                  </h4>
                  <p className="text-xs text-stone-400 font-light mt-0.5">
                    ASF Alumni delegation visit to the Vice-Chancellor (VC) &amp; University Chaplaincy.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-jubilee-lightgold shrink-0">
                  Official Release
                </span>
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

      </div>

      {/* Official Media & Broadcast Schedule Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#051A0F] border-2 border-jubilee-gold/50 rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl relative text-white text-center space-y-4 max-h-[92vh] overflow-y-auto my-auto">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-jubilee-gold/40 text-jubilee-gold flex items-center justify-center mx-auto shadow-luxury">
              <Tv className="w-8 h-8 text-jubilee-gold" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-jubilee-gold animate-pulse" />
              <span>Official 45th Live Broadcast Channel</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
              Live Stream &amp; Documentary Center
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              The official multi-camera high-definition livestream will broadcast live from the RSU Amphitheatre starting <strong>Friday, November 13, 2026</strong>.
            </p>

            <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2 font-sans">
              <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                <Bell className="w-4 h-4 text-jubilee-gold shrink-0" />
                <span>Streaming Schedule (Port Harcourt Local Time):</span>
              </div>
              <ul className="text-stone-300 space-y-1 pl-6 list-disc text-[11px]">
                <li><strong>Nov 13 (6:00 PM):</strong> Opening Sunset Vespers</li>
                <li><strong>Nov 14 (8:30 AM):</strong> Grand Jubilee Sabbath Service &amp; Roll Call</li>
                <li><strong>Nov 14 (4:00 PM):</strong> Combined 4-Decade Mass Choir Cantata</li>
                <li><strong>Nov 15 (10:00 AM):</strong> Alumni Legacy Banquet &amp; Awards</li>
              </ul>
            </div>

            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all"
            >
              Close Window
            </button>
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

    </section>
  );
}
