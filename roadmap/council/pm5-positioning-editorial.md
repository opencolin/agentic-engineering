<!-- description: PM Council Report #5 — Strategic positioning and editorial voice lens for v2. -->

# PM #5 — Positioning & Editorial Voice

**Lens:** Why the site exists, in whose voice, vs whom.
**Author:** PM Council subagent (general-purpose), `agentId: aa1f48d0a301011b6`
**Status:** Read-only research; no files modified.

---

## 1. Positioning Statement

**Agentic Engineering is the field manual for the engineer who has to ship an agent on Monday** — the operator who already knows what an LLM is and now needs to pick a sandbox, decide between A2UI and MCP-UI, and understand why Stripe's harness beats their own. Unlike Anthropic's and OpenAI's docs (product-scoped), LangChain's docs (framework-scoped), Lilian Weng / Simon Willison (single-author essays without a stack-level map), and awesome-lists (uncurated link graveyards), this site is **the only opinionated, cross-vendor, architecture-first reference where every page ends in a decision**. It's not "what exists"; it's "what to build, what to skip, and why."

## 2. Editorial Voice Commandments

1. **Every page ends in a decision framework.** "If X, pick Y; if Z, pick W." If we can't make a recommendation, we don't publish the page.
2. **Name the loser.** Comparison pages must say which vendor/pattern *not* to use and why. Hedging is the failure mode of every competing reference.
3. **Primary sources or it didn't happen.** Every load-bearing claim cites a commit, a docs page, a conference timestamp, or a postmortem — not a tweet, not a blog reaction.
4. **No hype vocabulary.** Banned: *revolutionary, game-changing, paradigm shift, unlock, supercharge, leverage (as verb), AI-powered.* Voice is the engineering-leader-at-a-whiteboard.
5. **Date-stamp everything and expire it.** Each page header carries "Last verified" + "Stale by". Past the stale date → banner. Credibility is the half-life of claims.

## 3. Top 5 Strategic Content Bets

1. **The Harness Engineering Canonical Reference** — turn `harness-engineering.md` into the *Designing Data-Intensive Applications* of agent harnesses. The moat.
2. **"Pick Your Agent Stack" interactive decision tree** — 8–12 questions outputs a concrete stack: inference provider, sandbox, orchestrator, observability, memory. Shareable URL per result. Beats every static comparison matrix.
3. **The Quarterly State of Agentic Engineering report** — branded, dated, downloadable, charts. Four shots/year at being The Authority.
4. **Failure Mode Catalogue with reproductions** — each failure (context poisoning, tool selection collapse, loop divergence, sandbox escape) gets a minimal repro + the harness pattern that prevents it. What engineers Google at 2am.
5. **Primary-Source Interview Series** — 30-min recorded calls with Cherny, Vincent, Steinberger, Chase, Polosukhin. Transcripts + pull-quotes. Relational, not informational — uncopyable.

## 4. Deprecate / Cut / Merge

- **Cut `comparison.md`.** Its feature matrix duplicates `approaches.md` and `infrastructure.md`. Replace with the interactive decision tree (bet #2).
- **Merge `sandboxes.md` into `infrastructure.md`** as a featured subsection.
- **Demote `organizations.md`** to an appendix of `harness-engineering.md`. "The Stripe Model" is really a harness story.
- **Cut the `approaches.md` long tail** — keep the top 8 with editorial commitment; demote the rest to a one-line directory with external links.
- **Kill the `who-is-who.md` Appendix** of "people we considered but didn't profile." Either profile them or don't.
- **Merge `benchmarks.md` into `harness-engineering.md`** as the verification chapter.

## 5. Defensibility — Pick One

**Primary-source access.** In 18 months any model can re-synthesize public docs better than we can. What models can't do is get Boris Cherny on a call, or have Peter Steinberger redline a draft pre-publication. The moat is **a relationship graph with the 20 people in Who's Who**, monetized as: pre-publication review credits, named interviews, "X reviewed this page" bylines. Curation decays; relationships compound.

## 6. v2 Launch Narrative

> Agentic Engineering v2 is the opinionated field manual for shipping agents in production — every page now ends in a decision, every claim cites a primary source, and every quarter we publish a dated State-of-the-Field report you can hand your CTO. We cut the awesome-list sprawl, doubled down on Harness Engineering as the canonical longform, and added an interactive stack-picker that replaces our old comparison matrix. If you're choosing a sandbox, a model router, or an orchestration framework this week — start here, decide in an hour, ship on Monday.
