# Contributing to Agentic Engineering

Thank you for contributing. This site is an opinionated reference, which means contributions are higher-bar than a typical wiki — but the editorial bar is documented, the review flow is fast, and corrections are the highest-leverage thing you can ship.

This document covers:

1. [Editorial commandments](#editorial-commandments) — the five rules every page follows.
2. [Frontmatter schema](#frontmatter-schema) — what every `content/*.md` file declares.
3. [How to contribute](#how-to-contribute) — issues, corrections, additions, new pages.
4. [Review flow](#review-flow) — what happens after you open a PR.
5. [Branch naming](#branch-naming) — how we name branches.
6. [Running the build locally](#running-the-build-locally) — dev loop.
7. [Datasets](#datasets) — `src/data/*.json` schemas.
8. [Hype-word linter](#hype-word-linter) — the CI check, and how to escape-hatch quoted phrases.
9. [Conflict of interest](#conflict-of-interest) — disclosure expectations.

---

## Editorial commandments

These are CI- or review-enforced. Every page must satisfy all five.

### 1. Every page ends in a decision framework

A `## Decision Framework`, `## When to Pick X`, or `## What should you do?` section closes every page. Bullet list, table, or short prose. The reader came to make a decision; ship them one.

### 2. Comparison pages name the loser

Wherever you compare two or more things, you must name at least one specific alternative and say when *not* to pick the thing you're recommending. "Pick X unless Y" beats "X is great" every time.

### 3. Every load-bearing claim cites a primary source

A primary source is the thing being talked about — vendor docs, a GitHub repo, a paper, a conference talk, a release note. A press release does not count as the only source. A synthesis blog post does not count as a primary source for what the underlying tool does.

Inline citation format: `([anthropic.com](https://anthropic.com/engineering/...))` or a markdown footnote.

### 4. No hype vocabulary

The following words are banned in `content/**.md`:

- `revolutionary`
- `game-changing` / `game changer` / `game changing`
- `seamless` / `seamlessly`
- `leverage` (as a verb — "leverage X to do Y")
- `transformative`
- `paradigm shift`

The CI check (`scripts/check-hype-words.sh`) will fail the PR if any banned word appears. If you are quoting a primary source verbatim and the word is in the quote, mark the line with `<!-- quote -->` at the end and the linter will skip it.

We extend this list rarely — typically when a word becomes so over-used in vendor marketing that it stops carrying information. PRs proposing additions are welcome; bring evidence.

### 5. Frontmatter dates: `lastVerified` and `staleBy`

Every page declares two dates. `lastVerified` is when a human last confirmed every claim on the page is still true. `staleBy` is when the page expires if not re-verified — past this date, a stale banner auto-renders at the top of the page in the v2.0 build.

Default `staleBy` is six months after `lastVerified`. Fast-moving pages (vendor pricing, model versions) use three months. Foundational pages (taxonomies, definitions) use twelve.

---

## Frontmatter schema

Every `content/*.md` page begins with a YAML frontmatter block:

```yaml
---
title: "Display title"
slug: page-slug
date: 2026-06-01          # original publish date
author: opencolin          # GitHub handle
lastVerified: 2026-06-01   # ISO date; reset when reviewing
staleBy: 2026-12-01        # ISO date; default = lastVerified + 6 months
tags: [tag1, tag2]         # optional; used by the IA group
description: "1-2 sentence page description, used in og:description and the RSS feed."
group: Infrastructure      # one of: Get Started, Coding Agents, Patterns & Schools, Operate, Protocols, Interfaces, Infrastructure, People, Community
---
```

Notes:

- `slug` must match the filename without `.md`.
- `description` becomes the `og:description` meta tag and the RSS `<description>`.
- `group` is the IA grouping that drives sidebar placement in v2.0.
- Optional fields not shown: `interview` (for Primary-Source Interviews), `issue` (for quarterly reports — `2026-q2`, `2026-q3`, etc.).

---

## How to contribute

Pick the path that matches what you have.

### Suggest an addition

Use the [Suggest an addition](.github/ISSUE_TEMPLATE/suggest-addition.yml) issue template. We require:

- The page it belongs on.
- A primary-source link.
- A one-sentence answer to "why does the reader care?"
- The closest existing entry, and how this one differs.

If you already have a draft PR, link it from the issue.

### Report a correction

Use the [Correction](.github/ISSUE_TEMPLATE/correction.yml) issue template, or open a PR with the fix. Three kinds:

- **Factual** — the claim is wrong.
- **Stale** — the claim was true once, but the vendor pivoted / model deprecated / repo archived.
- **Unsourced** — a load-bearing claim with no primary source cited.

Corrections are reviewed within 48 hours.

### Propose a new page

Use the [Propose a new page](.github/ISSUE_TEMPLATE/new-page.yml) issue template. We err on the side of fewer pages — convince us the topic doesn't fit as a section on an existing page. Include the section outline, the decision the page enables, and three primary sources.

### Submit a PR directly

If you already have the change, skip the issue. Open the PR; the [PR template](.github/PULL_REQUEST_TEMPLATE.md) walks you through the five commandments.

---

## Review flow

1. **Open PR.** CI runs the hype-word linter and the build.
2. **Reviewer assigned within 48 hours.** Reviewer comes from the [Who's Who](content/who-is-who.md) reviewer rotation when the topic matches; otherwise from the maintainer set.
3. **Reviewer checks** the five commandments, the frontmatter, and the primary sources. May request changes.
4. **Merge.** Maintainer merges. The deploy ships within a few minutes.
5. **Changelog entry** — for content additions, the contributor (you) appends an entry to `content/changelog.md` under the current date, linking the PR. Maintainers will remind you if you forget.

We squash-merge by default.

---

## Branch naming

`claude/<short-description-N>` for branches drafted by Claude Code workflows (most of our recent history).
`<gh-handle>/<short-description>` for human-authored branches.
`fix/<...>`, `add/<...>`, `correction/<...>`, `editorial/<...>` are also fine.

The `claude/` prefix is *not* required — it's an artifact of how the repo's maintainers work — but it doesn't block anything either.

---

## Running the build locally

The reference front-end is hand-rolled SPA: `build.sh` concatenates `content/*.md` into one `index.html`.

```bash
npm run build                  # rebuilds index.html
python3 -m http.server 3000    # any static server works
# open http://localhost:3000
```

Edit markdown in `content/`. Run `npm run build` again. Refresh.

In v2.0, the build switches to Astro. The Astro-dependent stubs are in `src/pages/`, `src/components/`. See the Astro README (`src/README.md` when it lands) for the dev loop. Until then, edits to `content/*.md` show up on the reference site through `build.sh`.

---

## Datasets

Two machine-readable datasets ship with v2.0. Both are checked into the repo and are the source of truth for their respective interactive pages.

### `src/data/comparison.json`

Powers `/compare/`. One row per vendor, across categories: `coding-agent`, `inference`, `sandbox`, `orchestrator`, `observability`, `memory`, `mcp-gateway`. Schema is documented at the top of the file. PRs that add a row require the same primary-source + decision-relevance bar as a content addition.

`lastVerified` is per-row. The `/compare/` UI surfaces a row's age.

### `src/data/stack-questions.json`

Powers `/pick-stack/`. The question tree and the named stacks. Schema is documented at the top of the file. PRs that tune weights are fine; PRs that add questions need a corresponding update to every stack's weight table.

---

## Hype-word linter

`scripts/check-hype-words.sh` runs in CI on every PR and exits non-zero on a banned word in `content/**.md`. The banned list is at the top of the script.

To escape-hatch a quoted phrase from a primary source:

```markdown
The vendor calls it a "revolutionary new sandbox" <!-- quote -->
```

The linter skips any line ending with `<!-- quote -->`. Use sparingly — if the banned word appears in our editorial voice, the linter is right to fail.

Run it locally:

```bash
./scripts/check-hype-words.sh
```

Exit 0 = clean. Exit 1 = fix one of the offending lines.

---

## Conflict of interest

If you work for, advise, hold equity in, or have a paid relationship with a vendor your PR mentions, disclose it in the PR description. Disclosure does not block the PR — many of the best contributions come from people inside the projects they document. Undisclosed conflicts will get the PR rolled back if discovered after merge.

The disclosure expectation also covers PRs that *remove* a competitor of a vendor you're affiliated with.

---

## Code of conduct

Be kind. Argue with the writing, not the writer. Reviewers: explain your reasoning, especially when requesting changes. Authors: assume good faith; reviewers are protecting the bar, not gatekeeping.

Maintainers reserve the right to close PRs that are off-topic, low-effort, or hostile. We've never had to use this. We expect to keep that record.

---

## Questions?

Open a [GitHub Discussion](https://github.com/opencolin/agentic-engineering/discussions) tagged `meta`. Or ping the maintainers directly via the contact info in the README.

Thanks again for contributing.
