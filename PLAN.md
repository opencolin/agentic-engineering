<!-- description: v1.1 release plan — TOC & mobile polish. Worktree: ../wt-v1.1-toc-mobile, branch: claude/v1.1-toc-mobile-polish. -->


> **Picked up this worktree?** The full v2 roadmap and all 5 PM council reports live on branch `claude/fix-toc-mobile-design-AzN22` in the `roadmap/` directory of the main repo at `/home/user/agentic-engineering/roadmap/`. Read [`ROADMAP-V2.md`](https://github.com/opencolin/agentic-engineering/blob/claude/fix-toc-mobile-design-AzN22/ROADMAP-V2.md) for context. Council references cited below resolve there.

# v1.1 — TOC & Mobile Polish

**Worktree:** `../wt-v1.1-toc-mobile`
**Branch:** `claude/v1.1-toc-mobile-polish` (also active during planning: `claude/fix-toc-mobile-design-AzN22`)
**Estimated effort:** 1 week
**Depends on:** none (ships off current main)

---

## Goal

Make today's site usable on phones and inside long pages without introducing a framework. Pure CSS + JS in the current `build.sh` pipeline.

## Acceptance Criteria

- [ ] Mobile drawer has visible scrim; tapping scrim or pressing `Escape` closes it.
- [ ] `body` scroll locks while drawer is open; restores prior scroll position on close.
- [ ] All interactive controls ≥ 44×44 px tap area; verified at 320px and 414px viewports.
- [ ] Anchor jumps land below the sticky topbar (no headings hidden under the header bar).
- [ ] Hovering any heading reveals a `#` anchor; click copies the permalink to clipboard.
- [ ] Every `<pre>` block has a copy button (top-right) with 1.5s confirmation, and a language label (top-left) when the markdown fence specifies one.
- [ ] Per-page TOC renders from H2/H3 of the current page: right rail at ≥1200px, `<details>` between 768–1199px, bottom-sheet button on mobile.
- [ ] Scroll-spy highlights the active section in both the per-page TOC and the sidebar.
- [ ] Inline `code` uses `--bg-muted` background (no longer the loud accent color).
- [ ] All changes ship without breaking any existing hash route (`#patterns`, `#harness-engineering`, …).
- [ ] Build still goes through `bash build.sh`; `index.html` regenerated and committed.
- [ ] Verified live on the Vercel preview before merging — manual phone test on a real device.

## Files to Touch

| File | Why |
|------|-----|
| `css/style.css` | Token tweaks, scrim, scroll-margin, tap targets, inline-code color, dvh, `.toc-rail`, `.toc-sheet`, scroll-spy active states |
| `js/main.js` | Sidebar drawer aria/scrim/Escape/focus-trap, heading anchor injection, code-copy button injection, per-page TOC generation, IntersectionObserver scroll-spy |
| `index.html` (regenerated) | `.sidebar-scrim` div, `.toc-rail` placeholder, `aria-expanded` on `.sidebar-toggle` |
| `build.sh` | If sidebar markup changes, regenerate the heredoc |

## Out of Scope

- Astro migration (v1.4).
- Light theme (v1.4).
- Shiki syntax highlighting (v1.4).
- Per-page OG images / SEO meta (v1.2).
- New content pages (v1.3).

## Verification

1. `bash build.sh` — no errors, `index.html` regenerated cleanly.
2. Deploy to Vercel preview from this branch.
3. Real-device test on iOS Safari and Android Chrome: open drawer, scroll, dismiss; navigate; deep-link to an anchor (verify it doesn't hide under topbar); test code copy.
4. Lighthouse Mobile Accessibility ≥ 95.
5. No regressions in existing keyboard search (`/`) or hash routing.

## Hand-off Notes

The branch `claude/fix-toc-mobile-design-AzN22` already exists on origin and is currently being used to hold this planning round. Future execution agent can either reuse that branch (rebase off main, drop `roadmap/` if scoping cleanly) or cut a fresh `claude/v1.1-toc-mobile-polish` branch. Reference the per-PM design spec at [`roadmap/council/pm3-design-mobile.md`](../council/pm3-design-mobile.md).
