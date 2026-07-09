<!-- description: Cross-cutting patterns that appear across approaches to autonomous coding agents. Understanding these helps you evaluate tools and design your own agentic systems. -->

# Architectural Patterns in Agentic Engineering

Cross-cutting patterns that appear across the different approaches to autonomous coding agents. Understanding these patterns helps you evaluate tools and design your own agentic systems.

---

## Harness Engineering

The overarching discipline that ties all other patterns together. Coined in the context of OpenAI's Symphony project, harness engineering is the practice of building the infrastructure, feedback loops, and encoded knowledge that make autonomous agents productive.

**Reference:** https://www.latent.space/p/harness-eng

### Core Thesis

The fundamental insight: the scarcest resource is synchronous human attention. Everything else — code, tests, PRs — can be parallelized across agents. Software must be written for agent legibility as much as human readability.

### Key Principles

- **Code is context, code is prompts** — Agent behavior improves with codebase consistency. Write code that agents can reliably parse and modify.
- **Encode all requirements as text** — Non-functional requirements, coding standards, architectural decisions — everything must exist as context agents can consume (rule files, specs, tests, docs).
- **When agents fail, ask what's missing** — Don't blame the model. Ask: what capability, context, or structure would have prevented this failure? Then build it.
- **One-minute build loops** — Impose hard constraints on feedback speed. If the build takes longer than a minute, decompose further.
- **Observability-first** — Spawn metrics, traces, and logging infrastructure before writing application code. Agents need to see what's happening.
- **Code is disposable** — Treat code as ephemeral context, not permanent artifact. Worktrees are cheap, merge conflicts are trivial for agents, dependencies can be inlined in an afternoon.

### Spec-Driven Software ("Ghost Libraries")

Distribute software as detailed specifications rather than implementations:

1. Create a high-fidelity spec
2. Spawn disconnected agents to implement against the spec
3. Review implementations against upstream
4. Iterate

This enables agents to reproduce complex systems locally without importing fragile dependency chains.

### Skills as Encoded Engineering Taste

Not traditional agent skills — domain-specific primitives that encode your team's engineering judgment:

- **Tech Tracker** — Markdown table for business logic guardrails
- **Quality Score** — Markdown-based assessment hooks
- **Review Agents** — Check code against documented standards with priority frameworks (P0-P2)

Each skill provides tracing and metrics automatically. Skills determine when to invoke themselves (agent discretion, not forced).

### The Human Role Shift

From: Individual contributor writing code.
To: Systems thinker optimizing agent productivity.

- Focus on "where are agents making mistakes?"
- Build abstractions to unblock agents
- Move higher up the stack as models improve
- Review 1-2x daily (yes/no decisions on batched PRs), not line-by-line

---

## The Twelve-Layer Agentic Stack

A meta-organizing map for everything that follows. [Immersive Commons](https://www.immersivecommons.com/news/agentic-stack-12-layers) (June 2026) synthesized ~1,800 recent agentic papers into a 12-layer model of where the engineering of an autonomous agent actually lives — from the action substrate at the bottom to runtime defense at the top. Each layer names a state-of-the-art approach and a common failure mode; the document is positioned as a "builder's map" and refreshed monthly.

The thesis: *"An agent is a loop, not a model with a clever prompt. Almost all of its real-world capability comes from the engineering around that loop, not from the weights."* The 12 layers are how this site is organized in practice — almost every chapter is the deep dive on one or two of them.

### The 12 layers, mapped to this site

| # | Layer (verbatim) | What it covers | Where this site covers it |
|---|---|---|---|
| 01 | Action Substrate | How the loop acts: shell, code interpreter, sandbox, CodeAct | [Sandboxes](sandboxes.md), § 1 below |
| 02 | Control Loop & Planning | ReAct, MCTS, world models, Agent Q, DPO | [Harness Engineering](harness-engineering.md), [Approaches](approaches.md), § 2 below |
| 03 | Tool Interface & Discovery | MCP, hierarchical retrieval, AnyTool, ToolFuzz | [Tool Design](tool-design.md), § 3 below |
| 04 | Memory & Recall | MemGPT, virtual paging, archival KV/vector | [Memory](memory.md) |
| 05 | Context Lifecycle & Compression | ACON, MemAct, AgentFold, trajectory folding | [Context Engineering](context-engineering.md), § 3 below |
| 06 | Multi-Agent Coordination & Interop | MetaGPT, phase DAG, schema-constrained handoffs, SOP-as-prompt | § 6 below |
| 07 | Runtime & Resource Management | KV-cache reuse, prompt placement, AgentRM, MLFQ admission | [Infrastructure](infrastructure.md), [Cost & Economics](cost-economics.md) (under-built per IC) |
| 08 | Self-Improvement & Skill Acquisition | Agent Workflow Memory, EvoSkill, AlphaEvolve | [Skills](skills.md) covers the primitive; *self-improvement is a gap* |
| 09 | Verification & Observability | Trace-Based Assurance, message-action trace, LLM-as-judge | [Observability](observability.md) |
| 10 | Evaluation & Reliability | τ-bench, pass^k, milestone scoring, ToolSandbox, SWE-bench+ | [Evals](evals.md), [Benchmarks](benchmarks.md) |
| 11 | Adversarial Surface & Red-Teaming | ART, AiTM, tool-poisoning, cross-temporal attacks | [Safety](safety.md), § 7 below |
| 12 | Runtime Defense & Pre-Action Authorization | OAP, Faramesh, MELON, Memory Sandbox, external non-bypassable gates | [Safety](safety.md), § 8 below |

### Four Hard Truths

The framework distills four field-wide findings worth pinning at the top of any agentic-engineering practice:

1. **Capability lives in the harness, not the model** — scaffold engineering beats model upgrades for agent improvement.
2. **Memory is a time-bomb** — accumulated memory raises safety violations, drives behavior drift, becomes an attack surface. *"Budget and invalidate memory on purpose."*
3. **Reasoning can be performative** — models rationalize actions post-hoc; chain-of-thought is an unreliable safety control. *"Verify actions, not explanations."*
4. **Autonomy is a regression vector** — self-improving agents misevolve; accumulated memory, self-created tools, and rewritten workflows can degrade the alignment they started with.

### Which layers are under-built

IC classifies the field as **1 solved layer** (Action Substrate), **7 consolidating layers**, and **4 emerging / under-built layers** — Layers 7 (Runtime & Resource Mgmt), 8 (Self-Improvement), 9 (Verification & Observability), and 12 (Runtime Defense & Pre-Action Authz). These are the highest-leverage investment areas. Layer 9 specifically is called *"the buildable spine."*

Honest audit of this site against that view:

- **Layer 9 (Observability)** — covered by a dedicated chapter
- **Layer 12 (Runtime Defense & Pre-Action Authz)** — newly framed in § 8 below
- **Layer 7 (Runtime & Resource Mgmt)** — partial; [Cost & Economics](cost-economics.md) covers the cost angle but not KV-cache engineering or admission control as design surfaces
- **Layer 8 (Self-Improvement & Skill Acquisition)** — genuine gap; the Skills chapter covers the *primitive*, not the *self-improvement* literature (Agent Workflow Memory, EvoSkill, AlphaEvolve)

The structured source notes for the framework — including the verbatim layer list, all ~30 cited papers, and the per-layer empirical claims — live in [Research Notes § 9](research-notes.md#section-9-agent-architecture-frameworks-post-ingestion-thematic-add).

---

## 1. Isolation Strategies

How agents are sandboxed from production and from each other.

| Strategy | Used By | Pros | Cons |
|----------|---------|------|------|
| **EC2 Devboxes** | Stripe Minions | Full OS isolation, identical to human env, pre-warmed in ~10s | Expensive, AWS-specific |
| **Docker Containers** | OpenHands, SWE-agent | Lightweight, reproducible, widely supported | Less isolation than VMs, image management |
| **Git Worktrees** | AgentField | Zero overhead, native git, parallel branches | No process isolation, shared filesystem |
| **Cloud Sandboxes** | Open SWE, Rivet | Scalable, provider-agnostic | Latency, cost, network dependency |
| **Local Execution** | Goose, Aider, OpenCode | Fast, no setup cost | No isolation, risk to local state |

### Key Insight

Stripe chose EC2 devboxes because git worktrees "wouldn't scale at Stripe." But for most teams, worktrees or Docker provide sufficient isolation at far lower cost. The right choice depends on codebase size, security requirements, and parallelization needs.

### Sub-Pattern: Agent Outside the Sandbox

A secondary architectural decision, independent of isolation tech: **where does the agent loop itself run, relative to the sandbox it controls?**

- **Agent inside sandbox** — The LLM call, tool dispatcher, and sandbox share a lifecycle. Simple to build, but the sandbox is both the execution environment AND the control plane. If the sandbox dies, the agent dies.
- **Agent outside sandbox** — The agent runs as a durable workflow in a separate compute layer and calls into the sandbox via tools (file read/edit, shell, search). The sandbox is pure execution; the agent is pure orchestration.

[Vercel Open Agents](approaches.md#vercel-open-agents) is the canonical example of the "agent outside" pattern. Its principle: *"The agent is not the sandbox."* Benefits:

- Agent survives sandbox hibernation — sandbox sleeps, agent keeps state
- Chat turns span many workflow steps that survive request timeouts
- Model/provider swaps don't touch the sandbox
- Sandbox stays single-purpose (code execution), not a control plane

Stripe Minions takes the opposite approach: the agent lives inside the devbox because the devbox is long-lived and pre-warmed. Both work — the trade-off is between sandbox lifecycle independence (agent outside) and simplicity (agent inside).

---

## 2. Orchestration Models

How agent execution is structured — the balance between deterministic steps and LLM creativity.

### Blueprints (Stripe Minions)

Hybrid state machines with two node types:
- **Deterministic nodes** — Run linters, push code, manage git (always execute the same way)
- **Agentic nodes** — Implement features, fix CI failures (LLM decides how)

This ensures required steps always happen while giving the LLM freedom where it matters.

### Patchflows (Patchwork)

Reusable workflow templates combining atomic actions with LLM prompts:
```
AutoFix: detect_issue → prompt_llm → apply_patch → run_lint → commit → create_pr
```

### LangGraph (Open SWE)

Graph-based orchestration where nodes are agents with defined inputs/outputs:
```
Manager → Planner → Programmer → Reviewer → PR
```

### Multi-Agent Teams (OhMyOpenAgent)

Named specialist agents with distinct roles:
```
Sisyphus (orchestrator) → Hephaestus (deep worker) + Prometheus (planner) + Oracle (debugger)
```

### Free-Form Agent Loop (OpenHands, SWE-agent)

Single agent loop with tools and no predefined workflow. The LLM decides what to do at each step.

### Key Insight

More structured orchestration (blueprints, patchflows) trades flexibility for reliability. Free-form loops are more adaptable but harder to debug and less predictable. The trend is toward hybrid approaches.

---

## 3. Context Management

How agents acquire the knowledge they need to work on a codebase.

### MCP (Model Context Protocol)

Standardized protocol for providing LLMs with tools and context. Used by Stripe (Toolshed, 400+ tools), Goose (70+ extensions), and increasingly the whole ecosystem.

**Key pattern: Curated subsets** — Stripe doesn’t give minions all 400+ tools. Each run gets a curated subset to prevent tool explosion in the context window.

### Rule Files

Agent-readable instruction files (like `.cursorrules`, `AGENTS.md`, `CLAUDE.md`) that provide codebase-specific guidance.

**Key pattern: Conditional rules** — Almost all of Stripe's agent rules are applied based on subdirectory, not globally. This prevents context bloat from irrelevant instructions.

### Pre-Hydration

Running deterministic context-gathering before the agent loop starts:
- Parse URLs from the task description
- Fetch linked tickets, docs, PRs
- Run code intelligence queries
- Build initial context package

**Key pattern:** Stripe runs relevant MCP tools over likely-looking links before a minion run even starts.

### Hierarchical Context (OhMyOpenAgent)

Auto-generated `AGENTS.md` files at each directory level, providing agents with context that's scoped to their current working area rather than the entire repo.

---

## 4. Feedback Loops

How agents learn from failures and iterate toward success.

### The Shift-Left Principle

Catch failures as early and cheaply as possible:

```
Local Lint (~1s) → Local Tests (~5s) → CI Tests (~minutes) → Human Review
```

Stripe's approach: local executable with heuristic-selected lints runs on each git push in under 5 seconds. Any lint that would fail in CI should be enforced locally.

### Iteration Caps

Most systems cap the number of retry cycles to avoid burning tokens on diminishing returns:

| System | Local Retries | CI Rounds | Total Cap |
|--------|--------------|-----------|-----------|
| Stripe Minions | Unlimited local lint | 2 max | ~3 iterations |
| AgentField | 5 per issue | Gate-controlled | Escalates to replanner |
| OpenHands | Tool-based | Iterates until pass | No hard cap |
| OhMyOpenAgent | Ralph Loop | N/A | Until completion |

### Auto-Fixes

Stripe's CI tests often include auto-fixes for common failures. When a test fails, the fix is automatically applied before the agent even tries to fix it manually. This dramatically reduces wasted LLM cycles.

---

## 5. Failure Recovery

What happens when things go wrong — the strategies beyond simple retry.

### Simple Retry (Most agents)

Run the same task again, possibly with the error message as additional context.

### Typed Recovery (AgentField)

Structured recovery actions based on failure type:
- **Retry modified** — Same task, different approach
- **Retry with different approach** — Explicitly change strategy
- **Split issue** — Break the failing task into smaller subtasks
- **Accept with debt** — Mark as known gap, let downstream agents work around it
- **Escalate** — Send to human or higher-level agent

### Three Nested Loops (AgentField)

```
Inner Loop: Per-issue retries (up to 5 iterations)
    ↓ failure
Middle Loop: Issue advisor selects recovery action
    ↓ cascading failures
Outer Loop: Replanner restructures remaining work
```

### Checkpoint-Based Recovery

AgentField saves state at every level boundary. A build failing at invocation 140 resumes from that point rather than restarting from scratch.

[Contree](https://contree.dev) takes this further with Git-like branching at the sandbox level — agents can checkpoint the entire environment, fork to try multiple approaches, and roll back to any prior state without re-execution. This enables *tree-of-thought sandboxing*: fork at each decision point, run parallel branches to evaluate, then continue with the winner. See [Sandboxes](sandboxes.md#contree-the-git-native-sandbox) for details.

### Key Insight

The sophistication of failure handling is often the biggest differentiator between toy agents and production systems. Stripe's 2-CI-round cap is deceptively simple but reflects a pragmatic insight: there are diminishing marginal returns for an LLM to run many rounds of a full CI loop.

---

## 6. Multi-Agent Coordination

How parallel agents avoid stepping on each other.

### Git Worktree Isolation (AgentField)

Each issue operates in its own git worktree with its own branch. No lock contention between parallel agents.

### Intent-Aware Merging (AgentField)

When multiple issues modify the same files, a merger agent performs conflict resolution that understands the intent of each change, not just the text diff.

### Task Decomposition (Composio)

A planner agent breaks work into independent subtasks, distributes them to worker agents, then merges results.

### Devbox Isolation (Stripe)

Each minion gets its own full development environment. No shared filesystem, no merge conflicts during execution. Conflicts are handled at PR time by human reviewers.

### Key Insight

Stripe chose to avoid merge conflicts entirely by isolating at the VM level and letting humans handle PR-level conflicts. AgentField chose to embrace parallelism and build automated merge resolution. The right choice depends on how independent your tasks are.

---

## 7. Adversarial Surface & Red-Teaming (Layer 11)

Layer 11 of the [Twelve-Layer Agentic Stack](#the-twelve-layer-agentic-stack) — the catalogued attack surface that follows from agents having memory, tools, and external IO. The dedicated chapter is [Safety](safety.md); this section is the cross-cutting framing and reference taxonomies.

Most agent designs inherit the wrong threat model from chat (filter the prompt, trust the model) and miss the failure mode that actually matters: an agent with tools is an attack-execution engine, not a text generator. Immersive Commons reports the consensus empirical finding: *"Nearly every deployed agent violates policy within 10–100 queries and robustness doesn't correlate with model size."*

### The Lethal Trifecta

Simon Willison's canonical formulation: an agent is dangerous when it combines all three of (a) **access to private data**, (b) **exposure to untrusted content**, (c) **ability to communicate externally**. Any single capability is safe in isolation; the combination is exfiltration-by-design. ([source](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/))

> "If your agent combines these three features, an attacker can easily trick it into accessing your private data and sending it to that attacker."

Important corollary: **adding a third-party MCP tool can silently flip an agent into the trifecta**. Every new tool changes the threat surface.

### Why Guardrails Aren't Enough

Current LLM architectures cannot rigorously separate system instructions from instructions embedded in untrusted content — this is the same root cause Google's SAIF agentic guidance names and the reason OWASP's Agentic Top 10 exists as a distinct list from the LLM Top 10. Prompt-injection is, in Meta's words, "a fundamental, unsolved weakness in all LLMs." ([Meta](https://ai.meta.com/blog/practical-ai-agent-security/))

### Reference Taxonomies

| Source | What it gives you |
|---|---|
| [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) | Industry-standard agent-specific risk categories (Dec 2025) |
| [MITRE ATLAS](https://atlas.mitre.org) | Living TTP knowledge base for AI/ML adversaries — agent-specific tactics from Initial Access through Exfiltration |
| [Layered Attack Surface Framework — arXiv 2604.23338](https://arxiv.org/abs/2604.23338) | Academic 7-layer + temporality taxonomy; surveys 116 papers (2021–2026) |
| [Defense in Depth for Autonomous AI Agents — Microsoft](https://www.microsoft.com/en-us/security/blog/2026/05/14/defense-in-depth-autonomous-ai-agents/) | Five novel agent threat classes: agent hijacking, intent breaking, sensitive-data leakage, supply-chain compromise, inappropriate reliance |

### Key Insight

The adversarial surface of an agent is determined more by **which tools it can call in combination** than by which model is driving it. A model upgrade doesn't change the threat model; adding a tool with new auth scope does. Audit the tool combinations, not the prompt.

---

## 8. Runtime Defense & Pre-Action Authorization (Layer 12)

Layer 12 of the [Twelve-Layer Agentic Stack](#the-twelve-layer-agentic-stack) — the non-bypassable enforcement layer that closes the attack surface named in Layer 11. The mitigation pattern that follows from the adversarial-surface threat model: never trust the model's decision to act — gate every action through a deterministic policy at the tool-call boundary. Authentication says *who* the agent is; pre-action authorization says *what it's allowed to do right now*.

Immersive Commons calls this layer one of the four "emerging / under-built" investment areas, alongside Verification & Observability (Layer 9). Their phrasing: *"Only an external, non-bypassable gate is reliable. The same shim doubles as your spend/quality gate."*

### Meta's Rule of Two

Operational design-time rule: an agent session must satisfy **no more than two of three** properties — (A) processes untrustworthy input, (B) accesses sensitive systems, (C) changes state or communicates externally. If all three are required, autonomous execution is prohibited; supervise via HITL approval or reliable validation. ([source](https://ai.meta.com/blog/practical-ai-agent-security/))

This is the direct operationalization of Willison's lethal trifecta — diagnostic plus prescription, the cleanest single-page pairing in agent security.

### Deterministic Gates at the Tool-Call Boundary

The Open Agent Passport (OAP) specification ([arXiv 2603.20953](https://arxiv.org/abs/2603.20953)) gives the concrete primitive: synchronously intercept every tool call, evaluate a declarative policy, allow or deny before execution. Measured numbers:

| Metric | Result |
|---|---|
| Median authorization latency | 53 ms (N=1,000) |
| Social-engineering attack success — permissive policy | 74.6% |
| Social-engineering attack success — OAP restrictive policy | 0% (across 879 attempts) |

The same gate generalizes beyond security: spending limits, capability scoping, sub-agent delegation, quality gates, and compliance controls all become declarative policies at the same boundary.

### Classifier-Mediated Autonomy (Anthropic's Auto Mode)

[Claude Code Auto Mode](https://anthropic.com/engineering/claude-code-auto-mode) replaces permission prompts with a two-stage classifier — a prompt-injection probe at input plus a transcript classifier at output. Measured: 0.4% false-positive rate on n=10,000 real traffic; 17% false-negative on n=52 overeager actions. The architecture is a three-tier hierarchy:

```
Built-in allowlist  →  In-project file ops  →  Transcript classifier for high-risk actions
```

Both stages strip assistant text to resist prompt-injection of the classifier itself. The threat model named explicitly: overeager behavior, honest mistakes, prompt injection, model misalignment.

### Google SAIF: Three Core Principles

Google's published agent-security principles ([source](https://simonwillison.net/2025/Jun/15/ai-agent-security/)) align with the same architecture:

1. **Well-defined human controllers** — every agent has an identified responsible human
2. **Limited agent powers** — least-privilege capability scoping (the OAP enforcement substrate)
3. **Observable actions and planning** — traces and audit logs as first-class infrastructure

Defense is hybrid: Layer 1 deterministic runtime policy enforcement, Layer 2 reasoning-based defenses. **Deterministic first, model-based second** — the model is part of the defense, not the only line.

### Microsoft DiD: Four Application-Layer Patterns

Microsoft's layered-defense post ([source](https://www.microsoft.com/en-us/security/blog/2026/05/14/defense-in-depth-autonomous-ai-agents/)) names the application-layer patterns most relevant to pre-action authz:

| Pattern | What it does |
|---|---|
| **Agents-as-microservices** | Each agent is a network-isolated service with explicit interfaces, not an in-process call |
| **Least permissions** | Scoped credentials per tool, per session — never the developer's full OAuth |
| **Deterministic HITL** | Human approval is a non-bypassable code path, not a prompt to the model |
| **Agent identity as a security primitive** | Agents have stable identities for audit, not anonymous sessions |

> "When an agent can act autonomously, mistakes propagate faster, blast radius increases, and rollback becomes harder."

### Key Insight

The "permission prompt" UX that current agents use is the wrong abstraction: users approve 93% of prompts ([Anthropic Auto Mode data](https://anthropic.com/engineering/claude-code-auto-mode)) — approval fatigue dominates real behavior, so the prompt provides almost no security value. The fix is to move authorization decisions **out of the user's interactive loop** and into a deterministic policy layer that gates the agent at the tool-call boundary. Humans set policy; the gate enforces it; the agent runs autonomously within it.
