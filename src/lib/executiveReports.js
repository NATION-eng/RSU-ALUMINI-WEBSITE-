/**
 * Executive Report & PDF Generation Engine
 * Generates publication-grade, branded official executive reports
 * ready for printing or saving as PDF without Excel/CSV corruption.
 */

const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #F8F9FA;
    color: #1A202C;
    padding: 24px;
    font-size: 11px;
    line-height: 1.5;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .report-container {
    max-width: 1280px;
    margin: 0 auto;
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    border: 1px solid #E2E8F0;
  }

  /* Floating Action Bar (Hidden during Print) */
  .action-bar {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #051A0F;
    border-bottom: 2px solid #D4AF37;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .action-bar-title {
    color: #FFFFFF;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-bar-badge {
    background: rgba(212, 175, 55, 0.2);
    color: #F4E3A8;
    border: 1px solid rgba(212, 175, 55, 0.4);
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    font-family: inherit;
  }

  .btn-gold {
    background: linear-gradient(135deg, #D4AF37, #F59E0B);
    color: #051A0F;
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  }
  .btn-gold:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .btn-outline {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .btn-outline:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Document Header */
  .doc-header {
    background: linear-gradient(135deg, #051A0F 0%, #092B19 50%, #051A0F 100%);
    color: #FFFFFF;
    padding: 32px 36px 28px;
    border-bottom: 4px solid #D4AF37;
    position: relative;
  }

  .doc-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
  }

  .logo-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo-img {
    width: 64px;
    height: 64px;
    object-contain: contain;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  }

  .org-title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #FAF7EE;
    line-height: 1.2;
  }

  .org-subtitle {
    font-size: 11px;
    color: #D4AF37;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .doc-meta {
    text-align: right;
    font-size: 10px;
    color: #CBD5E1;
  }

  .doc-meta strong {
    color: #FFFFFF;
  }

  .doc-title-block {
    border-top: 1px solid rgba(212, 175, 55, 0.3);
    padding-top: 16px;
  }

  .doc-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.5px;
  }

  .doc-theme {
    color: #F4E3A8;
    font-size: 11px;
    font-style: italic;
    margin-top: 4px;
  }

  /* Executive Metric Cards */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    padding: 24px 36px;
    background: #F8FAFC;
    border-bottom: 1px solid #E2E8F0;
  }

  .metric-card {
    background: #FFFFFF;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .metric-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748B;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: 22px;
    font-weight: 800;
    color: #051A0F;
    margin-top: 4px;
    line-height: 1.1;
  }

  .metric-value.gold {
    color: #B45309;
  }
  .metric-value.emerald {
    color: #047857;
  }

  .metric-desc {
    font-size: 9.5px;
    color: #94A3B8;
    margin-top: 4px;
  }

  /* Data Table */
  .table-wrapper {
    padding: 24px 36px 36px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10.5px;
  }

  th {
    background: #092B19;
    color: #FFFFFF;
    text-align: left;
    padding: 10px 12px;
    font-weight: 700;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #051A0F;
    white-space: nowrap;
  }

  td {
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
    vertical-align: middle;
  }

  tr:nth-child(even) td {
    background-color: #F8FAFC;
  }

  tr:hover td {
    background-color: #FEF3C7;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 9999px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .badge-physical { background: #DCFCE7; color: #166534; border: 1px solid #86EFAC; }
  .badge-virtual { background: #E0E7FF; color: #3730A3; border: 1px solid #A5B4FC; }
  .badge-verified { background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; }
  .badge-pending { background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; }
  .badge-pledge { background: #F3E8FF; color: #6B21A8; border: 1px solid #D8B4FE; }
  .badge-gold { background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }

  .phone-text {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 600;
    color: #0F172A;
    white-space: nowrap;
  }

  .tag-text {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 700;
    color: #B45309;
    white-space: nowrap;
  }

  .amount-text {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 700;
    color: #047857;
    white-space: nowrap;
  }

  /* Document Footer */
  .doc-footer {
    padding: 24px 36px;
    background: #F8FAFC;
    border-top: 2px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    color: #64748B;
  }

  .sign-off {
    font-weight: 700;
    color: #051A0F;
  }

  /* Print Media Specific Overrides */
  @media print {
    body {
      background: #FFFFFF !important;
      padding: 0 !important;
    }

    .report-container {
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      max-width: 100% !important;
    }

    .action-bar {
      display: none !important;
    }

    .doc-header {
      padding: 20px 24px 16px !important;
    }

    .metrics-grid {
      padding: 16px 24px !important;
      gap: 12px !important;
    }

    .table-wrapper {
      padding: 16px 24px !important;
    }

    .doc-footer {
      padding: 16px 24px !important;
    }

    @page {
      size: A4 landscape;
      margin: 10mm 8mm;
    }

    thead {
      display: table-header-group;
    }

    tr {
      page-break-inside: avoid;
    }
  }
`;

/**
 * Helper to open printable report window with auto-print and clipboard copy
 */
function openReportWindow(title, htmlContent, tableTextForClipboard = '') {
  const printWindow = window.open('', '_blank', 'width=1200,height=900,menubar=no,toolbar=no');
  if (!printWindow) {
    alert('Please allow pop-ups for this website to generate the Executive PDF Report.');
    return;
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="icon" type="image/png" href="/official-logo.png">
      <style>${BASE_STYLES}</style>
    </head>
    <body>
      <div class="action-bar">
        <div class="action-bar-title">
          <span>Official Executive Report</span>
          <span class="action-bar-badge">45th Jubilee Secretariat</span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-gold" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / Save as PDF
          </button>
          <button class="btn btn-outline" id="copyBtn" onclick="copyTableData()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy Table
          </button>
          <button class="btn btn-outline" onclick="window.close()">
            Close
          </button>
        </div>
      </div>

      <div class="report-container">
        ${htmlContent}
      </div>

      <script>
        const tableText = ${JSON.stringify(tableTextForClipboard)};
        function copyTableData() {
          if (!tableText) {
            alert('No table data to copy.');
            return;
          }
          navigator.clipboard.writeText(tableText).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => { btn.innerHTML = originalText; }, 2500);
          }).catch(err => {
            alert('Failed to copy: ' + err);
          });
        }

        // Trigger native print dialog after fonts and logo load
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print();
          }, 350);
        });
      </script>
    </body>
    </html>
  `;

  // Defer document writing to unblock main thread and ensure INP stays under 10ms
  setTimeout(() => {
    try {
      printWindow.document.open();
      printWindow.document.write(fullHtml);
      printWindow.document.close();
    } catch (err) {
      console.error('Error rendering executive report:', err);
    }
  }, 0);
}

/**
 * REPORT 1: Official Alumni Census Directory & Attendance Register
 */
export function generateCensusExecutiveReport(registrations = [], filters = {}) {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const totalRegistered = registrations.length;
  const physicalAttendees = registrations.filter(r => r.attendance_mode === 'PHYSICAL').length;
  const virtualAttendees = registrations.filter(r => r.attendance_mode === 'VIRTUAL').length;
  const checkedInCount = registrations.filter(r => r.checked_in).length;
  const supportPledgers = registrations.filter(r => r.willing_to_support).length;

  const title = `ASF-RSU-45th-Census-Executive-Report-${now.toISOString().slice(0, 10)}`;

  // Tab-delimited text for clipboard copy
  const clipHeaders = ['Reg Tag', 'Full Name', 'Maiden Name', 'Grad Year', 'Cohort Era', 'Department', 'Phone', 'Email', 'City', 'Country', 'Attendance', 'Support Pledge', 'Checked In'];
  const clipRows = registrations.map(r => [
    r.registration_tag || '',
    r.full_name || '',
    r.maiden_name || '',
    r.grad_year || '',
    r.cohort_era || '',
    r.department || '',
    r.phone || '',
    r.email || '',
    r.city || '',
    r.country || '',
    r.attendance_mode || '',
    r.support_pledge || (r.willing_to_support ? 'Pledged' : 'None'),
    r.checked_in ? 'Yes' : 'No'
  ]);
  const tableText = [clipHeaders.join('\t'), ...clipRows.map(row => row.join('\t'))].join('\n');

  const html = `
    <!-- Document Header -->
    <header class="doc-header">
      <div class="doc-header-top">
        <div class="logo-group">
          <img src="/official-logo.png" alt="ASF Logo" class="logo-img" onerror="this.style.display='none'">
          <div>
            <div class="org-title">ADVENTIST STUDENTS' FELLOWSHIP (RSU)</div>
            <div class="org-subtitle">Central Planning Committee • 45th Jubilee Secretariat</div>
          </div>
        </div>
        <div class="doc-meta">
          <div>Report Ref: <strong>ASF45-CENSUS-${now.getFullYear()}</strong></div>
          <div>Generated: <strong>${dateFormatted} at ${timeFormatted}</strong></div>
          <div>Filter Scope: <strong>${filters.filterMode || 'ALL'} Mode • ${filters.filterCheckin || 'ALL'} Status</strong></div>
        </div>
      </div>
      <div class="doc-title-block">
        <h1 class="doc-title">Official Alumni Census Directory &amp; Attendance Register</h1>
        <div class="doc-theme">45th Anniversary Homecoming (1981–2026) • “Rooted to Rise: Honouring our Heritage, Igniting our Future”</div>
      </div>
    </header>

    <!-- Executive Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Registered Alumni</div>
        <div class="metric-value emerald">${totalRegistered.toLocaleString()}</div>
        <div class="metric-desc">Pioneers &amp; Contemporary Sets</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Physical Delegates</div>
        <div class="metric-value gold">${physicalAttendees.toLocaleString()}</div>
        <div class="metric-desc">Arriving Port Harcourt campus</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Global Virtual Delegates</div>
        <div class="metric-value">${virtualAttendees.toLocaleString()}</div>
        <div class="metric-desc">Joining via Live HD Broadcast</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Support Pledges Logged</div>
        <div class="metric-value emerald">${supportPledgers.toLocaleString()}</div>
        <div class="metric-desc">Willing to partner with Jubilee</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Accredited / Checked In</div>
        <div class="metric-value">${checkedInCount.toLocaleString()}</div>
        <div class="metric-desc">Physical badges issued</div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tag</th>
            <th>Alumnus Name</th>
            <th>Class / Era</th>
            <th>Department</th>
            <th>WhatsApp Phone</th>
            <th>Email</th>
            <th>Location</th>
            <th>Attendance</th>
            <th>Support Pledge</th>
            <th>Accredited</th>
          </tr>
        </thead>
        <tbody>
          ${registrations.length === 0 ? `
            <tr>
              <td colspan="11" style="text-align: center; padding: 28px; color: #64748B; font-weight: 600;">
                No alumni registration records found matching the specified criteria.
              </td>
            </tr>
          ` : registrations.map((r, idx) => `
            <tr>
              <td><strong>${idx + 1}</strong></td>
              <td><span class="tag-text">${r.registration_tag || '—'}</span></td>
              <td>
                <strong>${r.full_name || 'Alumnus'}</strong>
                ${r.maiden_name ? `<div style="font-size:9.5px;color:#64748B;">Née: ${r.maiden_name}</div>` : ''}
              </td>
              <td>
                <strong>${r.grad_year ? `Class of ${r.grad_year}` : 'Alumnus'}</strong>
                <div style="font-size:9.5px;color:#64748B;">${r.cohort_era || '—'}</div>
              </td>
              <td>${r.department || '—'}</td>
              <td><span class="phone-text">${r.phone || '—'}</span></td>
              <td>${r.email || '—'}</td>
              <td>${[r.city, r.country].filter(Boolean).join(', ') || '—'}</td>
              <td>
                <span class="badge ${r.attendance_mode === 'PHYSICAL' ? 'badge-physical' : 'badge-virtual'}">
                  ${r.attendance_mode || 'PHYSICAL'}
                </span>
              </td>
              <td>
                ${r.support_pledge ? `<span class="badge badge-pledge">${r.support_pledge}</span>` : (r.willing_to_support ? '<span class="badge badge-pending">Willing</span>' : '<span style="color:#94A3B8;">None</span>')}
              </td>
              <td>
                <span class="badge ${r.checked_in ? 'badge-verified' : 'badge-pending'}">
                  ${r.checked_in ? '✓ Checked In' : 'Pending'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Document Footer -->
    <footer class="doc-footer">
      <div>
        <div class="sign-off">Official Record of the Central Planning Committee (CPC) Secretariat</div>
        <div>Rivers State University, Nkpolu-Oroworukwo, Port Harcourt, Rivers State, Nigeria</div>
      </div>
      <div style="text-align: right;">
        <div>Confidential • For Official Jubilee Committee Administration Only</div>
        <div>Contact Secretariat: <strong>Asfrsu@gmail.com</strong></div>
      </div>
    </footer>
  `;

  openReportWindow(title, html, tableText);
}

/**
 * REPORT 2: Official Financial Sponsorship & Donation Ledger Manifest
 */
export function generateFinancialExecutiveReport(sponsorships = [], filters = {}) {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const totalRaised = sponsorships.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const verifiedCount = sponsorships.filter(s => s.status === 'VERIFIED').length;
  const pendingCount = sponsorships.filter(s => s.status !== 'VERIFIED').length;
  const paystackCount = sponsorships.filter(s => (s.payment_method || '').toLowerCase().includes('paystack')).length;
  const transferCount = sponsorships.filter(s => (s.payment_method || '').toLowerCase().includes('transfer') || (s.payment_method || '').toLowerCase().includes('ecobank')).length;

  const title = `ASF-RSU-45th-Financial-Audit-Manifest-${now.toISOString().slice(0, 10)}`;

  const clipHeaders = ['Reference', 'Donor Name', 'Organization', 'Amount (NGN)', 'Pillar / Category', 'Tier', 'Channel', 'Status', 'Date', 'Notes'];
  const clipRows = sponsorships.map(s => [
    s.reference || '',
    s.donor_name || 'Anonymous',
    s.organization || '',
    s.amount || 0,
    s.sponsorship_type || s.pillar_key || '',
    s.tier_name || '',
    s.payment_method || '',
    s.status || 'VERIFIED',
    s.created_at || '',
    s.notes || ''
  ]);
  const tableText = [clipHeaders.join('\t'), ...clipRows.map(row => row.join('\t'))].join('\n');

  const html = `
    <!-- Document Header -->
    <header class="doc-header">
      <div class="doc-header-top">
        <div class="logo-group">
          <img src="/official-logo.png" alt="ASF Logo" class="logo-img" onerror="this.style.display='none'">
          <div>
            <div class="org-title">ADVENTIST STUDENTS' FELLOWSHIP (RSU)</div>
            <div class="org-subtitle">Central Planning Committee • Finance &amp; Budget Directorate</div>
          </div>
        </div>
        <div class="doc-meta">
          <div>Report Ref: <strong>ASF45-FINANCE-${now.getFullYear()}</strong></div>
          <div>Generated: <strong>${dateFormatted} at ${timeFormatted}</strong></div>
          <div>Reconciliation Account: <strong>ECOBANK • 0570076237</strong></div>
        </div>
      </div>
      <div class="doc-title-block">
        <h1 class="doc-title">45th Jubilee Sponsorship &amp; Financial Audit Manifest</h1>
        <div class="doc-theme">Verified Collections &amp; Online Inflows • “Honouring our Heritage, Igniting our Future”</div>
      </div>
    </header>

    <!-- Executive Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Verified Revenue</div>
        <div class="metric-value gold">₦${totalRaised.toLocaleString()}</div>
        <div class="metric-desc">Total across all pillars &amp; ads</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Transactions</div>
        <div class="metric-value">${sponsorships.length.toLocaleString()}</div>
        <div class="metric-desc">Reconciled contributions</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Cleared &amp; Verified</div>
        <div class="metric-value emerald">${verifiedCount.toLocaleString()}</div>
        <div class="metric-desc">Bank confirmed</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Online (Paystack)</div>
        <div class="metric-value">${paystackCount.toLocaleString()}</div>
        <div class="metric-desc">Instant card/USSD receipts</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Bank Transfers</div>
        <div class="metric-value">${transferCount.toLocaleString()}</div>
        <div class="metric-desc">Direct Ecobank deposits</div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Payment Ref</th>
            <th>Partner / Contributor</th>
            <th>Amount (NGN)</th>
            <th>Pillar / Category</th>
            <th>Sponsorship Tier</th>
            <th>Payment Channel</th>
            <th>Status</th>
            <th>Date Logged</th>
          </tr>
        </thead>
        <tbody>
          ${sponsorships.length === 0 ? `
            <tr>
              <td colspan="10" style="text-align: center; padding: 28px; color: #64748B; font-weight: 600;">
                No financial sponsorship records found matching the specified criteria.
              </td>
            </tr>
          ` : sponsorships.map((s, idx) => `
            <tr>
              <td><strong>${idx + 1}</strong></td>
              <td><span class="tag-text">${s.reference || '—'}</span></td>
              <td>
                <strong>${s.donor_name || 'Anonymous Partner'}</strong>
                ${s.organization ? `<div style="font-size:9.5px;color:#64748B;">Org: ${s.organization}</div>` : ''}
              </td>
              <td><span class="amount-text">₦${Number(s.amount || 0).toLocaleString()}</span></td>
              <td>${s.sponsorship_type || s.pillar_key || 'Celebration'}</td>
              <td><strong>${s.tier_name || 'Standard'}</strong></td>
              <td>${s.payment_method || 'Online'}</td>
              <td>
                <span class="badge ${s.status === 'VERIFIED' ? 'badge-verified' : 'badge-pending'}">
                  ${s.status === 'VERIFIED' ? '✓ Cleared' : 'Pending'}
                </span>
              </td>
              <td style="font-size:9.5px;color:#64748B;">
                ${s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB') : '—'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Document Footer -->
    <footer class="doc-footer">
      <div>
        <div class="sign-off">Official Financial Audit Record • Certified by Finance Committee</div>
        <div>Bank Reconciliation: Ecobank Nigeria | NAAS RSU ALUMNI PROJECT | Acct: 0570076237</div>
      </div>
      <div style="text-align: right;">
        <div>Confidential Audit Schedule • Central Planning Committee</div>
        <div>Secretariat Inquiries: <strong>Asfrsu@gmail.com</strong></div>
      </div>
    </footer>
  `;

  openReportWindow(title, html, tableText);
}

/**
 * REPORT 3: Commemorative Compendium Ad Production & Placement Order
 */
export function generateAdManifestExecutiveReport(adBookings = [], filters = {}) {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const totalAdRevenue = adBookings.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const paidCount = adBookings.filter(a => a.payment_status === 'VERIFIED').length;
  const approvedArtworks = adBookings.filter(a => a.editorial_status === 'APPROVED_FOR_PRINT').length;
  const inReviewArtworks = adBookings.filter(a => a.editorial_status === 'IN_REVIEW' || a.editorial_status === 'RECEIVED').length;

  const title = `ASF-RSU-45th-Compendium-Ads-Production-Manifest-${now.toISOString().slice(0, 10)}`;

  const clipHeaders = ['Booking Ref', 'Advertiser Name', 'Company/Brand', 'Headline', 'Placement Slot', 'Amount (NGN)', 'Payment', 'Editorial Status', 'Assigned Page', 'Phone', 'Email'];
  const clipRows = adBookings.map(a => [
    a.booking_reference || a.reference || '',
    a.advertiser_name || a.donor_name || '',
    a.company_name || a.organization || '',
    a.brand_headline || '',
    a.ad_tier_name || a.tier_name || '',
    a.amount || 0,
    a.payment_status || 'VERIFIED',
    a.editorial_status || 'RECEIVED',
    a.assigned_page_number || 'Unassigned',
    a.phone || '',
    a.email || ''
  ]);
  const tableText = [clipHeaders.join('\t'), ...clipRows.map(row => row.join('\t'))].join('\n');

  const html = `
    <!-- Document Header -->
    <header class="doc-header">
      <div class="doc-header-top">
        <div class="logo-group">
          <img src="/official-logo.png" alt="ASF Logo" class="logo-img" onerror="this.style.display='none'">
          <div>
            <div class="org-title">ADVENTIST STUDENTS' FELLOWSHIP (RSU)</div>
            <div class="org-subtitle">Editorial Committee • 45th Anniversary Commemorative Compendium</div>
          </div>
        </div>
        <div class="doc-meta">
          <div>Manifest Ref: <strong>ASF45-ADS-PROD-${now.getFullYear()}</strong></div>
          <div>Generated: <strong>${dateFormatted} at ${timeFormatted}</strong></div>
          <div>Editorial Lead: <strong>Ekpor Jephta (ekporjephta@gmail.com)</strong></div>
        </div>
      </div>
      <div class="doc-title-block">
        <h1 class="doc-title">Commemorative Compendium Ad Production &amp; Placement Manifest</h1>
        <div class="doc-theme">High-Resolution Color Magazine Page Allocations • Printing &amp; Press Schedule</div>
      </div>
    </header>

    <!-- Executive Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Ad Revenue</div>
        <div class="metric-value gold">₦${totalAdRevenue.toLocaleString()}</div>
        <div class="metric-desc">Magazine sponsorship value</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Booked Placements</div>
        <div class="metric-value">${adBookings.length.toLocaleString()}</div>
        <div class="metric-desc">Ad pages &amp; tribute spreads</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Verified Paid</div>
        <div class="metric-value emerald">${paidCount.toLocaleString()}</div>
        <div class="metric-desc">Cleared for publication</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Approved for Press</div>
        <div class="metric-value emerald">${approvedArtworks.toLocaleString()}</div>
        <div class="metric-desc">Artwork proofs signed off</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Pending / In Review</div>
        <div class="metric-value">${inReviewArtworks.toLocaleString()}</div>
        <div class="metric-desc">Awaiting editorial sign-off</div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ref</th>
            <th>Advertiser / Brand</th>
            <th>Placement Slot</th>
            <th>Amount (NGN)</th>
            <th>Assigned Page</th>
            <th>Editorial Status</th>
            <th>Payment Status</th>
            <th>Contact Phone</th>
            <th>Contact Email</th>
          </tr>
        </thead>
        <tbody>
          ${adBookings.length === 0 ? `
            <tr>
              <td colspan="10" style="text-align: center; padding: 28px; color: #64748B; font-weight: 600;">
                No compendium ad bookings found matching the specified criteria.
              </td>
            </tr>
          ` : adBookings.map((a, idx) => `
            <tr>
              <td><strong>${idx + 1}</strong></td>
              <td><span class="tag-text">${a.booking_reference || a.reference || '—'}</span></td>
              <td>
                <strong>${a.advertiser_name || a.donor_name || 'Valued Advertiser'}</strong>
                ${a.company_name ? `<div style="font-size:9.5px;color:#64748B;">${a.company_name}</div>` : ''}
                ${a.brand_headline ? `<div style="font-size:9.5px;font-style:italic;color:#B45309;">“${a.brand_headline}”</div>` : ''}
              </td>
              <td>
                <strong>${a.ad_tier_name || a.tier_name || 'Standard Slot'}</strong>
                ${a.ad_dimensions ? `<div style="font-size:9.5px;color:#64748B;">${a.ad_dimensions}</div>` : ''}
              </td>
              <td><span class="amount-text">₦${Number(a.amount || 0).toLocaleString()}</span></td>
              <td>
                <span class="badge ${a.assigned_page_number && a.assigned_page_number !== 'Unassigned' ? 'badge-gold' : 'badge-pending'}">
                  ${a.assigned_page_number || 'Unassigned'}
                </span>
              </td>
              <td>
                <span class="badge ${a.editorial_status === 'APPROVED_FOR_PRINT' ? 'badge-verified' : 'badge-pending'}">
                  ${(a.editorial_status || 'RECEIVED').replace(/_/g, ' ')}
                </span>
              </td>
              <td>
                <span class="badge ${a.payment_status === 'VERIFIED' ? 'badge-verified' : 'badge-pending'}">
                  ${a.payment_status || 'VERIFIED'}
                </span>
              </td>
              <td><span class="phone-text">${a.phone || '—'}</span></td>
              <td>${a.email || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Document Footer -->
    <footer class="doc-footer">
      <div>
        <div class="sign-off">Editorial &amp; Publication Directorate • 45th Jubilee Souvenir Compendium</div>
        <div>Press Dispatch Coordinator: Ekpor Jephta | ekporjephta@gmail.com</div>
      </div>
      <div style="text-align: right;">
        <div>Official Production Order • Rivers State University, Port Harcourt</div>
        <div>Secretariat Inquiries: <strong>Asfrsu@gmail.com</strong></div>
      </div>
    </footer>
  `;

  openReportWindow(title, html, tableText);
}
