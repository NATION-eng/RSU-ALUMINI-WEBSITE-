import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Shield, Lock, Search, Filter, Download, CheckCircle, XCircle, 
  Users, UserCheck, HeartHandshake, RefreshCw, Eye, ArrowLeft,
  Calendar, Phone, Mail, MapPin, Award, Check, Sparkles, Trash2
} from 'lucide-react';

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

  // Check if admin is already logged in for this session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('asf_cpc_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchRegistrations();
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
      fetchRegistrations();
    } else {
      setAuthError('Invalid CPC Master Passcode. Please check with the Central Planning Committee.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('asf_cpc_admin_auth');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/official-logo.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-retro font-bold text-white text-base">ASF RSU CPC Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                  Live Supabase
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                45th Jubilee Registration Directory & Accreditation Console
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              title="Refresh Records"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-jubilee-gold' : ''}`} />
            </button>

            <button
              onClick={exportToCSV}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-jubilee-gold/40 text-jubilee-lightgold transition-all"
            >
              <Download className="w-3.5 h-3.5 text-jubilee-gold" />
              <span>Export Excel / CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTimeout(onBackToSite, 0);
              }}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors touch-manipulation active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 pointer-events-none" />
              <span className="hidden sm:inline pointer-events-none">Back to Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="luxury-glass rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Total Alumni</span>
              <Users className="w-4 h-4 text-jubilee-gold" />
            </div>
            <div className="text-2xl sm:text-3xl font-retro font-black text-white">
              {stats.total}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Registered Worldwide</div>
          </div>

          <div className="luxury-glass rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
              <span>Physical (RSU)</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-retro font-black text-emerald-300">
              {stats.physical}
            </div>
            <div className="text-[10px] text-emerald-200/70 mt-0.5">Campus Delegates</div>
          </div>

          <div className="luxury-glass rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Virtual Diaspora</span>
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-retro font-black text-sky-300">
              {stats.virtual}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Online HD Stream</div>
          </div>

          <div className="luxury-glass rounded-2xl p-4 border border-jubilee-gold/40 bg-jubilee-gold/5">
            <div className="flex items-center justify-between text-xs text-jubilee-lightgold mb-1">
              <span>Sponsors</span>
              <HeartHandshake className="w-4 h-4 text-jubilee-gold" />
            </div>
            <div className="text-2xl sm:text-3xl font-retro font-black text-jubilee-gold">
              {stats.sponsors}
            </div>
            <div className="text-[10px] text-jubilee-lightgold/70 mt-0.5">Partners & Pledges</div>
          </div>

          <div className="luxury-glass rounded-2xl p-4 border border-teal-500/40 bg-teal-950/20">
            <div className="flex items-center justify-between text-xs text-teal-300 mb-1">
              <span>Checked In</span>
              <UserCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-retro font-black text-teal-300">
              {stats.checkedIn}
            </div>
            <div className="text-[10px] text-teal-200/70 mt-0.5">Accredited on Ground</div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="luxury-glass rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, set, tag..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-jubilee-gold"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
            >
              <option value="ALL">All Modes</option>
              <option value="PHYSICAL">Physical Only</option>
              <option value="VIRTUAL">Virtual Only</option>
            </select>

            <select
              value={filterSupport}
              onChange={(e) => setFilterSupport(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
            >
              <option value="ALL">All Registrants</option>
              <option value="SUPPORT_ONLY">Sponsors Only</option>
            </select>

            <select
              value={filterCheckin}
              onChange={(e) => setFilterCheckin(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
            >
              <option value="ALL">All Check-in Status</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="PENDING">Pending Check-in</option>
            </select>

            <button
              onClick={exportToCSV}
              className="sm:hidden px-3 py-2 rounded-xl bg-jubilee-gold text-emerald-950 font-bold text-xs flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
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
            <div className="p-12 text-center text-stone-400">
              <Users className="w-12 h-12 mx-auto text-stone-600 mb-3" />
              <p className="text-sm font-medium">No registrations match your search filter.</p>
              <p className="text-xs text-stone-500 mt-1">Registrations submitted through the main portal will appear here in real time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-black/40 text-stone-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-sans">
                  <tr>
                    <th className="px-4 py-3.5">Tag & Name</th>
                    <th className="px-4 py-3.5">Set & Era</th>
                    <th className="px-4 py-3.5">Contact & Location</th>
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
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          📍 {attendee.city}, {attendee.country}
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
                            <span className="inline-block px-2 py-0.5 rounded bg-jubilee-gold/20 text-jubilee-gold text-[10px] font-bold border border-jubilee-gold/30">
                              ★ Sponsor
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
          )}

        </div>

      </main>

      {/* Profile Detail Modal */}
      {selectedAttendee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#051A0F] border-2 border-jubilee-gold/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-jubilee-lightgold px-2 py-0.5 rounded bg-white/10 border border-white/15">
                  {selectedAttendee.registration_tag}
                </span>
                <h3 className="text-xl font-retro font-bold text-white mt-1">
                  {selectedAttendee.full_name}
                </h3>
                {selectedAttendee.maiden_name && (
                  <p className="text-xs text-stone-400">Maiden Name: {selectedAttendee.maiden_name}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedAttendee(null)}
                className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-2 gap-3 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                <div>
                  <span className="text-stone-400 text-[11px] block">Graduation Set</span>
                  <span className="font-retro font-bold text-jubilee-gold text-base">
                    {selectedAttendee.grad_year}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Department</span>
                  <span className="font-semibold text-white">{selectedAttendee.department}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Current Profession</span>
                  <span className="text-white">{selectedAttendee.current_profession || '—'}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Past Campus Roles</span>
                  <span className="text-white">{selectedAttendee.fellowship_roles || '—'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                <div>
                  <span className="text-stone-400 text-[11px] block">WhatsApp</span>
                  <a 
                    href={`https://wa.me/${selectedAttendee.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-400 font-mono hover:underline"
                  >
                    {selectedAttendee.phone}
                  </a>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Email</span>
                  <span className="text-white break-all">{selectedAttendee.email}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Location</span>
                  <span className="text-white">{selectedAttendee.city}, {selectedAttendee.country}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Attendance Mode</span>
                  <span className="font-bold text-jubilee-lightgold">{selectedAttendee.attendance_mode}</span>
                </div>
              </div>

              {selectedAttendee.willing_to_support && (
                <div className="bg-jubilee-gold/10 p-3.5 rounded-2xl border border-jubilee-gold/40">
                  <span className="text-jubilee-gold font-bold text-xs uppercase block mb-1">
                    ★ Jubilee Partnership & Sponsorship
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
                <div className="bg-white/[0.04] p-3.5 rounded-2xl border border-white/10">
                  <span className="text-stone-400 text-[11px] block mb-1">Compendium Memory / Tribute</span>
                  <blockquote className="font-editorial italic text-stone-200 text-xs sm:text-sm">
                    “{selectedAttendee.tribute_quote}”
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleCheckIn(selectedAttendee)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAttendee.checked_in
                      ? 'bg-teal-500 text-emerald-950 hover:bg-teal-400'
                      : 'bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-extrabold'
                  }`}
                >
                  {selectedAttendee.checked_in ? 'Mark as Not Checked In' : 'Accredit & Check In'}
                </button>

                <button
                  onClick={() => deleteAttendee(selectedAttendee)}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setSelectedAttendee(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-stone-300 hover:text-white text-xs font-medium"
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
