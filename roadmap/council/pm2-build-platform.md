<!-- description: PM Council Report #2 — Build system, platform & DX lens for v2 of agentic-engineering. -->

# PM #2 — Build, Platform & DX

**Lens:** How we build, deploy, and contribute.
**Author:** PM Council subagent (general-purpose), `agentId: ad98ddebcf2df728d`
**Status:** Read-only research; no files modified.

---

## 1. Status-quo Audit — 5 Worst Pain Points

1. **Dual-source-of-truth slug list.** `build.sh:86` hardcodes the slug loop AND `index.html` heredoc (`build.sh:37-68`) hand-codes the sidebar. Drift = silent 404s.
2. **No build validation at all.** `build.sh` is ~100 lines of `cat`/`for`/`sed`. Missing file → `sed` errors but build still exits 0. Malformed frontmatter, broken `[link](other.md)` refs, dead anchors — none caught.
3. **Everything ships every page-load.** `index.html` is 5,000+ lines because all 23 markdown pages are inlined as `<script type="text/markdown">`. Reader of `inference.md` downloads `who-is-who.md` too. No code-splitting, no per-page CDN caching.
4. **Client-only rendering = bad SEO + slow FCP.** `js/main.js:63` calls `marked.parse(md)` at runtime after waiting for marked.js CDN. Googlebot sees `<p class="loading">Loading...</p>`. No prerendered HTML, no `<meta>` per page, no OG tags per slug.
5. **Custom marked.js + ad-hoc SPA router reinventing a framework badly.** ~300 LOC of bespoke heading-slugger, link-rewriter, search index — competing with battle-tested static-site tooling. Non-standard `#page:fragment` hash scheme breaks external deep-linking.

## 2. v2 Platform Decision — **Astro (no Starlight theme)**

Pick **Astro** with a thin custom layout, content via `@astrojs/content` collections, MDX optional. **Single site, deployed from repo root.**

Trade-offs:
- **(+)** Static HTML per page (SEO, fast FCP, per-page CDN), keeps `.md` authoring, supports islands if needed, zero-config Vercel deploy. Deletes `build.sh`, the inlining hack, and ~200 LOC of `main.js`.
- **(+)** Content collections give schema-validated frontmatter (catches silent `<!-- description: -->` failure), auto sidebar from filesystem, integrates Pagefind out of the box.
- **(–)** Adds Node toolchain + `node_modules`; first-time contributors need `npm install`. Mitigation: Vercel handles CI builds; locally `npm run dev` is the only command.

Why not the alternatives:
- **Starlight** — already burned us once (parallel `docs/` site, deleted in PR #28). Opinionated theme fights our dark aesthetic.
- **Next.js + MDX** — overkill; React runtime ships to clients for no reason; framework churn.
- **Docusaurus** — heavy React shell, opinionated theme, slower builds.

The lesson from PR #28 is **one site, one build, one deploy**. Astro replaces `build.sh` — it doesn't sit beside it.

## 3. Incremental Upgrade Path — 3 Shippable Releases

**R1 — "Generate, don't hand-code" (still bash, no framework)**
- Replace heredoc sidebar + hardcoded slug loop with `for f in content/*.md` deriving slugs from filenames; sidebar grouping read from single `content/_nav.json`.
- Add `scripts/check-links.sh` (grep `](`*.md` refs, fail if target missing).
- Delete stale `docs/` directory if still present.
- Outcome: adding a page = drop `.md` + one JSON line. Live site identical. **Risk: zero.**

**R2 — "Astro in place, same URLs, same look"**
- Add `astro.config.mjs` at repo root, port `css/style.css` verbatim into Astro layout, content collection points at existing `content/`.
- Generate `/inference/`, `/patterns/`, etc. as real static pages. Add hash redirects (`#inference` → `/inference/`) for backward compat.
- Flip `vercel.json` to `{"buildCommand": "astro build", "outputDirectory": "dist", "framework": "astro"}`.
- Outcome: same URLs work, SEO real, per-page payloads, CSS unchanged. **Risk: medium; gate behind Vercel preview.**

**R3 — "Use the framework"**
- Frontmatter schema via Zod (title, description, group, order) — replaces `_nav.json`.
- Add Pagefind for search, replacing in-memory index in `main.js:225-294`.
- MDX where useful (comparison tables), syntax highlighting via Shiki, TOC component.
- Outcome: `main.js` shrinks to ~50 LOC of UI polish.

## 4. DX Wins Under 1 Day Each

1. **Auto-sidebar from `content/_nav.json`** (R1 above).
2. **`scripts/check-links.sh` in `.github/workflows/ci.yml`** — fail PR on broken `.md` link / missing slug.
3. **Prettier + markdownlint pre-commit hook** via `lefthook` — consistent headings, no trailing whitespace, table formatting normalized.
4. **`bash build.sh --check` mode** that diffs generated `index.html` against committed copy and fails CI if out of sync.
5. **Vercel preview comment bot + `.github/CODEOWNERS`** — every PR gets a preview URL; content folders auto-assign reviewers.

## 5. Search — **Pagefind**

Static, built at deploy time, ~100KB index lazy-loaded only on first keystroke, zero hosting cost, zero account, works offline, ships native UI we can restyle to match `.topbar-search`. Beats the current in-memory index (which ships full content of all pages to every visitor). Algolia DocSearch needs an account + crawler + has gotten flaky for small OSS sites; Orama is fine but Pagefind has better Astro integration and smaller bundles.
