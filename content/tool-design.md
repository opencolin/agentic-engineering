<!-- description: How to write tools that agents actually use well — MCP as the assumed wire format, consolidate vs CRUD plumbing, ResponseFormat compression (206→72 tokens), lazy loading via Tool Search Tool (-85% tokens), code-as-tool via sandboxes (150K→2K tokens), SQL-over-APIs (Coral, Steampipe, MindsDB) as an alternative to tool-per-call, Tool Use Examples (+18pp accuracy), and what to measure per tool. -->

# Tool Design

How to write tools that agents actually use well. The most-overlooked layer in agent quality — most production teams tune prompts and pick models; the tool layer is where the biggest wins quietly live.

> "Tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents." — [Anthropic, Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents)

The empirical case from the same post: Claude-optimized tools beat human-written ones on held-out Slack-MCP evals after iterative agent-led refinement. And during the SWE-bench work, [Anthropic spent more time tuning tools than tuning prompts](https://anthropic.com/research/building-effective-agents) — using absolute file paths instead of relative eliminated a whole class of mistakes.

---

## MCP — the wire format you're writing tools in

Read this first. Everything else on this page is *content*; this is the *protocol*.

[Model Context Protocol](https://modelcontextprotocol.io) was launched by Anthropic in November 2024 as an open spec for how agents discover and call tools. By late 2025 it had become the **de-facto industry standard** — Claude, GPT, Gemini, Grok, and most open-weights model loops all speak MCP either natively or via adapters. As of mid-2026 there are **thousands of MCP servers** in public registries plus countless private ones inside companies.

What this means practically:

- **Your tool definitions are MCP.** Even if you don't think you're writing MCP — if you're exposing a tool to Claude Code, the Claude Agent SDK, ChatGPT, or any modern agent harness, the over-the-wire format is MCP. Stop thinking of MCP as "a thing Claude uses" and start thinking of it as "the format every agent reads."
- **The ecosystem already solved discovery.** You no longer need to invent how an agent finds a tool — MCP servers expose tool catalogs that any client can list and call. Focus your design energy on *what makes your specific tools good*, not on plumbing.
- **The cross-vendor portability is real.** A well-designed MCP server you ship today works inside Claude Code tomorrow and a Vercel AI SDK agent the day after. This is the biggest reason MCP won the protocol war.

**Anatomy of an MCP tool** (the part that matters for tool design):

```json
{
  "name": "schedule_event",
  "description": "Create a calendar event with the given participants...",
  "inputSchema": { "type": "object", "properties": { ... } }
}
```

The `description` field is where most of the win is — this is what the model reads to decide whether to invoke. [Tool Use Examples](#tool-use-examples--the-input_examples-pattern) (Anthropic's `input_examples` extension) bolts onto this same schema and adds another ~18 percentage points of accuracy on complex parameters.

**The governance layer.** Real production agents need per-user OAuth, audit trails, sandboxing, and rate-limiting around MCP tool execution. Two runtimes sit between the agent and your raw MCP tools to provide this:

- **[Arcade](https://arcade.dev)** — MCP runtime with per-user (not service-account) auth, OAuth handling, deploy modes (cloud / VPC / on-prem / air-gapped), Arcade Registry marketplace
- **[Composio](https://composio.dev)** — 1,000+ pre-built integrations with managed OAuth, intent-based tool resolution, sandboxed remote execution

For the broader infrastructure layer (MCP servers, registries, gateways), see [Infrastructure § MCP Servers, Registries & Gateways](infrastructure.md#mcp-servers-registries-gateways). For the patterns that emerged from MCP's adoption — [Skills](skills.md), code-as-tool, progressive disclosure — see the relevant sections below.

**Reading list:**

- [Code Execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp) (Anthropic, Nov 4 2025) — the canonical "code-as-tool" pattern; 98.7% token reduction in the Google-Drive-to-Salesforce example
- [Advanced Tool Use](https://anthropic.com/engineering/advanced-tool-use) (Anthropic, Nov 24 2025) — Tool Search Tool against MCP servers (-85% tokens)
- [Anthropic tool-use docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) — the wire-level protocol every Claude-based agent loop uses
- [MCP spec](https://modelcontextprotocol.io) — the protocol itself

Now, with MCP as the assumed substrate, the rest of this page is about *what makes the tools you ship over it actually good*.

---

## What "good tool design" actually means

Four things, in order of impact:

1. **Consolidated, high-level actions** — not fine-grained CRUD plumbing
2. **Compressed responses** — only what the agent needs next, formatted for downstream reasoning
3. **Lazy loading** — don't define 100 tools at startup; let the agent search for what it needs
4. **Code-as-tool** — for data transforms, give the agent a sandbox to write a script in, not a dozen filter tools

---

## 1. Consolidate, don't expose your API surface

The wrong move: take your existing REST API and 1:1 expose every endpoint as a tool. The agent now has `list_users`, `list_events`, `get_user`, `get_event`, `create_event` — five tools where one would do.

The right move: design a `schedule_event(participants, time_window, title)` tool that internally does the lookups and validations. The agent calls one tool; the deterministic code handles the plumbing.

From [Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents): this single principle is what separates tool definitions that get used well from tool definitions that produce error spirals.

---

## 2. Compress every response

The numbers from Anthropic's Slack-MCP work: a `ResponseFormat` enum dropped Slack-thread responses from **206 → 72 tokens** — a ~3× compression — with no functional loss. Every tool response should ask: what does the agent need next, and can I return just that?

Patterns that compress well:

- **Enum-based output modes.** `ResponseFormat.SUMMARY` vs `ResponseFormat.FULL` — let the caller pick the right verbosity
- **Pagination by default.** Return 10 results + a continuation token, not 1,000 results
- **Strip provenance.** UUIDs, timestamps, internal IDs — drop them unless the agent will use them
- **Pre-rank.** If the agent will pick one of N results, sort by relevance and let it pick from the top 3 — don't make it scan 50

Compression at the tool layer is *more efficient* than compression at the context layer (summarization). Summarization is lossy and costs a model call; tool-layer compression is free and exact.

---

## 3. Lazy load — the "too many tools" problem

Front-loading every tool definition causes [context degradation, latency, and cost](https://anthropic.com/engineering/code-execution-with-mcp). The numbers:

| Setup | Token cost just to define tools |
|---|---|
| 5 MCP servers (GitHub/Slack/Sentry/Grafana/Splunk) | ~55K tokens |
| + Jira | Over 100K tokens |
| 5 servers / 58 tools with **Tool Search Tool** | ~8.7K tokens |

That's ~85% reduction. [Tool Search Tool](https://anthropic.com/engineering/advanced-tool-use) lifts Opus 4 from 49% → 74% and Opus 4.5 from 79.5% → 88.1% on MCP evals. Same model, same task — just lazy-loaded tools instead of front-loaded.

**Practical rule:** at 5-15 tools you're probably fine front-loading. Past that, lazy load via Tool Search Tool, progressive disclosure, or [Skills](skills.md).

---

## 4. Code-as-tool — give the agent a Python sandbox

The breakthrough pattern from [Code Execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp): instead of exposing 20 data-manipulation tools (`filter_rows`, `group_by`, `pivot`, `join`, …), expose a sandboxed Python environment and let the agent write a 10-line script.

The numbers: a Google-Drive-to-Salesforce workflow dropped from **~150K → ~2K tokens** (98.7% savings) by filtering a 10K-row sheet inside the sandbox before returning results. The model writes the script; the script runs deterministically; only the filtered output crosses back into context.

Where code-as-tool wins:

- Data transforms (filter, aggregate, reshape, join)
- Format conversion (JSON ↔ CSV ↔ Parquet)
- Multi-step computations the model would otherwise narrate in chain-of-thought
- Anything that should be reproducible — code is the audit trail

Sandboxes worth knowing: [E2B](https://e2b.dev), [Modal](https://modal.com/docs), [Daytona](https://www.daytona.io), Pyodide (browser-native), Anthropic's built-in code execution tool.

---

## When the right tool is a query language — the SQL-over-APIs pattern

A close cousin of code-as-tool: instead of exposing N micro-tools per data source (`list_issues`, `get_issue`, `search_issues`, `list_pulls`…) or even a Python sandbox, expose **a single SQL endpoint** and let the agent write the query.

Why this matters for agent quality: when an agent needs to answer *"Why is auth failing more often after Tuesday's deploy?"*, a tool-per-call MCP setup typically needs 8–12 sequential calls — burning tokens, latency, and decision-points where the model can go off the rails. A SQL JOIN across Sentry × GitHub × Linear answers it in one query.

### The case study — Coral

[**Coral**](https://withcoral.com) (Apache 2.0, Rust, [GitHub](https://github.com/withcoral/coral), launched April 27 2026) is the cleanest expression of the pattern: a **local-first SQL runtime for agents** that exposes GitHub / Sentry / Datadog / Slack / Linear / Stripe / OpenTelemetry / JSONL+Parquet files as queryable tables, addressable from any MCP-aware harness.

The headline benchmark — reported across 82 real-world coding tasks with Opus 4.6:

| Metric | vs direct provider MCPs |
|---|---|
| Accuracy | **+20% average, +31% inside Claude Code** |
| Cost efficiency | **2× cheaper average, 3.4× inside Claude Code** |
| Latency | **−42%** |

Source: [Introducing Coral](https://withcoral.com/blog/introducing-coral). The numbers tell the same story you get from other tool-design literature (the [Anthropic Code Execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp) post showed 150K → 2K tokens / 98.7% reduction on a Drive-to-Salesforce workflow): when the abstraction matches the agent's actual decision unit, everything gets faster, cheaper, and more accurate at once.

### The cluster — what else does this

Five families of product compete in the same architectural space. Pick by license, breadth, and whether you want a runtime or an outcome:

| Product | License | Architecture | Where it wins |
|---|---|---|---|
| **[Coral](https://withcoral.com)** | Apache 2.0 | Rust, local-first, MCP-native, ~10 sources | Permissive license, agent-first design, the benchmark story |
| **[Steampipe](https://steampipe.io)** (Turbot) | AGPL-3.0 | Postgres FDW, CLI, 150+ plugins / 2,000+ tables | Largest plugin ecosystem in the space; mature |
| **[MindsDB](https://github.com/mindsdb/mindsdb)** | Public Source | Python, federated SQL + ML, ships its own MCP | OSS with the most stars (~39K) + built-in ML/forecasting |
| **[CData Connect AI](https://www.cdata.com/ai/)** | Proprietary | Cloud-hosted MCP, 300+ drivers | Enterprise breadth, support, MFT/EDI features |
| **[PromptQL](https://promptql.io)** (Hasura) | Proprietary | Closed agent layer with plan-execute-verify built in; chat UI + multiplayer | Sells the *outcome* (the answer); enterprise traction (Cisco, McDonald's, Instacart) |
| **[Trino](https://trino.io) / [Starburst Galaxy](https://www.starburst.io)** | Apache 2.0 / commercial | Lakehouse federation engine | Heavy-data workloads; not agent-native but agents can use it |
| **[Cube](https://cube.dev)** | Apache 2.0 / MIT | Semantic layer with SQL API | When the queries you want are pre-modeled (metrics, dimensions) |

The tool-per-call baseline this whole pattern argues against is best represented by **[Composio](https://composio.dev)** (1,000+ toolkits, MIT, ~28.5K stars), **[Pipedream MCP](https://mcp.pipedream.com)**, **[Zapier MCP](https://zapier.com/mcp)** (9,000+ apps), and **[Anthropic's reference MCP servers](https://modelcontextprotocol.io/examples)**. These win on breadth and no-code accessibility; they lose on token-cost efficiency when the agent's question crosses multiple sources.

### When SQL-over-APIs is the right answer

- **The question crosses 2+ sources.** A single source's MCP is fine if the agent never needs joins. Once it does, SQL collapses N round-trips into 1.
- **The data fits a relational model.** Tickets, logs, deploys, traces, customer records — yes. Generative image / video / freeform document tasks — no, those want different shapes.
- **You can iterate on the schema.** SQL-over-APIs only beats tool-per-call if you can keep adding columns / sources without re-prompting; Coral's YAML custom-source spec, Steampipe's plugin SDK, MindsDB's engine model are all designed for this.

### When tool-per-call is still right

- **The action is a side-effect, not a query.** "Open this PR," "send this email," "create this ticket" — these are operations, not data access. A typed tool with a `description` and `input_examples` (see [Tool Use Examples](#tool-use-examples--the-input_examples-pattern)) is the right shape.
- **The data source has only one or two tables anyway.** Coral's overhead doesn't pay off when there's no JOIN to do.
- **No-code reach matters more than per-token cost.** Zapier MCP's 9K-app breadth genuinely beats Coral's ~10-source list for business-user workflows.

### Risks to watch if you're betting on this pattern

- **Integration breadth is the binding constraint** for every SQL-over-APIs vendor. Coral ships ~10 sources at launch vs Steampipe's 150+ and Composio's 1,000+. If the sources you need aren't there, the architectural advantage is moot.
- **The token-efficiency wedge is time-limited.** Frontier model prices keep falling (~75%/year through 2025), and context windows keep growing. The +20–31% accuracy / 2–3.4× cost advantage that motivates this pattern shrinks as the underlying token economics improve.
- **MCP is a single-vendor-controlled protocol** (Anthropic). Any improvement they ship to the protocol — batched queries, server-side filtering, native joins — partially erodes the third-party SQL-runtime value prop. Pick this pattern with the assumption that Anthropic will eventually solve some of it inline.
- **Local-first vs centralized governance.** Coral and Steampipe run on the developer's machine — credentials never leave. That's a security win in some orgs and a compliance gap in others (no central audit trail, no shared workspace). Match the architecture to your governance model before committing.

### Related

- [Code Execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp) (Anthropic, Nov 2025) — the canonical "code-as-tool" paper this pattern extends
- [MCP servers, registries & gateways](infrastructure.md#mcp-servers-registries-gateways) — where the tool-per-call landscape lives
- [Memory § Context Hub](memory.md#context-hub--andrew-ngs-curated-knowledge-layer) — Andrew Ng's adjacent pattern (curated knowledge instead of live query)

---

## Programmatic Tool Calling — the third optimization

From [Advanced Tool Use](https://anthropic.com/engineering/advanced-tool-use): Programmatic Tool Calling lets the model issue a *program* of tool calls (with control flow) instead of one-call-per-turn. The numbers:

- Research workload: 43,588 → 27,297 tokens (-37%)
- Internal-knowledge retrieval: 25.6% → 28.5%
- GIA: 46.5% → 51.2%

This pairs naturally with code-as-tool — the agent writes a script that orchestrates tool calls, and the round-trips happen inside the sandbox instead of as separate model turns.

---

## Tool Use Examples — the "input_examples" pattern

Anthropic's Tool Use Examples (the `input_examples` parameter): provide 2-5 example invocations in the tool definition. Complex-parameter accuracy jumped **72% → 90%**. Same tool, same model — just a few examples in the schema.

This is essentially few-shot at the tool layer. Cheaper than retraining, cheaper than prompt engineering, and the agent picks them up automatically.

---

## What to measure when iterating on tools

[Anthropic's writing-tools post](https://anthropic.com/engineering/writing-tools-for-agents) recommends tracking four numbers per tool:

| Metric | Why |
|---|---|
| Runtime per call | Slow tools throttle the whole agent loop |
| Total call count | Excessive calls = wrong abstraction level |
| Total token use | Per-tool cost ceiling |
| Error rate | The single biggest quality lever — error spirals compound |

Track these per-tool over time. When a model upgrade or harness change moves these numbers, you know which tool to revisit.

---

## Anti-patterns

- **Schema dumps.** Pasting your OpenAPI spec into tool descriptions. The agent doesn't need to know every field — give it the ones that matter for the decision.
- **Generic names.** `query`, `process`, `execute` — meaningless. Be specific: `query_user_orders`, `process_refund_request`.
- **Returning raw API responses.** Strip the wrapper, return what the agent actually needs.
- **No examples in the schema.** Free 18-point accuracy lift, left on the table.
- **One tool per endpoint.** See "Consolidate" above. The agent doesn't think in REST.
- **Silent failures.** Tools that return empty results on error look like "no data." Return an explicit error code the model can reason about and retry.

---

## Related

- [Context Engineering](context-engineering.md) — tool-layer compression is the "select" + "compress" strategy at the action layer
- [Skills](skills.md) — when a tool's setup is too complex for a single function, package it as a skill
- [Harness Engineering](harness-engineering.md) — tools are part of the harness; this page is the tool-design slice
- [Research Notes](research-notes.md) — primary sources for every number on this page
