import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Check, X, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QrShareModal({ isOpen, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [siteUrl, setSiteUrl] = useState('https://asfrsu.org');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    QRCode.toDataURL(siteUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#051A0F',
        light: '#FFFFFF'
      }
    })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('QR generation error:', err);
      });
  }, [siteUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Adventist Students' Fellowship (RSU) 45th Anniversary Celebration & Alumni Homecoming (1981–2026)!\n\nTheme: "Rooted to Rise: Honouring our Heritage, Igniting our Future"\nDate: November 13–15, 2026\n\nScan the QR Code or visit: ${siteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Generate and download a complete, branded printable 45th Jubilee QR Card
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

    // Load official logo and draw
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      // Draw Logo centered
      ctx.drawImage(logoImg, width / 2 - 140, 75, 280, 180);

      // Organization Header
      ctx.fillStyle = '#FAF7EE';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText("ADVENTIST STUDENTS' FELLOWSHIP (RSU)", width / 2, 290);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText("45TH ANNIVERSARY & ALUMNI HOMECOMING", width / 2, 325);

      // Theme
      ctx.fillStyle = '#F4E3A8';
      ctx.font = 'italic bold 28px "Playfair Display", Georgia, serif';
      ctx.fillText('“Rooted to Rise: Honouring our Heritage”', width / 2, 375);

      // QR Code container white card
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 250, 420, 500, 500, 24);
      ctx.fill();

      // Draw QR Code
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, width / 2 - 225, 445, 450, 450);

        // Call to action below QR
        ctx.fillStyle = '#D4AF37';
        ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("SCAN TO VISIT OFFICIAL WEB PORTAL", width / 2, 970);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("Register for Census • Generate Your DP • View Program", width / 2, 1010);

        // Date and venue
        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("NOVEMBER 13–15, 2026 • RSU PORT HARCOURT", width / 2, 1070);

        // Web URL pill
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

        // Citation
        ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
        ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
        ctx.fillText("“To give unto them beauty for ashes...” — Isaiah 61:3", width / 2, 1240);

        // Download
        const link = document.createElement('a');
        link.download = `ASF-RSU-45th-Official-QR-Poster.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        setDownloading(false);

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      };
      qrImg.src = qrDataUrl;
    };
    logoImg.src = '/official-logo.png';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#051A0F] text-white rounded-3xl border-2 border-jubilee-gold/60 shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="/official-logo.png"
            alt="ASF 45th Logo"
            className="h-16 w-auto mx-auto mb-3 object-contain"
          />
          <h3 className="font-retro text-2xl font-bold text-white">
            Official 45th Jubilee QR Code
          </h3>
          <p className="text-xs text-emerald-200/80 font-light mt-1">
            Scan to instantly access the Alumni Census, DP Generator & Event Program.
          </p>
        </div>

        {/* QR Code Canvas Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 mx-auto max-w-[280px] shadow-2xl border-4 border-jubilee-gold/40 flex flex-col items-center justify-center mb-6">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="ASF RSU 45th Jubilee QR Code"
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-stone-400 text-xs">
              Generating QR Code...
            </div>
          )}
          <span className="text-[10px] text-stone-500 font-mono mt-2 text-center block">
            {siteUrl}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 font-sans">
          <button
            onClick={handleDownloadBrandedQr}
            disabled={downloading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-300 to-yellow-500 text-emerald-950 shadow-luxury hover:scale-[1.01] transition-all"
          >
            <Download className="w-4 h-4 text-emerald-950" />
            <span>{downloading ? 'Preparing Poster...' : 'Download Printable QR Flyer (PNG)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-jubilee-gold" />}
              <span>{copied ? 'Link Copied!' : 'Copy Site Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white text-xs font-semibold transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-300" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
