#!/usr/bin/env node
// Smoke driver for the agentic-engineering / automate.engineering site.
// Drives a headless Chromium against an already-running static server,
// captures screenshots into /tmp/shots/, and reports any console errors.
//
// Usage:
//   node .claude/skills/run-agentic-engineering/smoke.mjs [base-url] [out-dir]
//   defaults:  base-url=http://127.0.0.1:8080  out-dir=/tmp/shots
//
// The site is static + serverless. This driver covers the static surface
// (home, /events/, /contact/) plus the theme toggle. It does NOT exercise
// the /api/contact or /api/admin/* endpoints — those need `vercel dev` and
// real env vars (RESEND_API_KEY, SUPABASE_*, ADMIN_PASSWORD); document those
// in SKILL.md if/when an agent needs them.
//
// Exit code is the number of console errors observed across all pages.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Playwright is installed at the global npm root; ESM resolution doesn't
// honor NODE_PATH, so resolve via createRequire then import the ESM entry
// by file URL (the CJS index.js doesn't surface named exports correctly).
// If your environment has playwright in node_modules, swap this for a
// plain `import { chromium } from 'playwright'`.
const globalRoot = process.env.GLOBAL_NODE_MODULES || '/opt/node22/lib/node_modules';
const req = createRequire(import.meta.url);
const pwDir = req.resolve('playwright/package.json', { paths: [globalRoot] })
  .replace(/\/package\.json$/, '');
const { chromium } = await import(pathToFileURL(`${pwDir}/index.mjs`).href);

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const OUT  = process.argv[3] || '/tmp/shots';
mkdirSync(OUT, { recursive: true });

const errors = [];
const log = (...a) => console.log('[smoke]', ...a);

// --ignore-certificate-errors lets the page fetch its CDN deps (marked,
// Leaflet, Google Fonts) through this container's TLS-intercepting proxy.
const browser = await chromium.launch({
  args: ['--no-sandbox', '--ignore-certificate-errors'],
});
// Force dark color scheme so the initial paint is dark (early-init reads
// prefers-color-scheme); then the toggle test goes dark → light deterministically.
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: 'dark',
  ignoreHTTPSErrors: true,
});
const page = await ctx.newPage();

page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

async function shot(name) {
  const p = join(OUT, `${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  log('shot', p);
}

// 1. Home — dark theme is default
log('nav', BASE);
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.topbar-brand');
// markdown content is loaded async; wait for it to render
await page.waitForFunction(() => !document.querySelector('.loading'));
await shot('home-dark');

// 2. Toggle theme to light
await page.locator('.theme-toggle').first().click();
await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
await shot('home-light');

// 3. Events page
log('nav', `${BASE}/events/`);
await page.goto(`${BASE}/events/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#events-map');
// give Leaflet a beat to render tiles
await page.waitForTimeout(1500);
await shot('events');

// 4. Contact page
log('nav', `${BASE}/contact/`);
await page.goto(`${BASE}/contact/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#contact-form');
await shot('contact');

// 5. Search interaction on home — proves JS wired up
log('nav', BASE);
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !document.querySelector('.loading'));
await page.fill('#search-input', 'sandbox');
await page.waitForSelector('#search-results a', { timeout: 3000 });
await shot('home-search');

await browser.close();

writeFileSync(join(OUT, 'smoke.log'), errors.join('\n') + '\n');
if (errors.length) {
  log(`FAIL — ${errors.length} console error(s):`);
  errors.forEach(e => console.error('  ' + e));
  process.exit(errors.length);
}
log('OK — 5 screenshots written to', OUT);
