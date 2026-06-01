<!-- description: Council of PMs delivery decision: how the v1.1→v2.0 releases are being fanned out across worktrees in parallel. Working doc — updated by each tick. -->

# Council Delivery Plan — v1.1 → v2.0 Parallel Fan-Out

> **Status:** Live. This doc is the canonical handoff for any agent resuming the v2 build. Updated on 30s tick boundaries.
> **Tick start:** see Tick Log below.
> **Owner:** opencolin · live site: https://agentic-engineering.vercel.app

## Council Decision (5 PMs, dissent noted)

The 5-PM council that authored `ROADMAP-V2.md` re-convened to decide **how to actually build** v1.1→v2.0 given the constraint "every release must be independently shippable, but we want to ship them all as fast as possible." Resolution:

| PM | Vote on parallelization | Rationale |
|----|------------------------|-----------|
| PM #1 (Content/IA) | Parallel v1.1+v1.2+v1.3; serial v1.4→v2.0 | v1.3 adds new pages — touches no files v1.1/v1.2 touch |
| PM #2 (Build/Platform) | Parallel all 5 with merge order | Worktrees insulate; rebase conflicts handled at merge time |
| PM #3 (Design/Mobile) | Parallel v1.1+v1.4 only | v1.1 CSS prototypes inform v1.4 design tokens |
| PM #4 (Distribution) | Parallel v1.2+v2.0; serial rest | OG/sitemap (v1.2) feeds the launch (v2.0) |
| PM #5 (Editorial) | Parallel ALL — "ship the field manual" | Speed > merge cleanliness; every release ends in a decision |

**Decision (4-1 majority):** Spin all 5 worktrees in parallel from a common base (`95f5ace`). Merge order is fixed (`v1.1 → v1.2 → v1.3 → v1.4 → v2.0`); each later release rebases against the latest merged main before its own merge. v1.4's Astro migration absorbs whatever sidebar/build changes land from v1.2; v2.0 absorbs the IA from v1.3. Dissent (PM #3): if v1.1's tokens-from-CSS prototype diverges from v1.4's `tokens.css`, v1.4 wins.

## Worktree Topology (live)

```
/home/user/agentic-engineering   main worktree  · branch: claude/fix-toc-mobile-design-AzN22  · planning home
/home/user/wt-v1.1-toc-mobile    branch: claude/v1.1-toc-mobile-polish    · PR #33
/home/user/wt-v1.2-discovery-build branch: claude/v1.2-discovery-build    · PR #34
/home/user/wt-v1.3-operate-rename branch: claude/v1.3-operate-rename      · PR #35
/home/user/wt-v1.4-astro-design  branch: claude/v1.4-astro-design         · PR #36
/home/user/wt-v2.0-launch        branch: claude/v2.0-launch               · PR #37
```

Each worktree's PLAN.md is the canonical acceptance criteria.

## How an Agent Resumes Mid-Flight

1. `git -C /home/user/agentic-engineering worktree list` — confirm your worktree path.
2. `cd` into it.
3. Read `PLAN.md` at the worktree root + the matching `roadmap/releases/<release>.md` in main.
4. `git status` — confirm what's in-progress.
5. Pick up the next unchecked acceptance bullet.
6. Commit with `v<release>: <subject>`. Push with `git push -u origin <branch>`.
7. Update this doc's Tick Log row for your release.

## Tick Log (30s checkpoints)

| Tick UTC | Actor | v1.1 | v1.2 | v1.3 | v1.4 | v2.0 |
|----------|-------|------|------|------|------|------|
| (filled in by execution) | | | | | | |

Each row records: actor (main agent / sub-agent name / fleet), and per-release status — `idle / running / pushed / merged / blocked: <reason>`.

## Fan-Out Brief Given to Each Sub-Agent

> "You own release v1.X. Your worktree is `/home/user/wt-v1.X-<slug>`. Your branch is `claude/v1.X-<slug>`. Read `PLAN.md` at your worktree root for acceptance criteria and file paths. The site is hand-rolled HTML+CSS+JS with a `build.sh` that concatenates `content/*.md`. Implement the highest-leverage subset of the PLAN you can ship in one agent run; commit each logical chunk; push the branch with `-u origin <branch>` (retry up to 4× on network errors with 2s/4s/8s/16s backoff); update the existing PR (do NOT create a new one). End with a brief status: what shipped, what's left, files touched."

## Non-Goals

- No new parallel `docs/` site (PR #28 postmortem).
- No mid-flight pivots without re-convening the council (write a new file in `roadmap/council/` if one is needed).
- No silent scope creep — anything beyond `PLAN.md` goes in a "Stretch" section.
