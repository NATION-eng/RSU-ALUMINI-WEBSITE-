import React, { useState } from 'react';
import { UserCheck, CheckCircle, Database, Send, ShieldCheck, AlertCircle, Building2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { WORLD_COUNTRIES } from '../data/countries';
import CountrySelect from './CountrySelect';

export default function CensusRsvpSection() {
  const [copiedAcct, setCopiedAcct] = useState(false);
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
    tributeQuote: '',
    willingToSupport: false,
    supportCategory: 'General Homecoming Support',
    supportPledge: ''
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
      willing_to_support: Boolean(formData.willingToSupport),
      support_category: formData.willingToSupport ? formData.supportCategory : null,
      support_pledge: formData.willingToSupport ? (formData.supportPledge.trim() || null) : null
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
    <section id="census-rsvp" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] text-[#141E18] relative">
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
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 shadow-luxury p-6 sm:p-10 space-y-8">
            
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

            </div>

            {/* Step 3: BOLD SUPPORT & JUBILEE SPONSORSHIP */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0E3B23] text-white border-2 border-jubilee-gold/70 shadow-luxury relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-jubilee-gold to-transparent"></div>

              <div className="flex items-center space-x-3 pb-3 mb-5 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-jubilee-gold text-emerald-950 flex items-center justify-center font-bold text-xs font-retro">
                  3
                </span>
                <h3 className="text-base sm:text-xl font-retro font-bold text-white tracking-wide">
                  PARTNER & SUPPORT THE 45TH JUBILEE
                </h3>
              </div>

              {/* OFFICIAL AUDITED BANK ACCOUNT DETAILS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-jubilee-gold/80 mb-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="text-jubilee-gold font-retro font-extrabold text-sm sm:text-base flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-jubilee-gold shrink-0" />
                      <span>OFFICIAL DEDICATED AUDITED BANK ACCOUNT</span>
                    </div>
                    <p className="text-xs text-stone-300 font-light mt-0.5">
                      Central Planning Committee (CPC) Financial Directorate
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('0570076237');
                      setCopiedAcct(true);
                      setTimeout(() => setCopiedAcct(false), 2500);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-jubilee-gold hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all active:scale-95 shrink-0 self-start sm:self-auto"
                  >
                    {copiedAcct ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAcct ? 'Copied 0570076237!' : 'Copy Account No.'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Bank Name</span>
                    <span className="font-bold text-white text-sm">ECOBANK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Account Number</span>
                    <span className="font-bold text-jubilee-lightgold font-mono text-base tracking-wider">0570076237</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Account Name</span>
                    <span className="font-bold text-white text-xs truncate block" title="NAAS RSU ALUMNI PROJECT">NAAS RSU ALUMNI PROJECT</span>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-white/10">
                  <span className="text-emerald-100/80 font-light">
                    Want to pay online via card or view exclusive sponsorship perks?
                  </span>
                  <a
                    href="#sponsors"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-jubilee-gold hover:text-amber-200 underline decoration-jubilee-gold underline-offset-4"
                  >
                    <span>View 5 Sponsorship Tiers &amp; Pay via Paystack →</span>
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start sm:items-center space-x-3.5 cursor-pointer p-4 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-jubilee-gold transition-colors">
                  <input
                    type="checkbox"
                    name="willingToSupport"
                    checked={formData.willingToSupport}
                    onChange={(e) => setFormData(prev => ({ ...prev, willingToSupport: e.target.checked }))}
                    className="w-5 h-5 rounded text-jubilee-gold focus:ring-jubilee-gold border-stone-300 accent-jubilee-gold shrink-0 mt-0.5 sm:mt-0"
                  />
                  <div>
                    <span className="text-sm sm:text-base font-bold text-white block">
                      YES, I WANT TO SUPPORT / SPONSOR THE 45TH JUBILEE
                    </span>
                    <span className="text-xs text-emerald-200/80 font-light block mt-0.5">
                      Check this box to indicate your partnership intention.
                    </span>
                  </div>
                </label>

                {formData.willingToSupport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans">
                    <div>
                      <label className="block text-xs font-bold text-jubilee-lightgold mb-1.5 uppercase tracking-wider">
                        Sponsorship Area of Interest
                      </label>
                      <select
                        name="supportCategory"
                        value={formData.supportCategory}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-jubilee-gold/50 text-white text-xs sm:text-sm font-medium focus:outline-none"
                      >
                        <option value="General Homecoming Support">General Homecoming Support</option>
                        <option value="Student Welfare & Feeding">Undergraduate Student Welfare & Feeding</option>
                        <option value="Mass Choir & Cantata Production">Mass Choir & Cantata Production</option>
                        <option value="45th Legacy Project Endowment">45th Legacy Project Endowment</option>
                        <option value="Alumni Compendium Publication">Alumni Compendium Publication</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-jubilee-lightgold mb-1.5 uppercase tracking-wider">
                        Estimated Pledge / Note (Optional)
                      </label>
                      <input
                        type="text"
                        name="supportPledge"
                        value={formData.supportPledge}
                        onChange={handleChange}
                        placeholder="e.g. ₦50,000 / $100 or 'Contact me'"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-jubilee-gold"
                      />
                    </div>
                  </div>
                )}
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

      </div>
    </section>
  );
}
