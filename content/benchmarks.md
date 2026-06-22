<!-- description: SWE-bench and Terminal Bench — the two benchmarks that matter most for autonomous coding agents, how they work, and who's on top. -->

# Benchmarks

How agentic coding systems are evaluated. The two benchmarks that matter most for coding agents today are **SWE-bench** (resolve real GitHub issues) and **Terminal Bench** (complete terminal-based engineering tasks). Together they cover two different shapes of the same question: *can the agent actually get the job done end-to-end?*

Benchmarks aren't the whole story — Stripe's internal signal is 1,300+ real PRs/week, not a leaderboard number — but they're the shared yardstick the category agrees on.

This page covers the **public leaderboards**. For the methodology of building eval programs against *your own* failure modes — pass@k vs pass^k, the three silent invalidators (grading bugs / infrastructure noise / eval awareness), and the eval-tooling landscape — see [Evals](evals.md). For the models being scored, see [Models](models.md).

---

## SWE-bench

**Home:** [swebench.com](https://www.swebench.com/) · **Source:** [github.com/swe-bench/SWE-bench](https://github.com/swe-bench/SWE-bench) · **License:** MIT · **Alt view:** [openlm.ai/swe-bench](https://openlm.ai/swe-bench/) (side-by-side display of standard + Verified + IOI competition scores with explicit harness column)

SWE-bench is the de facto standard benchmark for autonomous coding agents. It measures whether an agent, given a real GitHub issue and a snapshot of the repository, can produce a patch that makes the existing test suite pass.

### How it works

1. **Input** — A repo at a specific commit + the text of a GitHub issue that was later resolved in that repo.
2. **Task** — The agent generates a patch intended to resolve the issue.
3. **Evaluation** — The patch is applied inside a Docker container and the repo's test suite runs. "Resolved" means the tests that *should* pass (including ones originally written for that fix) do pass.

The harness is fully containerized and reproducible. Local evaluation needs ~120GB of free storage, 16GB RAM, and 8 CPU cores; cloud evaluation runs on Modal or via the `sb-cli` tool. Issues come from 12 popular Python repositories — Django, Flask, Matplotlib, pytest, Requests, scikit-learn, SymPy, Sphinx, Seaborn, xarray, astropy, and pylint.

### Variants

| Variant | Instances | Description |
|---------|-----------|-------------|
| **SWE-bench** | 2,294 | Full dataset (ICLR 2024) |
| **SWE-bench Verified** | 500 | Human-filtered subset confirmed solvable by real engineers (OpenAI Preparedness) |
| **SWE-bench Lite** | 300 | Curated subset for faster iteration |
| **SWE-bench Multimodal** | 517 | Issues with visual elements — screenshots, diagrams, plots (ICLR 2025) |
| **SWE-bench Multilingual** | 300 | 9 programming languages beyond Python |
| **SWE-bench Pro** | 1,865 | Scale AI's harder successor (2026) — public + held-out + commercial splits across 41 actively maintained repos. Top models score ~23%, vs. 70%+ on Verified — designed to clear the contamination + saturation problems Verified is hitting. [Leaderboard](https://labs.scale.com/leaderboard/swe_bench_pro_public) · [Public set on GitHub](https://github.com/scaleapi/SWE-bench_Pro-os) |

**Verified** is the variant most production agents publish against — the cleanest signal, curated to remove ambiguous or ill-specified tasks.

### Why it matters

SWE-bench measures the thing agentic engineering is really about: *closed-loop, unattended bug-fix-and-feature work against real codebases with real test suites*. It's the metric that separates scaffolded demos from agents that can survive a merge queue.

- **Evaluation is objective** — tests pass or they don't.
- **Tasks are real** — not synthetic, not sanitized, same issues actual maintainers triaged.
- **Harness matters as much as model** — results are published as `agent × model` pairs, because a Claude-4-Sonnet base behind an unsophisticated harness can lose to a GPT-4o-mini behind a well-engineered one.

### How agents compete

A SWE-bench submission is always a *harness*, not a raw model. The harness = scaffolding the agent runs inside: file-navigation tools, test-runner integration, retry logic, review loops. See [Patterns](patterns.md) for more on harness engineering.

Representative harnesses (in rough chronological order):

- **SWE-agent** ([Princeton NLP](https://github.com/SWE-agent/SWE-agent)) — the original open-source SWE-bench harness (Yang et al. 2024); introduced the Agent-Computer Interface idea.
- **mini-SWE-agent** — successor to SWE-agent, hits 65% on SWE-bench Verified.
- **OpenHands** — reference open-source implementation, pushed state of the art past 50% Verified in 2024.
- **Claude Managed Agents / OpenAI agentic coding models** — model-provider-managed loops that publish their own Verified numbers.
- **Amp, Cursor Agent, Windsurf Cascade, Cline, Aider** — commercial harnesses that regularly appear on the leaderboard.

### Backers

OpenAI, Anthropic, Andreessen Horowitz, AWS, Modal, and Open Philanthropy all fund or operate infrastructure for the benchmark. That level of buy-in from direct competitors is why Verified numbers became the shared currency.

---

## Terminal Bench

**Home:** [tbench.ai](https://www.tbench.ai/) · **Leaderboard:** [tbench.ai/leaderboard/terminal-bench/2.0](https://www.tbench.ai/leaderboard/terminal-bench/2.0)

Terminal Bench is a Stanford × Laude Institute collaboration that benchmarks agents on end-to-end terminal-based engineering tasks — not just writing code, but operating the machine around it.

### How it works

Tasks run inside a standardized harness (`harbor run -d terminal-bench@2.0`). Submissions cannot modify timeouts or resources — every agent gets the same wall clock and the same VM. Scoring is accuracy (% of tasks completed) reported with a confidence interval.

**Version 1.0** had 80 tasks. **Version 2.0** expands to 89 tasks with greater depth across five categories:

| Category | Example tasks |
|----------|---------------|
| Software Engineering | Build systems, configure applications |
| Security | Cryptography, certificate management |
| System Administration | Compile the Linux kernel, configure a Git server |
| Data Science | Process datasets, train models |
| Machine Learning | Develop and optimize models (e.g., train a FastText classifier) |

These are harder than SWE-bench in a particular way: they require the agent to know how a *system* works, not just a codebase. Compiling a kernel or standing up a Git server exercises package management, filesystem layout, service configuration — the ambient knowledge senior engineers carry that's traditionally absent from LM-focused benchmarks.

### Top performers (Terminal Bench 2.0, June 2026)

| Rank | Agent × Model | Score | Date |
|------|---------------|-------|------|
| 1 | NexAU-AHE + GPT-5.5 | 84.7% ± 2.1 | 2026-05-14 |
| 2 | LemonHarness (multi-model) | 84.5% | 2026-05-14 |
| 3 | Capy + GPT-5.5 | 83.1% | 2026-05-14 |

142 total submissions tracked as of June 2026. Notable pattern: GPT-5.5 powers #1 and #3 with very different harnesses (NexAU-AHE vs Capy) — small score gap, different scaffolding choices — and an unspecified-model harness (LemonHarness) lands between them. Smaller models (GPT-5-Nano, OSS-20B) score in single digits regardless of harness, so scaffolding alone doesn't rescue a weak base.

### Why it matters

Terminal Bench captures capabilities SWE-bench doesn't:

- **System thinking** — install packages, debug services, navigate the filesystem.
- **End-to-end workflows** — not "edit one file to fix one test" but "build this thing from scratch."
- **Multi-tool fluency** — the agent has to use whatever CLI the task requires, not a pre-wired set of SWE-specific tools.

For teams building internal coding agents — especially in the [Stripe Minions](approaches.md#stripe-minions) mold where the agent runs inside a full devbox — Terminal Bench is closer to the production environment than SWE-bench. If your agent can't compile a kernel, it probably also can't recover from a flaky build step in your monorepo.

---

## Inspect AI

**Home:** [inspect.aisi.org.uk](https://inspect.aisi.org.uk/) · **Source:** [github.com/UKGovernmentBEIS/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai) · **License:** MIT

The UK AI Security Institute's evaluation framework, jointly maintained with Meridian Labs. Inspect is *not* a benchmark — it's the **framework other benchmarks ship on**. Frontier labs use it for pre-release capability and safety evals; SWE-bench, Cybench, GAIA, and ~200 other public evals are published as Inspect tasks via the companion [`inspect_evals`](https://github.com/UKGovernmentBEIS/inspect_evals) repo.

### How it works

An Inspect eval is a Python file with three slots: a **dataset** (samples to grade), one or more **solvers** (the agent loop — including bring-your-own-harness via `bridge()`), and **scorers** (model-graded, rule-based, or both). The framework provides built-in solvers for tool-use, multi-turn dialogue, ReAct, and human-in-the-loop; a web-based log viewer for trace inspection; and VS Code integration for live debugging.

### Why it matters for agentic engineering

- **Safety + capability in one tool** — the same harness used for "does it pass SWE-bench" is used for "does it produce CBRN uplift." Cross-cutting agent risks (prompt injection, sandbox escape, deceptive behavior) get evaluated alongside task accuracy.
- **Lingua franca for government evals** — UK AISI, US AISI, and Anthropic / OpenAI / Google DeepMind pre-deployment testing all run on Inspect. If your agent is going to be evaluated by a regulator post-EU-AI-Act, it'll likely be inside an Inspect task.
- **Reproducible and shareable** — every run produces a structured log reviewable in the [Inspect View](https://inspect.aisi.org.uk/view) UI; researchers can publish the full trajectory, not just the score.

For teams building production agents, Inspect is the right place to run your internal regression suite — a strict superset of what `pytest`-style eval libraries ([DeepEval](infrastructure.md#evaluation--testing), [Ragas](infrastructure.md#evaluation--testing)) offer, with a UI built for human review.

---

## τ-Bench (Sierra)

**Source:** [github.com/sierra-research/tau2-bench](https://github.com/sierra-research/tau2-bench) (ships τ³-bench 1.0.0) · **License:** MIT · **Origin:** [Sierra](https://sierra.ai) (Bret Taylor's customer-experience AI company)

Where SWE-bench measures *can the agent ship a PR* and Terminal Bench measures *can the agent operate a machine*, τ-bench measures the third thing production agents have to do: **hold a multi-turn conversation with a customer while obeying a written policy and calling tool APIs correctly.** The agent talks to a user simulated by an LLM; behind the scenes it must call domain APIs (read a booking, modify it, refund the difference) without violating policy.

### Versions

| Version | Released | Domains | Notable additions |
|---------|----------|---------|-------------------|
| τ-bench | 2024 | Airline, Retail | Original — pioneered the dual-control evaluation |
| τ²-bench | 2025 | + Telecom | Both agent *and* user have tools / state |
| **τ³-bench 1.0.0** | March 18, 2026 | + Banking Knowledge, Mock | Voice (full-duplex), knowledge retrieval, 75+ task fixes |

### Why it matters

SWE-bench / Terminal Bench score on pass-rate against a deterministic harness. τ-bench scores on **Pass^k** — the probability the agent succeeds on *k* independent attempts. That metric matters because customer-service agents fail differently each run; a 70% pass@1 with 30% Pass^4 is a different product than 70% pass@1 with 65% Pass^4. The original τ-bench paper ([arXiv 2406.12045](https://arxiv.org/abs/2406.12045)) reported GPT-4o at *Pass^8 < 25%* in the retail domain — i.e., even when single-run success is moderate, consistency across runs collapses fast. Sierra publishes the leaderboard and uses it as the basis for their own product claims.

For coding agents, τ-bench is the closest public proxy for "can the agent be left alone with a real user without supervision" — a question SWE-bench-style benchmarks structurally can't answer.

---

## Model-level leaderboards

Before you pick an agent benchmark, pick a model substrate. These rank *base LLMs*, not harnesses — they're how you choose what to put inside Claude Code, Cursor, or your own harness. Headlines below are as of June 2026; click through for live data.

### Chatbot Arena (LMArena / OpenLM.ai)

**Home:** [openlm.ai/chatbot-arena](https://openlm.ai/chatbot-arena/)

The canonical human-preference ranking — crowdsourced pairwise battles, Bradley-Terry-fit Elo ratings, 6M+ votes. Top three by Arena Elo: **Claude Fable 5 (1510), Claude Opus 4.8 Thinking (1506), GPT-5.5-high (1506)**. Specialized sub-leaderboards for coding, vision, and MMLU-Pro / ARC-AGI / AAII v3.

**What it does and doesn't tell you.** Elo ranks "what humans prefer to read" on freeform turns — not "what completes agentic tasks reliably." A model can dominate Chatbot Arena and still flunk τ-bench Pass^k. Use it as a coarse model-quality baseline, not as agent selection signal.

### Artificial Analysis

**Home:** [artificialanalysis.ai](https://artificialanalysis.ai/)

Multi-dimensional model ranking on three axes simultaneously: **composite Intelligence Index v4.1** (nine evals including GDPval-AA v2, coding, reasoning), **output speed** (tokens/sec), and **cost** ($/MTok). Also tracks a separate agentic-performance axis. The right place to look when picking a model on a cost/quality/speed Pareto curve — most leaderboards give you one axis at a time. Independent; updated continuously.

### ARC Prize / ARC-AGI

**Home:** [arcprize.org](https://arcprize.org/)

Nonprofit-run benchmark series founded by François Chollet. **ARC-AGI-1** (saturated by frontier models with test-time compute) → **ARC-AGI-2** → **ARC-AGI-3**, the latter explicitly billed as the "world's only unbeaten agentic-intelligence benchmark." The framing: abstract grid-puzzle tasks designed to be easy for humans, hard for pattern-matching. >$2M in prizes for 2026 across three competition tracks.

Less practical than SWE-bench / Terminal Bench for picking a coding agent, but the cleanest public signal for "is the model doing actual reasoning, or pattern-matching at scale?" Worth tracking if you're building agents whose tasks generalize beyond the training distribution.

---

## Other benchmarks worth knowing

The four above are the *production* benchmarks — what agent teams publish against. The rest of the public benchmark surface matters for niche capabilities (web research, GPU kernels, long-context memory), for research provenance (GAIA's three-level harness leaderboard), or for understanding the headline numbers labs cite.

| Benchmark | Domain | Notable | Link |
|---|---|---|---|
| **Arena.ai Agent Leaderboard** | Dynamic agent ranking | Arena Intelligence's live leaderboard scoring agents on tool reliability, task completion, steerability, bash command recovery, and tool hallucination across real-world tasks. **889K+ sessions across 28 models** tracked as of June 2026. Top three by net-improvement metric: Claude Fable 5 (High) +14.05%, Claude Opus 4.8 Thinking +8.85%, GPT-5.5 xHigh +8.13%. Closest analog to "agent Chatbot Arena" — measures live-traffic agentic behavior rather than offline benchmark pass rates | [arena.ai/leaderboard/agent](https://arena.ai/leaderboard/agent) |
| **BrowseComp** | Web research (OpenAI, Nov 2024) | 1,266 multi-hop browsing tasks where correct answers are *hard to find, easy to verify*. May 2026 headline numbers: GPT-5.5 90.1% · Gemini 3.1 Pro 85.9% · Opus 4.7 79.3% (a regression from 4.6's 83.7% — production tip: route web research to GPT-5.5) | [github.com/openai/simple-evals](https://github.com/openai/simple-evals) |
| **GAIA** | General assistants (Meta + HuggingFace + AutoGPT, ICLR 2024) | 466 real-world questions designed so humans hit 92% and GPT-4 hit 15%. Three difficulty levels; tests multi-tool use, web search, multimodal reasoning, code execution. Sonnet 4.5 leads at 74.6% as of May 2026 | [huggingface.co/spaces/gaia-benchmark](https://huggingface.co/spaces/gaia-benchmark/leaderboard) |
| **Princeton HAL** | Harness ablation leaderboard | "Holistic Agent Leaderboard" — fixes the model, varies the harness, publishes the score gap. The structural answer to *how much harness matters relative to model*. Covers GAIA, SWE-bench, AppWorld, MLE-bench, USACO, more | [hal.cs.princeton.edu](https://hal.cs.princeton.edu/) |
| **Cybench** | Cybersecurity / CTF (Berkeley + SLAC, 2024) | 40 professional CTF tasks across 4 difficulty levels. Tests offensive-security capability — relevant to "can the agent be trusted with shell access" and now standard in frontier-lab pre-deployment safety evals | [github.com/andyzorigin/cybench](https://github.com/andyzorigin/cybench) |
| **BFCL** | Tool / function calling (Berkeley) | The reference benchmark for *can-the-model-call-tools-correctly* — parallel, multiple, nested, irrelevant, and live multi-turn tool-use patterns. Available as an `inspect_evals` task | [gorilla.cs.berkeley.edu/leaderboard.html](https://gorilla.cs.berkeley.edu/leaderboard.html) |
| **KernelBench** | GPU kernel synthesis (Stanford, 2025) | 250 PyTorch operations the agent must rewrite as CUDA kernels, measured on correctness *and* speedup vs PyTorch's reference. The closest public proxy for "can the agent write *fast* code" | [github.com/ScalingIntelligence/KernelBench](https://github.com/ScalingIntelligence/KernelBench) |
| **WebArena** | Web agent (CMU, 2023) | Self-hosted dockerized web apps — Reddit-clone, GitLab-clone, e-commerce, CMS — that the agent must operate. The first stable controllable web-agent environment. Documented to overestimate by 5–33% per [arxiv 2507.02825](https://arxiv.org/abs/2507.02825); apply contamination caveats | [webarena.dev](https://webarena.dev/) |
| **LoCoMo** | Long-conversation memory (Snap, 2024) | 600+ conversations averaging ~9K tokens each, with questions about facts that appeared dozens of turns earlier. Letta MemFS hit 74% on this in April 2026 with GPT-4o-mini, beating bespoke memory-tool stacks — the reference number for the "filesystem-as-memory" thesis. See [Letta Code](approaches.md#letta-code) | [github.com/snap-research/locomo](https://github.com/snap-research/locomo) |
| **CORE** | Anthropic's harness-comparison benchmark | The internal benchmark behind the *78% Claude Code vs 42% Smolagents on the same Opus 4.5* headline. Not a published dataset; cited as the most-watched motivation for the harness-engineering thesis. See [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [Harness Engineering](harness-engineering.md) | [anthropic.com/engineering](https://www.anthropic.com/engineering) |

### Caveats

- **Saturation.** SWE-bench Verified went from 1.96% to 80%+ in two years. τ-bench's Pass^k was added precisely because single-run accuracy stopped being informative.
- **Overestimation.** [arxiv 2507.02825](https://arxiv.org/abs/2507.02825) documents 5–33% overestimation across 17 popular benchmarks (SWE-bench, KernelBench, WebArena named). Treat any "X model scored Y%" as joint with the harness, scaffold, retry budget, and system prompt.
- **Eval awareness.** Anthropic's [Mar 2026 paper on Opus 4.6 BrowseComp](https://www.anthropic.com/engineering/eval-awareness-browsecomp) shows models can detect when they're being evaluated and behave differently. Read before designing your own eval suite.
- **Infrastructure noise.** Anthropic's [Feb 2026 post](https://www.anthropic.com/engineering/infrastructure-noise) shows flaky sandboxes and network jitter alone can swing eval scores by several points.

---

## Choosing a benchmark

| If you care about… | Look at… |
|--------------------|----------|
| Bug-fix / feature-PR capability | SWE-bench Verified |
| End-to-end dev-environment competence | Terminal Bench 2.0 |
| Multimodal issue resolution (UI bugs, chart fixes) | SWE-bench Multimodal |
| Non-Python coverage | SWE-bench Multilingual |
| Long-horizon SWE work (Verified saturating) | SWE-bench Pro |
| Customer-facing reliability (Pass^k, policy adherence) | τ³-bench |
| Live-traffic agent behavior (tool reliability, steerability) | Arena.ai Agent Leaderboard |
| Safety + capability under one harness | Inspect AI + `inspect_evals` |
| Generalist multi-tool agent (web + multimodal + code) | GAIA |
| Web research / browsing | BrowseComp |
| Tool / function-calling fluency | BFCL |
| GPU kernel / performance-critical code | KernelBench |
| Long-conversation memory / "agent remembers" | LoCoMo |
| Web-app operation (Reddit / e-commerce / CMS simulants) | WebArena |
| Offensive-security capability | Cybench |
| Harness-vs-model ablation evidence | Princeton HAL |
| Commercial harness quality | Both leaderboards — harness is the differentiator |
| **Picking your base model** | **Chatbot Arena (human preference), Artificial Analysis (cost/speed/intelligence Pareto), ARC Prize (reasoning generalization)** |

Neither benchmark is sufficient on its own. A team shipping autonomous PRs internally should track:

1. **SWE-bench Verified** — external apples-to-apples comparison with every other agent.
2. **Terminal Bench** — a sanity check that the agent can survive real ops tasks.
3. **Internal production metrics** — PRs merged, CI pass rate, revert rate. This is the signal Stripe optimizes; SWE-bench is a proxy, production is the truth.

---

## Benchmark-adjacent reading

- [Approaches](approaches.md) — Agents and their published benchmark scores
- [Patterns § Harness engineering](patterns.md) — Why harness-is-the-model for benchmark performance
- [Organizations](organizations.md) — How teams measure agent value beyond benchmarks
