---
name: automate-engineering
description: Comprehensive reference for agentic engineering — the discipline of building reliable autonomous coding agents and AI-native software systems. Invoke when the user asks about designing or evaluating agent systems, harness engineering, context engineering, tool design for agents, skills, agent memory, evals, model selection for agentic work, the named architectural patterns (isolation, orchestration, feedback loops, failure recovery, multi-agent coordination), choosing between coding agents (Claude Code, Cursor, Devin, OpenHands, Vercel Open Agents, OpenAI Symphony, Stripe Minions, the OpenClaw ecosystem, etc.), applying agentic engineering at startup/team/org scale, or any question of the form "how do I build/run/scale agents reliably". Distilled from the automate.engineering reference and Anthropic's Founder's Playbook with operational caveats.
---

# Automate Engineering — the working reference

The agentic engineering discipline in one skill. Use this as the entry point: it gives the conceptual frame and decision shortcuts; deeper reading lives in the site's chapters (linked throughout).

When a user asks an agentic-engineering question, the move is:
1. **Identify which named practice it touches** (harness / context / tool / skills / memory / evals / model selection).
2. **Lead with the failure mode** the question implies — most questions are problems wearing capability-questions' clothes.
3. **Give the decision shortcut** (a 1–3 line rule) before the explanation.
4. **Point at the deep chapter** if they want more.

---

## The discipline in one paragraph

Agentic engineering is the practice of building systems where **autonomous coding agents** — LLMs with tool access running in loops — produce reliable production work. The named practice has a few central insights: model upgrades alone don't fix unreliability (the *harness* matters more than the model); the dominant lever is **context engineering** (curating what's in the window); **tools** are the agent's effective programming language and deserve more design care than they usually get; **skills** are how engineering taste persists across sessions; and **evals** are the foundation everyone skips. Founders and teams applying this are seeing 10× compression of timelines — at the cost of new failure modes (compounding agentic debt, false PMF, scope creep without friction, confirmation bias with a research engine).

---

## The six named practices

Each has a chapter on the site. Cite the relevant one when the question is deep.

### 1. Harness Engineering — the umbrella discipline
**Core insight:** the scarcest resource is synchronous human attention; everything else parallelizes across agents. Software must be written for agent **legibility** as much as human readability.

**Five subsystems** every harness has: isolation (sandboxes, worktrees), orchestration (loops, queues), context (memory, retrieval), feedback (build/test/eval loops), failure recovery (rollback, escalation).

**Decision rule:** if your agent fails, don't blame the model — ask **what's missing from the harness** that would have prevented it. Then build that.

**Hard constraints worth treating as gospel:** one-minute build loops; observability spawned *before* application code; code-as-context (consistent codebase = better agent behavior); code-as-disposable (worktrees are cheap, dependencies can be inlined).

Deep reading: [harness-engineering.md](https://automate.engineering/#harness-engineering), [latent.space/p/harness-eng](https://www.latent.space/p/harness-eng).

### 2. Context Engineering — the dominant lever
**Core insight:** "Context engineering is the #1 job of engineers building AI agents" (Cognition/LangChain). Every token in the window depletes an *attention budget* — accuracy decreases as the window fills even though the model technically supports the length. This is "context rot."

**The four strategies** (LangChain taxonomy):
- **Write** — externalize state to filesystem, git, progress files, knowledge registries (Andrew Ng's Context Hub)
- **Select** — load only what's relevant just-in-time (Anthropic Tool Search Tool, progressive skill disclosure)
- **Compress** — summarize then reinitialize; Claude Code auto-compacts at 95% utilization, Deep Agents at 85%
- **Isolate** — give subagents fresh windows; orchestrator-worker pattern (Anthropic's research system: ~15× tokens, 90.2% lift)

**Decision rule:** if the agent's accuracy is degrading mid-session, the answer is almost always *write more out of the window* before *fit more in*.

**Key empirical numbers:** auto-compact at 85–95% utilization; 20K-token tool responses spill to virtual FS with 10-line previews; ~12-skill ceiling before the catalog itself becomes noise.

Deep reading: [context-engineering.md](https://automate.engineering/#context-engineering), Anthropic's [Effective Context Engineering for AI Agents](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents).

### 3. Tool Design — the agent's programming language
**Core insight:** the tool layer is leverage. A poorly designed tool burns tokens, returns noise, and forces the agent to compensate downstream. Good tool design beats good context engineering at the tool layer.

**The four design rules:**
1. **Consolidate, don't expose your API surface.** Don't ship `list_users`, `get_user`, `update_user` as 12 separate tools — ship one `users` tool with verbs.
2. **Compress every response.** Slack thread responses went 206 → 72 tokens via a `ResponseFormat` enum. 3× compression at the tool layer beats 3× compression at the context layer.
3. **Lazy load — the "too many tools" problem.** Anthropic Tool Search Tool: 5 MCP servers cost ~55K tokens just to define; lazy load preserves 95% of the window and lifts Opus 4 MCP-eval from 49% → 74%.
4. **Code-as-tool.** Give the agent a Python sandbox instead of forcing every operation through tool calls. SQL over APIs is the canonical version of this pattern.

**Programmatic tool calling**, **input_examples**, **tool-use examples** in system prompts — all small wins. Stack them.

**Anti-pattern:** mirroring your REST API as MCP tools. The agent doesn't want your API; it wants the smallest set of high-leverage verbs that compose.

Deep reading: [tool-design.md](https://automate.engineering/#tool-design), Anthropic's [Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents) and [Advanced Tool Use](https://anthropic.com/engineering/advanced-tool-use).

### 4. Skills — encoded engineering taste
**Core insight:** SKILL.md files are how procedures persist across sessions. A skill is a markdown file with frontmatter that declares when it should be loaded; the body is instructions an agent reads when triggered.

**Progressive disclosure** is the key idea: metadata at startup, full SKILL.md when relevant, bundled scripts/files only when actually invoked. This keeps the catalog cheap and the active skill loaded fully.

**Empirical bounds from production:** roughly **~12 active skills** before the catalog itself becomes context noise. Frontmatter `description:` is what the model scans to decide whether to load — put **the verbs an agent would type** ("run," "screenshot," "validate," "deploy"), not generic capability descriptions.

**Anti-patterns to call out:**
- Skill that paraphrases a README (the README already exists)
- Skill that documents a GUI no agent can touch (build the driver)
- Skill with no concrete trigger (description like "helpful utilities for X" — won't match)
- Skill > 500 lines (split via referenced sub-files)

**Security note:** skills are executable instructions. Treat untrusted skills like untrusted code.

Deep reading: [skills.md](https://automate.engineering/#skills).

### 5. Memory — persistent state across sessions
**Core insight:** the conversation window forgets; memory is everything you make it remember. The right primitives are filesystem, git history, progress files, and structured knowledge stores.

**Three layers:**
- **Working memory** — current session context window
- **Episodic memory** — what happened last session (progress files, git log, recent PRs)
- **Semantic memory** — durable knowledge (CLAUDE.md, skills, docs, knowledge registries)

**CLAUDE.md is the single highest-leverage memory primitive.** Every project should have one. It's what every session of Claude Code starts by reading. Without it, each session re-derives architectural decisions and they drift.

**Anthropic memory tool (beta)** plus Deep Agents' filesystem-as-memory plus Andrew Ng's Context Hub all converge on the same answer: *the filesystem is the right memory substrate; the agent reads it on demand*.

Deep reading: [memory.md](https://automate.engineering/#memory).

### 6. Evals — the foundation everyone skips
**Core insight:** if you can't measure whether the agent did the right thing, you can't iterate on the agent. Evals are not optional for production work.

**The mental model:** an eval is a held-out scenario with a known-correct outcome that must keep passing as the agent (or model, or prompt, or harness) changes. They're regression tests for behavior, not code.

**How to start without an eval team:**
1. Collect 20 real examples of what the agent does in production
2. Write down the correct outcome for each
3. Re-run nightly; fail the build on regressions

**pass@k vs pass^k** — the reliability gap. pass@k (best of k attempts) inflates your numbers; pass^k (all k attempts pass) is the metric that matches production. Most published benchmarks use pass@k and overstate reliability.

**Three things that will silently invalidate your numbers:**
1. Train/test contamination
2. Eval prompt drift (you "fixed" a prompt and forgot to revert)
3. Selection bias in your real-example set

**Benchmarks ≠ trustworthy by default.** SWE-Bench is famously contaminated. Treat external benchmarks as directional, not absolute.

Deep reading: [evals.md](https://automate.engineering/#evals), [benchmarks.md](https://automate.engineering/#benchmarks).

---

## The six architectural patterns (cross-cutting)

These show up across every approach. When evaluating an agent system, ask which it does well and which it skips.

| Pattern | What it solves | Canonical example |
|---|---|---|
| **Isolation** | Sandboxing so agent failures don't leak | Worktrees, Docker, e2b, Modal |
| **Orchestration** | How tasks are routed and scheduled | Claude Managed Agents, OpenAI Symphony |
| **Context management** | Window economics (see practice #2 above) | Claude Code auto-compact, Deep Agents |
| **Feedback loops** | Build/test/eval signals back to the agent | One-minute builds, fast iteration |
| **Failure recovery** | Rollback, escalation, retry strategy | Git as the universal undo |
| **Multi-agent coordination** | Orchestrator-worker, parallel subagents | Anthropic research system, Open SWE |

Deep reading: [patterns.md](https://automate.engineering/#patterns).

---

## Model selection — the 5-rule decision shortcut

From the [Models chapter](https://automate.engineering/#models):

1. **Default to Sonnet** for product agent work. Cost/quality sweet spot.
2. **Escalate to Opus** for hard reasoning, architecture decisions, the toughest PRs, complex debugging.
3. **Drop to Haiku** for high-volume background work, classification, simple extraction.
4. **Specialist coding models** (GPT-5.2-codex, Devstral, Qwen3-Coder) for narrow, repetitive, latency-sensitive code work.
5. **Open-weights** (DeepSeek V3.2, Llama 4, Kimi K2, GLM-5) when you need self-hosted, custom fine-tunes, or cost ceilings the closed frontier can't hit.

**Don't over-route.** Most teams burn engineering hours building model routing that saves less than running on one good model end-to-end. Route only when the cost delta is measurable in user-visible metrics.

---

## The Chat / Cowork / Code surface matrix

When the user asks "which Claude surface for X":

| Task shape | Surface | Why |
|---|---|---|
| Quick question, rewrite, sanity check | **Chat** | Fast, conversational, no setup |
| Multi-source synthesis, files + connectors + finished doc, scheduled runs | **Cowork** | Folder access, connectors, skills, scheduled |
| Codebase changes, diffs, git, dev environments | **Code** | Direct repo access, plan mode |

Same Claude underneath; what changes is the workspace around it.

For non-Anthropic stacks, the equivalents are: Chat ↔ ChatGPT/Gemini chat; Cowork ↔ Notion AI / Glean / custom RAG; Code ↔ Cursor, Cline, Continue, Devin, Replit Agent.

---

## Failure mode catalog

These are the most common failure modes across agentic work. When a user describes a problem, match it to one of these and lead with the remedy.

| Failure mode | What it looks like | First-line remedy |
|---|---|---|
| **Agentic technical debt** | Codebase runs but has no coherent mental model; refactors fail | Write CLAUDE.md + scope doc *before* next session |
| **Context rot** | Accuracy drops mid-session | Compact at 85–95%; externalize state to FS |
| **Tool noise** | Tokens burning on tool responses; agent confused | Compress responses; lazy load tools; consolidate |
| **False PMF / false signal** | Launch energy mistaken for fit | Sean Ellis test; effort test (does retention pull or push?) |
| **Zero-friction scope creep** | Every defensible addition pulls the product off-course | Written scope doc with "what it doesn't do" + evidence bar for additions |
| **Confirmation bias amplified** | AI validates whatever you ask | Pair every validation prompt with adversarial inverse |
| **Insecure by inexperience** | AI ships code that works but isn't secure | Security review before any real user; no exceptions |
| **Founder/operator bottleneck** | Hour-decisions take a week | Audit everything personally handled; categorize automate/delegate/keep |
| **Selection bias in evals** | Tests pass but production fails | Sample real production, not curated examples |
| **Benchmark theater** | Numbers go up; reliability doesn't | pass^k not pass@k; verify no train/test contamination |
| **Premature multi-agent** | Coordination overhead exceeds parallelism gain | Single agent + good context first; multi only when single-agent saturated |
| **CLAUDE.md drift** | Decisions in early sessions forgotten by later ones | Update CLAUDE.md at session end, every session, no exceptions |

---

## The adversarial collaborator pattern (use everywhere)

The single most useful technique across stages. Default reflex: every "validate," "size," "identify," "map" prompt gets paired with its adversarial inverse.

Templates:
- "Argue the strongest case against this. Find disconfirming evidence."
- "Make the most compelling case for why a competitor succeeds while I do not."
- "What are the three assumptions this depends on most heavily? What if each fails?"
- "What would a skeptic say about these numbers? Where's the false positive?"
- "Audit my interview questions for leading, future-facing, or socially-desirable phrasing."

AI validates whatever you ask. The remedy is asking adversarially by default.

---

## Decision frameworks (quick lookups)

### Should I add a subagent?
- **Yes, if** the work is parallelizable, the subagent's output is summarizable in <2K tokens, and the orchestrator doesn't need to track its internal state.
- **No, if** it's sequential, requires shared context, or you haven't saturated single-agent yet. *Premature multi-agent is the #1 architectural mistake in this space.*

### Should I write a skill or just a prompt?
- **Skill** if the procedure recurs across sessions, has a stable shape, and benefits from progressive disclosure.
- **Prompt** if it's one-shot, exploratory, or specific to a single task.
- Don't ship a 50-line skill for something that's a 5-line prompt.

### Should I refactor or rewrite the AI-generated code?
- **Refactor** if the mental model is sound and the issues are local.
- **Rewrite** if the codebase has no coherent mental model — refactoring an incoherent base costs more than starting over with a CLAUDE.md.
- The signal: if you can't explain in one paragraph what governs the architecture, rewrite.

### Should I trust this benchmark?
- **pass^k or pass@k?** If pass@k, divide your confidence by k.
- **Train/test contamination check?** If no, treat as directional only.
- **Held-out from your own production?** If no, the number doesn't predict your reliability.

### Should I use Claude Cowork or my existing Notion/Glean/etc?
- **Cowork** if you're starting fresh, want connectors + skills + scheduled runs out of the box, and your workflows aren't deeply embedded elsewhere.
- **Existing tool** if migration cost exceeds capability delta. Most established teams should keep their stack and use Cowork additively, not as a replacement.

### When does the playbook's "lean by design" actually scale?
- Lean teams reach milestones that used to require 30-50 people. They don't (yet) reliably scale beyond ~$1-5M ARR without hiring real engineers who respect the codebase. Plan for the wall.

---

## Founder/team/org application

For startup-specific applications of agentic engineering — stage-by-stage guidance (Idea/MVP/Launch/Scale), failure modes specific to AI-native company-building, the product matrix for choosing surfaces — invoke the `founders-playbook` skill which is the operational distillation of Anthropic's [Founder's Playbook](https://claude.com/blog/the-founders-playbook).

Key cross-references between the two skills:
- **CLAUDE.md discipline** (practice #5 here) → MVP stage in the playbook
- **Adversarial collaborator** → every stage in the playbook
- **Agentic technical debt** → MVP stage failure modes
- **Surface matrix** → applies identically here and there

---

## Operational caveats (read before passing on as gospel)

Surface these when relevant — they're the things that get glossed in vendor content:

1. **Cost matters.** API spend at scale is real. Sonnet at $3/M input is ~30× cheaper than Opus at $90/M; route accordingly. The Anthropic Startups Program (free credits, top rate limits) is the most under-advertised resource for cost-strapped teams.
2. **Evals are foundational, not optional.** No matter how much vendor content skips them, the "is the agent doing the right thing" question doesn't go away. Build the eval before you build the agent.
3. **Data moats erode in the foundation-model era.** "Your user data is your moat" worked in 2015; in 2026, foundation models trained at internet scale undermine most generic behavioral moats. Real moats now: regulated/niche vertical edge cases, workflow integration depth, accumulated test cases.
4. **AI confirms whatever you ask.** The adversarial collaborator pattern is the structural remedy. Without it, you're using an LLM as a confirmation engine.
5. **"Orchestrator" undersells the grind.** Day-to-day agentic work is closer to "eval engineer + spec writer + output verifier" than the orchestrator framing suggests. Set expectations honestly.
6. **Lock-in is lock-in.** "Workflow integration depth" as a moat is operationally accurate; call it what it is.
7. **Native-OS / GPU / closed-platform assumptions in vendor docs.** Headless Linux container? Most "Mac/Windows only" claims are untested on Linux. Try anyway; it usually works with `--no-sandbox` and a few `apt-get` packages.

---

## How to apply this skill in conversation

1. **Identify the practice the question touches** — harness, context, tool, skills, memory, evals. Multiple practices? Lead with the one closest to the failure mode.
2. **Lead with the failure mode.** Don't restate the goal; tell them what's about to go wrong if they don't change course.
3. **Give the decision shortcut first**, then the explanation. "Default to Sonnet. Escalate to Opus for hard reasoning." Not three paragraphs about model tiers.
4. **Cross-reference the chapter** when they want depth, not when they want the answer.
5. **Pair every validation move with adversarial.** Default reflex.
6. **Surface the operational caveats** when the user seems to be taking vendor framing as gospel.
7. **Don't lecture.** A specific question gets a specific answer.

---

## Resources

### The site (deep chapters)
- [automate.engineering](https://automate.engineering) — the full reference
- [Overview](https://automate.engineering/) · [Table of Contents](https://automate.engineering/#table-of-contents) · [Reading List](https://automate.engineering/#reading-list)
- **Foundations:** [Approaches](https://automate.engineering/#approaches) · [Patterns](https://automate.engineering/#patterns) · [Harness Engineering](https://automate.engineering/#harness-engineering) · [Context Engineering](https://automate.engineering/#context-engineering) · [Tool Design](https://automate.engineering/#tool-design) · [Skills](https://automate.engineering/#skills) · [Memory](https://automate.engineering/#memory) · [Evals](https://automate.engineering/#evals) · [Benchmarks](https://automate.engineering/#benchmarks) · [Models](https://automate.engineering/#models)
- **People & Orgs:** [Schools](https://automate.engineering/#schools) · [Who's Who](https://automate.engineering/#who-is-who) · [Organizations](https://automate.engineering/#organizations)
- **Infrastructure:** [Inference](https://automate.engineering/#inference) · [Sandboxes](https://automate.engineering/#sandboxes) · [Hosting](https://automate.engineering/#infrastructure)

### Companion skills in this project
- `founders-playbook` — startup-stage operational guidance (Idea / MVP / Launch / Scale)
- `run-agentic-engineering` — build/serve/screenshot the site itself

### Canonical external reading
- [Effective Context Engineering for AI Agents](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic
- [Context Engineering for Agents](https://www.langchain.com/blog/context-engineering-for-agents) — LangChain
- [Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents) — Anthropic
- [Advanced Tool Use](https://anthropic.com/engineering/advanced-tool-use) — Anthropic
- [Harness Engineering essay](https://www.latent.space/p/harness-eng) — Latent Space
- [Founder's Playbook](https://claude.com/blog/the-founders-playbook) — Anthropic
