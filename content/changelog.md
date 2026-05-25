<!-- description: What's been added to the site, newest first. Content additions only — bug fixes, refactors, UX passes, and star refreshes are in git history but not tracked here. -->

# Changelog

What's been added to this site, newest first. Bug fixes, refactors, accessibility passes, sidebar restructures, and star-count refreshes happen in git history but aren't tracked here — this page is for **content additions** so you can see what's new to read.

Each entry links to the PR that shipped it. Authors: append your entry to the top under the current date when you merge.

---

## 2026-05-25

### Six research-driven Landscape pages — [#24](https://github.com/opencolin/agentic-engineering/pull/24)
Distilled from the 109-source ingestion in #23. New pages: **Context Engineering**, **Tool Design**, **Skills**, **Memory**, **Evals** (Landscape group); **Reading List** (Get Started group). Each page anchors to specific empirical numbers — e.g. Tool Search Tool's -85% token reduction, Skills' 82% vs 9% lift, the pass@k vs pass^k reliability gap.

### Research Notes bibliography — [#23](https://github.com/opencolin/agentic-engineering/pull/23)
Structured digest of 109 primary sources across six parallel ingestion passes (Anthropic Engineering, LangChain blog, individual articles + arxiv, GitHub repos + docs, blogs + newsletters, tools + platforms). Per-entry format: URL, fetch status, key claims with specific numbers, frameworks named, "which slot it fills." Lives under the new **Reference** sidebar group.

### Models reference page — [#22](https://github.com/opencolin/agentic-engineering/pull/22)
New **Models** page (Landscape group) with three tables: closed-source frontier, open-weights frontier, agent/coding specialists. Anthropic and Google prices verified at primary source; OpenAI/xAI/OSS rows link to lab pricing pages. Includes a 5-rule cost-discipline decision rule and a "decision shortcuts" routing table.

### Who's Who: 5 new profiles — [#21](https://github.com/opencolin/agentic-engineering/pull/21)
Added Hamel Husain (eval methodology), Eugene Yan (applied LLM systems), Erik Schluntz (Claude Code), Sahil Trivedy (Operator), Charlie Martin (CodeBuff). Brings Who's Who from 20 to 25 profiles.

### Benchmarks: 9-row "Other benchmarks worth knowing" roundup — [#20](https://github.com/opencolin/agentic-engineering/pull/20)
Added BFCL, GAIA, BrowseComp, CORE, MLE-bench, ScienceAgentBench, OSWorld, Sweep, plus a caveats section on infrastructure noise and eval awareness.

### Five framework entries to Approaches — [#19](https://github.com/opencolin/agentic-engineering/pull/19)
Added Claude Agent SDK, Deep Agents, DSPy + GEPA, Smolagents, and the LangChain `create_agent` primitive. Closes the gap-pass II checklist from the roadmap.

### Harness Engineering: First Principles preamble — [#17](https://github.com/opencolin/agentic-engineering/pull/17)
Five-claim preamble at the top of harness-engineering.md anchoring the rest of the page (model ≠ system, harnesses encode stale assumptions, etc.).

### Events page + Events/GitHub icon buttons — [#18](https://github.com/opencolin/agentic-engineering/pull/18)
New **Events** page (Get Started group) with the agent-event calendar.

### Roadmap gap-pass — [#16](https://github.com/opencolin/agentic-engineering/pull/16)
Added Letta, Inngest + Temporal, Tavily, Inspect AI, τ-bench, plus 5 additional frameworks/agents to fill earlier roadmap gaps.

---

## 2026-05-24 (and earlier May 2026)

### Chrome DevTools MCP added to Browser-Use frameworks — [#13](https://github.com/opencolin/agentic-engineering/pull/13)
New row in the Browser-Use & Computer-Use Frameworks table on Approaches.

### Bumblebee (Perplexity) and Kimi Agent Swarm (Moonshot) added to Infrastructure — [#11](https://github.com/opencolin/agentic-engineering/pull/11)
Two new entries in the Infrastructure chapter.

### PostHog Code added to Approaches — [#10](https://github.com/opencolin/agentic-engineering/pull/10)
New commercial / proprietary Coding CLI entry.

### Generative UI chapter
New chapter under Interfaces, with CopilotKit + A2UI as the reference example.

### Nebius events + SIGGRAPH 2026 added to Events
Extends the event calendar with sponsored and conference entries.

### Events page (initial)
First version of the Events page with global map + chronological list.

### Table of Contents page
Top-level TOC under Get Started, with a "this reference" framing sweep.

### Who's Who expansion 12 → 20 + Schools page added
New **Schools** page (Landscape group) for intellectual lineages. Who's Who grew from 12 to 20 named profiles.

### Who's Who page (initial)
First version with 12 profiles + suggested reading order.

### Hermes Agent deep dive
Long-form treatment of Hermes Agent inside the harness landscape.

### Superpowers, Everything-Claude-Code, Hermes, DeerFlow + Steinberger School
Five new agent / harness entries plus the Steinberger School treatment.

### GStack, GBrain, AgentHub
Three end-to-end Claude Code harnesses added to Approaches.

### Harness Engineering deep dive page
First version of the **Harness Engineering** page (Landscape group).

### Warp Oz + Warp ADE
New Warp entries in Approaches.

---

## 2026-05-07

### Four new chapters: Skills/Plugins, Browser-Use, MCP, Identity/Auth
Foundational chapters added across Approaches and Infrastructure.

### Q4'25-Q2'26 entries to existing categories
Backfill of recent releases across multiple chapters.

### Blaxel, Orchestrator.build, SmolVM, Kubernetes Sandbox CRD
Four new Infrastructure entries.

---

## 2026-04-20

### VPS-for-agents deep dive
New Hosting & Execution treatment.

---

## How to update this page

When you merge a content-addition PR, prepend an entry at the top under the current date:

```markdown
## YYYY-MM-DD

### Short title — [#NN](link-to-PR)
1-2 line description of what was added. Anchor to a specific number,
framework, page, or section so the entry is scannable.
```

Skip entries for:
- Bug fixes (broken links, typos, build errors)
- Pure refactors (page merges, sidebar reorders without new content)
- UX / accessibility / mobile / styling
- Star count refreshes
- Tooling (CI, lint, build config)

These all live in `git log` if anyone needs them.
