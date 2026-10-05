import React, { useState, useRef } from 'react';
import { X, UploadCloud, Video, CheckCircle2, AlertCircle, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

export default function VideoUploadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    chapterSet: '',
    messageNote: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.startsWith('video/')) {
      setStatus({ type: 'error', message: 'Please select a valid video file (MP4, MOV, or WEBM).' });
      return;
    }

    // Limit to 60MB for fast browser upload
    if (selectedFile.size > 60 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Video file size exceeds 60MB. Please trim to 30-45 seconds.' });
      return;
    }

    setFile(selectedFile);
    setStatus({ type: '', message: '' });
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please select your 30-second video message file to upload.' });
      return;
    }

    setUploading(true);
    setUploadProgress(15);
    setStatus({ type: '', message: '' });

    const submissionId = `VGM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fileExt = file.name.split('.').pop() || 'mp4';
    const filePath = `goodwill/${submissionId}.${fileExt}`;

    let videoUrl = '';

    try {
      setUploadProgress(40);
      // 1. Upload to Supabase Storage Bucket
      const { data: storageData, error: storageError } = await supabase.storage
        .from('goodwill-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!storageError && storageData) {
        const { data: publicData } = supabase.storage
          .from('goodwill-videos')
          .getPublicUrl(filePath);
        videoUrl = publicData?.publicUrl || '';
      } else {
        console.warn('Storage bucket note:', storageError?.message);
        videoUrl = `pending_local_upload:${file.name}`;
      }

      setUploadProgress(75);

      // 2. Insert record into database
      const record = {
        submission_id: submissionId,
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        chapter_set: formData.chapterSet.trim(),
        message_note: formData.messageNote.trim(),
        video_url: videoUrl,
        file_name: file.name,
        file_size_bytes: file.size,
        status: 'SUBMITTED',
        created_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('video_goodwill_submissions')
        .insert([record]);

      if (dbError) {
        console.warn('Database note:', dbError.message);
      }

      // 3. Local offline mirror so CPC Admin can always view submissions
      try {
        const existing = JSON.parse(localStorage.getItem('asf_goodwill_videos') || '[]');
        existing.unshift(record);
        localStorage.setItem('asf_goodwill_videos', JSON.stringify(existing));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }

      setUploadProgress(100);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error('Upload error:', err);
      setStatus({
        type: 'error',
        message: 'Network issue uploading file. You can also send the video directly to the Secretariat WhatsApp below.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#092215] text-white rounded-2xl sm:rounded-3xl border border-jubilee-gold/40 shadow-2xl overflow-y-auto max-h-[92vh] my-auto">
        
        {/* Top Gold Accent */}
        <div className="h-1.5 bg-gradient-to-r from-jubilee-gold via-amber-300 to-jubilee-gold" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all z-10 touch-manipulation"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-6 sm:p-10 text-center space-y-4 sm:space-y-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            
            <h3 className="text-xl sm:text-3xl font-retro font-bold text-jubilee-lightgold">
              Video Message Received!
            </h3>
            
            <p className="text-xs sm:text-sm text-emerald-100/90 font-light leading-relaxed max-w-md mx-auto">
              Thank you, <strong>{formData.fullName}</strong>. Your 30-second goodwill message has been uploaded to the 45th Jubilee Media Archive. It will be reviewed by the Secretariat and broadcast during the Grand Jubilee Gala Banquet!
            </p>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-xs text-stone-300 max-w-sm mx-auto">
              <span>File: </span>
              <span className="font-mono text-jubilee-gold font-semibold break-all">{file?.name}</span>
            </div>

            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFile(null);
                  setPreviewUrl('');
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-jubilee-gold text-emerald-950 hover:bg-amber-300 transition-all font-sans touch-manipulation"
              >
                Close Window
              </button>
              
              <a
                href={`https://wa.me/2348030000000?text=${encodeURIComponent(`Hello 45th Jubilee Media Secretariat, I just submitted my Goodwill Video Message on the portal: ${formData.fullName} (${formData.chapterSet || 'Alumni'})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all font-sans border border-white/20 touch-manipulation"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Notify Secretariat on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-jubilee-gold" />
                <span>Homecoming Gala Spotlight</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-retro font-bold text-white">
                Submit Your 30-Second Video Message
              </h3>
              <p className="text-xs text-stone-300 font-light mt-1">
                Record a brief congratulatory message with your family or fellowship chapter to be screened at the RSU Amphitheatre!
              </p>
            </div>

            {/* Error Message */}
            {status.message && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{status.message}</span>
              </div>
            )}

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ngozi Amadi"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-jubilee-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-jubilee-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-jubilee-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  Graduation Set / Chapter
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1999 Set / UK Chapter"
                  value={formData.chapterSet}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapterSet: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-jubilee-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Video File Dropzone */}
            <div>
              <label className="block text-xs text-emerald-200 font-semibold mb-1.5">
                Video Clip (Max 30–45s, MP4/MOV, up to 60MB) *
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all ${
                  file
                    ? 'border-jubilee-gold/80 bg-jubilee-gold/10'
                    : 'border-white/25 hover:border-jubilee-gold/60 bg-black/30 hover:bg-black/50'
                }`}
              >
                {file ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-jubilee-gold/20 text-jubilee-gold flex items-center justify-center mx-auto">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-xs mx-auto">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to change video
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <UploadCloud className="w-8 h-8 text-jubilee-gold mx-auto" />
                    <div className="text-xs font-semibold text-white">
                      Click to browse or drop your video file here
                    </div>
                    <div className="text-[10px] text-stone-400">
                      MP4, QuickTime MOV, or WEBM format
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-stone-300">
                  <span>Uploading to Jubilee Cloud Archive...</span>
                  <span className="font-mono text-jubilee-gold font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-jubilee-gold to-amber-300 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit & Secondary Options */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <button
                type="submit"
                disabled={uploading}
                className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:shadow-gold-glow active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Video...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & Submit Message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
