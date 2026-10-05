import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QrSection() {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [siteUrl, setSiteUrl] = useState('https://asfrsu.org');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const generateQr = () => {
      if (!active) return;
      QRCode.toDataURL(siteUrl, {
        width: 450,
        margin: 2,
        color: {
          dark: '#051A0F',
          light: '#FFFFFF'
        }
      })
        .then(url => {
          if (active) setQrDataUrl(url);
        })
        .catch(err => {
          console.error('QR generation error:', err);
        });
    };

    const timer = setTimeout(generateQr, 60);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [siteUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Adventist Students' Fellowship (RSU) 45th Anniversary & Alumni Homecoming (1981–2026)!\n\nTheme: "Rooted to Rise: Honouring our Heritage, Igniting our Future"\nDates: November 13–15, 2026\n\nScan QR Code or visit: ${siteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadBrandedQr = () => {
    setDownloading(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1000;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#051A0F');
    bg.addColorStop(0.5, '#092B19');
    bg.addColorStop(1, '#051A0F');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Gold borders
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#D4AF37';
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Load official logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      ctx.drawImage(logoImg, width / 2 - 140, 75, 280, 180);

      ctx.fillStyle = '#FAF7EE';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText("ADVENTIST STUDENTS' FELLOWSHIP (RSU)", width / 2, 290);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText("45TH ANNIVERSARY & ALUMNI HOMECOMING", width / 2, 325);

      ctx.fillStyle = '#F4E3A8';
      ctx.font = 'italic bold 28px "Playfair Display", Georgia, serif';
      ctx.fillText('“Rooted to Rise: Honouring our Heritage”', width / 2, 375);

      // QR Code container
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 250, 420, 500, 500, 24);
      ctx.fill();

      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, width / 2 - 225, 445, 450, 450);

        ctx.fillStyle = '#D4AF37';
        ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("SCAN TO VISIT OFFICIAL WEB PORTAL", width / 2, 970);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("Register for Census • Generate Your DP • View Program", width / 2, 1010);

        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("NOVEMBER 13–15, 2026 • RSU PORT HARCOURT", width / 2, 1070);

        ctx.fillStyle = '#092B19';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 240, 1120, 480, 60, 30);
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#F4E3A8';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(siteUrl, width / 2, 1158);

        ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
        ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
        ctx.fillText("“To give unto them beauty for ashes...” — Isaiah 61:3", width / 2, 1240);

        const link = document.createElement('a');
        link.download = `ASF-RSU-45th-Official-QR-Poster.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        setDownloading(false);

        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      };
      qrImg.src = qrDataUrl;
    };
    logoImg.src = '/official-logo.png';
  };

  return (
    <section id="qr-share" className="py-16 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative vintage-texture border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="luxury-glass rounded-2xl sm:rounded-3xl p-5 sm:p-10 border-2 border-jubilee-gold/40 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Left Column: QR Code Display Card */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border-4 border-jubilee-gold/50 max-w-[220px] sm:max-w-[240px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Official 45th Jubilee QR Code"
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center text-stone-500 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-jubilee-lightgold mt-2 truncate max-w-[240px]">
              {siteUrl}
            </span>
          </div>

          {/* Right Column: Explanations & Download Actions */}
          <div className="grow space-y-3.5 sm:space-y-4 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.04] text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest">
              <QrCode className="w-3.5 h-3.5 text-jubilee-gold" />
              <span>Official Jubilee QR Code</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-retro font-bold text-white tracking-tight">
              Share the Jubilee With Fellow Alumni
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed max-w-lg">
              Download the official high-resolution QR poster to print on publicity banners, event programs, or forward to graduating set WhatsApp groups.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 font-sans w-full">
              <button
                onClick={handleDownloadBrandedQr}
                disabled={downloading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-3 rounded-full text-xs font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-105 active:scale-95 transition-all touch-manipulation"
              >
                <Download className="w-4 h-4 text-emerald-950" />
                <span>{downloading ? 'Preparing Flyer...' : 'Download Printable QR Flyer'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all active:scale-95 touch-manipulation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-jubilee-gold" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-full text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white transition-all active:scale-95 touch-manipulation"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
