<!-- description: Cloud desktops for computer-use agents — the vendors selling virtual desktop environments agents drive by screenshot and click: Scrapybara, Bytebot, Orgo, Cua, Kasm, E2B Desktop, and the enterprise DaaS incumbents (AWS WorkSpaces agent desktops, Windows 365, Citrix, Omnissa). Market structure, token economics, and a decision framework. -->

# Agent Desktops

> *As of July 2026. Vendor claims re-verified at primary sources before quoting; the market is moving fast — AWS's agent-desktop GA landed July 1, 2026.*

The virtual desktop is the environment class for agents that must drive software with **no API**: legacy Windows apps, third-party SaaS dashboards, anything where the only interface is pixels. The agent sees a screenshot, decides where to click or what to type, and the action executes on a remote screen. This page covers who sells those desktops — the market that formed around [Anthropic Computer Use](https://docs.claude.com/en/docs/agents-and-tools/computer-use) and OpenAI Operator the way the [sandbox market](sandboxes.md) formed around code execution.

The operating rule from the [environment-classes taxonomy](sandboxes.md#environment-classes-beyond-code-sandboxes) carries over: **a virtual desktop is the right tool when no API exists, and the wrong tool when one does.** Screenshot reasoning is slower than API calls, visual reasoning hallucinates more than text reasoning, and UI drift between runs breaks deterministic evaluation. Everything on this page is downstream of accepting those trade-offs because the workflow demands it.

---

## Index

- [Why agents get their own desktop](#why-agents-get-their-own-desktop)
- [Market structure](#market-structure)
- [Agent-native vendors](#agent-native-vendors)
- [Enterprise DaaS incumbents](#enterprise-daas-incumbents)
- [The economics problem](#the-economics-problem)
- [Evaluation](#evaluation)
- [Security posture](#security-posture)
- [Decision framework](#decision-framework)

---

## Why agents get their own desktop

Three reasons a desktop-shaped environment earns its overhead:

1. **The no-API long tail.** Enterprises run thousands of applications with no programmable interface — legacy Windows line-of-business apps, vendor portals, Citrix-published apps from the 2000s. The alternative to a computer-use agent is a modernization project measured in years. AWS's agent-desktop pitch is explicitly this: *operate legacy desktop applications without APIs or modernization.*
2. **Isolation, same as code sandboxes.** An agent driving a browser or email client can do real damage from *your* session — harvest cookies, send the wrong email, pollute your browser profile. A dedicated desktop gives the agent its own profile, cookie jar, and blast radius. The [failures-of-grounding argument](sandboxes.md#why-sandboxes-matter-for-agents) applies pixel-for-pixel.
3. **Human-shaped audit.** A desktop session can be recorded, replayed, and reviewed the way a human session would be — screenshots per step, video of the run, session logs. For regulated workflows this is sometimes *easier* to get approved than a new API integration.

---

## Market structure

Same two-sided shape as [the sandbox market](sandboxes.md#the-sandbox-market-structure), one environment class over — and the two sides collided in mid-2026:

- **Agent-native startups** (Scrapybara, Bytebot, Orgo, Cua) compete on agent ergonomics: unified APIs across OSes, snapshot/fork primitives, fleet autoscaling, benchmark tooling. Think Layer B.
- **Enterprise DaaS incumbents** (AWS, Microsoft, Citrix, Omnissa — the August 2025 Gartner DaaS Magic Quadrant leaders) arrive from the human-desktop direction with IAM, audit trails, and existing enterprise contracts. **Amazon WorkSpaces agent desktops went GA July 1, 2026** (preview May 5) — the same infrastructure that serves human employees now serves agents, with MCP support and CloudTrail audit wrapped around it.

The dynamic to watch: incumbents win where the desktop *already exists* (the agent joins the employee fleet, zero new procurement); startups win where the desktop exists *only for the agent* (fleets of hundreds, snapshot-heavy workflows, macOS targets, benchmark loops). The incumbent shift also reprices the category — WorkSpaces agent access is bundled into an enterprise service, squeezing standalone per-desktop pricing the way [Layer D managed agents](sandboxes.md#the-sandbox-market-structure) squeezed standalone sandboxes.

---

## Agent-native vendors

| Vendor | Model | OSes | Differentiator | Caveat |
|---|---|---|---|---|
| **[Scrapybara](https://scrapybara.com/)** | Managed cloud | Ubuntu, **Windows, macOS** | The fleet-scale default: unified API for Claude Computer Use / OpenAI CUA, autoscaling, auth handling, snapshots | Managed-only; per-instance pricing matters at fleet scale |
| **[Bytebot](https://www.bytebot.ai/)** | **Self-hosted OSS** ([GitHub](https://github.com/bytebot-ai/bytebot)) + cloud | Containerized Linux | Agent + desktop bundled: natural-language tasks against a full desktop (browser, mail, office, IDE) | Bundled agent means less harness choice; Linux-only |
| **[Orgo](https://orgo.ai/)** | Managed cloud | Linux | **Forkable workspaces** + managed snapshots — per-client environment forks for agencies | Smaller scale ceiling than Scrapybara |
| **[Cua](https://github.com/trycua/cua)** | OSS infrastructure | macOS, Linux, Windows | Sandboxes + SDKs + **benchmarks** for training and evaluating computer-use agents — the eval-first pick | Infrastructure, not a managed service; you operate it |
| **[Kasm Workspaces](https://kasm.com/)** | Self-hosted + cloud | Containerized Linux, browsers | Pre-agent-wave container streaming (zero-trust browser isolation); free Community Edition, ~$5–10/user/mo — the budget substrate | Not agent-native; you build the agent wiring |
| **E2B Desktop** | Managed cloud | Linux | Desktop variant of E2B's Firecracker sandboxes — one vendor for code + desktop environments | Younger than E2B's code product |

**Adjacent, not the same thing:** [Browserbase](sandboxes.md#environment-classes-beyond-code-sandboxes) sells browser-only sandboxes — if the agent's world is entirely web, a managed browser is cheaper and faster than a full desktop. Reach for a desktop only when the workflow leaves the browser.

---

## Enterprise DaaS incumbents

- **[Amazon WorkSpaces agent desktops](https://aws.amazon.com/blogs/aws/modernize-your-workflows-amazon-workspaces-now-gives-ai-agents-their-own-desktop-preview/)** — GA July 1, 2026. Agents authenticate via IAM, connect to a WorkSpace, and drive it with computer vision + input. **MCP support** means any framework (LangChain, CrewAI, Strands) can drive it; every action lands in CloudTrail/CloudWatch. The first Gartner-leader DaaS to ship a first-party agent story — and the reference architecture for "agent joins the employee desktop fleet."
- **Microsoft Windows 365 / Azure Virtual Desktop** — the human-DaaS volume leader. No dedicated agent-desktop SKU yet; the agent story routes through Copilot. Watch for the WorkSpaces-equivalent announcement — it changes this page.
- **Citrix DaaS** and **Omnissa Horizon** (ex-VMware) — the regulated-industry incumbents, increasingly marketing GPU-accelerated desktops for AI workloads. No first-party agent-driving story as of July 2026; agents drive them today via third-party computer-use harnesses.

---

## The economics problem

Screenshot-driven operation is **token-expensive**. [The Register's analysis](https://www.theregister.com/2026/05/06/aws_workspaces_agent_access) of the WorkSpaces launch put complex-screen interactions at **up to ~500K tokens per click cycle** — every step ships a screenshot into the model and reasons over it. Three consequences:

1. **Per-task economics can exceed the human cost** for short tasks on busy screens. Do the math before fleet-scaling: tokens/step × steps/task × task volume, against [Cost & Economics](cost-economics.md) caching realities (screenshots don't prefix-cache the way text context does — every frame is new tokens).
2. **Hybrid beats pure computer-use.** Production deployments route everything API-addressable through APIs/MCP and drop to pixels only for the no-API remainder. The desktop is the fallback, not the default path.
3. **Model choice dominates.** Screenshot reasoning is frontier-model work; routing it to a cheap model produces confident misclicks. This inverts the usual [cheap-model-for-easy-turns](models.md) routing advice — with computer use, the *environment* is cheap and the *inference* is expensive.

---

## Evaluation

Computer-use evaluation inherits the [environments-share-infrastructure thesis](sandboxes.md#environment-classes-beyond-code-sandboxes): the eval is the same desktop with deterministic data and instrumentation.

- **OSWorld** — the standard academic benchmark for open-ended computer-use tasks across real applications; the number most model cards cite.
- **[Cua](https://github.com/trycua/cua)** — ships benchmarks alongside its sandboxes; the OSS pick for building your own eval loop.
- **HUD** — simulated web/desktop task environments built for measurement and replay.
- The hard problem is **UI drift**: real applications update, and pixel-level assertions rot faster than API-level ones. Snapshot-pinned environments (Orgo, Scrapybara snapshots) exist largely to hold the eval substrate still.

See [Evals](evals.md) and [Benchmarks](benchmarks.md) for the general framework.

---

## Security posture

A computer-use agent is a [lethal-trifecta](patterns.md#8-runtime-defense-pre-action-authorization-layer-12) machine: it reads untrusted content (whatever renders on screen — including a web page an attacker crafted), accesses private data (whatever the desktop session can reach), and communicates externally (it *is* a browser). Treat every screen pixel as untrusted input — a rendered webpage saying "ignore your instructions" is the same attack as a poisoned tool response, and visual prompt injection is harder to filter than text.

Mitigations that match the site's [gate-capability-not-content](safety.md) position: scope the desktop session's credentials to the task (IAM-per-agent is the WorkSpaces model), no-egress or allowlist networking where the workflow permits, session recording for post-hoc review, and pre-action authorization for irreversible operations (sends, payments, deletes). The desktop's advantage: unlike a human session, you can replay every frame.

---

## Decision framework

| Situation | Pick |
|---|---|
| Fleet of computer-use agents, managed, multi-OS (incl. macOS/Windows) | **Scrapybara** |
| Self-hosted, agent + desktop bundled, Linux fine | **Bytebot** |
| Per-client forkable workspaces, snapshot-heavy | **Orgo** |
| Building your own computer-use training/eval loop | **Cua** (+ OSWorld) |
| Budget substrate, willing to wire your own agent | **Kasm** |
| Already on E2B for code sandboxes | **E2B Desktop** |
| Agent must join the *existing employee desktop fleet* (legacy Windows apps, IAM, audit) | **AWS WorkSpaces agent desktops** |
| Regulated industry already on Citrix/Omnissa | Wait for first-party agent support, or drive via harness with heavy session recording |
| The workflow never leaves the browser | Don't buy a desktop — **Browserbase** ([Sandboxes](sandboxes.md#environment-classes-beyond-code-sandboxes)) |
| An API exists for the target app | **Don't use computer use.** Use the API. |

---

## See also

- [Sandboxes § Environment Classes](sandboxes.md#environment-classes-beyond-code-sandboxes) — where agent desktops sit in the four-class environment taxonomy
- [Sandboxes § Market Structure](sandboxes.md#the-sandbox-market-structure) — the Layer B / Layer D dynamic this market is replaying
- [Cost & Economics](cost-economics.md) — the token math that makes or breaks computer-use deployments
- [Safety](safety.md) — visual prompt injection and pre-action authorization
- [Evals](evals.md) — the shared-infrastructure evaluation pattern
