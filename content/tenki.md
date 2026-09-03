<!-- description: Vendor review of Tenki — Sandbox, Runners, and Code Reviewer — benchmarked head-to-head against E2B / Daytona / Modal, Blacksmith / Depot / Namespace, and CodeRabbit / Greptile / Qodo / GitHub Copilot review. The bundle thesis, the strategic position, and where DevRel adds the most leverage. -->

# Tenki — A Deep Review

[Tenki](https://tenki.cloud) is unusual enough to warrant a vendor-named page on a vendor-neutral site: a small Seattle team shipping **three products that span the entire agent CI loop** — code execution (Sandbox), build & test (Runners), and pull-request review (Code Reviewer). Most vendors do one. CodeRabbit reviews. E2B sandboxes. Blacksmith runs CI. Tenki does all three.

This page treats that as a case study in end-to-end agent-iteration tooling: what each product does, how it stacks up against the category leader for its category, and what the bundle thesis means strategically.

---

## Index

- [Company](#company) — Luxor origin, team, funding, customers, security
- [The agent-iteration loop](#the-agent-iteration-loop) — the bundle thesis
- [Product 1 — Sandbox](#product-1-sandbox) vs E2B, Daytona, Modal, Blaxel
- [Product 2 — Runners](#product-2-runners) vs Blacksmith, Depot, Namespace, BuildJet
- [Product 3 — Code Reviewer](#product-3-code-reviewer) vs CodeRabbit, Greptile, Qodo, Copilot review
- [Strategic position](#strategic-position) — the bundle thesis, examined honestly
- [Where DevRel adds the most leverage](#where-devrel-adds-the-most-leverage)
- [Verdict](#verdict)

---

## Company

**Tenki** is the AI-infrastructure product line of **Luxor Technology**, a Seattle-based bare-metal-infrastructure operator founded in 2017 by Nick Hansen (CEO), Eddie Wang (CTO), Ethan Vera (COO), and Guzman Pintos (CPO). Luxor's first business was Bitcoin-mining infrastructure — the same hardware-buying, bare-metal-orchestration, and low-margin-economies-of-scale discipline that works for running SHA-256 ASIC farms turns out to map cleanly to running cheap, fast single-tenant VMs for AI agents. Tenki launched in 2024 as the brand for the AI side of that operation; "tenki" is Japanese for "weather."

**Team.** 11–50 across the US, Canada, Argentina, China, and the Philippines. Visible Tenki leads (per the company About page and LinkedIn): Eddie Wang (engineering), Hayssem Elsayed (product), Marina Rivosecchi (growth), Eddy Peng (design). The wider Luxor parent has separately raised institutional capital.

**Funding.** A "Tenki AI" pre-seed round appears on Crunchbase but the details are paywalled; no public Series A as of mid-2026. The Luxor parent has raised separately. Treat Tenki as bootstrapped-from-parent for now.

**Customers.** No marquee public logos on a corporate landing page. Code Reviewer ships a benchmark report citing real customer projects — Siyavula, Blockware, Sia, Upsell, Citrea, Omnilens, Layers, Orynth, Luxor (the parent), Netmaker — mostly small-to-mid teams, several from the Bitcoin/crypto-infra adjacency the parent already lives in.

**Security.** SOC 2 Type II under parent Luxor Technology's program (audited by an independent CPA firm, refreshed annually), all compute in ISO 27001-certified data-center facilities, and a 99% uptime SLA backed by credits — per the [Security page](https://tenki.cloud/company/security). That page details Runners specifically; per-product scope for Sandbox and Code Reviewer is worth confirming before quoting publicly.

**Pricing posture across products.** Starter free credits on every product; one workspace-wide Team plan at $200/mo billed yearly ($250 month-to-month); Enterprise custom. Per-unit pricing is sub-cent on Sandbox (per-second) and sub-cent on Runners (per-core-minute); $1 per AI code review. The pricing story is consistently *"order-of-magnitude cheaper than the category default."*

---

## The agent-iteration loop

The agent iteration loop is four steps:

1. **Agent writes code.**
2. **Sandbox runs it** — to verify, iterate, branch, replay.
3. **Runner verifies it in CI** — once the agent opens a PR, real build/test infrastructure has to turn green.
4. **Reviewer reads it** — for logic bugs, security issues, regressions; either approves or blocks merge.

Most vendors ship one of these four. A few ship two. **Tenki is the only vendor today that ships three of the four — Sandbox, Runners, and Code Reviewer — under one operator, one billing relationship, one security review.** (The fourth — the agent itself — is left to Claude Code, OpenHands, Codex, Cursor, etc. Tenki is infra for whoever's writing the code.)

This is the **bundle thesis**: when a buyer's bottleneck is not one of the four but rather *the friction of stitching together four vendors*, Tenki wins by collapsing the vendor count. We'll come back to whether the thesis holds.

---

## Product 1 — Sandbox

**What it is.** Disposable full Linux VMs for executing AI-generated code. SDKs in TypeScript, Python, and Go; a "Sandbox ADE" desktop app for macOS and Linux for local iteration; per-second billing with 5 GiB free disk. Sub-2-second provisioning is the headline performance number. Idle/paused sandboxes are not billed for compute — Tenki's positioning is *"pay only for running time."*

| Spec | Tenki Sandbox |
|------|--------------|
| Isolation | Single-tenant full Linux VM (separate kernel per session, wiped on termination; hypervisor not publicly named) |
| Cold start | < 2 seconds (claimed) |
| Persistence | Stateful while running; paused state preserved without compute cost |
| GPU | Not advertised |
| Pricing | $0.000014/vCPU·s, $0.0000045/GiB·s memory, $0.00000003/GiB·s disk, $0.000000076/GiB·s persistent storage; tiered Nano $0.08/hr → XLarge $1.32/hr; 5 GiB free disk |
| Security | SOC 2 Type II (parent Luxor's program); ISO 27001 facilities |
| SDKs | TypeScript, Go, Python + macOS/Linux desktop "Sandbox ADE" |

### Direct competitors

| Vendor | Isolation | Cold start | GPU | Pricing | Differentiator vs Tenki |
|--------|----------|-----------|-----|---------|-------------------------|
| **E2B** | Firecracker microVM | ~150ms | No | $100 free credit, usage-based | Category default — 200M+ sandboxes served, deepest SDK / ecosystem maturity, SOC 2 |
| **Daytona** | Docker containers | ~90ms | **Yes (H100 etc.)** | $0.0504/vCPU-hr; $200 free credit; up to $50K for startups | Pivoted from CDE to agent-sandbox in 2025; $24M Series A Feb 2026 (FirstMark); marquee logos (SambaNova, LangChain, Sentry); GPU support and Computer Use desktops |
| **Modal** | gVisor | Sub-sec | **Yes (A100 / H100)** | $30/mo + usage | 50K+ concurrency, the standout for batch agent fleets and GPU workloads, SOC 2 |
| **Sprites.dev** | Firecracker microVM | Instant + ~300ms hibernate | No | Per-second, zero idle cost | Indefinite persistent sandboxes with hibernate — best at long-lived agent sessions |
| **Blaxel** | Firecracker microVM | ~25ms resume | No | Per-second | Perpetual standby + ~25ms warm resume; YC X25, SOC 2 / HIPAA / ISO 27001; agents co-located with sandboxes |
| **Contree** | microVM (Nebius) | Sub-sec | Yes | Usage | Git-native branching/snapshots; ships 7,000+ SWE-bench environments as image tags; MCP-first |

See the full landscape in [Sandboxes § Purpose-Built Agent Sandboxes](sandboxes.md#purpose-built-agent-sandboxes).

### Where Tenki Sandbox wins

- **Microeconomics.** Per-second billing with explicit *zero idle compute cost* is operator-friendly; the Nano tier at $0.08/hr undercuts most managed alternatives, especially for short-lived bursty agent workloads.
- **Bundle.** If you're already running Tenki Runners or Tenki Code Reviewer, adding Sandbox is one more checkbox on the same MSA — not a new vendor evaluation.
- **Full VM by default.** Hardware-level isolation as the default tier puts Tenki above gVisor (Modal) and Docker (Daytona) for untrusted-code postures — though unlike E2B or Blaxel, Tenki doesn't publicly name its hypervisor.

### Where Tenki Sandbox has to improve

- **GPU.** No advertised GPU tier as of mid-2026. **Daytona and Modal both ship H100s.** For any vision / local-model / RL agent workload, this is disqualifying — Tenki has to send those workloads elsewhere, which fragments the bundle pitch.
- **Ecosystem maturity.** E2B has 200M+ sandboxes of operational history, SDK polish, and a long list of integrations. Tenki's SDK surface is real but young.
- **Public customer logos.** Sandbox-specific named customers are not on the landing page; the Code Reviewer page does cite logos. Sandbox needs its own published reference list.
- **No published latency or concurrency benchmarks for Sandbox itself** (the Code Reviewer page has benchmarks; Sandbox does not). Easy DevRel win.

---

## Product 2 — Runners

**What it is.** Drop-in replacement for GitHub-hosted Actions runners. Same `runs-on:` swap, same workflows, claimed ~30% faster and up to 60% cheaper. Each job runs in a **single-tenant ephemeral VM** — fresh kernel, fresh disk, isolated network namespace — destroyed after the run: stronger isolation than the bare-metal-pooled approach competitors take. x64 Linux and Apple Silicon M4 Pro on macOS. No GitLab or Jenkins support as of mid-2026.

| Spec | Tenki Runners |
|------|---------------|
| Isolation | Single-tenant ephemeral VM per job (fresh kernel, disk, and network namespace), destroyed after run |
| Hardware | x64 Linux + Apple Silicon M4 Pro (macOS) |
| Speed claim | "~30% faster, up to 60% cheaper" than GitHub-hosted |
| Pricing | $0.002/core-min x64; $0.020/core-min macOS; cache $0.20/GB·mo; Starter $10/mo credits; Team $200/mo billed yearly |
| VCS support | GitHub Actions only (no GitLab / Bitbucket / Azure DevOps) |
| Migration | Single `runs-on:` line change |

### Direct competitors

| Vendor | Hardware | Isolation | Speed claim | Pricing | Differentiator vs Tenki |
|--------|---------|----------|------------|---------|-------------------------|
| **Blacksmith** | Bare-metal gaming CPUs, NVMe layer cache | Bare metal (no VM) | Up to 2× faster; up to 40× faster Docker builds | ~$0.004/min for 2 vCPU x64; 3,000 free min/mo | Mindshare leader — YC W24, $10M Series A Sep 2025 (GV-led), explicit "Unblock AI Development with Fast CI" branding; 800+ paying customers including Vercel, Supabase, Clerk, Mercury, Ashby; ARM + macOS M4 + Windows beta |
| **Depot** | Bare-metal x64 + ARM, persistent build cache | Container / VM | 2–10× faster Docker / Bazel builds | Per-minute, free OSS tier | Cache-first architecture; the right pick when the bottleneck is Docker / Bazel rather than the runner |
| **Namespace** | Bare-metal x64 + ARM | microVM | 2–4× faster, similar cost | Per-minute, generous free tier | Sells fast Actions runners *and* remote dev environments — closest "platform" competitor to Tenki's bundle on the CDE-side |
| **BuildJet** | Bare-metal x64 + ARM | VM | ~2× faster | ~30% cheaper than GitHub-hosted | The mature conservative pick; no AI angle |
| **RunsOn** | Your AWS account, any EC2 SKU | EC2 instance | Up to 10× faster on right-sized hardware | $0/min + flat license — you pay AWS only | Self-hosted in your VPC; native private-network access, secrets, GPUs |
| **Ubicloud** | Bare-metal | VM | ~2× faster | Up to 10× cheaper than GitHub-hosted | Open-source, "open AWS" positioning |

### Where Tenki Runners wins

- **Strongest isolation in the category.** A single-tenant ephemeral VM per job — fresh kernel, destroyed after the run — is the most hostile-environment-safe posture among the faster-runner cohort. Blacksmith's bare-metal pool is faster on raw single-core but weaker on isolation. If a buyer's threat model includes "the agent's PR contains adversarial code that tries to escape the runner," Tenki has the right answer.
- **Cheap, at parity with the leader.** $0.002/core-min x64 matches Blacksmith's rate at the unit level (both bill a 2-vCPU job at ~$0.004/min) and is half of GitHub-hosted.
- **Bundle.** Same operator as the Sandbox the agent already ran the code in. One billing relationship, one trust boundary.

### Where Tenki Runners has to improve

- **Mindshare.** Blacksmith is the brand that comes up when an engineer says "fast GitHub runners." Tenki Runners has the technical claim but not the conversation. **This is one of the highest-leverage DevRel gaps.**
- **No GPU SKU advertised.** GitHub now ships GPU runners; Blacksmith has discussed it; Tenki doesn't.
- **No Windows.** Blacksmith and Depot both have Windows in some state. Tenki is Linux + macOS only.
- **No GitLab / Bitbucket / Azure DevOps.** Constrains TAM in regulated and large-enterprise segments.
- **No public benchmark.** "~30% faster, up to 60% cheaper" is a claim, not a published benchmark. Blacksmith has a head-to-head Node.js test on its homepage. Tenki should ship the equivalent for at least three popular OSS repos.

For the broader competitive context, see [Infrastructure § CI Runners for Agent Iteration](infrastructure.md#ci-runners-for-agent-iteration).

---

## Product 3 — Code Reviewer

**What it is.** AI pull-request reviewer installed as a GitHub App. On every PR, it posts two comments: a structured summary and a line-level review with severity ratings and an explicit `APPROVE` / `CHANGES REQUESTED` merge decision. It targets logic bugs, security vulnerabilities, performance regressions, code smells, and maintainability issues. Repository-wide context is loaded for every review (not just the diff). Configuration — custom rules, severity threshold, verbosity — lives in repo files, not in a UI. Two trigger modes: automatic on PR open/update, and on-demand via `@tenki-reviewer` mention.

| Spec | Tenki Code Reviewer |
|------|---------------------|
| Integration | GitHub App only (no GitLab / Bitbucket / Azure DevOps) |
| Setup | Claimed sub-2-minute install |
| Pricing | **$1.00 per review**, $10/mo free credits on Starter, $100/mo on Team ($200/mo billed yearly) — and a $20/seat/mo unlimited annual plan also appears in competitive marketing copy [unverified — confirm with sales which is the canonical public price] |
| Models | Not disclosed publicly [unverified] |
| Configuration | Files committed to the repo (no UI-only state) |
| Self-published benchmark | 68.9% bug-detection recall on 122 production bugs from 50 PRs across Cal.com / Sentry / Grafana / Keycloak / Discourse; claimed 1.9× the next-best tool |
| Status | Soft-launched 2024; Product Hunt #11 Product of the Day |

### Direct competitors

The AI-PR-review category has consolidated into four clusters.

#### Cluster A — Category leaders (well-funded, GitHub-native)

- **[CodeRabbit](https://coderabbit.ai)** — the mindshare leader. **$60M Series B led by Scale Venture Partners in September 2025** at ~$550M post; $88M total raised. ~$40M ARR by April 2026 (per [Sacra](https://sacra.com/c/coderabbit/)). **8,000+ paying companies** including Chegg, Groupon, Life360, Mercury; top-installed AI app on GitHub Marketplace. 100,000+ OSS projects on the free tier. Pricing: Pro $24/dev/mo, Pro Plus $48/dev/mo, billed only on devs who open PRs. Headline features: walkthrough summaries, sequence diagrams, severity-ranked inline comments, one-click AI fix, **Learnings** (org/repo-scoped memory of dismissed suggestions), Codegraph for cross-file impact, YAML custom rules, the Feb 2026 **Issue Planner** for Linear / Jira / GitHub Issues. This is the company every Tenki Code Reviewer pitch will be measured against.
- **[Greptile](https://greptile.com)** — YC W24. **$25M Series A led by Benchmark in September 2025** at a reported ~$180M valuation. Positioned as the "codebase-aware specialist" — builds a graph of files, symbols, dependencies, and ownership and reviews architectural impact. Greptile 3 (Sept 2025) claims 3× more critical bugs than v2. Trade-off in independent reviews: highest single-pass recall but noisiest output and ~3-minute latency from graph queries. Pricing: $30/seat/mo with 50 reviews/seat then $1/overage.
- **[Graphite Agent](https://graphite.dev)** (formerly Diamond) — stacking-PR tool that bolted on AI review after raising a **$52M Series B**. Rebranded the Diamond reviewer + Chat into a single Graphite Agent in Jan 2026. Pricing: free for individuals, $20 Starter, $40/seat Team with unlimited AI reviews. Tenki's own benchmark put Diamond at only 3.3% recall (vs Tenki's claimed 68.9%) but the run may pre-date the Graphite Agent rebrand.

#### Cluster B — First-party / IDE-native (distribution moats)

- **GitHub Copilot code review** — **GA April 2025**, rearchitected at Universe 2025 to fuse LLM reasoning with deterministic ESLint / CodeQL. **Agentic code review shipped March 2026**: tool-calling exploration of the repo for cross-file context, plus hand-off to Copilot coding agent for fix PRs. Distribution is the moat (every GitHub Enterprise account ships it); independent benchmarks still rank it behind dedicated tools on recall. **The first-party threat is the most important one to have a story for.**
- **[Cursor BugBot](https://cursor.com/blog/may-2026-bugbot-changes)** — pivoted in May/June 2026 from seat fees to pure usage-based, ~$1.00–$1.50 per run (up to $4+ for very large PRs). New "effort level" selector per review. Distribution piggybacks on Cursor's IDE install base.

#### Cluster C — OSS / self-hostable

- **[Qodo Merge](https://qodo.ai)** (formerly PR-Agent / Codium AI) — the OSS option. **PR-Agent core is fully open-source** and self-hostable with your own LLM keys; managed Qodo Merge Pro adds context engine, SOC 2, priority for $19/user/mo; Qodo Teams $30/user/mo annual; free Developer tier at 30 reviews/mo. **Qodo 2.0 (Feb 2026)** introduced multi-agent review and reportedly hit the highest F1 (60.1%) in an 8-tool benchmark. The strongest pick for regulated or air-gapped buyers.
- **[Sourcery](https://sourcery.ai)** — older Python-refactoring tool repositioned as a multi-language PR reviewer. 200K+ devs claimed; $10–24/seat/mo, the cheapest paid entry point in the category. Real-time IDE review (VS Code / Cursor / JetBrains) is the differentiator. Lighter on agentic features.

#### Cluster D — Smaller / niche / dead-or-pivoted

- **[Ellipsis](https://ellipsis.dev)** — YC W24, $2M seed April 2024. "Code review on autopilot" — reviews, then `@ellipsis-dev` will implement the fix it suggested. Smaller install base but a credible YC reputation.
- **Bito** — older general-purpose AI assistant pivoted to lead with AI Code Review Agent. Sales-gated pricing as of mid-2026.
- **Sweep AI** — still alive on JetBrains Marketplace but no longer in the standalone-reviewer conversation.
- **Codiumate** — folded into Qodo. Not a separate competitor.

### Where Tenki Code Reviewer wins

- **The self-published benchmark.** 68.9% recall vs CodeRabbit 28.7% / Greptile 36.1% / Copilot 24.6% / Graphite 3.3% on 122 production bugs across 50 PRs from real public repos. The methodology is defensible (real bugs from real repos, all competitors at default config); the number is striking; rivals will push back. *This is the most important asset the Code Reviewer has — DevRel's job is to make it impossible to skip in any "which AI reviewer wins" conversation.*
- **Per-review pricing.** $1 per review is genuinely novel. Most rivals are per-seat at $20–48/mo. The per-review unit maps cleanly to "cost per AI-authored PR," which is the right denominator as Copilot / Cursor / Claude Code flood repos with machine-authored PRs. Cursor BugBot has converged on the same $1–$1.50/run pricing — the moat is narrowing, but Tenki was early.
- **Repo-as-config.** Configuration files committed to the repo, not stored in a UI. This is the right default for engineering teams that want PRs to be reproducible.
- **Bundle.** Same operator as Sandbox and Runners.

### Where Tenki Code Reviewer has to improve

- **No multi-VCS.** CodeRabbit and Qodo both cover GitLab / Bitbucket / Azure. Tenki is GitHub-only, which constrains the enterprise TAM materially.
- **Models undisclosed.** Most competitors are upfront about which models they route to. The absence is a credibility cost in any technical buyer evaluation.
- **No "Learnings"-equivalent memory.** CodeRabbit's repo-scoped memory of dismissed suggestions is one of its strongest stickiness features. Tenki doesn't have a public equivalent.
- **No Issue Planner / coding-agent hand-off.** CodeRabbit shipped Issue Planner in Feb 2026, integrating with Linear/Jira/GitHub Issues. Tenki has no published equivalent.
- **Two pricing pages tell different stories.** The product/pricing pages emphasize $1/review; competitive blog copy pitches $20/seat unlimited. Pick one canonical public price and stand behind it.
- **Customer logos are small.** Real but small; needs a marquee enterprise reference to be taken seriously in enterprise procurement.

---

## Strategic position

### The bundle thesis, examined

The Tenki pitch — explicit or not — is: *most agent teams will eventually want one vendor across the agent runtime (Sandbox), the CI verification (Runners), and the PR review (Code Reviewer), and we are the only vendor offering all three.* That is true today. **No one else has the full stack.** CodeRabbit reviews only. Greptile reviews only. Blacksmith runs CI only. E2B sandboxes only. Daytona sandboxes only (post-pivot). GitHub has CI and review but no agent-grade disposable-VM sandbox.

The thesis wins when a buyer's pain is *vendor stitching*: separate MSAs, separate SOC 2 reports, separate billing, separate observability dashboards, separate trust boundaries. For a mid-market shop spinning up agent fleets, that vendor count is a real cost.

The thesis loses when the buyer's pain is *category depth*. Best-of-breed has historically won in dev tools. A team that lives or dies by PR review quality will pick CodeRabbit even if it means a second vendor. A team that lives or dies by CI speed will pick Blacksmith. A team that lives or dies by GPU sandbox capacity will pick Modal or Daytona. The bundle has to *not be visibly worse on any single leg* — and right now it has visible weaknesses on each (no GPU on Sandbox, no Windows / GitLab / public benchmark on Runners, no multi-VCS / model disclosure / Learnings on Code Reviewer).

The strategic question is whether **the bundle's compound advantage outpaces the specialists' single-leg lead.** For an agent fleet writing thousands of PRs a month across many repos, the compound (one vendor, one trust boundary, one bill) plausibly does outpace. For a 50-person engineering team running one or two agents and caring most about review quality, it doesn't.

### Where Tenki is unique vs everyone else

| Comparison | What Tenki has that they don't |
|------------|-------------------------------|
| **vs. CodeRabbit** | The Sandbox and the Runners; per-review pricing; VM-grade isolation across the stack |
| **vs. Greptile** | The Sandbox and the Runners; $1/review undercuts $30 + overage |
| **vs. Blacksmith** | The Sandbox and the Reviewer; ephemeral-VM-per-job isolation (vs Blacksmith's bare-metal pool) |
| **vs. E2B** | The Runners and the Reviewer; per-second sandbox idle-cost pricing |
| **vs. Daytona** | The Runners and the Reviewer; VM-per-job isolation (vs Daytona's containers) |
| **vs. GitHub** | The Sandbox (GitHub has no agent-grade disposable-VM sandbox); VM-per-CI-job runner isolation; aggressive per-review pricing on the reviewer |
| **vs. all of them** | One operator, one billing relationship, one trust boundary across the full agent CI loop |

### Where Tenki has work to do

- **GPU on Sandbox.** Disqualifying gap for vision / local-model / RL workloads.
- **Public benchmark on Runners.** "~30% faster, up to 60% cheaper" needs a head-to-head.
- **Model disclosure on Code Reviewer.** Required for any technical buyer evaluation.
- **Multi-VCS support across the line.** Material TAM gap.
- **A marquee enterprise reference.** The current logo list is small and crypto-adjacent.

---

## Where DevRel adds the most leverage

This site doesn't normally publish DevRel advice for a specific company, but Tenki's situation is unusual enough that the highest-leverage DevRel moves are also the most useful things a candidate could write down.

### 1. Own the "agent CI loop" story

Nobody else can tell it. Every other vendor has to caveat — *"we do reviews; pair us with E2B for sandboxing and Blacksmith for CI"* — but Tenki is the punchline. The one-line frame:

> *Tenki is the only AI-code-quality vendor that owns the agent runtime, the CI runner, and the reviewer in one stack — and the $1/review unit price is built for a world where PRs are written by agents, not seats.*

This frame answers the "why not just use CodeRabbit?" question by *redefining the category*. CodeRabbit is in the AI-PR-review category. Tenki is in the AI-PR-loop category. That repositioning is a DevRel job, not a sales job.

### 2. Publish the benchmarks the products don't have yet

- **Sandbox.** A "cold-start vs. competitors" benchmark across E2B, Daytona, Modal, Tenki, with reproducible scripts.
- **Runners.** A head-to-head on three popular OSS repos (Node.js / Python / Go) vs. Blacksmith, Depot, BuildJet, and GitHub-hosted. Wall-clock and cost.
- **Code Reviewer.** The 68.9% benchmark exists. Republish it quarterly with a fresh corpus to keep it honest, and ship the methodology + raw data publicly so rivals can't dismiss it as cherry-picked.

The Code Reviewer benchmark is already the strongest marketing asset Tenki has. The other two products don't have an equivalent. Building those is a 4–6 week DevRel project that compounds for years.

### 3. Seed the agent-builder communities

Tenki's existing customer logos skew crypto-infra (Citrea, Blockware, Luxor, Netmaker). That's the parent company's network at work, not a strategy. The natural community for Tenki is **AI agent builders**: people running Claude Code / OpenHands / Codex / Cursor power-user setups where agents author PRs at machine cadence. They need:

- An isolated, disposable VM the agent can iterate inside.
- A fast CI runner so the agent's PR turns green in 90 seconds, not 8 minutes.
- A per-PR reviewer instead of a per-seat one, because the "seat" writing the PRs is an agent.

That's Tenki's three products in order. The natural channels are: the agent-CLI ecosystems (Claude Code subreddit / Discord, OpenHands community, Codex GitHub discussions), AI agent meetups, and the open-source agent-harness projects (where shipping an MCP integration buys distribution).

### 4. Tell the Luxor story before someone else asks about it

The parent-company context is unusual and will come up in any due-diligence conversation. The narrative DevRel should pre-load:

> *Tenki is the AI side of a nine-year-old infrastructure operator that runs hundreds of millions of dollars of bare-metal hardware at low cost. The same buying-power and orchestration discipline that makes mining profitable is what lets us undercut the venture-funded competition on per-second sandbox cost and per-core-minute runner cost. We are not a software startup chasing margin; we are an infrastructure operator with software on top.*

Owned narrative beats "wait, you're a mining company?"

### 5. The four claims to verify with engineering before repeating publicly

Before the candidate puts these in a deck or a talk:

- **The 68.9% recall benchmark.** Defensible methodology; rivals will push back. Know the exact corpus, the exact configs each competitor ran, and the cutoff date.
- **Which model powers Code Reviewer.** Public silence on this is a credibility cost; if it's switchable, say so; if it's a specific model, say so; if there's a reason it has to stay private, have that reason ready.
- **SOC 2 scope by product.** The program is parent Luxor's Type II; confirm each product line is in scope.
- **$1/review vs $20/seat unlimited.** Confirm which is the canonical public price and which is a sales-team option.

### 6. The DevRel-leverage ranking

If a DevRel lead at Tenki had three quarters of runway and could ship four things, the ranking I'd defend in an interview:

1. **A public "agent CI loop" reference architecture** — the one-page diagram + the working code sample showing Sandbox + Runner + Reviewer end-to-end on a real OSS repo. This is the bundle thesis as code, not as marketing.
2. **The two missing benchmarks** (Sandbox cold-start, Runners head-to-head) — closes the credibility gap that prevents the Code Reviewer benchmark from being seen as a pattern instead of an outlier.
3. **MCP integrations into the three biggest agent CLIs** — Claude Code, OpenHands, Codex — so that running a Tenki Sandbox from inside an agent session is one config line. Distribution where the users already are.
4. **A founder-led narrative piece** on the Luxor → Tenki origin — published once, linked forever, defangs the "wait, mining company?" question.

---

## Verdict

Tenki is a real company shipping real products in a category where the leaders have run away on funding and mindshare. The single most credible thing about Tenki is that **nobody else has all three products**, and that fact is structural — not something Greptile or Blacksmith can copy this quarter. The single largest risk is that **the specialists' lead on each individual leg outpaces the bundle's compound advantage**, especially while Tenki has visible gaps (no GPU, no Windows, no GitLab, undisclosed models, no marquee enterprise reference).

The Code Reviewer benchmark is the strongest single marketing asset the company has. The bundle thesis is the strongest strategic asset. DevRel's job is to make sure both are impossible to miss in any buyer conversation about the agent-CI loop.

---

## See also

- [Infrastructure § CI Runners for Agent Iteration](infrastructure.md#ci-runners-for-agent-iteration) — full landscape of fast GitHub Actions runners
- [Sandboxes § Purpose-Built Agent Sandboxes](sandboxes.md#purpose-built-agent-sandboxes) — the broader sandbox category
- [Sandboxes § Isolation Tiers](sandboxes.md#isolation-tiers-the-security-ladder) — the security ladder for running untrusted agent code
- [Sandboxes § Contree](sandboxes.md#contree-the-git-native-sandbox) — the comparable vendor deep-dive on a different agent-sandbox player
- [Inference § Nebius AI Cloud](inference.md#nebius-ai-cloud-standout-platform) — the comparable standout-vendor pattern on the inference side
