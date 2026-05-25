# Context Engineering

The named discipline of curating what's inside an LLM's context window so it can actually do the task. Coined by Anthropic in [Effective Context Engineering for AI Agents](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Sept 2025) and codified by LangChain in [Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) (July 2025).

> "Context engineering is effectively the #1 job of engineers building AI agents." — Cognition (via LangChain)

---

## Why it matters

Two reasons context engineering is the dominant lever for agent quality:

1. **Context rot.** Anthropic's framing: every token in the window depletes an "attention budget." Accuracy decreases as the window fills, even though the model technically supports the context length. Root causes are n² transformer attention and training data skewed to shorter sequences.
2. **Long-running agents fill windows fast.** A 200K-token window sounds infinite until an agent has done 200 tool calls. [Claude Code triggers auto-compact at 95% utilization](https://blog.langchain.com/context-engineering-for-agents/); [Deep Agents defaults to 85%](https://blog.langchain.com/context-management-for-deepagents/); tool responses over 20K tokens get offloaded to a virtual filesystem with a 10-line preview kept inline.

If the model has to reason over noise, it can't reason over signal. The job is to keep the signal-to-noise ratio high.

---

## The four strategies

LangChain's taxonomy (write, select, compress, isolate) is the canonical framing. Every concrete technique below maps to one of these four.

### 1. Write — externalize state so the window doesn't have to hold it

Move durable state out of the conversation and into a place the agent can re-read on demand:

- **Filesystem as memory.** Claude Code, [Deep Agents](https://github.com/langchain-ai/deepagents), and the [Anthropic memory tool (beta)](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents) all use the filesystem as durable scratch space. Architectural decisions, in-progress plans, and discovered facts live in files; the conversation history doesn't have to.
- **Progress files.** Anthropic's [Effective Harnesses for Long-Running Agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) recommends a `claude-progress.txt` updated each session so a fresh agent doesn't "guess at what happened."
- **Git as state.** Commit history is a free, structured record of what changed and why; the agent re-reads it instead of holding it in context.

### 2. Select — load only what's relevant, just-in-time

- **Lightweight identifiers, not bulk content.** Anthropic's pattern: pass file paths, query strings, and links as references; the agent pulls the actual content on demand via `head`/`tail`/`grep` rather than dumping files into context.
- **Tool Search Tool (Anthropic).** A search-as-you-go tool index. Reduces token consumption ~85%; lifts Opus 4 from 49% → 74% and Opus 4.5 from 79.5% → 88.1% on MCP evals. Five MCP servers (GitHub/Slack/Sentry/Grafana/Splunk) cost ~55K tokens just to define; loading them lazily preserves 95% of the window. See [Advanced Tool Use](https://anthropic.com/engineering/advanced-tool-use).
- **Progressive skill disclosure.** [Skills](skills.md) load metadata at startup, full SKILL.md when relevant, bundled files only when actually needed.
- **Embedding retrieval.** Standard RAG, used where semantic similarity beats keyword search.

### 3. Compress — shrink history without losing meaning

- **Compaction = summarize then reinitialize.** Anthropic's approach: keep architectural decisions and unresolved bugs; drop tool-call spam and resolved threads. Claude Code's auto-compact is the most-studied implementation.
- **Dual summarization (Deep Agents).** In-context LLM summary *plus* filesystem preservation of original messages, so recovery is possible if the summary loses something the agent later needs.
- **ResponseFormat enums.** Per [Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents): a `ResponseFormat` enum cut Slack-thread responses from 206 → 72 tokens (~3×) while preserving functionality. Compression at the tool layer beats compression at the context layer.

### 4. Isolate — give sub-agents their own clean windows

- **Orchestrator-worker pattern.** Subagents handle focused tasks in fresh context windows and return 1,000–2,000-token condensed summaries to the coordinator. Anthropic's [multi-agent research system](https://anthropic.com/engineering/multi-agent-research-system) burns ~15× tokens of chat for 90.2% lift on research evals — the cost is real but the isolation is what makes long research workflows tractable.
- **Sandboxes for code execution.** [E2B](https://e2b.dev), Pyodide, and Anthropic's [code execution with MCP](https://anthropic.com/engineering/code-execution-with-mcp) move computation out of the model. A Google-Drive-to-Salesforce workflow drops from ~150K to ~2K tokens (98.7% savings) when the agent writes a Python script that filters data inside the sandbox and returns only what matters.

---

## Failure modes (name them so you can spot them)

[LangChain](https://blog.langchain.com/context-engineering-for-agents/) catalogs four context failure modes:

| Mode | What it looks like |
|---|---|
| **Poisoning** | Earlier-turn errors propagate forward as "established facts" |
| **Distraction** | Tool-call noise pulls the model off the actual task |
| **Confusion** | Contradictory facts in the window; the model can't tell which to trust |
| **Clash** | New context contradicts the system prompt or earlier user instruction |

If your agent is failing in production, identify which of these is happening before you reach for prompt engineering.

---

## Concrete thresholds worth pinning

| Threshold | Source | Use |
|---|---|---|
| 95% window → auto-compact | Claude Code | Aggressive default for long sessions |
| 85% window → compact | Deep Agents | More cautious default |
| 20K tokens → spill to filesystem | Deep Agents | Tool response offload trigger |
| 10-line preview kept inline | Deep Agents | What stays in context after offload |
| 1,000–2,000 tokens | Anthropic | Target size for subagent return summary |
| ~12 skills max | LangChain | Mis-invocation rate climbs past this |
| 5–15 tools | [claudecode-lab](https://claudecode-lab.com/en/blog/claude-code-harness-engineering/) | Beyond this, accuracy degrades; route overflow to subagents |

---

## Anti-patterns

- **Front-loading every tool definition.** Causes context degradation, latency, and cost before the first turn. Use [Tool Search Tool](https://anthropic.com/engineering/advanced-tool-use) or progressive disclosure instead.
- **Bulk RAG dumps at session start.** Loads relevant *and* irrelevant context. Pull on demand.
- **Forgetting that the system prompt counts.** A 10K-token system prompt with 50 tools defined leaves you ~190K tokens before the conversation even starts.
- **Treating context as free.** Every token costs both money and accuracy. The two are correlated in a way that matters operationally.

---

## Related

- [Harness Engineering](harness-engineering.md) — the surrounding system that implements these strategies
- [Skills](skills.md) — the cross-vendor primitive for the "select" strategy at the capability layer
- [Tool Design](tool-design.md) — tool-layer compression and the "select" lever for actions
- [Memory](memory.md) — the durable substrate for the "write" strategy
- [Research Notes](research-notes.md) — primary-source bibliography for every claim on this page
