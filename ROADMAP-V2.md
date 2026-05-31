<!-- description: Master v2 roadmap for the agentic-engineering reference site — synthesized from a 5-PM council. Planning only; no code changes. -->

# Roadmap to v2

> **Status:** Planning artifact. No site code is changed by this roadmap — execution happens in dedicated worktrees/branches per release.
> **Authored by:** A 5-PM council (Content/IA, Build/Platform, Design/Mobile, Distribution/Community, Positioning/Editorial). Full reports in [`roadmap/council/`](roadmap/council/).
> **Owner:** opencolin · **Live site:** https://agentic-engineering.vercel.app

---

## TL;DR

Five shippable releases get the site from today's hand-rolled SPA reference to a v2 launch where every page ends in a decision, every page is its own real URL, and the killer feature is an interactive **Pick Your Agent Stack** tree.

| Release | Theme | Branch | Worktree (planned) | Ships |
|---------|-------|--------|--------------------|-------|
| **v1.1** | TOC & Mobile Polish | `claude/fix-toc-mobile-design-AzN22` | `../wt-v1.1-toc-mobile` | Scroll-spy/anchor fixes, accessible drawer, copy-link headings, code-copy buttons |
| **v1.2** | Discovery & Build Hygiene | `claude/v1.2-discovery-build` | `../wt-v1.2-discovery-build` | `content/manifest.json`, OG/Twitter cards, sitemap, robots, 404, link checker in CI |
| **v1.3** | Operate Cluster + Rename | `claude/v1.3-operate-rename` | `../wt-v1.3-operate-rename` | `observability.md`, `safety.md`, `cost-economics.md`; rename Approaches → Coding Agents |
| **v1.4** | Astro Migration + Design System | `claude/v1.4-astro-design` | `../wt-v1.4-astro-design` | Astro replaces `build.sh`, per-page static HTML, design tokens, Shiki, light/dark, per-page TOC |
| **v2.0** | Killer Features + Launch | `claude/v2.0-launch` | `../wt-v2.0-launch` | Pick-Your-Stack decision tree, interactive comparison matrix, Pagefind search, Buttondown newsletter, GitHub Discussions, full IA reshuffle, Quarterly Report v1, launch post |

Each release is independently shippable; **never two parallel sites** (the lesson of PR #28). Releases proceed in order — earlier work strictly enables later work.

---

## How the Council Voted

| Theme | PM #1 (Content) | PM #2 (Build) | PM #3 (Design) | PM #4 (Distribution) | PM #5 (Editorial) |
|-------|-----------------|---------------|----------------|----------------------|-------------------|
| Biggest single risk | `approaches.md` is 95KB | Dual-source slug list silently 404s | No per-page TOC | Zero discovery surface | "Awesome-list sprawl" without decisions |
| Top v2 bet | Operate cluster (observability/safety/cost) | Move to Astro | Auto per-page TOC + design tokens | Per-page HTML + OG + RSS | Pick-Your-Stack decision tree |
| Cut/deprecate | `comparison.md` (anemic) | `docs/` (already gone) | Dark-only theme | Hash-based routing for crawlers | `comparison.md`, `organizations.md`, long tail of `approaches.md` |
| One-tool pick | Rename Approaches → Coding Agents | Pagefind for search | Shiki for highlighting | Buttondown for newsletter; GitHub Discussions over Discord | Primary-source interview moat |

Convergence: **(a)** the build pipeline must stop being two sources of truth; **(b)** content needs a verification/operate layer; **(c)** the site needs to be crawlable per-page; **(d)** the moat is curation × primary-source relationships, not breadth.

---

## Release Plan

### v1.1 — TOC & Mobile Polish (≈1 week)

**Goal:** Make today's site usable on phones and inside long pages, without changing the build.

Deliverables (all CSS/JS, no new framework):
- Mobile drawer: scrim, body-scroll lock, `Escape`/scrim-tap close, `aria-expanded`, focus trap, `100dvh` not `100vh`.
- 44×44px tap targets; hamburger hit area widened.
- `scroll-margin-top: calc(var(--topbar-height) + 1rem)` on all `.markdown-body h1,h2,h3,h4`.
- Hover `#` anchor on every heading → copy permalink to clipboard.
- Code-block copy button + language label.
- Tone down inline-code color to neutral (`--bg-muted`).
- Per-page TOC (auto-generated from current page's H2/H3) — right-rail desktop, `<details>` tablet, bottom-sheet mobile, scroll-spy via `IntersectionObserver`.
- Sidebar sub-section active state synced with scroll-spy.

**Plan:** [`roadmap/releases/v1.1-toc-mobile.md`](roadmap/releases/v1.1-toc-mobile.md)
**Worktree branch:** `claude/fix-toc-mobile-design-AzN22` (already the active branch for this planning round; future execution agent can reset/rebase as needed).

---

### v1.2 — Discovery Surface + Build Hygiene (≈1 week)

**Goal:** Make the site linkable on social, indexable by Google, and safe to add pages without breaking the sidebar.

Deliverables:
- `content/manifest.json` becomes the single source of truth for slug + title + group + order. `build.sh` and the sidebar both read it. Adding a page = one markdown file + one JSON line.
- Per-page real HTML output (still bash-built): `/approaches/`, `/patterns/`, `/inference/`, etc. Hash routing kept as progressive-enhancement.
- Per-page `<title>`, `<meta description>` (from existing `<!-- description: -->` comments), `og:*`, `twitter:card=summary_large_image`, canonical URL.
- Per-page OG images via `@vercel/og` edge function — H1 + section label on dark theme.
- `sitemap.xml` + `robots.txt` generated by build.
- JSON-LD `TechArticle` per page (`headline`, `author`, `dateModified` from `git log -1 --format=%cI`).
- Real `/404.html` with search box + sidebar.
- `.github/workflows/ci.yml` runs `scripts/check-links.sh` (fails PR on broken `[text](other.md)` refs) and `bash build.sh --check` (fails if `index.html` out of sync).
- Plausible Cloud analytics snippet wired up.

**Plan:** [`roadmap/releases/v1.2-discovery-build.md`](roadmap/releases/v1.2-discovery-build.md)

---

### v1.3 — Operate Cluster + Rename (≈2 weeks)

**Goal:** Fill the practitioner-runbook gap. Add the four pages every working engineer needs but the site doesn't have.

Deliverables (new content + IA shift):
- New `content/observability.md` — narrative on what to trace, span schemas, OTel-for-LLMs, eval-in-the-loop, decision matrix; replaces the table-only section in `infrastructure.md:455`.
- New `content/safety.md` — prompt-injection threat model, tool-misuse, guardrail placement, agent-specific attack surface.
- New `content/cost-economics.md` — token math, cache economics, hybrid-model routing math, idle-cost calculations, cost-per-PR framing.
- New `content/deployment.md` — shadow → canary → autonomous rollouts, agent SLOs, kill-switches, drift monitoring.
- Rename `approaches.md` → `coding-agents.md` (with hash redirect for `#approaches`).
- Split coding-agent long tail: `coding-clis.md` separate page; non-top-8 demoted to a one-line directory.
- New sidebar group: **Operate** (Observability, Cost & Economics, Safety, Deployment).
- New sidebar group: **Protocols** (MCP, A2UI/AG-UI, Identity & Auth — promoted from `infrastructure.md` subsections).
- Adopt PM #5's editorial commandments: every new page in this release ends in a "When to use / when not to" decision block; every load-bearing claim cites a primary source; "Last verified" date in each frontmatter.

**Plan:** [`roadmap/releases/v1.3-operate-rename.md`](roadmap/releases/v1.3-operate-rename.md)

---

### v1.4 — Astro Migration + Design System (≈2 weeks)

**Goal:** Replace `build.sh` with Astro. Same URLs, same look at flip-time, but proper static site under the hood. Then layer in design tokens, Shiki highlighting, light/dark, prose width.

Deliverables:
- `astro.config.mjs` at repo root. Content collection points at existing `content/`.
- `vercel.json` flipped to `{"buildCommand": "astro build", "outputDirectory": "dist", "framework": "astro"}`.
- Hash → clean-URL redirects (`#patterns` → `/patterns/`) for backward compat with old links.
- `js/main.js` shrinks to ≤60 LOC of UI polish (sidebar drawer + theme toggle only).
- Frontmatter Zod schema (`title`, `description`, `group`, `order`, `lastVerified`, `staleBy`) — invalid frontmatter fails the build.
- Design tokens split into `tokens.css`, `base.css`, `prose.css`, `components.css` per PM #3 spec.
- Light theme + theme toggle, `prefers-color-scheme` default, `localStorage` persistence.
- Shiki syntax highlighting at build time (theme: `vesper`).
- Prose width drops to ~70ch; tables/code break out wider via `.full-bleed`.
- Per-page TOC component (Astro island) replaces the v1.1 JS implementation.
- Read-time badge under each H1 (build-time computation).
- `docs/` confirmed deleted; sponsor logo paths verified.

**Plan:** [`roadmap/releases/v1.4-astro-design.md`](roadmap/releases/v1.4-astro-design.md)

---

### v2.0 — Killer Features + Launch (≈3 weeks)

**Goal:** Ship the two features no competing reference has, plus the distribution machinery to make the launch travel.

Deliverables:
- **Pick Your Agent Stack** interactive decision tree (Astro island, React or vanilla). 8–12 questions → concrete stack recommendation with shareable URL.
- **Interactive Comparison Matrix** — JSON-backed filterable table across coding agents + infra vendors. Axes: isolation tier, $/PR, HITL support, MCP support, license. Data extracted from existing pages.
- **Pagefind** site search at deploy time. Replaces the in-memory index.
- **Buttondown newsletter** — embed on `index.md` + `changelog.md`. RSS-to-email automation.
- **`/feed.xml`** — site changelog + dated entries.
- **GitHub Discussions** enabled. Per-page "Discuss this page" link.
- **"Suggest an edit"** link per page → `edit/main/content/<slug>.md`.
- **`.github/ISSUE_TEMPLATE/`** + `PULL_REQUEST_TEMPLATE.md` + `CONTRIBUTING.md`.
- **Quarterly State of Agentic Engineering report** v1 — branded PDF + web page, dated, downloadable. Replaces the static `comparison.md`.
- **Primary-Source Interview Series** — kickoff post + 1 interview transcript (Cherny/Vincent/Steinberger TBD).
- **IA reshuffle to final v2 groups**: Get Started · Coding Agents · Patterns & Schools · Operate · Protocols · Interfaces · Infrastructure · People · Community.
- **Deprecate**: `comparison.md` (replaced by matrix), `sandboxes.md` (merged into `infrastructure.md`), `organizations.md` (appendix to `harness-engineering.md`).
- **Launch narrative** (PM #5): "The opinionated field manual for shipping agents in production — every page ends in a decision."

**Plan:** [`roadmap/releases/v2.0-launch.md`](roadmap/releases/v2.0-launch.md)

---

## Worktree Topology

Each release lives in its own git worktree off `main`, with its own PLAN.md inside the working tree:

```
/home/user/agentic-engineering              (main worktree — branch: claude/fix-toc-mobile-design-AzN22)
../wt-v1.1-toc-mobile                       (branch: claude/v1.1-toc-mobile-polish)
../wt-v1.2-discovery-build                  (branch: claude/v1.2-discovery-build)
../wt-v1.3-operate-rename                   (branch: claude/v1.3-operate-rename)
../wt-v1.4-astro-design                     (branch: claude/v1.4-astro-design)
../wt-v2.0-launch                           (branch: claude/v2.0-launch)
```

Any agent picking up a release should:

1. `cd` into the relevant `../wt-*` directory.
2. Read the PLAN.md at the worktree root (and the matching `roadmap/releases/*.md` here in main for the canonical version).
3. Follow the PLAN's "Acceptance criteria" and "Files to touch" sections.
4. Commit, push the branch, and open a draft PR titled `release: v1.X — <theme>`.
5. Squash-merge into main only after the previous release is merged.

---

## Pacing & Process

- **Tick pacing:** This roadmap was paced at 30s checkpoints. Future execution agents should re-adopt the same cadence: a `date` snapshot at every major branch in the work, batched parallel calls wherever the work is independent, no idle sleep loops.
- **Council updates:** Re-convene the 5-PM council at the end of each release to re-rank the next release's scope. Add a new file under `roadmap/council/` per re-convene round.
- **One site, one build, one deploy.** Never reintroduce a parallel `docs/` site. (See PR #28 for the postmortem.)
- **Verified live or it didn't ship.** Every release closes with a live-URL check, not just a green CI.

---

## Open Questions (Decided)

The council deliberately resolved these so the roadmap is unambiguous:

| Question | Resolution | Set by |
|----------|------------|--------|
| Astro vs Starlight vs Next vs Docusaurus? | **Astro, no Starlight theme** | PM #2 |
| Discord vs GitHub Discussions? | **GitHub Discussions; revisit Discord at 500 WAUs** | PM #4 |
| Newsletter platform? | **Buttondown + RSS** | PM #4 |
| Search tech? | **Pagefind at build time** | PM #2 |
| Highlighting? | **Shiki, theme `vesper`** | PM #3 |
| Analytics? | **Plausible Cloud** | PM #4 |
| Rename `Approaches`? | **Yes → Coding Agents (hash redirect kept)** | PM #1 & PM #5 |
| Cut `comparison.md`? | **Yes, in v2.0 (replaced by interactive matrix)** | PM #5 |
| Moat? | **Primary-source relationships (interview series)** | PM #5 |

---

## Council Reports

- [`roadmap/council/pm1-content-ia.md`](roadmap/council/pm1-content-ia.md) — Content & IA
- [`roadmap/council/pm2-build-platform.md`](roadmap/council/pm2-build-platform.md) — Build, Platform, DX
- [`roadmap/council/pm3-design-mobile.md`](roadmap/council/pm3-design-mobile.md) — Design, Mobile, Reading Experience
- [`roadmap/council/pm4-distribution-community.md`](roadmap/council/pm4-distribution-community.md) — Distribution, Community, Growth
- [`roadmap/council/pm5-positioning-editorial.md`](roadmap/council/pm5-positioning-editorial.md) — Positioning & Editorial Voice
