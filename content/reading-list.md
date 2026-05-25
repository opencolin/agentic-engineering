<!-- description: Curated entry points to follow the field — daily firehose (Simon Willison, TLDR AI, The Batch), weekly substantive (Import AI, Latent Space, Hamel.dev), deep long-form (Lil'Log, Cameron Wolfe, Chip Huyen), podcasts, courses, communities, conferences, reference repos. A practical weekly cadence at the bottom. -->

# Reading List

Curated entry points to follow the field. Organized by depth of commitment — start at the top, add lower-frequency sources as you have bandwidth. Everything here is referenced from primary sources in the [Research Notes](research-notes.md) bibliography.

---

## Daily firehose (skim in 5-10 min)

| Source | What you get | Cadence |
|---|---|---|
| [Simon Willison's Weblog](https://simonwillison.net) | Hands-on LLM/agent experiments, security takes, naming-of-things — the single best daily signal | Daily, sometimes 2-3×/day |
| [TLDR AI](https://tldr.tech/ai) | 5-minute consensus summary of what broke today | Daily |
| [The Batch (DeepLearning.AI)](https://deeplearning.ai/the-batch) | Andrew Ng's measured weekly digest with editorial commentary | Weekly (Wednesday) |

If you only follow one of these, follow Simon Willison.

---

## Weekly substantive

| Source | Beat |
|---|---|
| [Import AI](https://importai.substack.com) — Jack Clark (Anthropic co-founder) | Research papers + capability jumps with policy framing; signature "Tech Tales" fiction vignettes |
| [Latent Space](https://latent.space) — swyx & Alessio Fanelli | The original "AI Engineer" beat; production patterns from labs (183K subscribers) |
| [Hamel.dev](https://hamel.dev) — Hamel Husain | Eval methodology, applied AI engineering; "evals are the missing infrastructure" |
| [Eugene Yan](https://eugeneyan.com) | Applied ML/LLM systems, reliability, "field meets frontier" |
| [Philipp Schmid](https://philschmid.de) (Google DeepMind) | High-frequency tutorials: subagents, MCP, function calling, deep research |

---

## Deep long-form (monthly to occasional)

| Source | Beat |
|---|---|
| [Lil'Log](https://lilianweng.github.io) — Lilian Weng | Citation-heavy primers on alignment, reasoning, training (former OpenAI safety lead) |
| [Cameron R. Wolfe — Deep (Learning) Focus](https://cameronrwolfe.substack.com) | Approachable long-form research explainers (68K subscribers) |
| [Chip Huyen](https://huyenchip.com) | ML/AI systems in production; author of *AI Engineering* (2025) — the standard reference |

---

## Primary sources from frontier labs

Required reading if you're serious about the field:

- **[Anthropic Engineering](https://anthropic.com/engineering)** — the most consistently high-signal lab blog. Start with [Building Effective Agents](https://anthropic.com/research/building-effective-agents) (Dec 2024) → [Effective Context Engineering](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Sept 2025) → [Multi-Agent Research System](https://anthropic.com/engineering/multi-agent-research-system) (June 2025) → [Managed Agents](https://anthropic.com/engineering/managed-agents) (Apr 2026)
- **[LangChain Blog](https://blog.langchain.com)** — practitioner perspective on agent harnesses, evals, deep agents. Don't miss [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) and [Open Models Have Crossed a Threshold](https://blog.langchain.com/open-models-have-crossed-a-threshold/)
- **[OpenAI Cookbook](https://cookbook.openai.com)** — first-party patterns; the cross-vendor counterpart to Anthropic Cookbook
- **[State of Agent Engineering 2025 (LangChain)](https://langchain.com/state-of-agent-engineering)** — industry baseline: 57% have prod agents; 89% have observability; 62% have detailed tracing

---

## Podcasts

| Show | Hosts | Beat |
|---|---|---|
| [Latent Space](https://latent.space) | swyx, Alessio | AI Engineer interviews — Brockman, Karpathy, Hotz, Willison |
| [Dwarkesh Podcast](https://dwarkesh.com) | Dwarkesh Patel | Deeply researched long-form interviews with researchers, economists, historians |
| [Practical AI](https://changelog.com/practicalai) | Chris Benson, Daniel Whitenack | Practical deployment, open-source angle, policy-aware |
| [TWIML AI Podcast](https://twimlai.com) | Sam Charrington | Enterprise deployment + researcher interviews; running since classical-ML era |

---

## Courses (free, in rough order of foundation → applied)

| Course | What it covers | Time |
|---|---|---|
| [HuggingFace LLM Course](https://huggingface.co/learn/llm-course) | Transformers, fine-tuning, RLHF — the layer below agents | 12 chapters |
| [HuggingFace Agents Course](https://huggingface.co/learn/agents-course) | smolagents + LlamaIndex + LangGraph; free certification | 3-4 hrs/week |
| [LangChain Academy — Intro to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph) | Graph-based orchestration, state, memory, HITL, deployment | 55 lessons / ~6h |
| [Anthropic Prompt Engineering Tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) | 9 chapters of interactive Jupyter — the prompt engineering baseline | Self-paced |
| [DeepLearning.AI Short Courses](https://deeplearning.ai/short-courses) | 121 short courses, partner-taught (Anthropic, OpenAI, Google) | 1-2 hrs each |
| [FreeAcademy.ai](https://freeacademy.ai) | 100+ free courses with certificates; beginner-friendly | Varies |

---

## Communities

| Community | Where | Why |
|---|---|---|
| [Anthropic Discord](https://anthropic.com/discord) | Discord | Claude / Claude Code / MCP discussion with staff presence |
| [LangChain Discord](https://discord.gg/langchain) | Discord | Largest OSS agent-framework community; maintainer presence |
| [HuggingFace Discord](https://hf.co/join/discord) | Discord | Open-source models, smolagents, HF Agents Course study groups |
| [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA) | Reddit | Largest community for self-hosted / open-weights models |

---

## Conferences

| Event | Audience | Notable |
|---|---|---|
| [AI Engineer](https://ai.engineer) | Practitioners building agents in production | Multiple events globally (SF, NYC, London); 6K+ attendees; huge free [YouTube archive](https://youtube.com/@aiDotEngineer) |

The YouTube talk archive is the deliverable — even if you never attend, watch the talks.

---

## YouTube channels

| Channel | Beat |
|---|---|
| [Andrej Karpathy](https://youtube.com/@AndrejKarpathy) | "From scratch" deep dives — building GPT, tokenizers, the whole stack |
| [Anthropic](https://youtube.com/@anthropic-ai) | First-party demos, paper walkthroughs, Claude Code patterns |
| [LangChain](https://youtube.com/@LangChain) | Framework tutorials, case studies, agent patterns |
| [AI Engineer (conference)](https://youtube.com/@aiDotEngineer) | The full conference talk archive |
| [Yannic Kilcher](https://youtube.com/@YannicKilcher) | Paper explainers — heavier on the ML research side |
| [Lex Fridman](https://youtube.com/@lexfridman) | Long-form interviews; less agent-focused but high-profile guests |

---

## Reference repos worth keeping bookmarked

| Repo | Why |
|---|---|
| [anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) | First-party recipes — tools, RAG, sub-agents, caching, evals (43.8K stars) |
| [openai/openai-cookbook](https://github.com/openai/openai-cookbook) | OpenAI's counterpart (73.8K stars) |
| [langchain-ai/deepagents](https://github.com/langchain-ai/deepagents) | The reference deep-agent harness (23.3K stars) |
| [langchain-ai/langgraph](https://langchain-ai.github.io/langgraph/) — examples dir | Pattern catalog: ReAct, ReWOO, LATS, Reflexion, plan-execute |
| [UKGovernmentBEIS/inspect_evals](https://github.com/UKGovernmentBEIS/inspect_evals) | 200+ pre-built evals on Inspect AI |
| [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) | Most-starred Claude Code reference repo (54.7K stars); 83 categorized tips |
| [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 60 subagents + 232 skills, cross-harness (191K stars, hackathon winner) |
| [sierra-research/tau2-bench](https://github.com/sierra-research/tau2-bench) | Standard customer-service agent benchmark |
| [EthicalML/awesome-agentic-engineering-resources](https://github.com/EthicalML/awesome-agentic-engineering-resources) | Curated index of 21 topics — courses, papers, benchmarks, implementations |

---

## Newsletters bundle

- [Ben's Bites](https://bensbites.com) — high-volume signal layer for what builders are trying
- [AI Engineer Pack](https://aiengineerpack.com) — bundle of 60+ AI dev tool credits/discounts (free with GitHub login)

---

## Books

| Book | Author | Why |
|---|---|---|
| *AI Engineering* (2025) | Chip Huyen | The standard reference for the production layer wrapping any agent — "the most read book on the O'Reilly platform since its launch" |
| *Designing Machine Learning Systems* | Chip Huyen | Foundation for the systems thinking that AI Engineering builds on |
| *Building LLMs for Production* | Louis-François Bouchard, Louie Peters | Practitioner deep dive — production patterns, evals, fine-tuning |

---

## How to actually use this

A reasonable weekly cadence for someone shipping agents in production:

| Day | What |
|---|---|
| Mon | Import AI (research/policy roundup) |
| Tue | LangChain blog catch-up (if anything new) |
| Wed | The Batch (industry digest) |
| Daily | Simon Willison (skim) |
| Monthly | One Lilian Weng or Cameron Wolfe long-form |
| Quarterly | Re-read one Anthropic Engineering classic; spot-check your model + tool choices against current state |

---

## Related

- [Who's Who](who-is-who.md) — the people behind many of these sources, with profiles
- [Schools](schools.md) — the broader intellectual lineages this reading list draws from
- [Research Notes](research-notes.md) — primary-source bibliography with key claims pulled per URL
