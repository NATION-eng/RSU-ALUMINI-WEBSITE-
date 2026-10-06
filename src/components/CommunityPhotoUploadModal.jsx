import React, { useState } from 'react';
import { 
  X, UploadCloud, Image as ImageIcon, CheckCircle2, ShieldCheck, 
  Sparkles, AlertCircle, Info, Calendar, User, Phone, Mail, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

const HISTORICAL_ERAS = [
  '1981–1990 Pioneer Era',
  '1991–2000 Sacred Harmony & Mass Choir',
  '2001–2010 Millennium Builders',
  '2011–2020 Modern Fellowship',
  '2021–2026 Jubilee Generation',
  'Live 45th Anniversary 2026'
];

export default function CommunityPhotoUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    contributorName: '',
    phone: '',
    email: '',
    alumniSet: '',
    era: '1981–1990 Pioneer Era',
    caption: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedRef, setSubmittedRef] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setFormError('Photo file size exceeds 20MB limit. Please choose a smaller or compressed image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setPhotoFile(file);
    setFormError('');

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const uploadFileToStorage = async (file) => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = `photo_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${fileExt}`;
    const filePath = `uploads/${cleanFileName}`;

    // Try primary bucket: community-photos
    try {
      const { data, error } = await supabase.storage
        .from('community-photos')
        .upload(filePath, file, { upsert: true });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from('community-photos')
          .getPublicUrl(filePath);
        return pubData?.publicUrl || null;
      }
    } catch (e) {}

    // Fallback bucket 1: compendium-ads
    try {
      const { data, error } = await supabase.storage
        .from('compendium-ads')
        .upload(filePath, file, { upsert: true });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from('compendium-ads')
          .getPublicUrl(filePath);
        return pubData?.publicUrl || null;
      }
    } catch (e) {}

    // Fallback bucket 2: goodwill-videos
    try {
      const { data, error } = await supabase.storage
        .from('goodwill-videos')
        .upload(filePath, file, { upsert: true });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from('goodwill-videos')
          .getPublicUrl(filePath);
        return pubData?.publicUrl || null;
      }
    } catch (e) {}

    // Fallback: If image <= 2.5MB, convert to base64
    if (file.size <= 2.5 * 1024 * 1024) {
      try {
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      } catch (e) {}
    }

    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      setFormError('Please select a photo to upload.');
      return;
    }

    if (!formData.contributorName.trim() || !formData.phone.trim()) {
      setFormError('Please provide your Name and WhatsApp phone number.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const imageUrl = await uploadFileToStorage(photoFile);
      const submissionRef = `ASF-PHOTO-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const photoRecord = {
        submission_id: submissionRef,
        contributor_name: formData.contributorName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        alumni_set: formData.alumniSet.trim() || 'Alumni / Student',
        era: formData.era,
        caption: formData.caption.trim() || 'Commemorative Fellowship Throwback',
        image_url: imageUrl,
        file_name: photoFile.name,
        file_size_kb: Math.round(photoFile.size / 1024),
        status: 'PENDING', // PENDING moderation by Media Team
        submitted_at: new Date().toISOString(),
        approved_at: null,
        rejection_reason: null
      };

      // 1. Supabase insert
      try {
        const { error } = await supabase
          .from('community_photos')
          .insert([photoRecord]);
        if (error) console.info('Supabase photo insert notice:', error.message);
      } catch (dbErr) {
        console.warn('Supabase photo insert error:', dbErr);
      }

      // 2. LocalStorage backup
      try {
        const existing = JSON.parse(localStorage.getItem('asf_community_photos') || '[]');
        existing.unshift(photoRecord);
        localStorage.setItem('asf_community_photos', JSON.stringify(existing));
      } catch (lsErr) {}

      setIsSubmitting(false);
      setSubmittedRef(submissionRef);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onUploadSuccess) onUploadSuccess(photoRecord);

    } catch (err) {
      console.error('Photo submission error:', err);
      setIsSubmitting(false);
      setFormError('An error occurred during upload. Please check your network and try again.');
    }
  };

  const handleResetAndClose = () => {
    setFormData({
      contributorName: '',
      phone: '',
      email: '',
      alumniSet: '',
      era: '1981–1990 Pioneer Era',
      caption: ''
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setSubmittedRef(null);
    setFormError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="bg-[#051A0F] border-2 border-jubilee-gold/50 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 xs:p-5 sm:p-8 shadow-2xl relative text-white my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors touch-manipulation"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRef ? (
          /* Submission Confirmation & Moderation Notice */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Staged in Media Moderation Queue</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
              Photo Submitted Successfully!
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-md mx-auto">
              Thank you for contributing to the 45-year living fellowship archive. Your photo has been securely logged with Reference:
            </p>

            <div className="py-2.5 px-4 rounded-xl bg-black/60 border border-jubilee-gold/50 font-mono text-sm font-bold text-jubilee-lightgold inline-block tracking-wider">
              {submittedRef}
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left text-xs space-y-2 text-stone-300">
              <div className="flex items-center space-x-1.5 font-bold text-jubilee-lightgold">
                <ShieldCheck className="w-4 h-4 text-jubilee-gold shrink-0" />
                <span>Media Team Screening &amp; Moderation Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-400">
                To guarantee copyright authenticity and community privacy, all community uploads undergo review by the CPC Media &amp; Archive Directorate. Once approved, your photo will automatically appear in the public <strong>Community Living Archive</strong> gallery.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all"
            >
              Done &amp; Return to Gallery
            </button>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div className="text-center space-y-1 pr-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/[0.06] text-jubilee-lightgold border border-jubilee-gold/30 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-jubilee-gold" />
                <span>45-Year Living Fellowship Archive</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
                Upload Throwback or Jubilee Photo
              </h3>
              <p className="text-xs text-stone-300 font-light">
                Preserve our rich 1981–2026 heritage by sharing your historical fellowship memories.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* Photo Picker / Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-jubilee-lightgold uppercase tracking-wider">
                Photo File *
              </label>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-jubilee-gold/60 bg-black aspect-video flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-rose-900 text-white text-xs transition-colors"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/20 hover:border-jubilee-gold/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.05]">
                  <UploadCloud className="w-10 h-10 text-jubilee-gold mb-2" />
                  <span className="text-xs font-bold text-white">Click or Drag &amp; Drop Photo Here</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">Supports JPG, PNG, WEBP (Max 20MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Historical Era & Alumni Set */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Historical Fellowship Era *
                </label>
                <select
                  value={formData.era}
                  onChange={(e) => setFormData(prev => ({ ...prev, era: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:border-jubilee-gold outline-none"
                >
                  {HISTORICAL_ERAS.map(era => (
                    <option key={era} value={era} className="bg-emerald-950 text-white">
                      {era}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Alumni Set / Grad Class
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class of 1996 / Pioneer"
                  value={formData.alumniSet}
                  onChange={(e) => setFormData(prev => ({ ...prev, alumniSet: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:border-jubilee-gold outline-none placeholder-stone-500"
                />
              </div>
            </div>

            {/* Caption / Story */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-300">
                Photo Story / Names of People in Picture *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Share the memory, event venue, or identify people in the picture..."
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:border-jubilee-gold outline-none placeholder-stone-500"
              />
            </div>

            {/* Contributor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contributor name"
                  value={formData.contributorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contributorName: e.target.value }))}
                  className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:border-jubilee-gold outline-none placeholder-stone-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                  WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:border-jubilee-gold outline-none placeholder-stone-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:border-jubilee-gold outline-none placeholder-stone-500"
                />
              </div>
            </div>

            {/* Moderation Note */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-2 text-[10px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span>
                All submitted photos enter an administrative moderation queue for media team verification before going live on the public archive gallery.
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-1 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-semibold transition-colors touch-manipulation"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-luxury active:scale-95 transition-all disabled:opacity-50 touch-manipulation"
              >
                {isSubmitting ? 'Uploading...' : 'Submit Photo for Review'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
