# Astro Migration (v1.4)

**Status:** Scaffold + design tokens + 3 sample pages in place. Bash build is still the production pipeline.

## How the two builds coexist on this branch

This branch (`claude/v1.4-astro-design`) is the **only** place where the legacy bash build and the new Astro setup live next to each other. `main` continues to ship only the bash build until the flip.

| Command | Pipeline | Output | Deployed to Vercel? |
|---------|----------|--------|---------------------|
| `npm run build` | bash (`build.sh`) | `index.html` at repo root | Yes (current `vercel.json`) |
| `npm run build:legacy` | bash (`build.sh`) | `index.html` at repo root | Same as above (alias) |
| `npm run astro:dev` | Astro dev server | in-memory | No |
| `npm run astro:build` | Astro static build | `dist/` | No (yet) |
| `npm run astro:preview` | Astro preview server | serves `dist/` | No |

**Why both?** Per PR #28 postmortem and PLAN.md hand-off notes: develop Astro behind a Vercel preview for the full migration, only flip `vercel.json` at the merge commit, after the Astro preview matches production page-for-page.

**Cardinal rule (PR #28):** Do NOT create a parallel `docs/` Starlight site. Astro replaces the bash build at the repo root — eventually. There is one site, one deploy.

## What ships in v1.4 (this PR / release)

- `astro.config.mjs`, `tsconfig.json`, updated `package.json` with Astro deps + `astro:*` scripts (legacy `build` script preserved).
- `src/content/config.ts` Zod schema for the content collection.
- Design-token CSS split:
  - `src/styles/tokens.css` — light + dark color palettes, spacing/type/radius/shadow scales.
  - `src/styles/base.css` — reset + body + heading defaults.
  - `src/styles/prose.css` — `.prose` (70ch), `.full-bleed` escape hatch.
  - `src/styles/components.css` — `.sidebar`, `.topbar`, `.callout`, `.kbd`, `.badge`, `.toc-rail`.
- `src/layouts/Doc.astro` — page layout with topbar, sidebar, prose container, right-rail TOC.
- Components: `Sidebar.astro`, `TocRail.astro`, `ThemeToggle.astro`, `Callout.astro`, `CodeBlock.astro`.
- `src/pages/[...slug].astro` — catch-all router for the content collection.
- `src/pages/index.astro` — landing page.
- Three migrated content pages with proper YAML frontmatter: `index.md`, `patterns.md`, `approaches.md` (converted from `<!-- description: -->` HTML comments).

## What's deferred to follow-up agents (PLAN.md acceptance criteria not yet met)

- **Bulk-migrate remaining 19 content pages** — `<!-- description: -->` comments need to become YAML frontmatter with `title`, `description`, `group`, `order`. Schema is already in place.
- **Flip `vercel.json`** to `{"buildCommand": "astro build", "outputDirectory": "dist", "framework": "astro", "cleanUrls": true}`. Only do this on the merge commit.
- **Delete `build.sh`, root `index.html`, the in-memory search-index code in `js/main.js`** — once Astro is the source of truth.
- **Hash → clean-URL redirects** for `/#patterns` style legacy URLs. Strategy options:
  1. Add Vercel rewrites in `vercel.json` for each known slug.
  2. Inline a tiny `<script>` in `Doc.astro` that reads `location.hash` and `history.replaceState`s to the clean URL.
  Recommended: option 2, because hash URLs are client-side only and the existing SPA used them as the primary routing mechanism. A scaffolded `public/_redirects` is a fallback if we later swap hosts.
- **Read-time badge** under H1 — `reading-time` is in `devDependencies`; add a remark plugin or compute in the layout from collection `entry.body`.
- **Pagefind search** — defer to v2.0 per PLAN.md "Out of Scope".
- **Mobile TOC sheet** — carry-over from v1.1 (`<details>` works at tablet; mobile bottom-sheet is a follow-up).
- **`<Card>`, `<Tabs>`, `<Disclosure>` primitives** — only `<Callout>`, `<Kbd>` (CSS), `<Badge>` (CSS), and `<CodeBlock>` shipped this round.

## Verification done in this release

- `npm install` (see release report for outcome).
- `npm run astro:build` (see release report for outcome).

## Verification still owed before merge

- 5-page visual diff vs production.
- Lighthouse ≥95.
- 10 hash-URL curl checks.
- Theme toggle: system-default first load, persists across refresh.
