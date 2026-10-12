/**
 * ASF RSU 45th Jubilee - Enterprise Spreadsheet Export Utility
 * Generates RFC 4180 compliant, UTF-8 BOM encoded spreadsheets
 * fully compatible with Microsoft Excel, Google Sheets, LibreOffice, and Apple Numbers.
 * 
 * Features:
 * - UTF-8 Byte Order Mark (\uFEFF) to prevent encoding corruption (Naira signs, accents, quotes)
 * - Safe text formatting for phone numbers and tags to prevent Excel from dropping leading zeros
 * - RFC 4180 quote escaping
 * - Clean filenames with ISO date stamps
 */

/**
 * Escapes a cell value according to RFC 4180 standards
 * @param {any} val - Value to escape
 * @returns {string} Escaped CSV field
 */
function escapeCSV(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  // Normalize Windows/Unix newlines inside text
  str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Escape double quotes by doubling them
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Preserves leading zeros in phone numbers or numeric codes when opened in Excel
 * @param {string|number} phone 
 * @returns {string} Safe cell string
 */
function formatExcelText(val) {
  if (!val) return '""';
  const str = String(val).trim();
  // If string starts with 0 or + and contains digits, format as formula string to preserve zero in Excel
  if (/^0\d+$/.test(str) || /^\+\d[\d\s-]*$/.test(str)) {
    return `="""${str}"""`;
  }
  return escapeCSV(str);
}

/**
 * Formats timestamps cleanly for spreadsheet readers
 * @param {string|number|Date} dateVal 
 * @returns {string} Clean date string
 */
function formatDateTime(dateVal) {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return String(dateVal);
  }
}

/**
 * Downloads CSV content as a file with UTF-8 BOM
 * @param {string} filename 
 * @param {string} csvContent 
 */
export function downloadCSV(filename, csvContent) {
  // \uFEFF Byte Order Mark tells Excel to open the file with UTF-8 encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports Alumni Directory / Census Registrations to Spreadsheet
 * @param {Array} registrations 
 * @param {Object} filters 
 */
export function exportRegistrationsSpreadsheet(registrations = [], filters = {}) {
  if (!registrations || registrations.length === 0) return;

  const headers = [
    'S/N',
    'Registration Tag',
    'Full Name',
    'Maiden Name',
    'Graduation Year',
    'Cohort Era',
    'Department / Discipline',
    'Phone (WhatsApp)',
    'Email Address',
    'City / State',
    'Country',
    'Current Profession / Role',
    'Fellowship Roles Held',
    'Attendance Mode',
    'Arrival Date',
    'Willing to Support',
    'Support Category',
    'Support Pledge (NGN)',
    'Accreditation Status',
    'Check-in Timestamp',
    'Registration Date',
    'Tribute / Memory Note'
  ];

  const rows = registrations.map((r, index) => [
    index + 1,
    formatExcelText(r.registration_tag || ''),
    escapeCSV(r.full_name || ''),
    escapeCSV(r.maiden_name || ''),
    r.grad_year || '',
    escapeCSV(r.cohort_era || ''),
    escapeCSV(r.department || ''),
    formatExcelText(r.phone || ''),
    escapeCSV(r.email || ''),
    escapeCSV(r.city || ''),
    escapeCSV(r.country || ''),
    escapeCSV(r.current_profession || ''),
    escapeCSV(r.fellowship_roles || ''),
    escapeCSV(r.attendance_mode || 'PHYSICAL'),
    escapeCSV(r.arrival_date || ''),
    r.willing_to_support ? 'YES' : 'NO',
    escapeCSV(r.support_category || ''),
    escapeCSV(r.support_pledge || ''),
    r.checked_in ? 'CHECKED IN' : 'PENDING',
    formatDateTime(r.checked_in_at),
    formatDateTime(r.created_at),
    escapeCSV(r.tribute_quote || '')
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const dateStamp = new Date().toISOString().slice(0, 10);
  downloadCSV(`ASF-RSU-45th-Alumni-Census-Spreadsheet-${dateStamp}.csv`, csvContent);
}

/**
 * Exports Jubilee Sponsorships & Contributions Ledger to Spreadsheet
 * @param {Array} sponsorships 
 * @param {Object} filters 
 */
export function exportSponsorshipsSpreadsheet(sponsorships = [], filters = {}) {
  if (!sponsorships || sponsorships.length === 0) return;

  const headers = [
    'S/N',
    'Payment Reference',
    'Donor / Contributor Name',
    'Organization / Brand',
    'Contribution Category / Tier',
    'Amount (NGN)',
    'Payment Channel',
    'Payment Status',
    'Donor Email',
    'Donor Phone',
    'Date Logged',
    'Admin Notes'
  ];

  const rows = sponsorships.map((s, index) => [
    index + 1,
    formatExcelText(s.reference || ''),
    escapeCSV(s.donor_name || ''),
    escapeCSV(s.organization || ''),
    escapeCSV(s.tier_name || s.tier_key || 'General Giving'),
    typeof s.amount === 'number' ? s.amount : Number(s.amount) || 0,
    escapeCSV(s.payment_method || 'Online Paystack'),
    escapeCSV(s.status || 'VERIFIED'),
    escapeCSV(s.email || ''),
    formatExcelText(s.phone || ''),
    formatDateTime(s.created_at),
    escapeCSV(s.notes || '')
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const dateStamp = new Date().toISOString().slice(0, 10);
  downloadCSV(`ASF-RSU-45th-Sponsorships-Ledger-Spreadsheet-${dateStamp}.csv`, csvContent);
}

/**
 * Exports Commemorative Compendium Ad Manifest & Production Ledger to Spreadsheet
 * @param {Array} adBookings 
 * @param {Object} filters 
 */
export function exportAdManifestSpreadsheet(adBookings = [], filters = {}) {
  if (!adBookings || adBookings.length === 0) return;

  const headers = [
    'S/N',
    'Booking Reference',
    'Advertiser Full Name',
    'Company / Brand Name',
    'Brand Headline',
    'Ad Placement Slot',
    'Print Dimensions & Bleed',
    'Amount (NGN)',
    'Payment Channel',
    'Payment Status',
    'Editorial Production Status',
    'Assigned Magazine Page',
    'Contact Phone',
    'Contact Email',
    'Artwork File / URL',
    'Instructions & Copy Notes',
    'Booking Date'
  ];

  const rows = adBookings.map((ad, index) => [
    index + 1,
    formatExcelText(ad.booking_reference || ad.reference || ''),
    escapeCSV(ad.advertiser_name || ad.donor_name || ''),
    escapeCSV(ad.company_name || ad.organization || ''),
    escapeCSV(ad.brand_headline || ''),
    escapeCSV(ad.ad_tier_name || ad.tier_name || ''),
    escapeCSV(ad.ad_dimensions || ''),
    typeof ad.amount === 'number' ? ad.amount : Number(ad.amount) || 0,
    escapeCSV(ad.payment_method || 'Online Paystack'),
    escapeCSV(ad.payment_status || 'VERIFIED'),
    escapeCSV(ad.editorial_status || 'RECEIVED'),
    escapeCSV(ad.assigned_page_number || 'Unassigned'),
    formatExcelText(ad.phone || ''),
    escapeCSV(ad.email || ''),
    escapeCSV(ad.artwork_url || ad.artwork_file_name || 'None'),
    escapeCSV(ad.message_note || ''),
    formatDateTime(ad.created_at)
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const dateStamp = new Date().toISOString().slice(0, 10);
  downloadCSV(`ASF-RSU-45th-Compendium-Ad-Manifest-Spreadsheet-${dateStamp}.csv`, csvContent);
}
