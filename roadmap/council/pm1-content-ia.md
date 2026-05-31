<!-- description: PM Council Report #1 — Content & Information Architecture lens for v2 of agentic-engineering. -->

# PM #1 — Content & Information Architecture

**Lens:** What we publish, how it's organized, what's missing.
**Author:** PM Council subagent (general-purpose), `agentId: a03f463044ed9efa7`
**Status:** Read-only research; no files modified.

---

## 1. Content Gaps

The site is strong on **landscape mapping** (vendors, systems, people) but thin on **practitioner runbooks**. Concrete gaps from a sweep of `content/`:

- **Observability / tracing** — exists only as a vendor table at `infrastructure.md:455-481` (LangSmith, Langfuse, Helicone, AgentOps). No narrative page on *how* to instrument an agent, what to trace, span schemas, OTel-for-LLMs, eval-in-the-loop. Major hole given `schools.md` calls Chase's school "Trust as Observability."
- **Cost models** — scattered across `inference.md` (model routing) and `infrastructure.md` (per-tier $$ tables). No dedicated page on token budgeting, cache economics, hybrid-model routing math, idle-cost calculations for sandboxes/VPS, or the "cost-per-PR" framing.
- **Safety / red-teaming** — one table at `infrastructure.md:500-512` (NeMo, Lakera, LlamaFirewall, Anthropic Bloom). Zero narrative on prompt-injection threat model, tool-misuse, agent-specific attack surface, or governance/auth loop.
- **Agent UX patterns** — `generative-ui.md` covers rendering well, but the *interaction* layer (streaming, interrupts, approval cards, plan editing, transcript design, todo-list UIs, ambient agents) is split between `generative-ui.md` and scattered mentions in `approaches.md`. No canonical "Agent UX" page.
- **Multi-agent orchestration** — covered as patterns (`patterns.md` §2) and as a vendor list (`infrastructure.md:184+`), but no first-class page on swarm/hierarchical/handoff patterns, when multi-agent beats single-agent, or the Anthropic / Paperclip "AI company" framing.
- **RAG-for-agents** — effectively absent. `infrastructure.md:419` lists vector DBs; nothing on retrieval design for agentic workflows (skill retrieval, codebase retrieval, MCP-as-retrieval, when *not* to RAG).
- **Deployment & ops** — no page on rollout strategies (shadow → canary → autonomous), on-call patterns, agent SLOs, kill-switches, drift monitoring.

Also: `approaches.md` is 95KB / 29 H2 entries — past the "single page" usability threshold.

## 2. IA Fixes

- **Rename `Approaches` → `Coding Agents`.** Vague, SEO-invisible. Page is exclusively coding-agent systems.
- **Split `approaches.md`.** 29 systems on one page hurts navigation. Break out: Terminal CLIs, Skills/Plugins/Marketplaces, Browser/Computer-Use.
- **Promote buried infrastructure subsections to top-level pages**: `Agent Observability & Evaluation`, `Guardrails & Safety`, `MCP Servers / Registries / Gateways`, `Agent Identity, Auth & Secrets`.
- **New sidebar groups proposed:**
  - **Operate** (new): Observability, Cost & Economics, Safety & Red-teaming, Deployment Patterns
  - **Protocols** (new): MCP, A2UI / AG-UI, Identity & Auth (move from infra)
  - **Interfaces** keeps Generative UI, **+ new Agent UX**
- **`Schools` and `Who's Who`** belong in a `People & Ideas` group, not alongside vendors.
- **`comparison.md` is anemic** (4KB). Either invest heavily or fold into `Coding Agents` as a closing section.

## 3. Content Cadence

**v1.1 — "Operate" cluster (2 weeks)**
- New `observability.md` (narrative + decision tree + existing table)
- New `safety.md` (threat model, prompt-injection patterns, guardrail placement)
- New `cost-economics.md` (token math, caching, routing, per-PR cost)
- Rename `approaches.md` → `coding-agents.md`; update sidebar
- Split out `coding-clis.md` from the bottom of approaches

**v1.2 — "Interfaces" cluster (2 weeks)**
- New `agent-ux.md` (streaming, interrupts, approval, plan-edit, ambient-agent patterns)
- Expand `generative-ui.md` with A2UI / AG-UI / MCP-UI decision matrix
- New `protocols.md` index page tying MCP + A2UI + AG-UI + identity

**v1.3 — "Build" cluster (3 weeks)**
- New `rag-for-agents.md`
- New `multi-agent.md` (lifted + expanded from `patterns.md` §2)
- New `deployment.md`
- Expand `benchmarks.md` with "how to build your own eval"

**v2.0 — Killer features + polish (3-4 weeks)**
- Interactive comparison matrix
- "Build-an-agent-in-an-hour" guided tracks
- Full IA reshuffle: Get Started / Coding Agents / Patterns & Schools / Operate / Protocols / Interfaces / Infrastructure / People / Community
- Search-by-vendor and search-by-concept tagging
- Auto-generated "what changed since last visit" diff (data already in changelog)

## 4. Killer Features

1. **Interactive Comparison Matrix** — replace static `comparison.md` with a filterable matrix across coding agents + infra vendors. Pick axes (isolation tier, $/PR, HITL support, MCP support, license) → live table. No competitor has the curated cross-vendor dataset.
2. **"Build-this-agent-in-an-hour" guided tracks** — 3-5 opinionated, executable tutorials (e.g., "Code-review agent on Vercel Workflow SDK + GitHub MCP", "Local Claude Code + Contree", "Self-hosted swarm on a $5 VPS"). Ties one item from each cluster (harness + sandbox + observability + auth). The missing "do" layer.
