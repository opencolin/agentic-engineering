<!-- description: Opinionated editorial picks for each major category on the site — frontier models, coding agents, sandboxes, CI runners, agent frameworks, observability, evals, memory, tool platforms, safety, code reviewers, self-hosted inference. Star-rated, dated, source-linked. Updated quarterly. -->

# Top Picks

> *Editorial recommendations as of June 2026. These are opinionated picks derived from the source notes elsewhere on this site — when a number or claim appears here, the underlying notes are in [Research Notes](research-notes.md), and the deeper write-ups live on each category's dedicated page. Pricing, capability claims, and rankings shift quarterly; re-verify at primary sources before quoting.*

This page is the fast-track answer to "what should I actually use?" for each category covered by the site. The deeper analysis — methodology, alternatives, decision frameworks, vendor case studies — lives on the linked category page.

---

## Methodology

A single 1–5 ⭐ rating per pick, capturing the editor's confidence that this is the right default for most teams *in the category as of June 2026*. The scale:

| Rating | Meaning |
|---|---|
| ⭐⭐⭐⭐⭐ | **Strong default.** Pick this unless you have a specific reason not to. |
| ⭐⭐⭐⭐½ | **Best-in-segment.** Top pick for a specific shape of team or workload; not the universal default. |
| ⭐⭐⭐⭐ | **Legitimate option.** Mature, well-supported, real production usage. Pick if it fits constraints (cost, lock-in, ecosystem). |
| ⭐⭐⭐½ | **Niche / promising.** Solves a real problem but with caveats — newer, less mature, narrower fit. |
| ⭐⭐⭐ | **Maturing / specialized.** Worth tracking; not a default. |

Nothing below ⭐⭐⭐ appears on this page — if it would, it isn't here. Each pick comes with **strengths** (why it earns the rating) and **caveats** (what would push you to a different option). Below each ranked list, **Also watch** names the runners-up worth tracking but not currently ranked.

**Editorial bias.** Anthropic and Claude-ecosystem products appear with disproportionate frequency because that's what the source notes cover most deeply. This reflects the site's editorial focus, not a claim of universal superiority. Where a non-Anthropic alternative is materially stronger for a specific use case, that's named.

**Freshness.** This page rots fast. Re-rate quarterly; bias toward demotion (do not promote without re-evidence). Date stamps are explicit. If you're reading this six months past the date and a number looks wrong, it probably is.

---

## Frontier Models

The substrate of any agent. The model is the cooking method; the harness is the kitchen — and you can't change kitchens around a bad ingredient. See [Models](models.md) and [Benchmarks](benchmarks.md) for the full landscape.

1. **Claude Sonnet 4.6** — ⭐⭐⭐⭐⭐
   - **Strengths:** Best capability/cost ratio for default agent loops. $3/$15 per MTok. Strong SWE-bench Verified scores behind mini-SWE-agent, OpenHands, and Claude Code. The 80/20 pick for most agent harnesses.
   - **Caveats:** Outclassed on the hardest tasks by Opus. Use Opus for the planner step, Sonnet for the worker steps.

2. **Claude Opus 4.8** — ⭐⭐⭐⭐⭐
   - **Strengths:** Frontier capability for complex coding and reasoning. The default for the top of an orchestrator-worker hierarchy. Anthropic's multi-agent research system used Opus as lead + Sonnet as subagents for 90.2% lift.
   - **Caveats:** $15/$75 per MTok — expensive enough that prompt caching matters from day one. See [Cost & Economics § Cache economics](cost-economics.md#cache-economics).

3. **Claude Fable 5** — ⭐⭐⭐⭐⭐
   - **Strengths:** Newest Anthropic frontier model; #1 on Chatbot Arena (1510 Elo) and #1 on Arena.ai Agent Leaderboard (+14.05% net improvement, June 2026) and openlm.ai's SWE-bench view (95 with mini-SWE-agent). Best human-preference + best agent-leaderboard simultaneously is rare.
   - **Caveats:** Less production track record than Sonnet/Opus; pricing and quirks still settling.

4. **GPT-5.5** — ⭐⭐⭐⭐½
   - **Strengths:** The non-Anthropic frontier default. Powers #1 (NexAU-AHE) and #3 (Capy) on Terminal Bench 2.0 at 84.7% and 83.1%. Best BrowseComp performer (90.1%).
   - **Caveats:** OpenAI's pricing and rate-limiting story is more enterprise-fragile than Anthropic's.

5. **GLM-5.2 (Z.ai)** — ⭐⭐⭐⭐
   - **Strengths:** Best open-weights frontier-tier model. ~82.8 on the openlm.ai SWE-bench view, behind only Anthropic's frontier. **8–10× cheaper** than closed-frontier alternatives — production workloads have measured $87K/year savings vs Opus.
   - **Caveats:** Tooling and observability story still catching up. Hosting via Groq / Fireworks / Baseten / your own infra.

**Also watch:** **Gemini 3.1 Pro** (strong on multimodal + long context, but uneven on agent tasks); **MiniMax M2.7** (cheapest viable frontier at $0.30/$1.20 per MTok); **Claude Haiku 4.5** (default for the Haiku/Mini/Flash tier — see [Cost & Economics § hybrid routing](cost-economics.md)).

---

## Coding Agents (Harnesses)

The thing you actually drive when you code. Same model, different harness, fundamentally different output — Anthropic measured 78% (Claude Code) vs 42% (Smolagents) on the same Opus 4.5. See [Approaches](approaches.md) and [Harness Engineering](harness-engineering.md).

1. **Claude Code** — ⭐⭐⭐⭐⭐
   - **Strengths:** First-party Anthropic harness with the deepest integration of Claude's tool-use semantics. Auto Mode + sandboxing + Skills + Subagents stack is the reference architecture. 54.7K-star "best practices" repo signals mindshare ([shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)).
   - **Caveats:** Anthropic-only. Lock-in is real.

2. **Cursor** — ⭐⭐⭐⭐⭐
   - **Strengths:** The IDE-first default. Cursor Agent + BugBot + multi-model routing under one editor. Largest commercial seat base for AI coding by a wide margin.
   - **Caveats:** Less programmable than Claude Code for headless / CI / agent-fleet patterns.

3. **Codex / OpenAI Agentic Coding** — ⭐⭐⭐⭐½
   - **Strengths:** OpenAI's first-party harness, model-provider-managed. Pairs well with the GPT-5.x series. The non-Anthropic counterpart to Claude Code.
   - **Caveats:** OpenAI ecosystem; less open than the LangChain or OSS alternatives.

4. **OpenHands** — ⭐⭐⭐⭐
   - **Strengths:** The reference open-source agent harness. Pushed SOTA past 50% SWE-bench Verified in 2024; still the OSS baseline. Model-agnostic.
   - **Caveats:** Less polished than commercial harnesses; you operate the loop.

5. **Aider** — ⭐⭐⭐⭐
   - **Strengths:** Terminal-native, model-agnostic, very lightweight. The pick for "I want a CLI coding agent without a vendor opinion."
   - **Caveats:** Less ambitious than newer agentic harnesses on long-horizon work.

**Also watch:** **Windsurf** (Cursor's main commercial competitor), **Amp** (Sourcegraph's agent), **Cline** (open-source VS Code agent), **OhMyOpenAgent** (multi-agent harness — Sisyphus/Hephaestus/Prometheus/Oracle pattern), **AgentField** (long-horizon work with typed recovery and three nested loops), **Goose** (Block's local-execution agent).

---

## Sandboxes (Action Substrate)

Where the agent's code runs. Layer 1 of the [Twelve-Layer Agentic Stack](patterns.md#the-twelve-layer-agentic-stack). The sandbox sets the ceiling on everything above it. See [Sandboxes](sandboxes.md).

1. **E2B** — ⭐⭐⭐⭐⭐
   - **Strengths:** <200ms cold start, Firecracker microVMs, broad language support (Python/JS/Ruby/C++), 24-hour session limit. Used in production by Perplexity, Hugging Face, Groq. The default unless you have a specific reason.
   - **Caveats:** Single-vendor lock-in; pricing matters at scale.

2. **Modal** — ⭐⭐⭐⭐½
   - **Strengths:** Best-in-segment for GPU workloads + serverless compute. The pick when the agent's tools include "spin up an H100 for 60 seconds."
   - **Caveats:** Less agent-specific than E2B; ergonomics tuned for ML, not for agentic loops.

3. **Daytona** — ⭐⭐⭐⭐
   - **Strengths:** Fast workspace provisioning; clean Docker-based isolation. Solid alternative to E2B with no significant downside.
   - **Caveats:** Smaller ecosystem than E2B; fewer agent-specific integrations.

4. **Contree** — ⭐⭐⭐⭐
   - **Strengths:** Git-native branching at the sandbox level. Enables tree-of-thought sandboxing — fork at every decision, run parallel branches, continue with the winner. The unique architectural pick.
   - **Caveats:** Smaller user base; the branching primitive is powerful but operationally novel.

**Also watch:** **Blaxel**, **Sprites.dev**, **Tenki Sandbox** (recent entrants — see [Tenki Review](tenki.md)), and **Cloudflare Workers / Sandboxes** for edge-network use cases.

---

## CI Runners for Agent Iteration

When an agent fleet opens 30 PRs an hour, the runner queue throttles the harness more than the model. See [Infrastructure § CI Runners](infrastructure.md) for the full table.

1. **Blacksmith** — ⭐⭐⭐⭐⭐
   - **Strengths:** Drop-in `runs-on:` replacement with 2× speed claim and aggressive caching. The category-leading commercial option. Used heavily across YC.
   - **Caveats:** Vendor lock for the cache layer; pricing scales with fleet size.

2. **Depot** — ⭐⭐⭐⭐½
   - **Strengths:** Best Docker-build acceleration + GitHub Actions runners under one roof. The pick when your CI is build-heavy.
   - **Caveats:** Strongest value when you adopt Depot Build as well; less unique on runners alone.

3. **Namespace** — ⭐⭐⭐⭐
   - **Strengths:** Reproducible runner-as-VM model; works well with agent harnesses that need a deterministic build environment.
   - **Caveats:** Less mainstream than Blacksmith/Depot.

4. **Tenki Runners** — ⭐⭐⭐⭐
   - **Strengths:** Bundled with Sandbox + Code Reviewer — the vendor-stitching pain is the explicit value prop. See [Tenki Review](tenki.md).
   - **Caveats:** Newer entrant; rate it on the bundle thesis, not standalone.

**Also watch:** **BuildJet** (the original alternative-runner), **RunsOn** (BYO-AWS for runners), **Ubicloud** (open-source GitHub Actions runner).

---

## Agent Frameworks

For when you're building your own harness — not driving an existing one. See [Approaches](approaches.md) and [Patterns § Orchestration Models](patterns.md#2-orchestration-models).

1. **LangGraph (LangChain)** — ⭐⭐⭐⭐⭐
   - **Strengths:** Industry-default for graph-shaped agent control flow. Durable execution, checkpointing, HITL, long-term memory, LangSmith integration out of the box. The pick for Python teams building stateful agents.
   - **Caveats:** Verbose; the abstraction layer is real overhead until you need it.

2. **Deep Agents (LangChain)** — ⭐⭐⭐⭐⭐
   - **Strengths:** Opinionated batteries-included harness on top of LangGraph. Sub-agents, filesystem, shell, memory, skills, HITL by default. v0.5 ships async subagents and multimodal filesystem.
   - **Caveats:** Same Python/LangChain stack lock-in as LangGraph.

3. **Claude Agent SDK** — ⭐⭐⭐⭐½
   - **Strengths:** First-party Anthropic loop exposed as a Python/TypeScript SDK. Same tools and hooks Claude Code uses, programmable.
   - **Caveats:** Anthropic-only; less mature ecosystem than LangGraph.

4. **OpenAI Agents SDK** — ⭐⭐⭐⭐
   - **Strengths:** First-party OpenAI agent framework. Native to the GPT-5.x tool-use semantics.
   - **Caveats:** OpenAI-only; lighter on production-ready primitives than LangGraph.

5. **Mastra** — ⭐⭐⭐⭐
   - **Strengths:** TypeScript-first agent framework — "Python trains, TypeScript ships." Studio + Server + Memory Gateway. Apache 2.0, 24.3K GitHub stars. The pick for full-stack JS/TS teams.
   - **Caveats:** Younger than LangGraph; smaller community of production case studies.

**Also watch:** **CrewAI** (role-based multi-agent), **smolagents** (HuggingFace minimal harness), **Pydantic AI** (type-safe agent framework), **AutoGen** (Microsoft research-oriented), **Vercel AI SDK** (front-end / streaming-focused).

---

## Observability & Tracing

You need this. 89% of orgs running agents in production have observability; 62% have detailed tracing. Logic lives in traces, not code. See [Observability](observability.md).

1. **LangSmith** — ⭐⭐⭐⭐⭐
   - **Strengths:** The de facto observability + eval layer. Integrates with AutoGen, Claude Agent SDK, CrewAI, Mastra, OpenAI Agents, PydanticAI, Vercel AI SDK — not just LangChain. Largest community of production users.
   - **Caveats:** LangChain-adjacent; pricing matters at scale.

2. **Braintrust** — ⭐⭐⭐⭐⭐
   - **Strengths:** Framework-agnostic eval + observability. Loop (auto-improves prompts/datasets), Brainstore (trace-optimized DB), SDKs in Python/TS/Go/Ruby/C#. SOC2/HIPAA/GDPR. The pick for teams that want eval-first.
   - **Caveats:** Newer than LangSmith; smaller community.

3. **Inspect AI** — ⭐⭐⭐⭐⭐
   - **Strengths:** UK AISI + Meridian Labs evaluation framework. The framework labs (Anthropic, DeepMind, Grok) actually use for pre-release. 200+ pre-built evals via `inspect_evals`. Strict superset of pytest-style eval libs.
   - **Caveats:** Aimed at safety + capability evals; less polished for product-style traces than LangSmith/Braintrust.

4. **Arize Phoenix** — ⭐⭐⭐⭐
   - **Strengths:** Open-source LLM observability with OpenTelemetry-native traces. Self-host or hosted.
   - **Caveats:** Less full-featured than LangSmith for agent-specific workflows.

**Also watch:** **Helicone** (proxy-based, simple to wire up), **WhyLabs / Patronus** (safety-metric overlays), **Langfuse** (OSS LangSmith alternative).

---

## Eval Frameworks

The missing infrastructure. ~1/3 of orgs cite quality (accuracy, consistency, tone) as the top production blocker. See [Evals](evals.md).

1. **Inspect AI** — ⭐⭐⭐⭐⭐
   - **Strengths:** Same reasons as Observability — the framework labs use it. Task/Solver/Scorer model is the clean abstraction. 200+ built-in evals.
   - **Caveats:** Curve to learn.

2. **Harbor** — ⭐⭐⭐⭐½
   - **Strengths:** LangChain's eval orchestration layer used in the *Improving Deep Agents with Harness Engineering* +13.7-point Terminal-Bench 2.0 result.
   - **Caveats:** LangChain-adjacent.

3. **LangSmith pytest** — ⭐⭐⭐⭐½
   - **Strengths:** LangSmith's eval primitive integrated with pytest + GitHub Actions. Concrete eval categories: file_operations, retrieval, tool_use, memory, conversation, summarization, unit_tests.
   - **Caveats:** Best inside the LangSmith ecosystem.

4. **Braintrust** — ⭐⭐⭐⭐½
   - **Strengths:** Eval-as-first-class. Trace-to-dataset for failure-driven regression tests. Framework-agnostic.
   - **Caveats:** Newer.

**Also watch:** **DeepEval**, **Ragas**, **Promptfoo** (lightweight CLI evals).

**Caveat the whole category:** beware contamination and infrastructure noise. [SWE-bench+](research-notes.md#swe-bench-enhanced-coding-benchmark-for-llms) showed cleaning the dataset drops SWE-bench scores from 12.47% → 3.97%. Anthropic's [infrastructure-noise post](https://www.anthropic.com/engineering/infrastructure-noise) shows infra config alone can swing Terminal-Bench by 6pp.

---

## Memory Layers

For stateful agents that survive sessions. Layer 4 of the [12-layer stack](patterns.md#the-twelve-layer-agentic-stack). See [Memory](memory.md).

1. **Letta** — ⭐⭐⭐⭐⭐
   - **Strengths:** The team behind MemGPT; the reference implementation for OS-style virtual context. Memory palace UI, background "dream agents" that refactor context, memory portability across models. Letta MemFS hit **74% on LoCoMo** with GPT-4o-mini, beating bespoke memory-tool stacks.
   - **Caveats:** Heavyweight relative to a simple key-value memory.

2. **Mem0** — ⭐⭐⭐⭐½
   - **Strengths:** Drop-in persistent memory infrastructure with API/SaaS focus. Add/Learn/Retrieve API; claims lower latency + token cost via compression. SOC2 Type 1 + HIPAA; can run in K8s / private cloud / air-gapped.
   - **Caveats:** Newer than Letta; less mind-share in research community.

3. **LangMem** — ⭐⭐⭐⭐
   - **Strengths:** Memory primitives inside the LangChain/LangGraph stack — episodic, procedural, semantic. Best fit if you're already in that ecosystem.
   - **Caveats:** LangChain-adjacent.

**Also watch:** **MemGPT** (now Letta's open project), **Context Hub** ([andrewyng/context-hub](https://github.com/andrewyng/context-hub) — 13.4K stars; markdown API docs registry that compounds across sessions).

**Caveat the whole category:** memory is a time-bomb. *"Accumulated memory raises safety violations, drives behavior drift, becomes an attack surface."* Budget and invalidate memory on purpose. See [Trojan Hippo](research-notes.md#trojan-hippo-weaponizing-agent-memory-for-data-exfiltration) — single untrusted tool call plants dormant memory payload, 85–100% ASR across four memory architectures.

---

## Agent Tool Platforms (Auth + Scaled Tool Use)

For when your agent needs auth'd access to user-scoped services (Google, Slack, Salesforce) and you don't want to roll OAuth yourself. See [Infrastructure § Agent Identity, Auth & Secrets](infrastructure.md).

1. **Arcade.dev** — ⭐⭐⭐⭐⭐
   - **Strengths:** Per-user (not service-account) OAuth, governed tool-calling. Deploy modes: cloud / VPC / on-prem / air-gapped. The pick for production agents that act on behalf of named users.
   - **Caveats:** Pricing not public on the homepage; verify before standardizing.

2. **Composio** — ⭐⭐⭐⭐½
   - **Strengths:** 1,000+ app integrations under managed auth + sandboxed remote execution. Broad tool catalog is the value prop.
   - **Caveats:** Less explicitly per-user-auth-framed than Arcade.

3. **MCP servers ecosystem (Anthropic standard)** — ⭐⭐⭐⭐½
   - **Strengths:** Open protocol, thousands of servers since Nov 2024 launch, now de facto industry standard. The right *protocol* layer underneath the auth-management products.
   - **Caveats:** Auth and per-user scoping are still cross-server and immature — Willison: *adding a third-party MCP tool can silently flip an agent into the lethal trifecta*.

**Also watch:** **Toolshed (Stripe internal — pattern reference only)**, **OpenAI Function Calling marketplace**, **Cloudflare AI Gateway** for proxy-layer tool routing.

---

## Safety / Guardrails

Defense at the input / output / capability layer. See [Safety](safety.md).

1. **LlamaFirewall (Meta)** — ⭐⭐⭐⭐⭐
   - **Strengths:** Open-source, free, model-agnostic. Part of Meta's Llama Protections suite (Prompt Guard, Code Shield, Llama Guard). The pick when you want layered defense without vendor lock-in.
   - **Caveats:** Newer than commercial vendors; operate-yourself.

2. **NeMo Guardrails (NVIDIA)** — ⭐⭐⭐⭐⭐
   - **Strengths:** Open-source rails framework with strong programmable structure. NVIDIA-backed, mature, broad community.
   - **Caveats:** Heavier than a single-purpose firewall; learning curve.

3. **Lakera Guard** — ⭐⭐⭐⭐½
   - **Strengths:** Commercial prompt-injection vendor with the deepest single-vendor focus on injection specifically. Strong eval transparency.
   - **Caveats:** Single-class focus; pair with broader defense in depth.

4. **LLM Guard (OSS)** — ⭐⭐⭐⭐
   - **Strengths:** Free, pip-install, the worst classes are blocked from day one. The pick for "we need *something* today and have no budget."
   - **Caveats:** Not a complete answer; treat as foundation.

5. **Protect AI Guardian** — ⭐⭐⭐⭐
   - **Strengths:** Enterprise AppSec framing — aligns with how AppSec teams already think about posture management.
   - **Caveats:** Enterprise-priced.

**Also watch:** **Prompt Armor**, **WhyLabs Safeguard**, **OpenAI Moderations API** (free, narrow).

**Structural answer:** content filters are bypassable; deterministic gates aren't. The headline empirical study ([Memory Sandbox](research-notes.md#defense-effectiveness-across-architectural-layers-memory-sandbox-study)): input filters 88% ASR, retrieval filters 89% ASR, Prompt Hardening 77.8% ASR, **Memory Sandbox tool-gating: 0% on 8/9 models.** Gate capability, don't filter content. See [Patterns § 8 Pre-Action Authorization](patterns.md#8-runtime-defense--pre-action-authorization-layer-12).

---

## Code Reviewers (Automated PR Review)

For when the agent fleet opens more PRs than humans can read. See [Tenki Review](tenki.md) for the head-to-head landscape.

1. **CodeRabbit** — ⭐⭐⭐⭐⭐
   - **Strengths:** Category leader — **$60M Series B, $40M ARR, 8K customers**. The default mindshare pick. Mature integration with GitHub/GitLab/Bitbucket.
   - **Caveats:** Enterprise pricing; verbosity is a known criticism.

2. **Greptile** — ⭐⭐⭐⭐⭐
   - **Strengths:** $25M Series A led by Benchmark. Strong on whole-repo context (not just diff-level review). The premium pick when you want fewer, smarter comments.
   - **Caveats:** Smaller customer base than CodeRabbit.

3. **GitHub Copilot Review** — ⭐⭐⭐⭐½
   - **Strengths:** First-party Microsoft/GitHub — zero-integration-effort if you're already on GitHub Enterprise. The default for big-cos that won't add a vendor.
   - **Caveats:** Less specialized than CodeRabbit/Greptile.

4. **Qodo** — ⭐⭐⭐⭐
   - **Strengths:** OSS / self-hostable. The pick for security-sensitive or air-gapped teams.
   - **Caveats:** Operate-yourself.

5. **Tenki Code Reviewer** — ⭐⭐⭐⭐
   - **Strengths:** Bundle pick — pair with Tenki Sandbox + Runners for vendor-stitching savings. See [Tenki Review](tenki.md).
   - **Caveats:** Newer entrant; standalone score is closer to ⭐⭐⭐⭐, the bundle is what pushes it up.

**Also watch:** **Cursor BugBot** (in-editor PR review), **Graphite Agent** (stacked-diff workflow), **Sourcery**, **Ellipsis**, **Bito**.

---

## Self-Hosted Inference

For when the API isn't enough (cost, latency, sovereignty, custom hardware). See [Inference](inference.md).

1. **vLLM** — ⭐⭐⭐⭐⭐
   - **Strengths:** Industry-default OSS inference server. Continuous batching, paged attention, PagedAttention KV cache, broad model support. Best of both worlds for serious self-hosting.
   - **Caveats:** Operate-yourself; tuning for high concurrency takes work.

2. **SGLang** — ⭐⭐⭐⭐⭐
   - **Strengths:** RadixAttention prefix caching makes it the best pick when your workload has heavy prefix reuse (long system prompts, agent loops with cached context). Academic + production traction.
   - **Caveats:** Newer than vLLM; smaller community.

3. **Groq (managed)** — ⭐⭐⭐⭐⭐
   - **Strengths:** LPU-based inference; far-and-away fastest tokens/sec for the supported model set. The pick when latency is the binding constraint.
   - **Caveats:** Limited model catalog vs general APIs.

4. **Together / Fireworks / Baseten (managed)** — ⭐⭐⭐⭐½
   - **Strengths:** Managed inference for open-weights models (GLM-5.2, MiniMax M2.7, etc.) at much lower cost than closed-frontier APIs. Three solid options with overlapping value props.
   - **Caveats:** Pick based on the specific model catalog + region you need.

5. **tinygrad / tinybox (the tiny corp)** — ⭐⭐⭐⭐
   - **Strengths:** ~20K-LOC framework, full backend matrix (CUDA/ROCm/Metal/CPU), tinybox hardware line. AMD-sovereignty angle. Production usage at comma.ai openpilot.
   - **Caveats:** Specialized — hardware sovereignty + custom kernels is the wedge, not general inference.

**Also watch:** **Modal** (serverless GPU host — overlaps Sandboxes category), **Ollama** (local-dev default), **OpenRouter** (model-routing aggregator), **AWS Bedrock / Azure AI / Google Vertex** (enterprise-grade with compliance posture).

---

## Caveats and How to Read This Page

**This page is editorial.** Every rating is the editor's judgment as of June 2026, weighted by the source notes already on the site. A different editor with different priorities would produce different rankings. *Use this as a starting point, not a final answer.*

**Saturation kills accuracy.** Categories where the leaders are pulling ahead (frontier models, observability, code reviewers) are easier to rate confidently than categories in flux (agent frameworks, code reviewers' newer entrants, the entire Tenki bundle thesis). Confidence varies by category.

**Anti-recommendation.** If you're new to the field, *don't pick from this list before you've read the corresponding category page*. The category pages explain when a "lower"-rated option is actually right for you (often: cost, security posture, language, lock-in tolerance, team scale). This page is the fast-track answer; the category pages are the considered answer.

**Refresh cadence.** This page is re-rated quarterly. Date stamps on each ranking are explicit. If you're reading this past 2026-09 and the numbers look stale, they probably are — file an issue or send a PR. See [GitHub](https://github.com/opencolin/agentic-engineering).

---

## Related

- [Reading List](reading-list.md) — what to read regularly to keep these rankings sharp
- [Research Notes](research-notes.md) — the source-of-truth bibliography behind every claim
- [Patterns § Twelve-Layer Agentic Stack](patterns.md#the-twelve-layer-agentic-stack) — the meta-organizing map this site uses
- [Changelog](changelog.md) — when these rankings last shifted and why
