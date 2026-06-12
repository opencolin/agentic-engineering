<!-- description: PM Council Report #3 — Visual design, mobile UX, reading experience lens for v2. -->

# PM #3 — Design, Mobile UX, Reading Experience

**Lens:** What it looks like and feels like to read.
**Author:** PM Council subagent (general-purpose), `agentId: aa6f338231e4f01c2`
**Status:** Read-only research; no files modified.

---

## 1. Mobile Audit (Concrete Breakages)

- **Sidebar drawer has no scrim, no swipe-to-close.** `css/style.css:506-519` slides `.sidebar` over content at `z-index: 90`, no backdrop. Toggle in `js/main.js:127-129` only toggles `.open` — no `aria-expanded`, no focus trap, no `Escape`, body keeps scrolling. Tapping outside doesn't close.
- **Hamburger overlaps the brand.** `.topbar` uses `padding: 0 0.75rem 0 3rem` (`style.css:463`) for absolutely-positioned `.sidebar-toggle`. Button is 2.5rem (40px) — under Apple's 44px tap minimum. At <420px it shrinks to 36px.
- **Sticky topbar consumes 56px** but `scrollIntoView` (`main.js:104`) uses defaults — anchor jumps land **under** the topbar. Needs `scroll-margin-top: var(--topbar-height)` on every heading.
- **Code blocks**: `pre { overflow-x: auto }` works, but scrollbar is the only affordance — no visual fade, no copy button, no language label. Long URLs in `<p>` lack `overflow-wrap: anywhere`.
- **Tables**: nicely done — phone layout becomes stacked cards via `data-label` (`style.css:550-615`, populated by `main.js:67-76`). Best part of the mobile CSS.
- **iOS keyboard zoom prevention** correct (`font-size: 16px` on search). But no clear-button and no full-screen overlay on mobile.
- **iOS Safari `100vh`** cuts off — use `100dvh`.

## 2. TOC — Current vs. Proposed

**Current:** there is **no per-page TOC**. `content/table-of-contents.md` is a hand-curated *site* TOC rendered as just another page. Inside long pages (e.g., `approaches.md` 95KB, `infrastructure.md` 52KB), readers have no in-page navigation, no scroll-spy, no "you are here." Headings have IDs (`main.js:22-27`) but nothing surfaces them.

**Proposed v2:** Auto-generate a right-rail TOC from H2/H3 of the current page on render.
- **Desktop ≥1200px:** sticky right column (`position: sticky; top: calc(var(--topbar-height) + 1rem)`), two levels, IntersectionObserver-driven scroll-spy that highlights current section with 2px accent left-border.
- **Tablet 768–1199px:** collapsible `<details>` pinned below H1 ("On this page · 12 sections").
- **Mobile:** floating bottom-sheet button ("§ Sections") that opens a sheet.
- Each item gets a hover "#" anchor-link icon for copy-link-to-heading.

## 3. Reading Experience Gaps

For pages this dense, missing essentials:
- **Estimated read time** under H1 (words ÷ 220 wpm — `infrastructure.md` is ~25 min).
- **Copy-link-to-heading** on hover (IDs exist; just add `<a class="header-anchor">#</a>`).
- **Syntax highlighting:** use **Shiki** (TextMate grammars, dark-aesthetic match `github-dark-dimmed` or `vesper`). Prism acceptable but Shiki wins on fidelity.
- **Code-block copy button** top-right of each `<pre>`, 1.5s "Copied" toast.
- **Image lightbox** for future diagrams.
- **Dark mode quality:** it's fine but **dark-only**. Add a light palette + theme toggle persisted to `localStorage`.
- **Prose tuning:** `line-height: 1.7` good. `--max-width: 860px` slightly wide for tables. Drop body prose to **70–75ch** (~680px); let tables/code break wider via `.full-bleed`.
- **Heading scroll offset** (see §1).
- **Sidebar active state for sub-sections** — currently only top-level page highlighted.

## 4. Design System v2 — Token Spec

```css
:root {
  --bg:        #ffffff;  --bg-muted:  #f7f8fa;  --bg-card:  #ffffff;
  --bg-code:   #0d1117;
  --border:    #e5e7eb;  --border-strong: #d1d5db;
  --fg:        #0a0a0f;  --fg-muted:  #4b5563;  --fg-subtle: #6b7280;
  --accent:    #4f46e5;  --accent-hover: #4338ca;
  --success:   #16a34a;  --warning:   #d97706;  --danger:   #dc2626;
}
[data-theme="dark"] {
  --bg: #0a0a0f; --bg-muted: #12121a; --bg-card: #15151f;
  --border: #1f1f2e; --border-strong: #2a2a3a;
  --fg: #e8e8f0; --fg-muted: #a0a0b0; --fg-subtle: #6a6a7a;
  --accent: #818cf8; --accent-hover: #a5b4fc;
}

--text-xs: 0.75rem;  --text-sm: 0.875rem; --text-base: 1rem;
--text-lg: 1.125rem; --text-xl: 1.25rem;  --text-2xl: 1.5rem;
--text-3xl: 1.875rem; --text-4xl: 2.25rem;
--leading-prose: 1.65; --leading-tight: 1.25;
--measure: 70ch;

--space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
--space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

--radius-sm: 4px; --radius: 8px; --radius-lg: 12px;
--shadow-sm: 0 1px 2px rgba(0,0,0,.06);
--shadow-md: 0 4px 12px rgba(0,0,0,.08);
```

Code blocks: dark-always (`--bg-code`), 1px subtle border, language label top-left (`text-xs`, mono), copy button top-right, no inner shadow, `tab-size: 2`, ligatures off. Inline `code` uses `--bg-muted` not the loud accent the current CSS uses (`style.css:356`).

## 5. Three-Tier Release Plan

**Tier 1 — Quick wins (≤1 day, scope of `claude/fix-toc-mobile-design-AzN22`)**
1. Add `scroll-margin-top: calc(var(--topbar-height) + 1rem)` to all `.markdown-body h1,h2,h3,h4`.
2. Mobile sidebar: add `.sidebar-scrim`, lock `body` scroll when `.open`, close on `Escape` / scrim tap, `aria-expanded`, replace `100vh` → `100dvh`.
3. Bump tap targets to 44×44px; widen hamburger hit area.
4. Copy-link `#` anchors on heading hover.
5. Code-block copy button + language badge.
6. Tone down inline-code color to neutral.
7. `scroll-padding-top` on `html`.

**Tier 2 — Structural (≤1 week)**
1. Auto per-page TOC: right rail desktop, `<details>` tablet, bottom-sheet mobile. Scroll-spy via `IntersectionObserver` (`rootMargin: '-72px 0px -70% 0px'`).
2. Shiki syntax highlighting.
3. Read-time badge under H1.
4. Light theme + theme toggle, `prefers-color-scheme` default, `localStorage`.
5. Sidebar sub-section active state synced with scroll-spy.
6. Image/embed lightbox.
7. Prose width drop to ~70ch with `.full-bleed` escape hatch.

**Tier 3 — Full design system v2**
1. Replace ad-hoc tokens with the spec above; split into `tokens.css`, `base.css`, `prose.css`, `components.css`.
2. Component primitives: `.card`, `.callout`, `.kbd`, `.badge`, `.tab`, `.disclosure`.
3. Static site generation per page (kills the inlined `<script type="text/markdown">` pattern).
4. Per-page OG images from H1 + title.
5. `<dialog>`-based command palette (Cmd/Ctrl-K) with arrow-key nav.
6. Figma library mirroring tokens for code↔design parity.
