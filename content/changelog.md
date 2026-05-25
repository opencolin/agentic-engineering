<!-- description: What's been added to the site, newest first. Content additions only — bug fixes, refactors, UX passes, and star refreshes are in git history but not tracked here. -->

# Changelog

What's been added to this site, newest first. Bug fixes, refactors, accessibility passes, sidebar restructures, and star-count refreshes happen in git history but aren't tracked here — this page is for **content additions** so you can see what's new to read.

Each entry links to the PR that shipped it. Authors: append your entry to the top under the current date when you merge.

This page has two timelines:

1. **[Site additions](#site-additions)** — when content was added to this site (newest first), keyed by PR.
2. **[Primary source timeline](#primary-source-timeline)** — when the underlying primary sources were originally published (oldest first), keyed by date.

---

## Primary source timeline

Publication dates of the primary sources that informed the polished pages. Compiled from [Research Notes](research-notes.md) (re-verify dates at primary source before citing). Most-impactful entries marked with **★** — these are the canonical-reference posts the rest of the site builds on.

### 2024

- `2024-12-19` — **★** [Building Effective Agents](https://anthropic.com/research/building-effective-agents)
  *Foundational pattern taxonomy — the entry point article for the whole site*
- `2024-12-20` — [Building effective agents (Simon Willison's commentary)](https://simonwillison.net/2024/Dec/20/building-effective-agents/)
  *The de facto vocabulary the field now uses for workflow-vs-agent design — required reference taxonomy*

### 2025

- `2025-01-14` — [Introducing Ambient Agents](https://blog.langchain.com/introducing-ambient-agents/)
  *UX/architecture pattern — provides the canonical "non-chat" agent interaction model and HITL vocabulary*
- `2025-04-20` — [How to Think About Agent Frameworks](https://blog.langchain.com/how-to-think-about-agent-frameworks/)
  *Framework taxonomy — clarifies "orchestration vs abstraction" axis when picking tools*
- `2025-06-13` — **★** [How We Built Our Multi-Agent Research System](https://anthropic.com/engineering/multi-agent-research-system)
  *The canonical orchestrator-worker case study with token-economics numbers*
- `2025-06-14` — [How we built our multi-agent research system (Simon's commentary)](https://simonwillison.net/2025/Jun/14/multi-agent-research-system/)
  *Single best public case study on production multi-agent research — concrete numbers (15× tokens, 90.2% lift, 90% time cut)*
- `2025-06-23` — [Inspect AI, An OSS Python Library For LLM Evals](https://hamel.dev/notes/llm/evals/inspect.html)
  *Concrete recommendation for the eval layer of an agent stack — production-grade, framework-agnostic*
- `2025-07-02` — **★** [Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/)
  *Foundational vocabulary — the write/select/compress/isolate taxonomy is the canonical framing*
- `2025-07-03` — **★** [Establishing Best Practices for Building Rigorous Agentic Benchmarks (ABC paper)](https://arxiv.org/abs/2507.02825)
  *Provides a vetted checklist for trustworthy agent evals — addresses the "looks great on benchmark, fails in prod" gap*
- `2025-07-09` — [How to Build an Agent](https://blog.langchain.com/how-to-build-an-agent/)
  *Onboarding — canonical "how do I start" sequence; useful as a default reading-list entry*
- `2025-09-11` — **★** [Writing Effective Tools for Agents — with Agents](https://anthropic.com/engineering/writing-tools-for-agents)
  *Reference for the tool-design chapter — "tools are software for agents" with measurement framework*
- `2025-09-29` — [Building Agents with the Claude Agent SDK](https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
  *Canonical "what is an agent loop" reference — slot directly under harness fundamentals*
- `2025-09-29` — **★** [Effective Context Engineering for AI Agents](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  *Founding doc for the context-engineering chapter — coins the "attention budget" framing*
- `2025-10-16` — **★** [Equipping Agents with Agent Skills](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
  *Canonical reference for the Skills mechanism — paired with code-execution-with-mcp*
- `2025-10-20` — [Beyond Permission Prompts: Sandboxing Claude Code](https://anthropic.com/engineering/claude-code-sandboxing)
  *Reference architecture for the security/isolation slot — paired with auto-mode for the autonomy story*
- `2025-10-28` — [Doubling Down on Deep Agents](https://blog.langchain.com/doubling-down-on-deepagents/)
  *Origin of the "harness" framing — establishes Deep Agents as a harness, not a framework competitor*
- `2025-11-04` — **★** [Code Execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp)
  *Argument and numbers for replacing direct tool calls with code-as-tool — central to context-engineering chapter*
- `2025-11-24` — [Advanced Tool Use on the Claude Developer Platform](https://anthropic.com/engineering/advanced-tool-use)
  *Concrete numbers for the "tools as context burden" pattern — supports the case for lazy tool loading*
- `2025-11-26` — [Effective Harnesses for Long-Running Agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  *Concrete recipe for cross-session continuity in long-running coding agents*
- `2025-12-02` — [State of Agent Engineering (LangChain survey, fielded Nov 18 – Dec 2)](https://langchain.com/state-of-agent-engineering)
  *Hard 2025 industry baseline — production %, observability %, model-mix, and use-case mix you can quote*
- `2025-12-03` — [Evaluating Deep Agents — Our Learnings](https://blog.langchain.com/evaluating-deep-agents-our-learnings/)
  *Eval lesson — concrete proof that single-step decision evals are the high-leverage entry point*

### 2026

- `2026-01-09` — [Demystifying Evals for AI Agents](https://anthropic.com/engineering/demystifying-evals-for-ai-agents)
  *Canonical eval-design primer — paired with the BrowseComp and infrastructure-noise posts*
- `2026-01-21` — [Designing AI-Resistant Technical Evaluations](https://anthropic.com/engineering/AI-resistant-technical-evaluations)
  *Eval-design lesson — how to write tasks that still discriminate humans from frontier models*
- `2026-01-28` — [Context Management for Deep Agents](https://blog.langchain.com/context-management-for-deepagents/)
  *Deep-agents lesson — concrete numbers (20K tokens, 85% threshold, 10-line preview) for compress + isolate*
- `2026-02-05` — [Building a C Compiler with a Team of Parallel Claudes](https://anthropic.com/engineering/building-c-compiler)
  *Reference example of multi-agent autonomous large-codebase work with cost/scale numbers*
- `2026-02-05` — [Quantifying Infrastructure Noise in Agentic Coding Evals](https://anthropic.com/engineering/infrastructure-noise)
  *Critical eval-hygiene caveat — required reading before citing leaderboard deltas*
- `2026-02-12` — [On Agent Frameworks and Agent Observability](https://blog.langchain.com/on-agent-frameworks-and-agent-observability/)
  *Observability framing — the "logic lives in traces" line is the strongest one-liner for why observability is first-class*
- `2026-02-17` — [Improving Deep Agents with Harness Engineering](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/)
  *Harness pattern — flagship case study showing harness changes alone can deliver double-digit benchmark gains*
- `2026-03-05` — [Evaluating Skills](https://blog.langchain.com/evaluating-skills/)
  *Skills design — the ~12-skill ceiling and 70% invocation reliability are useful empirical bounds*
- `2026-03-06` — [Eval Awareness in Claude Opus 4.6's BrowseComp Performance](https://anthropic.com/engineering/eval-awareness-browsecomp)
  *Eye-opening eval-integrity case study — model behavior + how benchmarks leak*
- `2026-03-10` — **★** [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
  *Definitional — the canonical "what is a harness" reference; sets the vocabulary the other harness-engineering posts build on*
- `2026-03-24` — [Harness Design for Long-Running Application Development](https://anthropic.com/engineering/harness-design-long-running-apps)
  *Reference for multi-agent harness design with real cost/time numbers — pairs with effective-harnesses post*
- `2026-03-25` — [Claude Code Auto Mode: a Safer Way to Skip Permissions](https://anthropic.com/engineering/claude-code-auto-mode)
  *Concrete pattern for replacing permission prompts with classifier-mediated autonomy*
- `2026-03-26` — [How Middleware Lets You Customize Your Agent Harness](https://blog.langchain.com/how-middleware-lets-you-customize-your-agent-harness/)
  *Harness pattern — the six-hook taxonomy is the canonical reference for "where do I put this customization?"*
- `2026-03-26` — [How We Build Evals for Deep Agents](https://blog.langchain.com/how-we-build-evals-for-deep-agents/)
  *Eval architecture — concrete category and metric scheme to copy when designing a project's eval taxonomy*
- `2026-03-27` — [Agent Evaluation Readiness Checklist](https://blog.langchain.com/agent-evaluation-readiness-checklist/)
  *Eval lesson — readiness gate before automating eval infra; pairs with the "harness hill-climbing" post*
- `2026-04-02` — **★** [Open Models Have Crossed a Threshold](https://blog.langchain.com/open-models-have-crossed-a-threshold/)
  *Model behavior — concrete cost/perf table for the "should I use open models?" decision*
- `2026-04-03` — [Production Agents Self-Heal](https://blog.langchain.com/production-agents-self-heal/)
  *Ops pattern — concrete recipe for an auto-remediation loop using a coding agent as the fixer*
- `2026-04-05` — [Continual Learning for AI Agents](https://blog.langchain.com/continual-learning-for-ai-agents/)
  *Mental model — the three-layer separation is a clean way to organize "how agents improve" sections*
- `2026-04-07` — [Deep Agents v0.5](https://blog.langchain.com/deep-agents-v0-5/)
  *Version milestone — async-subagent primitive is the v0.5-specific feature worth pinning*
- `2026-04-08` — [Better Harness — Hill-Climbing with Evals](https://blog.langchain.com/better-harness-a-recipe-for-harness-hill-climbing-with-evals/)
  *Harness pattern — concrete recipe for moving harness changes through eval gates rather than vibes*
- `2026-04-08` — [Scaling Managed Agents: Decoupling the Brain from the Hands](https://anthropic.com/engineering/managed-agents)
  *Defines a reference architecture (session/harness/sandbox) for production agent systems*
- `2026-04-16` — [The Complete Guide to Harness Engineering (claudecode-lab)](https://claudecode-lab.com/en/blog/claude-code-harness-engineering/)
  *Most concrete public reverse-engineering of Claude Code's harness — transferable blueprint*

**Total: 43 dated primary sources.** See [Research Notes](research-notes.md) for the full structured digest per source (key claims, frameworks named, quotable lines, frameworks/concepts cataloged).

**Sources not in this timeline:** vendor / framework docs pages (no single publish date — continuously updated); GitHub repo READMEs (use last-commit date if needed); blog/newsletter homepages (use most-recent-post date); YouTube channels and podcast index pages. All catalogued in [Research Notes](research-notes.md) regardless.

---

## Site additions

## 2026-05-25 (later)

### Tool Design: MCP elevated to lead section — [#26](https://github.com/opencolin/agentic-engineering/pull/26)
MCP was buried at section 9 of 10. Promoted to the first major section after the intro ("MCP — the wire format you're writing tools in") and substantially expanded with: the Nov 2024 Anthropic launch + late-2025 adoption inflection, the "you're writing MCP whether you know it or not" framing, an anatomy-of-an-MCP-tool example, the Arcade / Composio governance runtime layer, and a curated reading list. Table of Contents reordered to match.

### Changelog: added Primary Source Timeline — [#26](https://github.com/opencolin/agentic-engineering/pull/26)
43 dated primary sources from `research-notes.md` arranged chronologically (Dec 2024 → Apr 2026), each with a one-line topic note and the canonical reference posts marked with **★**. The page now has two timelines: site additions (when *we* added it) and primary sources (when the field originally published it).

### Lost-content rescue + docs/ preservation — [#26](https://github.com/opencolin/agentic-engineering/pull/26)
Audit of `docs/` vs `content/` found that commit `1bb1bcb` had accidentally deleted three tables (Feature Matrix, Capability Breakdown, Composability) from `approaches.md` that PR #3 explicitly merged in. Only surviving copy was in `docs/comparison.mdx` (the never-deployed Starlight parallel). Restored to end of `approaches.md`. Also ported all 24 SEO description fields from `docs/.../*.mdx` frontmatter into `content/*.md` as invisible HTML comments so the metadata survives any future migration.

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
