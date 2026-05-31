<!-- description: v1.4 release plan — Astro migration and design system. Worktree: ../wt-v1.4-astro-design, branch: claude/v1.4-astro-design. -->


> **Picked up this worktree?** The full v2 roadmap and all 5 PM council reports live on branch `claude/fix-toc-mobile-design-AzN22` in the `roadmap/` directory of the main repo at `/home/user/agentic-engineering/roadmap/`. Read [`ROADMAP-V2.md`](https://github.com/opencolin/agentic-engineering/blob/claude/fix-toc-mobile-design-AzN22/ROADMAP-V2.md) for context. Council references cited below resolve there.

# v1.4 — Astro Migration + Design System

**Worktree:** `../wt-v1.4-astro-design`
**Branch:** `claude/v1.4-astro-design`
**Estimated effort:** 2 weeks
**Depends on:** v1.3 merged (so we migrate a stable content set, not a moving target)

---

## Goal

Replace `build.sh` with Astro. Same URLs, same look at flip-time, but proper static site under the hood. Then layer in design tokens, Shiki highlighting, light/dark, prose width tuning. **One site, one build, one deploy** — never reintroduce a parallel docs site.

## Acceptance Criteria

### Migration
- [ ] `astro.config.mjs` at repo root.
- [ ] `package.json` declares Astro + content collection deps. `npm install && npm run build` works locally.
- [ ] Content collection points at existing `content/` directory; Zod schema validates frontmatter (`title`, `description`, `group`, `order`, `lastVerified` optional, `staleBy` optional).
- [ ] Existing `<!-- description: -->` comments migrated to real YAML frontmatter as part of this release. Existing `content/manifest.json` deprecated in favor of frontmatter-driven sidebar.
- [ ] `vercel.json` flipped to `{"buildCommand": "astro build", "outputDirectory": "dist", "framework": "astro", "cleanUrls": true}`.
- [ ] Every existing route (clean URL and hash) still resolves to the same page. Hash redirects implemented as `<script>` in the layout or via Vercel rewrites.
- [ ] `build.sh` deleted. Heredoc sidebar deleted. `js/main.js` shrunk to ≤60 LOC (sidebar drawer + theme toggle).
- [ ] `index.html` removed from repo (now generated into `dist/`).
- [ ] `docs/` confirmed absent (delete if reintroduced).

### Design system
- [ ] CSS split: `src/styles/tokens.css`, `base.css`, `prose.css`, `components.css`.
- [ ] Light + dark tokens per [PM #3 §4](../council/pm3-design-mobile.md) implemented.
- [ ] `prefers-color-scheme` default; theme toggle in topbar; `localStorage` persistence.
- [ ] Prose width drops to ~70ch; `.full-bleed` wrapper class allows tables/code to break wider.
- [ ] Shiki syntax highlighting at build time with theme `vesper` (or `github-dark-dimmed`).
- [ ] Code-block component renders language label + copy button (component, not JS injection).
- [ ] Per-page TOC becomes an Astro component (replaces v1.1 JS implementation).
- [ ] Read-time badge under each H1, computed at build (`Math.round(wordCount / 220)` min).
- [ ] Heading anchors (`<a class="header-anchor">#</a>`) injected via rehype plugin.

### Component primitives
- [ ] `<Callout type="note|tip|warning|danger">`
- [ ] `<Card>`, `<Kbd>`, `<Badge>`, `<Tabs>`, `<Disclosure>`

## Files to Touch

| Area | Files |
|------|-------|
| Framework | `astro.config.mjs`, `package.json`, `tsconfig.json` |
| Layouts | `src/layouts/Doc.astro`, `src/components/Sidebar.astro`, `src/components/TocRail.astro`, `src/components/ThemeToggle.astro` |
| Content | `src/content/config.ts` (Zod schema), `content/*.md` (add YAML frontmatter) |
| Styles | `src/styles/tokens.css`, `base.css`, `prose.css`, `components.css` |
| Build artifacts removed | `build.sh`, `index.html`, the in-memory search index code in old `main.js` |
| Vercel | `vercel.json` |
| Redirects | `public/_redirects` or in-layout hash redirector |

## Out of Scope

- Killer features (v2.0) — Astro migration must ship cleanly first.
- Search (v2.0 will wire Pagefind after migration).
- New content (covered by v1.3 and post-v2 cycles).

## Verification

1. `npm run build` produces a `dist/` with one HTML file per page.
2. `wc -l src/styles/*.css js/main.js` shows the LOC-shrink claim.
3. Visual diff: 5 randomly-chosen pages on the Vercel preview compared to current production look — no regression (or expressly-intended improvements).
4. Theme toggle works; system-default preferred on first load; persists across refreshes.
5. Curl 10 old hash URLs (e.g., `/#patterns`); each ends up rendering `/patterns/`.
6. Lighthouse Performance ≥ 95 (up from current SPA score).
7. Existing SEO from v1.2 preserved or improved (per-page `<title>` + OG still rendered, now even more correctly because they're framework-native).

## Hand-off Notes

This is the highest-risk release. Strategy: migrate behind a Vercel preview branch for the full 2 weeks; only flip `vercel.json` to Astro on the merge commit, after the preview matches production page-for-page. Keep `build.sh` runnable on `main` until merge.

The cardinal rule from PR #28: **don't create a parallel site** during the migration. Develop in-place on the branch; `build.sh` and the Astro setup co-exist temporarily *only on this branch*, never on main.

Council reference: [`roadmap/council/pm2-build-platform.md`](../council/pm2-build-platform.md) §2, §3 R2-R3, [`roadmap/council/pm3-design-mobile.md`](../council/pm3-design-mobile.md) §4, §5 Tier 2-3.
