import React, { useState, useEffect, useMemo, useRef, startTransition } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Shield, Lock, Search, Filter, Download, CheckCircle, XCircle, 
  Users, UserCheck, HeartHandshake, RefreshCw, Eye, ArrowLeft,
  Calendar, Phone, Mail, MapPin, Award, Check, Globe, Trash2,
  Video, Play, Sparkles, Building2, ExternalLink, AlertTriangle, X,
  BookOpen, FileText, Palette, UploadCloud, Layers, Image as ImageIcon
} from 'lucide-react';
import { getMailtoLink } from '../lib/emailService';
import { COMPENDIUM_AD_TIERS, AD_EDITORIAL_STATUSES } from '../lib/adSpecs';

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

  // In-App Confirm Modal State (Eliminates INP-blocking window.confirm)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: null,
    confirmText: 'Delete Permanently',
    isDanger: true,
    isLoading: false,
    onConfirm: null,
  });

  // Non-blocking Toast Notification State (Eliminates blocking window.alert)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3800);
  };

  const openConfirmModal = ({
    title,
    message,
    details = null,
    confirmText = 'Delete Permanently',
    isDanger = true,
    onConfirm
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      details,
      confirmText,
      isDanger,
      isLoading: false,
      onConfirm
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false, onConfirm: null, isLoading: false }));
  };

  // Admin tabs: 'REGISTRATIONS' | 'SPONSORSHIPS' | 'ADS' | 'VIDEOS'
  const [activeAdminTab, setActiveAdminTab] = useState('REGISTRATIONS');
  const [sponsorships, setSponsorships] = useState([]);
  const [adBookings, setAdBookings] = useState([]);
  const [selectedAdBooking, setSelectedAdBooking] = useState(null);
  const [videoSubmissions, setVideoSubmissions] = useState([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);

  // Community Photos Moderation State
  const [communityPhotos, setCommunityPhotos] = useState([]);
  const [photoFilterStatus, setPhotoFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

  // Search & Filter for Sponsorships
  const [sponsorshipSearch, setSponsorshipSearch] = useState('');
  const [sponsorshipFilterType, setSponsorshipFilterType] = useState('ALL'); // 'ALL' | 'DONATION' | 'AD'
  const [sponsorshipFilterChannel, setSponsorshipFilterChannel] = useState('ALL'); // 'ALL' | 'PAYSTACK' | 'TRANSFER'

  // Search & Filter for Compendium Ads
  const [adSearch, setAdSearch] = useState('');
  const [adFilterTier, setAdFilterTier] = useState('ALL');
  const [adFilterStatus, setAdFilterStatus] = useState('ALL');
  const [adFilterPayment, setAdFilterPayment] = useState('ALL');

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
    fetchAdBookings();
    fetchVideoSubmissions();
    fetchCommunityPhotos();
  };

  const fetchAdBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('compendium_ad_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      const local = JSON.parse(localStorage.getItem('asf_compendium_ad_bookings') || '[]');
      const combined = [...(data || [])];
      local.forEach(item => {
        if (!combined.some(c => c.booking_reference === item.booking_reference || (c.id && c.id === item.id))) {
          combined.push(item);
        }
      });

      // Also backfill from sponsorship records if any were previously booked under sponsorship_payments
      const sponsorshipRecords = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
      sponsorshipRecords.forEach(s => {
        const isAd = Boolean(s.tier_key?.startsWith('ad_') || s.reference?.includes('-AD-'));
        if (isAd && !combined.some(c => c.booking_reference === s.reference || c.reference === s.reference)) {
          combined.push({
            booking_reference: s.reference,
            advertiser_name: s.donor_name || s.organization || 'Advertiser',
            company_name: s.organization || null,
            brand_headline: null,
            ad_tier_key: s.tier_key || 'ad_full',
            ad_tier_name: s.tier_name || 'Compendium Advert',
            ad_dimensions: COMPENDIUM_AD_TIERS[s.tier_key]?.dimensions || 'A4 Standard',
            amount: s.amount,
            currency: s.currency || 'NGN',
            email: s.email,
            phone: s.phone,
            alumni_set: s.alumni_set,
            artwork_option: 'UPLOAD_READY',
            artwork_url: null,
            artwork_file_name: null,
            message_note: s.message_note,
            payment_method: s.payment_method || 'PAYSTACK',
            payment_status: s.status || 'VERIFIED',
            editorial_status: 'RECEIVED',
            assigned_page_number: null,
            created_at: s.created_at
          });
        }
      });

      setAdBookings(combined);
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('asf_compendium_ad_bookings') || '[]');
      setAdBookings(local);
    }
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

  const fetchCommunityPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('community_photos')
        .select('*')
        .order('submitted_at', { ascending: false });

      const local = JSON.parse(localStorage.getItem('asf_community_photos') || '[]');
      const combined = [...(data || [])];
      local.forEach(item => {
        if (!combined.some(c => c.submission_id === item.submission_id || (c.id && c.id === item.id))) {
          combined.push(item);
        }
      });
      setCommunityPhotos(combined);
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('asf_community_photos') || '[]');
      setCommunityPhotos(local);
    }
  };

  const updatePhotoStatus = async (photo, newStatus, reason = null) => {
    const targetRef = photo.submission_id || photo.id;
    setUpdatingId(targetRef);
    const approvedAt = newStatus === 'APPROVED' ? new Date().toISOString() : null;

    try {
      if (photo.id) {
        try {
          await supabase
            .from('community_photos')
            .update({ status: newStatus, approved_at: approvedAt, rejection_reason: reason })
            .eq('id', photo.id);
        } catch (e) {}
      } else if (photo.submission_id) {
        try {
          await supabase
            .from('community_photos')
            .update({ status: newStatus, approved_at: approvedAt, rejection_reason: reason })
            .eq('submission_id', photo.submission_id);
        } catch (e) {}
      }

      // Local storage
      try {
        const local = JSON.parse(localStorage.getItem('asf_community_photos') || '[]');
        const updated = local.map(p =>
          (p.submission_id === targetRef || (photo.id && p.id === photo.id))
            ? { ...p, status: newStatus, approved_at: approvedAt, rejection_reason: reason }
            : p
        );
        localStorage.setItem('asf_community_photos', JSON.stringify(updated));
      } catch (e) {}

      startTransition(() => {
        setCommunityPhotos(prev => prev.map(p =>
          (p.submission_id === targetRef || (photo.id && p.id === photo.id))
            ? { ...p, status: newStatus, approved_at: approvedAt, rejection_reason: reason }
            : p
        ));
      });

      if (newStatus === 'APPROVED') {
        showToast('Photo approved and published to public Living Archive!', 'success');
      } else if (newStatus === 'REJECTED') {
        showToast('Photo rejected. Kept off public gallery.', 'info');
      } else {
        showToast(`Photo status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      showToast('Error updating photo status: ' + err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteCommunityPhoto = (photo) => {
    openConfirmModal({
      title: 'Delete Photo Submission',
      message: 'Are you sure you want to permanently delete this photo from the staging queue and permanent archive?',
      details: [
        { label: 'Contributor', value: photo.contributor_name },
        { label: 'Reference', value: photo.submission_id },
        { label: 'Era', value: photo.era || 'Unknown' },
        { label: 'Caption', value: photo.caption }
      ],
      confirmText: 'Delete Photo',
      isDanger: true,
      onConfirm: async () => {
        const targetRef = photo.submission_id || photo.id;
        setUpdatingId(targetRef);
        try {
          if (photo.id) {
            try {
              await supabase
                .from('community_photos')
                .delete()
                .eq('id', photo.id);
            } catch (e) {}
          } else if (photo.submission_id) {
            try {
              await supabase
                .from('community_photos')
                .delete()
                .eq('submission_id', photo.submission_id);
            } catch (e) {}
          }

          try {
            const local = JSON.parse(localStorage.getItem('asf_community_photos') || '[]');
            const updated = local.filter(p =>
              p.submission_id !== targetRef && (!photo.id || p.id !== photo.id)
            );
            localStorage.setItem('asf_community_photos', JSON.stringify(updated));
          } catch (e) {}

          startTransition(() => {
            setCommunityPhotos(prev => prev.filter(p =>
              p.submission_id !== targetRef && (!photo.id || p.id !== photo.id)
            ));
          });
          showToast('Photo submission deleted successfully.', 'success');
        } catch (err) {
          showToast('Error deleting photo: ' + err.message, 'error');
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alumni_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.info('Supabase registrations note:', error.message);
      }
      
      const local = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
      const combined = [...(data || [])];
      local.forEach(item => {
        if (!combined.some(c => (c.id && c.id === item.id) || (c.registration_tag && c.registration_tag === item.registration_tag))) {
          combined.push(item);
        }
      });
      setRegistrations(combined);
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
      setRegistrations(local);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Check-in status (For on-ground accreditation)
  const toggleCheckIn = async (attendee) => {
    setUpdatingId(attendee.id || attendee.registration_tag);
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
  const deleteAttendee = (attendee) => {
    openConfirmModal({
      title: 'Delete Registration Record',
      message: `Are you sure you want to permanently delete this attendee record? This will remove them from the cloud directory and local storage.`,
      details: [
        { label: 'Full Name', value: attendee.full_name },
        { label: 'Registration Tag', value: attendee.registration_tag },
        { label: 'Email', value: attendee.email || 'None' },
        { label: 'Grad Class', value: attendee.grad_year ? `Class of ${attendee.grad_year}` : 'N/A' },
      ],
      confirmText: 'Delete Record',
      isDanger: true,
      onConfirm: async () => {
        const targetKey = attendee.id || attendee.registration_tag;
        setUpdatingId(targetKey);
        try {
          // 1. Supabase delete if id exists
          if (attendee.id) {
            try {
              await supabase
                .from('alumni_registrations')
                .delete()
                .eq('id', attendee.id);
            } catch (sbErr) {
              console.warn('Supabase delete attendee note:', sbErr);
            }
          }

          // 2. LocalStorage delete
          try {
            const local = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
            const updatedLocal = local.filter(r => 
              (attendee.id ? r.id !== attendee.id : true) &&
              (attendee.registration_tag ? r.registration_tag !== attendee.registration_tag : true) &&
              (attendee.email ? r.email !== attendee.email : true)
            );
            localStorage.setItem('asf_census_submissions', JSON.stringify(updatedLocal));
          } catch (lsErr) {}

          // 3. State update with non-blocking transition
          startTransition(() => {
            setRegistrations(prev => prev.filter(r => 
              (attendee.id ? r.id !== attendee.id : true) &&
              (attendee.registration_tag ? r.registration_tag !== attendee.registration_tag : true)
            ));
            if (selectedAttendee?.id === attendee.id || selectedAttendee?.registration_tag === attendee.registration_tag) {
              setSelectedAttendee(null);
            }
          });
          showToast(`Deleted registration for ${attendee.full_name}`, 'success');
        } catch (err) {
          console.error('Delete attendee error:', err);
          showToast('Error deleting registration: ' + err.message, 'error');
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  // Bulk purge registrations (test records or all)
  const purgeRegistrations = (mode = 'TEST_ONLY') => {
    if (registrations.length === 0) {
      showToast('No registrations to delete.', 'info');
      return;
    }

    let toDelete = [];
    if (mode === 'TEST_ONLY') {
      toDelete = registrations.filter(r => 
        (r.full_name && r.full_name.toLowerCase().includes('test')) ||
        (r.email && r.email.toLowerCase().includes('test')) ||
        (r.registration_tag && r.registration_tag.includes('TEST'))
      );
      if (toDelete.length === 0) {
        showToast('No test registrations found.', 'info');
        return;
      }
    } else {
      toDelete = [...registrations];
    }

    const title = mode === 'TEST_ONLY' ? 'Purge Test Registrations' : 'WARNING: Purge ALL Registrations';
    const message = mode === 'TEST_ONLY'
      ? `This will permanently remove ${toDelete.length} test registration record(s) from Supabase and local storage.`
      : `CRITICAL WARNING: This will permanently delete ALL ${registrations.length} registrations. This action cannot be reversed!`;

    openConfirmModal({
      title,
      message,
      details: [
        { label: 'Scope', value: mode === 'TEST_ONLY' ? 'Test Submissions Only' : 'ALL REGISTRATIONS' },
        { label: 'Total Records to Purge', value: `${toDelete.length} attendee(s)` }
      ],
      confirmText: mode === 'TEST_ONLY' ? `Purge ${toDelete.length} Test Record(s)` : 'Permanently Delete ALL',
      isDanger: true,
      onConfirm: async () => {
        const idsToDelete = new Set(toDelete.map(r => r.id).filter(Boolean));
        const tagsToDelete = new Set(toDelete.map(r => r.registration_tag).filter(Boolean));

        for (const id of idsToDelete) {
          try {
            await supabase.from('alumni_registrations').delete().eq('id', id);
          } catch (e) {}
        }

        try {
          const local = JSON.parse(localStorage.getItem('asf_census_submissions') || '[]');
          const updatedLocal = local.filter(r => 
            (!r.id || !idsToDelete.has(r.id)) &&
            (!r.registration_tag || !tagsToDelete.has(r.registration_tag))
          );
          localStorage.setItem('asf_census_submissions', JSON.stringify(updatedLocal));
        } catch (e) {}

        startTransition(() => {
          setRegistrations(prev => prev.filter(r => 
            (!r.id || !idsToDelete.has(r.id)) &&
            (!r.registration_tag || !tagsToDelete.has(r.registration_tag))
          ));
        });
        showToast(`Deleted ${toDelete.length} registration(s).`, 'success');
      }
    });
  };

  // Delete individual sponsorship / donation / ad booking record
  const deleteSponsorship = (record) => {
    const donorName = record.donor_name || record.organization || 'Anonymous';
    const amountStr = Number(record.amount || 0).toLocaleString();
    const isAd = Boolean(record.tier_key?.startsWith('ad_') || record.reference?.includes('-AD-'));

    openConfirmModal({
      title: isAd ? 'Delete Compendium Ad Record' : 'Delete Sponsorship / Donation',
      message: `Are you sure you want to delete this payment record from the financial ledger? This action cannot be undone.`,
      details: [
        { label: 'Contributor', value: donorName },
        { label: 'Amount', value: `₦${amountStr}` },
        { label: 'Category / Tier', value: record.tier_name || 'Contribution' },
        { label: 'Reference Code', value: record.reference || 'N/A' },
        { label: 'Channel', value: record.channel || 'PAYSTACK' },
      ],
      confirmText: 'Delete Record',
      isDanger: true,
      onConfirm: async () => {
        setUpdatingId(record.reference);
        try {
          // 1. Supabase delete
          try {
            await supabase
              .from('sponsorship_payments')
              .delete()
              .eq('reference', record.reference);
          } catch (sbErr) {
            console.warn('Supabase delete sponsorship note:', sbErr);
          }

          // 2. LocalStorage delete
          try {
            const local = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
            const updatedLocal = local.filter(s => s.reference !== record.reference);
            localStorage.setItem('asf_sponsorship_payments', JSON.stringify(updatedLocal));
          } catch (lsErr) {
            console.warn('LocalStorage delete error:', lsErr);
          }

          // 3. State update with startTransition
          startTransition(() => {
            setSponsorships(prev => prev.filter(s => s.reference !== record.reference));
          });
          showToast(`Deleted payment record for ${donorName}`, 'success');
        } catch (err) {
          console.error('Delete sponsorship error:', err);
          showToast('Error deleting record: ' + err.message, 'error');
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  // Purge test / all sponsorship records
  const purgeSponsorships = (mode = 'TEST_ONLY') => {
    if (sponsorships.length === 0) {
      showToast('There are no records to delete.', 'info');
      return;
    }

    let recordsToDelete = [];
    if (mode === 'TEST_ONLY') {
      recordsToDelete = sponsorships.filter(s => 
        (s.reference && (s.reference.startsWith('ASF45TH') || s.reference.startsWith('ECO-') || s.reference.includes('TRF') || s.reference.includes('SAMPLE'))) ||
        (s.donor_name && s.donor_name.toLowerCase().includes('test'))
      );
      if (recordsToDelete.length === 0) {
        showToast('No test records found.', 'info');
        return;
      }
    } else {
      recordsToDelete = [...sponsorships];
    }

    const title = mode === 'TEST_ONLY' ? 'Purge Test Donations & Ad Bookings' : 'WARNING: Purge ENTIRE Ledger';
    const message = mode === 'TEST_ONLY'
      ? `This will remove ${recordsToDelete.length} test records (sample references and test transactions) from both Supabase and local storage.`
      : `CRITICAL WARNING: This will permanently delete ALL ${recordsToDelete.length} entries in the sponsorship & ads ledger. This cannot be undone!`;

    openConfirmModal({
      title,
      message,
      details: [
        { label: 'Scope', value: mode === 'TEST_ONLY' ? 'Test Transactions Only' : 'ENTIRE FINANCIAL LEDGER' },
        { label: 'Total Records to Purge', value: `${recordsToDelete.length} transaction(s)` }
      ],
      confirmText: mode === 'TEST_ONLY' ? `Purge ${recordsToDelete.length} Test Record(s)` : 'Permanently Delete ALL',
      isDanger: true,
      onConfirm: async () => {
        const refsToDelete = new Set(recordsToDelete.map(r => r.reference));

        // 1. Delete from Supabase
        try {
          for (const ref of refsToDelete) {
            await supabase
              .from('sponsorship_payments')
              .delete()
              .eq('reference', ref);
          }
        } catch (e) {
          console.warn('Supabase batch delete note:', e);
        }

        // 2. Delete from LocalStorage
        try {
          const local = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
          const updatedLocal = local.filter(s => !refsToDelete.has(s.reference));
          localStorage.setItem('asf_sponsorship_payments', JSON.stringify(updatedLocal));
        } catch (e) {}

        startTransition(() => {
          setSponsorships(prev => prev.filter(s => !refsToDelete.has(s.reference)));
        });
        showToast(`Successfully deleted ${recordsToDelete.length} record(s).`, 'success');
      }
    });
  };

  // Delete video submission
  const deleteVideoSubmission = (video) => {
    const name = video.full_name || 'Submissions';

    openConfirmModal({
      title: 'Delete Goodwill Video Submission',
      message: `Are you sure you want to delete the goodwill video submission from "${name}"?`,
      details: [
        { label: 'Submitter', value: name },
        { label: 'Email', value: video.email || 'N/A' },
        { label: 'Grad Class', value: video.grad_year ? `Class of ${video.grad_year}` : 'N/A' },
        { label: 'File Name', value: video.file_name || 'goodwill-video.mp4' },
      ],
      confirmText: 'Delete Video',
      isDanger: true,
      onConfirm: async () => {
        const vidId = video.id || video.submission_id || video.file_name;
        setUpdatingId(vidId);
        try {
          // 1. Delete from Supabase
          if (video.id) {
            try {
              await supabase
                .from('video_goodwill_submissions')
                .delete()
                .eq('id', video.id);
            } catch (sbErr) {}
          } else if (video.submission_id) {
            try {
              await supabase
                .from('video_goodwill_submissions')
                .delete()
                .eq('submission_id', video.submission_id);
            } catch (sbErr) {}
          }

          // 2. Delete from LocalStorage
          try {
            const local = JSON.parse(localStorage.getItem('asf_goodwill_videos') || '[]');
            const updatedLocal = local.filter(v => 
              (video.submission_id ? v.submission_id !== video.submission_id : true) &&
              (video.id ? v.id !== video.id : true) &&
              (video.file_name ? v.file_name !== video.file_name : true)
            );
            localStorage.setItem('asf_goodwill_videos', JSON.stringify(updatedLocal));
          } catch (lsErr) {}

          // 3. State update
          startTransition(() => {
            setVideoSubmissions(prev => prev.filter(v => 
              (video.submission_id ? v.submission_id !== video.submission_id : true) &&
              (video.id ? v.id !== video.id : true)
            ));
          });
          showToast(`Deleted video submission from ${name}`, 'success');
        } catch (err) {
          console.error('Delete video error:', err);
          showToast('Error deleting video: ' + err.message, 'error');
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  // Update Compendium Ad Editorial Status
  const updateAdEditorialStatus = async (ad, newStatus) => {
    const targetRef = ad.booking_reference || ad.reference;
    setUpdatingId(targetRef);
    try {
      if (ad.id) {
        try {
          await supabase
            .from('compendium_ad_bookings')
            .update({ editorial_status: newStatus })
            .eq('id', ad.id);
        } catch (e) {}
      } else if (targetRef) {
        try {
          await supabase
            .from('compendium_ad_bookings')
            .update({ editorial_status: newStatus })
            .eq('booking_reference', targetRef);
        } catch (e) {}
      }

      try {
        const local = JSON.parse(localStorage.getItem('asf_compendium_ad_bookings') || '[]');
        const updated = local.map(a =>
          (a.booking_reference === targetRef || (ad.id && a.id === ad.id))
            ? { ...a, editorial_status: newStatus }
            : a
        );
        localStorage.setItem('asf_compendium_ad_bookings', JSON.stringify(updated));
      } catch (e) {}

      startTransition(() => {
        setAdBookings(prev => prev.map(a =>
          (a.booking_reference === targetRef || (ad.id && a.id === ad.id))
            ? { ...a, editorial_status: newStatus }
            : a
        ));
      });
      showToast(`Ad status updated to: ${newStatus}`, 'success');
    } catch (err) {
      showToast('Error updating status: ' + err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Compendium Ad Assigned Magazine Page
  const updateAdAssignedPage = async (ad, pageNum) => {
    const targetRef = ad.booking_reference || ad.reference;
    try {
      if (ad.id) {
        try {
          await supabase
            .from('compendium_ad_bookings')
            .update({ assigned_page_number: pageNum })
            .eq('id', ad.id);
        } catch (e) {}
      } else if (targetRef) {
        try {
          await supabase
            .from('compendium_ad_bookings')
            .update({ assigned_page_number: pageNum })
            .eq('booking_reference', targetRef);
        } catch (e) {}
      }

      try {
        const local = JSON.parse(localStorage.getItem('asf_compendium_ad_bookings') || '[]');
        const updated = local.map(a =>
          (a.booking_reference === targetRef || (ad.id && a.id === ad.id))
            ? { ...a, assigned_page_number: pageNum }
            : a
        );
        localStorage.setItem('asf_compendium_ad_bookings', JSON.stringify(updated));
      } catch (e) {}

      startTransition(() => {
        setAdBookings(prev => prev.map(a =>
          (a.booking_reference === targetRef || (ad.id && a.id === ad.id))
            ? { ...a, assigned_page_number: pageNum }
            : a
        ));
      });
      showToast(`Assigned page set to ${pageNum || 'Unassigned'}`, 'success');
    } catch (err) {
      console.warn('Page assignment update note:', err);
    }
  };

  // Delete individual compendium ad booking
  const deleteAdBooking = (ad) => {
    const advName = ad.advertiser_name || ad.donor_name || ad.company_name || 'Advertiser';
    const amountStr = Number(ad.amount || 0).toLocaleString();
    const targetRef = ad.booking_reference || ad.reference;

    openConfirmModal({
      title: 'Delete Compendium Ad Booking',
      message: `Are you sure you want to delete this compendium ad booking? This will remove the reservation from the magazine ledger and production manifest.`,
      details: [
        { label: 'Advertiser', value: advName },
        { label: 'Slot / Tier', value: ad.ad_tier_name || ad.tier_name || 'Ad Slot' },
        { label: 'Amount', value: `₦${amountStr}` },
        { label: 'Reference', value: targetRef || 'N/A' },
      ],
      confirmText: 'Delete Ad Booking',
      isDanger: true,
      onConfirm: async () => {
        setUpdatingId(targetRef);
        try {
          // 1. Delete from compendium_ad_bookings in Supabase
          if (ad.id) {
            try {
              await supabase.from('compendium_ad_bookings').delete().eq('id', ad.id);
            } catch (e) {}
          } else if (targetRef) {
            try {
              await supabase.from('compendium_ad_bookings').delete().eq('booking_reference', targetRef);
            } catch (e) {}
          }

          // 2. Also delete from sponsorship_payments
          if (targetRef) {
            try {
              await supabase.from('sponsorship_payments').delete().eq('reference', targetRef);
            } catch (e) {}
          }

          // 3. Delete from LocalStorage
          try {
            const localAds = JSON.parse(localStorage.getItem('asf_compendium_ad_bookings') || '[]');
            const updatedAds = localAds.filter(a => a.booking_reference !== targetRef && (!ad.id || a.id !== ad.id));
            localStorage.setItem('asf_compendium_ad_bookings', JSON.stringify(updatedAds));
          } catch (e) {}

          try {
            const localSp = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
            const updatedSp = localSp.filter(s => s.reference !== targetRef);
            localStorage.setItem('asf_sponsorship_payments', JSON.stringify(updatedSp));
          } catch (e) {}

          // 4. Update React state
          startTransition(() => {
            setAdBookings(prev => prev.filter(a => a.booking_reference !== targetRef && (!ad.id || a.id !== ad.id)));
            setSponsorships(prev => prev.filter(s => s.reference !== targetRef));
            if (selectedAdBooking?.booking_reference === targetRef) {
              setSelectedAdBooking(null);
            }
          });
          showToast(`Deleted ad booking for ${advName}`, 'success');
        } catch (err) {
          console.error('Delete ad booking error:', err);
          showToast('Error deleting ad: ' + err.message, 'error');
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  // Bulk purge compendium test ads
  const purgeAdBookings = (mode = 'TEST_ONLY') => {
    if (adBookings.length === 0) {
      showToast('No ad bookings to delete.', 'info');
      return;
    }

    let toDelete = [];
    if (mode === 'TEST_ONLY') {
      toDelete = adBookings.filter(a =>
        (a.booking_reference && (a.booking_reference.includes('TEST') || a.booking_reference.includes('SAMPLE') || a.booking_reference.startsWith('ECO-AD-TRF'))) ||
        (a.advertiser_name && a.advertiser_name.toLowerCase().includes('test'))
      );
      if (toDelete.length === 0) {
        showToast('No test ad bookings found.', 'info');
        return;
      }
    } else {
      toDelete = [...adBookings];
    }

    openConfirmModal({
      title: mode === 'TEST_ONLY' ? 'Purge Test Ad Bookings' : 'WARNING: Purge ALL Ad Bookings',
      message: mode === 'TEST_ONLY'
        ? `This will remove ${toDelete.length} test compendium ad booking(s) from Supabase and local storage.`
        : `CRITICAL WARNING: This will permanently remove ALL ${adBookings.length} ad bookings!`,
      details: [
        { label: 'Scope', value: mode === 'TEST_ONLY' ? 'Test Ads Only' : 'ALL AD BOOKINGS' },
        { label: 'Total Records to Purge', value: `${toDelete.length} booking(s)` }
      ],
      confirmText: mode === 'TEST_ONLY' ? `Purge ${toDelete.length} Test Ads` : 'Permanently Delete ALL',
      isDanger: true,
      onConfirm: async () => {
        const refsToDelete = new Set(toDelete.map(a => a.booking_reference || a.reference).filter(Boolean));
        const idsToDelete = new Set(toDelete.map(a => a.id).filter(Boolean));

        for (const ref of refsToDelete) {
          try {
            await supabase.from('compendium_ad_bookings').delete().eq('booking_reference', ref);
            await supabase.from('sponsorship_payments').delete().eq('reference', ref);
          } catch (e) {}
        }
        for (const id of idsToDelete) {
          try {
            await supabase.from('compendium_ad_bookings').delete().eq('id', id);
          } catch (e) {}
        }

        try {
          const local = JSON.parse(localStorage.getItem('asf_compendium_ad_bookings') || '[]');
          const updated = local.filter(a => !refsToDelete.has(a.booking_reference) && (!a.id || !idsToDelete.has(a.id)));
          localStorage.setItem('asf_compendium_ad_bookings', JSON.stringify(updated));
        } catch (e) {}

        try {
          const localSp = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
          const updatedSp = localSp.filter(s => !refsToDelete.has(s.reference));
          localStorage.setItem('asf_sponsorship_payments', JSON.stringify(updatedSp));
        } catch (e) {}

        startTransition(() => {
          setAdBookings(prev => prev.filter(a => !refsToDelete.has(a.booking_reference) && (!a.id || !idsToDelete.has(a.id))));
          setSponsorships(prev => prev.filter(s => !refsToDelete.has(s.reference)));
        });
        showToast(`Successfully deleted ${toDelete.length} ad booking(s).`, 'success');
      }
    });
  };

  // Export Compendium Ad Production Manifest to CSV
  const exportAdManifestCSV = () => {
    if (adBookings.length === 0) {
      showToast('No ad bookings to export.', 'info');
      return;
    }

    const headers = [
      'Booking Reference',
      'Advertiser Full Name',
      'Company / Brand',
      'Brand Headline',
      'Ad Placement Slot',
      'Dimensions & Bleed',
      'Amount (NGN)',
      'Payment Method',
      'Payment Status',
      'Editorial Production Status',
      'Assigned Page',
      'Contact Phone',
      'Contact Email',
      'Artwork File / URL',
      'Instructions & Copy',
      'Booking Date'
    ];

    const rows = filteredAdBookings.map(ad => [
      `"${ad.booking_reference || ad.reference || ''}"`,
      `"${ad.advertiser_name || ad.donor_name || ''}"`,
      `"${ad.company_name || ad.organization || ''}"`,
      `"${(ad.brand_headline || '').replace(/"/g, '""')}"`,
      `"${ad.ad_tier_name || ad.tier_name || ''}"`,
      `"${ad.ad_dimensions || ''}"`,
      ad.amount || 0,
      `"${ad.payment_method || ''}"`,
      `"${ad.payment_status || 'VERIFIED'}"`,
      `"${ad.editorial_status || 'RECEIVED'}"`,
      `"${ad.assigned_page_number || 'Unassigned'}"`,
      `"${ad.phone || ''}"`,
      `"${ad.email || ''}"`,
      `"${ad.artwork_url || ad.artwork_file_name || 'None'}"`,
      `"${(ad.message_note || '').replace(/"/g, '""')}"`,
      `"${ad.created_at || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ASF-RSU-45th-Compendium-Ad-Manifest-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Filtered sponsorships & compendium ads
  const filteredSponsorships = useMemo(() => {
    return sponsorships.filter(s => {
      const q = sponsorshipSearch.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        (s.donor_name && s.donor_name.toLowerCase().includes(q)) ||
        (s.organization && s.organization.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.reference && s.reference.toLowerCase().includes(q)) ||
        (s.tier_name && s.tier_name.toLowerCase().includes(q)) ||
        (s.phone && s.phone.toLowerCase().includes(q));

      const isAd = (s.tier_key && s.tier_key.startsWith('ad_')) ||
                   (s.tier_name && s.tier_name.toLowerCase().includes('ad')) ||
                   (s.reference && s.reference.includes('-AD-'));
      const matchesType =
        sponsorshipFilterType === 'ALL' ||
        (sponsorshipFilterType === 'AD' && isAd) ||
        (sponsorshipFilterType === 'DONATION' && !isAd);

      const isPaystack = Boolean(s.payment_method?.includes('Paystack'));
      const matchesChannel =
        sponsorshipFilterChannel === 'ALL' ||
        (sponsorshipFilterChannel === 'PAYSTACK' && isPaystack) ||
        (sponsorshipFilterChannel === 'TRANSFER' && !isPaystack);

      return matchesSearch && matchesType && matchesChannel;
    });
  }, [sponsorships, sponsorshipSearch, sponsorshipFilterType, sponsorshipFilterChannel]);

  // Filtered compendium ad bookings
  const filteredAdBookings = useMemo(() => {
    return adBookings.filter(ad => {
      const q = adSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (ad.advertiser_name && ad.advertiser_name.toLowerCase().includes(q)) ||
        (ad.company_name && ad.company_name.toLowerCase().includes(q)) ||
        (ad.brand_headline && ad.brand_headline.toLowerCase().includes(q)) ||
        (ad.email && ad.email.toLowerCase().includes(q)) ||
        (ad.booking_reference && ad.booking_reference.toLowerCase().includes(q)) ||
        (ad.ad_tier_name && ad.ad_tier_name.toLowerCase().includes(q)) ||
        (ad.phone && ad.phone.toLowerCase().includes(q));

      const matchesTier =
        adFilterTier === 'ALL' || ad.ad_tier_key === adFilterTier;

      const matchesStatus =
        adFilterStatus === 'ALL' || (ad.editorial_status || 'RECEIVED') === adFilterStatus;

      const isVerified = (ad.payment_status === 'VERIFIED');
      const matchesPayment =
        adFilterPayment === 'ALL' ||
        (adFilterPayment === 'VERIFIED' && isVerified) ||
        (adFilterPayment === 'PENDING' && !isVerified);

      return matchesSearch && matchesTier && matchesStatus && matchesPayment;
    });
  }, [adBookings, adSearch, adFilterTier, adFilterStatus, adFilterPayment]);

  // Compendium Ads Metrics
  const adStats = useMemo(() => {
    const total = adBookings.length;
    const revenue = adBookings.reduce((sum, a) => sum + Number(a.amount || 0), 0);
    const approved = adBookings.filter(a => a.editorial_status === 'APPROVED_FOR_PRINT' || a.editorial_status === 'PRINTED').length;
    const inReview = adBookings.filter(a => a.editorial_status === 'IN_REVIEW' || a.editorial_status === 'RECEIVED').length;
    const withArtwork = adBookings.filter(a => Boolean(a.artwork_url || a.artwork_file_name)).length;

    return { total, revenue, approved, inReview, withArtwork };
  }, [adBookings]);

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
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors touch-manipulation active:scale-95"
            >
              <span className="pointer-events-none">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-5 sm:space-y-8">
        
        {/* Admin Navigation Tabs */}
        <div className="flex items-center space-x-2 xs:space-x-2.5 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none px-1">
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
            type="button"
            onClick={() => setActiveAdminTab('ADS')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeAdminTab === 'ADS'
                ? 'bg-jubilee-gold text-emerald-950 shadow-luxury'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeAdminTab === 'ADS' ? 'text-emerald-950' : 'text-jubilee-gold'}`} />
            <span>Compendium Ads</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeAdminTab === 'ADS'
                ? 'bg-emerald-950/20 text-emerald-950'
                : 'bg-white/10 text-stone-300'
            }`}>
              {adBookings.length}
            </span>
          </button>

          <button
            type="button"
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

          <button
            type="button"
            onClick={() => setActiveAdminTab('PHOTOS')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeAdminTab === 'PHOTOS'
                ? 'bg-jubilee-gold text-emerald-950 shadow-luxury'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <ImageIcon className={`w-3.5 h-3.5 shrink-0 ${activeAdminTab === 'PHOTOS' ? 'text-emerald-950' : 'text-jubilee-gold'}`} />
            <span>Community Photos</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeAdminTab === 'PHOTOS'
                ? 'bg-emerald-950/20 text-emerald-950'
                : 'bg-white/10 text-stone-300'
            }`}>
              {communityPhotos.length}
            </span>
            {communityPhotos.filter(p => p.status === 'PENDING').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-emerald-950 font-bold animate-pulse">
                {communityPhotos.filter(p => p.status === 'PENDING').length} Pending
              </span>
            )}
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

            <button
              type="button"
              onClick={() => purgeRegistrations('TEST_ONLY')}
              className="w-full sm:w-auto px-2.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
              title="Purge Test Registrations"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0 pointer-events-none" />
              <span className="pointer-events-none">Purge Test</span>
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
                            type="button"
                            onClick={() => setSelectedAttendee(attendee)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-jubilee-lightgold transition-colors inline-block"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4 pointer-events-none" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAttendee(attendee)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800/40 transition-colors inline-block"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4 pointer-events-none" />
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
                        type="button"
                        onClick={() => setSelectedAttendee(attendee)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-jubilee-lightgold border border-white/10 transition-colors touch-manipulation active:scale-95 shrink-0"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4 pointer-events-none" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteAttendee(attendee)}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors touch-manipulation active:scale-95 shrink-0"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
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
              
              {/* Header Title & Top Actions */}
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
                      const headers = ['Reference', 'Donor Name', 'Organization', 'Tier', 'Amount (NGN)', 'Channel', 'Status', 'Email', 'Phone', 'Date'];
                      const rows = filteredSponsorships.map(s => [
                        `"${s.reference}"`,
                        `"${s.donor_name}"`,
                        `"${s.organization || ''}"`,
                        `"${s.tier_name || s.tier_key}"`,
                        s.amount,
                        `"${s.payment_method}"`,
                        `"${s.status || 'VERIFIED'}"`,
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
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => purgeSponsorships('TEST_ONLY')}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 active:scale-95 transition-all"
                    title="Purge Test Donations & Ad Bookings"
                  >
                    <Trash2 className="w-3.5 h-3.5 pointer-events-none shrink-0" />
                    <span className="pointer-events-none">Purge Test</span>
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

              {/* Filter and Search Bar */}
              <div className="p-3.5 sm:p-4 border-b border-white/10 bg-black/40 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-3">
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={sponsorshipSearch}
                    onChange={(e) => setSponsorshipSearch(e.target.value)}
                    placeholder="Search donor, ref, email..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-none focus:border-jubilee-gold"
                  />
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto text-xs">
                  <select
                    value={sponsorshipFilterType}
                    onChange={(e) => setSponsorshipFilterType(e.target.value)}
                    className="w-full sm:w-auto px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="DONATION">Donations / Support</option>
                    <option value="AD">Compendium Ads</option>
                  </select>

                  <select
                    value={sponsorshipFilterChannel}
                    onChange={(e) => setSponsorshipFilterChannel(e.target.value)}
                    className="w-full sm:w-auto px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-jubilee-gold"
                  >
                    <option value="ALL">All Channels</option>
                    <option value="PAYSTACK">Paystack Online</option>
                    <option value="TRANSFER">Ecobank Transfer</option>
                  </select>

                  <span className="text-xs text-stone-400 font-mono self-center px-1">
                    {filteredSponsorships.length} record{filteredSponsorships.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              {sponsorships.length === 0 ? (
                <div className="p-12 text-center text-stone-400 space-y-2">
                  <HeartHandshake className="w-10 h-10 text-stone-600 mx-auto" />
                  <p className="text-sm font-medium">No sponsorship records logged yet.</p>
                  <p className="text-xs text-stone-500">Payments made via Paystack or direct transfer notifications will appear here immediately.</p>
                </div>
              ) : filteredSponsorships.length === 0 ? (
                <div className="p-12 text-center text-stone-400 space-y-2">
                  <Search className="w-8 h-8 text-stone-600 mx-auto" />
                  <p className="text-sm font-medium">No records match your search criteria.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-300">
                      <thead className="bg-black/60 text-stone-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Contributor / Brand</th>
                          <th className="p-3.5">Category / Placement</th>
                          <th className="p-3.5">Amount (₦)</th>
                          <th className="p-3.5">Channel / Ref</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Contact</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredSponsorships.map((s, idx) => (
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
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                s.status === 'VERIFIED'
                                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                                  : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                              }`}>
                                {s.status === 'VERIFIED' ? 'Cleared' : 'Pending Bank Rec'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-white text-[11px] truncate max-w-[140px]">{s.email}</span>
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
                            <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                              <a
                                href={getMailtoLink({
                                  email: s.email,
                                  donorName: s.donor_name,
                                  tierName: s.tier_name || s.tier_key,
                                  amount: s.amount,
                                  reference: s.reference,
                                  isAd: Boolean(s.tier_key?.startsWith('ad_') || s.reference?.includes('-AD-'))
                                })}
                                title="Open Pre-filled Acknowledgment Email"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-jubilee-lightgold transition-colors inline-block"
                              >
                                <Mail className="w-3.5 h-3.5 pointer-events-none" />
                              </a>
                              <button
                                type="button"
                                onClick={() => deleteSponsorship(s)}
                                disabled={updatingId === s.reference}
                                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800/40 transition-colors inline-block disabled:opacity-50"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Dedicated Card List (< md screens) */}
                  <div className="block md:hidden divide-y divide-white/[0.06] p-3 space-y-3">
                    {filteredSponsorships.map((s, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 shadow-md">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-white text-sm">{s.donor_name}</div>
                            {s.organization && (
                              <div className="text-[11px] text-jubilee-lightgold">{s.organization}</div>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            s.status === 'VERIFIED'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                          }`}>
                            {s.status === 'VERIFIED' ? 'Cleared' : 'Pending Bank Rec'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-jubilee-gold/20 text-jubilee-lightgold border border-jubilee-gold/30">
                            {s.tier_name || s.tier_key}
                          </span>
                          <span className="font-retro font-bold text-base text-amber-400">
                            ₦{Number(s.amount).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-[11px] text-stone-400 space-y-1 font-mono pt-1">
                          <div>Ref: <span className="text-white">{s.reference}</span></div>
                          <div>Method: <span className="text-emerald-300">{s.payment_method}</span></div>
                          <div>Contact: <span className="text-white">{s.email}</span></div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] text-stone-500">
                            {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                          <div className="flex items-center space-x-2">
                            <a
                              href={getMailtoLink({
                                email: s.email,
                                donorName: s.donor_name,
                                tierName: s.tier_name || s.tier_key,
                                amount: s.amount,
                                reference: s.reference,
                                isAd: Boolean(s.tier_key?.startsWith('ad_') || s.reference?.includes('-AD-'))
                              })}
                              className="px-2.5 py-1.5 rounded-lg bg-white/10 text-jubilee-lightgold text-xs font-semibold flex items-center space-x-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Email</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteSponsorship(s)}
                              disabled={updatingId === s.reference}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold flex items-center space-x-1 disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3 pointer-events-none" />
                              <span className="pointer-events-none">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. COMPENDIUM ADS & MAGAZINE PRODUCTION TAB */}
        {activeAdminTab === 'ADS' && (
          <div className="space-y-6">
            
            {/* Ad Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-jubilee-gold/40 bg-jubilee-gold/10">
                <span className="text-[10px] sm:text-[11px] text-jubilee-lightgold font-bold uppercase tracking-wider block truncate">
                  Total Ad Revenue
                </span>
                <div className="text-xl sm:text-3xl font-retro font-black text-jubilee-gold mt-1 truncate">
                  ₦{adStats.revenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-200 mt-0.5 truncate">Committed Ad Bookings</div>
              </div>

              <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-white/10">
                <span className="text-[10px] sm:text-[11px] text-stone-400 font-semibold uppercase tracking-wider block truncate">
                  Total Ad Placements
                </span>
                <div className="text-xl sm:text-3xl font-retro font-black text-white mt-1 truncate">
                  {adStats.total}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 truncate">{adStats.withArtwork} Artwork Attached</div>
              </div>

              <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-white/10">
                <span className="text-[10px] sm:text-[11px] text-sky-400 font-semibold uppercase tracking-wider block truncate">
                  In Design / Review
                </span>
                <div className="text-xl sm:text-3xl font-retro font-black text-sky-300 mt-1 truncate">
                  {adStats.inReview}
                </div>
                <div className="text-[10px] text-sky-400/80 mt-0.5 truncate">Proofing &amp; Editorial</div>
              </div>

              <div className="luxury-glass rounded-2xl p-3 sm:p-4 border border-white/10">
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block truncate">
                  Approved For Print
                </span>
                <div className="text-xl sm:text-3xl font-retro font-black text-emerald-300 mt-1 truncate">
                  {adStats.approved}
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5 truncate">Ready for Press Run</div>
              </div>
            </div>

            {/* Header, Export & Filter Actions */}
            <div className="luxury-glass rounded-2xl p-3.5 sm:p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-retro font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-jubilee-gold shrink-0" />
                  <span>Commemorative Compendium Ad Manifest &amp; Production Ledger</span>
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Track advert bookings, proof approvals, magazine page allocations, and high-res artwork files for print.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={exportAdManifestCSV}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-jubilee-gold/20 hover:bg-jubilee-gold/30 text-jubilee-lightgold border border-jubilee-gold/40 text-xs font-bold transition-all touch-manipulation active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 pointer-events-none" />
                  <span>Export Production CSV</span>
                </button>

                <button
                  type="button"
                  onClick={fetchAdBookings}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors touch-manipulation active:scale-95 shrink-0"
                  title="Refresh Compendium Ads"
                >
                  <RefreshCw className="w-4 h-4 pointer-events-none" />
                </button>

                <button
                  type="button"
                  onClick={() => purgeAdBookings('TEST_ONLY')}
                  className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-all touch-manipulation active:scale-95 shrink-0"
                  title="Purge Sample / Test Ad Bookings"
                >
                  <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                  <span>Purge Test Ads</span>
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="luxury-glass rounded-2xl p-3.5 sm:p-4 border border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                {/* Search */}
                <div className="relative md:col-span-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={adSearch}
                    onChange={(e) => setAdSearch(e.target.value)}
                    placeholder="Search advertiser, brand, phone..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-400 text-xs focus:outline-none focus:border-jubilee-gold transition-colors"
                  />
                  {adSearch && (
                    <button
                      type="button"
                      onClick={() => setAdSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5 pointer-events-none" />
                    </button>
                  )}
                </div>

                {/* Filter Tier */}
                <div className="relative">
                  <select
                    value={adFilterTier}
                    onChange={(e) => setAdFilterTier(e.target.value)}
                    aria-label="Filter by Ad Tier"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-jubilee-gold transition-colors appearance-none cursor-pointer touch-manipulation"
                  >
                    <option value="ALL" className="bg-[#051A0F]">All Ad Sizes ({adBookings.length})</option>
                    {Object.values(COMPENDIUM_AD_TIERS).map(tier => (
                      <option key={tier.key} value={tier.key} className="bg-[#051A0F]">
                        {tier.name} (₦{tier.rate.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Editorial Status */}
                <div className="relative">
                  <select
                    value={adFilterStatus}
                    onChange={(e) => setAdFilterStatus(e.target.value)}
                    aria-label="Filter by Editorial Status"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-jubilee-gold transition-colors appearance-none cursor-pointer touch-manipulation"
                  >
                    <option value="ALL" className="bg-[#051A0F]">All Production Statuses</option>
                    {AD_EDITORIAL_STATUSES.map(st => (
                      <option key={st.key} value={st.key} className="bg-[#051A0F]">
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Payment */}
                <div className="relative">
                  <select
                    value={adFilterPayment}
                    onChange={(e) => setAdFilterPayment(e.target.value)}
                    aria-label="Filter by Payment Status"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-jubilee-gold transition-colors appearance-none cursor-pointer touch-manipulation"
                  >
                    <option value="ALL" className="bg-[#051A0F]">All Payment Statuses</option>
                    <option value="VERIFIED" className="bg-[#051A0F]">Verified Paid</option>
                    <option value="PENDING" className="bg-[#051A0F]">Pending Verification</option>
                  </select>
                </div>
              </div>

              {(adSearch || adFilterTier !== 'ALL' || adFilterStatus !== 'ALL' || adFilterPayment !== 'ALL') && (
                <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                  <span>Showing {filteredAdBookings.length} of {adBookings.length} bookings matching filter criteria</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdSearch('');
                      setAdFilterTier('ALL');
                      setAdFilterStatus('ALL');
                      setAdFilterPayment('ALL');
                    }}
                    className="text-jubilee-lightgold hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Ad Bookings Ledger Content */}
            <div className="luxury-glass rounded-2xl border border-white/10 overflow-hidden">
              {filteredAdBookings.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <BookOpen className="w-12 h-12 text-jubilee-gold/40 mx-auto" />
                  <h4 className="text-base font-retro font-bold text-white">No Compendium Ad Bookings Found</h4>
                  <p className="text-xs text-stone-400 max-w-md mx-auto font-light">
                    {adBookings.length === 0
                      ? 'No adverts have been booked yet. Bookings completed via the Compendium Ads Portal will appear here in real-time.'
                      : 'No ad bookings match your selected search or filter criteria.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02] text-stone-400 uppercase tracking-wider font-semibold">
                          <th className="py-3 px-4">Advertiser &amp; Brand</th>
                          <th className="py-3 px-4">Slot &amp; Dimensions</th>
                          <th className="py-3 px-4">Rate &amp; Payment</th>
                          <th className="py-3 px-4">Artwork Asset</th>
                          <th className="py-3 px-4">Page #</th>
                          <th className="py-3 px-4">Editorial Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredAdBookings.map((ad, idx) => {
                          const advName = ad.advertiser_name || ad.donor_name || 'Advertiser';
                          const org = ad.company_name || ad.organization || '';
                          const isVerified = (ad.payment_status === 'VERIFIED');
                          const stConfig = AD_EDITORIAL_STATUSES.find(s => s.key === ad.editorial_status) || AD_EDITORIAL_STATUSES[0];
                          const tierSpec = COMPENDIUM_AD_TIERS[ad.ad_tier_key];

                          return (
                            <tr key={ad.booking_reference || ad.reference || idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-white">{advName}</div>
                                {org && (
                                  <div className="text-[11px] text-jubilee-lightgold font-medium flex items-center space-x-1 mt-0.5">
                                    <Building2 className="w-3 h-3 shrink-0" />
                                    <span>{org}</span>
                                  </div>
                                )}
                                {ad.brand_headline && (
                                  <div className="text-[11px] text-stone-300 italic mt-0.5 line-clamp-1 max-w-[200px]" title={ad.brand_headline}>
                                    "{ad.brand_headline}"
                                  </div>
                                )}
                                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                                  Ref: {ad.booking_reference || ad.reference}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-medium text-white">{ad.ad_tier_name || ad.tier_name || 'Ad Slot'}</div>
                                <div className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-stone-300 font-mono mt-1 border border-white/10">
                                  {ad.ad_dimensions || tierSpec?.dimensions || 'A4 Format'}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-jubilee-gold font-mono text-sm">
                                  ₦{Number(ad.amount || 0).toLocaleString()}
                                </div>
                                <div className="flex items-center space-x-1 mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isVerified 
                                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' 
                                      : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                                  }`}>
                                    {isVerified ? 'VERIFIED' : 'PENDING'}
                                  </span>
                                  <span className="text-[10px] text-stone-400">
                                    {ad.payment_method?.includes('Paystack') ? 'Card' : 'Transfer'}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                {ad.artwork_url ? (
                                  <div className="flex items-center space-x-2">
                                    <img 
                                      src={ad.artwork_url} 
                                      alt="Ad Artwork Thumbnail" 
                                      className="w-10 h-10 object-cover rounded-lg border border-jubilee-gold/40 shadow cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => setSelectedAdBooking(ad)}
                                    />
                                    <div>
                                      <a
                                        href={ad.artwork_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-jubilee-lightgold hover:underline font-semibold flex items-center space-x-1"
                                      >
                                        <span>View</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                      <div className="text-[10px] text-stone-400">Ready File</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1.5 text-stone-400 text-[11px]">
                                    <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>Secretariat Design</span>
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <input
                                  type="text"
                                  defaultValue={ad.assigned_page_number || ''}
                                  placeholder="Pg #"
                                  onBlur={(e) => updateAdAssignedPage(ad, e.target.value.trim())}
                                  className="w-16 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-center text-xs focus:outline-none focus:border-jubilee-gold"
                                  title="Enter assigned page number in the printed magazine"
                                />
                              </td>

                              <td className="py-3.5 px-4">
                                <select
                                  value={ad.editorial_status || 'RECEIVED'}
                                  onChange={(e) => updateAdEditorialStatus(ad, e.target.value)}
                                  aria-label="Update Editorial Status"
                                  className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${stConfig.color}`}
                                >
                                  {AD_EDITORIAL_STATUSES.map(st => (
                                    <option key={st.key} value={st.key} className="bg-[#051A0F] text-white">
                                      {st.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedAdBooking(ad)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-jubilee-lightgold transition-colors touch-manipulation"
                                    title="View Full Ad Booking Details"
                                  >
                                    <Eye className="w-3.5 h-3.5 pointer-events-none" />
                                  </button>

                                  {ad.phone && (
                                    <a
                                      href={`https://wa.me/${ad.phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors touch-manipulation"
                                      title="WhatsApp Contact"
                                    >
                                      <Phone className="w-3.5 h-3.5 pointer-events-none" />
                                    </a>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => deleteAdBooking(ad)}
                                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800/40 transition-colors touch-manipulation active:scale-95"
                                    title="Delete Ad Booking"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile & Tablet Card View */}
                  <div className="lg:hidden divide-y divide-white/10">
                    {filteredAdBookings.map((ad, idx) => {
                      const advName = ad.advertiser_name || ad.donor_name || 'Advertiser';
                      const org = ad.company_name || ad.organization || '';
                      const isVerified = (ad.payment_status === 'VERIFIED');
                      const stConfig = AD_EDITORIAL_STATUSES.find(s => s.key === ad.editorial_status) || AD_EDITORIAL_STATUSES[0];
                      const tierSpec = COMPENDIUM_AD_TIERS[ad.ad_tier_key];

                      return (
                        <div key={ad.booking_reference || ad.reference || idx} className="p-4 sm:p-5 space-y-3.5 bg-white/[0.02]">
                          
                          {/* Card Top: Reference + Status Badges */}
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono text-[11px] text-stone-400 font-semibold truncate">
                              Ref: {ad.booking_reference || ad.reference}
                            </span>
                            
                            <div className="flex items-center space-x-1.5 shrink-0">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isVerified 
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' 
                                  : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                              }`}>
                                {isVerified ? 'VERIFIED' : 'PENDING'}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {ad.payment_method?.includes('Paystack') ? 'Card' : 'Transfer'}
                              </span>
                            </div>
                          </div>

                          {/* Advertiser Name & Organization & Amount */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-base font-bold text-white leading-tight truncate">
                                {advName}
                              </h4>
                              {org && (
                                <div className="text-xs text-jubilee-lightgold font-medium flex items-center space-x-1 mt-0.5 truncate">
                                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{org}</span>
                                </div>
                              )}
                              {ad.alumni_set && (
                                <div className="text-[11px] text-stone-300 mt-0.5 truncate">
                                  {ad.alumni_set}
                                </div>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-base sm:text-lg font-bold text-jubilee-gold font-mono">
                                ₦{Number(ad.amount || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* Ad Placement & Headline Box */}
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-stone-400">Slot:</span>
                              <span className="font-semibold text-white truncate max-w-[200px]">
                                {ad.ad_tier_name || ad.tier_name || 'Ad Slot'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-stone-400">Dimensions:</span>
                              <span className="font-mono text-jubilee-lightgold text-[11px]">
                                {ad.ad_dimensions || tierSpec?.dimensions || 'A4 Format'}
                              </span>
                            </div>
                            {ad.brand_headline && (
                              <div className="pt-1.5 border-t border-white/5">
                                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Headline / Banner:</span>
                                <span className="text-stone-200 text-xs italic font-serif leading-snug block mt-0.5">
                                  "{ad.brand_headline}"
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Artwork Asset Preview if provided */}
                          {ad.artwork_url ? (
                            <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-jubilee-gold/10 border border-jubilee-gold/30">
                              <img 
                                src={ad.artwork_url} 
                                alt="Artwork Thumbnail" 
                                className="w-12 h-12 object-cover rounded-lg border border-jubilee-gold/50 shadow shrink-0 cursor-pointer"
                                onClick={() => setSelectedAdBooking(ad)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-jubilee-lightgold truncate">
                                  {ad.artwork_file_name || 'Ready Artwork File'}
                                </div>
                                <a 
                                  href={ad.artwork_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-stone-300 hover:text-white flex items-center space-x-1 mt-0.5"
                                >
                                  <span>Open full file</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 p-2 rounded-xl bg-amber-950/20 border border-amber-700/30 text-xs text-amber-200">
                              <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Secretariat Editorial Design Requested</span>
                            </div>
                          )}

                          {/* Contact Details (WhatsApp & Email) */}
                          <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-white/[0.06]">
                            <div className="flex items-center space-x-1.5 text-stone-300 min-w-0">
                              <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              {ad.phone ? (
                                <a
                                  href={`https://wa.me/${ad.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-emerald-400 hover:underline truncate font-mono text-[11px]"
                                >
                                  {ad.phone}
                                </a>
                              ) : (
                                <span className="text-stone-500 font-mono text-[11px]">No phone</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1.5 text-stone-300 min-w-0">
                              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              {ad.email ? (
                                <a
                                  href={`mailto:${ad.email}`}
                                  className="hover:text-jubilee-lightgold hover:underline truncate text-[11px]"
                                >
                                  {ad.email}
                                </a>
                              ) : (
                                <span className="text-stone-500 text-[11px]">No email</span>
                              )}
                            </div>
                          </div>

                          {/* Editorial Page Assignment & Status Row */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                                Assigned Page
                              </label>
                              <input
                                type="text"
                                defaultValue={ad.assigned_page_number || ''}
                                placeholder="Pg #"
                                onBlur={(e) => updateAdAssignedPage(ad, e.target.value.trim())}
                                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-jubilee-gold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                                Production Status
                              </label>
                              <select
                                value={ad.editorial_status || 'RECEIVED'}
                                onChange={(e) => updateAdEditorialStatus(ad, e.target.value)}
                                aria-label="Update Editorial Status"
                                className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none touch-manipulation ${stConfig.color}`}
                              >
                                {AD_EDITORIAL_STATUSES.map(st => (
                                  <option key={st.key} value={st.key} className="bg-[#051A0F] text-white">
                                    {st.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Touch-Friendly Action Bar */}
                          <div className="flex items-center space-x-2 pt-2.5 border-t border-white/[0.06]">
                            <button
                              type="button"
                              onClick={() => setSelectedAdBooking(ad)}
                              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-jubilee-lightgold border border-white/10 flex items-center justify-center space-x-1.5 transition-all touch-manipulation active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5 pointer-events-none" />
                              <span>View Full Dossier</span>
                            </button>

                            {ad.phone && (
                              <a
                                href={`https://wa.me/${ad.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors touch-manipulation active:scale-95 shrink-0"
                                title="WhatsApp Contact"
                              >
                                <Phone className="w-4 h-4 pointer-events-none" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteAdBooking(ad)}
                              className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors touch-manipulation active:scale-95 shrink-0"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4 pointer-events-none" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 4. GOODWILL VIDEO MESSAGES ARCHIVE TAB */}
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

                      <div className="flex items-center space-x-1.5">
                        {video.phone && (
                          <a
                            href={`https://wa.me/${video.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 text-xs transition-colors"
                            title="Contact Submitter on WhatsApp"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteVideoSubmission(video)}
                          disabled={updatingId === (video.id || video.submission_id || video.file_name)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors disabled:opacity-50"
                          title="Delete Video Submission"
                        >
                          <Trash2 className="w-4 h-4 pointer-events-none" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 5. COMMUNITY PHOTOS MODERATION PIPELINE TAB */}
        {activeAdminTab === 'PHOTOS' && (
          <div className="space-y-6">
            
            {/* Header & Metrics */}
            <div className="luxury-glass rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-retro font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-jubilee-gold" />
                  <span>Community Photo Repository &amp; Moderation Pipeline</span>
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Screen, verify, and approve throwback photos submitted by alumni before they appear in the public Living Archive.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 rounded-full bg-jubilee-gold/20 text-jubilee-lightgold font-bold text-xs border border-jubilee-gold/30">
                  {communityPhotos.length} Total Uploads
                </span>
                <button
                  onClick={fetchCommunityPhotos}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors"
                  title="Refresh Community Photos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Moderation Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Total Submissions</div>
                <div className="text-xl sm:text-2xl font-retro font-bold text-white mt-0.5">
                  {communityPhotos.length}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <div className="text-[10px] text-amber-300 uppercase font-semibold">Pending Review</div>
                <div className="text-xl sm:text-2xl font-retro font-bold text-amber-400 mt-0.5">
                  {communityPhotos.filter(p => p.status === 'PENDING').length}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-300 uppercase font-semibold">Approved (Live on Site)</div>
                <div className="text-xl sm:text-2xl font-retro font-bold text-emerald-400 mt-0.5">
                  {communityPhotos.filter(p => p.status === 'APPROVED').length}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <div className="text-[10px] text-rose-300 uppercase font-semibold">Rejected / Kept Hidden</div>
                <div className="text-xl sm:text-2xl font-retro font-bold text-rose-400 mt-0.5">
                  {communityPhotos.filter(p => p.status === 'REJECTED').length}
                </div>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {[
                  { key: 'ALL', label: 'All Photos' },
                  { key: 'PENDING', label: `Pending Review (${communityPhotos.filter(p => p.status === 'PENDING').length})` },
                  { key: 'APPROVED', label: `Approved (${communityPhotos.filter(p => p.status === 'APPROVED').length})` },
                  { key: 'REJECTED', label: `Rejected (${communityPhotos.filter(p => p.status === 'REJECTED').length})` }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setPhotoFilterStatus(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors touch-manipulation ${
                      photoFilterStatus === f.key
                        ? 'bg-jubilee-gold text-emerald-950 font-bold shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search uploader, set, caption..."
                  value={photoSearchQuery}
                  onChange={(e) => setPhotoSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-500 focus:border-jubilee-gold outline-none"
                />
              </div>
            </div>

            {/* Photo Cards Grid */}
            {(() => {
              const filtered = communityPhotos.filter(photo => {
                const matchesStatus = photoFilterStatus === 'ALL' || photo.status === photoFilterStatus;
                const q = photoSearchQuery.toLowerCase().trim();
                const matchesSearch = !q ||
                  (photo.contributor_name && photo.contributor_name.toLowerCase().includes(q)) ||
                  (photo.caption && photo.caption.toLowerCase().includes(q)) ||
                  (photo.alumni_set && photo.alumni_set.toLowerCase().includes(q)) ||
                  (photo.era && photo.era.toLowerCase().includes(q));
                return matchesStatus && matchesSearch;
              });

              if (filtered.length === 0) {
                return (
                  <div className="luxury-glass rounded-2xl p-12 text-center text-stone-400 space-y-2 border border-white/10">
                    <ImageIcon className="w-10 h-10 text-stone-600 mx-auto" />
                    <p className="text-sm font-medium">No community photos match the selected criteria.</p>
                    <p className="text-xs text-stone-500">Alumni uploads through the Media Section will enter this staging queue for administrative screening.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((photo, idx) => {
                    const isPending = photo.status === 'PENDING';
                    const isApproved = photo.status === 'APPROVED';
                    const isRejected = photo.status === 'REJECTED';

                    return (
                      <div key={idx} className="luxury-glass rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Top Row: Uploader Info & Status */}
                          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
                            <div>
                              <div className="font-bold text-white text-sm">{photo.contributor_name}</div>
                              <div className="text-[11px] text-jubilee-lightgold font-medium">
                                {photo.alumni_set}
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                              isApproved 
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
                                : isRejected
                                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                                : 'bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse'
                            }`}>
                              {photo.status || 'PENDING'}
                            </span>
                          </div>

                          {/* Image Thumbnail with zoom trigger */}
                          <div 
                            onClick={() => setSelectedPhotoPreview(photo)}
                            className="rounded-xl overflow-hidden bg-black/60 aspect-video relative border border-white/10 cursor-pointer group mb-2.5"
                          >
                            <img
                              src={photo.image_url}
                              alt={photo.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-2.5 py-1 rounded-full bg-black/75 text-jubilee-lightgold text-[10px] font-bold flex items-center space-x-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect Full Resolution</span>
                              </span>
                            </div>
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-[9px] font-mono text-jubilee-lightgold border border-white/10">
                              {photo.era || 'Heritage'}
                            </span>
                          </div>

                          {/* Caption & Metadata */}
                          <p className="text-xs font-serif italic text-stone-200 line-clamp-2">
                            "{photo.caption}"
                          </p>

                          <div className="mt-2 text-[11px] text-stone-400 space-y-0.5">
                            {photo.phone && (
                              <div>
                                WhatsApp: <a href={`https://wa.me/${photo.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">{photo.phone}</a>
                              </div>
                            )}
                            <div className="font-mono text-[10px] text-stone-500">
                              Ref: {photo.submission_id} • {photo.submitted_at ? new Date(photo.submitted_at).toLocaleDateString('en-GB') : ''}
                            </div>
                          </div>
                        </div>

                        {/* Moderation Actions */}
                        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-1.5">
                            {photo.status !== 'APPROVED' && (
                              <button
                                type="button"
                                onClick={() => updatePhotoStatus(photo, 'APPROVED')}
                                disabled={updatingId === (photo.submission_id || photo.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1 shadow-sm touch-manipulation active:scale-95"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Approve &amp; Publish</span>
                              </button>
                            )}

                            {photo.status !== 'REJECTED' && (
                              <button
                                type="button"
                                onClick={() => updatePhotoStatus(photo, 'REJECTED')}
                                disabled={updatingId === (photo.submission_id || photo.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium transition-colors disabled:opacity-50 touch-manipulation active:scale-95"
                              >
                                <span>Reject</span>
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteCommunityPhoto(photo)}
                            disabled={updatingId === (photo.submission_id || photo.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors disabled:opacity-50 touch-manipulation active:scale-95"
                            title="Delete Submission Permanently"
                          >
                            <Trash2 className="w-4 h-4 pointer-events-none" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

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
                  type="button"
                  onClick={() => deleteAttendee(selectedAttendee)}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors touch-manipulation active:scale-95"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4 pointer-events-none" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAttendee(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 text-stone-300 hover:text-white text-xs font-medium text-center touch-manipulation"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3B. COMPENDIUM AD BOOKING DETAIL & ARTWORK REVIEW MODAL */}
      {selectedAdBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedAdBooking(null)}
        >
          <div 
            className="bg-[#0b1f14] border border-jubilee-gold/40 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <BookOpen className="w-3 h-3 text-jubilee-gold" />
                  <span>Compendium Ad Dossier</span>
                </div>
                <h3 className="text-lg sm:text-xl font-retro font-bold text-white">
                  {selectedAdBooking.advertiser_name || selectedAdBooking.donor_name || 'Advertiser'}
                </h3>
                {selectedAdBooking.company_name && (
                  <p className="text-xs text-jubilee-lightgold font-medium mt-0.5 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedAdBooking.company_name}</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedAdBooking(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 pointer-events-none" />
              </button>
            </div>

            {/* Headline Banner */}
            {selectedAdBooking.brand_headline && (
              <div className="p-3.5 rounded-2xl bg-jubilee-gold/10 border border-jubilee-gold/30">
                <span className="text-[10px] text-jubilee-lightgold font-bold uppercase tracking-wider block">
                  Advert Headline / Tribute Banner
                </span>
                <p className="text-sm font-serif font-bold text-white mt-1 italic">
                  "{selectedAdBooking.brand_headline}"
                </p>
              </div>
            )}

            {/* Slot Specs & Rate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-stone-400 text-[10px] uppercase font-semibold">Placement Slot</div>
                <div className="font-bold text-white text-sm">
                  {selectedAdBooking.ad_tier_name || selectedAdBooking.tier_name || 'Ad Slot'}
                </div>
                <div className="text-[11px] font-mono text-jubilee-lightgold">
                  {selectedAdBooking.ad_dimensions || COMPENDIUM_AD_TIERS[selectedAdBooking.ad_tier_key]?.dimensions || 'A4 Portrait'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-stone-400 text-[10px] uppercase font-semibold">Payment Status &amp; Rate</div>
                <div className="text-base font-bold text-jubilee-gold font-mono">
                  ₦{Number(selectedAdBooking.amount || 0).toLocaleString()}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    selectedAdBooking.payment_status === 'VERIFIED'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                      : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                  }`}>
                    {selectedAdBooking.payment_status || 'VERIFIED'}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Ref: {selectedAdBooking.booking_reference || selectedAdBooking.reference}
                  </span>
                </div>
              </div>
            </div>

            {/* Artwork Production Preview */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-jubilee-gold" />
                  <span>Artwork Asset &amp; Production Mode</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300">
                  {selectedAdBooking.artwork_option === 'SECRETARIAT_DESIGN' ? 'Secretariat Design Support' : 'Ready Artwork Provided'}
                </span>
              </div>

              {selectedAdBooking.artwork_url ? (
                <div className="space-y-3">
                  <div className="max-h-64 overflow-hidden rounded-xl border border-white/10 bg-black/40 flex items-center justify-center p-2">
                    <img 
                      src={selectedAdBooking.artwork_url} 
                      alt="Compendium Artwork" 
                      className="max-h-60 max-w-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-mono text-[11px] truncate max-w-[250px]">
                      {selectedAdBooking.artwork_file_name || 'compendium_artwork.png'}
                    </span>
                    <a
                      href={selectedAdBooking.artwork_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="px-3 py-1.5 rounded-xl bg-jubilee-gold text-emerald-950 font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5 pointer-events-none" />
                      <span>Download High-Res</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-700/30 text-xs text-amber-200/90 leading-relaxed">
                  <strong>Secretariat Design Request:</strong> The advertiser requested the anniversary editorial team to design their commemorative page layout using their provided brand headline and copy instructions below.
                </div>
              )}
            </div>

            {/* Copy / Message Note */}
            {selectedAdBooking.message_note && (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                <span className="text-stone-400 uppercase font-semibold text-[10px]">Advertiser Copy / Instructions</span>
                <p className="text-stone-200 leading-relaxed whitespace-pre-wrap">{selectedAdBooking.message_note}</p>
              </div>
            )}

            {/* Editorial Assignment Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs">
              <div>
                <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                  Assigned Magazine Page
                </label>
                <input
                  type="text"
                  defaultValue={selectedAdBooking.assigned_page_number || ''}
                  placeholder="e.g. Page 24, Inside Cover"
                  onBlur={(e) => updateAdAssignedPage(selectedAdBooking, e.target.value.trim())}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-jubilee-gold"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                  Production Editorial Status
                </label>
                <select
                  value={selectedAdBooking.editorial_status || 'RECEIVED'}
                  onChange={(e) => updateAdEditorialStatus(selectedAdBooking, e.target.value)}
                  aria-label="Editorial Status Selection"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-jubilee-gold cursor-pointer"
                >
                  {AD_EDITORIAL_STATUSES.map(st => (
                    <option key={st.key} value={st.key} className="bg-[#051A0F] text-white">
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Advertiser Bar */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3.5 border-t border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                {selectedAdBooking.phone && (
                  <a
                    href={`https://wa.me/${selectedAdBooking.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/40 font-semibold flex items-center justify-center space-x-1.5 transition-colors touch-manipulation active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 pointer-events-none" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {selectedAdBooking.email && (
                  <a
                    href={`mailto:${selectedAdBooking.email}?subject=ASF RSU 45th Anniversary Compendium Ad Proof`}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 font-semibold flex items-center justify-center space-x-1.5 transition-colors touch-manipulation active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5 pointer-events-none" />
                    <span>Email Proof</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const current = selectedAdBooking;
                    setSelectedAdBooking(null);
                    deleteAdBooking(current);
                  }}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors touch-manipulation active:scale-95 shrink-0"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4 pointer-events-none" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAdBooking(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 text-stone-300 hover:text-white font-medium text-center transition-colors touch-manipulation"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. IN-APP CONFIRMATION MODAL (Non-blocking, Ultra-fast INP < 15ms) */}
      {confirmModal.isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={closeConfirmModal}
        >
          <div 
            className="bg-[#0b1f14] border border-rose-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-600/40 flex items-center justify-center shrink-0 text-rose-400 shadow-md">
                <AlertTriangle className="w-5 h-5 pointer-events-none" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">{confirmModal.title}</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>

            {confirmModal.details && Array.isArray(confirmModal.details) && (
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                {confirmModal.details.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">{item.label}:</span>
                    <span className="font-semibold text-stone-200 font-mono text-right max-w-[200px] truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={closeConfirmModal}
                disabled={confirmModal.isLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirmModal.onConfirm) {
                    setConfirmModal(prev => ({ ...prev, isLoading: true }));
                    try {
                      await confirmModal.onConfirm();
                    } finally {
                      closeConfirmModal();
                    }
                  }
                }}
                disabled={confirmModal.isLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-95 transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                {confirmModal.isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 pointer-events-none shrink-0" />
                    <span>{confirmModal.confirmText}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4B. COMMUNITY PHOTO PREVIEW MODAL */}
      {selectedPhotoPreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div 
            className="bg-[#051A0F] border border-jubilee-gold/40 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-white space-y-4 max-h-[92vh] overflow-y-auto my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-jubilee-gold uppercase tracking-wider block">
                  {selectedPhotoPreview.era}
                </span>
                <h4 className="text-base font-retro font-bold text-white mt-0.5">
                  Uploaded by {selectedPhotoPreview.contributor_name} ({selectedPhotoPreview.alumni_set})
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhotoPreview(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-square sm:aspect-video flex items-center justify-center max-h-[55vh]">
              <img
                src={selectedPhotoPreview.image_url}
                alt={selectedPhotoPreview.caption}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-jubilee-lightgold block">Caption / Story:</span>
              <p className="text-xs font-serif text-stone-200 italic leading-relaxed">
                "{selectedPhotoPreview.caption}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono text-stone-400">
                Status: <strong className={selectedPhotoPreview.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}>{selectedPhotoPreview.status}</strong>
              </span>
              <div className="flex items-center space-x-2">
                {selectedPhotoPreview.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => {
                      updatePhotoStatus(selectedPhotoPreview, 'APPROVED');
                      setSelectedPhotoPreview(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold"
                  >
                    Approve &amp; Publish Live
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPhotoPreview(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-stone-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. IN-APP TOAST NOTIFICATION (Non-blocking, Replaces alert) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[110] max-w-sm w-full animate-fade-in pointer-events-auto">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between space-x-3 backdrop-blur-xl ${
            toast.type === 'error' 
              ? 'bg-rose-950/95 border-rose-500/60 text-rose-200 shadow-rose-950/50' 
              : toast.type === 'info'
              ? 'bg-amber-950/95 border-amber-500/60 text-amber-200 shadow-amber-950/50'
              : 'bg-[#082817]/95 border-emerald-500/60 text-emerald-100 shadow-emerald-950/50'
          }`}>
            <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-medium">
              {toast.type === 'error' ? (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 pointer-events-none" />
              ) : toast.type === 'info' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 pointer-events-none" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 pointer-events-none" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5 pointer-events-none" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
