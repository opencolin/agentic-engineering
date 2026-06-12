---
name: run-agentic-engineering
description: Build, run, and drive the agentic-engineering / automate.engineering site. Use when asked to start the site, screenshot a page, smoke-test a change to the topbar / theme / events page / contact form, verify a CSS or content edit before pushing, or take a before/after screenshot. Static site (HTML/CSS/JS) built by build.sh; driver is .claude/skills/run-agentic-engineering/smoke.mjs (Playwright Chromium against a local http-server).
---

# Running and driving the site

This repo is the **automate.engineering** static reference site (and its three sibling pages: `/events/`, `/contact/`, `/admin/contacts/`). Everything ships as plain HTML/CSS/JS served from the repo root by Vercel. The agent path is:

1. `bash build.sh` to regenerate `index.html` from `content/*.md`
2. `http-server` (already global) to serve the repo
3. `node .claude/skills/run-agentic-engineering/smoke.mjs` — a Playwright Chromium driver that screenshots home (dark + light), `/events/`, `/contact/`, and a search interaction

All paths below are relative to the repo root.

## Prerequisites

Everything needed is preinstalled in this container — `node@22`, global `http-server`, global `playwright@1.56` with Chromium at `/opt/pw-browsers/chromium-1194`. No `apt-get` needed.

On a fresh container, install the Playwright Chromium deps and the browser:

```bash
sudo apt-get update
sudo apt-get install -y libnss3 libgbm1 libasound2t64 libgtk-3-0 \
  libxss1 libxkbcommon0 libatk-bridge2.0-0 libcups2 libdrm2
npm install -g playwright@1.56 http-server@14
npx playwright install chromium
```

Verify:

```bash
which http-server                                       # → /opt/node22/bin/http-server
ls /opt/node22/lib/node_modules/playwright/index.mjs    # exists
ls /opt/pw-browsers/chromium-1194                       # exists
```

## Build

```bash
bash build.sh
```

Regenerates `index.html` by inlining every `content/*.md` page as a `<script type="text/markdown">` tag. `index.html` is a **generated artifact** — never hand-edit it; edit `build.sh` (for the HTML scaffold) or `content/*.md` (for the body) and re-run.

## Run (agent path)

Start the static server detached, then run the smoke driver:

```bash
pkill -f "http-server" 2>/dev/null; sleep 0.5
setsid http-server -p 8080 -c-1 -s . </dev/null >/tmp/http.log 2>&1 &
timeout 10 bash -c 'until curl -sf http://127.0.0.1:8080/ >/dev/null; do sleep 0.2; done'

node .claude/skills/run-agentic-engineering/smoke.mjs
```

Stop the server when done:

```bash
pkill -f "http-server.*8080"
```

The smoke driver writes 5 PNGs to `/tmp/shots/` (override with `node smoke.mjs http://127.0.0.1:8080 /your/dir`):

| file | what it captures |
|---|---|
| `home-dark.png` | `/` in dark mode (default + forced `colorScheme: dark` for determinism) |
| `home-light.png` | `/` after clicking the theme toggle once |
| `events.png` | `/events/` with the Leaflet NASA-tile map and the upcoming-events sidebar |
| `contact.png` | `/contact/` form in light mode (theme persists across pages) |
| `home-search.png` | `/` with "sandbox" typed into the search box, results dropdown visible |

Exit code = number of console errors observed. A clean run exits `0` and writes an empty `/tmp/shots/smoke.log`.

### Driving a specific change

For an iterative loop on one page, copy the driver and trim it:

```bash
cp .claude/skills/run-agentic-engineering/smoke.mjs /tmp/probe.mjs
# edit /tmp/probe.mjs — keep only the nav+screenshot for the page you changed
node /tmp/probe.mjs http://127.0.0.1:8080 /tmp/shots
```

The driver is plain Playwright — `page.locator(...)`, `page.click(...)`, `page.fill(...)`, `page.evaluate(...)` all work; reach for the [Playwright docs](https://playwright.dev/docs/api/class-page) when you need more.

## Run (human path)

```bash
http-server -p 8080 -c-1 -s .   # → serves on :8080, Ctrl-C to stop
```

Or for the serverless API routes (`/api/contact`, `/api/admin/*`):

```bash
npx vercel dev   # requires RESEND_API_KEY, SUPABASE_*, ADMIN_PASSWORD env vars
```

The smoke driver **does not** exercise the API routes — they need Vercel's dev runtime and real env vars. If you're touching `api/contact.ts` or `api/admin/*`, document the env-setup separately and `curl` the routes directly; the screenshot driver isn't the right tool.

## Test

There's no test suite in this repo. Verification is the smoke driver above plus eyeballing the screenshots.

## Gotchas

- **`index.html` is generated.** Edit `build.sh` (HTML scaffold) or `content/*.md` (body); re-run `bash build.sh`; commit both the source and the regenerated `index.html` because `vercel.json` has `"buildCommand": null` (Vercel serves the committed artifact, doesn't rebuild).
- **CDN deps are required at runtime.** `marked.min.js` (jsdelivr), Leaflet (unpkg), Google Fonts. `js/main.js` retries `init` every 50ms until `marked` is defined; if the CDN is blocked, the page sits on "Loading…" forever and `.loading` never disappears. The driver works around this with `--ignore-certificate-errors` + `ignoreHTTPSErrors: true` (this container has a TLS-intercepting proxy that breaks the default cert chain).
- **Theme is `prefers-color-scheme` + localStorage.** The smoke driver pins `colorScheme: 'dark'` on the Playwright context so the initial paint is always dark and the toggle flips to light deterministically. Without that pin, headless Chromium defaults to light and the `waitForFunction(() => dataset.theme === 'light')` after the click never fires (it was already light).
- **http-server dies on the Bash session ending.** Launch it with `setsid … </dev/null >log 2>&1 &` or `nohup … & disown` — plain `&` lets the parent bash exit reap it.
- **Playwright is at the global npm root.** `import 'playwright'` fails from `.mjs` files outside `node_modules`. The driver resolves the package via `createRequire(...).resolve('playwright/package.json', { paths: [globalRoot] })`, then imports `index.mjs` by file URL — the CJS `index.js` resolved by default doesn't surface `chromium` as a named ESM export.
- **Leaflet needs ~1.5s after `domcontentloaded` to render tiles.** The driver uses `waitForTimeout(1500)` here because there's no clean readiness event; if you tighten this you'll get a blank or half-rendered map in `events.png`.
- **Sidebar Events link was moved to the topbar** (PR #43). If a future agent sees an "Events" entry in the sidebar's Community section, the change reverted.

## Troubleshooting

- **`Cannot find package 'playwright'`** — you ran the driver from a directory whose ancestors don't have `playwright` in `node_modules`. The driver auto-resolves from `/opt/node22/lib/node_modules`; if your env uses a different global root, override: `GLOBAL_NODE_MODULES=/path/to/global node smoke.mjs`.
- **`page.waitForFunction` times out on `dataset.theme === 'light'`** — the page started in light mode (probably because `colorScheme` wasn't forced). Verify the context options include `colorScheme: 'dark'`.
- **Screenshots show `Loading…` and nothing else** — `marked` CDN didn't load. Confirm `curl -sI -m 5 https://cdn.jsdelivr.net/npm/marked/marked.min.js` returns 200; if it's a cert error, the driver's `--ignore-certificate-errors` flag is missing.
- **`EADDRINUSE :::8080`** — previous `http-server` still alive. `pkill -f "http-server.*8080"` and relaunch.
- **`events.png` looks blank or shows only the sidebar** — Leaflet tile load is async; the 1500ms wait isn't enough on a slow network. Bump the timeout in the driver.
- **No screenshots written, exit code non-zero, smoke.log has console errors** — read `/tmp/shots/smoke.log` for the exact messages; the driver pipes `pageerror` and `console.error` events into it.
