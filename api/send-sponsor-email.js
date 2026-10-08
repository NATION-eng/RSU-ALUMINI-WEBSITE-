// Vercel Serverless Function: Secure Email Dispatch via Resend
// Keeps RESEND_API_KEY secret on the server - never exposed to client browsers

export default async function handler(req, res) {
  // Set CORS headers for security and preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { to, subject, html, replyTo, recipientName } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: "Missing recipient email 'to'" });
    }

    // Secret server-side API key (does NOT require VITE_ prefix)
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'RESEND_API_KEY is not configured in Vercel Environment Variables.' 
      });
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'NAAS RSU 45th Jubilee <onboarding@resend.dev>';
    const recipientList = Array.isArray(to) ? to : [to.trim()];

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        from: fromAddress,
        reply_to: replyTo || 'Asfrsu@gmail.com',
        to: recipientList,
        subject: subject || 'Official Acknowledgment: 45th Jubilee Sponsorship',
        html: html
      })
    });

    const data = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      return res.status(resendResponse.status).json({
        success: false,
        statusCode: resendResponse.status,
        message: data.message || `Resend HTTP error ${resendResponse.status}`,
        data
      });
    }

    return res.status(200).json({
      success: true,
      provider: 'resend',
      id: data.id,
      data
    });
  } catch (error) {
    console.error('Serverless email error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error dispatching email'
    });
  }
}
