export const config = { runtime: 'edge' };

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const COOKIE_NAME = 'admin_auth';
const MAX_AGE = 60 * 60 * 12; // 12 hours

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
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
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!ADMIN_PASSWORD) return json(500, { error: 'admin_not_configured' });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'invalid_json' });
  }
  const submitted = typeof body.password === 'string' ? body.password : '';
  if (!(await timingSafeEqual(submitted, ADMIN_PASSWORD))) {
    return json(401, { error: 'invalid_password' });
  }

  const cookie = `${COOKIE_NAME}=${encodeURIComponent(ADMIN_PASSWORD)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
  return json(200, { ok: true }, { 'Set-Cookie': cookie });
}
