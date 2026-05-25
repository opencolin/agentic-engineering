# Tool Design

How to write tools that agents actually use well. The most-overlooked layer in agent quality — most production teams tune prompts and pick models; the tool layer is where the biggest wins quietly live.

> "Tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents." — [Anthropic, Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents)

The empirical case from the same post: Claude-optimized tools beat human-written ones on held-out Slack-MCP evals after iterative agent-led refinement. And during the SWE-bench work, [Anthropic spent more time tuning tools than tuning prompts](https://anthropic.com/research/building-effective-agents) — using absolute file paths instead of relative eliminated a whole class of mistakes.

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

## MCP — the protocol layer

[Model Context Protocol](https://modelcontextprotocol.io) is now the de-facto industry standard for tool exposure across model providers. As of late 2025, thousands of MCP servers exist. Key implications:

- A tool definition you ship as MCP works across Claude, GPT, Gemini agents
- The ecosystem has solved the "where do tools come from" problem; you should be solving "what makes *my* tools good"
- For governance (per-user OAuth, audit trails, sandboxing), runtimes like [Arcade](https://arcade.dev) and [Composio](https://composio.dev) sit between the agent and MCP execution

Worth reading: [Code Execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp) on the progressive-disclosure pattern, and the [Claude tool-use docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) for the wire protocol.

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
