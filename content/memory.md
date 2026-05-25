<!-- description: How agents remember across turns and sessions — three-axis taxonomy (lifetime / type / update mechanism), the vendors (Letta, Mem0, LangMem, LangGraph Store, Anthropic memory tool), filesystem-as-memory pattern, three-layer continual learning model, and production anti-patterns. -->

# Memory

How agents remember things across turns and across sessions. Distinct from [Context Engineering](context-engineering.md) — context engineering is about what's in the window *right now*; memory is about what survives when the window resets.

Three reasons memory is a first-class concern in 2026:

1. **Sessions end.** Anthropic's framing: ["imagine a software project staffed by engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift."](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) That's an agent without memory.
2. **Personalization compounds.** Agents that remember the user's name, preferences, prior decisions, prior errors get measurably better over time. Letta and Mem0 exist because this matters in production.
3. **Multi-agent systems need shared substrate.** When one agent hands off to another, the handoff IS the memory layer.

---

## The taxonomy

Three orthogonal axes — every memory system picks a position on each:

### Axis 1: Lifetime

| Type | Scope | Implementation |
|---|---|---|
| **Short-term** | Current conversation | Conversation history in the context window |
| **Long-term** | Across sessions, same user | Persistent store (vector DB, KV, filesystem) |
| **Cross-user** | Org-wide knowledge | Shared knowledge base, RAG over docs |

### Axis 2: Type (from [LangChain Context Engineering](https://www.langchain.com/blog/context-engineering-for-agents))

| Type | What it stores | Example |
|---|---|---|
| **Episodic** | Specific past events | "User asked about refund policy on May 12" |
| **Procedural** | How to do something | "When user mentions billing, route to billing-skill" |
| **Semantic** | Facts about the world | "User's name is Alex; subscription tier is Pro" |

### Axis 3: Update mechanism

| Mechanism | When it updates | Trade-off |
|---|---|---|
| **Real-time** | On every turn | Lower latency penalty; risk of noisy writes |
| **Background consolidation** | Async, between sessions | Cleaner memories; delay before "learning" lands |
| **Manual / human-curated** | On explicit signal | Highest quality; doesn't scale |

[Deep Agents](https://www.langchain.com/blog/continual-learning-for-ai-agents) ships user-level memory with background consolidation as the default — a pragmatic balance.

---

## The vendors and what they actually do

### [Letta](https://letta.com) — from the MemGPT team (UC Berkeley)

Persistent-memory agent platform. Notable features: memory palace UI, background "dream agents" that refactor stored context overnight, memory portability across models, Letta Code (desktop/CLI/SDK). Recent research on sleep-time compute and token-space continual learning.

**Slot:** when you want a stateful agent runtime with memory as the central abstraction.

### [Mem0](https://mem0.ai) — drop-in memory layer

Add/Learn/Retrieve API. Compresses conversation history into retrievable memories. SOC2 Type 1 + HIPAA. BYOK encryption. Deployable in Kubernetes / private cloud / air-gapped.

**Slot:** when you want SaaS memory without committing to a new agent runtime — bolt onto whatever stack you have.

### [LangMem](https://langchain-ai.github.io/langmem/) — LangChain's memory primitives

Library-level — works inside LangGraph / Deep Agents. Episodic + semantic memory APIs. Native integration with LangSmith for traceability.

**Slot:** when you're already on the LangChain stack and don't want a separate vendor.

### [LangGraph Store](https://langchain-ai.github.io/langgraph/) — key-value + semantic search

Long-term memory primitive built into LangGraph. Used as the persistence layer for [Deep Agents'](https://github.com/langchain-ai/deepagents) cross-session memory.

**Slot:** when you're using LangGraph and want memory as a backend, not a third-party API.

### [Anthropic memory tool (beta)](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents) — file-based

First-party memory tool from Anthropic. File-based — the agent reads and writes durable state to a structured filesystem.

**Slot:** when you're already on Claude and want memory without taking a vendor dependency.

---

## The filesystem-as-memory pattern

The most copy-able pattern from production Claude Code / Deep Agents work: use the filesystem as the durable memory substrate.

Why this works:

- **Re-readable on demand.** Lightweight identifiers (paths) in context; full content fetched only when needed
- **Naturally structured.** Directory hierarchy = namespace; filenames = keys
- **Tool-friendly.** Every agent harness already has `read`, `write`, `grep` — no new abstractions
- **Git-trackable.** Memory updates become commits with full history

Concrete shapes:

- `CLAUDE.md` / `AGENTS.md` — global project rules
- `claude-progress.txt` — incremental state for resumed sessions ([Effective Harnesses](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents))
- `.claude/memory/episodes/<date>.md` — episodic logs
- JSON feature lists where each item has `passes: false` until proven otherwise ([Effective Harnesses example](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) — 200+ features for a claude.ai clone)

The [Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness) calls filesystems "foundational: durable storage, context management, multi-agent collaboration."

---

## How agents actually learn over time

[LangChain's continual-learning post](https://www.langchain.com/blog/continual-learning-for-ai-agents) decomposes "learning" into three orthogonal layers:

| Layer | What changes | Mechanism |
|---|---|---|
| **Weights** | Model parameters | Fine-tuning (SFT, GRPO, LoRA) |
| **Harness** | System prompts, tool defs, middleware | Trace mining + automated diffs (Meta-Harness, Better-Harness) |
| **Context** | What's loaded into the window | Memory updates — agent / tenant / mixed level |

Memory is the *context* layer. It's the cheapest and fastest of the three to change. Most production "the agent got better" stories are actually memory-layer improvements, not model upgrades.

---

## Concrete patterns from production

- **Episodic + semantic split.** Store episodes verbatim; periodically distill them into semantic facts. Episodes = audit trail; semantic facts = fast lookup.
- **Threshold-triggered consolidation.** Run summarization when episodic memory crosses N tokens or M episodes. Anthropic's compaction model applied to memory.
- **Per-tenant isolation.** If the agent serves multiple users/orgs, memory must be partitioned at the persistence layer — never shared via the model.
- **Versioned memory.** Treat memory writes like database migrations — schema changes need to be intentional, not implicit.

---

## Anti-patterns

- **Stuffing memory into the system prompt.** Defeats the purpose. The whole point of long-term memory is that it doesn't permanently occupy the window.
- **Writing every turn.** Memory writes should be intentional, not reflexive. Most turns shouldn't produce a memory.
- **No retrieval ranking.** If you store 10K episodes and naively semantic-search them, you'll get noise. Rank, filter, and threshold.
- **Treating semantic memory as canonical.** Distilled facts can be wrong; keep the source episodes recoverable so you can audit.
- **Shared memory across users.** GDPR, leak risk, and weird agent behavior all in one decision.

---

## Related

- [Context Engineering](context-engineering.md) — what's loaded into the window right now (memory's read side)
- [Harness Engineering](harness-engineering.md) — the system that orchestrates memory reads/writes
- [Skills](skills.md) — skills can encode procedural memory; this page covers everything else
- [Infrastructure: Hosting & Execution](infrastructure.md) — where memory persistence layers actually run
- [Research Notes](research-notes.md) — primary sources for the vendors and patterns on this page
