import React, { useState } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, ShieldCheck, CreditCard, Building2, 
  Copy, Check, Sparkles, HeartHandshake, Download, Printer, ExternalLink,
  Info, MessageSquare, ChevronRight, Share2, Mail, BookOpen, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { TIER_DETAILS } from '../lib/emailTemplates';
import { sendSponsorAcknowledgmentEmail } from '../lib/emailService';

export default function CompendiumAdsPortal({ onBackToSite, onOpenDonate }) {
  const [selectedTier, setSelectedTier] = useState('ad_back_cover');
  const [customAmount, setCustomAmount] = useState('500000');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Check whether live/valid Paystack key is configured
  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  const isPaystackConfigured =
    Boolean(paystackKey) &&
    (paystackKey.startsWith('pk_live_') || paystackKey.startsWith('pk_test_')) &&
    paystackKey.length >= 30 &&
    !paystackKey.includes('sample_key') &&
    !paystackKey.includes('ready_for_live') &&
    !paystackKey.includes('placeholder');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    phone: '',
    alumniSet: '',
    isAnonymous: false,
    messageNote: '',
    paymentMethod: isPaystackConfigured ? 'PAYSTACK' : 'TRANSFER'
  });

  const [formError, setFormError] = useState('');

  // Handle slot selection
  const handleSelectSlot = (slotKey, minAmount) => {
    setSelectedTier(slotKey);
    setCustomAmount(minAmount.toString());
    const formElement = document.getElementById('ads-checkout-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0570076237');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  // Paystack Integration Runner (Only runs if genuine live key is present; NEVER simulates)
  const handlePaystackPayment = () => {
    const cleanStr = String(customAmount).replace(/[^0-9.]/g, '');
    const numAmount = Math.round(parseFloat(cleanStr) || 0);

    if (isNaN(numAmount) || numAmount < 100) {
      setFormError('Please enter a valid amount (minimum ₦100).');
      return;
    }

    if (!formData.fullName || !formData.email) {
      setFormError('Please provide your Full Name and Email Address.');
      return;
    }

    if (!isPaystackConfigured) {
      setIsProcessing(false);
      setFormError(
        "Paystack Online Payment gateway is currently awaiting live API key activation by the Alumni Secretariat. No deduction was made. Please select 'Direct Bank Transfer' below to transfer directly to the official Ecobank account (0570076237), or contact the Secretariat."
      );
      return;
    }

    setIsProcessing(true);
    setFormError('');

    const reference = `ASF45TH-AD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const executePaystack = () => {
      try {
        if (typeof window.PaystackPop === 'undefined') {
          throw new Error('Paystack inline SDK not loaded.');
        }

        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: formData.email.trim(),
          amount: Math.round(numAmount * 100), // integer in kobo
          currency: 'NGN',
          ref: reference,
          metadata: {
            custom_fields: [
              { display_name: "Customer Name", variable_name: "customer_name", value: formData.fullName },
              { display_name: "Email Address", variable_name: "email", value: formData.email.trim() },
              { display_name: "Phone Number", variable_name: "phone", value: formData.phone },
              { display_name: "Selected Category", variable_name: "selected_category", value: TIER_DETAILS[selectedTier]?.name || selectedTier },
              { display_name: "Engagement Type", variable_name: "engagement_type", value: 'Compendium Ad Booking' },
              { display_name: "Company / Alumni Set", variable_name: "organization", value: formData.organization || formData.alumniSet || "Individual Contributor" },
              { display_name: "Amount (₦)", variable_name: "amount_naira", value: numAmount }
            ]
          },
          callback: function (response) {
            if (response && (response.status === 'success' || response.reference || response.trxref)) {
              handleSuccessfulPayment(
                response.reference || response.trxref || reference,
                numAmount,
                'Paystack Online Gateway',
                'VERIFIED'
              );
            } else {
              setIsProcessing(false);
              setFormError('Payment was not completed or could not be verified by Paystack.');
            }
          },
          onClose: function () {
            setIsProcessing(false);
            setFormError('Payment was cancelled or closed before completion. No deduction was made.');
          }
        });
        handler.openIframe();
      } catch (err) {
        console.error('Paystack initialization error:', err);
        setIsProcessing(false);
        setFormError('Could not initialize Paystack: ' + (err.message || 'Please use Direct Bank Transfer.'));
      }
    };

    if (typeof window.PaystackPop === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = executePaystack;
      script.onerror = () => {
        setIsProcessing(false);
        setFormError('Failed to load Paystack payment gateway. Please check your internet connection or use Direct Bank Transfer.');
      };
      document.body.appendChild(script);
    } else {
      executePaystack();
    }
  };

  const handleBankTransferNotice = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanStr = String(customAmount).replace(/[^0-9.]/g, '');
    const numAmount = Math.round(parseFloat(cleanStr) || 0);
    if (isNaN(numAmount) || numAmount < 100) {
      setFormError('Please enter a valid amount (minimum ₦100).');
      return;
    }
    if (!formData.fullName || !formData.email) {
      setFormError('Please provide your Full Name and Email Address.');
      return;
    }

    setIsProcessing(true);
    setFormError('');
    const reference = `ECO-AD-TRF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    handleSuccessfulPayment(reference, numAmount, 'Direct Bank Transfer (Ecobank)', 'PENDING_BANK_RECONCILIATION');
  };

  const handleSuccessfulPayment = async (reference, amount, paymentMethod, status = 'VERIFIED') => {
    setIsProcessing(false);
    
    const paymentRecord = {
      reference,
      amount,
      currency: 'NGN',
      tier_key: selectedTier,
      tier_name: TIER_DETAILS[selectedTier]?.name || selectedTier,
      donor_name: formData.fullName.trim(),
      organization: formData.organization.trim() || null,
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      alumni_set: formData.alumniSet.trim() || null,
      is_anonymous: Boolean(formData.isAnonymous),
      message_note: formData.messageNote.trim() || null,
      payment_method: paymentMethod,
      status: status,
      created_at: new Date().toISOString()
    };

    // 1. Supabase write
    try {
      const { error } = await supabase
        .from('sponsorship_payments')
        .insert([paymentRecord]);
      if (error) console.info('Supabase ad booking write note:', error.message);
    } catch (dbErr) {
      console.warn('Supabase write error:', dbErr);
    }

    // 2. Offline LocalStorage Backup
    try {
      const existing = JSON.parse(localStorage.getItem('asf_sponsorship_payments') || '[]');
      existing.unshift(paymentRecord);
      localStorage.setItem('asf_sponsorship_payments', JSON.stringify(existing));
    } catch (lsErr) {
      console.warn('LocalStorage write error:', lsErr);
    }

    // 3. Email acknowledgment dispatch
    let emailResult = { success: false, status: 'QUEUED' };
    try {
      emailResult = await sendSponsorAcknowledgmentEmail({
        donorName: formData.fullName.trim(),
        email: formData.email.trim(),
        tierKey: selectedTier,
        amount,
        reference,
        paymentMethod,
        organization: formData.organization.trim(),
        phone: formData.phone.trim()
      });
    } catch (emailErr) {
      console.warn('Direct email dispatch notice:', emailErr);
    }

    setReceiptData({
      ...paymentRecord,
      email_dispatched: emailResult?.success || false,
      email_status: emailResult?.status || 'QUEUED',
      email_reason: emailResult?.reason || '',
      mailto_link: emailResult?.mailtoLink || ''
    });

    if (status === 'VERIFIED') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141E18] font-sans antialiased selection:bg-emerald-900 selection:text-amber-200">
      
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-[#051A0F]/95 backdrop-blur-md border-b border-jubilee-gold/30 text-white py-2.5 sm:py-4 px-3 sm:px-6 shadow-luxury">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-jubilee-lightgold text-xs font-semibold transition-all shrink-0 touch-manipulation active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Back to Jubilee Portal</span>
              <span className="xs:hidden">Back</span>
            </button>
            <span className="hidden md:inline-block text-xs text-stone-400">|</span>
            <span className="hidden md:inline-block text-xs font-retro text-stone-300 truncate">
              ASF RSU 45th Anniversary &amp; Alumni Homecoming (1981–2026)
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onOpenDonate && (
              <button
                onClick={onOpenDonate}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold text-jubilee-lightgold border border-jubilee-gold/40 hover:bg-white/10 transition-all touch-manipulation active:scale-95"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Donate / Support Tiers &rarr;</span>
              </button>
            )}
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-jubilee-lightgold px-2.5 sm:px-3 py-1 rounded-full bg-jubilee-gold/10 border border-jubilee-gold/30">
              Audited CPC Account
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051A0F] via-[#082817] to-[#0D3821] text-white pt-10 sm:pt-14 pb-14 sm:pb-20 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/[0.07] border border-jubilee-gold/40 text-jubilee-lightgold text-[10px] sm:text-xs font-bold uppercase tracking-widest max-w-full">
            <BookOpen className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
            <span className="truncate">Official Archival Compendium (1981–2026)</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-retro font-extrabold text-white tracking-tight leading-tight">
            BOOK COMPENDIUM ADVERTS <br />
            <span className="bg-gradient-to-r from-jubilee-gold via-amber-200 to-yellow-400 bg-clip-text text-transparent">
              ASF RSU 45TH JUBILEE
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xs sm:text-base text-emerald-100/90 font-light leading-relaxed px-2">
            Position your corporate brand, professional services, alumni set milestones, or special 45th Jubilee congratulatory tributes before thousands of alumni, captains of industry, and dignitaries.
          </p>

          {/* Quick Bank Banner */}
          <div className="pt-2 sm:pt-4 max-w-2xl mx-auto w-full">
            <div className="luxury-glass p-4 rounded-2xl border border-jubilee-gold/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-jubilee-lightgold font-bold flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                  <span>Direct Bank Deposit / Transfer Details</span>
                </div>
                <div className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
                  ECOBANK • <span className="text-jubilee-gold">0570076237</span>
                </div>
                <div className="text-xs text-stone-300">
                  Account Name: <strong>NAAS RSU ALUMNI PROJECT</strong>
                </div>
              </div>

              <button
                onClick={handleCopyAccount}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-jubilee-gold hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all shrink-0 active:scale-95 touch-manipulation"
              >
                {copiedAccount ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copiedAccount ? 'Copied 0570076237!' : 'Copy Account No.'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-retro font-bold text-emerald-950">
              Archival Compendium Advertising Rates &amp; Formats
            </h2>
            <p className="text-sm text-stone-600">
              A commemorative high-gloss, archival publication distributed physically at plenary events and circulated digitally to thousands of alumni globally.
            </p>
          </div>

          {/* 6 Ad Sizes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* 1. Outer Back Cover */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'ad_back_cover'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-amber-400 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3.5 sm:px-4 py-1 bg-gradient-to-r from-jubilee-gold to-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-sm">
                Highest Visibility
              </div>

              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-jubilee-gold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-jubilee-gold" />
                  <span>External Prime Real Estate</span>
                </div>

                <h3 className={`text-xl font-retro font-extrabold mb-1 ${selectedTier === 'ad_back_cover' ? 'text-white' : 'text-emerald-950'}`}>
                  Outer Back Cover
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-amber-500 mb-3">
                  ₦500,000
                </div>

                <p className={`text-xs leading-relaxed mb-4 ${selectedTier === 'ad_back_cover' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Maximum visibility on the outer back cover; prime real estate for leading corporate partners or major alumni sets.
                </p>

                <div className={`text-[11px] space-y-1 font-mono mb-6 border-t pt-3 ${selectedTier === 'ad_back_cover' ? 'border-white/10 text-emerald-200/80' : 'border-stone-200 text-stone-500'}`}>
                  <div>• Placement: Outer Back Cover (Full Page)</div>
                  <div>• Format: 210mm × 297mm (+3mm bleed)</div>
                  <div>• Resolution: 300 DPI CMYK High-Res</div>
                </div>
              </div>

              <button
                onClick={() => handleSelectSlot('ad_back_cover', 500000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'ad_back_cover'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦500,000
              </button>
            </div>

            {/* 2. Inside Front Cover */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'ad_inside_front'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-sky-500/50 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3 py-1 bg-sky-100 text-sky-900 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                High Impact
              </div>
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>Premier Interior</span>
                </div>
                <h3 className={`text-xl font-retro font-extrabold mb-1 ${selectedTier === 'ad_inside_front' ? 'text-white' : 'text-emerald-950'}`}>
                  Inside Front Cover
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-sky-700 mb-3">
                  ₦350,000
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${selectedTier === 'ad_inside_front' ? 'text-stone-300' : 'text-stone-600'}`}>
                  High-impact initial placement immediately inside the front cover for top-tier sponsors and businesses.
                </p>
                <div className={`text-[11px] space-y-1 font-mono mb-6 border-t pt-3 ${selectedTier === 'ad_inside_front' ? 'border-white/10 text-emerald-200/80' : 'border-stone-200 text-stone-500'}`}>
                  <div>• Placement: Immediate Inside Front Cover</div>
                  <div>• Format: 210mm × 297mm (+3mm bleed)</div>
                  <div>• Resolution: 300 DPI CMYK High-Res</div>
                </div>
              </div>
              <button
                onClick={() => handleSelectSlot('ad_inside_front', 350000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'ad_inside_front'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦350,000
              </button>
            </div>

            {/* 3. Inside Back Cover */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'ad_inside_back'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-purple-500/50 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3 py-1 bg-purple-100 text-purple-900 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Strategic Placement
              </div>
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Closing Prime Space</span>
                </div>
                <h3 className={`text-xl font-retro font-extrabold mb-1 ${selectedTier === 'ad_inside_back' ? 'text-white' : 'text-emerald-950'}`}>
                  Inside Back Cover
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-purple-700 mb-3">
                  ₦300,000
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${selectedTier === 'ad_inside_back' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Premium interior placement facing the final pages; excellent visibility for established brands and set tributes.
                </p>
                <div className={`text-[11px] space-y-1 font-mono mb-6 border-t pt-3 ${selectedTier === 'ad_inside_back' ? 'border-white/10 text-emerald-200/80' : 'border-stone-200 text-stone-500'}`}>
                  <div>• Placement: Facing Final Commemorative Pages</div>
                  <div>• Format: 210mm × 297mm (+3mm bleed)</div>
                  <div>• Resolution: 300 DPI Archival Resolution</div>
                </div>
              </div>
              <button
                onClick={() => handleSelectSlot('ad_inside_back', 300000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'ad_inside_back'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦300,000
              </button>
            </div>

            {/* 4. Full Page */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'ad_full'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-blue-500/50 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3 py-1 bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Full Page Layout
              </div>
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Editorial &amp; Tribute</span>
                </div>
                <h3 className={`text-xl font-retro font-extrabold mb-1 ${selectedTier === 'ad_full' ? 'text-white' : 'text-emerald-950'}`}>
                  Full Page Advert
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-blue-700 mb-3">
                  ₦150,000
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${selectedTier === 'ad_full' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Full-page colorful editorial layout, business feature, or commemorative set tribute.
                </p>
                <div className={`text-[11px] space-y-1 font-mono mb-6 border-t pt-3 ${selectedTier === 'ad_full' ? 'border-white/10 text-emerald-200/80' : 'border-stone-200 text-stone-500'}`}>
                  <div>• Format: 210mm × 297mm (+3mm bleed)</div>
                  <div>• 300 DPI CMYK Print &amp; Digital PDF Link</div>
                  <div>• High-resolution editorial showcase</div>
                </div>
              </div>
              <button
                onClick={() => handleSelectSlot('ad_full', 150000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'ad_full'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦150,000
              </button>
            </div>

            {/* 5. Half Page */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'ad_half'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-indigo-500/50 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-100 text-indigo-900 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Popular Choice
              </div>
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Standard Display</span>
                </div>
                <h3 className={`text-xl font-retro font-extrabold mb-1 ${selectedTier === 'ad_half' ? 'text-white' : 'text-emerald-950'}`}>
                  Half Page Advert
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-indigo-700 mb-3">
                  ₦75,000
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${selectedTier === 'ad_half' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Standard half-page display ad for medium-scale businesses, professional services, or group shout-outs.
                </p>
                <div className={`text-[11px] space-y-1 font-mono mb-6 border-t pt-3 ${selectedTier === 'ad_half' ? 'border-white/10 text-emerald-200/80' : 'border-stone-200 text-stone-500'}`}>
                  <div>• Format: 210mm × 148mm (+3mm bleed)</div>
                  <div>• 300 DPI CMYK High-Res Layout</div>
                  <div>• Ideal for family &amp; business features</div>
                </div>
              </div>
              <button
                onClick={() => handleSelectSlot('ad_half', 75000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'ad_half'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦75,000
              </button>
            </div>

            {/* 6. Quarter Page */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'ad_quarter'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-500/50 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Entry Slot
              </div>
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Business Card / Note</span>
                </div>
                <h3 className={`text-xl font-retro font-extrabold mb-1 ${selectedTier === 'ad_quarter' ? 'text-white' : 'text-emerald-950'}`}>
                  Quarter Page Advert
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-emerald-700 mb-3">
                  ₦40,000
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${selectedTier === 'ad_quarter' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Compact quarter-page layout suitable for individual business card listings and personal congratulatory notes.
                </p>
                <div className={`text-[11px] space-y-1 font-mono mb-6 border-t pt-3 ${selectedTier === 'ad_quarter' ? 'border-white/10 text-emerald-200/80' : 'border-stone-200 text-stone-500'}`}>
                  <div>• Format: 105mm × 148mm</div>
                  <div>• 300 DPI CMYK High-Res Layout</div>
                  <div>• Compact personal congratulatory slot</div>
                </div>
              </div>
              <button
                onClick={() => handleSelectSlot('ad_quarter', 40000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'ad_quarter'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦40,000
              </button>
            </div>

          </div>

          {/* Ad Submission Guidelines & Specifications Callout Box */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#051A0F] to-[#0A331D] text-white border-2 border-jubilee-gold/50 shadow-luxury">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-jubilee-lightgold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-jubilee-gold/30">
                  <Sparkles className="w-3.5 h-3.5 text-jubilee-gold" />
                  <span>Artwork Submission &amp; Technical Requirements</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-retro font-bold text-white">
                  Got print-ready artwork or need our editorial design team to assist?
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  After booking your ad slot below, submit your high-resolution artwork (PDF/TIFF 300 DPI CMYK) or text tributes along with your payment confirmation reference directly to the editorial secretariat.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/20 text-xs space-y-2 shrink-0 w-full lg:w-auto">
                <div className="font-bold text-jubilee-lightgold uppercase text-[11px] tracking-wider">
                  Editorial Secretariat Dispatch:
                </div>
                <div>
                  <a
                    href="mailto:ekporjephta@gmail.com"
                    className="inline-flex items-center space-x-1.5 text-jubilee-lightgold hover:text-white font-mono underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ekporjephta@gmail.com</span>
                  </a>
                  <div className="text-[11px] text-stone-300 pt-1">
                    CC: <a href="mailto:Asfrsu@gmail.com" className="underline hover:text-white font-mono">Asfrsu@gmail.com</a>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-200/80 pt-1">
                  Central Planning Committee (CPC) Editorial Directorate
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Link Banner to Support/Donate */}
          {onOpenDonate && (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-left">
                <HeartHandshake className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Looking to Donate or Sponsor 45th Jubilee Programs?</h4>
                  <p className="text-xs text-stone-600">Support undergraduate student welfare, Mass Choir cantatas, and the 45-year legacy endowment across 5 tiers.</p>
                </div>
              </div>
              <button
                onClick={onOpenDonate}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 transition-all touch-manipulation active:scale-95"
              >
                <span>View Donate / Support Tiers</span>
                <ChevronRight className="w-4 h-4 text-jubilee-gold" />
              </button>
            </div>
          )}

        </div>

        {/* CHECKOUT & PAYMENT INTEGRATION FORM */}
        <section id="ads-checkout-form" className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-stone-200 shadow-luxury">
            
            <div className="border-b border-stone-100 pb-5 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Step 1 &amp; 2: Compendium Ad Space Selected
                  </span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Step 3: Advertiser &amp; Artwork Details
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-retro font-bold text-emerald-950 mt-1">
                  Complete Your Ad Booking &amp; Details
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Selected Category: <strong className="text-emerald-900 font-semibold">{TIER_DETAILS[selectedTier]?.name || selectedTier}</strong>
                  <span className="mx-2 text-stone-300">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = document.querySelector('main');
                      if (tabs) tabs.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-amber-700 hover:text-amber-900 underline font-semibold"
                  >
                    Change selection
                  </button>
                </p>
              </div>

              <div className="text-left sm:text-right p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 sm:bg-transparent sm:border-none sm:p-0">
                <span className="text-[11px] text-stone-400 block font-sans">Payable Ad Rate</span>
                <span className="text-2xl font-retro font-black text-amber-600">
                  ₦{Number(customAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs mb-6 flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Advertiser Fields Form */}
            <form onSubmit={(e) => { e.preventDefault(); formData.paymentMethod === 'PAYSTACK' ? handlePaystackPayment() : handleBankTransferNotice(e); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 text-xs font-sans">
                
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Name (Contact Person / Advertiser) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Christian Amadi"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Corporate Brand / Organization Name (If Applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Global Energy Ltd / 1994 Alumni Set"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Official Email Address (For Receipt &amp; Artwork Proofs) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    WhatsApp / Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234..."
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Alumni Graduation Set / Chapter Affiliation <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1998 Set / Rivers State Chapter / Corporate Partner (Optional)"
                    value={formData.alumniSet}
                    onChange={(e) => setFormData(prev => ({ ...prev, alumniSet: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-800 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Payable Ad Rate (₦ Nigerian Naira) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="any"
                    required
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-50/30 font-mono font-bold text-sm text-emerald-950 outline-none focus:border-emerald-800"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500 font-sans">
                    <span className="font-semibold text-emerald-900">
                      Amount: ₦{Number(customAmount || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-700">Minimum: ₦100</span>
                  </div>
                </div>

              </div>

              {/* Anonymous Checkbox */}
              <div className="mb-6 flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="ads-isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="rounded text-emerald-800 focus:ring-emerald-800 h-4 w-4"
                />
                <label htmlFor="ads-isAnonymous" className="text-xs text-stone-600 select-none cursor-pointer">
                  <span>Keep advertiser name anonymous on public directories &amp; websites.</span>
                </label>
              </div>

              {/* Message Note */}
              <div className="mb-8">
                <label className="block font-semibold text-stone-700 mb-1 text-xs">
                  Advert Description / Congratulatory Note / Artwork Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide text content for your advert, shout-out, or design guidance for the editorial team..."
                  value={formData.messageNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, messageNote: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:border-emerald-800 outline-none text-xs"
                />
              </div>

              {/* Payment Channel Selector */}
              <div className="border-t border-stone-200/60 pt-6 mb-6">
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">
                  Choose Preferred Payment Channel:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Paystack */}
                  <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.paymentMethod === 'PAYSTACK'
                      ? 'border-emerald-800 bg-emerald-50/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYSTACK"
                      checked={formData.paymentMethod === 'PAYSTACK'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'PAYSTACK' }))}
                      className="mt-1 text-emerald-800 focus:ring-emerald-800"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold text-xs text-stone-900">
                        <CreditCard className="w-4 h-4 text-emerald-800 shrink-0" />
                        <span>Pay Online via Paystack</span>
                        {!isPaystackConfigured && (
                          <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            Awaiting Live Key
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                        {isPaystackConfigured
                          ? 'Instant automated confirmation via Debit Card, Apple Pay, USSD, or Bank Transfer.'
                          : 'Gateway is currently awaiting Secretariat live key activation. Please use Direct Bank Transfer below.'}
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Direct Ecobank Bank Transfer */}
                  <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.paymentMethod === 'TRANSFER'
                      ? 'border-emerald-800 bg-emerald-50/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="TRANSFER"
                      checked={formData.paymentMethod === 'TRANSFER'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'TRANSFER' }))}
                      className="mt-1 text-emerald-800 focus:ring-emerald-800"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold text-xs text-stone-900">
                        <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Direct Bank Transfer (Ecobank Nigeria)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                        Pay straight into audited Ecobank <strong>0570076237</strong> and log your payment record.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:shadow-gold-glow active:scale-95 transition-all font-sans flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-950" />
                  <span>
                    {isProcessing 
                      ? 'Processing...' 
                      : `PAY ₦${Number(customAmount || 0).toLocaleString()}`
                    }
                  </span>
                </button>

                <p className="text-[11px] text-stone-400 text-center sm:text-right font-light flex items-center justify-center sm:justify-end space-x-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span>256-Bit SSL Encrypted • Central Planning Committee Audited</span>
                </p>
              </div>

            </form>
          </div>
        </section>

      </main>

      {/* SUCCESSFUL PAYMENT & ELECTRONIC RECEIPT / TRANSFER NOTICE MODAL */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-jubilee-gold/50 shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8">
            
            <div className="text-center space-y-2 mb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner ${
                receiptData.status === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {receiptData.status === 'VERIFIED' ? (
                  <Check className="w-8 h-8" />
                ) : (
                  <Building2 className="w-7 h-7 text-amber-700" />
                )}
              </div>

              <span className={`text-[11px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${
                receiptData.status === 'VERIFIED'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-amber-800 bg-amber-50 border-amber-300'
              }`}>
                {receiptData.status === 'VERIFIED'
                  ? 'Booking Cleared & Confirmed'
                  : 'Booking Notification Logged'}
              </span>

              <h3 className="text-2xl font-retro font-bold text-emerald-950">
                {receiptData.status === 'VERIFIED'
                  ? 'Compendium Ad Confirmed!'
                  : 'Ad Booking Notification Received!'}
              </h3>
              <p className="text-xs text-stone-600">
                {receiptData.status === 'VERIFIED'
                  ? 'Thank you for featuring in the 45th Anniversary Jubilee Historical Compendium. Your reservation has been confirmed.'
                  : 'Thank you! Your advert booking has been registered. Please complete your transfer to Ecobank account 0570076237.'}
              </p>
            </div>

            {/* If Direct Bank Transfer, show Ecobank card */}
            {receiptData.status !== 'VERIFIED' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-2 mb-6">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>Official Designated Bank Account:</span>
                  <button
                    onClick={handleCopyAccount}
                    className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-[10px] font-bold flex items-center space-x-1 transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedAccount ? 'Copied!' : 'Copy Account'}</span>
                  </button>
                </div>
                <div className="font-mono text-stone-800 space-y-1 text-xs">
                  <div>Bank: <strong className="text-emerald-950 font-bold">ECOBANK NIGERIA</strong></div>
                  <div>Account Name: <strong className="text-emerald-950 font-bold">NAAS RSU ALUMNI PROJECT</strong></div>
                  <div>Account Number: <strong className="text-emerald-950 font-bold text-sm tracking-wider">0570076237</strong></div>
                  <div>Transfer Remark / Ref: <strong className="text-amber-800 font-bold">{receiptData.reference}</strong></div>
                </div>
                <p className="text-[10px] text-stone-500 italic pt-1">
                  * Please quote your booking reference in your bank transfer narration/remark. The Secretariat will reconcile your payment against the Ecobank statement and confirm your placement.
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#F7F4EA] border border-stone-200 space-y-2.5 text-xs font-mono mb-6">
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Booking Ref:</span>
                <span className="font-bold text-emerald-950 truncate max-w-[200px]">{receiptData.reference}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Advertiser:</span>
                <span className="font-bold text-stone-800">{receiptData.donor_name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Ad Placement:</span>
                <span className="font-bold text-emerald-900">{receiptData.tier_name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Amount:</span>
                <span className="font-bold text-amber-600 text-sm">₦{Number(receiptData.amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Payment Channel:</span>
                <span className="font-bold text-stone-700">{receiptData.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Reconciliation Status:</span>
                <span className={`font-bold ${receiptData.status === 'VERIFIED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {receiptData.status === 'VERIFIED' ? 'Cleared & Verified' : 'Pending Bank Reconciliation'}
                </span>
              </div>
            </div>

            {/* Email Dispatch Status Feedback */}
            {receiptData.email_dispatched ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2 mb-6">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>An official acknowledgment and submission guide have been sent to <strong>{receiptData.email}</strong>.</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-stone-800 text-xs space-y-2 mb-6">
                <div className="flex items-start space-x-2 text-amber-900 font-semibold">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Automated Email Dispatch Notice</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Direct automated inbox delivery is awaiting Secretariat custom domain verification on Resend. You can immediately open or send the pre-composed confirmation letter in your email app:
                </p>
                {receiptData.mailto_link && (
                  <a
                    href={receiptData.mailto_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] active:scale-95 transition-all shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Pre-filled Acknowledgment in Mail App</span>
                  </a>
                )}
              </div>
            )}

            <div className="space-y-2.5">
              <button
                onClick={() => window.print()}
                className="w-full py-3 rounded-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official {receiptData.status === 'VERIFIED' ? 'Receipt' : 'Booking Voucher'}</span>
              </button>
              <button
                onClick={() => { setReceiptData(null); onBackToSite(); }}
                className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs active:scale-95 transition-all"
              >
                Return to Jubilee Home
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
