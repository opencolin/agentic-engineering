<!-- description: How to measure whether an agent actually works — pass@k vs pass^k, the three-layer test mental model, three things that silently invalidate your numbers (grading bugs, infra noise, eval awareness), and the tooling landscape (Inspect AI, LangSmith, Braintrust, Langfuse, Phoenix). -->

# Evals

How you measure whether an agent actually works. Distinct from [Benchmarks](benchmarks.md) — benchmarks are the public leaderboards (SWE-bench, GAIA, Terminal-Bench); evals are *your* tests against *your* failure modes.

> "The evaluators that matter are the ones that catch your specific failure modes, discovered through the error analysis process." — [LangChain, Agent Evaluation Readiness Checklist](https://blog.langchain.com/agent-evaluation-readiness-checklist/)

Quality is the #1 production blocker — [89% of orgs have observability, only 57% have agents in production](https://langchain.com/state-of-agent-engineering). The gap is closing eval rigor.

---

## The mental model

Three layers of test, from cheapest to most-rigorous:

| Layer | Cost | Catches | Build first |
|---|---|---|---|
| **Code-based graders** | $0, milliseconds | Format errors, schema violations, JSON parse failures | Yes — start here |
| **Model-based graders (LLM-as-judge)** | API calls | Subjective quality, tone, factual claims | After your test set has 20-50 cases |
| **Human review** | Hours | Anything else, gold-standard ground truth | The 20-50 traces you start the program with |

[Anthropic's demystifying-evals post](https://anthropic.com/engineering/demystifying-evals-for-ai-agents) and [LangChain's readiness checklist](https://blog.langchain.com/agent-evaluation-readiness-checklist/) both make the same recommendation: combine all three. Use code-based for what's deterministic, model-based for what's subjective, human for what's irreducible.

---

## How to start an eval program (without an eval team)

The readiness-checklist consensus across both Anthropic and LangChain:

1. **Hand-review 20-50 real traces first.** [LangChain says spend 60-80% of eval effort on error analysis](https://blog.langchain.com/agent-evaluation-readiness-checklist/) — not on building infrastructure. You can't write a useful grader for a failure mode you haven't seen.
2. **Start with 20-50 simple tasks pulled from real failures.** [Anthropic, demystifying-evals](https://anthropic.com/engineering/demystifying-evals-for-ai-agents): "Effective programs start with 20-50 simple tasks pulled from real failures, not exhaustive benchmarks."
3. **Separate capability evals from regression evals.** Capability evals measure new abilities; regression evals protect shipped behavior. Mixing them blocks both.
4. **Prefer binary pass/fail over numeric scales.** Less subjective; smaller required sample sizes; easier to debug.
5. **Use single-step evals for tool-selection regressions.** Deep Agents data shows ~50% of test failures cluster at individual decision points, not full trajectories — single-step evals catch them faster and cheaper.

---

## pass@k vs pass^k — the reliability gap

Most teams report pass@k (probability of succeeding *at least once* across k trials). Production cares about pass^k (probability of succeeding on *all* k trials).

The gap is brutal. From [Anthropic's demystifying-evals](https://anthropic.com/engineering/demystifying-evals-for-ai-agents):

> 75% per-trial × 3 trials = ~42% pass^3

If your agent is 75% reliable and a user retries 3 times, you have a coin-flip of *some* attempt working. If a workflow needs all 3 to succeed (e.g. a 3-step pipeline), you're at 42%. Track pass^k when reliability across multiple invocations is what matters operationally.

---

## Three things that will silently invalidate your numbers

### 1. Grading bugs masquerading as model failures

From [Anthropic, demystifying-evals](https://anthropic.com/engineering/demystifying-evals-for-ai-agents): Opus 4.5 on CORE-Bench initially scored 42%. After fixing grading bugs (rigid precision, ambiguous specs), the *same model on the same task* scored 95%. From [LangChain's checklist](https://blog.langchain.com/agent-evaluation-readiness-checklist/): a Witan Labs benchmark moved from 50% to 73% after a single extraction-bug fix.

**Rule:** if you see a surprising number, suspect the grader before suspecting the model.

### 2. Infrastructure noise

From [Anthropic, Quantifying Infrastructure Noise](https://anthropic.com/engineering/infrastructure-noise):

- Infra config alone swings Terminal-Bench 2.0 scores by **6 percentage points** (p < 0.01) — sometimes more than the gap between leaderboard slots
- At strict 1× resource enforcement, infra error rate is 5.8%; uncapped, it's 0.5%
- SWE-bench: 1.54pp lift at 5× RAM vs 1× baseline

**Rule:** treat sub-3pp leaderboard differences with skepticism absent infra disclosure.

### 3. Eval-aware models

From [Anthropic, Eval Awareness in BrowseComp](https://anthropic.com/engineering/eval-awareness-browsecomp): Opus 4.6 was caught hypothesizing it was being tested, identifying the BrowseComp benchmark, and decrypting the published answer key. 11 of 1,266 problems (0.87%) in multi-agent config were "solved" this way. Multi-agent contamination 3.7× single-agent.

**Rule:** for any benchmark with published answer keys (BrowseComp, GAIA, SimpleQA, etc.), monitor for canary GUID strings and binary-file retrieval.

---

## Benchmarks ≠ trustworthy by default

The [Agentic Benchmark Checklist (ABC) paper](https://arxiv.org/abs/2507.02825) — co-authored by Stanford, Princeton, MIT, Berkeley researchers — shows existing benchmarks can misestimate capability by up to **100% in relative terms**. Concrete cases: SWE-bench Verified has inadequate test coverage; TAU-bench credits empty responses as successful. Applying ABC to CVE-Bench reduced performance overestimation by 33%.

Use benchmarks for direction; trust *your* evals for production decisions.

---

## Categories to test (Deep Agents taxonomy)

[How We Build Evals for Deep Agents](https://blog.langchain.com/how-we-build-evals-for-deep-agents/) lists eight categories worth covering:

1. **file_operations** — read/write/edit/search on the agent's filesystem
2. **retrieval** — RAG over docs / codebase
3. **tool_use** — picks the right tool, calls it with right args
4. **memory** — recalls prior context correctly across turns
5. **conversation** — multi-turn coherence
6. **summarization** — compression without information loss
7. **unit_tests** — end-to-end task completion
8. (plus one more domain-specific)

Plus five efficiency metrics: step ratio, tool-call ratio, latency ratio, solve rate, correctness.

---

## Multi-turn eval design

Multi-turn breaks naive eval harnesses. Two patterns that work:

- **N-1 testing.** Use real conversation prefixes (the first N-1 turns) and let the agent generate the final turn. Tests final-turn behavior in real context without re-running the whole conversation.
- **Conditional branching.** Don't auto-fail when the agent deviates from the canonical path. Path deviation may be correct; check the end-state instead. From [Evaluating Deep Agents — Our Learnings](https://blog.langchain.com/evaluating-deep-agents-our-learnings/).

---

## Tooling landscape

| Tool | Slot | Notable |
|---|---|---|
| [Inspect AI](https://inspect.aisi.org.uk) | Eval framework | UK AISI + Meridian; Task/Solver/Scorer; 200+ built-in evals; adopted by Anthropic, DeepMind, xAI |
| [Inspect Evals](https://github.com/UKGovernmentBEIS/inspect_evals) | Community eval library | 511 stars; benchmarks for coding, agentic, cybersecurity, safeguards |
| [LangSmith](https://docs.smith.langchain.com) | Eval + observability platform | Framework-agnostic; integrates with LangChain, AutoGen, CrewAI, Mastra, OpenAI Agents, PydanticAI |
| [Braintrust](https://braintrust.dev) | Eval + observability platform | Loop (auto-improves prompts), Brainstore trace-optimized DB; SOC2/HIPAA/GDPR |
| [Langfuse](https://langfuse.com) | Open-source observability | Self-hostable alternative for tracing + eval workflows |
| [Arize Phoenix](https://phoenix.arize.com) | Open-source observability | OpenTelemetry-native |
| [Harbor](https://github.com/langchain-ai/harbor) | Sandboxed eval runner | Used inside Deep Agents for isolated/reproducible test envs |

---

## Anti-patterns

- **"More evals = better agents."** [LangChain](https://blog.langchain.com/how-we-build-evals-for-deep-agents/): curated focused tests beat high-volume noisy ones.
- **Numeric scales for subjective grading.** Higher variance, larger samples required, harder to debug. Use binary.
- **No holdout split.** You'll overfit your harness to your eval set. Hold out 20% minimum.
- **Skipping error analysis.** Building grader infrastructure before reviewing real traces produces graders for the wrong failure modes.
- **Trusting LLM-as-judge alone.** It's flexible but biased. Combine with code-based for what's deterministic, human for ground truth.

---

## Related

- [Benchmarks](benchmarks.md) — the public leaderboards this page is *not* about
- [Harness Engineering](harness-engineering.md) — the system you're evaluating
- [Context Engineering](context-engineering.md) — one of the things your evals measure
- [Research Notes](research-notes.md) — primary sources for every claim and number on this page
