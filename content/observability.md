<!-- lastVerified: 2026-06-02 | staleBy: 2026-12-02 -->

# Observability for Coding Agents

> *"With agents, the logic lives in the traces."* — Harrison Chase, [On Agent Frameworks and Agent Observability](https://www.langchain.com/blog/on-agent-frameworks-and-agent-observability)

For deterministic services, you ship the code and the logs explain anomalies. For agents, the *trace itself is the program*: the prompt, the tool calls, the model's reasoning steps, the retries, the cost. Observability is not a side concern — it is the substrate every other practice (evals, safety, cost control, deployment) is built on.

This page covers four things:

1. **What to trace** — the dimensions that matter for an agent (spans, traces, evals, metrics).
2. **Span schemas** — OpenTelemetry's GenAI semantic conventions, and what they prescribe.
3. **Eval-in-the-loop** — closing the trace → dataset → eval → prompt loop with RAGAS, DeepEval, promptfoo.
4. **Vendors** — Langfuse, Helicone, Arize Phoenix, LangSmith, Lunary, Pareto and the practical trade-offs.
5. **Decision matrix** — when each tool is right, and when it isn't.

---

## Why observability is first-class for agents

A non-agentic service has roughly three failure modes: code bug, infra outage, dependency outage. Agents add at least five more:

- **Wrong tool call** — the model picked `delete_file` instead of `move_file`.
- **Hallucinated argument** — the tool was right but the argument was invented (a path that doesn't exist, a customer ID the model fabricated).
- **Context corruption** — earlier turns poisoned later ones (tool errors left in scratchpad, summarization dropped the key fact, a retrieved doc was wrong).
- **Drift** — the same prompt that worked yesterday fails today because the upstream model was silently upgraded, or your retrieval corpus changed.
- **Cost / latency spikes** — a single bad loop burns 200K tokens of cache-cold input.

None of these surface in normal logs. They surface in **traces** — the recording of every prompt, every tool call, every model response, every retry, with timing and token counts attached. LangChain's State of Agent Ops survey (Dec 2024) found that 89% of organizations running agents had implemented *some* form of observability and 62% had detailed tracing — making it the highest-adoption category in agent ops, ahead of even evals ([state-of-ai-agents](https://www.langchain.com/stateofaiagents)).

The argument is short: if you can't reconstruct *what the agent did*, you cannot debug, evaluate, govern, or improve it.

---

## What to trace

Four signal types compose an agent observability stack. Each answers a different question.

### Spans

A span is a single unit of work: one LLM call, one tool call, one retrieval, one sub-agent invocation. Spans nest — an agent loop is a parent span whose children are the model calls and tool calls inside it. Every span should carry:

- **Inputs**: full prompt (system + messages + tools schema), tool args.
- **Outputs**: full completion, tool result, errors.
- **Metadata**: model name + version, temperature, max tokens, latency, prompt tokens, completion tokens, cached tokens, cost (USD), user/tenant/session ID.
- **Status**: success, error, timeout, retried.

For LLM spans specifically the OpenTelemetry GenAI semantic conventions are the right schema target (next section).

### Traces

A trace is the set of spans for one agent run — the full conversation, including every tool call and every model turn. A trace must be linkable from the application (deep-link from a user complaint or a failed PR to the exact run) and replayable (re-feed the same inputs into eval).

### Evals

Evals are *labels on traces* — was the final answer correct, did the agent use the right tool, was the structured output valid, did the response cite real sources? Evals are not a separate system from observability: they decorate the same traces with judgments (LLM-as-judge, rule-based, or human).

### Metrics

Aggregations over traces: success rate per intent, cost per session, p95 latency, tool error rate, eval pass rate over the last 7 days. Metrics are where you set SLOs and alert.

> **Rule of thumb**: if your trace doesn't carry enough information to (a) replay it deterministically, (b) compute an eval score, and (c) roll up to a metric — you're missing fields.

---

## Span schemas: OpenTelemetry semantic conventions for GenAI

OpenTelemetry's [Semantic Conventions for GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/) ([spec](https://github.com/open-telemetry/semantic-conventions/tree/main/docs/gen-ai), [SIG repo](https://github.com/open-telemetry/community/blob/main/projects/gen-ai.md)) standardize the attribute names used on LLM and agent spans. As of 2026 they are still marked *experimental*, but they are the de facto schema — adopted by [OpenLLMetry / Traceloop](https://www.traceloop.com/openllmetry), [Arize Phoenix](https://docs.arize.com/phoenix), [Langfuse](https://langfuse.com/docs/opentelemetry), [Honeycomb's LLM views](https://www.honeycomb.io/blog/observability-for-large-language-models), and emitted by SDKs from OpenAI ([Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/)), LangChain, and Anthropic.

The conventions define two categories of attributes:

**LLM call attributes** (on a single `gen_ai.client.operation` span):

| Attribute | Meaning |
|-----------|---------|
| `gen_ai.system` | Provider name: `openai`, `anthropic`, `google_gen_ai`, etc. |
| `gen_ai.request.model` | Requested model: `gpt-4o-2024-08-06`, `claude-sonnet-4-5-20250929` |
| `gen_ai.response.model` | Model that actually served (can differ on aliased deployments) |
| `gen_ai.request.temperature` / `top_p` / `max_tokens` | Sampling params |
| `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens` | Token accounting |
| `gen_ai.response.finish_reasons` | `stop`, `length`, `tool_calls`, `content_filter` |
| `gen_ai.operation.name` | `chat`, `text_completion`, `embeddings`, `generate_content` |

**Tool-call attributes** (on the tool-execution span and on the model's tool-call message):

| Attribute | Meaning |
|-----------|---------|
| `gen_ai.tool.name` | The tool the model chose |
| `gen_ai.tool.call.id` | Tool-call ID (matches the model's structured tool-call output) |
| `gen_ai.tool.type` | `function`, `extension`, `code_interpreter`, `mcp` |

**Events** (separate span events, optional but recommended): `gen_ai.user.message`, `gen_ai.assistant.message`, `gen_ai.tool.message`, `gen_ai.choice` — each carrying the actual content. Storing message content as events (rather than attributes) keeps the high-cardinality bulk separate from indexable attributes and matches how Phoenix and Langfuse store it.

**Why this matters**: a vendor-neutral schema means you can swap Phoenix for Langfuse without rewriting your instrumentation, and you can pipe spans through Honeycomb / Datadog / Grafana Tempo alongside the rest of your distributed traces. The OpenLLMetry project ([github.com/traceloop/openllmetry](https://github.com/traceloop/openllmetry), Apache 2.0) is the most-used instrumentation library implementing these conventions across 30+ frameworks.

---

## Eval-in-the-loop

Tracing alone is read-only. The *loop* is what produces a system that improves: trace → curate dataset → run eval → identify failure mode → fix prompt or tool → re-run eval. Eval-in-the-loop tools sit on top of your traces and automate the right-hand side.

Three reference frameworks anchor the OSS side:

### RAGAS — RAG-specific metrics

[RAGAS](https://docs.ragas.io/) ([github.com/explodinggradients/ragas](https://github.com/explodinggradients/ragas), Apache 2.0) defines the four-metric triad that became the industry default for retrieval-augmented systems:

- **Faithfulness** — does the answer stay grounded in retrieved context (no hallucinations)?
- **Answer relevancy** — does the answer actually address the question?
- **Context precision** — were the retrieved chunks relevant (no noise)?
- **Context recall** — did retrieval find everything needed?

Use it when your agent does retrieval; the metrics translate directly to "is RAG broken?" diagnostics.

### DeepEval — pytest-style assertions

[DeepEval](https://docs.confident-ai.com/) ([github.com/confident-ai/deepeval](https://github.com/confident-ai/deepeval), Apache 2.0) takes the *pytest assertion* shape — write `assert_test(LLMTestCase(...), [HallucinationMetric(), AnswerRelevancyMetric()])` and run it in CI. Ships 14+ built-in metrics (G-Eval, hallucination, summarization, contextual recall, bias, toxicity) and works as a regression-test gate in GitHub Actions. The hosted [Confident AI](https://confident-ai.com/) layer adds dashboards and dataset management.

### promptfoo — declarative red-team + eval

[promptfoo](https://www.promptfoo.dev/) ([github.com/promptfoo/promptfoo](https://github.com/promptfoo/promptfoo), MIT) is YAML-config-first: declare prompts, model variants, test cases, and assertions in `promptfooconfig.yaml`, run `promptfoo eval`, get a diff matrix across model versions. The 2026 strength is the red-team mode — auto-generates 50+ adversarial categories (prompt injection, jailbreak, PII leak, bias) using a built-in attack-prompt library. The right tool when the question is "did model v2 regress against model v1 on my test suite?"

### Eval-in-the-loop, concretely

The closed loop looks like this:

1. **Capture** — instrument with OpenLLMetry; every prod run becomes a trace.
2. **Curate** — flag traces (thumbs-down from end users, low LLM-judge score, manual review). Promote them to a dataset row.
3. **Score** — run the trace's input + golden answer through RAGAS / DeepEval / promptfoo on every PR.
4. **Block** — eval suite is a required check; regression on the production dataset blocks merge.
5. **Improve** — when eval catches a regression, the failed trace shows the exact step that broke; fix the prompt or tool, re-run.

LangSmith, Langfuse, and Braintrust all implement this loop as a first-party product feature (dataset = curated traces; eval = scheduled job; regression = comparison against a baseline run). The OSS path stitches OpenLLMetry + Phoenix + DeepEval to the same effect with more wiring.

---

## Vendors

Observability for LLMs split into roughly four shapes by 2026.

### LLM-native observability platforms

Built specifically for tracing prompts + tool calls + evals together.

| Vendor | License | Strength | Caveat |
|--------|---------|----------|--------|
| **[Langfuse](https://langfuse.com/)** | MIT (self-host) + cloud | OSS-first; SDK-and-OTel ingestion; strong eval + prompt-management primitives; acquired by ClickHouse Jan 2026 | Self-hosting story is solid but operating ClickHouse-backed Langfuse is non-trivial at scale |
| **[LangSmith](https://www.langchain.com/langsmith)** | Commercial + free tier | Deepest LangChain / LangGraph integration; production-grade datasets, eval scheduling, agent assist; "[On Agent Frameworks and Agent Observability](https://www.langchain.com/blog/on-agent-frameworks-and-agent-observability)" lays out the framing | Closed source; pricing scales with traces; vendor-locks you to LangChain conventions in practice |
| **[Arize Phoenix](https://docs.arize.com/phoenix)** | Apache 2.0 (Phoenix) + paid Arize AX | OTel-native from day one; ML + LLM crossover; strong local-notebook ergonomics | Phoenix is the OSS slice; production durability lives in Arize AX (paid) |
| **[Helicone](https://www.helicone.ai/)** | Apache 2.0 + cloud | "Add `helicone.ai/v1` as your base URL" — single-line proxy onboarding; cost-leaderboard view; cheap to start | Proxy model adds a hop; less framework-aware than Langfuse / LangSmith |
| **[Lunary](https://lunary.ai/)** | Apache 2.0 + cloud | Lightweight OSS; chat-style replay UI; good fit for small teams | Smaller feature surface than Langfuse; eval primitives less mature |
| **[Pareto](https://pareto.ai/)** | Paid | Eval-and-data-labeling stack with human-in-the-loop reviewers as a managed service | Sells the human side; not a pure-tooling pick |
| **[Braintrust](https://www.braintrustdata.com/)** | Paid | Eval-first workflow; the cleanest "playground → dataset → CI eval" loop in the market | Pricier; eval-centric framing means tracing is secondary to evaluation |
| **[Weights & Biases Weave](https://wandb.ai/site/weave)** | Paid | Best fit if you already run W&B for ML experiments; unified ML + LLM tracking | Discoverability buried inside W&B; less LLM-focused than peers |
| **[OpenLLMetry / Traceloop](https://www.traceloop.com/openllmetry)** | Apache 2.0 (lib) + cloud | The instrumentation library most platforms read from; vendor-neutral OTel | Library, not a UI; you still pick a backend |

### General observability platforms (now LLM-aware)

Existing APM vendors retrofitted with LLM views — buy them when LLM observability has to share a pane of glass with the rest of your stack.

- **[Datadog LLM Observability](https://www.datadoghq.com/product/llm-observability/)** — per-span pricing; unified with Datadog APM; the right call if you're already a Datadog shop.
- **[Honeycomb for LLMs](https://www.honeycomb.io/blog/observability-for-large-language-models)** — high-cardinality query model fits LLM spans well; BubbleUp surfaces anomalies.
- **[Dynatrace AI Observability](https://www.dynatrace.com/news/blog/ai-observability-monitoring-llm-and-generative-ai/)** — auto-discovery of AI pipelines; enterprise sales motion.
- **[Fiddler AI](https://www.fiddler.ai/)** — ML + LLM monitoring; strongest on drift and explainability.

### Agent-session-replay platforms

Optimized for "show me what the agent did, turn by turn" — a different UX from spans-and-flames.

- **[AgentOps](https://www.agentops.ai/)** — session-replay timeline of agent runs with cost and tool breakdowns; OSS SDK + cloud.
- **[Literal AI](https://literalai.com/)** — Chainlit-native eval + observability.

### OTel-standard, vendor-neutral

If your discipline is "no lock-in":

- **OpenLLMetry** as the instrumentation library.
- **Arize Phoenix** (Apache 2.0) or **Jaeger / Grafana Tempo** as the backend.
- **DeepEval** or **promptfoo** for the eval loop.

This stack is the most portable; the cost is more wiring vs. picking Langfuse or LangSmith and getting a turnkey product.

---

## What good looks like

A team running observability seriously will have:

- **Every prod LLM call** wrapped with OpenLLMetry or a native SDK so spans land in the backend.
- **Every span** carries `gen_ai.*` attributes, the tenant ID, the session ID, and the prompt-template version.
- **A curated golden dataset** of ~50–500 representative inputs with expected outputs or rubrics.
- **CI gate** running RAGAS / DeepEval / promptfoo on every prompt or model change.
- **Online eval** — LLM-judge scoring a sampled fraction of production traces, with drift alerting.
- **SLO** on success rate (defined in [Deployment](deployment.md)) tied to a kill switch.
- **Cost-per-session dashboard** linked from each trace (see [Cost Economics](cost-economics.md)).

The litmus test from Chase's piece: *if a user complains "the agent did the wrong thing yesterday at 3pm," how many clicks to the exact trace?* If the answer is more than two, the stack isn't done.

---

## Decision matrix

| If you... | Use | Don't use | Why |
|-----------|-----|-----------|-----|
| Are LangChain / LangGraph-first and want minimum config | **LangSmith** | OpenLLMetry + Phoenix | First-party tracing, dataset, eval, and agent-assist views; the integration cost is near zero |
| Want OSS and self-hosting from day one | **Langfuse** (or Phoenix) | Datadog LLM Obs | Self-host on your infra; no per-trace pricing; OTel-native ingest |
| Need a single pane of glass with existing APM | **Datadog LLM Observability** or **Honeycomb** | A standalone LLM-native tool | LLM spans live next to your service spans; one on-call rotation |
| Are starting today and just need traces + cost visible | **Helicone** | A self-hosted Phoenix cluster | Single-line proxy setup; you can switch later once you know what you actually need |
| Want eval-first (regression-gate on every PR) | **Braintrust** or **DeepEval + Confident AI** | Pure tracing tools | Eval primitives are the product, not an afterthought |
| Are doing RAG and need targeted retrieval diagnostics | **RAGAS** (as a metric library) layered on any backend | Generic LLM-judge eval | Faithfulness / context-precision / recall are RAG-shaped; generic metrics under-fit |
| Need vendor-neutral, OTel-only, no lock-in | **OpenLLMetry + Phoenix + DeepEval** | LangSmith | Pure standards; portability is the load-bearing requirement |
| Need red-team / adversarial regression on every prompt change | **promptfoo** | DeepEval alone | promptfoo's built-in attack categories cover the prompt-injection / jailbreak surface DeepEval doesn't |
| Are an ML shop already on W&B | **W&B Weave** | A new LLM-only platform | Unified experiment tracking; one tool to learn |
| Need human-in-the-loop labeling at scale | **Pareto** or **Literal AI** | A pure-tooling pick | The hard part is the human eval throughput, not the dashboard |

---

## See also

- [Evals](evals.md) — testing methodology, LLM-as-judge patterns, dataset construction.
- [Hosting & Execution Infrastructure § Agent Observability & Evaluation](infrastructure.md#agent-observability-evaluation) — the full vendor table this page distills.
- [Safety](safety.md) — guardrails and the runtime safety surface; observability is the audit trail that makes safety governable.
- [Cost Economics](cost-economics.md) — cost data is a tracing attribute; every span should carry it.
- [Deployment](deployment.md) — SLOs and kill switches are defined on metrics derived from these traces.

## Primary sources

- [OpenTelemetry Semantic Conventions for GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — official spec.
- [OpenLLMetry](https://github.com/traceloop/openllmetry) — reference instrumentation library.
- [LangChain — On Agent Frameworks and Agent Observability](https://www.langchain.com/blog/on-agent-frameworks-and-agent-observability)
- [LangChain — State of AI Agents (2024 survey)](https://www.langchain.com/stateofaiagents)
- [Langfuse documentation](https://langfuse.com/docs)
- [Arize Phoenix documentation](https://docs.arize.com/phoenix)
- [Helicone documentation](https://docs.helicone.ai/)
- [RAGAS documentation](https://docs.ragas.io/)
- [DeepEval documentation](https://docs.confident-ai.com/)
- [promptfoo documentation](https://www.promptfoo.dev/docs/intro)
