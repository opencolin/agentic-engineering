<!-- description: v2.0 release plan — killer features and launch. Worktree: ../wt-v2.0-launch, branch: claude/v2.0-launch. -->


> **Picked up this worktree?** The full v2 roadmap and all 5 PM council reports live on branch `claude/fix-toc-mobile-design-AzN22` in the `roadmap/` directory of the main repo at `/home/user/agentic-engineering/roadmap/`. Read [`ROADMAP-V2.md`](https://github.com/opencolin/agentic-engineering/blob/claude/fix-toc-mobile-design-AzN22/ROADMAP-V2.md) for context. Council references cited below resolve there.

# v2.0 — Killer Features + Launch

**Worktree:** `../wt-v2.0-launch`
**Branch:** `claude/v2.0-launch`
**Estimated effort:** 3 weeks
**Depends on:** v1.4 merged (Astro platform is the substrate for islands, Pagefind, edit links)

---

## Goal

Ship the two features no competing reference has — **Pick Your Agent Stack** and the **Interactive Comparison Matrix** — plus the distribution machinery (newsletter, RSS, Discussions, contribution flow), plus the editorial reset (commandments, dated pages, cuts), plus the launch artifact (Quarterly Report v1).

## Acceptance Criteria

### Killer features
- [ ] **Pick Your Agent Stack** — Astro island on `/pick-stack/`. 8–12 questions (latency target, isolation needs, language, budget, MCP support, sync vs async, scale, compliance). Output: a concrete stack recommendation (inference provider · sandbox · orchestrator · observability · memory) with rationale and "Why not the alternatives" text. Shareable URL encodes answers.
- [ ] **Interactive Comparison Matrix** — `/compare/` page. JSON dataset at `src/data/comparison.json`. Filterable axes: isolation tier, $/PR, HITL support, MCP support, license, language. Sortable columns. Replaces the static `comparison.md`.

### Search + distribution
- [ ] **Pagefind** integrated at build time. Replaces any remaining in-memory search. Cmd/Ctrl-K opens a `<dialog>` palette with keyboard nav.
- [ ] **Buttondown newsletter** — embed on `/` and `/changelog/`. Signup writes to Buttondown via their public form endpoint.
- [ ] **`/feed.xml`** — RSS of `changelog.md` entries.
- [ ] **GitHub Discussions** enabled on the repo. Per-page "Discuss this page" link queries/creates a discussion tagged with the slug.
- [ ] **"Suggest an edit"** link per page → `github.com/opencolin/agentic-engineering/edit/main/content/<slug>.md`.

### Contribution
- [ ] `.github/ISSUE_TEMPLATE/suggest-addition.yml`, `correction.yml`, `new-page.yml`.
- [ ] `.github/PULL_REQUEST_TEMPLATE.md`.
- [ ] `CONTRIBUTING.md` documenting the frontmatter schema, editorial commandments, and review flow.

### Editorial reset
- [ ] All five PM #5 commandments enforced on every page in the new IA:
  1. Every page ends in a decision framework.
  2. Comparison pages name the loser.
  3. Every load-bearing claim cites a primary source.
  4. No hype vocabulary (CI lint via a banned-word list).
  5. `lastVerified` + `staleBy` in every page's frontmatter; stale banner auto-renders past `staleBy`.
- [ ] IA reshuffle to the final v2 groups: **Get Started · Coding Agents · Patterns & Schools · Operate · Protocols · Interfaces · Infrastructure · People · Community**.
- [ ] Deprecations:
  - `content/comparison.md` deleted (replaced by `/compare/`).
  - `content/sandboxes.md` merged into `content/infrastructure.md` as a featured subsection.
  - `content/organizations.md` becomes an appendix of `content/harness-engineering.md`.

### Launch artifact
- [ ] **State of Agentic Engineering Q* 2026 report** v1 — long-form page at `/state-of-agentic-engineering/2026-q3/` (or whichever quarter the launch lands in). Branded, dated, chart-heavy, downloadable PDF (via headless-Chrome PDF rendering at build time or via a Vercel cron).
- [ ] **Primary-Source Interview Series** — kickoff post + 1 interview transcript published (subject TBD: Cherny, Vincent, Steinberger, Chase, or Polosukhin). Pull-quotes on the relevant Who's Who profile.
- [ ] **Launch post** on `/blog/v2-launch/` using PM #5's launch narrative.

## Files to Touch

| Area | Files |
|------|-------|
| Islands | `src/components/PickStack.tsx` (or `.astro` with vanilla JS), `src/components/CompareMatrix.tsx` |
| Data | `src/data/comparison.json`, `src/data/stack-questions.json` |
| Pages | `src/pages/pick-stack.astro`, `src/pages/compare.astro`, `src/pages/state-of-agentic-engineering/[issue].astro`, `src/pages/blog/v2-launch.md` |
| Distribution | `src/components/NewsletterForm.astro`, `src/components/DiscussLink.astro`, `src/components/EditLink.astro`, `src/pages/feed.xml.ts` |
| Search | Pagefind config; `src/components/SearchDialog.astro` |
| CI | `.github/workflows/ci.yml` add hype-word linter |
| Contribution | `.github/ISSUE_TEMPLATE/*.yml`, `.github/PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md` |
| Deletes | `content/comparison.md`, `content/sandboxes.md`, `content/organizations.md` (with appendix migration) |
| Frontmatter | All `content/*.md` gain `lastVerified`, `staleBy` |

## Out of Scope (post-v2)

- Discord (revisit at 500 WAUs per PM #4).
- A2UI / RAG-for-agents content pages.
- Mobile native wrapper.
- Authoring UI / CMS.
- More than 1 interview transcript at launch (queue the rest for v2.1 cadence).

## Verification

1. Run `npm run build`; verify all new pages and the report PDF appear in `dist/`.
2. `/pick-stack/`: complete 5 different answer paths; each produces a distinct recommendation; share URL round-trips.
3. `/compare/`: filter on `MCP support = yes` and `isolation = sandboxed`; result count matches the JSON dataset.
4. Search palette opens on Cmd/Ctrl-K; arrow nav works; first result Enter loads the page.
5. Newsletter form submit returns 200 from Buttondown; check inbox confirmation.
6. `/feed.xml` validates as RSS 2.0.
7. Discussions: click "Discuss this page" on 3 pages; each searches/creates the expected discussion.
8. Hype-word CI fails on a PR adding "revolutionary" to a content page.
9. Stale banner shows when `staleBy` is set to yesterday on a test page.
10. Lighthouse Performance ≥ 95, Accessibility ≥ 95, SEO = 100.

## Launch Checklist

- [ ] All pages tagged with `lastVerified` ≤ 30 days from launch.
- [ ] Quarterly Report rendered at `/state-of-agentic-engineering/<quarter>/`.
- [ ] 1 interview transcript live.
- [ ] OG image for the launch post + the quarterly report look good in the social-card debugger.
- [ ] Newsletter list seeded with at least 20 manual signups (friends + advisors).
- [ ] Launch post draft reviewed by 3 people in `who-is-who.md` (cash in the relationship moat).
- [ ] Submit to HN, lobste.rs, X, LinkedIn. Tag people who reviewed.

## Hand-off Notes

Two killer features (Pick Stack + Comparison Matrix) are independently shippable — sequence them serially on this branch so a stalled feature doesn't block launch. The Quarterly Report is the marketing artifact; reserve a full week for editorial polish.

Council reference: [`roadmap/council/pm1-content-ia.md`](../council/pm1-content-ia.md) §4, [`roadmap/council/pm4-distribution-community.md`](../council/pm4-distribution-community.md) §2-6, [`roadmap/council/pm5-positioning-editorial.md`](../council/pm5-positioning-editorial.md) §2-6.
