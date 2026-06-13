<!-- lastVerified: 2026-06-02 | staleBy: 2026-12-02 -->

# Deployment for Coding Agents

> *"You don't deploy an agent. You deploy a level of autonomy — and you ratchet it up only as the evidence warrants."*

A coding agent is not a service to "ship to prod" in the usual sense. It is a *policy* — a piece of decision-making authority you delegate to a non-deterministic process. Deployment, for agents, is the discipline of moving that policy along an autonomy gradient: from running silently next to a human (**shadow**), to acting on a fraction of low-stakes work (**canary**), to operating without per-action review (**autonomous**) — with **SLOs**, **kill switches**, and **drift monitoring** at every step.

This page covers:

1. **The autonomy ladder** — shadow → canary → autonomous, and what each stage actually entails.
2. **SLOs for agents** — what a service-level objective looks like when the work is non-deterministic.
3. **Kill switches** — circuit breakers, budget caps, and the rollback story.
4. **Drift monitoring** — how the same agent gets worse without anyone changing it, and how to catch it.
5. **Reference architectures** — what teams that have done this actually run.
6. **Decision matrix** — when each lever is required, and when it isn't.

---

## The autonomy ladder

Three stages, monotonically more authority, each gated on evidence from the prior one. The framing comes out of Anthropic's [*Claude Code Auto Mode: a Safer Way to Skip Permissions*](https://www.anthropic.com/engineering/claude-code-auto-mode) and the [Anthropic *Building Effective Agents*](https://www.anthropic.com/research/building-effective-agents) post, and is the same shape that Stripe and Coinbase describe for their internal coding fleets ([Stripe Minions](coding-agents.md#stripe-minions)). The vocabulary also tracks classic deployment progression (shadow / canary / blue-green / rainbow) recast for agent work.

### Shadow

The agent runs on real inputs and produces real outputs — but the outputs are **not acted on**. They are logged, compared against the human action that actually happened, and graded.

What you get:

- A trace of every decision the agent *would have made* on production inputs.
- An empirical disagreement rate against the human baseline.
- An eval dataset of real-world examples to train, prompt-tune, and red-team against — without risk.

When you're done:

- The disagreement rate has fallen to a level the team is willing to accept.
- The remaining disagreements are inspected and either (a) the agent is wrong and gets fixed, (b) the human was wrong and the agent is teaching you something, or (c) it's a legitimate judgment call. Categorization is the deliverable.

Concrete shapes: a coding agent shadowing PR review on every merged PR; a triage agent shadowing on-call rotations; a refactor agent shadowing every dependabot upgrade.

### Canary

The agent acts — on a *fraction* of work, *low-stakes* slices, with *easy rollback*. The fraction starts at 1–5% and grows only as SLOs hold.

Slicing dimensions that matter:

- **By work class** — agent merges dep-bumps and doc-typos before it merges feature PRs.
- **By blast radius** — agent acts on a test repo, a sandbox account, an internal-only namespace before customer-facing surfaces.
- **By tenant** — agent acts for an internal team / dogfood customer / pilot cohort before the general population.
- **By time window** — agent acts during business hours when humans can intervene before overnight autonomy.
- **By traffic fraction** — straightforward percentage of eligible work, randomized.

Rainbow deploys ([Anthropic, *How We Built Our Multi-Agent Research System*](https://www.anthropic.com/engineering/multi-agent-research-system)) are the same shape extended over time: run multiple versions in parallel and route a fraction of traffic to each so a regression in v2 doesn't blow up the whole fleet.

The exit gate: agreed-on success and quality SLOs hold over a defined window (typically 1–2 weeks of stable traffic), and the kill-switch / rollback drill has been rehearsed.

### Autonomous

The agent acts on the full eligible workload without per-action review. The human role shifts from approver to monitor: dashboards, alerts on SLO breach, weekly eval reviews, and on-call for the kill switch.

What stays in place even at full autonomy:

- **Per-session caps** — token budget, wall-clock limit, tool-call rate ceiling.
- **Per-action gates** — irreversible operations (delete, force-push, send-money, prod-deploy) keep human-in-the-loop or two-agent-review even in "autonomous" mode.
- **Continuous eval** — production traces sampled and scored on a schedule; regressions page someone.
- **Kill switch** — pulling it must take seconds, not minutes.

The point of the ladder is *evidence accumulation*. Each stage produces the data — disagreement rates, SLO numbers, surfaced failure modes — that justifies the next one.

---

## SLOs for agents

Classical SRE SLOs (latency, error rate, availability) are necessary but insufficient — they treat the agent like a service. Agent SLOs must additionally cover *task quality* and *cost*.

A working set:

| SLO class | Examples | Why it matters |
|-----------|----------|----------------|
| **Outcome quality** | Eval-pass rate on a curated golden set ≥ X%; LLM-judge score on sampled prod traces ≥ Y; PR-merge rate ≥ Z%; downstream revert rate ≤ R% | The agent doing things doesn't mean it's doing them well |
| **Tool correctness** | Tool-choice accuracy ≥ X%; tool-argument schema-violation rate ≤ Y%; error-loop rate (same tool fail twice in a row) ≤ Z | Catches the failures classical service SLOs miss |
| **Latency / availability** | p50 / p95 / p99 time-to-first-token; p95 end-to-end task completion; uptime against provider quota | Standard service SLOs, retained |
| **Cost** | $/task, $/successful-task, p95 cost-per-session, cache hit rate | See [Cost Economics](cost-economics.md); cost is part of the contract, not a separate report |
| **Safety** | Guardrail-trigger rate; high-severity violations per 1K tasks; eval pass on a red-team suite | See [Safety](safety.md); safety SLOs are wired to the kill switch |
| **Drift** | Day-over-day eval delta; weekly distribution-shift score on inputs | Drift is silent until it isn't |

A few principles for setting these:

- **Set on a curated dataset *and* on live traffic.** Offline evals on a golden set are reproducible but don't see the prod input distribution; online sampling sees prod but is noisy. You need both.
- **Per-tenant / per-intent breakdowns matter more than aggregates.** The agent works fine on average and is broken for one customer or one task class.
- **Symmetric thresholds — warn before page.** A 90% eval-pass with a target of 95% should warn; the page threshold is for *real* breach.
- **SLOs are negotiated, not optimized.** A 99.9% eval-pass with 10× the cost might be wrong; deployment is the place where quality and cost trade off in the open.

LangChain's [Agent Evaluation Readiness Checklist](https://www.langchain.com/blog/agent-evaluation-readiness-checklist) and Anthropic's [*Demystifying Evals for AI Agents*](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) walk through the upstream eval discipline; the SLOs in this section are the downstream commitments those evals enable.

---

## Kill switches

A kill switch is a single control — one toggle, one role, seconds to activate — that **stops the agent from taking actions**. Without one, every deployment is an unbounded bet on the model's good behavior.

### The minimum bar

1. **A flag** — feature flag, config value, environment variable; checked at the start of every tool-execution path. Flipping it stops new actions immediately.
2. **A *who* and a *how*** — someone on the on-call rotation can pull it without an engineer's help. Document the runbook; rehearse it.
3. **A scope** — global kill (all tenants, all task classes), per-tenant kill, per-tool kill, per-version kill. The smaller the scope you can reach for, the cheaper the response.
4. **A budget circuit breaker** — per-session token / dollar / time cap is itself a kill switch at the request level. If a single session exceeds its budget, it halts and pages. See [Cost Economics § Idle cost](cost-economics.md#idle-cost).

### Auto-trip conditions

The kill switch must trip on its own when:

- **SLO breach** — eval-pass rate or safety-violation rate crosses a threshold over a rolling window.
- **Cost anomaly** — $/task spikes 3–5× over baseline (often the symptom of a runaway loop).
- **Error-rate spike** — tool-call error rate jumps; Poisson-style detectors compare a 7-day baseline against a recent window ([LangChain, *Production Agents Self-Heal*](https://www.langchain.com/blog/how-my-agents-self-heal-in-production), 60-minute post-deploy window at p < 0.05).
- **Provider incident** — upstream model API degraded; fail closed rather than retry-storm.
- **Distribution shift** — input embedding drift exceeds threshold (see drift monitoring below).

### Per-action gates

Even with a global kill switch, certain actions should never run without a human:

- Production deploys, force pushes to protected branches, schema migrations.
- Payments, refunds, key revocations, account deletions.
- Sending email / messages to external parties at scale.
- Anything irreversible — *the rule is "if we can't undo it, two-key it"*.

The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) and [LangGraph](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/) both ship first-class human-in-the-loop primitives (interrupts, approvals, breakpoints) for this — the implementation should be a wrapper around them, not a hand-rolled try/except.

### Rollback story

A kill switch stops *new* actions. Rollback is the *recovery* path — what to do about actions already taken:

- **Idempotency keys** so retries don't duplicate work.
- **Compensating actions** (the database-transactions Saga pattern) for already-committed side effects.
- **Git revert + branch protection** for code changes.
- **Audit log of every agent action** keyed by trace ID, so the rollback team can answer "what did the agent do between 14:02 and 14:17?" in one query.

---

## Drift monitoring

The failure mode unique to agents: nothing in your stack changed, and the agent got worse. Three drift surfaces matter.

### Model drift

The upstream model is silently upgraded, deprecated, or its behavior subtly shifts. Two defenses:

- **Pin model versions explicitly** — `claude-sonnet-4-5-20250929`, `gpt-4o-2024-08-06` — never use an alias that the provider can repoint.
- **Continuous offline eval against your golden set** — if the same inputs produce different outputs on the same model ID over time (usually because of provider-side fine-tuning patches), your eval suite will catch it before users do.

### Input drift

The distribution of inputs your users send shifts (new framework, new failure mode, seasonality, new persona). The agent was tuned for last quarter's mix.

- **Embed inputs and track distribution** — cluster live inputs, compare to the eval-set distribution, alert on KL-divergence or new-cluster appearance.
- **Sample novel inputs into the eval set** — the curated dataset must grow with the workload, not stay frozen at v1.
- **WhyLabs / LangKit](https://whylabs.ai/safeguard-large-language-models)**, **[Fiddler AI](https://www.fiddler.ai/)**, and **[Arize Phoenix](https://docs.arize.com/phoenix)** all ship distribution-drift dashboards as first-class features.

### Behavior drift

Same model, same inputs, the agent's behavior changes — usually because the harness changed (a new tool added, a prompt template updated, an MCP server upgraded its descriptions, a downstream API changed its response shape).

- **Prompt-template versioning** — every prompt is a tracked artifact; every prod span carries the version. [LangSmith Prompt Hub](https://docs.langchain.com/langsmith/prompt-engineering-concepts), [Langfuse Prompt Management](https://langfuse.com/docs/prompts/get-started), [Helicone Prompts](https://docs.helicone.ai/features/prompts) are the reference implementations.
- **Tool inventory versioning** — the agent's tool schema is checked into source control; diffs trigger eval.
- **Regression eval on every harness change** — same shape as code CI: `bash run-evals.sh` blocks merge on regression.

The litmus test: *if eval-pass drops 5% week-over-week, can you point at the change?* If no, your drift instrumentation is incomplete.

---

## Reference architectures

Pulled from primary sources; each illustrates a different operating point on the autonomy ladder.

### Stripe Minions

Stripe's internal coding-agent fleet ships 1,300+ merged PRs/week through a multi-stage pipeline ([Coding Agents § Stripe Minions](coding-agents.md#stripe-minions)). The deployment shape:

- **Blueprints** = parameterized templates that act as the *unit of deployment* — a blueprint is canaried, monitored, and killed independently.
- **Devbox isolation** per task — failures don't pollute siblings.
- **CI gates with a hard cap (≤2 attempts)** — the agent isn't allowed to retry forever; budget enforcement is in the workflow, not the agent.
- **Per-blueprint cost-per-PR tracking** — every blueprint reports its dollar-per-merged-PR; underperformers get killed.
- **Pre-hydrated context** ensures consistent input distribution and traceable changes when the context layer is updated.

### Claude Code Auto Mode

Anthropic's [Auto Mode](https://www.anthropic.com/engineering/claude-code-auto-mode) (2025) is the design point for a single-developer / IDE-resident agent. The deployment-relevant primitives:

- **Tiered permissions** — read-only (`Read`, `Glob`, `Grep`) auto-approved; mutations (`Edit`, `Write`, `Bash`) escalate by default until you mark them safe; destructive operations (force-push, root-level `rm`) keep human-in-the-loop forever.
- **Sandboxing** ([*Beyond Permission Prompts*](https://www.anthropic.com/engineering/sandboxing-claude-code)) bounds blast radius so the per-action question becomes "can this be undone?" rather than "is this safe?"
- **Conversation-level budget** is the kill switch — sessions terminate at the configured turn / token cap.

### Production Agents Self-Heal (LangChain)

The [self-healing pattern](https://www.langchain.com/blog/how-my-agents-self-heal-in-production) (April 2026) wires a coding agent into the on-call loop:

- Poisson regression detector compares a 7-day baseline error rate against a 60-minute post-deploy window at p < 0.05.
- Error signatures normalized (strip UUIDs / timestamps / numbers, truncate to 200 chars) for clustering.
- Triage agent classifies changed files (runtime / prompt-config / test / docs / CI) to suppress false positives.
- Open SWE consumes the failure + git diff and opens a fix PR — closing the deploy → detect → triage → fix loop without a human in the critical path.

The deployment lesson: the kill switch and the auto-fix are the same machinery — both depend on having a baseline, a comparator, and an action surface.

### Anthropic multi-agent research system

The [Anthropic multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) is explicit about **rainbow deploys**: multiple model versions and orchestration strategies run in parallel, traffic is sliced across them, and the winner is promoted only after a full eval window. The same shape is the right default for agent harness upgrades — model swap, prompt template change, tool-schema update — *especially* when the change is supposed to be "improvement only."

---

## What good looks like

A team running agent deployment seriously will have:

- **A documented autonomy ladder** — explicit shadow, canary, autonomous stages with named entry and exit gates.
- **A golden eval set + live sampling + SLOs** on both quality and cost — see [Evals](evals.md), [Observability](observability.md), [Cost Economics](cost-economics.md).
- **A kill switch** — single control, on-call runbook, rehearsed quarterly.
- **Per-action gates** on irreversibles, independent of autonomy stage.
- **Drift instrumentation** — model pin + offline eval drift + input distribution drift + harness versioning.
- **A regression-blocking eval CI** so harness changes don't regress prod.
- **A weekly review cadence** — eval trend, cost-per-task trend, kill-switch trips, surfaced failure modes.
- **A blast-radius story per action** — every tool answers "what does this break if it's wrong?" and routes accordingly.

The Anthropic Building Effective Agents framing applies: *successful agent implementations favor simple, composable patterns over complex frameworks*. The deployment discipline is what keeps that simplicity safe.

---

## Decision matrix

| If you... | Use | Don't use | Why |
|-----------|-----|-----------|-----|
| Are shipping an agent that takes any real action | **Autonomy ladder (shadow → canary → autonomous)** | A flag-day cutover from human to agent | Cutovers concentrate risk; ladders spread it across time and give you the data to justify each step |
| Are starting from scratch with no eval baseline | **Shadow mode for ≥1 sprint** to build the dataset | Going straight to canary | Without a baseline, you have no "wrong" signal — every disagreement looks like noise |
| Need to expand from canary to autonomous | **SLO holds for a defined window (typically 1–2 weeks) and kill-switch drill executed** | A meeting and a vibes check | The whole point of the ladder is evidence; the gate is the evidence threshold |
| Have any irreversible action (prod deploy, payment, delete) | **Per-action human-in-the-loop, regardless of autonomy stage** | Trust the ladder | The ladder is for the *expected* failure modes; per-action gates catch the unexpected ones |
| Are running a multi-tenant workload | **Per-tenant SLO breakdowns + per-tenant kill** | Aggregate-only SLOs | One tenant breaking at 100% is invisible in an average; per-tenant SLOs catch it |
| Need to deploy a new model / prompt / tool change | **Rainbow deploy (parallel versions, sliced traffic)** | Replace-in-place | A regression in v2 doesn't take down the whole fleet; you discover it on a slice |
| Have a budget concern (or have been burned by a runaway loop) | **Per-session budget circuit breaker + cost SLO + auto-trip on cost anomaly** | Trust the model to terminate | One bad loop × one weekend = a five-figure surprise; the breaker is the only defense |
| Are deploying to satisfy compliance / audit | **The above + documented runbooks, kill-switch drills, and audit-log retention policy** | The deployment ladder alone | Auditors want the *process*, not the outcome |
| Have a chat-shaped, low-stakes agent (internal Q&A on docs) | **Skip the full ladder; canary + eval + kill switch is enough** | Over-engineering shadow mode | The ladder's value scales with the blast radius; trivial actions deserve trivial ceremony |
| Are running long-lived / always-on agents | **Event-driven scheduling + idle-cost SLO + per-session budget** | Always-warm polling loops | See [Cost Economics § Idle cost](cost-economics.md#idle-cost); idle is the silent budget killer |
| Notice eval-pass dropping with no change you made | **Check model pin + input distribution drift + provider-side fine-tune notes** | Assume noise | Three drift surfaces; the one you didn't instrument is the one that bit you |
| Are operating at the scale where one engineer can't watch every action | **Self-healing loop (auto-detect → triage agent → fix PR)** | Pure manual on-call | LangChain's recipe — closes detect-to-fix without humans in the critical path |

---

## See also

- [Observability](observability.md) — the trace, span, eval, and metric substrate every SLO is computed over.
- [Evals](evals.md) — the golden set, the LLM-judge patterns, the dataset hygiene that feed the eval SLO.
- [Safety](safety.md) — the safety SLOs and red-team gating that wire into the kill switch.
- [Cost Economics](cost-economics.md) — the cost SLOs and per-session budget breakers.
- [Coding Agents § Stripe Minions](coding-agents.md#stripe-minions) — the deployment shape at fleet scale.
- [Harness Engineering](harness-engineering.md) — the discipline upstream of all of this.

## Primary sources

- [Anthropic — Building Effective Agents (2024)](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic — Claude Code Auto Mode: a Safer Way to Skip Permissions](https://www.anthropic.com/engineering/claude-code-auto-mode)
- [Anthropic — Beyond Permission Prompts: Sandboxing Claude Code](https://www.anthropic.com/engineering/sandboxing-claude-code)
- [Anthropic — How We Built Our Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain — Agent Evaluation Readiness Checklist](https://www.langchain.com/blog/agent-evaluation-readiness-checklist)
- [LangChain — Production Agents Self-Heal](https://www.langchain.com/blog/how-my-agents-self-heal-in-production)
- [LangChain — On Agent Frameworks and Agent Observability](https://www.langchain.com/blog/on-agent-frameworks-and-agent-observability)
- [OpenAI — Agents SDK (human-in-the-loop primitives)](https://openai.github.io/openai-agents-python/)
- [LangGraph — Human-in-the-Loop concepts](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/)
- [Google SRE Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/) — the SRE discipline this page adapts for non-deterministic workloads.
