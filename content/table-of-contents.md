# Table of Contents

A full sitemap of this reference. Use this page when you know roughly what you want but don't remember which chapter it lives in.

For a chapter-level summary, see the [Overview](index.md). For a one-week onboarding path, see [Who's Who § Reading order](who-is-who.md#reading-order-if-youre-new). For continuously updated entry points to the broader field, see the [Reading List](reading-list.md).

---

## 1. [Approaches](approaches.md)

Per-system deep dives across 30+ agentic engineering products.

### Agent systems

- [Stripe Minions](approaches.md#stripe-minions)
- [AgentField](approaches.md#agentfield)
- [OpenHands](approaches.md#openhands)
- [Open SWE](approaches.md#open-swe-langchain)
- [OhMyOpenAgent](approaches.md#ohmyopenagent)
- [OpenCode](approaches.md#opencode)
- [SWE-agent](approaches.md#swe-agent)
- [Composio Agent Orchestrator](approaches.md#composio-agent-orchestrator)
- [Patchwork](approaches.md#patchwork)
- [Goose](approaches.md#goose)
- [Mastra](approaches.md#mastra)
- [OpenClaw](approaches.md#openclaw) + [The OpenClaw Ecosystem](approaches.md#the-openclaw-ecosystem) + [The Steinberger School](approaches.md#the-steinberger-school)
- [Hermes Agent](approaches.md#hermes-agent) — deep dive
- [Claude Managed Agents](approaches.md#claude-managed-agents)
- [Vercel Open Agents](approaches.md#vercel-open-agents)
- [OpenAI Symphony](approaches.md#openai-symphony)
- [Rivet Sandbox Agent](approaches.md#rivet-sandbox-agent)
- [DeerFlow](approaches.md#deerflow)
- [GStack](approaches.md#gstack)
- [GBrain](approaches.md#gbrain)
- [Superpowers](approaches.md#superpowers)
- [Everything Claude Code](approaches.md#everything-claude-code)
- [AgentHub](approaches.md#agenthub)
- [Crabbox](approaches.md#crabbox)
- [Clawpatch](approaches.md#clawpatch)
- [ClawSweeper](approaches.md#clawsweeper)

### Cross-cutting sections inside Approaches

- [Skills, Plugins & Marketplaces](approaches.md#skills-plugins-marketplaces)
- [Browser-Use & Computer-Use Frameworks](approaches.md#browser-use-computer-use-frameworks)
- [Terminal coding CLIs](approaches.md#terminal-coding-clis) — the 28-CLI comparison table

---

## 2. [Models](models.md)

Curated model reference for agentic engineering as of May 2026.

- [Decision rule before you read the tables](models.md#decision-rule-before-you-read-the-tables) — the 5-rule cost-discipline pattern
- [Closed-source frontier](models.md#closed-source-frontier) — Anthropic (Opus / Sonnet / Haiku 4.x), Google (Gemini 3.x Pro / Flash / Flash-Lite), OpenAI (GPT-5.5 / 5.2 / mini), xAI (Grok 4)
- [Open-weights frontier](models.md#open-weights-frontier) — DeepSeek V3.2 / R2, Qwen3 Max / Coder, Llama 4 Maverick / Scout, Kimi K2, GLM-5, MiniMax M2.7, Mistral Large 3
- [Agent / coding specialists](models.md#agent--coding-specialists) — GPT-5.2-codex, Devstral, Codestral 3, Qwen3-Coder, OpenCoder
- [Decision shortcuts](models.md#decision-shortcuts) — 10-row routing table

---

## 3. [Patterns](patterns.md)

Cross-cutting architectural patterns.

- [Harness Engineering](patterns.md#harness-engineering) — the umbrella discipline (see also the [Harness Engineering deep dive](harness-engineering.md))
- [1. Isolation Strategies](patterns.md#1-isolation-strategies)
- [2. Orchestration Models](patterns.md#2-orchestration-models)
- [3. Context Management](patterns.md#3-context-management)
- [4. Feedback Loops](patterns.md#4-feedback-loops)
- [5. Failure Recovery](patterns.md#5-failure-recovery)
- [6. Multi-Agent Coordination](patterns.md#6-multi-agent-coordination)

---

## 4. [Harness Engineering](harness-engineering.md)

The deep dive on what makes agents reliable.

- [Why Harness Beats Model Upgrade](harness-engineering.md#why-harness-beats-model-upgrade)
- [The Five-Subsystem Model](harness-engineering.md#the-five-subsystem-model)
- [Foundations](harness-engineering.md#foundations) — repo-as-system-of-record · progressive disclosure · initialization · continuity
- [Scope and Verification](harness-engineering.md#scope-and-verification) — WIP=1 · feature lists · three-layer termination · worker-vs-checker
- [Observability Inside the Harness](harness-engineering.md#observability-inside-the-harness) — sprint contracts · evaluator rubrics · OpenTelemetry
- [The Session Lifecycle and Clean State](harness-engineering.md#the-session-lifecycle-and-clean-state)
- [The Reference Stack](harness-engineering.md#the-reference-stack)
- [Failure-Mode Catalogue](harness-engineering.md#failure-mode-catalogue)
- [Decision Framework](harness-engineering.md#decision-framework)

---

## 5. [Context Engineering](context-engineering.md)

The named discipline of curating what's in the LLM context window.

- [Why it matters](context-engineering.md#why-it-matters) — context rot and the attention budget
- [The four strategies](context-engineering.md#the-four-strategies) — write / select / compress / isolate
- [Failure modes](context-engineering.md#failure-modes-name-them-so-you-can-spot-them) — poisoning · distraction · confusion · clash
- [Concrete thresholds worth pinning](context-engineering.md#concrete-thresholds-worth-pinning) — 95% / 85% compaction · 20K-token spill · ~12-skill ceiling
- [Anti-patterns](context-engineering.md#anti-patterns)

---

## 6. [Tool Design](tool-design.md)

How to write tools agents use well.

- [What "good tool design" actually means](tool-design.md#what-good-tool-design-actually-means)
- [Consolidate, don't expose your API surface](tool-design.md#1-consolidate-dont-expose-your-api-surface)
- [Compress every response](tool-design.md#2-compress-every-response) — ResponseFormat enums (206 → 72 tokens)
- [Lazy load — the "too many tools" problem](tool-design.md#3-lazy-load--the-too-many-tools-problem) — Tool Search Tool, -85% tokens
- [Code-as-tool — give the agent a Python sandbox](tool-design.md#4-code-as-tool--give-the-agent-a-python-sandbox) — 150K → 2K tokens
- [Programmatic Tool Calling](tool-design.md#programmatic-tool-calling--the-third-optimization)
- [Tool Use Examples](tool-design.md#tool-use-examples--the-input_examples-pattern) — 72% → 90%
- [What to measure when iterating on tools](tool-design.md#what-to-measure-when-iterating-on-tools)
- [MCP — the protocol layer](tool-design.md#mcp--the-protocol-layer)
- [Anti-patterns](tool-design.md#anti-patterns)

---

## 7. [Skills](skills.md)

The cross-vendor primitive for capability packaging (Anthropic open standard, Dec 2025).

- [The SKILL.md format](skills.md#the-skillmd-format)
- [Progressive disclosure — the key idea](skills.md#progressive-disclosure--the-key-idea)
- [Empirical bounds](skills.md#empirical-bounds-from-production-data) — 82% vs 9% lift · ~12-skill ceiling · 70% invocation reliability
- [Designing a skill that gets invoked](skills.md#designing-a-skill-that-gets-invoked)
- [What you can ship as a skill](skills.md#what-you-can-ship-as-a-skill)
- [Security](skills.md#security)
- [Anti-patterns](skills.md#anti-patterns)

---

## 8. [Memory](memory.md)

Persistent state across turns and sessions.

- [The taxonomy](memory.md#the-taxonomy) — three axes: lifetime / type / update mechanism
- [The vendors and what they actually do](memory.md#the-vendors-and-what-they-actually-do) — Letta · Mem0 · LangMem · LangGraph Store · Anthropic memory tool
- [The filesystem-as-memory pattern](memory.md#the-filesystem-as-memory-pattern)
- [How agents actually learn over time](memory.md#how-agents-actually-learn-over-time) — three-layer continual-learning model
- [Concrete patterns from production](memory.md#concrete-patterns-from-production)
- [Anti-patterns](memory.md#anti-patterns)

---

## 9. [Evals](evals.md)

How to measure agent quality — distinct from public benchmarks.

- [The mental model](evals.md#the-mental-model) — three test layers: code-based / model-based / human
- [How to start an eval program](evals.md#how-to-start-an-eval-program-without-an-eval-team)
- [pass@k vs pass^k — the reliability gap](evals.md#passk-vs-passk--the-reliability-gap)
- [Three things that silently invalidate your numbers](evals.md#three-things-that-will-silently-invalidate-your-numbers) — grading bugs · infra noise · eval awareness
- [Benchmarks ≠ trustworthy by default](evals.md#benchmarks--trustworthy-by-default) — the ABC paper
- [Categories to test](evals.md#categories-to-test-deep-agents-taxonomy)
- [Multi-turn eval design](evals.md#multi-turn-eval-design)
- [Tooling landscape](evals.md#tooling-landscape) — Inspect AI · LangSmith · Braintrust · Langfuse · Phoenix · Harbor

---

## 10. [Benchmarks](benchmarks.md)

How agentic coding is publicly evaluated.

- [SWE-bench](benchmarks.md#swe-bench) and [variants](benchmarks.md#variants) — Verified, Lite, Multimodal, Multilingual, Pro
- [Terminal Bench](benchmarks.md#terminal-bench)
- [Inspect AI](benchmarks.md#inspect-ai)
- [τ-Bench (Sierra)](benchmarks.md#-bench-sierra)
- [Other benchmarks worth knowing](benchmarks.md#other-benchmarks-worth-knowing) — 9-row roundup: BFCL, GAIA, BrowseComp, CORE, MLE-bench, ScienceAgentBench, OSWorld, Sweep
- [Choosing a benchmark](benchmarks.md#choosing-a-benchmark)
- [Benchmark-adjacent reading](benchmarks.md#benchmark-adjacent-reading)

---

## 11. [Schools](schools.md)

Where does trust live? Three philosophical schools + four operational schools.

- [The Central Question](schools.md#the-central-question-where-does-trust-live)
- Philosophical schools:
  - [Trust as Cryptography — Polosukhin](schools.md#trust-as-cryptography-polosukhin)
  - [Trust as Observability — Chase](schools.md#trust-as-observability-chase)
  - [Trust as Process — Ng](schools.md#trust-as-process-ng)
- [Side-by-Side Comparison](schools.md#side-by-side-comparison)
- Operational schools:
  - [The Stripe School](schools.md#the-stripe-school)
  - [The Tan School](schools.md#the-tan-school)
  - [The Walking Labs / Mastery School](schools.md#the-walking-labs-mastery-school)
  - [The Steinberger School](schools.md#the-steinberger-school)
- [Cross-Map: Operational × Philosophical](schools.md#cross-map-operational-philosophical)
- [What the Next 24 Months Look Like](schools.md#what-the-next-24-months-look-like)

---

## 12. [Who's Who](who-is-who.md)

25 named profiles of the people shaping the field.

- 🧠 Researchers / educators: [Karpathy](who-is-who.md#andrej-karpathy) · [Weng](who-is-who.md#lilian-weng) · [Yao](who-is-who.md#shunyu-yao) · [Brown](who-is-who.md#noam-brown) · [Yang](who-is-who.md#john-yang) · [Kiela](who-is-who.md#douwe-kiela) · [Teknium](who-is-who.md#teknium-karan-malhotra) · [Polosukhin](who-is-who.md#illia-polosukhin)
- 🔨 Operators / founders: [Steinberger](who-is-who.md#peter-steinberger-steipete) · [Tan](who-is-who.md#garry-tan) · [Cherny](who-is-who.md#boris-cherny) · [Chase](who-is-who.md#harrison-chase) · [Vincent](who-is-who.md#jesse-vincent-obra) · [Robinson](who-is-who.md#lee-robinson) · [Liu (Beyang)](who-is-who.md#beyang-liu) · [Liu (Jerry)](who-is-who.md#jerry-liu) · [Schluntz](who-is-who.md#erik-schluntz) · [Trivedy](who-is-who.md#vivek-trivedy) · [Martin](who-is-who.md#lance-martin)
- ✍️ Chroniclers / synthesizers: [Willison](who-is-who.md#simon-willison) · [Osmani](who-is-who.md#addy-osmani) · [Mollick](who-is-who.md#ethan-mollick) · [swyx + Fanelli](who-is-who.md#swyx-shawn-wang-alessio-fanelli) · [Husain](who-is-who.md#hamel-husain) · [Yan](who-is-who.md#eugene-yan)
- [Appendix](who-is-who.md#appendix-people-projects-and-writers-we-considered-but-didnt-profile) — additional candidates
- [Reading order if you're new](who-is-who.md#reading-order-if-youre-new) — one-week onboarding path

---

## 13. [Organizations](organizations.md)

How companies organize around agents.

- [The Stripe Model](organizations.md#the-stripe-model)
- [The Open-Source / Startup Model](organizations.md#the-open-source-startup-model)
- [Organizational Patterns](organizations.md#organizational-patterns)
- [The Infrastructure You Need](organizations.md#the-infrastructure-you-need)
- [The Future](organizations.md#the-future)

---

## 14. [Inference](inference.md)

LLM inference solutions.

- [Direct API Providers](inference.md#direct-api-providers)
- [Inference Platforms](inference.md#inference-platforms)
- [Nebius AI Cloud](inference.md#nebius-ai-cloud-standout-platform) — deep dive
- [Routing & Gateway Solutions](inference.md#routing-gateway-solutions)
- [Self-Hosted Inference](inference.md#self-hosted-inference)
- [Inference Strategy for Agents](inference.md#inference-strategy-for-agents)
- [Decision Framework](inference.md#decision-framework)

---

## 15. [Sandboxes](sandboxes.md)

The execution-environment layer.

- [Why Sandboxes Matter for Agents](sandboxes.md#why-sandboxes-matter-for-agents)
- [The Sandbox Market Structure](sandboxes.md#the-sandbox-market-structure) — four-layer model
- [Core Use Cases](sandboxes.md#core-use-cases)
- [Isolation Tiers](sandboxes.md#isolation-tiers-the-security-ladder)
- [Purpose-Built Agent Sandboxes](sandboxes.md#purpose-built-agent-sandboxes) — full vendor table
- [Contree — The Git-Native Sandbox](sandboxes.md#contree-the-git-native-sandbox) — deep dive
- [Cloud Development Environments (CDEs)](sandboxes.md#cloud-development-environments-cdes)
- [Open-Source Isolation Primitives](sandboxes.md#open-source-isolation-primitives)
- [Agent Patterns Enabled by Modern Sandboxes](sandboxes.md#agent-patterns-enabled-by-modern-sandboxes)
- [Decision Framework](sandboxes.md#decision-framework)
- [Integration Examples](sandboxes.md#integration-examples)

---

## 16. [Hosting & Execution Infrastructure](infrastructure.md)

150+ vendors across 9 major categories.

- [Agent Hosting & Execution Platforms](infrastructure.md#agent-hosting-execution-platforms) — the six-tier decision framework
- [Code Execution Sandboxes](infrastructure.md#code-execution-sandboxes) — quick-ref table
- [Turnkey Managed Platforms](infrastructure.md#turnkey-managed-platforms) — OpenClaw-native, enterprise hubs, no-code builders, [Autonomous Coding Agents](infrastructure.md#autonomous-coding-agents), visual IDEs
- [Agent-Optimized Hosting](infrastructure.md#agent-optimized-hosting)
- [Agent Orchestration](infrastructure.md#agent-orchestration) — durable execution, cloud workflows, [agent-specific frameworks](infrastructure.md#agent-specific-orchestration-frameworks), data/ML orchestrators
- [Cloud Mac Hosting](infrastructure.md#cloud-mac-hosting)
- [Self-Hosted Infrastructure](infrastructure.md#self-hosted-infrastructure) — GPU clouds, general clouds, [VPS for agents](infrastructure.md#vps-for-agents)
- [Agent Memory & Context Infrastructure](infrastructure.md#agent-memory-context-infrastructure) — [purpose-built memory](infrastructure.md#purpose-built-agent-memory), vector DBs, graph DBs
- [Agent Observability & Evaluation](infrastructure.md#agent-observability-evaluation) — [tracing](infrastructure.md#llm-agent-tracing-observability), [evaluation](infrastructure.md#evaluation-testing), [guardrails](infrastructure.md#guardrails-safety)
- [MCP Servers, Registries & Gateways](infrastructure.md#mcp-servers-registries-gateways)
- [Agent Identity, Auth & Secrets](infrastructure.md#agent-identity-auth-secrets)
- [Choosing Your Stack](infrastructure.md#choosing-your-stack) — starter / growth / scale / enterprise
- [Decision Framework](infrastructure.md#decision-framework)

---

## 17. [Generative UI](generative-ui.md)

The agent's front-end story.

- [Why it matters for agentic engineering](generative-ui.md#why-it-matters-for-agentic-engineering)
- [The three primary patterns](generative-ui.md#the-three-primary-patterns) — Static, Declarative, Open-ended
- [Specifications and protocols](generative-ui.md#specifications-and-protocols) — [A2UI](generative-ui.md#a2ui-agent-to-user-interface), AG-UI, MCP-UI, Open-JSON-UI
- [Frameworks](generative-ui.md#frameworks) — [CopilotKit](generative-ui.md#copilotkit) (the reference example), Vercel AI SDK, Mastra + CopilotKit
- [Code examples](generative-ui.md#code-examples) — static, declarative, open-ended
- [Trade-offs](generative-ui.md#trade-offs-consistency-vs-flexibility) — consistency vs. flexibility
- [Decision framework](generative-ui.md#decision-framework)
- [A2UI adoption snapshot](generative-ui.md#a2ui-adoption-snapshot-late-2026)

---

## 18. [Research Notes](research-notes.md)

Source-of-truth bibliography behind every page above. 100+ primary sources ingested in May 2026; structured per-URL digest with key claims, frameworks named, and which slot in the reference each source fills.

- [Anthropic Engineering (19 URLs)](research-notes.md#section-1-anthropic-engineering-19-urls)
- [LangChain Blog (20 URLs)](research-notes.md#section-2-langchain-blog-20-urls)
- [Individual articles + arxiv + courses (10 URLs)](research-notes.md#section-3-individual-articles--arxiv--courses-10-urls-1-fetch-fail)
- [GitHub repos + framework docs (21 URLs)](research-notes.md#section-4-github-repos--framework-docs-21-urls)
- [People's blogs + newsletters + podcasts (14 URLs)](research-notes.md#section-5-peoples-blogs--newsletters--podcasts-14-urls-1-fetch-fail)
- [Tools, platforms, courses, communities (24 URLs)](research-notes.md#section-6-tools-platforms-courses-communities-24-urls-7-fetch-fails)
- [Cross-cutting findings](research-notes.md#cross-cutting-findings) — 7 patterns that repeated across enough sources to pin

---

## Meta pages

These don't fit the numbered chapter sequence but are linked from the sidebar Get Started group:

- [Reading List](reading-list.md) — curated entry points to follow the field (newsletters, blogs, podcasts, courses, communities, conferences, reference repos), with a practical weekly cadence at the bottom
- [Changelog](changelog.md) — what's been added to this site, newest first; content additions only (bug fixes / refactors / UX live in git log)

---

## Cross-page indexes

- **Schools framing**: introduced in [Approaches § The Steinberger School](approaches.md#the-steinberger-school), formalized in [Schools](schools.md), referenced from [Who's Who](who-is-who.md) profiles
- **Context engineering thread**: [Context Engineering](context-engineering.md) coins the discipline; [Tool Design](tool-design.md) is the action-layer slice; [Skills](skills.md) is the capability-packaging primitive; [Memory](memory.md) is the durable-state layer
- **Evaluation thread**: [Evals](evals.md) covers the methodology (your tests against your failure modes); [Benchmarks](benchmarks.md) covers the public leaderboards (SWE-bench, Terminal Bench, etc.)
- **Vendor cross-reference**: many vendors appear in both [Sandboxes](sandboxes.md) and [Hosting & Execution](infrastructure.md) — the Sandboxes page is the deep dive, Hosting & Execution is the quick reference
- **Reading order for newcomers**: [Who's Who § Reading order](who-is-who.md#reading-order-if-youre-new) for the one-week onboarding path; [Reading List](reading-list.md) for the broader source map
