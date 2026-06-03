export const config = { runtime: 'edge' };

const TO_EMAIL = 'collin@dabl.club';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'contact@agentic-engineering.com';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uflkltmvzvhziysheccd.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  // Honeypot: real users leave this hidden field empty.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return json(200, { ok: true });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || name.length > 200) return json(400, { error: 'invalid_name' });
  if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'invalid_email' });
  }
  if (!message || message.length > 5000) return json(400, { error: 'invalid_message' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json(500, { error: 'email_not_configured' });

  // Best-effort persist to Supabase. We don't fail the request if this errors —
  // the email is the system of record; Supabase is for the /admin/contacts/ view.
  if (SUPABASE_ANON_KEY) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const ua = req.headers.get('user-agent') || null;
    fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ name, email, message, ip, user_agent: ua }),
    }).catch(() => {});
  }

  const subject = `[agentic-engineering] Contact from ${name}`;
  const text =
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `\n${message}\n`;
  const html =
    `<p><strong>Name:</strong> ${escapeHtml(name)}<br>` +
    `<strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>` +
    `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    return json(502, { error: 'email_send_failed', detail: detail.slice(0, 500) });
  }

  return json(200, { ok: true });
}
