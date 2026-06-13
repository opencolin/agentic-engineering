<!-- lastVerified: 2026-06-02 | staleBy: 2026-12-02 -->

# Cost Economics for Coding Agents

> *"With chat, the cost question is 'how much does a conversation cost?' With agents, the cost question is 'how much does a unit of work cost?' — and you don't get to answer it without measuring."*

A coding agent run is not a single LLM call. It is a loop: dozens to thousands of model invocations, tool calls, retrievals, sub-agent spawns. The same task that costs $0.04 on a well-engineered harness can cost $4 on a bad one — same model, same task, two orders of magnitude apart, because of caching, routing, and idle behavior.

This page covers:

1. **Token math** — input vs output pricing, batch discounts, the gross arithmetic.
2. **Cache economics** — Anthropic prompt caching, OpenAI cached input, KV reuse; why caching changes everything.
3. **Hybrid-model routing** — when to use Haiku / Mini / Flash for cheap turns and Opus / GPT-4 / Gemini Pro for hard ones.
4. **Idle cost** — the silent expense of always-on agents.
5. **Cost-per-PR** — the framing that makes cost actionable as a business metric.
6. **Decision matrix** — when each lever is worth pulling.

All prices in this page are as of 2026-06-01 and link to canonical pricing pages; verify before quoting. Pricing in this industry moves quarterly.

---

## Token math

The basic unit. Frontier-model APIs charge separately for *input tokens* (your prompt + system + tools schema + retrieved context + tool results from prior turns) and *output tokens* (what the model generates). Output is typically 3–5× the input price.

Reference (verify on each provider's pricing page):

| Model | Input $/MTok | Output $/MTok | Output : Input ratio |
|-------|--------------|---------------|----------------------|
| **Claude Sonnet 4.5 / 4.6** ([pricing](https://www.anthropic.com/pricing)) | $3.00 | $15.00 | 5× |
| **Claude Opus 4.x** ([pricing](https://www.anthropic.com/pricing)) | $15.00 | $75.00 | 5× |
| **Claude Haiku 4.x** ([pricing](https://www.anthropic.com/pricing)) | $0.80 | $4.00 | 5× |
| **GPT-4o** ([pricing](https://openai.com/api/pricing/)) | $2.50 | $10.00 | 4× |
| **GPT-4o-mini** ([pricing](https://openai.com/api/pricing/)) | $0.15 | $0.60 | 4× |
| **Gemini 1.5 Pro** ([pricing](https://ai.google.dev/pricing)) | $1.25–$2.50 | $5.00–$10.00 | 4× |
| **Gemini 1.5 Flash** ([pricing](https://ai.google.dev/pricing)) | $0.075–$0.15 | $0.30–$0.60 | 4× |

Three things follow from this table:

1. **Output is the costly half.** A 1000-token prompt + 1000-token reply on Sonnet 4.5: $0.003 input + $0.015 output = $0.018, of which 83% is output. Anything that *prevents* unnecessary generation (compact tool schemas, structured outputs that stop early, no verbose chain-of-thought when not needed) compounds.
2. **The Haiku / Mini / Flash tier is roughly 15–25× cheaper than the flagship.** This is what makes hybrid routing economically interesting.
3. **In an agent loop, your "input" grows.** Turn N's input includes turns 1..N-1's messages and tool results. By turn 20 the input may be 50K tokens. The agent's *output* is small per turn but the *input* compounds — which is why caching matters more for agents than for chat.

### Batch discounts

For non-interactive workloads, both major providers offer ~50% discount via batch APIs ([Anthropic Message Batches](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing), [OpenAI Batch API](https://platform.openai.com/docs/guides/batch)). Use them for offline evals, dataset labeling, asynchronous backfills — anything that doesn't need a sub-minute SLA. For an agent in the user's interactive loop, batch isn't applicable; for an agent generating PRs overnight on a 1000-item queue, it is.

---

## Cache economics

The lever that has the biggest impact on agent costs. Both major providers ship explicit caching:

- **Anthropic [Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)**: mark portions of the prompt with `cache_control`; subsequent calls within the cache TTL (default 5 minutes, optional 1 hour) read those tokens at **10% of base input price** for the 5-min tier, **25% of base for the 1-hour extended tier**. Cache *writes* are 1.25× base input. This is the dominant cost knob for any agent that reuses a long system prompt + tool schema + retrieved context across turns.
- **OpenAI [Cached Input](https://platform.openai.com/docs/guides/prompt-caching)**: automatic on prompts ≥1024 tokens; cached input billed at **50% of base** input price.
- **Google Gemini [Context Caching](https://ai.google.dev/gemini-api/docs/caching)**: explicit cache objects with TTL; cached portion priced lower (specifics vary by model).

### Doing the math

Take a coding agent with a 30K-token system + tools + repo context prompt that runs 20 turns. Output is small per turn (~500 tokens). Model: Claude Sonnet 4.5.

**Without caching**:
- Per turn: 30K input × $3/MTok = $0.09 input. Output: $0.0075. Per turn: $0.0975.
- 20 turns: ~$1.95.

**With prompt caching (5-min tier)**:
- First turn: 30K cache-write × $3 × 1.25 = $0.1125. Output: $0.0075. First turn: ~$0.12.
- Turns 2–20: 30K cache-read × $3 × 0.1 = $0.009 + (incremental new input ~2K × $3 = $0.006) + output $0.0075 = $0.0225 per turn × 19 = $0.4275.
- Total: ~$0.55.

**Savings: ~72%** for a single session. For an agent handling 1000 sessions / day at the same shape: $1,950 / day → $549 / day = ~$1,400 / day or ~$510K / year in straight token cost.

The structural rule: any prompt content reused across turns should be cached. The harness arranges the prompt so the *invariant* parts (system prompt, tools schema, retrieved-corpus boilerplate) come first and get marked; the *variable* parts (user message, latest tool result) come last and are not cached. See [Context Engineering](context-engineering.md) for the prompt-layout patterns this enables.

### KV reuse beyond caching

Self-hosted setups can reuse the KV cache directly across requests: vLLM's [Automatic Prefix Caching](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html), [SGLang's RadixAttention](https://github.com/sgl-project/sglang) (the [paper](https://arxiv.org/abs/2312.07104) is the canonical reference). The economics are the same shape — pay GPU time once for the shared prefix, reuse — but the operator pays directly in GPU hours rather than the provider's marked-up cache-read rate. For high-volume self-hosted deployments this is a 5–10× cost lever on top of model selection.

---

## Hybrid-model routing

Not every turn deserves Opus. The router pattern:

- A planner / orchestrator runs on a cheap fast model.
- The orchestrator delegates *hard* sub-tasks (multi-step reasoning, code generation, novel patterns) to a flagship model.
- Routine sub-tasks (summarizing a tool result, classifying intent, formatting output) stay on the cheap model.

### Cost math

Assume a task that takes 100K input + 5K output tokens of *flagship* work. On Sonnet 4.5: $0.30 + $0.075 = $0.375.

Replace half the calls with Haiku 4 (15× cheaper input, 18× cheaper output):

- 50K + 2.5K on Sonnet: $0.15 + $0.0375 = $0.1875
- 50K + 2.5K on Haiku: $0.04 + $0.01 = $0.05
- Total: $0.2375. **37% savings** — and that's assuming Haiku can do *half* the work, conservatively.

In practice, agents like [Deep Agents](coding-agents.md#deep-agents-langchain) and [GStack](coding-agents.md#gstack) use sub-agents with cheaper models for the routine steps. [Claude Code](coding-agents.md#terminal-coding-clis) ships with sub-agent profiles that route by capability tag.

### Router patterns

- **Static rules**: by tool name, route — file-read → Haiku, code-gen → Sonnet, multi-file refactor → Opus.
- **Classifier**: a cheap classifier predicts difficulty and routes accordingly.
- **Speculative**: try Haiku first; if its self-confidence (or a verifier) flags low quality, retry on Sonnet. This trades 2× the cheap call for upside on most cases.
- **Vendor routers**: [OpenRouter](https://openrouter.ai/), [Portkey](https://portkey.ai/), [Bifrost](https://github.com/maximhq/bifrost), [Helicone](https://docs.helicone.ai/features/auto-router) provide routing as a service — usually paired with their observability and gateway features.

### When routing isn't worth it

- The cheap model fails the eval on your task. Routing math is dominated by the *re-do rate* — if you have to retry on the flagship 30% of the time, you've lost the savings and added latency.
- The router itself burns tokens. A classifier that runs on every request must be cheap (< $0.0001) or it eats the savings.
- The cognitive load. Routing adds two more moving parts (the router + the cheap model's behavior surface) that observability and eval must cover.

---

## Idle cost

The trap teams hit at scale: agents that are running but not productive.

- **Always-on planning loops**: an agent that polls every 30 seconds for a new task and burns 5K input tokens per poll = ~$130 / agent / day on Sonnet, even when no work happens.
- **Long-running sandboxes**: a Modal / E2B / Daytona sandbox kept warm for fast cold-start costs $/hr × 24 / agent. At 50 agents, this is meaningful.
- **Sub-agent spawn overhead**: in fleets like [Stripe Minions](coding-agents.md#stripe-minions) (1,300+ PRs/week), spawning sub-agents that boot a devbox + run a few tool calls + exit pays the spawn cost on every task.
- **Stuck loops**: an agent that hit an error, didn't escalate, and now retries the same failing call 1000 times. Caught by alerts on per-session token budget.

### Mitigations

- **Event-driven over polling**: webhooks / queues fire the agent only when there's work. Inngest, Temporal, Trigger.dev all support this shape natively. See [Infrastructure § Agent Orchestration](infrastructure.md#agent-orchestration).
- **Cold-start-tolerant sandboxes**: pay the 1–3 second startup; don't pay 24h warm time.
- **Per-session token budget**: hard ceiling. When a session exceeds N tokens or M minutes, kill it. ([Deployment § Kill switches](deployment.md#kill-switches).)
- **Loop detectors**: middleware that detects repeated identical tool calls (see [Deep Agents](coding-agents.md#deep-agents-langchain) `LoopDetectionMiddleware`).

---

## Cost-per-PR framing

The metric that translates token math to business value, popularized by [Stripe's Minions disclosure](coding-agents.md#stripe-minions): 1,300+ merged PRs per week through autonomous agents, with cost tracked per PR.

The shape:

```
cost-per-PR = total_inference_spend / merged_PRs
            = (compute + cache + tool calls + sandbox + idle) / merged_PRs
```

Why this works as a metric:

- **It survives caching changes.** If caching halves your per-token cost but you ship 1.5× the PRs, the metric tells you both happened.
- **It punishes wasted work.** A PR that takes 5 attempts costs 5× more in tokens; the metric forces the team to look at attempt-rate.
- **It maps to "cheaper than a contractor / engineer for this kind of work."** A $5 PR for a routine dep-upgrade is obviously cheaper than 15 minutes of engineering time. A $200 PR for the same task — driven by retries, poor caching, expensive model — is obviously broken.

Companion metrics worth tracking:

- **Cost-per-attempt** (not just per merged PR) — surfaces wasted retries.
- **Cost-per-eval-pass** for offline runs.
- **p95 cost-per-session** — the worst 5% of runs is where the model-loop pathologies hide.
- **Cache hit rate** — directly proportional to dollar savings.

[Helicone's cost-leaderboard](https://docs.helicone.ai/features/observability) and [Langfuse's cost analytics](https://langfuse.com/docs/analytics/cost) both compute these out of the box from traces; you can also roll your own off the OTel spans (see [Observability](observability.md)).

---

## What good looks like

A team running agent cost seriously will have:

- **Per-trace cost** carried as a span attribute and visible in observability.
- **Prompt caching** on the invariant prefix; cache hit rate >80% for steady-state turns.
- **A documented model-routing policy** with measured re-do rate on the cheap tier.
- **A per-session token budget** enforced by middleware; alerts on overage.
- **Event-driven scheduling** of agents that don't need to be always-on.
- **Cost-per-PR / cost-per-task** as a tracked metric, reviewed weekly.
- **Batch APIs** used for offline workloads.
- **Quarterly pricing review** — pricing moves; what was optimal last quarter often isn't.

---

## Decision matrix

| If you... | Use | Don't use | Why |
|-----------|-----|-----------|-----|
| Have a long shared prompt prefix (system + tools + repo context) and any reuse across turns | **Prompt caching with 5-min or 1-hour tier** | Naive prompt assembly | Single-largest cost lever for agents — typical 60–80% savings on input cost |
| Are doing nightly evals, dataset labeling, or scheduled backfills | **Batch API (Anthropic / OpenAI)** | Synchronous API in a loop | 50% savings for no quality difference; latency doesn't matter offline |
| Have a mix of routine + hard steps | **Hybrid routing (Haiku / Mini / Flash for routine; flagship for hard)** | Flagship for everything | 30–60% savings, *if* the cheap-tier eval passes; measure re-do rate before declaring victory |
| Operate self-hosted models with high traffic and shared prefixes | **vLLM Automatic Prefix Caching or SGLang RadixAttention** | Plain inference servers | 5–10× throughput on shared-prefix workloads; the same lever as prompt caching, at the GPU layer |
| Have agents polling or always-warm sandboxes | **Event-driven scheduling + cold-start-tolerant sandboxes** | Always-on poll loops | Idle is the silent budget killer; pay only when there's work |
| Are at any meaningful scale ($/month material) | **Per-session token budget + per-tenant cost dashboard** | Trust that "the loop will be reasonable" | Without a budget, one bug × one weekend = a five-figure surprise; ask anyone who's seen it |
| Need to compare two model versions on cost-per-task | **A regression eval that measures `merged / total` AND `tokens / merged`** | Vendor benchmark numbers | Your task is not their benchmark; measure on your data |
| Want a clean executive metric | **Cost-per-PR (or cost-per-task)** | Total monthly spend | The per-unit-of-work framing maps directly to business value and survives traffic growth |
| Are deciding between providers and your workload reuses prompts | **Account for caching in the comparison** | Compare on list prices | Provider A's cached-tier price can beat Provider B's list price by 5–10×; this is the real number |
| Run 24/7 fleets at small individual cost | **Reserved capacity / committed-use discounts** | Pay-as-you-go | At sustained spend, provider-specific commit discounts (10–30%) and batch are both on the table |

---

## See also

- [Inference](inference.md) — the underlying compute layer and self-hosted economics.
- [Models](models.md) — current model lineup and which task each is sized for.
- [Context Engineering](context-engineering.md) — prompt layout patterns that make caching effective.
- [Observability](observability.md) — where cost data must be recorded and aggregated.
- [Deployment](deployment.md) — per-session budgets and kill switches as production guardrails.

## Primary sources

- [Anthropic — Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic — Message Batches](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing)
- [OpenAI — Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching)
- [OpenAI — Batch API](https://platform.openai.com/docs/guides/batch)
- [Google Gemini — Context Caching](https://ai.google.dev/gemini-api/docs/caching)
- [Anthropic pricing](https://www.anthropic.com/pricing)
- [OpenAI pricing](https://openai.com/api/pricing/)
- [Google AI pricing](https://ai.google.dev/pricing)
- [vLLM — Automatic Prefix Caching](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html)
- [SGLang — RadixAttention paper](https://arxiv.org/abs/2312.07104)
