import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Upload, Download, Sparkles, ZoomIn, ZoomOut, Share2, CheckCircle2, User, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

// Safe cross-browser rounded rectangle helper (never throws if ctx.roundRect is absent)
function drawSafeRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export default function DpGenerator() {
  const [image, setImage] = useState(null);
  const [hasCustomPhoto, setHasCustomPhoto] = useState(false);
  const [name, setName] = useState('Elder Tamuno Briggs');
  const [gradSet, setGradSet] = useState("Class of '94");
  const [cohortBadge, setCohortBadge] = useState('Pioneer Cohort (1981–1999)');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [officialLogo, setOfficialLogo] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const lImg = new Image();
    lImg.crossOrigin = 'anonymous';
    lImg.onload = () => setOfficialLogo(lImg);
    lImg.src = '/official-logo.png';
  }, []);

  const cohorts = [
    'Pioneer Cohort (1981–1999)',
    'Contemporary Cohort (2000–2025)',
    'Global Diaspora Ambassador',
    'ASF Mass Choir Alumnus',
    'Current RSU Undergrad',
    'Fellowship Executive (Exco)'
  ];

  // Helper to load sample image safely via native canvas generation (100% untainted)
  const drawNativePlaceholder = useCallback((ctx, size) => {
    // Elegant background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#0F4D2A');
    bgGrad.addColorStop(0.5, '#1B663B');
    bgGrad.addColorStop(1, '#082817');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Subtle sunburst rays
    ctx.save();
    ctx.translate(size / 2, size / 2 - 40);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.lineWidth = 18;
    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size, 0);
      ctx.stroke();
      ctx.rotate((Math.PI * 2) / 24);
    }
    ctx.restore();

    // Stylized silhouette portrait
    ctx.save();
    ctx.fillStyle = '#E5DFC9';
    // Head
    ctx.beginPath();
    ctx.arc(size / 2, size / 2 - 80, 130, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2 + 190, 240, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Prompt badge in placeholder
    ctx.fillStyle = 'rgba(11, 53, 32, 0.85)';
    drawSafeRoundRect(ctx, size / 2 - 190, size / 2 - 40, 380, 56, 28);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#FAF7EE';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📷 Click "Upload Photo" Below', size / 2, size / 2 - 5);

    ctx.restore();
  }, []);

  // Handle uploaded image safely
  const handleImageUpload = (e) => {
    setErrorMessage('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setHasCustomPhoto(true);
        setZoom(1);
        setPanX(0);
        setPanY(0);
      };
      img.onerror = () => {
        setErrorMessage('Failed to load image. Please try another photo.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setErrorMessage('Error reading file from your device.');
    };
    reader.readAsDataURL(file);

    // Reset input value so re-uploading the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1200; // High resolution 1200x1200px export
    canvas.width = size;
    canvas.height = size;

    try {
      // 1. Base Background Fill
      ctx.fillStyle = '#082817';
      ctx.fillRect(0, 0, size, size);

      // 2. Draw User Photo or Safe Untainted Placeholder
      if (image && hasCustomPhoto) {
        ctx.save();
        // Circular mask for the user photo
        ctx.beginPath();
        ctx.arc(size / 2, size / 2 - 20, 510, 0, Math.PI * 2);
        ctx.clip();

        const imgAspect = image.width / image.height;
        let drawW, drawH;
        if (imgAspect > 1) {
          drawH = size * zoom;
          drawW = size * imgAspect * zoom;
        } else {
          drawW = size * zoom;
          drawH = (size / imgAspect) * zoom;
        }
        const drawX = (size - drawW) / 2 + panX * 2.2;
        const drawY = (size - drawH) / 2 - 20 + panY * 2.2;

        ctx.drawImage(image, drawX, drawY, drawW, drawH);
        ctx.restore();
      } else {
        // Draw native procedural placeholder (Guaranteed non-tainting)
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2 - 20, 510, 0, Math.PI * 2);
        ctx.clip();
        drawNativePlaceholder(ctx, size);
        ctx.restore();
      }

      // 3. Subtle Vignette & Frame Borders
      // Outer Circular Gold Border
      ctx.save();
      ctx.lineWidth = 28;
      ctx.strokeStyle = '#D4AF37'; // Jubilee Gold
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 570, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Emerald Trim Ring
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#0F4D2A';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 545, 0, Math.PI * 2);
      ctx.stroke();

      // Fine Gold Inner Hairline
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F3E5AB';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 532, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. STRUCTURED TOP BANNER (Header & Fellowship Name)
      ctx.save();
      // Drop shadow for top ribbon
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;

      // Top Plaque Background
      ctx.fillStyle = '#062013';
      drawSafeRoundRect(ctx, size / 2 - 470, 48, 940, 116, 24);
      ctx.fill();

      // Gold border on top plaque
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner subtle border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      drawSafeRoundRect(ctx, size / 2 - 460, 56, 920, 100, 18);
      ctx.stroke();

      // Draw Official 45th Jubilee Logo if loaded
      if (officialLogo) {
        ctx.drawImage(officialLogo, size / 2 - 435, 62, 125, 88);
        
        // Centered text with offset to balance the logo
        ctx.fillStyle = '#FAF7EE';
        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '2px';
        ctx.fillText("ADVENTIST STUDENTS' FELLOWSHIP (RSU)", size / 2 + 50, 92);

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '1.5px';
        ctx.fillText("★ 45TH ANNIVERSARY & ALUMNI HOMECOMING (1981–2026) ★", size / 2 + 50, 134);
      } else {
        ctx.fillStyle = '#FAF7EE';
        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '3px';
        ctx.fillText("ADVENTIST STUDENTS' FELLOWSHIP (RSU)", size / 2, 92);

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 21px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText("★ 45TH ANNIVERSARY & ALUMNI HOMECOMING (1981–2026) ★", size / 2, 134);
      }
      ctx.restore();

      // 5. "I WILL BE THERE!" High-Impact Badge (Situated gracefully across the mid-lower section)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;

      // Badge Gold Background
      const badgeY = size - 390;
      ctx.fillStyle = '#D4AF37';
      drawSafeRoundRect(ctx, size / 2 - 240, badgeY, 480, 56, 28);
      ctx.fill();

      // Gold Badge Stroke
      ctx.strokeStyle = '#FFF8E1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Badge Text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#062013';
      ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.fillText("✦ I WILL BE THERE! ✦", size / 2, badgeY + 38);
      ctx.restore();

      // 6. STRUCTURED BOTTOM IDENTITY CARD (Name, Class, Cohort, Theme)
      ctx.save();
      const bottomCardY = size - 315;
      const bottomCardH = 265;

      // Plaque Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;

      // Plaque Fill (Deep Emerald / Forest Obsidian)
      ctx.fillStyle = '#062013';
      drawSafeRoundRect(ctx, size / 2 - 500, bottomCardY, 1000, bottomCardH, 28);
      ctx.fill();

      // Plaque Gold Border
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner Gold Accent Line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.5;
      drawSafeRoundRect(ctx, size / 2 - 488, bottomCardY + 10, 976, bottomCardH - 20, 20);
      ctx.stroke();

      // Row A: User Name (Majestic Display Typography)
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';

      // Dynamic font sizing if name is long
      const displayName = name.trim() || 'Distinguished Alumnus';
      if (displayName.length > 28) {
        ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      } else if (displayName.length > 20) {
        ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
      } else {
        ctx.font = 'bold 50px "Playfair Display", Georgia, serif';
      }
      ctx.fillText(displayName, size / 2, bottomCardY + 68);

      // Row B: Set & Cohort Badge (Mint / Leaf Contrast)
      ctx.fillStyle = '#34D399'; // Mint Glow
      ctx.font = 'bold 25px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '1px';
      const setDisplay = gradSet.trim() ? `${gradSet} • ` : '';
      ctx.fillText(`${setDisplay}${cohortBadge}`.toUpperCase(), size / 2, bottomCardY + 116);

      // Row C: Thin Gold Divider
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(size / 2 - 320, bottomCardY + 140);
      ctx.lineTo(size / 2 + 320, bottomCardY + 140);
      ctx.stroke();

      // Row D: Theme & Biblical Citation
      ctx.fillStyle = '#F3E5AB'; // Soft Warm Gold
      ctx.font = 'italic bold 23px "Playfair Display", Georgia, serif';
      ctx.fillText('“Rooted to Rise: Honouring our Heritage, Igniting our Future”', size / 2, bottomCardY + 178);

      ctx.fillStyle = '#D4AF37'; // Gold
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('ISAIAH 61:3 • NOV 13–15, 2026 • GRAND JUBILEE: SATURDAY, NOV 14', size / 2, bottomCardY + 218);

      ctx.restore();

    } catch (err) {
      console.error('Error drawing canvas:', err);
      setErrorMessage('Canvas rendering error: ' + (err.message || 'Unknown'));
    }

  }, [image, hasCustomPhoto, officialLogo, name, gradSet, cohortBadge, zoom, panX, panY, drawNativePlaceholder]);

  // Robust Download Function
  const handleDownload = () => {
    setErrorMessage('');
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    try {
      // Direct Data URL export (safe and tested)
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      const cleanFileName = `ASF-RSU-45th-DP-${(name || 'Alumnus').replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      const link = document.createElement('a');
      link.download = cleanFileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger celebratory confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0F4D2A', '#D4AF37', '#34D399', '#FAF7EE']
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 6000);

    } catch (err) {
      console.error('Download error:', err);
      setErrorMessage('Could not download image directly. If your browser blocks downloads, right-click/long-press the preview picture and choose "Save image as".');
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 I will be at the Adventist Students' Fellowship (RSU) 45th Anniversary & Alumni Homecoming (1981–2026)!\n\nTheme: "Rooted to Rise: Honouring our Heritage, Igniting our Future"\n\nCreate your DP here: http://localhost:3000/#dp-generator`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="dp-generator" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#051A0F] text-white relative vintage-texture">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] text-jubilee-lightgold border border-jubilee-gold/30 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-jubilee-gold" />
            <span>Official Jubilee Mobilization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-white tracking-tight mb-3">
            "I Will Be There" DP Generator
          </h2>
          <p className="text-emerald-100/75 text-sm sm:text-base font-light leading-relaxed">
            Personalize your commemorative badge and broadcast the Jubilee across WhatsApp and social media.
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Generator Workspace */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Canvas Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-jubilee-gold/60 bg-emerald-950">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
                  title="Your 45th Jubilee DP Preview (Right-click to save if needed)"
                />
              </div>

              {/* Status Hint */}
              <p className="text-[11px] text-emerald-300/80 mt-2 font-medium">
                {hasCustomPhoto ? '✓ Custom photo loaded. Use sliders below to align.' : '⚡ Click "Upload Your Photo" or enter your name below.'}
              </p>

              {/* Pan & Zoom Controls */}
              <div className="w-full max-w-[420px] mt-4 bg-white/10 rounded-xl p-3.5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
                  <div className="flex items-center space-x-1">
                    <ZoomIn className="w-3.5 h-3.5 text-jubilee-gold" />
                    <span>Zoom Photo:</span>
                  </div>
                  <span className="font-mono">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-jubilee-gold"
                />

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-emerald-300 font-medium block mb-1">Pan Left / Right:</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={panX}
                      onChange={(e) => setPanX(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-jubilee-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-emerald-300 font-medium block mb-1">Pan Up / Down:</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={panY}
                      onChange={(e) => setPanY(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-jubilee-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Customization Form */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Photo Upload Trigger */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                  1. Upload Your Photo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center space-x-2.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all hover:border-jubilee-gold"
                  >
                    <Upload className="w-4 h-4 text-jubilee-gold" />
                    <span>{hasCustomPhoto ? 'Change Photo' : 'Choose Photo from Device'}</span>
                  </button>

                  {hasCustomPhoto && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setHasCustomPhoto(false);
                        setZoom(1);
                        setPanX(0);
                        setPanY(0);
                      }}
                      className="px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-400 hover:text-white text-xs font-semibold"
                      title="Reset to default placeholder"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  2. Full Name & Title (Situated in Big Serif Banner)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elder Tamuno Briggs"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-jubilee-gold text-sm font-medium"
                />
              </div>

              {/* Graduating Set Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  3. Graduating Set / Class Year
                </label>
                <input
                  type="text"
                  value={gradSet}
                  onChange={(e) => setGradSet(e.target.value)}
                  placeholder="e.g. Class of '94, Set of 2012, or 1985"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-jubilee-gold text-sm font-medium"
                />
              </div>

              {/* Cohort Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  4. Alumni Cohort Badge
                </label>
                <select
                  value={cohortBadge}
                  onChange={(e) => setCohortBadge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-jubilee-gold text-sm font-medium"
                >
                  {cohorts.map((cohort) => (
                    <option key={cohort} value={cohort} className="bg-emerald-950 text-white">
                      {cohort}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-base font-extrabold bg-gradient-to-r from-jubilee-gold via-amber-400 to-yellow-500 text-emerald-950 shadow-xl hover:shadow-jubilee-gold/40 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5 text-emerald-950" />
                  <span>Download High-Res 45th Jubilee DP</span>
                </button>

                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-emerald-300" />
                  <span>Share DP Generator on WhatsApp Broadcast</span>
                </button>
              </div>

              {downloadSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-900/90 border border-emerald-500 text-emerald-200 text-xs flex items-center space-x-2.5 animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-jubilee-gold shrink-0" />
                  <span>DP Downloaded! Check your Downloads folder. Post it to WhatsApp Status & Facebook!</span>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
