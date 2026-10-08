import React, { useState } from 'react';
import { UserCheck, CheckCircle, Database, Send, ShieldCheck, AlertCircle, Award, HeartHandshake, BookOpen, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { WORLD_COUNTRIES } from '../data/countries';
import CountrySelect from './CountrySelect';

export default function CensusRsvpSection({ onOpenSponsors }) {
  const [formData, setFormData] = useState({
    fullName: '',
    maidenName: '',
    gradYear: '',
    department: '',
    fellowshipRoles: '',
    currentRole: '',
    phone: '',
    email: '',
    city: '',
    country: 'Nigeria',
    attendanceMode: 'PHYSICAL', // 'PHYSICAL' | 'VIRTUAL'
    arrivalDate: '2026-11-13',
    tributeQuote: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignedTag, setAssignedTag] = useState('');
  const [submitError, setSubmitError] = useState('');

  const getCohortEra = (year) => {
    const y = parseInt(year, 10);
    if (y <= 1990) return '1981–1990 Pioneer Altar';
    if (y <= 2000) return '1991–2000 Sacred Harmony';
    if (y <= 2010) return '2001–2010 Millennium Builders';
    if (y <= 2020) return '2011–2020 Modern Pioneers';
    return '2021–2026 Jubilee Generation';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.gradYear) {
      setSubmitError('Please select your graduation set year.');
      setLoading(false);
      return;
    }

    const tag = `ASF-45TH-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      registration_tag: tag,
      full_name: formData.fullName.trim(),
      maiden_name: formData.maidenName.trim() || null,
      grad_year: parseInt(formData.gradYear, 10),
      cohort_era: getCohortEra(formData.gradYear),
      department: formData.department.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      country: formData.country,
      current_profession: formData.currentRole.trim() || null,
      fellowship_roles: formData.fellowshipRoles.trim() || null,
      attendance_mode: formData.attendanceMode,
      arrival_date: formData.attendanceMode === 'PHYSICAL' && formData.arrivalDate ? formData.arrivalDate : null,
      tribute_quote: formData.tributeQuote.trim() || null,
      willing_to_support: false,
      support_category: null,
      support_pledge: null
    };

    try {
      // 1. Direct Cloud Insertion into Supabase Database
      const { error } = await supabase
        .from('alumni_registrations')
        .insert([payload]);

      if (error) {
        console.error('Supabase registration error:', error.message);
        // If there's an issue, we still keep local backup but notify
      }

      // 2. Offline Browser LocalStorage Backup
      try {
        const existing = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
        existing.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem('asf_census_submissions', JSON.stringify(existing));
      } catch (localErr) {
        console.error('Local storage backup error:', localErr);
      }

      setAssignedTag(tag);
      setLoading(false);
      setSubmitted(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#092B19', '#D4AF37', '#10B981', '#FAF7EE']
      });

    } catch (err) {
      console.error('Fatal submission error:', err);
      setSubmitError('Unable to connect to the database right now. Please check your internet connection.');
      setLoading(false);
    }
  };

  return (
    <section id="census-rsvp" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-950 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-900/15">
            <Database className="w-3.5 h-3.5 text-emerald-800" />
            <span>Alumni Directory & Homecoming RSVP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight mb-3">
            The Reunion Roll Call
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            Record your place in 45 years of fellowship history and confirm your participation for the Jubilee weekend.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-800/20 shadow-luxury text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <CheckCircle className="w-9 h-9 text-emerald-800" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-retro font-bold text-emerald-950 mb-2">
              Record Confirmed
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-6 font-light">
              Welcome home, <strong className="font-semibold text-stone-900">{formData.fullName}</strong> ({formData.gradYear}). 
              Your submission has been secured in the Permanent Fellowship Archive.
            </p>

            <div className="bg-emerald-950/5 rounded-2xl p-4 text-xs text-emerald-950 border border-emerald-900/10 mb-8 text-left space-y-1.5 font-sans">
              <div><strong>Registration Tag:</strong> <span className="font-mono font-bold text-emerald-900">{assignedTag}</span></div>
              <div><strong>Mode:</strong> {formData.attendanceMode === 'PHYSICAL' ? 'Physical on Campus (Port Harcourt)' : 'Virtual via Global HD Livestream'}</div>
              <div><strong>Location:</strong> {formData.city}, {formData.country}</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://chat.whatsapp.com/L7tCTNupT6y4BEg4my964K"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-black bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:brightness-110 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
                <span>Join Our WhatsApp Group</span>
              </a>
              <a
                href="#dp-generator"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-emerald-950 text-white hover:bg-emerald-900 shadow-md transition-all"
              >
                Generate Your 45th DP
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                Register Another Alumnus
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-luxury p-3.5 xs:p-5 sm:p-10 space-y-5 sm:space-y-8">
            
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Step 1: Member Profile */}
            <div>
              <div className="flex items-center space-x-3 pb-3 mb-6 border-b border-stone-100">
                <span className="w-7 h-7 rounded-full bg-emerald-950 text-jubilee-gold flex items-center justify-center font-bold text-xs font-retro">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-retro font-bold text-emerald-950">
                  Historical Member Profile (1981–2026)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="First and last name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Maiden Name (if applicable)
                  </label>
                  <input
                    type="text"
                    name="maidenName"
                    value={formData.maidenName}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Graduation Year / Set *
                  </label>
                  <select
                    required
                    name="gradYear"
                    value={formData.gradYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none bg-white text-sm font-medium"
                  >
                    <option value="">Select Graduation Set Year *</option>
                    {Array.from({ length: 46 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year}>{year} {year <= 1999 ? '(Pioneer Cohort)' : '(Contemporary)'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Department / Faculty at RSU *
                  </label>
                  <input
                    type="text"
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Civil Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="youremail@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                {/* Updated: Current City only */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Current City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Port Harcourt, Lagos, London, Houston"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                {/* Updated: Searchable Country Dropdown Menu (All 195+ Countries) */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Country *
                  </label>
                  <CountrySelect
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Current Profession / Organization
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="e.g. Lead Consultant, Federal Ministry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fellowship Positions Held on Campus
                  </label>
                  <input
                    type="text"
                    name="fellowshipRoles"
                    value={formData.fellowshipRoles}
                    onChange={handleChange}
                    placeholder="e.g. Choir Director, Exco President, Member"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: 45th Jubilee RSVP */}
            <div>
              <div className="flex items-center space-x-3 pb-3 mb-6 border-b border-stone-100">
                <span className="w-7 h-7 rounded-full bg-emerald-950 text-jubilee-gold flex items-center justify-center font-bold text-xs font-retro">
                  2
                </span>
                <h3 className="text-base sm:text-lg font-retro font-bold text-emerald-950">
                  Homecoming Attendance (Nov 13–15, 2026)
                </h3>
              </div>

              {/* Attendance Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 font-sans">
                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.attendanceMode === 'PHYSICAL'
                    ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <input
                    type="radio"
                    name="attendanceMode"
                    value="PHYSICAL"
                    checked={formData.attendanceMode === 'PHYSICAL'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="font-bold text-sm">Physical Attendance</div>
                  <div className="text-xs text-stone-500 mt-0.5">Attending on-ground at RSU Campus, Port Harcourt.</div>
                </label>

                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.attendanceMode === 'VIRTUAL'
                    ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <input
                    type="radio"
                    name="attendanceMode"
                    value="VIRTUAL"
                    checked={formData.attendanceMode === 'VIRTUAL'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="font-bold text-sm">Virtual Attendance</div>
                  <div className="text-xs text-stone-500 mt-0.5">Participating via HD Diaspora Livestream.</div>
                </label>
              </div>

              {formData.attendanceMode === 'PHYSICAL' && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 mb-5 font-sans">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Expected Arrival Date in Port Harcourt
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:border-emerald-800 outline-none"
                  />
                </div>
              )}

              {/* Memory Tribute */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Share your memories or Experience (Optional)
                </label>
                <textarea
                  rows="2"
                  name="tributeQuote"
                  value={formData.tributeQuote}
                  onChange={handleChange}
                  placeholder="Share a sentence or memory about your fellowship days at RSU."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none text-sm font-sans"
                />
              </div>

              {/* Official Alumni WhatsApp Group Call-To-Action */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#051A0F] via-[#092B19] to-[#0A2E1A] text-white border border-jubilee-gold/40 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-jubilee-lightgold text-xs font-bold uppercase tracking-wider font-mono">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Official 45th Jubilee Community</span>
                  </div>
                  <h4 className="text-sm font-retro font-bold text-white">
                    Join the Official Alumni WhatsApp Group
                  </h4>
                  <p className="text-xs text-emerald-100/80 font-light max-w-lg">
                    Connect with fellow alumni, your graduating set, and receive instant homecoming announcements and logistics updates.
                  </p>
                </div>

                <a
                  href="https://chat.whatsapp.com/L7tCTNupT6y4BEg4my964K"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-full text-xs font-black bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e7568] text-white shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 touch-manipulation border border-emerald-400/30"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
                  <span>Join Our WhatsApp Group</span>
                </a>
              </div>

            </div>

            {/* Submit */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
              <div className="text-[11px] text-stone-400 font-sans flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Encrypted transmission to Central Planning Committee</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-emerald-950 text-white shadow-luxury hover:bg-emerald-900 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Recording...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-jubilee-gold" />
                    <span>Submit & Reserve Seat</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* Bold Indicator & Action Button Leading to Support / Sponsorship Section */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0E3B23] text-white border-2 border-jubilee-gold/70 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-jubilee-gold to-transparent" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-[11px] font-bold uppercase tracking-widest">
                <Award className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                <span>Partner &amp; Support the 45th Jubilee</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-retro font-bold text-white tracking-tight leading-tight">
                Support the Fellowship &amp; Promote Your Brand
              </h3>
              
              <p className="text-xs sm:text-sm text-emerald-100/80 font-sans font-light leading-relaxed">
                Empower the 45th Homecoming, fund student welfare, Mass Choir cantatas, and the 45-year legacy endowment across 5 distinguished sponsorship tiers or book compendium advertising.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="#donate"
                onClick={(e) => {
                  if (onOpenSponsors) {
                    e.preventDefault();
                    onOpenSponsors('sponsors');
                  }
                }}
                className="inline-flex items-center justify-center space-x-2.5 px-7 py-4 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-105 active:scale-95 transition-all text-center touch-manipulation border border-amber-300"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-950 shrink-0 pointer-events-none" />
                <span className="pointer-events-none">Support the 45th Jubilee</span>
              </a>

              <a
                href="#compendium-ads"
                onClick={(e) => {
                  if (onOpenSponsors) {
                    e.preventDefault();
                    onOpenSponsors('ads');
                  }
                }}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-bold bg-white/10 hover:bg-white/15 text-jubilee-lightgold border border-jubilee-gold/40 hover:scale-105 active:scale-95 transition-all text-center touch-manipulation"
              >
                <BookOpen className="w-4 h-4 text-jubilee-gold shrink-0 pointer-events-none" />
                <span className="pointer-events-none">Promote Your Brand / Compendium Adverts</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
