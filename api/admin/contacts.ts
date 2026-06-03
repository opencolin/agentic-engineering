export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uflkltmvzvhziysheccd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const COOKIE_NAME = 'admin_auth';

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) return false;
  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);
  let diff = 0;
  for (let i = 0; i < aBuf.length; i++) diff |= aBuf[i] ^ bBuf[i];
  return diff === 0;
}

export default async function handler(req: Request) {
  if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
  if (!ADMIN_PASSWORD) return json(500, { error: 'admin_not_configured' });
  if (!SUPABASE_SERVICE_ROLE_KEY) return json(500, { error: 'db_not_configured' });

  const cookie = readCookie(req, COOKIE_NAME);
  if (!cookie || !(await timingSafeEqual(cookie, ADMIN_PASSWORD))) {
    return json(401, { error: 'unauthorized' });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 500);

  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/contact_submissions?select=id,created_at,name,email,message,ip&order=created_at.desc&limit=${limit}`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    return json(502, { error: 'db_query_failed', detail: detail.slice(0, 500) });
  }

  const rows = await resp.json();
  return json(200, { rows });
}
