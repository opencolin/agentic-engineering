<!-- description: A comprehensive reference to autonomous coding agents, agentic organizations, and the emerging patterns of AI-native software engineering. -->

# Automate Engineering

*A reference for agentic engineering.*

<p class="sponsor-banner">Sponsored by <a href="https://nebius.com/" target="_blank" rel="noopener" aria-label="Nebius"><img src="img/nebius-logo.svg" alt="Nebius" class="sponsor-logo" /></a></p>

A comprehensive reference to autonomous coding agents, agentic organizations, and the emerging patterns of AI-native software engineering.

**Just want recommendations?** → **[Top Picks](top-picks.md)** — opinionated, star-rated editorial picks for each category (frontier models, coding agents, sandboxes, CI runners, observability, evals, memory, safety, code reviewers, self-hosted inference). Skips the methodology; points at what to use.

---

## Chapters

| # | Chapter | What's in it |
|---|---------|--------------|
| 1 | [Approaches](approaches.md) | Deep dives on 30+ coding-agent systems — Stripe Minions, Claude Managed Agents, Vercel Open Agents, OpenAI Symphony, OpenHands, Hermes Agent, GStack, GBrain, AgentHub, the Steinberger ecosystem, and the 28-CLI harness comparison |
| 2 | [Models](models.md) | The model layer underneath — closed-source frontier (Anthropic / Google / OpenAI / xAI), open-weights (DeepSeek / Qwen / Llama / Kimi / GLM / MiniMax / Mistral), and agent / coding specialists; with pricing and decision shortcuts |
| 3 | [Patterns](patterns.md) | Cross-cutting architectural patterns — harness engineering, isolation strategies, orchestration models, context management, feedback loops, failure recovery, multi-agent coordination |
| 4 | [Harness Engineering](harness-engineering.md) | The deep-dive page on what makes agents reliable — five-subsystem model, repo-as-system-of-record, WIP=1, three-layer verification, sprint contracts, clean-state exits |
| 5 | [Context Engineering](context-engineering.md) | The named discipline of curating what's in the window — write / select / compress / isolate; attention budget; 95% / 85% compaction thresholds; the four context failure modes |
| 6 | [Tool Design](tool-design.md) | How to write tools agents use well — consolidated actions, ResponseFormat compression, Tool Search Tool (-85% tokens), code-as-tool sandbox pattern (150K → 2K), Tool Use Examples (+18pp) |
| 7 | [Skills](skills.md) | The cross-vendor primitive (Anthropic open standard, Dec 2025) for capability packaging — SKILL.md format, progressive disclosure, the 82% vs 9% lift, the ~12-skill ceiling |
| 8 | [Memory](memory.md) | Persistent state across turns and sessions — three-axis taxonomy, episodic / procedural / semantic split, vendor map (Letta, Mem0, LangMem, LangGraph Store, Anthropic memory tool), filesystem-as-memory |
| 9 | [Evals](evals.md) | How to measure agent quality (distinct from benchmarks) — pass@k vs pass^k, three silent invalidators (grading bugs, infra noise, eval awareness), tooling map (Inspect AI, LangSmith, Braintrust, Langfuse, Phoenix) |
| 10 | [Benchmarks](benchmarks.md) | SWE-bench, SWE-bench Verified / Pro / Multimodal / Multilingual, Terminal Bench 2.0, τ-Bench, plus a 9-row "other benchmarks worth knowing" roundup; how to read the leaderboards and what they actually mean |
| 11 | [Schools](schools.md) | Where does trust live? The three philosophical schools (Polosukhin / Chase / Ng) and the four operational schools (Stripe / Tan / Walking Labs / Steinberger) |
| 12 | [Who's Who](who-is-who.md) | 29 named profiles of the people shaping the field — researchers, operators, chroniclers — with the single thing of theirs to read or watch first |
| 13 | [Organizations](organizations.md) | How companies organize around agents — Stripe model, open-source model, agent-first development, infrastructure tiers |
| 14 | [Inference](inference.md) | LLM inference solutions: direct API providers, platforms (Nebius, Together, Fireworks, Groq), routing gateways, self-hosted inference |
| 15 | [Sandboxes](sandboxes.md) | The execution-environment layer — purpose-built agent sandboxes, Contree deep dive, CDEs, isolation tiers, integration patterns |
| 16 | [Hosting & Execution](infrastructure.md) | 150+ infrastructure vendors across 9 categories — turnkey platforms, agent-optimized hosting, orchestration, Cloud Mac, GPU clouds, VPS for agents, memory, observability, MCP, identity/auth |
| 17 | [Generative UI](generative-ui.md) | The agent's front-end story — Static, Declarative (A2UI), Open-ended patterns; CopilotKit, AG-UI, A2UI, MCP-UI; Vercel AI SDK; trade-offs between consistency and flexibility |
| 18 | [Research Notes](research-notes.md) | Source-of-truth bibliography: structured digest of 100+ primary sources behind everything above — key claims, specific numbers, frameworks named, "which slot it fills" |

**Also worth knowing:** [Top Picks](top-picks.md) — opinionated star-rated recommendations per category · [Reading List](reading-list.md) — curated newsletters, blogs, podcasts, courses, communities, and reference repos · [Changelog](changelog.md) — what's been added to this site, newest first.

The [Approaches](approaches.md) chapter surveys 30+ agentic systems, organized by category in its Index — commercial vs. open-source vs. harness packs.

If you're new to the field, the suggested reading order is Chapter 1 (Approaches) → Chapter 4 (Harness Engineering) → Chapter 5 (Context Engineering) → Chapter 11 (Schools) → then any others by interest. Chapter 12 (Who's Who) doubles as a "what to read next" map keyed to specific authors; [Reading List](reading-list.md) is the broader source map.

---

## What is Agentic Engineering?

Agentic engineering is the practice of using autonomous AI agents to write, test, and ship production code with minimal human intervention. Unlike interactive AI assistants (copilots), agentic systems take a task description and produce a complete pull request — running tests, fixing linter errors, and iterating on CI failures along the way.

The shift from "human writes code with AI help" to "AI writes code with human review" is fundamentally changing how engineering organizations operate, enabling parallelization of work that was previously bottlenecked on developer attention.

## Core Concepts

- **One-Shot Execution** — Agents take a task and produce a PR end-to-end, with no human interaction in between. Engineers spin up many agents in parallel.
- **Sandbox Isolation** — Each agent runs in an isolated environment — devboxes, Docker containers, or git worktrees — safely separated from production.
- **Feedback Loops** — Agents iterate against linters, tests, and CI pipelines. Local checks catch issues fast; CI provides the final validation gate.
- **Context via MCP** — Model Context Protocol provides agents with docs, tickets, code intelligence, and internal tools through a standard interface.
- **Orchestration** — Blueprints, patchflows, and workflow graphs interleave deterministic steps with agentic creativity for reliable execution.
- **Failure Recovery** — Structured retry, split, escalate, and accept-with-debt strategies handle the inevitable failures in autonomous systems.

## The Agentic Engineering Flow

Most autonomous coding agents follow a similar high-level pipeline:

```
Task Input → Context Gathering → Planning → Implementation → Local Testing → CI Validation → Pull Request
```

The key differentiators between approaches lie in **how they handle failure** at each stage, **how they manage context** within the LLM's window, and **how they isolate** parallel agent runs.

## Sections

### [Approaches](approaches.md)
Deep dives into each major system and framework:
- [Stripe Minions](approaches.md#stripe-minions) — 1,300+ PRs/week, blueprints, devboxes, Toolshed MCP
- [AgentField](approaches.md#agentfield) — Open-source control plane with three nested failure loops
- [OpenHands](approaches.md#openhands) — 75K stars, most mature open-source autonomous engineer
- [Open SWE](approaches.md#open-swe-langchain) — LangChain's multi-agent async coding agent
- [OhMyOpenAgent](approaches.md#ohmyopenagent) — 59K stars, named specialist agents, hash-anchored edits
- [OpenCode](approaches.md#opencode) — 165K stars, provider-agnostic with GitHub agent mode
- [SWE-agent](approaches.md#swe-agent) — Princeton/Stanford, pioneered issue-to-PR paradigm
- [Composio](approaches.md#composio-agent-orchestrator) — Best multi-agent parallelization
- [Patchwork](approaches.md#patchwork) — Patchflows, closest to Stripe's blueprint pattern
- [Goose](approaches.md#goose) — MCP-native, the ancestor Stripe forked for Minions
- [Claude Managed Agents](approaches.md#claude-managed-agents) — Anthropic's vertically integrated harness + sandbox + tools, $0.08/agent-hour, Notion/Rakuten/Asana as early adopters
- [Vercel Open Agents](approaches.md#vercel-open-agents) — 5.5K stars, MIT-licensed reference template, "agent outside the sandbox" architecture, durable workflows + Vercel Sandbox + GitHub App
- [OpenAI Symphony](approaches.md#openai-symphony) — 25K stars, 6-layer orchestration, work management over agent supervision
- [DSPy + GEPA](approaches.md#dspy-gepa) — 34.6K stars, Stanford NLP's programmatic LLM framework + Pareto-genetic prompt/topology optimizer (ICLR 2026 oral)
- [Smolagents](approaches.md#smolagents) — 27.5K stars, HuggingFace's ~1K-LOC hackable code-agent reference (the harness floor in Anthropic's 42% Opus 4.5 study)
- [OpenAI Agents SDK](approaches.md#openai-agents-sdk) — 27K stars, first-party OpenAI framework; production successor to Swarm
- [Mastra](approaches.md#mastra) — 24K stars, TypeScript framework for building custom agent systems
- [Deep Agents (LangChain)](approaches.md#deep-agents-langchain) — 23.3K stars, batteries-included open harness on LangGraph; planning + virtual FS + sub-agents as middleware
- [Google ADK](approaches.md#google-adk-agent-development-kit) — 20K stars, Google's first-party Gemini-native framework
- [Claude Agent SDK](approaches.md#claude-agent-sdk) — 7K (Python) + 1.5K (TS), Anthropic's first-party SDK — the same harness inside Claude Code
- [Strands Agents](approaches.md#strands-agents) — 5.9K stars, AWS-incubated SDK with first-class Lambda / Fargate / Bedrock AgentCore deployment
- [Cline](approaches.md#cline) — 62K stars, plan-then-act with explicit user approval; Roo Code sister project at 24K
- [Letta Code](approaches.md#letta-code) — 23K stars, memory-first coding agent built on the MemGPT lineage
- [OpenClaw](approaches.md#openclaw) — 374K stars, self-hosted assistant with messaging integration
- [Rivet Sandbox Agent](approaches.md#rivet-sandbox-agent) — Universal API for running agents in sandboxes
- [DeerFlow](approaches.md#deerflow) — ByteDance's open-source long-horizon SuperAgent harness, LangGraph-based, 69K stars
- [GStack](approaches.md#gstack) — Garry Tan's 23-skill Claude Code setup, MIT, 102K stars; CEO / Designer / Eng Manager / QA personas, paired with Conductor for 10–15 parallel sprints
- [GBrain](approaches.md#gbrain) — Garry Tan's persistent-memory companion to GStack, MIT, 19K stars; self-wiring typed knowledge graph + 29 skills + Postgres-native "Minions" job queue; *"the engine is GStack; GBrain is the mod"*
- [Superpowers](approaches.md#superpowers) — Jesse Vincent's agentic skills framework + software-development methodology, 205K stars; design-then-implement gates, TDD enforcement
- [Everything Claude Code](approaches.md#everything-claude-code) — Affaan M.'s security-auditing harness pack, 190K stars; scans CLAUDE.md / settings.json / MCP configs / hooks / agents with red-team/blue-team/auditor pipeline
- [Hermes Agent](approaches.md#hermes-agent) — Nous Research's self-improving personal agent, MIT, 165K stars; autonomous skill curation on a 7-day cycle, three-layer memory, 6 terminal backends
- [AgentHub](approaches.md#agenthub) — Electron harness-engineering control plane (Skills + Hooks + FileWatcher + 7-gate pipeline) on top of Claude Code CLI, 46-agent org chart
- [The Steinberger School](approaches.md#the-steinberger-school) — Peter Steinberger's AI Software Factory pattern: ~100 Codex agents + Crabbox / Clawpatch / ClawSweeper running OpenClaw on a $1.3M/month budget with ~3 engineers
- [Crabbox](approaches.md#crabbox) — Ephemeral test-box control plane with diff sync, multi-provider runners, Windows + Linux, native OpenClaw plugin
- [Clawpatch](approaches.md#clawpatch) — Automated code review via semantic feature slicing + explicit fix loop
- [ClawSweeper](approaches.md#clawsweeper) — Conservative issue/PR triage bot — six narrow close cases, never touches maintainer items

### [Patterns](patterns.md)
Cross-cutting architectural patterns:
- [Harness Engineering](patterns.md#harness-engineering) — The overarching discipline: code as context, spec-driven software, encoded engineering taste
- [Isolation Strategies](patterns.md#1-isolation-strategies) — Devboxes vs Docker vs worktrees vs cloud sandboxes
- [Orchestration Models](patterns.md#2-orchestration-models) — Blueprints, patchflows, LangGraph, multi-agent teams
- [Context Management](patterns.md#3-context-management) — MCP, rule files, pre-hydration, hierarchical context
- [Feedback Loops](patterns.md#4-feedback-loops) — Shift-left, iteration caps, auto-fixes
- [Failure Recovery](patterns.md#5-failure-recovery) — Retry, typed recovery, three nested loops, checkpoints
- [Multi-Agent Coordination](patterns.md#6-multi-agent-coordination) — Worktree isolation, intent-aware merging, task decomposition

### [Harness Engineering](harness-engineering.md)
Deep dive on the practice that makes agents reliable — synthesizes OpenAI's *Harness Engineering*, Anthropic's *Effective Harnesses for Long-Running Agents* / *Harness Design for Long-Running Application Development*, and the Walking Labs course:
- [Why Harness Beats Model Upgrade](harness-engineering.md#why-harness-beats-model-upgrade) — Anthropic's bare-vs-three-agent experiment, OpenAI's million-line build
- [The Five-Subsystem Model](harness-engineering.md#the-five-subsystem-model) — Instructions, Tools, Environment, State, Feedback; isometric model control
- [Foundations](harness-engineering.md#foundations) — Repo as system of record, progressive disclosure, initialization as a phase, cross-session continuity, context anxiety
- [Scope and Verification](harness-engineering.md#scope-and-verification) — WIP=1, feature lists as primitives, three-layer termination check, worker-vs-checker separation
- [Observability Inside the Harness](harness-engineering.md#observability-inside-the-harness) — Sprint contracts, evaluator rubrics, OpenTelemetry
- [The Session Lifecycle and Clean State](harness-engineering.md#the-session-lifecycle-and-clean-state) — Five clean-state dimensions, dual-mode cleanup, harness simplification
- [Reference Stack](harness-engineering.md#the-reference-stack) — The minimal five-file pack and the tooling that implements each subsystem
- [Failure-Mode Catalogue](harness-engineering.md#failure-mode-catalogue) — Symptom → subsystem → fix table for the diagnostic loop

### [Benchmarks](benchmarks.md)
How agentic coding systems are measured:
- [SWE-bench](benchmarks.md#swe-bench) — Real GitHub issues from 12 Python repos; the standard coding-agent leaderboard
- [SWE-bench Verified](benchmarks.md#variants) — 500 human-filtered instances, the metric production agents publish
- [Terminal Bench](benchmarks.md#terminal-bench) — Stanford × Laude, 89 tasks spanning software eng, security, sysadmin, data science, ML
- [Choosing a benchmark](benchmarks.md#choosing-a-benchmark) — Matching benchmark to what you care about

### [Organizations](organizations.md)
How companies organize around agents:
- [The Stripe Model](organizations.md#the-stripe-model) — How Stripe built an agentic engineering org
- [The Open-Source Model](organizations.md#the-open-source-startup-model) — Composable alternatives for startups
- [Organizational Patterns](organizations.md#organizational-patterns) — Agent as team member, agent swarm, agent-assisted on-call
- [Infrastructure You Need](organizations.md#the-infrastructure-you-need) — Must-have, should-have, nice-to-have

### [Sandboxes](sandboxes.md)
Dedicated deep-dive on sandbox infrastructure — the single most important layer for autonomous agents:
- [Why Sandboxes Matter](sandboxes.md#why-sandboxes-matter-for-agents) — Safe execution, reproducibility, state, observability
- [Sandbox Market Structure](sandboxes.md#the-sandbox-market-structure) — Four-layer model: primitives, agent-sandbox platforms, embedded-in-agent-products, and model-provider managed agents (Claude Managed Agents)
- [Core Use Cases](sandboxes.md#core-use-cases) — 10 use cases including tree-of-thought, SWE-bench eval, best-of-N sampling, training data generation, reproducibility
- [Isolation Tiers](sandboxes.md#isolation-tiers-the-security-ladder) — Process → container → gVisor → microVM → VM → bare metal
- [Purpose-Built Agent Sandboxes](sandboxes.md#purpose-built-agent-sandboxes) — 14 vendors with isolation, persistence, cold start, GPU data
- [Contree Deep Dive](sandboxes.md#contree-the-git-native-sandbox) — Git-native sandboxing, 7,000+ SWE-bench environments, where it wins vs E2B
- [Cloud Dev Environments](sandboxes.md#cloud-development-environments-cdes) — Persistent dev envs (Codespaces, Gitpod, Coder, Vercel Sandbox)
- [Agent Patterns](sandboxes.md#agent-patterns-enabled-by-modern-sandboxes) — Checkpoint-explore-commit, golden pool, destructive safety, sandbox-as-context
- [Integration Examples](sandboxes.md#integration-examples) — MCP, Python SDK, custom harness patterns

### [Inference](inference.md)
LLM inference solutions for agent workloads:
- [Direct API Providers](inference.md#direct-api-providers) — Anthropic, OpenAI, Google, xAI, DeepSeek
- [Inference Platforms](inference.md#inference-platforms) — Together, Fireworks, Groq, Cerebras, Nebius
- [Nebius AI Cloud](inference.md#nebius-ai-cloud-standout-platform) — Standout platform for agentic engineering at scale
- [Routing & Gateway](inference.md#routing-gateway-solutions) — LiteLLM, OpenRouter, Portkey, Kalibr
- [Self-Hosted Inference](inference.md#self-hosted-inference) — vLLM, SGLang, Ollama, TGI, llama.cpp
- [Inference Strategy](inference.md#inference-strategy-for-agents) — Tiered model routing and cost optimization

### [Hosting & Execution](infrastructure.md)
Where agents actually run — 150+ vendors across 9 major categories:
- [Hosting Decision Framework](infrastructure.md#the-hosting-decision-framework) — Turnkey, Agent-Optimized, Sandbox, Serverless, Cloud Mac, Self-Hosted
- [Code Execution Sandboxes](infrastructure.md#code-execution-sandboxes) — 14 purpose-built sandboxes including [Contree](sandboxes.md#contree-the-git-native-sandbox) (Git-like branching from Nebius), E2B, Sprites.dev, Modal + 10 CDEs (GitHub Codespaces, Gitpod, Coder, Vercel Sandbox) + 7 OSS isolation primitives
- [Turnkey Managed Platforms](infrastructure.md#turnkey-managed-platforms) — OpenClaw-native + enterprise hubs (Copilot Studio, Agentspace, Bedrock) + no-code builders + autonomous coding agents (Devin, Factory, Cursor) + visual IDEs
- [Agent-Optimized Hosting](infrastructure.md#agent-optimized-hosting) — ClawHost, Claw Cloud, Zo Computer
- [Agent Orchestration](infrastructure.md#agent-orchestration) — Durable execution (Temporal, Inngest, Trigger.dev, Restate, DBOS, + 9 more) + cloud workflows + agent frameworks (LangGraph, CrewAI, AutoGen, Mastra) + data/ML orchestrators
- [Cloud Mac Hosting](infrastructure.md#cloud-mac-hosting) — 13 dedicated Mac hosts + 7 Mac CI runners (Xcode Cloud, GitHub Actions, CircleCI, Bitrise)
- [Self-Hosted Infrastructure](infrastructure.md#self-hosted-infrastructure) — Specialized GPU clouds (CoreWeave, Lambda, RunPod, Vast.ai, + 10 more) + general clouds (AWS, GCP, Azure, OCI, + 15 more) + [VPS for Agents](infrastructure.md#vps-for-agents) (IONOS, Hostinger, DigitalOcean, OVHcloud, Lightsail, Contabo, Hetzner) + bare metal
- [Agent Memory & Context](infrastructure.md#agent-memory-context-infrastructure) — Purpose-built memory (Mem0, Letta, Zep) + 18 vector DBs + graph DBs for GraphRAG
- [Agent Observability & Evaluation](infrastructure.md#agent-observability-evaluation) — Tracing (LangSmith, Langfuse, Arize, AgentOps, + 11 more) + eval (Braintrust, Patronus, Ragas, DeepEval) + guardrails
- [Choosing Your Stack](infrastructure.md#choosing-your-stack) — Starter, growth, scale, and enterprise recommendations
