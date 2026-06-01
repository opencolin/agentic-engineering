<!-- description: Launch post for v2.0 — the opinionated field manual for shipping agents in production. -->

---
title: "Agentic Engineering v2.0 — The Opinionated Field Manual"
slug: v2-launch
date: 2026-08-15
author: opencolin
lastVerified: 2026-08-15
staleBy: 2027-02-15
tags: [launch, editorial, meta]
description: "v2.0 is the field manual for shipping agents in production — every page now ends in a decision."
---

# Agentic Engineering v2.0 — The Opinionated Field Manual

> Every page now ends in a decision.

When we shipped v1, the goal was coverage: catalog every coding agent, every harness, every sandbox vendor before the field forgot which idea came from where. Coverage worked. The site is now the de facto index for 25+ agent systems and 180+ infrastructure vendors. But coverage is a starting point, not a product.

v2.0 is a different bet. We're not adding more entries — we're forcing every page to answer a question the reader actually came to ask: **given my constraints, what should I pick, and what am I giving up?**

That single editorial constraint reshapes the site. Pages that used to list "ten options worth considering" now name a default and tell you when to deviate. Comparison tables now name the loser. The two new interactive surfaces — Pick Your Agent Stack and the Comparison Matrix — exist because no static page can match a stack to *your* answers about latency, isolation, language, and budget.

## What's new in v2

- **The five commandments** (now CI-enforced):
  1. Every page ends in a decision framework.
  2. Comparison pages name the loser, not just the winner.
  3. Every load-bearing claim cites a primary source.
  4. No hype vocabulary. We ship a CI linter that fails on the banned list (see `CONTRIBUTING.md` for the current list).
  5. Every page carries `lastVerified` and `staleBy` frontmatter. Past `staleBy`, a stale banner auto-renders.
- **A new information architecture**: Get Started · Coding Agents · Patterns & Schools · Operate · Protocols · Interfaces · Infrastructure · People · Community. The grouping mirrors how teams actually pick: capability first, vendor second.
- **The Quarterly Report**: *State of Agentic Engineering 2026 Q2* (and onward, every quarter). Long-form, dated, downloadable. The first edition lives at `/state-of-agentic-engineering/2026-q2/`.
- **A newsletter and an RSS feed**: subscribe at the bottom of every page; the RSS feed exposes new content additions and quarterly reports.
- **GitHub Discussions** for every page: ask a question, propose a correction, or argue with a stance — every page now links to the discussion that pertains to it.
- **Edit-on-GitHub** links per page. The barrier to correcting a stale entry is now one click.

## The two killer features

### Pick Your Agent Stack (`/pick-stack/`)

Ten questions — latency target, isolation needs, language, budget posture, MCP support, sync vs async, scale, compliance, license preference, observability — produce a concrete stack recommendation: inference provider, sandbox, orchestrator, observability, memory, harness. Every recommendation also tells you why the eight alternatives lost in your particular case. The URL encodes your answers, so you can share a stack with your team and have them argue with the inputs rather than the output.

This is the page that doesn't exist on any competing reference site. Vendor blogs sell one answer; survey sites list every option without recommending one. Pick Stack lives in the gap.

### The Interactive Comparison Matrix (`/compare/`)

Sortable, filterable matrix of 40+ vendors across coding agents, inference, sandboxes, orchestrators, observability, memory, and gateways. Filter by isolation tier, dollar-per-PR, HITL support, MCP support, license, language. Sort columns. The dataset (`src/data/comparison.json`) is checked into the repo — every row carries a `lastVerified` date, and pull requests against the dataset are the canonical way to keep the matrix honest.

The static `comparison.md` page is gone. The matrix replaces it.

## Why we cut what we cut

We deleted three pages in this release. We want to be loud about why.

- **`content/comparison.md`** is gone because a static markdown table cannot match the reader's question. The interactive matrix at `/compare/` is the replacement; the data lives in `src/data/comparison.json`.
- **`content/sandboxes.md`** is folded into `content/infrastructure.md` as a featured subsection. Splitting it out implied sandboxes were a separate decision from the broader infra stack — they're not. They're a row in the same picker.
- **`content/organizations.md`** moves to an appendix of `content/harness-engineering.md`. The page was load-bearing in v1 because it was the only place to read about how teams structured their agent ops. It is now ten paragraphs at the bottom of the harness page, where the structural question actually arises.

Three deletions, no information lost. Reader cognitive load down. That is the editorial trade we want to make every release.

## How to contribute

We rewrote the contribution flow.

- Three new issue templates (`Suggest an addition`, `Report an incorrect claim`, `Propose a new page`) in `.github/ISSUE_TEMPLATE/`.
- A pull request template (`.github/PULL_REQUEST_TEMPLATE.md`) that walks contributors through the five commandments before a PR is opened.
- A `CONTRIBUTING.md` that documents the frontmatter schema, editorial commandments, review flow, branch naming convention, and how to run the build locally.
- A `scripts/check-hype-words.sh` CI check that fails any PR adding banned vocabulary to `content/`.

The bar for contributions is now explicit. The bar is also lower — a one-line correction with a primary-source link is welcome; we'll write the framing for you.

## Who reviewed this

The launch post and IA reshuffle were reviewed by people on the [Who's Who](../who-is-who.md) page who agreed to read it pre-launch. The thank-you list — and the credit for which arguments landed where — is in the README of the launch milestone.

(If you reviewed this post and want your name listed or hidden, open a PR — the README is in the repo.)

## What's next

The site has a quarterly cadence now. *State of Agentic Engineering 2026 Q3* lands in October. Between now and then:

- **Primary-Source Interview Series.** One transcript at launch (subject to be revealed in the announcement post). One per quarter after.
- **Pagefind search** with Cmd/Ctrl-K palette across all pages.
- **`/feed.xml`** RSS endpoint for changelog entries and quarterly reports.
- **More datasets.** The comparison matrix is the first machine-readable dataset on this site. The benchmark tracker is next.

If the site gets one thing right, it's this: the field is not short on excited essays. It is short on opinionated, primary-source-grounded, dated, decision-oriented references that respect a reader's time. That's the bet for v2 and every release after.

## Subscribe / discuss / contribute

- **Newsletter** — sign up at the bottom of any page; quarterly reports + monthly content roundups, no marketing emails.
- **RSS** — `/feed.xml` (lands with the Astro merge).
- **Discussions** — every page has a "Discuss this page" link to the GitHub Discussion for that slug.
- **Edit** — every page has an "Edit this page" link straight to the GitHub editor for that markdown file.
- **HN / X / Lobsters** — launch threads land on launch day; signal-boost from anyone tagged in the credits is appreciated.

We'll see you at Q3.

— Colin and the council

---

**See also**: [State of Agentic Engineering 2026 Q2](../state-of-agentic-engineering-2026-q2.md) · [Pick Your Stack](/pick-stack/) · [Compare](/compare/) · [Changelog](../changelog.md)
