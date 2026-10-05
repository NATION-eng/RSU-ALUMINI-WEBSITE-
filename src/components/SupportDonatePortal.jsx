import React, { useState } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, ShieldCheck, CreditCard, Building2, 
  Copy, Check, Sparkles, HeartHandshake, Download, Printer, ExternalLink,
  Info, MessageSquare, ChevronRight, Share2, Mail, BookOpen, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { TIER_DETAILS, generateSponsorEmailHtml } from '../lib/emailTemplates';
import { sendSponsorAcknowledgmentEmail, getMailtoLink } from '../lib/emailService';

export default function SupportDonatePortal({ onBackToSite, onOpenAds }) {
  const [selectedTier, setSelectedTier] = useState('platinum');
  const [customAmount, setCustomAmount] = useState('2000000');
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

  // Handle tier selection
  const handleSelectTier = (tierKey, minAmount) => {
    setSelectedTier(tierKey);
    setCustomAmount(minAmount.toString());
    const formElement = document.getElementById('donate-checkout-form');
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
      setFormError('Please enter a valid contribution amount (minimum ₦100).');
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

    const reference = `ASF45TH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
              { display_name: "Engagement Type", variable_name: "engagement_type", value: 'Donate / Support' },
              { display_name: "Company / Alumni Set", variable_name: "organization", value: formData.organization || formData.alumniSet || "Individual Contributor" },
              { display_name: "Amount (₦)", variable_name: "amount_naira", value: numAmount }
            ]
          },
          callback: function (response) {
            // ONLY execute when real Paystack response confirms transaction
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
    const reference = `ECO-TRF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
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
      if (error) console.info('Supabase donation write note:', error.message);
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
            {onOpenAds && (
              <button
                onClick={onOpenAds}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold text-jubilee-lightgold border border-jubilee-gold/40 hover:bg-white/10 transition-all touch-manipulation active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-jubilee-gold" />
                <span>Compendium Ads &rarr;</span>
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
            <HeartHandshake className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
            <span className="truncate">45th Jubilee Support &amp; Giving Prospectus</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-retro font-extrabold text-white tracking-tight leading-tight">
            DONATE &amp; SUPPORT <br />
            <span className="bg-gradient-to-r from-jubilee-gold via-amber-200 to-yellow-400 bg-clip-text text-transparent">
              ASF RSU 45TH JUBILEE
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xs sm:text-base text-emerald-100/90 font-light leading-relaxed px-2">
            Empower the 45th Homecoming celebration, undergraduate student welfare, sacred Mass Choir cantatas, and the 45-year legacy endowment across 5 distinguished support tiers.
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
              Donate / Support Tiers &amp; Benefits
            </h2>
            <p className="text-sm text-stone-600">
              To empower the 45th Jubilee Homecoming and recognize every valued partner, visibility and ceremonial honors scale across five clear tiers.
            </p>
          </div>

          {/* 5 Distinct Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* 1. Platinum Sponsor */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              selectedTier === 'platinum'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-800/40 text-stone-900 shadow-md'
            }`}>
              <div className="absolute top-0 right-0 px-3.5 sm:px-4 py-1 bg-gradient-to-r from-jubilee-gold to-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-sm">
                Most Prestigious
              </div>

              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-jubilee-gold uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  <span>Premier Category</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-retro font-extrabold mb-1 ${selectedTier === 'platinum' ? 'text-white' : 'text-emerald-950'}`}>
                  Platinum Sponsor
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-amber-500 mb-4">
                  ₦2,000,000<span className="text-xs font-sans font-medium text-stone-400">+</span>
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${selectedTier === 'platinum' ? 'text-stone-300' : 'text-stone-600'}`}>
                  For headline institutional partners, corporate visionaries, and patron sets seeking maximum visibility across digital and physical venues.
                </p>

                <div className="border-t border-stone-200/40 pt-4 space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                    Entitled Benefits:
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {TIER_DETAILS.platinum.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className={selectedTier === 'platinum' ? 'text-emerald-100' : 'text-stone-700'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('platinum', 2000000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'platinum'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦2,000,000
              </button>
            </div>

            {/* 2. Gold Sponsor */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between ${
              selectedTier === 'gold'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-800/40 text-stone-900 shadow-md'
            }`}>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive Tier</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-retro font-extrabold mb-1 ${selectedTier === 'gold' ? 'text-white' : 'text-emerald-950'}`}>
                  Gold Sponsor
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-amber-500 mb-4">
                  ₦1,000,000<span className="text-xs font-sans font-medium text-stone-400">+</span>
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${selectedTier === 'gold' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Substantial executive visibility on official fellowship web pages, stage backdrops, and dedicated compendium color feature.
                </p>

                <div className="border-t border-stone-200/40 pt-4 space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                    Entitled Benefits:
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {TIER_DETAILS.gold.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className={selectedTier === 'gold' ? 'text-emerald-100' : 'text-stone-700'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('gold', 1000000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'gold'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦1,000,000
              </button>
            </div>

            {/* 3. Silver Sponsor */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between ${
              selectedTier === 'silver'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-800/40 text-stone-900 shadow-md'
            }`}>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Associate Tier</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-retro font-extrabold mb-1 ${selectedTier === 'silver' ? 'text-white' : 'text-emerald-950'}`}>
                  Silver Sponsor
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-amber-600 mb-4">
                  ₦500,000<span className="text-xs font-sans font-medium text-stone-400">+</span>
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${selectedTier === 'silver' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Ideal for alumni chapters, departmental sets, and thriving businesses seeking targeted exposure and ceremonial appreciation.
                </p>

                <div className="border-t border-stone-200/40 pt-4 space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                    Entitled Benefits:
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {TIER_DETAILS.silver.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className={selectedTier === 'silver' ? 'text-emerald-100' : 'text-stone-700'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('silver', 500000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'silver'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦500,000
              </button>
            </div>

            {/* 4. Bronze Sponsor */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between ${
              selectedTier === 'bronze'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-800/40 text-stone-900 shadow-md'
            }`}>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Affiliate Tier</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-retro font-extrabold mb-1 ${selectedTier === 'bronze' ? 'text-white' : 'text-emerald-950'}`}>
                  Bronze Sponsor
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-amber-700 mb-4">
                  ₦250,000<span className="text-xs font-sans font-medium text-stone-400">+</span>
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${selectedTier === 'bronze' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Commendable partnership featuring business card compendium placement and inclusion on the official digital directory.
                </p>

                <div className="border-t border-stone-200/40 pt-4 space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Entitled Benefits:
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {TIER_DETAILS.bronze.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className={selectedTier === 'bronze' ? 'text-emerald-100' : 'text-stone-700'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('bronze', 250000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'bronze'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦250,000
              </button>
            </div>

            {/* 5. Support Partner */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between ${
              selectedTier === 'support'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-800/40 text-stone-900 shadow-md'
            }`}>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Fellowship Supporter</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-retro font-extrabold mb-1 ${selectedTier === 'support' ? 'text-white' : 'text-emerald-950'}`}>
                  Support Partner
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-emerald-700 mb-4">
                  ₦100,000<span className="text-xs font-sans font-medium text-stone-400">+</span>
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${selectedTier === 'support' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Enables undergraduate students to participate and preserves your honored name on the "Friends of the Fellowship" roll.
                </p>

                <div className="border-t border-stone-200/40 pt-4 space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Entitled Benefits:
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {TIER_DETAILS.support.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className={selectedTier === 'support' ? 'text-emerald-100' : 'text-stone-700'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('support', 100000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'support'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY ₦100,000
              </button>
            </div>

            {/* 6. Custom Contribution / Endowment */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between ${
              selectedTier === 'custom'
                ? 'border-jubilee-gold bg-gradient-to-b from-[#062113] to-[#0A331D] text-white shadow-2xl scale-[1.02]'
                : 'border-stone-200 bg-white hover:border-emerald-800/40 text-stone-900 shadow-md'
            }`}>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Direct Impact</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-retro font-extrabold mb-1 ${selectedTier === 'custom' ? 'text-white' : 'text-emerald-950'}`}>
                  Custom Jubilee Pledge
                </h3>
                <div className="text-2xl sm:text-3xl font-retro font-black text-amber-500 mb-4">
                  Flexible<span className="text-xs font-sans font-medium text-stone-400"> (Any Amount)</span>
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${selectedTier === 'custom' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Specify any preferred amount towards the Undergraduate Endowment, Feeding Subsidies, or Sacred Mass Choir Cantata.
                </p>

                <div className="border-t border-stone-200/40 pt-4 space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                    Entitled Benefits:
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {TIER_DETAILS.custom.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className={selectedTier === 'custom' ? 'text-emerald-100' : 'text-stone-700'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('custom', 50000)}
                className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 touch-manipulation ${
                  selectedTier === 'custom'
                    ? 'bg-gradient-to-r from-jubilee-gold to-amber-300 text-emerald-950 shadow-luxury'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-white'
                }`}
              >
                PAY CUSTOM AMOUNT
              </button>
            </div>

          </div>

          {/* Cross-Link Banner to Compendium Ad Booking */}
          {onOpenAds && (
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-left">
                <BookOpen className="w-6 h-6 text-amber-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Looking to Book Compendium Advertising?</h4>
                  <p className="text-xs text-stone-600">Promote your business brand, professional practice, or alumni set tributes in the 45th Anniversary Jubilee Compendium.</p>
                </div>
              </div>
              <button
                onClick={onOpenAds}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 transition-all touch-manipulation active:scale-95"
              >
                <span>View Compendium Ad Rates</span>
                <ChevronRight className="w-4 h-4 text-jubilee-gold" />
              </button>
            </div>
          )}

        </div>

        {/* CHECKOUT & PAYMENT INTEGRATION FORM */}
        <section id="donate-checkout-form" className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-stone-200 shadow-luxury">
            
            <div className="border-b border-stone-100 pb-5 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Step 1 &amp; 2: Donate / Support Tier Selected
                  </span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Step 3: Registration &amp; Contact Info
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-retro font-bold text-emerald-950 mt-1">
                  Complete Your Support &amp; Pledge Details
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
                <span className="text-[11px] text-stone-400 block font-sans">Payable Contribution</span>
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

            {/* Donor Fields Form */}
            <form onSubmit={(e) => { e.preventDefault(); formData.paymentMethod === 'PAYSTACK' ? handlePaystackPayment() : handleBankTransferNotice(e); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 text-xs font-sans">
                
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Name (Contact Person / Donor) *
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
                    Official Email Address (For Receipt &amp; Acknowledgment) *
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
                    Contribution Amount (₦ Nigerian Naira) *
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
                  id="donate-isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="rounded text-emerald-800 focus:ring-emerald-800 h-4 w-4"
                />
                <label htmlFor="donate-isAnonymous" className="text-xs text-stone-600 select-none cursor-pointer">
                  <span>Keep my donation / sponsorship anonymous on public directories &amp; websites.</span>
                </label>
              </div>

              {/* Message Note */}
              <div className="mb-8">
                <label className="block font-semibold text-stone-700 mb-1 text-xs">
                  Message Note / Special Prayer Request / Dedication
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a greeting, memory, or purpose for your donation..."
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
                          ? 'Instant automated receipt via Debit Card, Apple Pay, USSD, or Bank Transfer.'
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
                  ? 'Payment Verified & Cleared'
                  : 'Transfer Notification Logged'}
              </span>

              <h3 className="text-2xl font-retro font-bold text-emerald-950">
                {receiptData.status === 'VERIFIED'
                  ? 'Support Contribution Confirmed!'
                  : 'Transfer Notification Received!'}
              </h3>
              <p className="text-xs text-stone-600">
                {receiptData.status === 'VERIFIED'
                  ? 'Thank you for empowering the ASF RSU 45th Jubilee Anniversary & Homecoming. Your payment has been confirmed.'
                  : 'Thank you! Your support record has been logged. Please complete your transfer to Ecobank account 0570076237.'}
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
                  * Please quote your reference in your bank transfer narration/remark. The Secretariat will reconcile your payment against the Ecobank statement and confirm your contribution.
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#F7F4EA] border border-stone-200 space-y-2.5 text-xs font-mono mb-6">
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Transaction Ref:</span>
                <span className="font-bold text-emerald-950 truncate max-w-[200px]">{receiptData.reference}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Contributor:</span>
                <span className="font-bold text-stone-800">{receiptData.donor_name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Support Category:</span>
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
                <span>An official acknowledgment has been dispatched to <strong>{receiptData.email}</strong>.</span>
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
                <span>Print Official {receiptData.status === 'VERIFIED' ? 'Receipt' : 'Transfer Voucher'}</span>
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
