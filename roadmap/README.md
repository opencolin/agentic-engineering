<!-- description: How to navigate the v2 roadmap artifacts and pick up work where the planning agent left off. -->

# v2 Roadmap — How to Resume

This directory is the planning artifact for v2 of agentic-engineering. **Nothing here changes the live site.** Execution happens in dedicated branches/worktrees per release.

## Start here

- **[`../ROADMAP-V2.md`](../ROADMAP-V2.md)** — the master roadmap. Read this first.
- **`council/`** — the 5 PM reports the roadmap was synthesized from. Read whichever lens matches your release.
- **`releases/`** — per-release PLAN.md with acceptance criteria, files to touch, verification, hand-off notes.

## Releases (in order)

| Release | Plan | Branch |
|---------|------|--------|
| v1.1 | [`releases/v1.1-toc-mobile.md`](releases/v1.1-toc-mobile.md) | `claude/v1.1-toc-mobile-polish` |
| v1.2 | [`releases/v1.2-discovery-build.md`](releases/v1.2-discovery-build.md) | `claude/v1.2-discovery-build` |
| v1.3 | [`releases/v1.3-operate-rename.md`](releases/v1.3-operate-rename.md) | `claude/v1.3-operate-rename` |
| v1.4 | [`releases/v1.4-astro-design.md`](releases/v1.4-astro-design.md) | `claude/v1.4-astro-design` |
| v2.0 | [`releases/v2.0-launch.md`](releases/v2.0-launch.md) | `claude/v2.0-launch` |

## Picking up a release

1. `git fetch origin && git worktree add ../wt-v1.X-<slug> claude/v1.X-<slug>` (the planning round may already have created the worktree; check `git worktree list` first).
2. `cd ../wt-v1.X-<slug>`.
3. Read the matching `roadmap/releases/v1.X-*.md` and the council reports it references.
4. Work through the Acceptance Criteria checklist.
5. Commit, push, open a draft PR titled `release: v1.X — <theme>`.
6. Wait for v1.(X-1) to merge before merging this one — the order matters.

## Re-convening the council

Per the master roadmap's "Pacing & Process" section, the council should re-convene at the end of each release to re-rank the next release's scope. Add a new file under `council/` per round (e.g., `council/round-2-post-v1.1.md`).

## Conventions

- All planning docs use the existing `<!-- description: ... -->` HTML-comment SEO convention from `content/*.md`.
- All branch names follow `claude/v1.X-<slug>` or `claude/v2.0-<slug>`.
- All worktrees live as siblings of the main repo: `../wt-v1.X-<slug>`.
- Branch names mentioned in the roadmap are **planned**; the actual branch your agent creates only needs to follow the prefix convention and be referenced from the PR.
