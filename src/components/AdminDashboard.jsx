import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Shield, Lock, Search, Filter, Download, CheckCircle, XCircle, 
  Users, UserCheck, HeartHandshake, RefreshCw, Eye, ArrowLeft,
  Calendar, Phone, Mail, MapPin, Award, Check, Globe, Trash2,
  Video, Play, Sparkles, Building2, ExternalLink
} from 'lucide-react';
import { getMailtoLink } from '../lib/emailService';

export default function AdminDashboard({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'PHYSICAL' | 'VIRTUAL'
  const [filterSupport, setFilterSupport] = useState('ALL'); // 'ALL' | 'SUPPORT_ONLY'
  const [filterCheckin, setFilterCheckin] = useState('ALL'); // 'ALL' | 'CHECKED_IN' | 'PENDING'
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // New admin tabs: 'REGISTRATIONS' | 'SPONSORSHIPS' | 'VIDEOS'
  const [activeAdminTab, setActiveAdminTab] = useState('REGISTRATIONS');
  const [sponsorships, setSponsorships] = useState([]);
  const [videoSubmissions, setVideoSubmissions] = useState([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);

  // Check if admin is already logged in for this session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('asf_cpc_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default CPC Passcode (case-insensitive)
    const validCodes = ['ASF45TH-CPC', 'JUBILEE2026', 'ROOTEDTORISE'];
    if (validCodes.includes(passcode.trim().toUpperCase())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('asf_cpc_admin_auth', 'true');
      setAuthError('');
      fetchAllData();
    } else {
      setAuthError('Invalid CPC Master Passcode. Please check with the Central Planning Committee.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('asf_cpc_admin_auth');
  };

  const fetchAllData = () => {
    fetchRegistrations();
    fetchSponsorships();
    fetchVideoSubmissions();
  };

  const fetchSponsorships = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsorship_payments')
        .select('*')
        .order('created_at', { ascending: false });

      const local = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
      const combined = [...(data || [])];
      local.forEach(item => {
        if (!combined.some(c => c.reference === item.reference)) {
          combined.push(item);
        }
      });
      setSponsorships(combined);
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
      setSponsorships(local);
    }
  };

  const fetchVideoSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('video_goodwill_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      const local = JSON.parse(localStorage.getItem('asf_goodwill_videos') || '[]');
      const combined = [...(data || [])];
      local.forEach(item => {
        if (!combined.some(c => c.submission_id === item.submission_id)) {
          combined.push(item);
        }
      });
      setVideoSubmissions(combined);
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('asf_goodwill_videos') || '[]');
      setVideoSubmissions(local);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alumni_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error.message);
      } else {
        setRegistrations(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Check-in status (For on-ground accreditation)
  const toggleCheckIn = async (attendee) => {
    setUpdatingId(attendee.id);
    const newStatus = !attendee.checked_in;
    const now = newStatus ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('alumni_registrations')
        .update({ checked_in: newStatus, checked_in_at: now })
        .eq('id', attendee.id);

      if (!error) {
        setRegistrations(prev =>
          prev.map(r => r.id === attendee.id ? { ...r, checked_in: newStatus, checked_in_at: now } : r)
        );
        if (selectedAttendee?.id === attendee.id) {
          setSelectedAttendee(prev => ({ ...prev, checked_in: newStatus, checked_in_at: now }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete attendee (For purging test data or duplicates)
  const deleteAttendee = async (attendee) => {
    if (!window.confirm(`Are you sure you want to delete the registration for "${attendee.full_name}" (${attendee.registration_tag})?`)) {
      return;
    }
    setUpdatingId(attendee.id);
    try {
      const { error } = await supabase
        .from('alumni_registrations')
        .delete()
        .eq('id', attendee.id);

      if (error) {
        alert('Notice: ' + error.message);
      } else {
        setRegistrations(prev => prev.filter(r => r.id !== attendee.id));
        if (selectedAttendee?.id === attendee.id) {
          setSelectedAttendee(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      'Registration Tag',
      'Full Name',
      'Maiden Name',
      'Grad Year',
      'Cohort Era',
      'Department',
      'Phone (WhatsApp)',
      'Email',
      'City',
      'Country',
      'Profession',
      'Fellowship Roles',
      'Attendance Mode',
      'Arrival Date',
      'Willing to Support',
      'Support Category',
      'Support Pledge',
      'Checked In',
      'Checked In At',
      'Registration Date',
      'Tribute Quote'
    ];

    const rows = registrations.map(r => [
      `"${r.registration_tag || ''}"`,
      `"${r.full_name || ''}"`,
      `"${r.maiden_name || ''}"`,
      r.grad_year || '',
      `"${r.cohort_era || ''}"`,
      `"${r.department || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${r.city || ''}"`,
      `"${r.country || ''}"`,
      `"${r.current_profession || ''}"`,
      `"${r.fellowship_roles || ''}"`,
      r.attendance_mode || '',
      r.arrival_date || '',
      r.willing_to_support ? 'YES' : 'NO',
      `"${r.support_category || ''}"`,
      `"${r.support_pledge || ''}"`,
      r.checked_in ? 'YES' : 'NO',
      r.checked_in_at ? new Date(r.checked_in_at).toLocaleString() : '',
      r.created_at ? new Date(r.created_at).toLocaleString() : '',
      `"${(r.tribute_quote || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ASF-RSU-45th-Alumni-Registrations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        (r.full_name && r.full_name.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.city && r.city.toLowerCase().includes(q)) ||
        (r.registration_tag && r.registration_tag.toLowerCase().includes(q)) ||
        (r.grad_year && String(r.grad_year).includes(q));

      const matchesMode = 
        filterMode === 'ALL' || r.attendance_mode === filterMode;

      const matchesSupport = 
        filterSupport === 'ALL' || (filterSupport === 'SUPPORT_ONLY' && r.willing_to_support);

      const matchesCheckin = 
        filterCheckin === 'ALL' || 
        (filterCheckin === 'CHECKED_IN' && r.checked_in) ||
        (filterCheckin === 'PENDING' && !r.checked_in);

      return matchesSearch && matchesMode && matchesSupport && matchesCheckin;
    });
  }, [registrations, searchQuery, filterMode, filterSupport, filterCheckin]);

  // Executive Metrics
  const stats = useMemo(() => {
    const total = registrations.length;
    const physical = registrations.filter(r => r.attendance_mode === 'PHYSICAL').length;
    const virtual = registrations.filter(r => r.attendance_mode === 'VIRTUAL').length;
    const sponsors = registrations.filter(r => r.willing_to_support).length;
    const checkedIn = registrations.filter(r => r.checked_in).length;

    return { total, physical, virtual, sponsors, checkedIn };
  }, [registrations]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#051A0F] text-white flex items-center justify-center p-4 vintage-texture">
        <div className="max-w-md w-full bg-white/[0.04] backdrop-blur-xl border border-jubilee-gold/40 rounded-3xl p-8 sm:p-10 shadow-luxury text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-jubilee-gold to-transparent"></div>
          
          <img
            src="/official-logo.png"
            alt="ASF RSU 45th Logo"
            className="w-16 h-16 mx-auto object-contain mb-4"
          />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest mb-3">
            <Shield className="w-3.5 h-3.5 text-jubilee-gold" />
            <span>CPC Secretariat</span>
          </div>

          <h2 className="text-2xl font-retro font-bold text-white mb-2">
            Executive Portal
          </h2>
          <p className="text-xs text-stone-300 font-light mb-6">
            Enter the Central Planning Committee Master Passcode to access live registration data and on-ground accreditation.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 text-jubilee-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter CPC Passcode"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-jubilee-gold transition-colors font-mono"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium text-left">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-[1.02] active:scale-95 transition-all font-sans"
            >
              Access Admin Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <button
              onClick={onBackToSite}
              className="hover:text-jubilee-lightgold inline-flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
            <span className="text-[11px] text-stone-500 font-mono">Passcode: ASF45TH-CPC</span>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#071F13] text-white vintage-texture font-sans pb-16">
      
      {/* Top Header */}
      <header className="bg-black/60 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <img
              src="/official-logo.png"
              alt="Logo"
              className="h-7 sm:h-10 w-auto object-contain shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-retro font-bold text-white text-sm sm:text-base truncate">ASF RSU Admin</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase shrink-0">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 font-light hidden sm:block truncate">
                45th Jubilee Registration Directory &amp; Accreditation Console
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              title="Refresh Records"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10 touch-manipulation active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-jubilee-gold' : ''}`} />
            </button>

            <button
              onClick={exportToCSV}
              title="Export CSV"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-jubilee-gold/40 text-jubilee-lightgold transition-all touch-manipulation active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-jubilee-gold" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTimeout(onBackToSite, 0);
              }}
              title="Back to Site"
              className="inline-flex items-center space-x-1 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors touch-manipulation active:scale-95 cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 pointer-events-none" />
              <span className="hidden sm:inline pointer-events-none">Back to Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors touch-manipulation active:scale-95"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-5 sm:space-y-8">
        
        {/* Admin Navigation Tabs */}
        <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('REGISTRATIONS')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeAdminTab === 'REGISTRATIONS'
                ? 'bg-jubilee-gold text-emerald-950 shadow-luxury'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Users className={`w-3.5 h-3.5 shrink-0 ${activeAdminTab === 'REGISTRATIONS' ? 'text-emerald-950' : 'text-jubilee-gold'}`} />
            <span>Alumni Directory &amp; RSVP</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeAdminTab === 'REGISTRATIONS'
                ? 'bg-emerald-950/20 text-emerald-950'
                : 'bg-white/10 text-stone-300'
            }`}>
              {registrations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('SPONSORSHIPS')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeAdminTab === 'SPONSORSHIPS'
                ? 'bg-jubilee-gold text-emerald-950 shadow-luxury'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Award className={`w-3.5 h-3.5 shrink-0 ${activeAdminTab === 'SPONSORSHIPS' ? 'text-emerald-950' : 'text-jubilee-gold'}`} />
            <span>Sponsorships &amp; Payments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeAdminTab === 'SPONSORSHIPS'
                ? 'bg-emerald-950/20 text-emerald-950'
                : 'bg-white/10 text-stone-300'
            }`}>
              {sponsorships.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('VIDEOS')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeAdminTab === 'VIDEOS'
                ? 'bg-jubilee-gold text-emerald-950 shadow-luxury'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Video className={`w-3.5 h-3.5 shrink-0 ${activeAdminTab === 'VIDEOS' ? 'text-emerald-950' : 'text-jubilee-gold'}`} />
            <span>Goodwill Video Messages</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeAdminTab === 'VIDEOS'
                ? 'bg-emerald-950/20 text-emerald-950'
                : 'bg-white/10 text-stone-300'
            }`}>
              {videoSubmissions.length}
            </span>
          </button>
        </div>

        {activeAdminTab === 'REGISTRATIONS' && (
          <div className="space-y-5 sm:space-y-8">
            {/* Metric Cards Banner (Optimized 2-col on mobile with 5th card spanning full) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
              
              <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="text-[11px] sm:text-xs">Total Alumni</span>
              <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-jubilee-gold" />
            </div>
            <div className="text-xl sm:text-3xl font-retro font-black text-white">
              {stats.total}
            </div>
            <div className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 truncate">Registered Worldwide</div>
          </div>

          <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
              <span className="text-[11px] sm:text-xs">Physical (RSU)</span>
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-3xl font-retro font-black text-emerald-300">
              {stats.physical}
            </div>
            <div className="text-[9px] sm:text-[10px] text-emerald-200/70 mt-0.5 truncate">Campus Delegates</div>
          </div>

          <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="text-[11px] sm:text-xs">Virtual Diaspora</span>
              <Globe className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-sky-400" />
            </div>
            <div className="text-xl sm:text-3xl font-retro font-black text-sky-300">
              {stats.virtual}
            </div>
            <div className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 truncate">Online HD Stream</div>
          </div>

          <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-jubilee-gold/40 bg-jubilee-gold/5">
            <div className="flex items-center justify-between text-xs text-jubilee-lightgold mb-1">
              <span className="text-[11px] sm:text-xs">Sponsors</span>
              <HeartHandshake className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-jubilee-gold" />
            </div>
            <div className="text-xl sm:text-3xl font-retro font-black text-jubilee-gold">
              {stats.sponsors}
            </div>
            <div className="text-[9px] sm:text-[10px] text-jubilee-lightgold/70 mt-0.5 truncate">Partners &amp; Pledges</div>
          </div>

          <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-teal-500/40 bg-teal-950/20 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-teal-300 mb-1">
              <span className="text-[11px] sm:text-xs">Checked In</span>
              <UserCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-teal-400" />
            </div>
            <div className="text-xl sm:text-3xl font-retro font-black text-teal-300">
              {stats.checkedIn}
            </div>
            <div className="text-[9px] sm:text-[10px] text-teal-200/70 mt-0.5 truncate">Accredited on Ground</div>
          </div>

        </div>

        {/* Filter and Search Bar (Responsive Grid on Mobile) */}
        <div className="luxury-glass rounded-2xl p-3.5 sm:p-5 border border-white/10 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, email, set, tag..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-jubilee-gold"
            />
          </div>

          {/* Filter Dropdowns & Export */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
            >
              <option value="ALL">All Modes</option>
              <option value="PHYSICAL">Physical Only</option>
              <option value="VIRTUAL">Virtual Only</option>
            </select>

            <select
              value={filterSupport}
              onChange={(e) => setFilterSupport(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
            >
              <option value="ALL">All Registrants</option>
              <option value="SUPPORT_ONLY">Sponsors Only</option>
            </select>

            <select
              value={filterCheckin}
              onChange={(e) => setFilterCheckin(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
            >
              <option value="ALL">All Status</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="PENDING">Pending</option>
            </select>

            <button
              onClick={exportToCSV}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Export CSV</span>
            </button>
          </div>

        </div>

        {/* Registrations List */}
        <div className="luxury-glass rounded-3xl border border-white/10 shadow-luxury overflow-hidden">
          
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-retro font-bold text-base sm:text-lg text-white">
                Alumni Roll Call Directory
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 font-mono">
                {filteredRegistrations.length} {filteredRegistrations.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            {loading && (
              <span className="text-xs text-jubilee-lightgold flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing with Supabase...</span>
              </span>
            )}
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-stone-400">
              <Users className="w-10 sm:w-12 h-10 sm:h-12 mx-auto text-stone-600 mb-3" />
              <p className="text-sm font-medium">No registrations match your search filter.</p>
              <p className="text-xs text-stone-500 mt-1">Registrations submitted through the main portal will appear here in real time.</p>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Full Data Table (Hidden on Mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-black/40 text-stone-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-sans">
                    <tr>
                      <th className="px-4 py-3.5">Tag &amp; Name</th>
                      <th className="px-4 py-3.5">Set &amp; Era</th>
                      <th className="px-4 py-3.5">Contact &amp; Location</th>
                      <th className="px-4 py-3.5">Attendance</th>
                      <th className="px-4 py-3.5">Sponsorship</th>
                      <th className="px-4 py-3.5 text-center">Accreditation</th>
                      <th className="px-4 py-3.5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-stone-200">
                    {filteredRegistrations.map((attendee) => (
                      <tr 
                        key={attendee.id}
                        className="hover:bg-white/[0.04] transition-colors"
                      >
                        {/* Name & Tag */}
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white text-sm">
                            {attendee.full_name}
                          </div>
                          {attendee.maiden_name && (
                            <div className="text-[11px] text-stone-400">
                              née {attendee.maiden_name}
                            </div>
                          )}
                          <span className="inline-block mt-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-jubilee-lightgold">
                            {attendee.registration_tag}
                          </span>
                        </td>

                        {/* Set & Era */}
                        <td className="px-4 py-3.5">
                          <div className="font-retro font-bold text-jubilee-gold text-sm">
                            Set of {attendee.grad_year}
                          </div>
                          <div className="text-[11px] text-stone-400 line-clamp-1">
                            {attendee.department}
                          </div>
                          <div className="text-[10px] text-emerald-300 font-light mt-0.5">
                            {attendee.cohort_era}
                          </div>
                        </td>

                        {/* Contact & Location */}
                        <td className="px-4 py-3.5 font-sans">
                          <div className="flex items-center space-x-1.5 text-xs text-white">
                            <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                            <a 
                              href={`https://wa.me/${attendee.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="hover:text-emerald-400 hover:underline"
                            >
                              {attendee.phone}
                            </a>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[11px] text-stone-400 mt-0.5">
                            <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{attendee.email}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[11px] text-stone-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                            <span>{attendee.city}, {attendee.country}</span>
                          </div>
                        </td>

                        {/* Attendance Mode */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            attendee.attendance_mode === 'PHYSICAL'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          }`}>
                            {attendee.attendance_mode}
                          </span>
                        </td>

                        {/* Sponsorship */}
                        <td className="px-4 py-3.5">
                          {attendee.willing_to_support ? (
                            <div>
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-jubilee-gold/20 text-jubilee-gold text-[10px] font-bold border border-jubilee-gold/30">
                                <Award className="w-2.5 h-2.5" />
                                <span>Sponsor</span>
                              </span>
                              {attendee.support_pledge && (
                                <div className="text-[11px] text-emerald-200 mt-1 font-mono">
                                  {attendee.support_pledge}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-stone-500 text-xs">—</span>
                          )}
                        </td>

                        {/* Accreditation Check-In Action */}
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => toggleCheckIn(attendee)}
                            disabled={updatingId === attendee.id}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              attendee.checked_in
                                ? 'bg-teal-500 text-emerald-950 hover:bg-teal-400 shadow-sm'
                                : 'bg-white/10 text-stone-300 hover:bg-white/20 border border-white/20'
                            }`}
                          >
                            {attendee.checked_in ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Checked In</span>
                              </>
                            ) : (
                              <span>Check In</span>
                            )}
                          </button>
                        </td>

                        {/* Details & Actions View */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => setSelectedAttendee(attendee)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-jubilee-lightgold transition-colors inline-block"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAttendee(attendee)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800/40 transition-colors inline-block"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Dedicated Card List (Visible on < md screens) */}
              <div className="block md:hidden divide-y divide-white/[0.06] p-2.5 sm:p-3 space-y-3">
                {filteredRegistrations.map((attendee) => (
                  <div key={attendee.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 shadow-md">
                    {/* Top Row: Tag + Attendance + Status */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 border border-white/15 text-jubilee-lightgold">
                          {attendee.registration_tag}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          attendee.attendance_mode === 'PHYSICAL'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        }`}>
                          {attendee.attendance_mode}
                        </span>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        attendee.checked_in
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-stone-500/20 text-stone-400 border border-stone-500/30'
                      }`}>
                        {attendee.checked_in && <Check className="w-2.5 h-2.5" />}
                        <span>{attendee.checked_in ? 'Checked In' : 'Pending'}</span>
                      </span>
                    </div>

                    {/* Full Name & Set Info */}
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">
                        {attendee.full_name}
                      </h4>
                      {attendee.maiden_name && (
                        <p className="text-xs text-stone-400 mt-0.5">née {attendee.maiden_name}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-300 mt-1">
                        <span className="font-retro font-bold text-jubilee-gold">Set of {attendee.grad_year}</span>
                        <span>•</span>
                        <span className="text-stone-300 truncate max-w-[200px]">{attendee.department}</span>
                      </div>
                      <div className="text-[10px] text-emerald-300 font-light mt-0.5">
                        {attendee.cohort_era}
                      </div>
                    </div>

                    {/* Contact & Location Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-white/[0.06]">
                      <div className="flex items-center space-x-1.5 text-stone-300 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <a
                          href={`https://wa.me/${attendee.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-400 hover:underline truncate font-mono text-[11px]"
                        >
                          {attendee.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-1.5 text-stone-300 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate text-[11px]">{attendee.city}, {attendee.country}</span>
                      </div>
                    </div>

                    {/* Sponsorship Banner if Sponsor */}
                    {attendee.willing_to_support && (
                      <div className="px-3 py-1.5 rounded-xl bg-jubilee-gold/10 border border-jubilee-gold/30 text-xs text-jubilee-lightgold flex items-center justify-between gap-2">
                        <span className="inline-flex items-center space-x-1 font-bold text-[11px] shrink-0">
                          <Award className="w-3 h-3 text-jubilee-gold shrink-0" />
                          <span>Sponsor</span>
                        </span>
                        {attendee.support_pledge && (
                          <span className="font-mono text-[11px] text-emerald-200 truncate">
                            {attendee.support_pledge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Touch-Friendly Action Bar */}
                    <div className="flex items-center space-x-2 pt-2.5 border-t border-white/[0.06]">
                      <button
                        onClick={() => toggleCheckIn(attendee)}
                        disabled={updatingId === attendee.id}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all touch-manipulation active:scale-95 ${
                          attendee.checked_in
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 hover:bg-teal-500/30'
                            : 'bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-black shadow-sm'
                        }`}
                      >
                        {attendee.checked_in ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Checked In (Undo)</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Accredit &amp; Check In</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedAttendee(attendee)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-jubilee-lightgold border border-white/10 transition-colors touch-manipulation active:scale-95 shrink-0"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteAttendee(attendee)}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors touch-manipulation active:scale-95 shrink-0"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
        </div>
        )}

        {/* 2. SPONSORSHIPS & PAYSTACK PAYMENTS TAB */}
        {activeAdminTab === 'SPONSORSHIPS' && (
          <div className="space-y-6">
            
            {/* Sponsorship Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="luxury-glass rounded-2xl p-4 border border-jubilee-gold/40 bg-jubilee-gold/10">
                <span className="text-[11px] text-jubilee-lightgold font-bold uppercase tracking-wider block">
                  Total Committed Funds
                </span>
                <div className="text-2xl sm:text-3xl font-retro font-black text-jubilee-gold mt-1">
                  ₦{sponsorships.reduce((acc, s) => acc + (Number(s.amount) || 0), 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-200 mt-0.5">Across All Tiers &amp; Adverts</div>
              </div>

              <div className="luxury-glass rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
                  Total Partners
                </span>
                <div className="text-2xl sm:text-3xl font-retro font-black text-white mt-1">
                  {sponsorships.length}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Corporate &amp; Individual</div>
              </div>

              <div className="luxury-glass rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider block">
                  Paystack Online
                </span>
                <div className="text-2xl sm:text-3xl font-retro font-black text-emerald-300 mt-1">
                  {sponsorships.filter(s => s.payment_method?.includes('Paystack')).length}
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-0.5">Instant Card/Transfer/USSD</div>
              </div>

              <div className="luxury-glass rounded-2xl p-4 border border-teal-500/30 bg-teal-950/20">
                <span className="text-[11px] text-teal-300 font-semibold uppercase tracking-wider block">
                  ECOBANK Direct
                </span>
                <div className="text-2xl sm:text-3xl font-retro font-black text-teal-300 mt-1">
                  {sponsorships.filter(s => !s.payment_method?.includes('Paystack')).length}
                </div>
                <div className="text-[10px] text-teal-200/70 mt-0.5">Acct: 0570076237</div>
              </div>
            </div>

            {/* Sponsorships Table Container */}
            <div className="luxury-glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-retro font-bold text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-jubilee-gold" />
                    <span>Jubilee Sponsorships &amp; Contributions Ledger</span>
                  </h3>
                  <p className="text-xs text-stone-400 font-light mt-0.5">
                    Real-time payment logs, tier classifications, and contact channels.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (sponsorships.length === 0) return;
                      const headers = ['Reference', 'Donor Name', 'Organization', 'Tier', 'Amount (NGN)', 'Channel', 'Email', 'Phone', 'Date'];
                      const rows = sponsorships.map(s => [
                        `"${s.reference}"`,
                        `"${s.donor_name}"`,
                        `"${s.organization || ''}"`,
                        `"${s.tier_name || s.tier_key}"`,
                        s.amount,
                        `"${s.payment_method}"`,
                        `"${s.email}"`,
                        `"${s.phone || ''}"`,
                        `"${s.created_at}"`
                      ]);
                      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement('a');
                      link.setAttribute('href', encodedUri);
                      link.setAttribute('download', `asf45th_sponsorships_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-jubilee-lightgold border border-jubilee-gold/30"
                  >
                    <Download className="w-3.5 h-3.5 text-jubilee-gold" />
                    <span>Download Ledger (CSV)</span>
                  </button>

                  <button
                    onClick={fetchSponsorships}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300"
                    title="Refresh Ledger"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {sponsorships.length === 0 ? (
                <div className="p-12 text-center text-stone-400 space-y-2">
                  <HeartHandshake className="w-10 h-10 text-stone-600 mx-auto" />
                  <p className="text-sm font-medium">No sponsorship records logged yet.</p>
                  <p className="text-xs text-stone-500">Payments made via Paystack or direct transfer notifications will appear here immediately.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-300">
                    <thead className="bg-black/60 text-stone-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Contributor / Brand</th>
                        <th className="p-3.5">Tier / Item</th>
                        <th className="p-3.5">Amount (₦)</th>
                        <th className="p-3.5">Channel / Ref</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sponsorships.map((s, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white text-sm">{s.donor_name}</div>
                            {s.organization && (
                              <div className="text-[11px] text-jubilee-lightgold font-medium">{s.organization}</div>
                            )}
                            {s.is_anonymous && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-bold">
                                Anonymous
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-jubilee-gold/20 text-jubilee-lightgold border border-jubilee-gold/30">
                              {s.tier_name || s.tier_key}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-retro font-bold text-base text-amber-400">
                              ₦{Number(s.amount).toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-[11px] text-emerald-300 font-medium">{s.payment_method}</div>
                            <div className="font-mono text-[10px] text-stone-400">{s.reference}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono text-white text-[11px] truncate max-w-[150px]">{s.email}</span>
                              <a
                                href={getMailtoLink({
                                  email: s.email,
                                  donorName: s.donor_name,
                                  tierName: s.tier_name || s.tier_key,
                                  amount: s.amount,
                                  reference: s.reference
                                })}
                                title="Send / Resend Official Letter to Sponsor"
                                className="p-1 rounded bg-white/10 hover:bg-white/20 text-jubilee-lightgold transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            {s.phone && (
                              <div className="mt-0.5">
                                <a
                                  href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${s.donor_name}, warm greetings from the NAAS RSU 45th Jubilee Secretariat. Thank you for your partnership!`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-400 hover:underline text-[11px]"
                                >
                                  {s.phone}
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="p-3.5 text-stone-400 text-[11px] whitespace-nowrap">
                            {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. GOODWILL VIDEO MESSAGES ARCHIVE TAB */}
        {activeAdminTab === 'VIDEOS' && (
          <div className="space-y-6">
            
            <div className="luxury-glass rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-retro font-bold text-white flex items-center space-x-2">
                  <Video className="w-5 h-5 text-jubilee-gold" />
                  <span>30-Second Video Goodwill Messages Submissions</span>
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Screen, stream, and download congratulatory video greetings for the Sunday Jubilee Banquet.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 rounded-full bg-jubilee-gold/20 text-jubilee-lightgold font-bold text-xs border border-jubilee-gold/30">
                  {videoSubmissions.length} Videos Submitted
                </span>
                <button
                  onClick={fetchVideoSubmissions}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300"
                  title="Refresh Videos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {videoSubmissions.length === 0 ? (
              <div className="luxury-glass rounded-2xl p-12 text-center text-stone-400 space-y-2 border border-white/10">
                <Video className="w-10 h-10 text-stone-600 mx-auto" />
                <p className="text-sm font-medium">No video goodwill messages uploaded yet.</p>
                <p className="text-xs text-stone-500">Alumni submissions via the Diaspora Hub "Upload Video" button will appear here for media curation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videoSubmissions.map((video, idx) => (
                  <div key={idx} className="luxury-glass rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Submitter Info */}
                      <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
                        <div>
                          <div className="font-bold text-white text-sm">{video.full_name}</div>
                          <div className="text-[11px] text-jubilee-lightgold font-medium">
                            {video.chapter_set || 'Alumni / Family'}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(video.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      {/* Video Player or Placeholder */}
                      <div className="rounded-xl overflow-hidden bg-black/60 aspect-video flex items-center justify-center relative border border-white/10">
                        {video.video_url && video.video_url.startsWith('http') ? (
                          <video
                            controls
                            src={video.video_url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                        ) : (
                          <div className="text-center p-3">
                            <Video className="w-8 h-8 text-jubilee-gold/60 mx-auto mb-1" />
                            <span className="text-xs text-stone-300 font-mono block truncate max-w-[200px]">
                              {video.file_name || 'Goodwill Clip'}
                            </span>
                            <span className="text-[10px] text-emerald-400 mt-1 block">Cloud Archiving</span>
                          </div>
                        )}
                      </div>

                      {/* Contact Details */}
                      <div className="mt-3 space-y-1 text-xs text-stone-300">
                        <div className="truncate"><span className="text-stone-400">Email:</span> {video.email}</div>
                        {video.phone && (
                          <div>
                            <span className="text-stone-400">WhatsApp: </span>
                            <a
                              href={`https://wa.me/${video.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${video.full_name}, thank you for submitting your 45th Jubilee Goodwill Video!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline"
                            >
                              {video.phone}
                            </a>
                          </div>
                        )}
                        {video.message_note && (
                          <div className="text-[11px] text-stone-400 italic pt-1">
                            “{video.message_note}”
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      {video.video_url && video.video_url.startsWith('http') ? (
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noreferrer"
                          download={video.file_name || 'asf_goodwill_message.mp4'}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-jubilee-gold/20 hover:bg-jubilee-gold/30 text-jubilee-lightgold text-xs font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Clip</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-stone-500 font-mono">Local Stored</span>
                      )}

                      {video.phone && (
                        <a
                          href={`https://wa.me/${video.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 text-xs"
                          title="Contact Submitter on WhatsApp"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Profile Detail Modal */}
      {selectedAttendee && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-[#051A0F] border-2 border-jubilee-gold/50 rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl relative text-white space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono text-jubilee-lightgold px-2 py-0.5 rounded bg-white/10 border border-white/15 font-bold">
                  {selectedAttendee.registration_tag}
                </span>
                <h3 className="text-lg sm:text-xl font-retro font-bold text-white mt-1 truncate">
                  {selectedAttendee.full_name}
                </h3>
                {selectedAttendee.maiden_name && (
                  <p className="text-xs text-stone-400 truncate">née {selectedAttendee.maiden_name}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedAttendee(null)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white shrink-0"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white/[0.04] p-3 sm:p-3.5 rounded-2xl border border-white/10">
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Graduation Set</span>
                  <span className="font-retro font-bold text-jubilee-gold text-sm sm:text-base">
                    Set of {selectedAttendee.grad_year}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Department</span>
                  <span className="font-semibold text-white break-words">{selectedAttendee.department}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Current Profession</span>
                  <span className="text-white break-words">{selectedAttendee.current_profession || '—'}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Past Campus Roles</span>
                  <span className="text-white break-words">{selectedAttendee.fellowship_roles || '—'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white/[0.04] p-3 sm:p-3.5 rounded-2xl border border-white/10">
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">WhatsApp / Phone</span>
                  <a 
                    href={`https://wa.me/${selectedAttendee.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-400 font-mono hover:underline break-all"
                  >
                    {selectedAttendee.phone}
                  </a>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Email</span>
                  <span className="text-white break-all">{selectedAttendee.email}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Location</span>
                  <span className="text-white break-words">{selectedAttendee.city}, {selectedAttendee.country}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block">Attendance Mode</span>
                  <span className="font-bold text-jubilee-lightgold">{selectedAttendee.attendance_mode}</span>
                </div>
              </div>

              {selectedAttendee.willing_to_support && (
                <div className="bg-jubilee-gold/10 p-3 sm:p-3.5 rounded-2xl border border-jubilee-gold/40">
                  <span className="inline-flex items-center space-x-1.5 text-jubilee-gold font-bold text-xs uppercase mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Jubilee Partnership &amp; Sponsorship</span>
                  </span>
                  <div className="text-xs text-white">
                    <strong>Category:</strong> {selectedAttendee.support_category || 'General'}
                  </div>
                  {selectedAttendee.support_pledge && (
                    <div className="text-xs text-emerald-200 mt-1">
                      <strong>Pledge / Note:</strong> {selectedAttendee.support_pledge}
                    </div>
                  )}
                </div>
              )}

              {selectedAttendee.tribute_quote && (
                <div className="bg-white/[0.04] p-3 sm:p-3.5 rounded-2xl border border-white/10">
                  <span className="text-stone-400 text-[10px] sm:text-[11px] block mb-1">Compendium Memory / Tribute</span>
                  <blockquote className="font-editorial italic text-stone-200 text-xs sm:text-sm">
                    “{selectedAttendee.tribute_quote}”
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleCheckIn(selectedAttendee)}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-center touch-manipulation active:scale-95 ${
                    selectedAttendee.checked_in
                      ? 'bg-teal-500 text-emerald-950 hover:bg-teal-400'
                      : 'bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-extrabold'
                  }`}
                >
                  {selectedAttendee.checked_in ? 'Mark as Not Checked In' : 'Accredit & Check In'}
                </button>

                <button
                  onClick={() => deleteAttendee(selectedAttendee)}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors touch-manipulation active:scale-95"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setSelectedAttendee(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 text-stone-300 hover:text-white text-xs font-medium text-center touch-manipulation"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
