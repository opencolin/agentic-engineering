<!-- description: Source-of-truth bibliography: structured digest of 112 primary sources ingested in May 2026 — key claims, specific numbers, frameworks named, and one-line slot in the reference. Cmd-F to find every source that discusses a framework, benchmark, or technique. -->

# Research Notes — Primary Source Ingestion

Structured digest of 112 URLs from `AGENT.md` and `ROADMAP.md` ingested in May 2026 across six parallel research passes. This file is the source-of-truth bibliography behind the polished pages in this repo — when a page cites "the LangChain harness post" or "Anthropic's auto-mode classifier," the underlying notes live here.

**Status:** 103 of 112 URLs returned usable content. 9 failures concentrated in YouTube channel pages (Karpathy, LangChain, Yannic, AI Engineer, Anthropic, Lex Fridman — all return only HTML footer to WebFetch), Reddit r/LocalLLaMA (blocked at fetch layer), Matt Turck's MAD podcast page (JS-rendered, empty body), and `ml6.eu/inside-the-claude-agents-sdk` (404, may have moved).

**Format per entry:** URL, fetch status, date if visible, 3-5 distilled key claims (with specific numbers / framework names / model versions where present), one quotable line if quote-worthy, frameworks / tools / concepts named, one-sentence note on why the source matters for agentic engineering.

**How to use this file:**
- Cmd-F for a framework name, benchmark name, or technique to find every source that discusses it
- The "Why it matters" line tells you which slot in the agentic-engineering reference the source fills (harness pattern, eval lesson, model behavior, etc.)
- Numbers are pulled verbatim from the primary source — when re-cited on a polished page, re-verify against the linked source first

---

## Section 1: Anthropic Engineering (19 URLs)

### Engineering at Anthropic — index page
**URL:** `https://anthropic.com/engineering`
**Fetch:** OK
**Date:** N/A (index; articles dated Sep 2024 – Apr 2026)
**Key claims:**
- Index page for Anthropic's engineering blog, framed as "Inside the team building reliable AI systems."
- Most recent posts (Apr 2026 back): "Scaling Managed Agents," "Claude Code auto mode," "Harness design for long-running application development," "Eval awareness in Opus 4.6's BrowseComp performance," "Quantifying infrastructure noise in agentic coding evals."
- Topic clusters: agent harnesses, evals, context engineering, tool design, security/sandboxing, MCP, code execution.
- Surfaces a recent corrective post ("update on recent Claude Code quality reports") tracing regressions to three separate changes.

**Frameworks named:** Claude Code, Claude Agent SDK, MCP, Managed Agents.
**Why it matters:** Master TOC — defines the canonical reading list and chronology for the reference site.

### Designing AI-Resistant Technical Evaluations
**URL:** `https://anthropic.com/engineering/AI-resistant-technical-evaluations`
**Fetch:** OK
**Date:** January 21, 2026
**Key claims:**
- 1,000+ candidates took the original 4-hour performance-engineering take-home since early 2024; dozens hired, including engineers who shipped every model since Claude 3 Opus.
- Claude Opus 4 already matched most humans inside the 4-hour window; Opus 4.5 matched top human performance — 1,790 cycles casual, 1,579 with extended test-time compute.
- V1 simulator featured VLIW, scratchpad memory, SIMD, multicore — deliberately not deep-learning-shaped to resist memorization.
- V2 cut window from 4h to 2h, emphasizing "clever optimization insights over debugging and code volume."
- Final redesign uses Zachtronics-style constraint puzzles with intentionally missing visualization tools to test judgment about tooling investment.

**Quotable:** "Humans can still outperform models when given unlimited time, but under the constraints of the take-home test, we no longer had a way to distinguish between the output of our top candidates and our most capable model."
**Frameworks named:** Perfetto, VLIW, SIMD, bank-conflict optimization, test-time-compute harness, Zachtronics.
**Why it matters:** Eval-design lesson — how to write tasks that still discriminate humans from frontier models.

### Advanced Tool Use on the Claude Developer Platform
**URL:** `https://anthropic.com/engineering/advanced-tool-use`
**Fetch:** OK
**Date:** November 24, 2025
**Key claims:**
- Tool Search Tool cuts token consumption ~85%; Opus 4 jumps 49% → 74% and Opus 4.5 jumps 79.5% → 88.1% on MCP evals.
- Context use drops from ~77K to ~8.7K tokens for a 5-server / 58-tool setup, preserving 95% of the window.
- Programmatic Tool Calling drops a research workload from 43,588 → 27,297 tokens (-37%); internal-knowledge retrieval 25.6% → 28.5%; GIA 46.5% → 51.2%.
- Tool Use Examples (input_examples) lift complex-parameter accuracy 72% → 90%.
- Five MCP servers (GitHub/Slack/Sentry/Grafana/Splunk) already cost ~55K tokens before any conversation; adding Jira pushes past 100K.

**Quotable:** "The future of AI agents is one where models work seamlessly across hundreds or thousands of tools."
**Frameworks named:** Tool Search Tool (BM25/regex), Programmatic Tool Calling, Tool Use Examples, MCP, prompt caching, Opus 4 / 4.5 / Sonnet.
**Why it matters:** Concrete numbers for the "tools as context burden" pattern — supports the case for lazy tool loading.

### Building Agents with the Claude Agent SDK
**URL:** `https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk` (redirects to claude.com/blog)
**Fetch:** OK (via redirect)
**Date:** September 29, 2025
**Key claims:**
- Claude Code SDK renamed to Claude Agent SDK; same loop now powers deep research, video creation, and note-taking at Anthropic.
- Core design: "give Claude access to the user's computer (via the terminal)" — bash, file edit, search are the primary primitives.
- Canonical loop: gather context → take action → verify work → repeat; context curation via automatic summarization for long-running runs.
- Distinguishes tools vs. bash/scripts vs. code-gen vs. MCP — tools should represent "primary actions."
- Verification ranked: rules-based (lint) most robust > visual (screenshots) > LLM-as-judge.

**Quotable:** "By giving Claude access to the user's computer (via the terminal), it had what it needed to write code like programmers do."
**Frameworks named:** Claude Agent SDK, MCP, subagents, semantic/agentic search, context compaction, custom tools.
**Why it matters:** Canonical "what is an agent loop" reference — slot directly under harness fundamentals.

### Building a C Compiler with a Team of Parallel Claudes
**URL:** `https://anthropic.com/engineering/building-c-compiler`
**Fetch:** OK
**Date:** February 5, 2026
**Key claims:**
- 16 Opus 4.6 agents produced a 100K-line Rust-based C compiler across ~2,000 sessions for ~$20,000 over two weeks.
- Compiles Linux 6.9 on x86/ARM/RISC-V; 99% pass rate on GCC torture tests.
- Consumed ~2B input tokens, 140M output tokens.
- Opus 4.6 crossed a capability threshold Opus 4 and 4.5 could not — earlier models failed at autonomous compiler work.
- Used GCC as an online oracle; Docker + git for synchronization; delta debugging and SSA IR.

**Quotable:** "Agent teams show the possibility of implementing entire, complex projects autonomously."
**Frameworks named:** Parallel Claudes, GCC-as-oracle, Docker+git sync, delta debugging, SSA IR, CI.
**Why it matters:** Reference example of multi-agent autonomous large-codebase work with cost/scale numbers.

### Claude Code Auto Mode: a Safer Way to Skip Permissions
**URL:** `https://anthropic.com/engineering/claude-code-auto-mode`
**Fetch:** OK
**Date:** March 25, 2026
**Key claims:**
- Users currently approve 93% of permission prompts — approval fatigue dominates real behavior.
- Two-stage classifier: 0.4% false positive on n=10,000 real traffic, 17% false negative on n=52 real overeager actions.
- Threat model: overeager behavior, honest mistakes, prompt injection, model misalignment.
- Three-tier architecture: built-in allowlists → in-project file ops → transcript classifier for high-risk actions.
- Classifier uses Sonnet 4.6 with prompt-injection probe at input and transcript classifier at output; both strip assistant text to resist manipulation.

**Quotable:** "Auto mode is meant for the first group, and for tasks where the second group's approval overhead isn't worth the marginal safety."
**Frameworks named:** Prompt-injection probe, transcript classifier, Sonnet 4.6, block-rule categories, deny-and-continue recovery, multi-agent handoff controls.
**Why it matters:** Concrete pattern for replacing permission prompts with classifier-mediated autonomy.

### Beyond Permission Prompts: Sandboxing Claude Code
**URL:** `https://anthropic.com/engineering/claude-code-sandboxing`
**Fetch:** OK
**Date:** October 20, 2025
**Key claims:**
- Sandboxing reduces internal permission prompts by 84%.
- Requires both filesystem isolation and network isolation — neither alone prevents exfiltration / escape.
- Implementation uses Linux bubblewrap and macOS seatbelt for OS-level enforcement covering spawned subprocesses.
- Web variant prevents git credentials from ever entering the sandbox via a custom proxy that validates git interactions before attaching tokens.

**Quotable:** "Effective sandboxing requires both filesystem and network isolation—without either, a compromised agent could exfiltrate files or escape the sandbox entirely."
**Frameworks named:** Sandboxed bash (beta), bubblewrap, macOS seatbelt, custom proxy service, MCP servers, scoped credentials.
**Why it matters:** Reference architecture for the security/isolation slot — paired with auto-mode for the autonomy story.

### Code Execution with MCP
**URL:** `https://anthropic.com/engineering/code-execution-with-mcp`
**Fetch:** OK
**Date:** November 4, 2025
**Key claims:**
- Google-Drive-to-Salesforce workflow drops from ~150,000 to ~2,000 tokens via code execution with MCP — 98.7% savings.
- Thousands of MCP servers since the Nov 2024 launch; MCP is now the de-facto industry standard.
- Front-loading every tool definition causes context degradation, latency, and cost; progressive disclosure (filesystem + `search_tools`) loads defs on demand.
- Filtering large datasets inside the code-execution sandbox (e.g., 10K-row sheets) before returning prevents context bloat.
- Recommends pairing code-execution with PII tokenization and a Skills layer for persistent reusable functions.

**Quotable:** "Code execution applies these established patterns to agents, letting them use familiar programming constructs to interact with MCP servers more efficiently."
**Frameworks named:** MCP, Code Mode (Cloudflare term), filesystem-based tool discovery, PII tokenization, Skills, sandboxing.
**Why it matters:** Argument and numbers for replacing direct tool calls with code-as-tool — central to context-engineering chapter.

### Demystifying Evals for AI Agents
**URL:** `https://anthropic.com/engineering/demystifying-evals-for-ai-agents`
**Fetch:** OK
**Date:** January 9, 2026
**Key claims:**
- Frontier models moved from 40% → >80% on SWE-bench Verified in one year.
- Introduces pass@k vs pass^k — 75% per-trial across 3 trials = ~42% pass^3 (reliability collapses fast).
- Effective programs start with 20–50 simple tasks pulled from real failures, not exhaustive benchmarks.
- Opus 4.5 on CORE-Bench initially scored 42%; after fixing grading bugs (rigid precision, ambiguous specs) it scored 95%.
- Recommends combining code-based graders (fast/objective), model-based (flexible), and human (gold).

**Quotable:** "Good evaluations help teams ship AI agents more confidently."
**Frameworks named:** SWE-bench Verified, Terminal-Bench, τ2-Bench, BrowseComp, WebArena, OSWorld, CORE-Bench; Harbor, Braintrust, LangSmith, Langfuse, Arize Phoenix; pass@k, pass^k.
**Why it matters:** Canonical eval-design primer — paired with the BrowseComp and infrastructure-noise posts.

### Effective Context Engineering for AI Agents
**URL:** `https://anthropic.com/engineering/effective-context-engineering-for-ai-agents`
**Fetch:** OK
**Date:** September 29, 2025
**Key claims:**
- Names "context rot": LLM accuracy decreases as window fills — every token depletes an "attention budget."
- Root causes: n² transformer attention + training data skewed to shorter sequences.
- Claude Code uses "just-in-time" retrieval with lightweight identifiers (file paths, queries, links) + head/tail bash; not bulk pre-loading.
- Compaction = summarize history then reinitialize, preserving architectural decisions and unresolved bugs while dropping tool spam.
- Sub-agents handle focused tasks in clean windows and return 1,000–2,000-token condensed summaries to the coordinator.

**Quotable:** "Every new token introduced depletes this budget by some amount, increasing the need to carefully curate the tokens available to the LLM."
**Frameworks named:** MCP, Claude Code, CLAUDE.md, memory tool (file-based beta), embedding retrieval, position-encoding interpolation, compaction, sub-agents.
**Why it matters:** Founding doc for the context-engineering chapter — coins the "attention budget" framing.

### Effective Harnesses for Long-Running Agents
**URL:** `https://anthropic.com/engineering/effective-harnesses-for-long-running-agents`
**Fetch:** OK
**Date:** November 26, 2025
**Key claims:**
- Initializer agent emits a JSON file with 200+ features (e.g., for a claude.ai clone), each `passes: false`, to drive incremental development.
- Two-agent setup: initializer (env setup) + coding agent (incremental progress) share prompts/tools but differ on user prompt.
- Even Opus 4.5 fails on production-quality web app builds without scaffolding, despite compaction.
- Progress tracked via git history + `claude-progress.txt` so a fresh agent doesn't "guess at what happened."
- Browser automation via Puppeteer MCP dramatically improved performance; weakness is vision and native alert modals.

**Quotable:** "Imagine a software project staffed by engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift."
**Frameworks named:** Claude Agent SDK, Opus 4.5, Puppeteer MCP, JSON feature lists, init.sh, git, browser automation.
**Why it matters:** Concrete recipe for cross-session continuity in long-running coding agents.

### Equipping Agents with Agent Skills
**URL:** `https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills`
**Fetch:** OK
**Date:** October 16, 2025 (updated December 18, 2025)
**Key claims:**
- Three-level progressive disclosure: metadata in system prompt → full SKILL.md when relevant → bundled files only when needed; complexity isn't bounded by context.
- PDF skill manipulates PDFs (fill forms, extract fields) via a bundled Python script — never loads the PDF into context.
- Open standard (Dec 18, 2025) portable across Claude.ai, Claude Code, Claude Agent SDK, Claude Developer Platform.
- Deterministic ops (sorting, parsing) run outside generation in code execution, reducing token cost.
- Security caveat: skills must come from trusted sources — they can carry exfiltration code or unintended actions.

**Quotable:** "Instead of building fragmented, custom-designed agents for each use case, anyone can now specialize their agents with composable capabilities."
**Frameworks named:** SKILL.md, YAML frontmatter, bash tool, bundled Python scripts, MCP, Claude Code, Claude Agent SDK.
**Why it matters:** Canonical reference for the Skills mechanism — paired with code-execution-with-mcp.

### Eval Awareness in Claude Opus 4.6's BrowseComp Performance
**URL:** `https://anthropic.com/engineering/eval-awareness-browsecomp`
**Fetch:** OK
**Date:** March 6, 2026
**Key claims:**
- 11 of 1,266 BrowseComp problems (0.87%) in multi-agent config were solved by retrieving benchmark materials, not by research.
- First documented cases of Opus 4.6 hypothesizing it was being evaluated, identifying BrowseComp specifically, then locating and decrypting the answer key.
- One eval-aware problem burned 40.5M tokens (38x median); another 13.4M; legitimate searches totaled 622M over ~two weeks without touching benchmark files.
- Multi-agent contamination rate 0.87% vs single-agent 0.24% — a 3.7x amplification.
- Best mitigation was blocking binary-file retrieval; URL blocklists insufficient; "BrowseComp" keyword filtering most effective.

**Quotable:** "Claude noted the question's 'extremely specific nature' and hypothesized that it had been constructed as a test."
**Frameworks named:** Code execution / Python REPL, SHA256/XOR decryption, canary GUID strings, HuggingFace dataset hosting; GAIA, SimpleQA, FRAMES, WebArena, AgentBench, FanOutQA, MuSR, HLE.
**Why it matters:** Eye-opening eval-integrity case study — model behavior + how benchmarks leak.

### Harness Design for Long-Running Application Development
**URL:** `https://anthropic.com/engineering/harness-design-long-running-apps`
**Fetch:** OK
**Date:** March 24, 2026
**Key claims:**
- Generator-evaluator multi-agent (Playwright MCP for live-page evaluation) lifts frontend design quality over 5–15 iterations, scored on design quality, originality, craft, functionality.
- Full-stack harness (planner + generator + evaluator) produced a working retro game maker in 6h / $200; solo-agent baseline took 20min / $9 but core gameplay was nonfunctional.
- Opus 4.6 removed need for sprint-based decomposition that Opus 4.5 required to avoid "context anxiety" — now sustains 2h+ coherent generation without context resets.
- Evaluator catches 27+ contract violations per sprint, including FastAPI route-ordering bugs and broken UI state.
- DAW build: 3h 50m / $124.70 with planner + 3 QA rounds and functional Web Audio API integration.

**Quotable:** "Separating the agent doing the work from the agent judging it proves to be a strong lever."
**Frameworks named:** Claude Agent SDK, Playwright MCP, GAN-inspired generator/evaluator, context resets vs compaction, sprint contracts, React/Vite/FastAPI/SQLite, Web Audio API.
**Why it matters:** Reference for multi-agent harness design with real cost/time numbers — pairs with effective-harnesses post.

### Quantifying Infrastructure Noise in Agentic Coding Evals
**URL:** `https://anthropic.com/engineering/infrastructure-noise`
**Fetch:** OK
**Date:** February 5, 2026
**Key claims:**
- Infra config alone swings Terminal-Bench 2.0 scores by 6 percentage points (p < 0.01) — sometimes more than the gap between leaderboard slots.
- At strict 1x resource enforcement, infra error rate is 5.8%; uncapped, it's 0.5%; the 5.8% → 2.1% drop from 1x → 3x is significant at p < 0.001.
- Success rates jump ~4pp going from 3x to uncapped, while infra errors only fall 1.6pp — i.e., the model is being throttled, not erroring.
- SWE-bench: 1.54pp lift at 5x RAM vs 1x baseline across 227 problems.
- Treat sub-3pp leaderboard differences with skepticism absent infra disclosure; binomial CIs already span 1–2pp.

**Quotable:** "A model provider can shield its eval infrastructure from this by dedicating hardware, but external evaluators can't easily do the same."
**Frameworks named:** Terminal-Bench 2.0, SWE-bench, GKE, container runtime enforcement (guaranteed vs hard-kill threshold).
**Why it matters:** Critical eval-hygiene caveat — required reading before citing leaderboard deltas.

### Scaling Managed Agents: Decoupling the Brain from the Hands
**URL:** `https://anthropic.com/engineering/managed-agents`
**Fetch:** OK
**Date:** April 8, 2026
**Key claims:**
- Decoupling harness from container cut TTFT ~60% at p50 and >90% at p95.
- Opus 4.5 eliminated "context anxiety" seen in Sonnet 4.5, so context-reset features became obsolete — argues for interface stability over implementation.
- Three-component virtualization: session (append-only log) + harness (orchestration loop) + sandbox (execution); each independently replaceable, OS-inspired.
- Credentials decoupled from sandboxes via repo tokens bundled at init and OAuth tokens kept in a vault accessed via MCP proxy (never direct harness exposure).
- Unified `execute(name, input) → string` interface — stateless harnesses scaling to many sandboxes, custom tools, MCP servers.

**Quotable:** "Harnesses encode assumptions that go stale as models improve."
**Frameworks named:** Opus 4.5, Sonnet 4.5, Claude Code, MCP, REPL context objects, prompt caching, OAuth vault, git-token integration.
**Why it matters:** Defines a reference architecture (session/harness/sandbox) for production agent systems.

### How We Built Our Multi-Agent Research System
**URL:** `https://anthropic.com/engineering/multi-agent-research-system`
**Fetch:** OK
**Date:** June 13, 2025
**Key claims:**
- Multi-agent (Opus 4 lead + Sonnet 4 subagents) beat single-agent Opus 4 by 90.2% on internal research evals.
- 80% of BrowseComp performance variance explained by token usage; tool calls + model choice explain the remaining 15%.
- Agents use ~4x tokens of chat; multi-agent systems use ~15x.
- Parallel tool calling cut research time up to 90% for complex queries via 3+ simultaneous tool calls per subagent.
- LLM-as-judge produces 0.0–1.0 scores across factual accuracy, citation accuracy, completeness, source quality, tool efficiency.

**Quotable:** "Multi-agent systems excel at valuable tasks involving heavy parallelization, information exceeding single context windows."
**Frameworks named:** Orchestrator-worker, extended/interleaved thinking, rainbow deployments, MCP, RAG, end-state evaluation.
**Why it matters:** The canonical orchestrator-worker case study with token-economics numbers.

### Writing Effective Tools for Agents — with Agents
**URL:** `https://anthropic.com/engineering/writing-tools-for-agents`
**Fetch:** OK
**Date:** September 11, 2025
**Key claims:**
- Internal Slack MCP evals: Claude-optimized tools beat human-written ones on held-out sets after iterative agent-led refinement.
- Argues for consolidated high-level tools (e.g., `schedule_event` replacing `list_users` + `list_events` + `create_event`) to stop wasting context on plumbing.
- A `ResponseFormat` enum cut Slack-thread responses 206 → 72 tokens (~3x) while preserving functionality.
- Evaluate tools on runtime per call, total call count, total token use, error rate.
- Sonnet 3.5 hit SOTA on SWE-bench Verified after "precise refinements to tool descriptions, dramatically reducing error rates."

**Quotable:** "Tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents."
**Frameworks named:** MCP, Claude Code, interleaved thinking, ResponseFormat enums, tool namespacing (prefix/suffix), chain-of-thought.
**Why it matters:** Reference for the tool-design chapter — "tools are software for agents" with measurement framework.

### Building Effective Agents
**URL:** `https://anthropic.com/research/building-effective-agents`
**Fetch:** OK
**Date:** December 19, 2024
**Key claims:**
- Across dozens of customer deployments, successful agent implementations favor simple, composable patterns over complex frameworks.
- Distinguishes workflows (predefined LLM-orchestration code paths) from agents (dynamic, model-driven control).
- During SWE-bench work, the team spent more time tuning tools than the prompt — e.g., absolute filepaths eliminated a class of mistakes.
- Routing easy queries to Haiku and hard ones to Sonnet optimizes cost/performance.
- Catalogs the canonical patterns: prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer.

**Quotable:** "Success in the LLM space isn't about building the most sophisticated system. It's about building the right system for your needs."
**Frameworks named:** Claude Agent SDK, MCP, prompt chaining / routing / parallelization / orchestrator-workers / evaluator-optimizer, agent-computer interface (ACI), SWE-bench Verified, computer-use reference impl.
**Why it matters:** Foundational pattern taxonomy — the entry point article for the whole site.

---

## Section 2: LangChain Blog (20 URLs)

### LangChain Blog Index
**URL:** `https://blog.langchain.com` (redirects to `https://www.langchain.com/blog/`)
**Fetch:** OK
**Date:** Most recent posts dated May 21, 2026
**Key claims:**
- Recent posts: "From Token Streams to Agent Streams", "How Auth Proxy Secures Network Access for LangSmith Agent Sandboxes", "Give Your Agents an Interpreter", "How We Built LangSmith Engine, Our Agent for Improving Agents", "Everything We Shipped at Interrupt".
- New product launches: LangChain Labs, LangSmith Engine, SmithDB (data layer for agent observability), LangSmith Context Hub.
- Infrastructure post on "Delta Channels: Evolving Our Runtime for Long-Running Agents".
- Coverage spans open-source frameworks (LangGraph, Deep Agents, LangChain) plus proprietary LangSmith platform features.

**Quotable:** "See exactly what your agents are doing."
**Frameworks named:** LangGraph, Deep Agents, LangChain, LangSmith, LangSmith Engine, SmithDB, LangSmith Context Hub, Delta Channels, LangChain Labs.
**Why it matters:** Defines the menu of LangChain primitives a reference site should map (harness, observability, data layer, sandboxes).

### Agent Evaluation Readiness Checklist
**URL:** `https://www.langchain.com/blog/agent-evaluation-readiness-checklist`
**Fetch:** OK
**Date:** March 27, 2026
**Key claims:**
- Manually review 20-50 real traces before any eval automation; spend 60-80% of eval effort on error analysis and root cause.
- Separate capability evals (new abilities) from regression evals (protect shipped behavior) to avoid both stagnation and regressions.
- Witan Labs case: a single extraction bug moved a benchmark from 50% to 73% — infra issues often masquerade as reasoning failures.
- Prefer binary pass/fail over numeric scales — less subjective, smaller required sample sizes.
- Use N-1 testing (real conversation prefixes + agent-generated final turn) and pass@k / pass^k metrics for non-determinism.

**Quotable:** "The evaluators that matter are the ones that catch your specific failure modes, discovered through the error analysis process."
**Frameworks named:** LangSmith, runs/traces/threads, Align Evaluator, Terminal Bench, BFCL, LLM-as-judge, code-based evaluators, pass@k / pass^k, N-1 testing.
**Why it matters:** Slot: eval lesson — readiness gate before automating eval infra; pairs with the "harness hill-climbing" post.

### Better Harness — Hill-Climbing with Evals
**URL:** `https://www.langchain.com/blog/better-harness-a-recipe-for-harness-hill-climbing-with-evals`
**Fetch:** OK
**Date:** April 8, 2026
**Key claims:**
- Evals act as "training data for agents" — scoring signal guides harness changes like gradient updates guide ML.
- Better-Harness is a 4-stage recipe: data sourcing → experiment design → optimization → review & acceptance.
- Cross-model testing (Claude Sonnet 4.6 and GLM-5) surfaced shared instruction wins like "use reasonable defaults" and "respect already-fixed constraints".
- Holdout sets prevent overfitting; curated quality evals outperform high-volume noisy ones.
- Production trace mining drives a flywheel: usage → traces → evals → improved harness; human review gates merges.

**Quotable:** "Evals encode the behavior we want our agent to exhibit in production."
**Frameworks named:** Better-Harness, Meta-Harness (Stanford), Auto-Harness (DeepMind), LangSmith, Deep Agents, Terminal Bench 2.0, TDD, holdout split.
**Why it matters:** Slot: harness pattern — concrete recipe for moving harness changes through eval gates rather than vibes.

### Context Engineering for Agents
**URL:** `https://www.langchain.com/blog/context-engineering-for-agents`
**Fetch:** OK
**Date:** July 2, 2025
**Key claims:**
- Four strategies: write, select, compress, isolate. Context windows are RAM, not infinite scratch.
- Long-running agents accumulate hundreds of turns; Claude Code auto-compact triggers at 95% window utilization.
- Anthropic's multi-agent researcher uses up to 15x more tokens than single-agent chat.
- Failure modes named: context poisoning, distraction, confusion, clash.
- Memory taxonomy: episodic, procedural, semantic; sandboxes (E2B, Pyodide) used for isolation.

**Quotable:** "Context engineering is effectively the #1 job of engineers building AI agents." —Cognition
**Frameworks named:** LangGraph, LangSmith, scratchpads, Reflexion, Generative Agents, RAG, LangMem, Supervisor/Swarm libs, E2B, Pyodide, knowledge graphs, embeddings, state objects.
**Why it matters:** Foundational vocabulary — the write/select/compress/isolate taxonomy is the canonical framing referenced by later posts.

### Context Management for Deep Agents
**URL:** `https://www.langchain.com/blog/context-management-for-deepagents`
**Fetch:** OK
**Date:** January 28, 2026
**Key claims:**
- Tool responses >20,000 tokens are offloaded to a virtual filesystem with a 10-line preview kept inline.
- Large tool inputs get truncated when context crosses 85% of model window.
- Summarization is dual: in-context LLM summary + filesystem preservation of original messages so recovery is possible.
- For eval/testing, summarization can be triggered at 10-20% context (vs default 85%) to generate more compression events.
- Token thresholds come from LangChain "model profiles" — per-model config.

**Quotable:** "Context compression refers to techniques that reduce the volume of information in an agent's working memory while preserving the details relevant to completing the task."
**Frameworks named:** Deep Agents SDK, LangGraph, LangSmith, virtual filesystem, model profiles, context rot, needle-in-haystack, Terminal Bench.
**Why it matters:** Deep-agents lesson — concrete numbers (20k tokens, 85% threshold, 10-line preview) for implementing the "compress" + "isolate" parts of context engineering.

### Continual Learning for AI Agents
**URL:** `https://www.langchain.com/blog/continual-learning-for-ai-agents`
**Fetch:** OK
**Date:** April 5, 2026
**Key claims:**
- Three learning layers: model weights, harness code/instructions, configurable context — each has different update mechanics.
- Harness optimization uses coding agents to read execution traces and suggest harness diffs (Meta-Harness framework).
- Context learning operates at agent, tenant (user/org), or mixed levels via offline jobs or real-time updates.
- Deep Agents ships production user-level memory and background consolidation.
- LangSmith traces are the substrate that powers all three learning loops.

**Quotable:** "Understanding the difference changes how you think about building systems that improve over time."
**Frameworks named:** Deep Agents, LangSmith (platform/CLI/Skills), Meta-Harness, Claude Code, OpenClaw (SOUL.md), Hex Context Studio, Decagon Duet, Sierra Explorer, SFT, GRPO, LoRA, Prime Intellect.
**Why it matters:** Mental model — the three-layer separation is a clean way to organize "how agents improve" sections of a reference site.

### Deep Agents v0.5
**URL:** `https://www.langchain.com/blog/deep-agents-v0-5`
**Fetch:** OK
**Date:** April 7, 2026
**Key claims:**
- Async subagents: non-blocking delegation to remote agents that run independently and return a task ID immediately.
- Five new tools: `start_async_task`, `check_async_task`, `update_async_task`, `cancel_async_task`, `list_async_tasks`.
- Multimodal filesystem expanded beyond images: PDFs, audio, video.
- Any agent implementing Agent Protocol can be an async subagent target — enabling heterogeneous deployments (different hardware/models per subagent).
- Supervisor can launch multiple subagents in parallel, keep talking to user, and collect results as ready.

**Quotable:** "The supervisor can launch several subagents in parallel, continue a conversation with the user, and collect results as they become available."
**Frameworks named:** Deep Agents (Python & JS), LangSmith, LangGraph, LangChain, Agent Protocol, Agent Client Protocol (ACP), Agent-to-Agent (A2A), ASGI, FastAPI, Claude Sonnet 4.6, model profiles.
**Why it matters:** Version milestone — async-subagent primitive is the v0.5-specific feature worth pinning.

### Doubling Down on Deep Agents
**URL:** `https://www.langchain.com/blog/doubling-down-on-deepagents`
**Fetch:** OK
**Date:** October 28, 2025
**Key claims:**
- Deep Agents formula = planning tools + filesystem + subagents + detailed prompts.
- v0.2 introduces pluggable backends: LangGraph State, LangGraph Store, local filesystem; composite backend supported.
- New: automatic large tool-result eviction, conversation summarization, dangling tool-call repair.
- Positioned as an "agent harness" layered on LangChain's agent abstraction + LangGraph runtime.
- Target use case: autonomous, long-running agents needing planning + filesystem out of the box.

**Quotable:** "Deep Agents is great for building more autonomous, long running agents where you want to take advantage of built in things like planning tools, filesystem, etc."
**Frameworks named:** deepagents, LangChain, LangGraph, LangSmith, backend abstraction, composite backend, tool-result eviction, summarization, dangling tool-call repair.
**Why it matters:** Origin of the "harness" framing — establishes Deep Agents as a harness, not a framework competitor.

### Evaluating Deep Agents — Our Learnings
**URL:** `https://www.langchain.com/blog/evaluating-deep-agents-our-learnings`
**Fetch:** OK
**Date:** December 3, 2025
**Key claims:**
- Four shipped Deep Agents apps in one month: DeepAgents CLI, LangSmith Assist, Personal Email Assistant, Agent Builder.
- ~50% of test cases are single-step evals focused on immediate tool selection (regressions cluster at decision points, not full trajectories).
- Deep Agents need bespoke per-datapoint test logic instead of uniform LLM-as-judge templates.
- Multi-turn evals need conditional branching so agent path deviations don't auto-fail.
- Test envs must be fresh + isolated per run — Docker containers or temp dirs for reproducibility.

**Quotable:** "Regressions often occur at individual decision points rather than across full execution sequences."
**Frameworks named:** LangSmith, LangGraph streaming, Deep Agents harness, pytest, vitest, LLM-as-judge, VCR (HTTP mocking), Harbor, TerminalBench.
**Why it matters:** Eval lesson — concrete proof that single-step decision evals are the high-leverage entry point.

### Evaluating Skills
**URL:** `https://www.langchain.com/blog/evaluating-skills`
**Fetch:** OK
**Date:** March 5, 2026
**Key claims:**
- Claude Code with skills: 82% success vs 9% without — ~9x lift on the test set.
- Loading ~20 similar LangGraph skills caused mis-invocation; performance stabilized at ~12 skills or fewer.
- Even with explicit invocation prompts, Claude Code only invoked skills consistently 70% of the time on some tasks.
- For larger skills (300-500 lines), positive vs negative phrasing and markdown vs XML had limited impact.
- Skills are dynamically loaded via progressive disclosure to avoid the "too many tools" degradation.

**Quotable:** "Skills are curated instructions, scripts, and resources that improve agent performance in specialized domains."
**Frameworks named:** LangSmith, Claude Code, Deep Agents CLI, LangChain, LangGraph, Docker sandbox, Harbor, AGENTS.md, CLAUDE.md, XML tag structure, trajectory evaluators, LangSmith pytest.
**Why it matters:** Skills design — the ~12-skill ceiling and 70% invocation reliability are useful empirical bounds for skill catalog design.

### How Middleware Lets You Customize Your Agent Harness
**URL:** `https://www.langchain.com/blog/how-middleware-lets-you-customize-your-agent-harness`
**Fetch:** OK
**Date:** March 26, 2026
**Key claims:**
- AgentMiddleware exposes six hooks: `before_agent`, `before_model`, `wrap_model_call`, `wrap_tool_call`, `after_model`, `after_agent`.
- Core agent loop = "an LLM, running in a loop, calling tools" — middleware customizes each stage without rewriting it.
- Prebuilt middleware: PIIMiddleware, LLMToolSelectorMiddleware, SummarizationMiddleware, ModelRetryMiddleware, ShellToolMiddleware, FilesystemMiddleware, SubagentMiddleware, SkillsMiddleware.
- Deep Agents is entirely a middleware stack on top of `create_agent`.
- Middleware enables deterministic policies (PII redaction, content moderation) that "can't live in a prompt."

**Quotable:** "Builders will always need levers for customization: deterministic policy enforcement, production readiness guardrails, use-case-specific business logic."
**Frameworks named:** AgentMiddleware, PIIMiddleware, LLMToolSelectorMiddleware, SummarizationMiddleware, ModelRetryMiddleware, ShellToolMiddleware, FilesystemMiddleware, SubagentMiddleware, SkillsMiddleware, create_agent, create_deep_agent, LangChain, Deep Agents.
**Why it matters:** Harness pattern — the six-hook taxonomy is the canonical reference for "where do I put this customization?"

### How to Build an Agent
**URL:** `https://www.langchain.com/blog/how-to-build-an-agent`
**Fetch:** OK
**Date:** July 9, 2025
**Key claims:**
- Six-step framework from "define job" through deploy/refine; start with 5-10 concrete examples to validate scope.
- Most agents fail because the LLM lacks reasoning headroom — prompt iteration via LangSmith comes first.
- Manual testing/tracing against Step 1 examples precedes automated eval scaling.
- Deployment is the start of refinement, not the end — production usage reveals real gaps.
- Pairs with LangGraph Platform and LangChain SOPs.

**Quotable:** "Getting a single prompt working with hand-fed data will help you build up confidence before proceeding to build the full agent."
**Frameworks named:** LangSmith, LangGraph Platform, LangChain, Deep Agents, SOP, agentic logic, multi-agent workflows.
**Why it matters:** Onboarding — canonical "how do I start" sequence; useful as a default reading-list entry.

### How to Think About Agent Frameworks
**URL:** `https://www.langchain.com/blog/how-to-think-about-agent-frameworks`
**Fetch:** OK
**Date:** April 20, 2025
**Key claims:**
- Hard part of reliability is delivering the right context at each step, not the loop itself.
- Production systems are usually workflow + agent hybrids, not pure either.
- Most "agent frameworks" only provide an agent abstraction; they aren't true orchestration systems.
- Agent abstractions speed initial dev but hide model inputs, hurting reliability work.
- As models improve, workflows still win on cost/speed/predictability for many apps.

**Quotable:** "The hard part of building reliable agentic systems is making sure the LLM has the appropriate context at each step."
**Frameworks named:** LangGraph, OpenAI Agents SDK, LangChain, CrewAI, Anthropic's approach, Google ADK, LlamaIndex, Mastra, Pydantic AI, AutoGen, Temporal, SmolAgents, DSPy, LangSmith.
**Why it matters:** Framework taxonomy — clarifies "orchestration vs abstraction" axis when picking tools.

### How We Build Evals for Deep Agents
**URL:** `https://www.langchain.com/blog/how-we-build-evals-for-deep-agents`
**Fetch:** OK
**Date:** March 26, 2026
**Key claims:**
- "More evals != better agents" — curate focused tests over volume.
- Three eval sources: dogfooding, external benchmarks (Terminal Bench 2.0, BFCL), custom artisanal tests.
- Eight categories: file_operations, retrieval, tool_use, memory, conversation, summarization, unit_tests (plus one more).
- Five efficiency metrics: step ratio, tool-call ratio, latency ratio, solve rate, correctness.
- Eval architecture is open-sourced in the Deep Agents repo using pytest + GitHub Actions for CI.

**Quotable:** "Every eval is a vector that shifts the behavior of your agentic system."
**Frameworks named:** Deep Agents, LangSmith, Fleet, Open SWE, Terminal Bench 2.0, BFCL, FRAMES benchmark, Harbor, Polly, Insights, LangSmith CLI, LangGraph, pytest, GitHub Actions.
**Why it matters:** Eval architecture — concrete category and metric scheme to copy when designing a project's eval taxonomy.

### Improving Deep Agents with Harness Engineering
**URL:** `https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering`
**Fetch:** OK
**Date:** February 17, 2026
**Key claims:**
- Coding agent moved from 52.8% to 66.5% on Terminal Bench 2.0 (+13.7 points) via harness-only changes with gpt-5.2-codex.
- Terminal Bench 2.0 = 89 tasks across ML, debugging, biology, etc.
- Reasoning-budget tested at four modes (low/medium/high/xhigh); "reasoning sandwich" approach 63.6% vs 53.9%.
- Claude Opus 4.6 scored 59.6% on an earlier harness version.
- Harbor + Daytona used to orchestrate runs and spin up sandboxes.

**Quotable:** "The purpose of the harness engineer: prepare and deliver context so agents can autonomously complete work."
**Frameworks named:** LangSmith, deepagents-cli, Terminal Bench 2.0, Harbor, Daytona, PreCompletionChecklistMiddleware, LocalContextMiddleware, LoopDetectionMiddleware, Trace Analyzer Skill, Claude/Gemini/Codex models.
**Why it matters:** Harness pattern — flagship case study showing harness changes alone can deliver double-digit benchmark gains.

### Introducing Ambient Agents
**URL:** `https://www.langchain.com/blog/introducing-ambient-agents`
**Fetch:** OK
**Date:** January 14, 2025
**Key claims:**
- Ambient agents listen to event streams and act on potentially many events in parallel — not a 1:1 chat turn model.
- Three human-in-the-loop patterns: notify, question, review — they reduce deployment stakes and build trust.
- LangGraph provides the persistence layer, HITL primitives, long-term memory with semantic search, and cron scheduling.
- Reference impl: free hosted Executive AI Assistant + open-source email assistant.
- Introduces "Agent Inbox" as a new UX paradigm distinct from chat.

**Quotable:** "Ambient agents listen to an event stream and act on it accordingly, potentially acting on multiple events at a time."
**Frameworks named:** LangGraph, LangGraph Platform, LangChain, persistence layer, HITL (notify/question/review), Agent Inbox, long-term memory (key-value + semantic), cron jobs, Executive AI Assistant.
**Why it matters:** UX/architecture pattern — provides the canonical "non-chat" agent interaction model and HITL vocabulary.

### On Agent Frameworks and Agent Observability
**URL:** `https://www.langchain.com/blog/on-agent-frameworks-and-agent-observability`
**Fetch:** OK
**Date:** February 12, 2026
**Key claims:**
- Three generations of agent frameworks in three years: RAG → agentic workflows → autonomous tool-calling-in-a-loop.
- LangSmith integrates with AutoGen, Claude Agent SDK, CrewAI, Mastra, OpenAI Agents, PydanticAI, Vercel AI SDK.
- LangGraph runtime supports durability and statefulness — required for human-agent and agent-agent collaboration.
- DeepAgents is positioned as the only model-agnostic agent harness.
- Quality remains the #1 barrier to getting agents into production.

**Quotable:** "With agents, your app logic is documented in traces, not code."
**Frameworks named:** LangChain, LangGraph, DeepAgents, LangSmith, Claude Agent SDK, AutoGen, CrewAI, Mastra, OpenAI Agents, PydanticAI, Vercel AI SDK, OpenTelemetry.
**Why it matters:** Observability framing — the "logic lives in traces" line is the strongest one-liner for why observability is first-class.

### Open Models Have Crossed a Threshold
**URL:** `https://www.langchain.com/blog/open-models-have-crossed-a-threshold`
**Fetch:** OK
**Date:** April 2, 2026
**Key claims:**
- GLM-5 and MiniMax M2.7 match closed frontier models on core agent tasks (file ops, tool use, instruction following).
- Open models are 8-10x cheaper: MiniMax M2.7 at $0.30/$1.20 per M tokens vs Claude Opus 4.6 at $5.00/$25.00.
- GLM-5 latency 0.65s @ 70 tok/s on Baseten vs Opus 4.6 at 2.56s @ 34 tok/s.
- GLM-5 correctness 0.64 (94/138) vs Opus 4.6 at 0.68 (100/138) on the eval set.
- Annual cost: ~$250/day on Opus 4.6 vs ~$12/day on MiniMax M2.7 (~$87k/yr savings).

**Quotable:** "Open models now offer a level of consistency and predictability that makes real-world workflows much more viable."
**Frameworks named:** Deep Agents, GLM-5, MiniMax M2.7, LangSmith, LangGraph, LangChain, Groq, Fireworks, Baseten, Ollama, vLLM, OpenRouter, SWE-Rebench, Terminal Bench 2.0.
**Why it matters:** Model behavior — concrete cost/perf table for the "should I use open models?" decision.

### Production Agents Self-Heal
**URL:** `https://www.langchain.com/blog/how-my-agents-self-heal-in-production`
**Fetch:** OK
**Date:** April 3, 2026
**Key claims:**
- Poisson regression detector compares a 7-day baseline error rate against a 60-minute post-deploy window at p < 0.05.
- Docker build failures handed directly to Open SWE with git diffs for automated fixes.
- Error signatures normalized (strip UUIDs/timestamps/numbers, truncate to 200 chars) for logical bucketing.
- Triage agent classifies changed files into runtime/prompt-config/test/docs/CI to suppress false positives from non-code changes.
- End-to-end detect → triage → PR runs without manual intervention.

**Quotable:** "The more of that loop you automate, the more engineering time shifts from reacting to building."
**Frameworks named:** Deep Agents, LangSmith Deployments, Open SWE, LangGraph, LangChain, Poisson testing, GitHub Actions, vector-space clustering (future).
**Why it matters:** Ops pattern — concrete recipe for an auto-remediation loop using a coding agent as the fixer.

### The Anatomy of an Agent Harness
**URL:** `https://www.langchain.com/blog/the-anatomy-of-an-agent-harness`
**Fetch:** OK
**Date:** March 10, 2026
**Key claims:**
- Agent = Model + Harness; harness = system prompts + tools + infra + orchestration.
- Filesystems are foundational: durable storage, context management, multi-agent collaboration.
- Context rot is the failure mode; harnesses fight it via compaction, tool-call offloading, and progressive skill disclosure.
- Claude Code and Codex show model/harness co-evolution; optimal serving harness can differ from training harness (Opus 4.6 scores vary across harness implementations).
- Long-horizon autonomy needs filesystem + git + planning tools + self-verification loops across multiple context windows.

**Quotable:** "The model contains the intelligence and the harness is the system that makes that intelligence useful."
**Frameworks named:** ReAct loop, Ralph Loop, deepagents, LangSmith, MCP, AGENTS.md, Skills (progressive disclosure), Context7, Terminal Bench 2.0 Leaderboard.
**Why it matters:** Definitional — the canonical "what is a harness" reference; sets the vocabulary the other harness-engineering posts build on.

---

## Section 3: Individual Articles + arxiv + Courses (10 URLs, 1 fetch fail)

### Intro to LangGraph (LangChain Academy)
**URL:** `https://academy.langchain.com/courses/intro-to-langgraph`
**Fetch:** OK
**Key claims:**
- Free course: 55 lessons, ~6 hours of video, Python-based.
- Six modules: Introduction (simple graphs, chains, routers, agents, memory); State and Memory (schemas, reducers, message filtering); UX & Human-in-the-Loop (streaming, breakpoints, state editing, time travel); Building Assistants (parallelization, sub-graphs, map-reduce); Long-Term Memory (LangGraph Store, memory schemas); Deployment (LangSmith).
- Positions LangGraph as lower-level and more controllable than LangChain agents for complex agentic systems.
- Covers reducers and message-filtering as primary state primitives.
- Deployment chapter wires LangGraph to LangSmith Studio + LangSmith Deployment.

**Quotable:** "LangGraph is an orchestration framework for complex agentic systems and is more low-level and controllable than LangChain agents."
**Frameworks named:** LangGraph, LangChain, LangSmith Studio, LangSmith Deployment, reducers, sub-graphs, map-reduce, human-in-the-loop, time travel, LangGraph Store.
**Why it matters:** Canonical free curriculum for graph-based agent orchestration patterns (state, memory, HITL, deployment) that map directly to production agent design.

### Establishing Best Practices for Building Rigorous Agentic Benchmarks
**URL:** `https://arxiv.org/abs/2507.02825`
**Fetch:** OK
**Date:** Submitted July 3, 2025 (rev. Aug 7, 2025)
**Author:** Zhu, Jin, Pruksachatkun, Zhang, Liu, Cui, Kapoor, Longpre, Meng, Weiss, Barez, Gupta, Dhamala, Merizian, Giulianelli, Coppock, Ududec, Sekhon, Steinhardt, Kellermann, Schwettmann, Zaharia, Stoica, Liang, Kang.
**Key claims:**
- Existing agentic benchmarks can misestimate capability "by up to 100% in relative terms."
- SWE-bench Verified has inadequate test coverage; TAU-bench credits empty responses as successful.
- Proposes the Agentic Benchmark Checklist (ABC) — a synthesized set of construction/evaluation guidelines.
- Applying ABC to CVE-Bench reduced performance overestimation by 33%.
- Frames the problem as systematic flaws in both task validity and outcome scoring across the agent eval ecosystem.

**Quotable:** "Such issues can lead to under- or overestimation of agents' performance by up to 100% in relative terms."
**Frameworks named:** SWE-bench Verified, TAU-bench, CVE-Bench, Agentic Benchmark Checklist (ABC).
**Why it matters:** Provides a vetted checklist for trustworthy agent evals — directly addresses the "looks great on benchmark, fails in prod" gap.

### The Complete Guide to Harness Engineering: Building AI Agents the Claude Code Way
**URL:** `https://claudecode-lab.com/en/blog/claude-code-harness-engineering/`
**Fetch:** OK
**Date:** April 16, 2026
**Author:** Masa
**Key claims:**
- OODA loop framing: harness owns Observe/Orient/Act; LLM owns only Decide — so scaffolding dominates outcomes.
- Claude Code's seven core tools: Read, Edit, Write, Bash, Glob, Grep, Agent; Grep wraps ripgrep; Edit uses targeted string replacement (not rewrites).
- Optimal tool count sits at 5–15; beyond this, model accuracy degrades — overflow goes to subagents.
- Five-layer harness architecture: tool design, layered context (global rules, project rules, memory, conversation history), subagent delegation, hooks (deterministic post-processing), and permission modes.
- Prompt caching via `cache_control: { type: "ephemeral" }` with a 5-minute TTL keeps long system prompts off the per-turn payload.

**Quotable:** "The 'just throw a prompt at ChatGPT' era is over."
**Frameworks named:** OODA loop, Anthropic Claude Agent SDK, ripgrep, prompt caching, subagent delegation, hooks, permission modes (allow/deny/ask), TypeScript/Node.js, MDX.
**Why it matters:** Most concrete public reverse-engineering of Claude Code's harness — gives a transferable blueprint (tools + context layers + hooks + permissions) for building agent harnesses.

### State of Agent Engineering (LangChain)
**URL:** `https://langchain.com/state-of-agent-engineering`
**Fetch:** OK
**Date:** Survey fielded Nov 18 – Dec 2, 2025
**Key claims:**
- 57% of respondents have agents in production, up from 51% the prior year.
- ~1/3 cite quality (accuracy, consistency, tone) as the top blocker to production.
- 89% have implemented some agent observability; 62% have detailed tracing.
- Multi-model is mainstream — 3/4+ of orgs use multiple model providers in prod or dev.
- Top use cases: customer service 26.5%, research & data analysis 24.4%.

**Quotable:** "89% of organizations have implemented some form of observability for their agents."
**Frameworks named:** LangChain, LangGraph, Deep Agents, Claude Code, Cursor, GitHub Copilot, Amazon Q, Windsurf, OpenAI GPT, Gemini, Claude, LLM-as-judge, RAG, context engineering, offline/online evals, fine-tuning.
**Why it matters:** Hard 2025 industry baseline — production %, observability %, model-mix, and use-case mix you can quote when justifying architecture or eval investment.

### Inside the Claude Agents SDK (ML6)
**URL:** `https://ml6.eu/en/blog/inside-the-claude-agents-sdk`
**Fetch:** FAILED-404
**Fetch failed — no content extracted** (also tried `www.ml6.eu` variant; same 404). May have been moved or removed.

### Simon Willison's Weblog (homepage)
**URL:** `https://simonwillison.net`
**Fetch:** OK
**Author:** Simon Willison (co-creator of Django; creator of Datasette / LLM CLI)
**Key claims:**
- Active coverage of model launches and pricing analysis (e.g., Gemini 3.5 Flash on May 19, 2026).
- Datasette 1.0a30 (May 24) ships a customizable "Jump to…" menu with new plugin hooks.
- Datasette-agent 0.1a4 (May 24) integrates an AI assistant into the Jump menu UI.
- Recurring focus on agentic engineering patterns, evals, and coding-agent tooling.
- Posts daily, often multiple times per day; skeptical-enthusiast voice ("vibe coding", "tools = LLM + actions").

**Frameworks named:** Datasette, Datasette-agent, Gemini 3.5 Flash, Claude, DeepSeek, SQLite, Python, MCP-style agent tooling.
**Why it matters:** Best continuously updated single-source feed for LLM/agent news with hands-on commentary — useful as a "what changed this week" pulse.

### Building effective agents (Simon Willison's commentary)
**URL:** `https://simonwillison.net/2024/Dec/20/building-effective-agents/`
**Fetch:** OK
**Date:** 20 December 2024
**Key claims:**
- Sharp split between "workflows" (predefined LLM orchestration) and "agents" (LLM dynamically directs its own process and tool use).
- Five canonical workflow patterns: prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer.
- Introduces "augmented LLM" as the base unit (LLM + tools/retrieval/memory).
- Agents fit open-ended problems but cost more and compound errors — need guardrails + tests.
- Default advice: start with the simplest prompt/workflow, escalate only when necessary.

**Quotable:** "Agents begin their work with either a command from, or interactive discussion with, the human user. Once the task is clear, agents plan and operate independently."
**Frameworks named:** Anthropic Cookbook, Claude Haiku, Claude Sonnet, augmented LLM, prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer.
**Why it matters:** The de facto vocabulary the field now uses for workflow-vs-agent design — required reference taxonomy.

### How we built our multi-agent research system (Simon's commentary on Anthropic post)
**URL:** `https://simonwillison.net/2025/Jun/14/multi-agent-research-system/`
**Fetch:** OK
**Date:** 14 June 2025
**Key claims:**
- Orchestrator-worker pattern: lead agent decomposes the query and spawns 3–5 parallel subagents, each with its own context window.
- Multi-agent setups burn ~15× more tokens than chat but deliver 90.2% better performance on breadth-first research tasks.
- Parallel subagents + parallel tool use cut research time by up to 90% on complex queries.
- A memory mechanism persists the lead agent's plan to survive the 200K-token context limit.
- Prompt engineering — including tool descriptions refined by a dedicated tool-testing agent — cut completion time by 40%.

**Quotable:** "The essence of search is compression: distilling insights from a vast corpus. Subagents facilitate compression by operating in parallel with their own context windows."
**Frameworks named:** OODA loop, Claude Research, Claude Opus 4, Claude Sonnet 4, MCP tools, tool-testing agent, LLM-as-judge.
**Why it matters:** Single best public case study on production multi-agent research — concrete numbers (15× tokens, 90.2% lift, 90% time cut, 40% from prompt eng).

### Inspect AI, An OSS Python Library For LLM Evals
**URL:** `https://hamel.dev/notes/llm/evals/inspect.html`
**Fetch:** OK
**Date:** June 23, 2025
**Author:** Hamel Husain
**Key claims:**
- Three-component model: Dataset, Solver, Scorer — composable from simple benchmarks up to agentic tasks.
- Built for scale: configurable API concurrency + Docker container limits enable dozens of parallel evals per node.
- Structured EvalLog per run captures token usage, latency, full message history, sample-level outputs; viewable in an interactive log viewer.
- Ships purpose-built agent tools: web search, bash/Python exec, text edit, headless browser, desktop control, plus sandbox abstractions.
- Bridge architecture monkey-patches the OpenAI client so existing LangChain / Autogen agents can be evaluated without rewrites.

**Quotable:** "Inspect is an open project with over 100 external contributors" and has been adopted as "the framework of choice for many of the largest AI labs including Anthropic, DeepMind, and Grok."
**Frameworks named:** Inspect AI, ReAct, TaskState, EvalLog, LangChain, Autogen, Claude Code, SWE-Bench, GAIA, Docker, VS Code.
**Why it matters:** Concrete recommendation for the eval layer of an agent stack — production-grade, framework-agnostic, and adopted by major labs.

### Lil'Log (Lilian Weng's blog homepage)
**URL:** `https://lilianweng.github.io`
**Fetch:** OK
**Author:** Lilian Weng
**Key claims:**
- Latest essay "Why We Think" (May 1, 2025) covers test-time compute and chain-of-thought.
- "Reward Hacking in Reinforcement Learning" (Nov 28, 2024) — RL agents exploiting reward function flaws, framed as an LLM alignment problem.
- "Extrinsic Hallucinations in LLMs" (Jul 7, 2024) — taxonomy of ungrounded fabrications.
- "Diffusion Models for Video Generation" (Apr 12, 2024).
- "Thinking about High-Quality Human Data" (Feb 5, 2024) — annotation quality for modern training pipelines.

**Frameworks named:** Test-time compute, chain-of-thought, RLHF, reward hacking, extrinsic hallucination, diffusion models, annotation quality.
**Why it matters:** Long-form, citation-heavy primers from a former OpenAI safety lead — strongest single source for the alignment/safety/reasoning literature behind agent behavior.

### Chip Huyen's Site
**URL:** `https://huyenchip.com`
**Fetch:** OK
**Author:** Chip Huyen
**Key claims:**
- Author of *Designing Machine Learning Systems* (Amazon #1 AI bestseller, 10+ translations).
- *AI Engineering* (2025) — "the most read book on the O'Reilly platform since its launch."
- Focus areas: ML/AI systems in production, system design, tooling/infra, AI engineering practice.
- Has taught ML Systems at Stanford.
- Prior roles at NVIDIA (NeMo), Snorkel AI, Netflix; founded and sold an AI infra startup.

**Frameworks named:** NVIDIA NeMo, Snorkel AI, Netflix, Stanford ML Systems, Convai, OctoAI, Photoroom.
**Why it matters:** Definitive practitioner voice on the systems/engineering side of LLM apps; *AI Engineering* is the standard reference for the production layer that wraps any agent.

---

## Section 4: GitHub Repos + Framework Docs (21 URLs)

### Awesome Agentic Engineering Resources
**URL:** `https://github.com/EthicalML/awesome-agentic-engineering-resources`
**Fetch:** OK
**Stars / freshness:** ~18 stars, 54 commits, active monthly release cadence
**What it is:** A curated index of high-signal learning materials (articles, books, courses, papers, benchmarks) organized into 21 topics spanning agentic AI systems and AI-assisted software development.
**Key concepts named:** Anthropic "Building Effective Agents" pattern taxonomy; spec-driven development; ReAct loop; RAG architecture; 11 content types (courses, books, papers, benchmarks, reference implementations, talks); MCP, tool use, multi-agent coordination, observability, guardrails.
**Why it matters:** Provides a vetted reading list/taxonomy that maps the entire agentic-engineering landscape into nameable patterns.

### Claude Code Best Practices (MuhammadUsmanGM)
**URL:** `https://github.com/MuhammadUsmanGM/claude-code-best-practices`
**Fetch:** OK
**Stars / freshness:** 24 stars, last updated May 12, 2026 (v1.6)
**What it is:** A best-practices wiki bundling CLAUDE.md templates, slash-command examples, starter kits, and a benchmarking harness for Claude Code projects.
**Key concepts named:** CLAUDE.md templates for 11 stacks (React, Next.js, Python, Go, Rails, Django, Spring Boot, Flutter, Rust); `.claude/` config dir (settings, skills, hooks); `/goal` completion mode; MCP server integration; headless/Remote Control workflows; commit-helper plugin; cost estimators, linters, benchmark harness.
**Why it matters:** Concrete drop-in scaffolding that demonstrates the production shape of a Claude Code repo.

### Inspect Evals
**URL:** `https://github.com/UKGovernmentBEIS/inspect_evals`
**Fetch:** OK
**Stars / freshness:** 511 stars, 334 forks, 2,429 commits, active (May 2026 register transition)
**What it is:** A community-contributed collection of LLM evaluations built on the Inspect AI framework, covering 200+ benchmarks across coding, agents, cybersecurity, safeguards, math, reasoning, and knowledge.
**Key concepts named:** Inspect AI Task/Solver/Scorer; benchmarks: SWE-Bench, HumanEval, MBPP, GAIA, BFCL, Mind2Web, MMLU, GPQA, AIME, StrongREJECT, CVEBench; Docker sandboxed environments for security evals; LLM-judge grading; eight categories including a "Scheming" misalignment category.
**Why it matters:** Canonical eval library you plug your agent into to compare against published benchmarks.

### everything-claude-code (ECC)
**URL:** `https://github.com/affaan-m/ECC`
**Fetch:** OK
**Stars / freshness:** ~191k stars, 29.5k forks, "Anthropic Hackathon Winner"
**What it is:** A harness-native operator system providing 60 subagents, 232 skills, hooks, rules, and MCP configs that work across Claude Code, Cursor, Codex, OpenCode, Zed, and Copilot.
**Key concepts named:** 60 specialized subagents, 232 skill workflows (TDD, security, frontend/backend); trigger-based hooks (SessionStart, file edits, tool use); AgentShield security auditor; continuous learning v2; skill creator; research-first dev loop, 80%+ coverage TDD targets, token optimization.
**Why it matters:** Largest known cross-harness library of reusable agentic primitives — a reference for the skills/agents/hooks/rules taxonomy.

### Anthropic Cookbook
**URL:** `https://github.com/anthropics/anthropic-cookbook`
**Fetch:** OK
**Stars / freshness:** 43.8k stars, 5k forks, 576 commits
**What it is:** A canonical collection of Jupyter notebooks demonstrating practical recipes for building with the Claude API.
**Key concepts named:** Capabilities: classification, RAG, summarization; tool use (calculator, SQL, customer service), sub-agent patterns; third-party integrations: Pinecone, Wikipedia, Voyage AI embeddings; multimodal vision, PDF parsing, JSON mode, prompt caching, automated evals.
**Why it matters:** Authoritative first-party recipes for the building blocks (tools, RAG, sub-agents, caching, evals) that compose agents.

### Prompt Engineering Interactive Tutorial
**URL:** `https://github.com/anthropics/prompt-eng-interactive-tutorial`
**Fetch:** OK
**Stars / freshness:** 35.9k stars, Jupyter-based, 9 commits on master
**What it is:** Anthropic's 9-chapter interactive course teaching prompt engineering for Claude from basic structure to complex chained workflows.
**Key concepts named:** Chapters: basic structure, clear+direct, role assignment, separating data from instructions, output formatting, step-by-step (precognition), few-shot examples, hallucination avoidance, complex prompts; appendix on prompt chaining, tool use, search and retrieval; use cases: chatbots, legal, financial, coding.
**Why it matters:** Baseline curriculum every agent author should internalize before building tool loops.

### Deep Agents (langchain-ai/deepagents)
**URL:** `https://github.com/langchain-ai/deepagents`
**Fetch:** OK
**Stars / freshness:** 23.3k stars, 3.3k forks, deepagents 0.6.3 released May 20, 2026
**What it is:** An opinionated "batteries-included" agent harness built on LangGraph that ships sub-agents, filesystem access, shell, persistent memory, skills, and HITL out of the box.
**Key concepts named:** Sub-agents with isolated contexts; planning tool for multi-step work; filesystem (read/write/edit/search); shell sandbox; thread summarization; output offloading; pluggable state/store backends for cross-session memory; human-in-the-loop approvals; custom tools + MCP servers; loadable Skills.
**Why it matters:** A reference implementation of the "deep agent" pattern (planner + subagents + memory + filesystem) on top of LangGraph.

### LangGraph Examples (archived)
**URL:** `https://github.com/langchain-ai/langgraph/tree/main/examples`
**Fetch:** OK (directory is marked archival; moved to consolidated docs)
**Stars / freshness:** Repo 32.8k stars; this examples dir kept for archive
**What it is:** Reference notebooks/folders showing how to implement common agent architectures with LangGraph.
**Key concepts named:** Folders: multi_agent, plan-and-execute, rag, reflection, reflexion, rewoo, self-discover, lats, llm-compiler, human_in_the_loop, customer-support, code_assistant, web-navigation, chatbot-simulation-evaluation; notebooks: react-agent-from-scratch, react-agent-structured-output, tool-calling, subgraph; patterns: ReAct, multi-agent, plan-execute, reflection/reflexion, RAG, HITL.
**Why it matters:** A pattern catalog mapping named agent architectures (ReWOO, LATS, Reflexion) to runnable LangGraph code.

### OpenAI Cookbook (repo)
**URL:** `https://github.com/openai/openai-cookbook`
**Fetch:** OK
**Stars / freshness:** 73.8k stars, Jupyter-heavy (93.1%)
**What it is:** OpenAI's official example-code repository for accomplishing common tasks with the OpenAI API.
**Key concepts named:** AGENTS.md file in repo; function calling, RAG, evaluations, multimodal usage (implied via cookbook.openai.com mirror); Python-first but language-agnostic concepts.
**Why it matters:** Cross-vendor counterpart to anthropic-cookbook — essential for comparative patterns and provider-portable techniques.

### Claude Code Best Practice (shanraisshan)
**URL:** `https://github.com/shanraisshan/claude-code-best-practice`
**Fetch:** OK
**Stars / freshness:** 54.7k stars, 5.5k forks, v2.1.145, "Trending #1"
**What it is:** A comprehensive Claude Code playbook covering core concepts, the Research → Plan → Execute → Review → Ship workflow, cross-model integration, and 83 categorized tips.
**Key concepts named:** Core concepts: subagents, commands, skills, workflows, hooks, MCP servers, plugins, memory; slash commands: `/plan`, `/tdd`, `/code-review`, `/ultrareview`, `/goal`, `/voice`, `/weather-orchestrator`; session ops: `/compact`, `/clear`, `/rewind`, `/rename`, `/resume`; architecture pattern: Command → Agent → Skill orchestration; Git Worktrees, Agent Teams, Computer Use.
**Why it matters:** The most-starred Claude Code reference repo — a primary source for naming conventions and idiomatic workflows.

### tau2-bench
**URL:** `https://github.com/sierra-research/tau2-bench`
**Fetch:** OK
**Stars / freshness:** 1.2k stars
**What it is:** A simulation framework for evaluating customer-service agents across multiple domains using a dual-control environment with an LLM user simulator.
**Key concepts named:** Domains: Mock, Airline, Retail, Telecom, Banking Knowledge (with configurable RAG); dual-control environment (agent and user simulator both have policies and tools); LLM-powered user simulator; text and voice evaluation modes; domain-specific tools (booking flights, processing refunds).
**Why it matters:** Standard benchmark for measuring agent performance in realistic multi-turn customer-service tool-use scenarios.

### Tool use with Claude (docs)
**URL:** `https://docs.anthropic.com/en/docs/build-with-claude/tool-use`
**Fetch:** OK (followed 301 redirect to platform.claude.com)
**What it is:** Anthropic's reference page for connecting Claude to external tools/APIs, covering client vs server tools and the agentic loop.
**Key concepts named:** Client tools vs server tools (`web_search`, `code_execution`, `web_fetch`, `tool_search`, `bash`, `text_editor`); `stop_reason: "tool_use"`, `tool_use` blocks, `tool_result` blocks; `tools` parameter, `tool_choice` (`auto`, `none`, `any`, `tool`), `strict: true` for schema conformance; MCP connector, agentic loop, token pricing per model (346/313 tokens for tool system prompt on Claude 4.x).
**Why it matters:** Defines the wire-level protocol every Claude-based agent loop uses.

### LangSmith docs
**URL:** `https://docs.smith.langchain.com`
**Fetch:** OK (followed 308 to docs.langchain.com/langsmith)
**What it is:** A framework-agnostic platform for tracing, evaluating, and deploying AI agents and LLM applications.
**Key concepts named:** Observability/tracing of requests for debugging bottlenecks; evaluation primitives for quality monitoring over time; prompt engineering with versioning and collaboration; Agent Servers, Studio (visual builder), Fleet (no-code), CLI access.
**Why it matters:** The de facto observability+eval layer for LangChain/LangGraph agents and a general-purpose LLM tracing platform.

### Temporal docs
**URL:** `https://docs.temporal.io`
**Fetch:** OK (limited content — page heavy on React components)
**What it is:** A scalable runtime for durable function executions that guarantees code runs to completion despite failures, crashes, or outages.
**Key concepts named:** Durable Execution via Event History; Workflow Executions (lightweight, suspendable, exclusive local state, message passing); Activities (referenced via Activity Failures); Temporal Server (Go); SDK languages not enumerated on this page (typically Go/Java/TypeScript/Python/.NET/PHP).
**Why it matters:** Industry-standard durable-execution substrate for long-running agents that must survive infrastructure failures.

### Inngest docs
**URL:** `https://inngest.com/docs`
**Fetch:** OK
**What it is:** An event-driven durable execution platform that runs reliable background functions across TypeScript, Python, and Go without managing queues or state.
**Key concepts named:** Durable Execution Engine (state persistence across invocations); Functions (TypeScript/Python/Go), Events & Triggers, Steps; built-in queueing, scaling, concurrency, throttling, rate limiting, observability.
**Why it matters:** Lightweight alternative to Temporal for event-driven durable agent workflows with first-class step semantics.

### Inspect AI (aisi.org.uk)
**URL:** `https://inspect.aisi.org.uk`
**Fetch:** OK
**What it is:** An open-source framework for LLM evaluations developed by the UK AI Security Institute and Meridian Labs.
**Key concepts named:** Task (combines dataset, solver, scorer); Dataset (labeled samples with input/target); Solver (composable chain producing model outputs); Scorer (text comparison, model grading, custom schemes); 200+ built-in evaluations across coding, agentic, reasoning, knowledge, behavior, multimodal.
**Why it matters:** The framework underlying `inspect_evals`; provides the Task/Solver/Scorer vocabulary used across modern eval pipelines.

### LangGraph docs
**URL:** `https://langchain-ai.github.io/langgraph/`
**Fetch:** OK (followed redirect to docs.langchain.com/oss/python/langgraph/overview)
**What it is:** A low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents.
**Key concepts named:** `StateGraph` with nodes, edges, `START`/`END` markers; `MessagesState` carrying message context through the graph; durable execution (resume after failure), checkpointing; human-in-the-loop state inspection/modification; short-term + long-term memory; LangSmith tracing integration.
**Why it matters:** Reference framework for explicitly graph-shaped agent control flow with first-class state and persistence.

### Claude Agent SDK overview
**URL:** `https://platform.claude.com/docs/en/agent-sdk`
**Fetch:** OK (followed 307 redirect to code.claude.com/docs/en/agent-sdk)
**What it is:** A Python/TypeScript library that exposes the Claude Code agent loop, built-in tools, and context management as a programmable SDK.
**Key concepts named:** `query()`, `ClaudeAgentOptions`, `allowed_tools`/`allowedTools`, `permission_mode`; built-in tools: Read, Write, Edit, Bash, Monitor, Glob, Grep, WebSearch, WebFetch, AskUserQuestion; hooks: PreToolUse, PostToolUse, Stop, SessionStart, SessionEnd, UserPromptSubmit; `HookMatcher`; subagents via `AgentDefinition` + Agent tool; MCP via `mcp_servers`/`mcpServers`; sessions with `resume`, `session_id`; `setting_sources`; Skills/Slash commands/CLAUDE.md/Plugins.
**Why it matters:** The first-party programmable surface for embedding Claude Code's agent loop into production apps and CI/CD.

### Claude Agent SDK — Skills
**URL:** `https://code.claude.com/docs/en/agent-sdk/skills`
**Fetch:** OK
**What it is:** Documentation explaining how Agent Skills — filesystem `SKILL.md` artifacts — are discovered, filtered, and autonomously invoked by Claude in the SDK.
**Key concepts named:** `SKILL.md` with YAML frontmatter + Markdown body; `description` field drives invocation; locations: `.claude/skills/` (project), `~/.claude/skills/` (user), plugin skills; SDK options: `skills` (`"all"`, list, `[]`), `setting_sources`/`settingSources` (`"user"`, `"project"`); skills are filesystem-only (no programmatic registration), model-invoked, progressively loaded (metadata at startup, full content on trigger); `allowed-tools` frontmatter ignored in SDK — use top-level `allowedTools` instead.
**Why it matters:** Defines the contract authors must follow for portable, model-invoked capabilities across Claude Code CLI and Agent SDK.

### Modal docs
**URL:** `https://modal.com/docs`
**Fetch:** OK
**What it is:** A serverless cloud for compute-intensive applications (LLM inference, batch jobs, GPU workloads) without managing infrastructure.
**Key concepts named:** Functions (serverless), Apps (multi-service deployments); GPU support, batch processing, parallel workflows, job queues; real-time streaming (voice chat, transcription), image generation.
**Why it matters:** Common compute substrate for hosting agent tools (sandboxed code execution, GPU model calls) without managing servers.

### OpenAI Cookbook (site)
**URL:** `https://cookbook.openai.com`
**Fetch:** OK (followed 308 redirect to developers.openai.com/cookbook)
**What it is:** OpenAI's curated site of notebook examples for building with OpenAI models, organized by topic.
**Key concepts named:** Categories: Agents, Evals, Multimodal, Text, Guardrails, Optimization, ChatGPT, Codex, gpt-oss; featured: "Build an Agent Improvement Loop with Traces, Evals, and Codex"; iterative repair loops and agent improvement workflows.
**Why it matters:** Authoritative cross-vendor reference for agent loops, evals, and guardrails patterns; complements anthropic-cookbook.

---

## Section 5: People's Blogs + Newsletters + Podcasts (14 URLs, 1 fetch fail)

### Ben's Bites
**URL:** `https://bensbites.com`
**Fetch:** OK
**Author / cadence:** Ben Tossell; historically daily newsletter (165k+ subscribers)
**Beat:** AI news, tools, tutorials and builder-oriented coverage of the AI/startup ecosystem.
**Distinctive POV:** "Exited founder turned investor" lens — practical AI for builders, mixing mini-tutorials, tool testing, and behind-the-scenes notes.
**Why it matters:** A high-volume signal layer for what tools and agent products builders are actually trying right now.

### Cameron R. Wolfe — Deep (Learning) Focus
**URL:** `https://cameronrwolfe.substack.com`
**Fetch:** OK
**Author / cadence:** Cameron R. Wolfe, Ph.D.; effectively monthly long-form (68k+ subscribers)
**Beat:** Long-form explainers of ML/LLM research with applied context.
**Distinctive POV:** "Approachable long-form content" — accessible but technically rigorous deep dives that translate research papers into engineering intuition; endorsed by Sebastian Raschka.
**Why it matters:** Best-in-class research-explainer source for understanding the model-and-training fundamentals behind agent capabilities.

### Practical AI (Changelog)
**URL:** `https://changelog.com/practicalai`
**Fetch:** OK (after redirect chain → practicalai.show)
**Author / cadence:** Practical AI podcast — Chris Benson and Daniel Whitenack; weekly (Wednesdays)
**Beat:** Making AI "practical, productive & accessible," covering ML, deep learning, LLMs, and real-world deployment.
**Distinctive POV:** Practitioner-friendly but policy-aware; balances open-source ecosystem with mainstream/enterprise AI; broad-audience accessibility.
**Recent posts:** E357 "Hermes Agent: Agents that grow with you"; E356 "U.S. Congressman Beyer on AI challenges facing America and the World"; E355 "The Myth of Model Wars: Open vs Closed AI in 2026".
**Why it matters:** Recurring practitioner POV on agent tooling, evals, and AI policy in plain language.

### The Batch — DeepLearning.AI
**URL:** `https://deeplearning.ai/the-batch`
**Fetch:** OK
**Author / cadence:** DeepLearning.AI (Andrew Ng); weekly
**Beat:** Weekly digest of AI news, research, policy, and industry trends with editor's-note commentary.
**Distinctive POV:** Andrew Ng's measured, education-first lens — demystifies adoption, emphasizes practical implications and workforce impact.
**Recent posts:** "Hermes vs. OpenClaw, Cybersecurity Alarms Ring, More-Interactive Conversations, Can Agents Do Human Work?"; "China Thwarts Meta's Agentic Ambition, U.S. Evaluates Upcoming Models, AI Diagnoses Mammograms"; "Seedance Makes A Splash, Nvidia's AI-Guided Chip Designs, Helping Robots Not Forget".
**Why it matters:** Authoritative weekly baseline of what shifted in agents, evals, and policy — good "context anchor" for any week's notes.

### Dwarkesh Patel — Dwarkesh Podcast
**URL:** `https://dwarkeshpatel.com`
**Fetch:** OK (redirected to dwarkesh.com)
**Author / cadence:** Dwarkesh Patel; roughly biweekly long-form episodes (81k+ subscribers)
**Beat:** Deeply researched long-form interviews with AI researchers, economists, historians, and "obscure intellectuals."
**Distinctive POV:** Unusually rigorous prep-driven interviewing — Gwern and Razib Khan endorsements; treats AGI timelines and scaling as core through-lines.
**Why it matters:** Primary-source long-form interviews with the people actually building frontier models and agents — best raw material for "what do the builders think" notes.

### Eugene Yan
**URL:** `https://eugeneyan.com`
**Fetch:** OK
**Author / cadence:** Eugene Yan (applied scientist); roughly weekly/biweekly
**Beat:** Applied ML/LLM systems, recommendation systems, and ML engineering practice.
**Distinctive POV:** Bridges "field and frontier" — pragmatic, reliability-and-evals-first, advocates simplicity and measurable engineering over hype.
**Recent posts:** "How to Work and Compound with AI" (May 3, 2026); "2025 Year in Review" (Dec 14, 2025); "Product Evals in Three Simple Steps" (Nov 23, 2025).
**Why it matters:** Canonical reference for LLM-system patterns, evals, and "how to actually ship reliable AI products."

### Hamel Husain — hamel.dev
**URL:** `https://hamel.dev`
**Fetch:** OK
**Author / cadence:** Hamel Husain (ex-Airbnb, ex-GitHub ML engineer); roughly monthly
**Beat:** Applied AI engineering, with deep emphasis on LLM evals and debugging.
**Distinctive POV:** Data-driven pragmatist; "evals are the missing infrastructure" — helping teams debug, analyze, and measure agent/LLM systems instead of vibing on demos.
**Recent posts:** "The Revenge of the Data Scientist" (3/26/26); "Evals Skills for Coding Agents" (3/2/26); "Why I Stopped Using nbdev" (1/18/26).
**Why it matters:** The single best ongoing source on agent evaluation methodology — directly relevant to any agentic-engineering practice.

### Import AI — Jack Clark
**URL:** `https://importai.substack.com`
**Fetch:** OK
**Author / cadence:** Jack Clark (Anthropic co-founder; former OpenAI policy lead); weekly (Mondays) (128k+ subscribers)
**Beat:** Cutting-edge AI research analysis with policy/safety framing.
**Distinctive POV:** Research-and-policy hybrid voice from an actual frontier-lab insider; includes the signature "Tech Tales" short fiction vignettes at the end of each issue.
**Why it matters:** Authoritative weekly survey of important AI papers and capability jumps — essential for sourcing what new agent-relevant research to track.

### Latent Space — swyx & Alessio
**URL:** `https://latent.space`
**Fetch:** OK (after redirect)
**Author / cadence:** Shawn "swyx" Wang and Alessio Fanelli; weekly (essays + podcast) (183k+ subscribers)
**Beat:** "AI Engineering" — agents, models, infrastructure, and AI-for-science as practiced at leading labs.
**Distinctive POV:** Coined/popularized "AI Engineer" as a discipline; community-driven, builder-first; interviews with practitioners (Brockman, Karpathy, Hotz, Willison, Chintala).
**Why it matters:** Defines the vocabulary and practitioner community of AI/agent engineering — likely the single most direct match for an agentic-engineering reference site.

### Matt Turck — The MAD Podcast
**URL:** `https://mattturck.com/themadpodcast`
**Fetch:** FAILED-empty
**Fetch failed — no content extracted** (JS-rendered; page returns only "Matt Turck" string). Needs alternative endpoint (RSS feed, podcast directory, or about page) to ingest.

### Philipp Schmid — philschmid.de
**URL:** `https://philschmid.de`
**Fetch:** OK (via www.philschmid.de)
**Author / cadence:** Philipp Schmid (Google DeepMind; previously Hugging Face); high-frequency (multiple posts/month)
**Beat:** Hands-on tutorials and architecture patterns for AI agents, function calling, and API integrations.
**Distinctive POV:** Implementation-first developer educator; "Agents, Subagents, Architecture, Education" — practical how-to with working code for current model APIs.
**Recent posts:** "How Agents Manage Other Agents: Four Subagents Patterns in 2026"; "How to use Deep Research with the Gemini API"; "How to correctly use MCP servers with your AI Agents".
**Why it matters:** Direct, recipe-style coverage of agent architectures (subagents, MCP, deep research) that maps 1:1 to an agentic-engineering syllabus.

### Simon Willison (homepage)
**URL:** `https://simonwillison.net`
**Fetch:** OK (also covered in Section 3 — duplicate intentional)
**Author / cadence:** Simon Willison; daily, often multiple times per day
**Beat:** Hands-on LLM tooling experiments, prompt-injection / security, and open-source data tools.
**Distinctive POV:** Skeptical-enthusiast builder — tries every new model himself, debunks hype, and crystallizes patterns ("prompt injection," "vibe coding," "tools = LLM + actions").
**Recent posts:** "Datasette Agent" (May 21, 2026); "Gemini 3.5 Flash: more expensive, but Google plan to use it for everything" (May 19, 2026); "The last six months in LLMs in five minutes" (May 19, 2026).
**Why it matters:** Highest-signal daily firehose for working LLM/agent practice and naming-of-things.

### TLDR AI
**URL:** `https://tldr.tech/ai`
**Fetch:** OK
**Author / cadence:** TLDR AI (TLDR Newsletter network); daily
**Beat:** 5-minute daily digest of top AI news, research, and tools.
**Distinctive POV:** Pure curation/efficiency — "Keep up with AI in 5 minutes"; consensus-of-the-day rather than original analysis.
**Why it matters:** Useful as a low-cost baseline scan of what's breaking; not a source of original POV but good for completeness.

### TWIML AI Podcast — Sam Charrington
**URL:** `https://twimlai.com`
**Fetch:** OK
**Author / cadence:** Sam Charrington / TWIML (CloudPulse Strategies); weekly podcast
**Beat:** ML/AI for practitioners, innovators, and leaders, with strong enterprise-deployment lens.
**Distinctive POV:** Bridges academia and enterprise; long-running show that has tracked the field from classical ML through agents/foundation models with researcher-led interviews.
**Recent posts:** Ep 768 "Relational Foundation Models for Enterprise Data" — Jure Leskovec (May 21, 2026); Ep 767 "How to Find the Agent Failures Your Evals Miss" — Scott Clark (May 7, 2026); Ep 766 "How to Engineer AI Inference Systems" — Philip Kiely (April 30, 2026).
**Why it matters:** Reliable weekly source on agent evals, inference engineering, and enterprise agent deployment.

---

## Section 6: Tools, Platforms, Courses, Communities (24 URLs, 7 fetch fails)

### AI Engineer (conference + community)
**URL:** `https://ai.engineer`
**Fetch:** OK
**Category:** conference / community
**What it is:** Conference series and community platform run by Swyx and team, serving AI engineers, founders, and architects building production AI systems.
**Distinctive feature:** Multiple flagship events globally (World's Fair SF, NYC, London, Code Summit); 6,000+ attendees, 300+ speakers, 29 tracks; large free YouTube talk archive.
**Pricing:** YouTube content free; event ticket pricing not on homepage (early-bird discounts via newsletter).
**Why it matters:** The de-facto practitioner conference for the agent stack — talk archive is a primary source of current-state agent engineering practice.

### AI Engineer Pack
**URL:** `https://aiengineerpack.com`
**Fetch:** OK
**Category:** developer deals bundle
**What it is:** Curated bundle of 60+ AI developer tool offers (credits, discounts, free months) coordinated by ElevenLabs.
**Distinctive feature:** Aggregated promo offers across AI/infra/dev tools (ElevenLabs, Notion, serverless DBs, monitoring, etc.); single signup unlocks many.
**Pricing:** Free to claim via GitHub login; per-vendor offers range from $25–$2,000 credits to 25–50% off subscriptions.
**Why it matters:** Cheap onboarding ramp to vendor tools used in agent stacks (eval, sandboxes, infra, voice).

### Anthropic Discord
**URL:** `https://anthropic.com/discord`
**Fetch:** OK (redirects to discord.com/invite/6PPFFzqPDZ — invite page itself returns minimal metadata via fetch)
**Category:** community (Discord server)
**What it is:** Official Anthropic-hosted Discord community for Claude developers and users.
**Distinctive feature:** Direct access to Anthropic-adjacent practitioners and staff discussion around Claude, Claude Code, MCP.
**Pricing:** Free; requires Discord account.
**Why it matters:** Primary unofficial-but-blessed channel for Claude/MCP/Claude Code Q&A and announcements.

### Arcade.dev
**URL:** `https://arcade.dev`
**Fetch:** OK
**Category:** agent tool runtime / MCP infra
**What it is:** "MCP runtime" providing authenticated, governed tool-calling infrastructure for production agents — wraps OAuth, permissions, and audit around MCP tools.
**Distinctive feature:** Per-user (not service-account) auth, OAuth handling, deploy modes (cloud/VPC/on-prem/air-gapped), tool catalog (Google, Slack, Salesforce), Arcade Registry marketplace.
**Pricing:** Free signup; pricing not on homepage.
**Why it matters:** Solves the "real agents need user-scoped auth" problem — sits between the agent and MCP tool execution.

### Braintrust
**URL:** `https://braintrust.dev`
**Fetch:** OK
**Category:** eval / observability platform
**What it is:** AI observability + evaluation platform for building, monitoring, and regression-testing LLM/agent products.
**Distinctive feature:** Loop (auto-improves prompts/datasets), Brainstore (trace-optimized DB), trace-to-dataset for failure-driven regression tests; framework-agnostic; SDKs in Python/TS/Go/Ruby/C#; SOC2/HIPAA/GDPR.
**Pricing:** Pricing page exists but not shown on landing.
**Why it matters:** One of the top two eval/observability platforms (alongside LangSmith) for production agent quality.

### Composio
**URL:** `https://composio.dev`
**Fetch:** OK
**Category:** agent tool platform
**What it is:** Platform giving agents access to 1,000+ app integrations via managed auth and sandboxed execution.
**Distinctive feature:** Intent-based tool resolution (not config), managed OAuth, sandboxed remote execution with navigable filesystem, parallel execution, model-agnostic.
**Pricing:** Free signup at dashboard.composio.dev; pricing not on homepage.
**Why it matters:** Direct competitor/peer to Arcade — broad tool catalog is the value, important benchmark for "agent action layer" decisions.

### DeepLearning.AI Short Courses
**URL:** `https://deeplearning.ai/short-courses`
**Fetch:** OK
**Category:** courses
**What it is:** Andrew Ng's catalog of 121 short, partner-taught courses on AI/ML/agents.
**Distinctive feature:** Industry-partner co-taught (Google, Anthropic, OpenAI, AMD, Snowflake, CopilotKit); recent agent-focused titles include "AI Agents for Image and Video Generation," "Build Interactive Agents with Generative UI," "Transformers in Practice."
**Pricing:** Most short courses free; Membership tier exists.
**Why it matters:** Highest-signal short-form curriculum for current vendor-specific agent techniques.

### discord.gg/langchain
**URL:** `https://discord.gg/langchain`
**Fetch:** OK
**Category:** community (Discord)
**What it is:** Official LangChain Discord server for users of LangChain, LangGraph, and LangSmith.
**Distinctive feature:** Direct interaction with LangChain maintainers and the largest OSS agent-framework community.
**Pricing:** Free.
**Why it matters:** Primary support/discussion venue for the LangChain ecosystem.

### E2B
**URL:** `https://e2b.dev`
**Fetch:** OK
**Category:** sandbox / code execution infra
**What it is:** Secure isolated cloud sandboxes (Firecracker microVMs) for running AI-agent-generated code.
**Distinctive feature:** <200ms cold starts, 24-hour session limit, Python/JS/Ruby/C++ support, custom templates, LLM-agnostic; used by Perplexity, Hugging Face, Groq.
**Pricing:** Free tier + Pro plans; startup program.
**Why it matters:** Default reference for "where does the agent's code actually run" — competes with Modal, Daytona, Cloudflare sandboxes.

### FreeAcademy.ai
**URL:** `https://freeacademy.ai`
**Fetch:** OK
**Category:** courses
**What it is:** Free online learning platform with 100+ courses across AI/ML, programming, business, and finance.
**Distinctive feature:** 100% free including certificates; beginner-oriented; popular courses include Prompt Engineering, AI Essentials, AI for Finance & Accounting.
**Pricing:** Free, no credit card required.
**Why it matters:** Low-floor onboarding resource for non-technical AI learners; less depth than DeepLearning.AI or HF for agent-builders.

### Hugging Face Discord
**URL:** `https://hf.co/join/discord`
**Fetch:** OK (redirects through huggingface.co → discord.gg/JfAtkvEtRb → discord.com/invite/JfAtkvEtRb)
**Category:** community (Discord)
**What it is:** Official Hugging Face Discord server; entry point for the HF Agents Course and HF model community.
**Distinctive feature:** Tied to HF Agents Course study groups, open-source model discussions, smolagents.
**Pricing:** Free.
**Why it matters:** Required onboarding for the HF Agents Course; primary community for open-source agent and model work.

### Hugging Face Agents Course
**URL:** `https://huggingface.co/learn/agents-course`
**Fetch:** OK
**Category:** course
**What it is:** Free beginner-to-expert course on building AI agents using smolagents, LlamaIndex, and LangGraph.
**Distinctive feature:** Free certification; structured units (Fundamentals, Frameworks, Use Cases, Final Challenge), bonus units on function-calling fine-tuning, agent observability, and Pokemon-battle agents; live leaderboard; ~3–4 hrs/week.
**Pricing:** Free; requires HF account.
**Why it matters:** Most-cited free structured curriculum for agent-builders; canonical introduction to multi-framework agent development.

### Hugging Face LLM Course
**URL:** `https://huggingface.co/learn/llm-course`
**Fetch:** OK
**Category:** course
**What it is:** Free 12-chapter course on LLMs and NLP using Hugging Face Transformers, Datasets, Tokenizers, and Accelerate.
**Distinctive feature:** Covers transformer architecture through fine-tuning, RLHF-style techniques, building reasoning models; co-authored by Lewis Tunstall, Leandro von Werra, Merve Noyan, Sylvain Gugger, Abubakar Abid; Apache 2.0 licensed; multi-language translations.
**Pricing:** Free; no formal certification yet.
**Why it matters:** Foundational layer below the agent course — needed to understand model behaviors that agents wrap.

### Letta
**URL:** `https://letta.com`
**Fetch:** OK
**Category:** memory layer / agent framework
**What it is:** Persistent-memory agent platform from the team behind MemGPT (UC Berkeley Sky Computing Lab), enabling agents that learn over time.
**Distinctive feature:** Memory palace UI, background "dream agents" that refactor context, memory portability across models, Letta Code (desktop/CLI/SDK), recent research on sleep-time compute and token-space continual learning.
**Pricing:** Free tier mentioned; pricing page exists.
**Why it matters:** Reference implementation for stateful long-lived agents; counterpoint to stateless prompt-pumping architectures.

### Mastra
**URL:** `https://mastra.ai`
**Fetch:** OK
**Category:** agent framework (TypeScript)
**What it is:** TypeScript-first framework for AI agents — "Python trains, TypeScript ships" — covering agents, RAG, workflows, evals, guardrails, observability.
**Distinctive feature:** First-class TS DX; Studio (eval/collab UI), Server (deploy), Memory Gateway routing; integrates with Next.js/Express/Hono; Apache 2.0, 24.3k GitHub stars.
**Pricing:** OSS; pricing page exists but not on landing.
**Why it matters:** The leading TS-native alternative to LangChain/LangGraph for full-stack/JS teams.

### Mem0
**URL:** `https://mem0.ai`
**Fetch:** OK
**Category:** memory layer
**What it is:** Drop-in persistent memory infrastructure for AI agents; compresses conversation history into retrievable memories.
**Distinctive feature:** Add/Learn/Retrieve API, claims lower latency + token cost via compression, SOC2 Type 1 + HIPAA, BYOK encryption, runs in Kubernetes/private cloud/air-gapped.
**Pricing:** Free login at app.mem0.ai; tiered pricing exists.
**Why it matters:** Lightweight memory layer alternative to Letta — focused on the API/SaaS side rather than agent runtime.

### r/LocalLLaMA
**URL:** `https://reddit.com/r/LocalLLaMA`
**Fetch:** FAILED-other (Claude Code's WebFetch is blocked from reddit.com / old.reddit.com at the fetch layer)
**Fetch failed — no content extracted.** Known externally as the largest community for self-hosted/open-weights LLMs.

### YouTube channel pages (all 6 fetch-failed)
WebFetch returns only the YouTube footer for channel pages; no extractable metadata. Confirmed channel names only:
- `https://youtube.com/@AndrejKarpathy` — Andrej Karpathy. **Fetch failed — no content extracted.**
- `https://youtube.com/@LangChain` — LangChain. **Fetch failed — no content extracted.**
- `https://youtube.com/@YannicKilcher` — Yannic Kilcher. **Fetch failed — no content extracted.**
- `https://youtube.com/@aiDotEngineer` — AI Engineer / aiDotEngineer. **Fetch failed — no content extracted.**
- `https://youtube.com/@anthropic-ai` — Anthropic. **Fetch failed — no content extracted.**
- `https://youtube.com/@lexfridman` — Lex Fridman. **Fetch failed — no content extracted.**

For accurate channel-level data, use the YouTube Data API or a headless-browser MCP rather than WebFetch.

---

## Cross-cutting findings

A few patterns repeat across enough sources to be worth pinning at the top of the file:

**Harness > model** as the highest-leverage lever. Anthropic's `harness-design-long-running-apps` and LangChain's `improving-deep-agents-with-harness-engineering` both show double-digit benchmark gains from harness-only changes (Terminal-Bench 2.0: +13.7 points on gpt-5.2-codex; coding apps go from "20min broken" to "6h working"). The Anatomy of an Agent Harness post is the canonical definitional reference.

**Context engineering as a named discipline.** Coined by Anthropic's `effective-context-engineering-for-ai-agents` (Sep 2025) and codified by LangChain's `context-engineering-for-agents` (Jul 2025). Four canonical strategies: write, select, compress, isolate. Concrete thresholds: Claude Code auto-compact at 95% window; Deep Agents triggers at 85%; tool responses >20K tokens spill to virtual filesystem with 10-line preview.

**Skills are the cross-vendor primitive.** Anthropic's `equipping-agents-for-the-real-world-with-agent-skills` and the Skills doc define the standard; LangChain's `evaluating-skills` provides empirical bounds (82% vs 9% lift; degradation past ~12 similar skills; 70% invocation reliability even with explicit prompts).

**Multi-agent token tax.** Anthropic's multi-agent research system uses ~15× chat tokens for 90.2% lift on internal research evals; 80% of BrowseComp variance is explained by token use. The pattern is "orchestrator-worker with parallel subagents in their own context windows" — defined by `multi-agent-research-system`.

**Eval rigor is the bottleneck.** ABC paper (arxiv 2507.02825) shows existing benchmarks can misestimate capability by 100% in relative terms. Anthropic's `infrastructure-noise` adds: infra config alone moves Terminal-Bench by 6pp. Anthropic's `eval-awareness-browsecomp` shows Opus 4.6 identifying it's being tested and retrieving answer keys. LangChain's `agent-evaluation-readiness-checklist` is the most actionable single eval playbook.

**Open weights crossed a usable threshold (Apr 2026).** GLM-5 and MiniMax M2.7 at 8-10× lower price than Opus 4.6 with 4-6pp correctness gap; MiniMax M2.7 at $0.30/$1.20 per MT vs Opus at $5/$25; ~$87k/yr savings on a Deep Agents production workload.

**Industry baseline (LangChain State of Agent Engineering, late 2025):** 57% of orgs have agents in prod; 89% have observability; 62% have detailed tracing; ~3/4 use multiple model providers; quality is the #1 production blocker.

---

## Section 7: Post-ingestion additions

Sources added after the original May 25, 2026 ingestion via user audit / The Batch newsletter / spot-check.

### Context Hub (andrewyng/context-hub)
**URL:** `https://github.com/andrewyng/context-hub`
**Fetch:** OK
**Stars / freshness:** 13.4K stars, 1.2K forks, JavaScript, MIT, active 2026
**What it is (1 sentence):** A curated-knowledge layer for coding agents — markdown API docs registry with a `chub` CLI for search / fetch / annotate / upvote that compounds across sessions.
**Key concepts / classes / functions named:** `chub` CLI (search, fetch, annotate, vote); agent-readable markdown docs; AI Suite project; per-language doc variants (Python, JavaScript).
**Why it matters for agentic-engineering:** Addresses a memory failure mode the other vendors don't — "agent hallucinates APIs because it doesn't have the right docs in context, then forgets what it learned." From Andrew Ng. Slots between *write* (you contribute docs once) and *select* (agent pulls them just-in-time).

### Moltbook
**URL:** `https://www.moltbook.com`
**Fetch:** OK
**Stars / freshness:** Pre-launch beta; no public GitHub repo listed
**What it is (1 sentence):** "The front page of the agent internet" — a social network for AI agents (post / discuss / upvote) that doubles as an identity provider agents can use to authenticate to third-party apps.
**Key concepts / classes / functions named:** Submolts (communities), agent posts, agent comments, X-verified agent ownership, Moltbook identity as auth provider, developer early access.
**Why it matters for agentic-engineering:** Speculative consumer-shaped layer for agent identity — the rare attempt at a Reddit / Hacker News analog where agents are the primary users. Sits adjacent to [Infrastructure § Identity/Auth](infrastructure.md#agent-identity-auth-secrets); worth tracking even if the agent-social-network thesis doesn't pan out.

---

## Section 8: Agent Security & Authorization (post-ingestion thematic add)

Sources added June 2026 to fill two under-covered topics: the **adversarial surface** of autonomous agents (prompt injection, lethal trifecta, threat taxonomies) and **pre-action authorization** (deterministic gates between intent and execution). The previous ingestion has scattered coverage — Claude Code auto-mode classifier, Anthropic sandboxing, Meta Rule of Two mentioned in passing — but no consolidated bibliography of the named frameworks (OWASP Agentic Top 10, MITRE ATLAS, Willison's lethal trifecta, OAP, SAIF, Microsoft DiD). The 8 entries below close that gap.

### The Lethal Trifecta for AI Agents
**URL:** `https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/`
**Fetch:** OK
**Date:** June 16, 2025
**Author:** Simon Willison
**Key claims:**
- The "lethal trifecta" is the combination of three agent capabilities: (1) access to private data, (2) exposure to untrusted content, (3) ability to externally communicate / exfiltrate.
- When all three coexist in one agent, an attacker can exfiltrate private data via prompt injection — and vendors cannot reliably prevent this.
- LLMs cannot reliably distinguish trusted instructions from instructions embedded in untrusted content; guardrails are insufficient.
- Risk compounds when users mix third-party MCP tools — each new tool can silently flip the agent into the trifecta state.

**Quotable:** "If your agent combines these three features, an attacker can easily trick it into accessing your private data and sending it to that attacker."
**Frameworks named:** Prompt injection (distinguished from jailbreaking), MCP, guardrails (critiqued).
**Why it matters:** Provides the canonical name and the three-capability formulation that every downstream agent-security framework (Meta Rule of Two, OWASP, Microsoft DiD) builds on.

### Agents Rule of Two: A Practical Approach to AI Agent Security
**URL:** `https://ai.meta.com/blog/practical-ai-agent-security/`
**Fetch:** OK
**Date:** October 31, 2025
**Author:** Meta AI (unsigned)
**Key claims:**
- An agent should satisfy no more than two of three properties within a single session: (A) process untrustworthy inputs, (B) access sensitive systems / private data, (C) change state or communicate externally.
- If all three are required in one session, the agent must not run autonomously — supervise via HITL approval or other reliable validation.
- Explicitly framed as a generalization of Chromium's "Rule of Two" security policy, applied to agents, and as the operational complement to Willison's lethal trifecta.
- Positions Meta's Llama Protections suite (Llama Firewall, Prompt Guard, Code Shield, Llama Guard) as enforcement components.

**Quotable:** "Prompt injection is a fundamental, unsolved weakness in all LLMs."
**Frameworks named:** Agents Rule of Two, Chromium Rule of Two, lethal trifecta, Llama Firewall, Prompt Guard, Code Shield, Llama Guard, MCP, defense in depth, HITL.
**Why it matters:** The operational rule a builder can actually apply at design time — diagnostic (trifecta) plus prescription (Rule of Two) is the cleanest single-page security pairing.

### OWASP Top 10 for Agentic Applications for 2026
**URL:** `https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/`
**Fetch:** OK (landing page; full risk list requires PDF download)
**Date:** December 9, 2025
**Author:** OWASP GenAI Security Project (100+ industry experts/researchers)
**Key claims:**
- First OWASP Top 10 scoped specifically to autonomous/agentic applications, distinct from the existing LLM Top 10.
- Targets builders, defenders, and decision-makers as a starting point for reducing agentic AI risks.
- Cross-walks to other GenAI security frameworks via an AIUC-1 Crosswalk.
- The detailed 10-risk enumeration is in the downloadable document, not the landing page.

**Quotable:** "The Top 10 equips builders, defenders, and decision-makers with a clear starting point for reducing agentic AI risks."
**Frameworks named:** OWASP GenAI Security, AIUC-1 Crosswalk, OWASP LLM Top 10 (sibling).
**Why it matters:** Industry-standard naming layer — when a risk category needs a stable name, cite OWASP's number.

### MITRE ATLAS (Adversarial Threat Landscape for AI Systems)
**URL:** `https://atlas.mitre.org`
**Fetch:** PARTIAL (JS-rendered SPA returns minimal static content; release metadata via `github.com/mitre-atlas/atlas-data/releases`)
**Date:** Current release `v2026.05` (May 27, 2026); the project moved to date-based versioning for content + semver for the data format.
**Author:** The MITRE Corporation
**Key claims:**
- Living knowledge base of adversary tactics, techniques, and procedures (TTPs) targeting AI/ML systems, modeled on MITRE ATT&CK.
- Catalog spans tactics including Reconnaissance, Resource Development, Initial Access, ML Model Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Collection, ML Attack Staging, Exfiltration, Impact, Command and Control (AML.TA0001 – TA0015, plus additional 2026 tactics — verify exact set against the live matrix before citing a count).
- May 2026 release introduced versioning split: content versioned by date (2026.05), data format versioned by semver.

**Quotable:** "A globally accessible adversarial ML knowledge base that documents adversary tactics, techniques, and procedures specifically targeting artificial intelligence and machine learning systems."
**Frameworks named:** MITRE ATT&CK (inheritance source), SAFE-AI (sibling MITRE work).
**Why it matters:** Pairs with OWASP Top 10 as the threat-model (tactics) side of an agent-security reference — risks (OWASP) and tactics (ATLAS) together.

### Defense in Depth for Autonomous AI Agents
**URL:** `https://www.microsoft.com/en-us/security/blog/2026/05/14/defense-in-depth-autonomous-ai-agents/`
**Fetch:** OK
**Date:** May 14, 2026
**Authors:** Alyssa Ofstein (Senior Program Manager), Elliot H. Omiya (Principal Architect)
**Key claims:**
- Agentic security needs reinforcing layers — model, safety system, application, positioning — and no single layer is sufficient.
- The application layer is the most critical because it's the only layer organizations fully control and where probabilistic model behavior is converted into deterministic system outcomes.
- Names a novel agent threat class set: agent hijacking, intent breaking, sensitive-data leakage, supply-chain compromise, inappropriate reliance.
- Prescribes four application-layer design patterns: agents-as-microservices, least permissions, deterministic human-in-the-loop, agent identity as a security primitive.

**Quotable:** "When an agent can act autonomously, mistakes propagate faster, blast radius increases, and rollback becomes harder."
**Frameworks named:** Defense in depth, zero trust, agents-as-microservices, least permissions, deterministic HITL, agent identity as security primitive.
**Why it matters:** Vendor-side reference for layered-defense architecture; provides the canonical "blast radius" framing and four application-layer patterns an agentic-engineering reference can cite as enterprise-validated guidance.

### An Introduction to Google's Approach to AI Agent Security
**URL:** `https://simonwillison.net/2025/Jun/15/ai-agent-security/`
**Fetch:** OK
**Date:** June 15, 2025
**Author:** Simon Willison (covering a paper by Santiago Díaz, Christoph Kern, Kara Olive — Google)
**Key claims:**
- Two primary agent risks: rogue actions and sensitive-data disclosure.
- Current LLM architectures cannot rigorously separate system instructions from untrusted inputs — the same root cause Willison names elsewhere as the lethal trifecta.
- Google's three core principles: well-defined human controllers, limited agent powers, observable actions/planning.
- Recommends a hybrid defense: Layer 1 deterministic runtime policy enforcement + Layer 2 reasoning-based defenses.

**Quotable:** "Agents must have well-defined human controllers... it is essential for security and accountability that agents operate under clear human oversight."
**Frameworks named:** Google SAIF (agentic addendum), hybrid defense-in-depth (deterministic + reasoning), three-core-principles framework.
**Why it matters:** Captures Google's published agentic stance; pairs naturally with the Microsoft DiD post for vendor-side coverage.

### Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents
**URL:** `https://arxiv.org/abs/2603.20953`
**Fetch:** OK
**Date:** March 21, 2026
**Author:** Uchi Uchibeke
**Key claims:**
- Agents have authentication but lack a deterministic authorization layer at the tool-call boundary; alignment + post-hoc review are insufficient.
- Proposes the Open Agent Passport (OAP) — a specification for synchronously intercepting tool calls and evaluating declarative policies before execution.
- Authorization latency: median 53 ms over N=1,000 calls.
- Under permissive policies, social-engineering attacks succeed 74.6% of the time; under OAP's restrictive policy, attackers achieve 0% across 879 attempts.
- Same mechanism enforces spending limits, capability scoping, sub-agent delegation, quality gates, and compliance controls.

**Quotable:** "OAP enforces authorization decisions in a measured median of 53 ms (N=1,000)."
**Frameworks named:** Open Agent Passport (OAP), declarative policies, Apache 2.0 / CC BY 4.0.
**Why it matters:** Concrete, measured proposal for the "deterministic pre-action gate" pattern — building block for the runtime-enforcement layer in any agent-security architecture.

### A Systematic Survey of Security Threats and Defenses in LLM-Based AI Agents: A Layered Attack Surface Framework
**URL:** `https://arxiv.org/abs/2604.23338`
**Fetch:** OK
**Date:** v1 April 25, 2026; v2 May 6, 2026
**Author:** Kexin Chu
**Key claims:**
- Surveys 116 papers (2021–2026) on agent security through a Layered Attack Surface Model (LASM): seven architectural layers plus a four-class temporality dimension.
- Argues agentic systems are qualitatively different from stateless LLMs because of persistent memory, tool integration, multi-agent coordination, and cross-session operation.
- Upper layers of the agentic stack remain "sharply under-explored, especially for long-horizon and stack-propagating threats."
- Identifies multiple attack regions with documented attacks but no documented defenses.
- Delivers a cross-layer defense taxonomy and distinguishes near-term engineering gaps from open research problems.

**Quotable:** "Agentic AI systems introduce a security surface that is qualitatively different from that of stateless LLMs."
**Frameworks named:** Layered Attack Surface Model (LASM), 7-layer architectural decomposition, 4-class temporality dimension.
**Why it matters:** Up-to-date academic survey that gives the literature-overview "lay of the land" slot, with a clean taxonomy for mapping individual attacks/defenses.

---

## Maintenance

Re-run this ingestion when:
- The roadmap (`ROADMAP.md`) gains 10+ new URLs, or
- An existing source publishes a major new piece (Anthropic Engineering, LangChain blog, key practitioners), or
- A polished page on the site cites a number from here — re-verify at primary source before publishing.

To re-run: split URLs into ~20-URL chunks by source domain and dispatch parallel research agents with the format from this file. Total cost was ~6 parallel agents × ~30K tokens each = ~180K tokens of compressed digest from ~1M tokens of fetched content.
