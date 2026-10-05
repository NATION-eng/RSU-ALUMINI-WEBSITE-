const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // 1. Prepare dimmed master heritage backdrop
  const backdropPath = path.join(__dirname, '../public/heritage/asf_heritage_master_backdrop.jpg');
  let backdropBuffer;
  if (fs.existsSync(backdropPath)) {
    backdropBuffer = await sharp(backdropPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 0.35, saturation: 0.8 })
      .toBuffer();
  }

  // 2. Prepare Rooted to Rise artwork (compact & sharp)
  const rootedPath = path.join(__dirname, '../public/rooted-to-rise.png');
  const rootedBuffer = await sharp(rootedPath)
    .resize(320, null, { fit: 'inside' })
    .toBuffer();

  // 3. Prepare Official Logo
  const logoPath = path.join(__dirname, '../public/official-logo.png');
  const logoBuffer = await sharp(logoPath)
    .resize(70, null, { fit: 'inside' })
    .toBuffer();

  // 4. Create luxury SVG overlay with text, gradients, framing, and badges
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep luxury emerald gradient overlay -->
      <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#04140B" stop-opacity="0.94"/>
        <stop offset="50%" stop-color="#072A18" stop-opacity="0.82"/>
        <stop offset="100%" stop-color="#04140B" stop-opacity="0.97"/>
      </linearGradient>

      <!-- Radial Gold Ambient Glow -->
      <radialGradient id="centerGlow" cx="50%" cy="42%" r="42%">
        <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.22"/>
        <stop offset="60%" stop-color="#051A0F" stop-opacity="0"/>
      </radialGradient>

      <!-- Gold Border Stroke Gradient -->
      <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#F3E5AB" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.3"/>
      </linearGradient>
    </defs>

    <!-- Emerald wash over background -->
    <rect width="${width}" height="${height}" fill="url(#emeraldGrad)" />
    <rect width="${width}" height="${height}" fill="url(#centerGlow)" />

    <!-- Outer Luxury Double Gold Border -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="20" fill="none" stroke="url(#goldBorder)" stroke-width="2" />
    <rect x="32" y="32" width="${width - 64}" height="${height - 64}" rx="14" fill="none" stroke="#D4AF37" stroke-opacity="0.25" stroke-width="1" />

    <!-- Top Badge Pill -->
    <g transform="translate(425, 42)">
      <rect width="350" height="34" rx="17" fill="#0D3821" fill-opacity="0.95" stroke="#D4AF37" stroke-opacity="0.6" stroke-width="1.2"/>
      <text x="175" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#F4E3A8" text-anchor="middle" letter-spacing="3">
        1981 – 2026 • 45TH JUBILEE
      </text>
    </g>

    <!-- Fellowship Title Header -->
    <text x="600" y="112" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">
      ADVENTIST STUDENTS' FELLOWSHIP (ASF)
    </text>
    <text x="600" y="136" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#A7F3D0" text-anchor="middle" letter-spacing="2.5">
      RIVERS STATE UNIVERSITY (RSU), PORT HARCOURT
    </text>

    <!-- Scriptural Theme (Honouring our Heritage) -->
    <text x="600" y="420" font-family="Georgia, serif" font-size="22" font-style="italic" font-weight="500" fill="#E6FFFA" text-anchor="middle">
      “Honouring our Heritage, Igniting our Future”
    </text>
    <text x="600" y="446" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#D4AF37" text-anchor="middle" letter-spacing="4">
      — ISAIAH 61:3 —
    </text>

    <!-- Bottom Date & Venue Card -->
    <g transform="translate(260, 474)">
      <rect width="680" height="48" rx="14" fill="#062314" fill-opacity="0.95" stroke="#D4AF37" stroke-opacity="0.6" stroke-width="1.2"/>
      <text x="340" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
        GRAND JUBILEE HOMECOMING: <tspan fill="#F59E0B">NOV 13–15, 2026</tspan>
      </text>
    </g>

    <!-- Feature Badges -->
    <g transform="translate(280, 540)">
      <text x="320" y="18" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#A7F3D0" text-anchor="middle" letter-spacing="1.5">
        Alumni Census &amp; Directory • Live DP Generator • 45-Year Archive
      </text>
    </g>

    <!-- Website URL Footer -->
    <text x="600" y="586" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#F4E3A8" text-anchor="middle" letter-spacing="2">
      WWW.ASFRSUALUMNI.ORG
    </text>
  </svg>
  `;

  const svgBuffer = Buffer.from(svgOverlay);

  // 5. Composite everything together
  const compositeLayers = [];

  if (backdropBuffer) {
    compositeLayers.push({ input: backdropBuffer, top: 0, left: 0 });
  }

  compositeLayers.push({ input: svgBuffer, top: 0, left: 0 });

  // Place Rooted to Rise artwork centered vertically
  // Rooted to rise width is 320. Center is 600 - (320 / 2) = 440
  // Height is approx 265. Top: 145 -> bottom ends around 410.
  compositeLayers.push({
    input: rootedBuffer,
    top: 142,
    left: 440
  });

  // Output 1: High quality JPEG for WhatsApp / OG (1200x630, ~140KB)
  const outputPathJpg = path.join(__dirname, '../public/og-preview.jpg');
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: '#051A0F'
    }
  })
  .composite(compositeLayers)
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
  .toFile(outputPathJpg);

  // Output 2: PNG fallback
  const outputPathPng = path.join(__dirname, '../public/og-preview.png');
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#051A0F'
    }
  })
  .composite(compositeLayers)
  .png({ compressionLevel: 8 })
  .toFile(outputPathPng);

  console.log('Successfully generated og-preview.jpg and og-preview.png');
  const statJpg = fs.statSync(outputPathJpg);
  console.log('JPG Size:', (statJpg.size / 1024).toFixed(1), 'KB');
}

generateOgImage().catch(console.error);
