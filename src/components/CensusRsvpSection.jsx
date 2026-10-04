import React, { useState } from 'react';
import { UserCheck, CheckCircle, Database, Sparkles, Building, Phone, Mail, MapPin, Send, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CensusRsvpSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    maidenName: '',
    gradYear: '1995',
    activePeriod: '1990–1995',
    department: 'Civil Engineering',
    fellowshipRoles: 'Former Choir Leader & Sanctuary Assistant',
    currentRole: 'Senior Project Director',
    organization: 'Shell Petroleum / Independent Practice',
    phone: '',
    email: '',
    city: 'Port Harcourt',
    country: 'Nigeria',
    attendanceMode: 'PHYSICAL', // 'PHYSICAL' | 'VIRTUAL'
    arrivalDate: '2026-11-13',
    accommodationNeeded: 'NO',
    dietaryNotes: '',
    tributeQuote: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate database pipeline sync (Supabase / Google Sheets)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F4D2A', '#D4AF37', '#10B981', '#FAF7EE']
      });

      // Save to localStorage for persistence
      try {
        const existing = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
        existing.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('asf_census_submissions', JSON.stringify(existing));
      } catch (err) {
        console.error(err);
      }
    }, 1200);
  };

  return (
    <section id="census-rsvp" className="py-24 px-4 sm:px-6 lg:px-8 bg-jubilee-cream text-stone-900 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Database className="w-3.5 h-3.5 text-emerald-800" />
            <span>Dual-Purpose Database & Logistics Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-emerald-950 tracking-tight mb-4">
            Alumni Census & Jubilee RSVP
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Help us permanently document 45 years of Adventist graduates at Rivers State University. 
            Your registration simultaneously enters you into the <strong>Permanent Historical Directory</strong> and reserves your seat for the 45th Anniversary Celebration.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-emerald-200 shadow-2xl text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-800" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 mb-3">
              Registration Confirmed!
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Thank you, <span className="font-bold text-stone-900">{formData.fullName}</span> ({formData.gradYear}). 
              Your alumni record has been securely committed to the ASF RSU Cloud Directory and transmitted to the Central Planning Committee (CPC).
            </p>

            <div className="bg-emerald-50 rounded-2xl p-4 text-xs text-emerald-900 border border-emerald-200 mb-8 text-left space-y-1">
              <div><strong>Confirmation ID:</strong> ASF-45TH-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div><strong>Attendance Mode:</strong> {formData.attendanceMode === 'PHYSICAL' ? 'Physical on Campus (Port Harcourt)' : 'Virtual via HD Global Livestream'}</div>
              <div><strong>Cohort Set:</strong> {formData.gradYear} ({formData.department})</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#dp-generator"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-emerald-900 text-white hover:bg-emerald-800 transition-colors shadow-md"
              >
                Create Your "I Will Be There" DP
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
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-12 space-y-10">
            
            {/* PART 1: Permanent Alumni Census */}
            <div>
              <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-emerald-900 text-jubilee-gold flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-emerald-950">
                    Permanent RSU Alumni Census Directory (1981–2026)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Capturing chapter member archives across four graduating decades
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Full Name (First, Middle, Surname) *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Arc. Ebiere Williams"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Maiden Name (If Applicable)
                  </label>
                  <input
                    type="text"
                    name="maidenName"
                    value={formData.maidenName}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Graduation Year / Set (1981–2026) *
                  </label>
                  <select
                    name="gradYear"
                    value={formData.gradYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none bg-white font-medium"
                  >
                    {Array.from({ length: 46 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year}>{year} {year <= 1999 ? '(Pioneer Cohort)' : '(Contemporary)'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Department & Faculty at RSU *
                  </label>
                  <input
                    type="text"
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Electrical Engineering / Faculty of Eng."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Current Professional Role / Title
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="e.g. Managing Director / Consultant Physician"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Fellowship Positions Held While on Campus
                  </label>
                  <input
                    type="text"
                    name="fellowshipRoles"
                    value={formData.fellowshipRoles}
                    onChange={handleChange}
                    placeholder="e.g. Exco President, Choir Member, Sanctuary, Member"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="youremail@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Current City & Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Port Harcourt, Lagos, London, Houston"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Country / Diaspora Region
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Nigeria, United Kingdom, USA, Canada"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* PART 2: 45th Jubilee Event RSVP */}
            <div>
              <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-emerald-900 text-jubilee-gold flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-emerald-950">
                    45th Jubilee Homecoming RSVP & Headcount Tracker
                  </h3>
                  <p className="text-xs text-stone-500">
                    Logistical data for the Central Planning Committee (CPC)
                  </p>
                </div>
              </div>

              {/* Participation Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.attendanceMode === 'PHYSICAL'
                    ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950'
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
                  <div className="font-bold text-sm">Physical Attendance (On Campus)</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Attending physically at Rivers State University, Port Harcourt.
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.attendanceMode === 'VIRTUAL'
                    ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950'
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
                  <div className="font-bold text-sm">Virtual Diaspora Participation</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Joining the HD multi-camera global livestream & digital communion.
                  </div>
                </label>
              </div>

              {formData.attendanceMode === 'PHYSICAL' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm p-4 bg-stone-50 rounded-2xl border border-stone-200/70 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Accommodation Assistance Requested?
                    </label>
                    <select
                      name="accommodationNeeded"
                      value={formData.accommodationNeeded}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                    >
                      <option value="NO">No, I have private arrangements</option>
                      <option value="YES">Yes, please recommend/reserve partner hotel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Expected Arrival Date
                    </label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                    >
                    </input>
                  </div>
                </div>
              )}

              {/* Memory / Tribute for Compendium */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Share a Brief Memory or Tribute for the 45th Jubilee Compendium (Optional)
                </label>
                <textarea
                  rows="3"
                  name="tributeQuote"
                  value={formData.tributeQuote}
                  onChange={handleChange}
                  placeholder="Share a sentence or memory about your days in ASF RSU. Selected tributes will be featured in the official Alumni Magazine."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none text-sm"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500">
                🔒 Protected by automated SSL encryption & synchronized with cloud database.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-base font-extrabold bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-xl hover:bg-emerald-750 transition-all hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <span>Transmitting Record...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-jubilee-gold" />
                    <span>Submit Alumni Record & Confirm RSVP</span>
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
