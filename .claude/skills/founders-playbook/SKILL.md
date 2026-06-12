---
name: founders-playbook
description: Operational guidance for building an AI-native startup. Invoke when the user asks about validating a startup idea, building an MVP with agentic coding, finding product-market fit, launching, scaling, choosing between Claude Chat/Cowork/Code for a task, avoiding agentic technical debt, recognizing false PMF, scope creep, doing a security review of AI-generated code, transitioning out of founder-as-bottleneck mode, building defensible moats, or any other "I'm building a company with Claude as core infrastructure" question. Compiled from Anthropic's Founder's Playbook (May 2026, claude.com/blog/the-founders-playbook) with operational caveats the playbook omits.
---

# Founder's Playbook (Operational)

A working guide for founders building AI-native startups. The job hasn't changed — find a real problem, build something that solves it, scale it into a business. What's changed is that AI compresses each stage. This skill turns the playbook into action.

## First: diagnose what stage they're in

Before giving any advice, figure out where the founder actually is. Ask if it's not obvious:

| If they're... | They're in stage | Their main job is |
|---|---|---|
| "I have an idea" / "Should I build this?" / chasing the problem | **Idea** | Research & validation |
| Building first version / talking to early users | **MVP** | Generate evidence of PMF |
| Have users, growing, hitting infra/ops walls | **Launch** | Repeatable growth + harden infra |
| At material scale, going enterprise / IPO / acquisition | **Scale** | Build a real company around the product |

If the founder describes a multi-stage problem (e.g., "we have 20 users and I want to add 5 features") — anchor them to the earlier stage. Premature scaling is the #1 failure mode at every stage transition.

## Cross-cutting patterns (apply at every stage)

### 1. Adversarial collaborator (most important technique in the playbook)

Default reflex: every time the founder asks Claude to validate, also ask Claude to argue against. Concretely:

- "Argue the strongest case against this idea. Find disconfirming evidence."
- "Make the most compelling case for why a competitor in this space succeeds while I do not."
- "What are the three assumptions this depends on most heavily? What if each one fails?"
- "Audit my interview questions for leading, future-facing, or socially-desirable phrasing."
- "What would a skeptic say about these traction numbers? Where is the false positive?"

If the founder isn't using Claude adversarially, they're using it as a confirmation engine.

### 2. The product matrix (Chat / Cowork / Code)

| If the task is... | Reach for | Why |
|---|---|---|
| A quick question, rewrite, sanity-check | **Chat** | Fast, conversational, no setup |
| Multi-source research, synthesizing files, producing a finished doc/deck/sheet, scheduled jobs | **Cowork** | Folder access, connectors, skills, scheduled runs |
| Writing, testing, shipping code; touching a repo | **Code** | Codebase access, diffs, git, dev envs |

When the founder asks "should I use X or Y?" — match the task shape to the column.

### 3. CLAUDE.md discipline (MVP onward — non-negotiable)

The single highest-leverage practice in the playbook. Every founder shipping code with Claude must:

- Write architectural decisions, constraints, and patterns into `CLAUDE.md` **before** Claude Code writes production code
- Start each Code session by referencing it
- End each session by logging what was built, what decisions surfaced, what assumptions were introduced
- Treat the codebase as something you collaborate with Claude on across many sessions, not a one-shot generation

Without this: each session re-derives foundational decisions, drift compounds, and you end up with a codebase that runs but has no coherent mental model behind it. That collapses around the first real refactor.

---

## Idea stage

### Goal
Research-oriented validation. Assemble qualitative evidence that a real problem exists and your proposed solution effectively addresses it — **before** committing to build.

### Exit criteria
All three must be true:
1. **Problem is real and specific.** You can name exactly who has it, how often, how severely, what they currently do about it.
2. **Solution addresses the problem the validation surfaced** (not the one you originally assumed).
3. **Enough signal to justify building.** Not certainty — that's its own failure mode — but a reasoned decision over an act of faith.

### Failure modes
- **Mistaking building for validating.** AI makes prototypes cheap; the prototype existing is not evidence the hypothesis is right. The conversations with users about the prototype are the evidence.
- **Premature scaling.** Agentic coding will refactor a bad idea with the same enthusiasm as a great one. Keep sense-making ahead of building.
- **Loss of objectivity.** AI gives confirmation bias a research engine. Pressure-test relentlessly.

### Concrete prompts and exercises

**Sharpen the hypothesis:**
> "Help me sharpen this problem statement until it's testable. Specifically: who has it, how often, how severely, what they currently do about it. Push back if my statement is too vague to test."

**Pressure-test:**
> "Argue against my hypothesis. Find the strongest disconfirming evidence. What would a skeptic say?"

**Map the competitive landscape:**
> "Map my competitive landscape by tier: direct, indirect, potential acquirers, adjacent. For each tier, argue why it's a genuine threat — not the easy-to-dismiss version."

**Customer discovery interview audit:**
> "Audit my interview questions. Flag any that are: leading, future-facing ('would you use X?'), too broad, or likely to produce socially desirable answers. Suggest follow-up probes for the moments most likely to generate deflection."

**Post-interview synthesis (after every 5 interviews):**
> "Here are my notes. Produce two lists: evidence that supports my hypothesis, evidence that challenges it. If list 1 is much longer than list 2, tell me whether that reflects the data or what I wanted to find."

**Solution stress-test:**
> "Identify the three assumptions my design depends on most heavily. What has to be true for each to hold? What are the consequences if any one fails?"

**Trends check:**
> "Identify three external trends — regulatory, technological, or demographic — that could significantly affect this market in the next two years. For each, is it a tailwind or headwind for my specific hypothesis?"

**Prototype rule:** Build only the **single core interaction** the solution depends on. Put it in front of 5 people from the validated target profile. What you learn in those 5 conversations determines whether to keep building.

---

## MVP stage

### Goal
Translate a validated problem into a working product real users actually use. **Generate evidence of PMF — not feature completeness.** Move fast without accruing compounding technical debt.

### Exit criteria
Genuine evidence of PMF — a specific identifiable group finds the product valuable enough to **retain, pay, or refer**. Pattern across multiple iteration cycles, not a single data point.

Two operational litmus tests:
- **Sean Ellis test:** "How would you feel if you could no longer use this?" >40% "very disappointed" is a meaningful indicator.
- **Effort test:** Pre-PMF, retention requires constant founder intervention. Post-PMF, the product starts doing that work on its own. When things pull instead of push, something real has changed.

### Failure modes
- **Agentic technical debt** (compounds, doesn't accumulate). Without specs and CLAUDE.md, every session re-derives foundations and drifts. The result is a codebase with no coherent mental model.
- **False PMF.** Launch energy is ephemeral (founder's network, HN spike, portfolio company prospects). Doesn't predict week 6 or 12.
- **Zero-friction scope creep.** When each feature takes an afternoon, every defensible-in-the-moment addition pulls the product off-course.
- **Insecure by inexperience.** Agentic coding generates code that works, not code that's secure. Vulnerabilities are invisible until exploited. No natural feedback loop.

### Concrete prompts and exercises

**Define architecture before coding (creates CLAUDE.md):**
> "I'm building [product]. Core problem: [X]. Target users: [Y]. Realistic 6-month scale: [Z]. Help me define: architectural principles, dependencies to avoid given my constraints, tradeoffs I'm consciously accepting at this stage. Output a draft I can save as CLAUDE.md."

**Define MVP scope (creates a scope doc):**
> "Help me write a scope document. Three sections: what this MVP does, what it deliberately does not do, what specific evidence from real users would justify adding something new."

**Session template for Claude Code:**
> Start: reference CLAUDE.md + scope doc + today's specific task + constraints.
> End: log what was built, what decisions surfaced, what assumptions were introduced.

**Pressure-test new feature requests:**
> "A user asked for feature X. Is this genuine signal or founder enthusiasm dressed up as product thinking? What would have to be true in the data for this to clear the bar in my scope doc?"

**Security review (before any real user):**
> "Review this code for: authentication and session handling, data exposure in API responses, input validation and injection risks, dependencies with known vulnerabilities. Treat each finding seriously. Flag anything that touches auth, secrets, or data handling for human review."

This is **not** a substitute for security tooling or a human reviewer at higher stakes. It's the minimum responsible threshold.

**Build the measurement framework BEFORE launch:**
> "For [product] with [users], define: retention benchmarks, activation criteria, Day 7 and Day 30 targets. Now define what a false positive looks like for this product specifically — signups without activation, revenue without retention, enthusiasm without repeat usage. When data arrives, I'll ask you to make the adversarial case against my traction numbers."

**Diagnostic when PMF isn't moving (after 3+ iteration cycles):**
> "Here's my retention data, user feedback, and original hypothesis. Three questions: (1) Is there a segment in this data responding differently than the rest? (2) Is the gap between designed and experienced value a positioning problem or a product problem? (3) What would have to be true for the current product to find genuine PMF, and is that scenario realistic?"

---

## Launch stage

### Goal
Turn early traction into repeatable, sustainable growth. Harden production infrastructure. Build operational systems that free founder attention.

### Exit criteria
Three things must be true:
1. Growth is **repeatable and channel-driven**. CAC, LTV, payback period are numbers you know and can defend.
2. Product handles **production workloads**. Infra hardened, security/compliance in order, reliability holds in real conditions.
3. Operations run **without founder bottlenecks**. You no longer personally handle support, triage, sprint planning, or reporting.

### Failure modes
- **Technical debt comes due.** MVP shortcuts now accrue interest. Audit, refactor, expand test coverage.
- **Founder becomes the bottleneck.** Symptoms: hour-decisions take a week, support requests pile up because only you know the answer, ops tasks only happen when you remember.
- **Security and compliance are no longer deferrable.** Real users → real exposure. Real enterprise contracts → SOC2/GDPR/HIPAA become hard requirements.
- **Expansion before ready.** New markets introduce new variables that erase your ability to read your own data.

### Concrete prompts and exercises

**Architectural audit + remediation triage:**
> "Audit this codebase. Produce a prioritized list of structural weaknesses, test coverage gaps, refactoring candidates. Then sequence remediation across N sprints: must-fix-before-next-release, can-wait-a-sprint, acceptable-ongoing-debt."

**Founder bottleneck audit:**
> "Here's everything I'm personally handling — recurring tasks, decisions that land on my desk, workflows that only happen because I remember. Categorize each into: automatable, needs-human-but-not-me, genuinely-needs-founder-judgment."

**Enterprise-readiness gap analysis:**
> "Pick my 3 most demanding prospects. Produce a gap analysis: what documentation, SLAs, and support infrastructure would their procurement team expect to see before signing a multi-year contract? Where do I currently fall short? Sequence the work across Code (technical) and Cowork (docs/ops)."

**Lightweight PM operating system:**
> "Design a lightweight PM operating system: sprint cadence, minimum spec template (what must be in a spec before Claude Code touches a feature), bug triage decision tree, weekly metrics brief pulling from my data sources."

---

## Scale stage

### Goal
Sustainable growth at scale. Build a real company around the product. **Construct a defensible moat** — accumulated depth, integration depth, proprietary system data.

### Exit criteria
A threshold event, not a single milestone. Company is sustainable even as founder is increasingly not directly running day-to-day. Typically: sustainable profitability not requiring external capital, IPO-readiness, or acquisition.

The key qualifier: **"If a well-funded incumbent copied your product today, would your users stay?"** That's the moat test.

### Failure modes
- **Delegating the operational layer.** Psychological as much as structural. Hand off too much, too fast → critical decisions made without founder context. Hold on too long → bottleneck.
- **Scaling technical operations.** Customers evaluate not just the product but the org as infrastructure partner. Support playbooks, SLAs, documentation, observability all become buyer requirements.
- **Scaling organizational functions.** Hiring, payroll, accounting, legal, compliance, customer success — all need real infrastructure (typically established SaaS, not AI-built from scratch — see caveat below).
- **GTM ceiling.** Organic and founder-led selling has a limit. Most founders hit it before they've ever built a real GTM function.

### Moat patterns (the three real moats)
1. **Edge-case accumulation.** Domain-specific cases a generalist competitor would get wrong (e.g., 340B drug program claims for medical billing). Each edge case captured as a test or skill becomes a brick in the wall.
2. **Behavioral data flywheel.** User interaction signals → product roadmap → improvement → more usage → more signal. Real for niche/regulated verticals; weaker than the playbook implies in commodity domains (see caveat).
3. **Workflow integration depth.** The longer users build automations, train people, connect data sources around your product, the higher the switching cost. Operationally: this is lock-in. Call it what it is.

### Concrete prompts and exercises

**Bottleneck map:**
> "Map every workflow, decision, and approval currently routed through me. For each, what happens when I'm unavailable for a week? The ones that stall are where handoff criteria, escalation paths, or exception handling need tightening."

**Moat narrative (one-page exercise):**
> "Help me draft a one-page moat narrative for product marketing: how my data flywheel works, how long it's been spinning, why a well-resourced competitor starting today couldn't replicate it in under two years. Be honest about where the moat is real and where it's thinner than I'd like."

**Workflow lock-in audit:**
> "Audit my top 10 customers for integration depth. For each: automations they've built, integrations they depend on, team workflows running through the product, my estimate of their switching cost. Identify the patterns: what types of integration create the deepest lock-in for my specific product?"

**Edge-case test suite as moat:**
> "Identify one edge case a generic competitor would get wrong in my vertical. Build a dedicated test case for it (not a unit test — a real scenario). Every similar edge case that surfaces, add it. The test suite becomes a map of the moat."

---

## Operational caveats (what the playbook omits — read before passing on as gospel)

These are gaps a critical reader should fill in independently. Surface them if relevant.

### 1. Cost matters and isn't mentioned
API spend at MVP scale runs $10K–50K/month for a founder iterating hard. The Anthropic Startups Program (free credits, top rate limits) is the most concretely valuable resource and the playbook buries it. If the founder is bootstrapped, mention it early: `claude.com` startups program.

### 2. Evals are missing
For non-technical founders shipping AI-built code, "did the agent actually do what I asked?" is the central question. The playbook mentions verification once. Suggest:
- A held-out set of real scenarios that must continue to work after any change
- Spot-checks on production output
- Regression eval before every Code session ships to main

Without evals, the "AI is your engineering team" claim collapses at scale.

### 3. Model selection isn't covered
Match the task:
- **Haiku** — high-volume background work, classification, simple extraction
- **Sonnet** — most product features, day-to-day Code work, Cowork document tasks
- **Opus** — hard reasoning, architectural decisions, the toughest PRs, complex debugging

Cost/quality is real. The default for production agent work is currently Sonnet unless quality demands Opus.

### 4. Data moats erode in the foundation-model era
The playbook treats accumulated user data as universal moat. Honest version:
- **Real moats:** regulated/niche verticals (medical billing edge cases, compliance gotchas, vertical-specific workflows)
- **Eroding moats:** generic behavioral data in commodity domains — foundation models trained at internet scale undermine "your user data is the moat" for most products

Push the founder to be specific about *why* their data is hard to replicate, not just that they have it.

### 5. AI confirms what you ask
This is in the playbook but worth re-emphasizing. Every exercise where you ask Claude to "validate," "size," "identify," or "map" is at risk of producing plausible confirmation. Default rule: every validation prompt must be paired with the adversarial inverse.

### 6. Lock-in is lock-in
The playbook frames workflow integration as moat. Operationally that's accurate; ethically founders should know they're optimizing for switching cost. Worth being honest about with users and with themselves.

---

## Resources

- Source: **The Founder's Playbook** — claude.com/blog/the-founders-playbook
- **Anthropic Startups Program** — free API credits, top publicly-available rate limits, founder events
- Claude Code docs, best practices, CLAUDE.md guide
- Founder case studies in source PDF: HumanLayer (F24), Ambral (W25), Vulcan Technologies (S25), Carta Healthcare, Anything, Cogent, Airtree, Duvo, Zingage, Kindora, Wordsmith

---

## How to apply this skill in a conversation

1. **Diagnose the stage first.** Don't dump Idea-stage advice on a Scale-stage founder.
2. **Lead with the relevant failure mode.** Most founders don't need the goal restated — they need to know what's about to go wrong.
3. **Give concrete prompts.** Not "use Claude to research" — give the actual prompt text they can paste.
4. **Pair every validation move with adversarial move.** Default reflex.
5. **Flag the playbook gaps when relevant.** Especially cost, evals, model selection, and data-moat honesty.
6. **Don't lecture.** A founder asking "how do I validate this idea" wants the next move, not a chapter.
