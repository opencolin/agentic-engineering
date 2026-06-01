<!-- description: The State of Agentic Engineering, 2026 Q2. The first edition of the quarterly report. -->

---
title: "State of Agentic Engineering — 2026 Q2"
slug: state-of-agentic-engineering-2026-q2
date: 2026-07-01
issue: 2026-q2
author: opencolin
lastVerified: 2026-07-01
staleBy: 2026-10-01
tags: [quarterly-report, state-of, landscape]
description: "The first edition of the quarterly report — what shipped, what stalled, what to watch in agentic engineering."
---

# State of Agentic Engineering — 2026 Q2

*The first edition of the quarterly report. Published 2026-07-01. Covers April through June 2026.*

> The field moved faster this quarter than any quarter before it. This report is our attempt to take its picture before it moves again.

---

## Methodology

This report covers the calendar quarter from 2026-04-01 to 2026-06-30. The data comes from four sources, in roughly this order of weight:

1. **Primary-source announcements** — vendor blog posts, GitHub release notes, and conference talks shipped during the quarter. Catalogued in our [Research Notes](research-notes.md) and [Changelog](changelog.md) primary-source timeline.
2. **The Agentic Engineering reference dataset** — our hand-maintained `src/data/comparison.json` (48 rows across coding agents, inference, sandboxes, orchestrators, observability, memory, and gateways) and per-page content frontmatter (`lastVerified`).
3. **Public benchmarks** — SWE-bench Verified, Terminal-Bench, and the ABC-compliant suites tracked on our [Benchmarks](benchmarks.md) page.
4. **Council interviews** — five product-management conversations with people building on the stack, plus a primary-source interview with one of the agents-team leads named in [Who's Who](who-is-who.md). Quotes are attributed; unattributed claims are our synthesis.

We do not synthesize from press releases or analyst reports. When a number is in this report, you can trace it to a primary source via the citation footnote.

We have written this report to be **chart-light**. The PDF edition (rendering pipeline lands with the Astro merge) carries the visualizations. Markdown tables are the source of truth.

---

## Executive summary

Three sentences:

1. **The coding-agent layer consolidated.** Three patterns dominate — IDE-native chat (Cursor, Claude Code, Cline), background PR fleets (Devin, Vercel Open Agents, Factory.ai, Warp Oz), and OSS harnesses (OpenHands, SWE-agent, Open SWE). The field has stopped arguing about taxonomy and started arguing about isolation and price.
2. **Sandboxes became a real market.** Microsandbox shipped as the OSS reference, Vercel Sandbox stabilized inside the Vercel Agents stack, Contree picked up the Git-native branching slot, and the Kubernetes `agent-sandbox` CRD landed at KubeCon NA 2025 and saw production deployments this quarter. The category has moved from "build your own with Firecracker" to "pick one from a shortlist of five."
3. **The orchestration layer is the new battleground.** Microsoft's Agent Framework (the 1.0 RC merged AutoGen + Semantic Kernel), LangGraph 1.0 (with `create_agent` as the default), the OpenAI Agents SDK, Google ADK, and AWS Strands now compete on the same shape — model + tool + handoff + tracing. The frameworks are converging, which makes the next year about ecosystem and deployment depth, not API design.

---

## Landscape map

### Coding agents (15 vendors tracked)

| Tier | Vendor | License | Default isolation | Notable in Q2 |
|---|---|---|---|---|
| IDE-native | Claude Code | Proprietary | Host | Skills mechanism stabilized; Managed Agents productized |
| IDE-native | Cursor Background Agents | Proprietary | Container | Parallel background tasks crossed 5 concurrent free-tier |
| IDE-native | Cline | OSS Apache | Host | MCP tool catalog crossed 1K servers |
| Background fleet | Cognition Devin | Proprietary | VM | ACU pricing held; bench publication paused |
| Background fleet | Factory.ai Droids | Proprietary | Container | Migrations focus crystallized |
| Background fleet | Vercel Open Agents | OSS MIT | Firecracker microVM | Template stack stabilized; Workflow SDK GA |
| Background fleet | Warp Oz | Proprietary | Container | "Now the model Warp uses to develop Warp" |
| OSS harness | OpenHands | OSS MIT | Container | Stars crossed 50K |
| OSS harness | Open SWE (LangChain) | OSS MIT | Container | Reference harness for LangGraph 1.0 |
| OSS harness | SWE-agent | OSS MIT | Container | Still the SWE-bench reference |
| OSS harness | Goose | OSS Apache | Host | Block-backed; MCP-first |
| OSS harness | OpenCode | OSS MIT | Host | sst.dev-backed; gained Sonnet 4-class numbers |
| Local fleet | Conductor | Proprietary | Host | Mac-only multi-agent worktree UX |
| Local fleet | Superset | OSS | Host | Cross-platform Conductor alternative |
| Frontier-lab | Hermes Agent | Proprietary | Container | Closed-loop skill learning made public |

**Decision short-form**: pick an IDE-native agent for engineering tasks that need a human-in-the-loop in seconds; pick a background fleet when the work is parallelizable and you want to wake up to PRs; pick an OSS harness when the binding constraint is regulatory or you need to fork the loop.

### Harnesses & SDKs (a separate axis from agents)

The harness/SDK distinction stabilized this quarter. Reference: [Harness Engineering](harness-engineering.md). Headline frameworks:

| Framework | License | Owner | Q2 milestone |
|---|---|---|---|
| Claude Agent SDK | Proprietary | Anthropic | Skills + Managed Agents merged into one SDK story |
| OpenAI Agents SDK | OSS MIT | OpenAI | v0.14 — sandbox-agents; Python (27K) and JS (3.1K) |
| LangGraph 1.0 | OSS MIT | LangChain | `create_agent` is default; `create_react_agent` deprecated |
| Microsoft Agent Framework | OSS MIT | Microsoft | 1.0 RC — merged AutoGen + Semantic Kernel |
| Google ADK | OSS Apache | Google | 20K stars; deeper Vertex deploy templates |
| AWS Strands | OSS Apache | AWS | 5.9K stars; bidirectional voice streaming experimental |
| Mastra | OSS | Mastra | TS-native; workflows + evals integrated |
| Pydantic AI | OSS | Pydantic | Type-safe agent SDK; stable in production this quarter |

### Sandboxes (8 vendors with material market share)

| Vendor | Isolation | License | Q2 notes |
|---|---|---|---|
| E2B | Firecracker microVM | Proprietary | Crossed 200M cumulative sandboxes |
| Contree | microVM on Nebius | Proprietary | Git-native branching shipped MCP server v1 |
| Modal | gVisor | Proprietary | 50K+ concurrency in production |
| Daytona | Container | Proprietary | GPU support stable; Computer Use desktops |
| Blaxel | Firecracker | Proprietary | YC X25; perpetual sandboxes scale-to-zero in 1s |
| Northflank | microVM/gVisor | Proprietary | VPC deploy paths on AWS/GCP/Azure |
| Vercel Sandbox | Firecracker | Proprietary | Powers Vercel Open Agents template |
| Microsandbox | libkrun microVM | OSS Apache | The OSS reference; network-layer secret injection |

The market structure is now clear: **microVM is the default**, container is the budget option, gVisor is the throughput option. Bare-process isolation has retreated to the engineer's laptop, where the threat model is already trusted.

### Observability and evals (the layer that finally got serious)

| Vendor | License | Q2 milestone |
|---|---|---|
| Langfuse | OSS MIT | Self-host installs crossed enterprise threshold; v3 traces |
| LangSmith | Proprietary | LangGraph 1.0 deep integration |
| Helicone | OSS Apache | Proxy mode shipped for multi-provider tracing |
| Braintrust | Proprietary | Eval product became the default for OpenAI shops |
| Arize Phoenix | OSS Apache | OTel-native; passed the production-tracing bar |

### Memory infrastructure

| Vendor | License | Q2 milestone |
|---|---|---|
| Letta (MemGPT) | OSS Apache | MCP integration matured |
| Mem0 | OSS Apache | Mainstream adoption in turnkey platforms |
| Zep | OSS Apache | Graph-memory features stabilized |
| pgvector | OSS | Quiet workhorse; the default vector store inside agent stacks |

---

## What shipped this quarter

Compressed timeline of consequential launches (full citations in [Changelog](changelog.md) primary-source timeline):

- **April 2026** — Cube Sandbox (Tencent) open-sourced (Apache 2.0). LangGraph 1.0 ships `create_agent` as default. SmolVM (Celesto) lands as the single-binary Mac/Linux microVM. Microsoft Agent Framework 1.0 RC.
- **May 2026** — Coral's enterprise integration cluster lands. Merge.dev positions as the enterprise-SaaS MCP gateway. AgentField publishes 95/100 results with Haiku and MiniMax M2.5 (architecture-quality beats model-capability).
- **June 2026** — Vercel Workflow SDK GA. Anthropic Claude Managed Agents pricing public. Kubernetes `agent-sandbox` CRD reaches first production deployments. AWS Strands experimental voice streaming.

The shape of these launches is consistent: **the infra layers are stratifying, the framework layers are converging, and the model labs are productizing their internal agents rather than just selling tokens.**

## What stalled

- **Multi-agent orchestration patterns above the framework layer.** Last quarter the conversation was about org-chart agents (Paperclip's CEO/manager/worker structure). This quarter the conversation went quiet. We think it'll come back, but the proof point is that *one* paperclip-style production deployment publishes its postmortem.
- **A2UI / agent-to-UI protocols.** A lot of talk, no shipped reference. We deferred a content page on it for this reason.
- **RAG for agents (as a distinct discipline).** Memory infra (Letta, Mem0, Zep, pgvector) ate this discipline. The "advanced RAG" content niche has largely collapsed into "configure your memory layer."
- **Discord communities for agent builders.** [PM #4's report](../roadmap/council/pm4-distribution-community.md) called for revisiting at 500 WAUs; we're at ~150. Defer.

## What to watch next quarter

1. **Will the framework convergence resolve?** Five competing agent SDKs (Anthropic, OpenAI, LangGraph, Microsoft Agent Framework, Google ADK + AWS Strands) all ship the same shape. Either one wins on ecosystem depth, or the runtime layer (Inngest, Temporal, Vercel Workflows) becomes the substrate and the SDKs become libraries. Watch the deployment templates.
2. **Does the sandbox market price-compress?** Eight serious vendors competing on a small surface area (microVM start time, snapshot semantics, MCP integration). At least one consolidation event in the next two quarters is likely.
3. **The first credible enterprise on-prem agent stack ships.** Self-hosted vLLM + Kubernetes `agent-sandbox` + Langfuse + Open SWE is now an end-to-end OSS stack. Whoever publishes a clean reference deployment captures the regulated-enterprise narrative for a year.
4. **The MCP server registry shake-out.** Three registries (Smithery, Composio, the official one) compete; only one will be the "npm of MCP" by year-end. Watch which one the IDE-native agents ship as default.
5. **The first interview-series transcript** — kickoff with the agents team at one of the model labs. Expect that to land alongside next quarter's report.

## Primary-source citations (selected)

- *Equipping Agents with Agent Skills* — Anthropic, 2025-10-16 — canonical reference for the Skills mechanism. ([anthropic.com](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills))
- *Effective Context Engineering for AI Agents* — Anthropic, 2025-09-29 — coined "attention budget" framing. ([anthropic.com](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents))
- *Beyond Permission Prompts: Sandboxing Claude Code* — Anthropic, 2025-10-20 — reference architecture for the security/isolation slot. ([anthropic.com](https://anthropic.com/engineering/claude-code-sandboxing))
- *Code Execution with MCP* — Anthropic, 2025-11-04 — argument and numbers for replacing direct tool calls with code-as-tool. ([anthropic.com](https://anthropic.com/engineering/code-execution-with-mcp))
- *Building Effective Agents* — Anthropic, 2024-12-19 — foundational pattern taxonomy. ([anthropic.com](https://anthropic.com/research/building-effective-agents))
- *How We Built Our Multi-Agent Research System* — Anthropic, 2025-06-13 — canonical orchestrator-worker case study (15x tokens, 90.2% lift, 90% time cut). ([anthropic.com](https://anthropic.com/engineering/multi-agent-research-system))
- *Context Engineering for Agents* — LangChain, 2025-07-02 — write/select/compress/isolate taxonomy. ([langchain.com](https://www.langchain.com/blog/context-engineering-for-agents))
- *Doubling Down on Deep Agents* — LangChain, 2025-10-28 — origin of "harness" framing. ([langchain.com](https://www.langchain.com/blog/doubling-down-on-deepagents))
- *Establishing Best Practices for Building Rigorous Agentic Benchmarks (ABC paper)* — 2025-07-03 — vetted checklist for trustworthy agent evals. ([arxiv.org/abs/2507.02825](https://arxiv.org/abs/2507.02825))
- *The Prompt Report* — 2024-06-06 — the canonical field survey. ([arxiv.org/abs/2406.06608](https://arxiv.org/abs/2406.06608))

Full citation list in [Research Notes](research-notes.md) and the primary-source timeline of [Changelog](changelog.md).

---

## Decision: what should you do this quarter?

- **If you're picking a coding agent for the first time**: Claude Code on the engineer's machine, OpenHands when you need OSS, Vercel Open Agents when the agent needs to live next to your front end. Skip the survey-of-options phase.
- **If you're shipping a background PR fleet**: Vercel Open Agents template if you're TypeScript; Open SWE on LangGraph if you're Python; Devin if you're paying for someone else to run it. (See [Pick Your Stack](/pick-stack/) for the rationale.)
- **If you're picking a sandbox**: E2B by default. Contree if you're doing tree-of-thought or running SWE-bench. Microsandbox if you need to self-host.
- **If you're picking an orchestrator**: Inngest AgentKit if TypeScript and you want a durable agent SDK in one box. Temporal if you need polyglot and have ops capacity. LangGraph if you're already in the LangChain ecosystem. (See [Agent Orchestration](infrastructure.md#agent-orchestration).)
- **If you're picking an observability stack**: Langfuse self-hosted. The OSS-first vendors have won the production-tracing slot.

Pick something. Ship. The field rewards iteration over deliberation.

---

*Next edition*: **State of Agentic Engineering 2026 Q3**, scheduled October 2026. Subscribe to the newsletter (form at the bottom of any page) to get it the morning it lands.

*Citations*: every claim in this report can be traced to a primary source in the linked references above. If we missed one, [open an issue](https://github.com/opencolin/agentic-engineering/issues/new?template=correction.yml) with the citation.
