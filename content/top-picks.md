<!-- description: Opinionated editorial picks for each major category — frontier models, coding agents, sandboxes, CI runners, agent frameworks, observability, evals, memory, tool platforms, safety, code reviewers, self-hosted inference. S/A/B/Watch tiering with stated criteria (Capability, Adoption, Maturity, Agent-fit). Updated quarterly. -->

# Top Picks

> *Editorial recommendations as of June 2026. These are opinionated picks derived from the source notes elsewhere on this site — when a number or claim appears here, the underlying notes are in [Research Notes](research-notes.md), and the deeper write-ups live on each category's dedicated page. Pricing, capability claims, and rankings shift quarterly; re-verify at primary sources before quoting.*

This page is the fast-track answer to "what should I actually use?" for each category covered by the site. The deeper analysis — methodology, alternatives, decision frameworks, vendor case studies — lives on the linked category page.

---

## Methodology

Picks are sorted into **tier badges**, not ordinal ranks. Tiering is honest about the difference between *"strong default for most teams"* and *"top of a saturated leaderboard."* The tiers:

| Tier | What it means |
|---|---|
| **S-tier** | **Strong default.** Pick this unless you have a specific reason not to. High on every criterion. |
| **A-tier** | **Best-in-segment.** Top pick for a specific shape of team, workload, or constraint. Trade-offs are explicit and acceptable. |
| **B-tier** | **Legitimate option with caveats.** Mature enough to deploy; pick when the A-tier doesn't fit (cost, lock-in, posture). |
| **Watch** | **Newer / promising / underspecified.** Worth tracking but not yet ranked. Re-evaluate next quarter. |

Each product is rated against four stated criteria:

| Criterion | What it weighs |
|---|---|
| **Capability** | How good it is at its core job — benchmark scores when public, plus qualitative assessment of where it actually wins or loses. |
| **Adoption** | Real production usage — customer counts, GitHub stars, ARR signals, mentions in primary-source case studies. Mindshare ≠ quality, but it's evidence. |
| **Maturity** | Operational stability, doc quality, ecosystem depth, time-in-market, hardening against edge cases. |
| **Agent-fit** | How well it fits *agent-native* usage patterns (sub-agents, long-horizon loops, tool use, prompt caching, observability), not just general LLM use. |

**How tiers map to criteria:** **S-tier** = strong on most/all four with no major weakness. **A-tier** = strong on 2–3 with explicit trade-offs. **B-tier** = strong on 1–2 with significant constraints. **Watch** = too new or too thinly covered for honest assignment.

Each pick comes with a one-line **why** (the criteria that earned the tier) and a one-line **caveat** (what would push you to a different option).

**Editorial bias declared.** Two specific biases shape this page:

1. **Anthropic / Claude-ecosystem products** appear with disproportionate frequency because that's what the source notes cover most deeply. Where a non-Anthropic alternative is materially stronger for a specific use case, that's named.
2. **Tenki** is ranked A-tier in every category it competes in (Sandboxes, CI Runners, Code Reviewers). The editorial argument is the bundle thesis — see [Tenki Review](tenki.md) — but the standalone case for each Tenki component is closer to B-tier. If you wouldn't adopt all three Tenki products together, treat the per-category Tenki entry as B-tier and pick the non-Tenki A-tier option.

Both biases are flagged inline so the reader can adjust.

**Freshness.** This page rots fast. Re-rate quarterly; bias toward demotion (do not promote without re-evidence). Date stamps are explicit. If you're reading this six months past the date and a tier looks wrong, it probably is.

---

## Frontier Models

The substrate of any agent. The model is the cooking method; the harness is the kitchen — and you can't change kitchens around a bad ingredient. See [Models](models.md) and [Benchmarks](benchmarks.md) for the full landscape.

**S-tier (strong defaults):**

- **Claude Sonnet 4.6** — *Why:* Best capability/cost ratio for default agent loops ($3/$15 per MTok). Strong SWE-bench Verified scores behind mini-SWE-agent, OpenHands, Claude Code. Top score on Capability + Adoption + Agent-fit. *Caveat:* Outclassed on the hardest tasks by Opus — pair Opus planner + Sonnet workers.
- **Claude Opus 4.8** — *Why:* Frontier capability for complex coding and reasoning; default for the top of an orchestrator-worker hierarchy. Anthropic's multi-agent research system gets 90.2% lift with Opus lead + Sonnet subagents. *Caveat:* $15/$75 per MTok — prompt caching is mandatory from day one ([Cost & Economics § Cache economics](cost-economics.md#cache-economics)).
- **Claude Fable 5** — *Why:* Newest Anthropic frontier model; #1 Chatbot Arena (1510 Elo), #1 Arena.ai Agent Leaderboard (+14.05%), #1 openlm.ai's SWE-bench view (95 with mini-SWE-agent). Top of multiple leaderboards simultaneously is rare. *Caveat:* Less production track record than Sonnet/Opus; quirks still settling.

**A-tier (best-in-segment):**

- **GPT-5.5** — *Why:* The non-Anthropic frontier default. Powers #1 (NexAU-AHE) and #3 (Capy) on Terminal Bench 2.0 at 84.7% and 83.1%. Best BrowseComp performer (90.1%). *Caveat:* OpenAI's pricing and rate-limiting story is more enterprise-fragile than Anthropic's.
- **GLM-5.2 (Z.ai)** — *Why:* Best open-weights frontier-tier model. ~82.8 on the openlm.ai SWE-bench view. **8–10× cheaper** than closed-frontier — production workloads have measured $87K/year savings vs Opus. *Caveat:* Tooling and observability story still catching up; hosted via Groq / Fireworks / Baseten / own infra.

**B-tier (legitimate with constraints):**

- **Gemini 3.1 Pro** — *Why:* Strong on multimodal + long context (1M tokens), strong BrowseComp (85.9%). *Caveat:* Uneven on agent-specific tasks; Google ecosystem lock-in.
- **Claude Haiku 4.5** — *Why:* The Haiku/Mini/Flash-tier default ($0.80/$4 per MTok). Good for routing easy turns; pairs with Opus/Sonnet for hard turns. *Caveat:* Not a frontier model — don't trust it with complex reasoning.

**Watch:** MiniMax M2.7 (cheapest viable frontier at $0.30/$1.20 per MTok), DeepSeek V3.x, Qwen 3.x.

---

## Coding Agents (Harnesses)

The thing you actually drive when you code. Same model, different harness, fundamentally different output — Anthropic measured 78% (Claude Code) vs 42% (Smolagents) on the same Opus 4.5. See [Approaches](approaches.md) and [Harness Engineering](harness-engineering.md).

**S-tier (strong defaults):**

- **Claude Code** — *Why:* First-party Anthropic harness with the deepest integration of Claude's tool-use semantics. Auto Mode + sandboxing + Skills + Subagents is the reference architecture. 54.7K-star "best practices" repo signals mindshare. Tops on all four criteria. *Caveat:* Anthropic-only — vendor lock-in is real.
- **Cursor** — *Why:* The IDE-first default. Cursor Agent + BugBot + multi-model routing in one editor. Largest commercial seat base for AI coding by a wide margin (Adoption is the standout). *Caveat:* Less programmable than Claude Code for headless / CI / agent-fleet patterns.

**A-tier (best-in-segment):**

- **Codex / OpenAI Agentic Coding** — *Why:* OpenAI's first-party harness, model-provider-managed. Pairs well with the GPT-5.x series; the non-Anthropic counterpart to Claude Code. *Caveat:* OpenAI ecosystem; less open than LangChain or OSS alternatives.
- **OpenHands** — *Why:* The reference OSS agent harness. Pushed SOTA past 50% SWE-bench Verified in 2024; still the OSS baseline. Model-agnostic. Top Maturity + Capability for OSS specifically. *Caveat:* Less polished than commercial harnesses; you operate the loop.
- **Aider** — *Why:* Terminal-native, model-agnostic, lightweight. The pick for "I want a CLI coding agent without a vendor opinion." Strong on Maturity. *Caveat:* Less ambitious than newer agentic harnesses on long-horizon work.

**B-tier (legitimate with constraints):**

- **Windsurf** — *Why:* Cursor's main commercial competitor; good IDE-native agent UX. *Caveat:* Smaller mindshare than Cursor.
- **Cline** — *Why:* Open-source VS Code agent with the largest community in its niche. *Caveat:* VS Code-only; less ambitious than Claude Code / Cursor.
- **Amp (Sourcegraph)** — *Why:* Built on Sourcegraph's code-intelligence layer; differentiated context. *Caveat:* Adoption thinner than Cursor/Claude Code.

**Watch:** OhMyOpenAgent (multi-agent harness pattern), AgentField (typed recovery + three nested loops), Goose (Block's local-execution agent), Letta Code (memory-first variant).

---

## Sandboxes (Action Substrate)

Where the agent's code runs. Layer 1 of the [Twelve-Layer Agentic Stack](patterns.md#the-twelve-layer-agentic-stack). The sandbox sets the ceiling on everything above it. See [Sandboxes](sandboxes.md).

**S-tier (strong default):**

- **E2B** — *Why:* <200ms cold start (Firecracker microVMs), broad language support (Python/JS/Ruby/C++), 24-hour session limit. Production usage at Perplexity, Hugging Face, Groq. Top score on all four criteria. *Caveat:* Single-vendor lock-in; pricing matters at scale.

**A-tier (best-in-segment):**

- **Tenki Sandbox** — *Why:* Earns A-tier on the bundle thesis: paired with Tenki Runners + Code Reviewer it removes the vendor-stitching tax across three layers of the stack ([Tenki Review](tenki.md)). Strong default for teams that want a single throat to choke across sandbox + CI + review. *Caveat:* Standalone case is closer to B — adopt the bundle or pick E2B / Modal instead. (Editorial bias flagged in [Methodology](#methodology).)
- **Modal** — *Why:* Best-in-segment for GPU workloads + serverless compute. The pick when the agent's tools include "spin up an H100 for 60 seconds." *Caveat:* Ergonomics tuned for ML, not agentic loops.
- **Daytona** — *Why:* Fast workspace provisioning; clean Docker-based isolation. A solid alternative to E2B with no major weakness. *Caveat:* Smaller ecosystem; fewer agent-specific integrations.
- **Contree** — *Why:* Git-native branching at the sandbox level — enables tree-of-thought sandboxing (fork at every decision, run parallel branches, continue with the winner). The unique architectural pick. *Caveat:* Smaller user base; the branching primitive is powerful but novel to operate.

**Watch:** Blaxel, Sprites.dev, Cloudflare Workers / Sandboxes (edge use cases).

---

## CI Runners for Agent Iteration

When an agent fleet opens 30 PRs an hour, the runner queue throttles the harness more than the model. See [Infrastructure § CI Runners](infrastructure.md) for the full table.

**S-tier (strong default):**

- **Blacksmith** — *Why:* Drop-in `runs-on:` replacement with 2× speed claim and aggressive caching. Category-leading commercial option; heavy YC adoption. Strong Adoption + Capability + Agent-fit. *Caveat:* Vendor lock for the cache layer; pricing scales with fleet size.

**A-tier (best-in-segment):**

- **Tenki Runners** — *Why:* A-tier on the bundle thesis ([Tenki Review](tenki.md)) — paired with Tenki Sandbox + Code Reviewer it eliminates the cross-vendor seams agent fleets fight with most. *Caveat:* Standalone case is closer to B; the bundle is what justifies the tier — pick Blacksmith or Depot if you're not adopting Tenki across the stack. (Editorial bias flagged in [Methodology](#methodology).)
- **Depot** — *Why:* Best Docker-build acceleration + GitHub Actions runners under one roof. The pick when CI is build-heavy. *Caveat:* Strongest value when you adopt Depot Build too; less unique on runners alone.
- **Namespace** — *Why:* Reproducible runner-as-VM model; works well with agent harnesses that need a deterministic build environment. *Caveat:* Less mainstream than Blacksmith / Depot.

**Watch:** BuildJet (the original alternative runner), RunsOn (BYO-AWS for runners), Ubicloud (OSS GitHub Actions runner).

---

## Agent Frameworks

For when you're building your own harness — not driving an existing one. See [Approaches](approaches.md) and [Patterns § Orchestration Models](patterns.md#2-orchestration-models).

**S-tier (strong defaults):**

- **LangGraph (LangChain)** — *Why:* Industry-default for graph-shaped agent control flow. Durable execution, checkpointing, HITL, long-term memory, LangSmith integration out of the box. Strongest on Adoption + Ecosystem of any agent framework. *Caveat:* Verbose; the abstraction layer is real overhead until you need it.
- **Deep Agents (LangChain)** — *Why:* Opinionated batteries-included harness on top of LangGraph. Sub-agents, filesystem, shell, memory, skills, HITL by default. v0.5 ships async subagents and multimodal filesystem. *Caveat:* Same Python/LangChain stack lock-in as LangGraph.

**A-tier (best-in-segment):**

- **Claude Agent SDK** — *Why:* First-party Anthropic loop exposed as a Python/TypeScript SDK; same tools and hooks Claude Code uses, programmable. Best Agent-fit if you're on Claude. *Caveat:* Anthropic-only; smaller ecosystem than LangGraph.
- **OpenAI Agents SDK** — *Why:* First-party OpenAI agent framework, native to GPT-5.x tool-use semantics. *Caveat:* OpenAI-only; lighter on production-ready primitives than LangGraph.
- **Mastra** — *Why:* TypeScript-first — *"Python trains, TypeScript ships."* Studio + Server + Memory Gateway. Apache 2.0, 24.3K stars. The pick for full-stack JS/TS teams. *Caveat:* Younger than LangGraph; smaller community of production case studies.

**B-tier (legitimate with constraints):**

- **CrewAI** — *Why:* Role-based multi-agent framework with strong narrative appeal. *Caveat:* Less production-tested than LangGraph; abstraction can hide model inputs.
- **smolagents** — *Why:* HuggingFace's minimal harness; the simplest reference implementation for learning. *Caveat:* Scored 42% on Opus 4.5 vs Claude Code's 78% in Anthropic's controlled experiment — *not* a production harness.
- **AutoGen** — *Why:* Microsoft Research's multi-agent framework; long history. *Caveat:* Research-oriented; production maturity uneven.

**Watch:** Pydantic AI (type-safe), Vercel AI SDK (front-end / streaming), Google ADK (Gemini-native), Strands (AWS-first).

---

## Observability & Tracing

You need this. 89% of orgs running agents in production have observability; 62% have detailed tracing. *Logic lives in traces, not code.* See [Observability](observability.md).

**S-tier (strong defaults):**

- **LangSmith** — *Why:* The de facto observability + eval layer. Integrates with AutoGen, Claude Agent SDK, CrewAI, Mastra, OpenAI Agents, PydanticAI, Vercel AI SDK — not just LangChain. Largest community of production users. Tops Adoption + Maturity + Agent-fit. *Caveat:* LangChain-adjacent; pricing matters at scale.
- **Braintrust** — *Why:* Framework-agnostic eval + observability. Loop (auto-improves prompts/datasets), Brainstore (trace-optimized DB), SDKs in 5 languages, SOC2/HIPAA/GDPR. The pick for teams that want eval-first. *Caveat:* Smaller community than LangSmith.

**A-tier (best-in-segment):**

- **Inspect AI** — *Why:* UK AISI + Meridian Labs framework. The framework labs (Anthropic, DeepMind, Grok) actually use for pre-release. 200+ pre-built evals via `inspect_evals`. Strict superset of pytest-style eval libs. Top Capability for safety + capability evals specifically. *Caveat:* Less polished for product-style traces than LangSmith / Braintrust.
- **Arize Phoenix** — *Why:* OSS LLM observability with OpenTelemetry-native traces; self-host or hosted. *Caveat:* Less full-featured than LangSmith for agent-specific workflows.

**B-tier (legitimate with constraints):**

- **Langfuse** — *Why:* OSS LangSmith alternative; self-hostable. *Caveat:* Smaller community than LangSmith proper.
- **Helicone** — *Why:* Proxy-based, simple to wire up. The fastest path to "we have some observability." *Caveat:* Less depth than full-trace platforms.

**Watch:** WhyLabs / Patronus (safety-metric overlays), AgentOps (multi-agent-specific).

---

## Eval Frameworks

The missing infrastructure. ~1/3 of orgs cite quality as the top production blocker. See [Evals](evals.md).

**S-tier (strong defaults):**

- **Inspect AI** — *Why:* Same reasons as Observability — the framework labs use it. Task/Solver/Scorer is the clean abstraction. 200+ built-in evals. Tops all four criteria for evaluation specifically. *Caveat:* Has a learning curve.

**A-tier (best-in-segment):**

- **Harbor** — *Why:* LangChain's eval orchestration layer used in the *Improving Deep Agents with Harness Engineering* +13.7-point Terminal-Bench 2.0 result. *Caveat:* LangChain-adjacent.
- **LangSmith pytest** — *Why:* LangSmith's eval primitive integrated with pytest + GitHub Actions. Concrete categories: file_operations, retrieval, tool_use, memory, conversation, summarization, unit_tests. *Caveat:* Best inside the LangSmith ecosystem.
- **Braintrust** — *Why:* Eval-as-first-class. Trace-to-dataset for failure-driven regression tests. Framework-agnostic. *Caveat:* Newer.

**B-tier (legitimate with constraints):**

- **DeepEval** — *Why:* pytest-style LLM eval library. *Caveat:* Less ambitious than Inspect AI.
- **Ragas** — *Why:* Strong on RAG-specific evals. *Caveat:* Narrower than the platform plays.
- **Promptfoo** — *Why:* Lightweight CLI evals; good for prompt regression. *Caveat:* Not a full agent-eval platform.

**Caveat the whole category:** beware contamination and infrastructure noise. [SWE-bench+](research-notes.md#swe-bench-enhanced-coding-benchmark-for-llms) showed cleaning the dataset drops SWE-bench scores from 12.47% → 3.97%. Anthropic's [infrastructure-noise post](https://www.anthropic.com/engineering/infrastructure-noise) shows infra config alone can swing Terminal-Bench by 6pp.

---

## Memory Layers

For stateful agents that survive sessions. Layer 4 of the [12-layer stack](patterns.md#the-twelve-layer-agentic-stack). See [Memory](memory.md).

**S-tier (strong default):**

- **Letta** — *Why:* The team behind MemGPT; reference implementation for OS-style virtual context. Memory palace UI, background "dream agents," cross-model portability. Letta MemFS hit **74% on LoCoMo** with GPT-4o-mini, beating bespoke memory-tool stacks. Top on Capability + Maturity + Agent-fit. *Caveat:* Heavyweight relative to a simple key-value memory.

**A-tier (best-in-segment):**

- **Mem0** — *Why:* Drop-in persistent memory infra with API/SaaS focus. Add/Learn/Retrieve API; claims lower latency + token cost via compression. SOC2 Type 1 + HIPAA; K8s / private cloud / air-gapped. *Caveat:* Less mindshare in research community than Letta.

**B-tier (legitimate with constraints):**

- **LangMem** — *Why:* Memory primitives inside LangChain/LangGraph — episodic, procedural, semantic. *Caveat:* LangChain-adjacent.

**Watch:** Context Hub ([andrewyng/context-hub](https://github.com/andrewyng/context-hub) — 13.4K stars; markdown API docs registry that compounds across sessions), Zep.

**Caveat the whole category:** memory is a time-bomb. *"Accumulated memory raises safety violations, drives behavior drift, becomes an attack surface."* Budget and invalidate memory on purpose. See [Trojan Hippo](research-notes.md#trojan-hippo-weaponizing-agent-memory-for-data-exfiltration) — single untrusted tool call plants dormant memory payload, 85–100% ASR across four memory architectures.

---

## Agent Tool Platforms (Auth + Scaled Tool Use)

For agents that need user-scoped auth to services (Google, Slack, Salesforce) and you don't want to roll OAuth yourself. See [Infrastructure § Agent Identity, Auth & Secrets](infrastructure.md).

**S-tier (strong default):**

- **Arcade.dev** — *Why:* Per-user (not service-account) OAuth, governed tool-calling. Deploy modes: cloud / VPC / on-prem / air-gapped. The pick for production agents that act on behalf of named users. Top Agent-fit. *Caveat:* Pricing not public on the homepage; verify before standardizing.

**A-tier (best-in-segment):**

- **Composio** — *Why:* 1,000+ app integrations under managed auth + sandboxed remote execution. Broad tool catalog. *Caveat:* Less explicitly per-user-auth framed than Arcade.
- **MCP servers ecosystem (Anthropic standard)** — *Why:* Open protocol; thousands of servers since Nov 2024 launch; de facto industry standard. The right *protocol* layer underneath auth-management products. Strongest Adoption + Maturity. *Caveat:* Auth and per-user scoping cross-server are still immature — adding a third-party MCP tool can silently flip an agent into the lethal trifecta.

**Watch:** Cloudflare AI Gateway (proxy-layer tool routing), OpenAI function-calling marketplace.

---

## Safety / Guardrails

Defense at the input / output / capability layer. See [Safety](safety.md).

**S-tier (strong defaults):**

- **LlamaFirewall (Meta)** — *Why:* Open-source, free, model-agnostic. Part of Meta's Llama Protections suite (Prompt Guard, Code Shield, Llama Guard). The pick for layered defense without vendor lock-in. *Caveat:* Newer than commercial vendors; operate-yourself.
- **NeMo Guardrails (NVIDIA)** — *Why:* Open-source rails framework with strong programmable structure. NVIDIA-backed, mature, broad community. Top Maturity + Capability. *Caveat:* Heavier than a single-purpose firewall; learning curve.

**A-tier (best-in-segment):**

- **Lakera Guard** — *Why:* Commercial prompt-injection vendor with the deepest single-vendor focus on injection. Strong eval transparency. *Caveat:* Single-class focus; pair with broader defense in depth.
- **LLM Guard (OSS)** — *Why:* Free, pip-install, the worst classes blocked from day one. The pick for *"need something today, no budget."* *Caveat:* Not a complete answer; treat as foundation.
- **Protect AI Guardian** — *Why:* Enterprise AppSec framing — aligns with how AppSec teams already think about posture management. *Caveat:* Enterprise-priced.

**Watch:** Prompt Armor, WhyLabs Safeguard, OpenAI Moderations API (free, narrow).

**Structural caveat:** content filters are bypassable; deterministic gates aren't. The headline empirical study ([Memory Sandbox](research-notes.md#defense-effectiveness-across-architectural-layers-memory-sandbox-study)): input filters 88% ASR, retrieval filters 89% ASR, Prompt Hardening 77.8% ASR, **Memory Sandbox tool-gating: 0% on 8/9 models.** Gate capability, don't filter content. See [Patterns § 8 Pre-Action Authorization](patterns.md#8-runtime-defense--pre-action-authorization-layer-12).

---

## Code Reviewers (Automated PR Review)

For when the agent fleet opens more PRs than humans can read. See [Tenki Review](tenki.md) for the head-to-head landscape.

**S-tier (strong defaults):**

- **CodeRabbit** — *Why:* Category leader — **$60M Series B, $40M ARR, 8K customers**. Default mindshare pick. Mature GitHub / GitLab / Bitbucket integration. Tops Adoption + Maturity. *Caveat:* Enterprise pricing; verbosity is a known criticism.
- **Greptile** — *Why:* $25M Series A led by Benchmark. Strong on whole-repo context (not just diff-level review). The premium pick for fewer, smarter comments. Top Capability. *Caveat:* Smaller customer base than CodeRabbit.

**A-tier (best-in-segment):**

- **Tenki Code Reviewer** — *Why:* A-tier on the bundle thesis ([Tenki Review](tenki.md)) — sharing sandbox + runner context with the reviewer means it can actually execute the code it's reviewing rather than diff-pattern-match. *Caveat:* Standalone case is closer to B against CodeRabbit / Greptile; the bundle is what justifies the tier. (Editorial bias flagged in [Methodology](#methodology).)
- **GitHub Copilot Review** — *Why:* First-party Microsoft / GitHub. Zero-integration-effort if you're already on GitHub Enterprise. The default for big-cos that won't add a vendor. Top Adoption-by-default. *Caveat:* Less specialized than CodeRabbit / Greptile.
- **Qodo** — *Why:* OSS / self-hostable. The pick for security-sensitive or air-gapped teams. *Caveat:* Operate-yourself.

**Watch:** Cursor BugBot (in-editor PR review), Graphite Agent (stacked-diff workflow), Sourcery, Ellipsis, Bito.

---

## Self-Hosted Inference

For when the API isn't enough (cost, latency, sovereignty, custom hardware). See [Inference](inference.md).

**S-tier (strong defaults):**

- **vLLM** — *Why:* Industry-default OSS inference server. Continuous batching, paged attention, PagedAttention KV cache, broad model support. Tops Adoption + Maturity + Agent-fit for serious self-hosting. *Caveat:* Operate-yourself; tuning for high concurrency takes work.
- **SGLang** — *Why:* RadixAttention prefix caching makes it the best pick when your workload has heavy prefix reuse (long system prompts, agent loops with cached context). Top Capability for the prefix-reuse case. *Caveat:* Newer than vLLM; smaller community.
- **Groq (managed)** — *Why:* LPU-based inference; far-and-away fastest tokens/sec for the supported model set. The pick when latency is the binding constraint. *Caveat:* Limited model catalog vs general APIs.

**A-tier (best-in-segment):**

- **Together / Fireworks / Baseten (managed)** — *Why:* Managed inference for open-weights models (GLM-5.2, MiniMax M2.7, etc.) at much lower cost than closed-frontier APIs. Three solid options with overlapping value props. *Caveat:* Pick based on the specific model catalog + region you need.
- **tinygrad / tinybox (the tiny corp)** — *Why:* ~20K-LOC framework, full backend matrix (CUDA / ROCm / Metal / CPU), tinybox hardware line. AMD-sovereignty angle. Production usage at comma.ai openpilot. *Caveat:* Specialized — hardware sovereignty + custom kernels is the wedge, not general inference.

**B-tier (legitimate with constraints):**

- **Ollama** — *Why:* The local-dev default. Trivial to set up; the right pick for laptop experimentation. *Caveat:* Not for production scale.
- **OpenRouter** — *Why:* Model-routing aggregator across many providers. *Caveat:* A router, not an inference server.

**Watch:** Modal (overlaps Sandboxes category), AWS Bedrock / Azure AI / Google Vertex (enterprise compliance posture).

---

## Caveats and How to Read This Page

**This page is editorial.** Every tier assignment is the editor's judgment as of June 2026, weighted by the source notes already on the site. A different editor with different priorities would tier things differently. *Use this as a starting point, not a final answer.*

**Tier ≠ rank.** S-tier products are not strictly "better" than A-tier ones. S is "strong default for the typical reader"; A is "best in a particular segment with explicit trade-offs." If your trade-offs match the A-tier pick, it's your S-tier.

**Saturation kills accuracy.** Categories where the leaders are pulling ahead (frontier models, observability, code reviewers) are easier to tier confidently than categories in flux (agent frameworks, code reviewers' newer entrants, the entire Tenki bundle thesis). Confidence varies by category.

**Anti-recommendation.** If you're new to the field, *don't pick from this list before reading the corresponding category page.* The category pages explain when an A or B option is right for you (cost, security posture, language, lock-in tolerance, team scale). This page is the fast-track answer; the category pages are the considered answer.

**Refresh cadence.** This page is re-tiered quarterly. Date stamps on each ranking are explicit. If you're reading this past 2026-09 and the tiers look stale, they probably are — file an issue or send a PR. See [GitHub](https://github.com/opencolin/agentic-engineering).

---

## Related

- [Reading List](reading-list.md) — what to read regularly to keep these tiers sharp
- [Research Notes](research-notes.md) — the source-of-truth bibliography behind every claim
- [Patterns § Twelve-Layer Agentic Stack](patterns.md#the-twelve-layer-agentic-stack) — the meta-organizing map this site uses
- [Changelog](changelog.md) — when these rankings last shifted and why
