# Models

A curated reference of the models worth knowing for agentic engineering as of **May 2026**. Three tables — closed-source frontier, open-weights frontier, and agent / coding specialists — each annotated with prices, context windows, positioning, and the benchmark that matters for picking it.

Models move faster than any other layer of the stack. This page is best read as a *starting point* — every row links to the lab's pricing page so you can re-verify when it counts. Use it to learn the families and the decision rules; defer to the primary source for production routing.

---

## Decision rule before you read the tables

Most teams over-pay for tokens because they pick a model and stop iterating. The cost-discipline pattern this page assumes you'll follow:

1. **Route by difficulty.** Default to the cheapest model that passes your eval at the target accuracy. Escalate (Haiku → Sonnet → Opus, Flash-Lite → Flash → Pro, GPT-5-mini → GPT-5 → GPT-5-Pro) only on the requests that need it.
2. **Re-measure after every model bump.** Tokenizer drift is real — [Opus 4.7 uses up to 35% more tokens for the same text](https://platform.claude.com/docs/en/about-claude/pricing) than 4.6. The sticker price didn't change; your bill did. Run a 100-request sample and compare before flipping production.
3. **Batch what isn't real-time.** Anthropic and OpenAI both ship 50% Batch API discounts. If a workload tolerates 24h latency, the batch path is roughly half-price.
4. **Cache aggressively.** Prompt caching on Anthropic charges 10% of base input on cache hits; for any agent with a >50% repeat-context pattern (Claude Code-shaped harnesses, customer-support workflows), this is the largest single lever after model choice.
5. **Audit `agent × model`, not `model`.** Same Opus 4.5 scores 78% inside Claude Code and 42% inside Smolagents on [CORE](benchmarks.md#other-benchmarks-worth-knowing) — see [Harness Engineering](harness-engineering.md). The harness is often a bigger lever than the model upgrade you were about to buy.

---

## Closed-source frontier

Verified at primary source May 2026. **Anthropic** and **Google** numbers pulled directly from each lab's pricing page; **OpenAI** and **xAI** rows link to the lab's pricing page because direct fetch is bot-blocked at write time (every reader is one click from the canonical number).

| Model | Provider | Input ($/MT) | Output ($/MT) | Context | Strong for | Source |
|---|---|---|---|---|---|---|
| **Claude Opus 4.7** | Anthropic | $5 | $25 | 1M | Frontier coding + long-horizon reasoning; tokenizer drift up to 1.35× vs 4.6 — re-measure | [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| **Claude Opus 4.6** | Anthropic | $5 | $25 | 1M | Coding workhorse; previous tokenizer if 4.7 cost regression matters | [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| **Claude Sonnet 4.6** | Anthropic | $3 | $15 | 1M | The default for production agent loops; 74.6% GAIA leader | [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| **Claude Haiku 4.5** | Anthropic | $1 | $5 | 200K | Cheap-tier reasoning + tool use; the right default for fan-out sub-agents | [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| **Gemini 3.1 Pro** | Google | $2 (≤200K) / $4 | $12 / $18 | 1M | Web research (85.9% BrowseComp), multimodal, the cheapest 1M-context frontier model | [pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| **Gemini 3.5 Flash** | Google | $1.50 | $9 | — | Fast multimodal at sub-Pro cost; the routing default for high-throughput pipelines | [pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| **Gemini 3.1 Flash-Lite** | Google | $0.25 | $1.50 | — | The cheap-tier baseline across the entire frontier table; classification, routing, simple extraction | [pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| **GPT-5.5 (high)** | OpenAI | see [openai.com/api/pricing](https://openai.com/api/pricing) | — | 400K+ | Top of [Artificial Analysis](https://artificialanalysis.ai/models) intelligence index May 2026; 90.1% BrowseComp leader | [pricing](https://openai.com/api/pricing) |
| **GPT-5.2 / GPT-5.2-codex** | OpenAI | see [openai.com/api/pricing](https://openai.com/api/pricing) | — | 400K+ | Production-default; codex variant scores 81.8% on Terminal-Bench 2.0 inside ForgeCode | [pricing](https://openai.com/api/pricing) |
| **GPT-5-mini** | OpenAI | see [openai.com/api/pricing](https://openai.com/api/pricing) | — | — | OpenAI's cost-discipline tier; pair with router agent for hot/cold workload splitting | [pricing](https://openai.com/api/pricing) |
| **Grok 4** | xAI | see [x.ai/api](https://x.ai/api) | — | — | Real-time web access via X; the realtime-data niche where Gemini-or-OpenAI search would be slower | [pricing](https://x.ai/api) |

**Caveats on this table:**

- Anthropic Opus pricing is identical across 4.5 / 4.6 / 4.7 — bills change because of tokenizer drift, not the per-token rate.
- Gemini 3.1 Pro has tiered pricing above 200K input tokens; budget accordingly for long-context workloads.
- The Fast Mode premium ($30 in / $150 out, Opus 4.6 / 4.7 beta only) doubles cost for ~2× throughput — opt-in only.
- Batch API discount (50%) applies to all Anthropic and OpenAI rows.

---

## Open-weights frontier

The 2026 open-weights landscape closed most of the gap to frontier closed-source. The post worth reading first: [Open Models have crossed a threshold](https://blog.langchain.com/open-models-have-crossed-a-threshold/) (LangChain). Pricing varies by host — direct API from the lab, [Together AI](https://together.ai), [Fireworks](https://fireworks.ai), [Groq](https://groq.com), or self-hosted on your own GPU. Each row links to the primary source.

| Model | Provider | Context | Strong for | Source |
|---|---|---|---|---|
| **DeepSeek V3.2** | DeepSeek | 128K | The frontier open-weights coding model; MoE architecture, ~1/10 the cost of GPT-5 for comparable code performance | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |
| **DeepSeek R2** | DeepSeek | 128K | The reasoning-tier counterpart; long-form thinking traces at open-weights pricing | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |
| **Qwen3 Max** | Alibaba | 256K | The closest open-weights match to GPT-5 / Opus 4.7 on agent benchmarks; 235B MoE active | [qwen.ai](https://qwen.ai) |
| **Qwen3-Coder** | Alibaba | 256K | Coding specialist; competitive with GPT-5-codex on Aider polyglot | [qwen.ai](https://qwen.ai) |
| **Llama 4 Maverick** | Meta | 1M | The 405B-class open-weights heavyweight; the default if you're self-hosting at scale | [llama.com](https://www.llama.com) |
| **Llama 4 Scout** | Meta | 1M | The Maverick small sibling — 109B, single-H100 deployable | [llama.com](https://www.llama.com) |
| **Kimi K2** | Moonshot AI | 1M | Trillion-parameter MoE; ranked top-3 on multiple Chinese-lab leaderboards | [moonshot.ai](https://www.moonshot.ai) |
| **GLM-5** | Zhipu AI | 128K | One of the two models the roadmap explicitly recommends for open-weights agent work ("GLM-5 or MiniMax M2.7"); strong tool use | [bigmodel.cn](https://www.bigmodel.cn) |
| **MiniMax M2.7** | MiniMax | 1M | The other roadmap pick; very long context + competitive agent benchmarks | [minimax.io](https://www.minimax.io) |
| **Mistral Large 3** | Mistral | 128K | European-sovereign frontier; the data-residency choice for EU teams | [mistral.ai/pricing](https://mistral.ai/pricing) |

**Caveats:**

- Per-token prices depend heavily on host — DeepSeek direct is often cheaper than Together AI for the same model; Groq is the speed-first option.
- Open-weights model performance moves *faster* than closed-source. Re-check the [LM Arena leaderboard](https://lmarena.ai) and [Artificial Analysis](https://artificialanalysis.ai/models) monthly.
- Self-hosting is rarely cheaper than per-token APIs below ~5M tokens/day; the crossover depends on GPU rental + utilization rate.

---

## Agent / coding specialists

Models tuned specifically for code, tool use, or agent loops — distinct from "general frontier model that happens to code well."

| Model | Provider | Type | Strong for | Source |
|---|---|---|---|---|
| **GPT-5.2-codex** | OpenAI | Coding-specialized GPT-5 | 81.8% on Terminal-Bench 2.0 (inside ForgeCode); the headline number for "best coding model" leaderboards as of May 2026 | [openai.com/api/pricing](https://openai.com/api/pricing) |
| **Claude Sonnet 4.6** | Anthropic | Coding workhorse | Default model inside [Claude Code](approaches.md#terminal-coding-clis), [Cursor](approaches.md#terminal-coding-clis), [Amp](approaches.md#terminal-coding-clis); strong on SWE-bench Verified | [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| **Devstral** (Mistral) | Mistral | Coding open-weights | Designed for SWE-bench tasks specifically; runs locally on consumer GPUs | [mistral.ai/news/devstral](https://mistral.ai/news/devstral) |
| **Codestral 3** | Mistral | Coding API model | The fill-in-the-middle (FIM) specialist for autocomplete-shaped tools | [mistral.ai/pricing](https://mistral.ai/pricing) |
| **Qwen3-Coder** | Alibaba | Coding open-weights | Competitive with Codestral on FIM benchmarks; broader language coverage | [qwen.ai](https://qwen.ai) |
| **OpenCoder** | OpenCoder team | Open-source reference | Fully open training pipeline + data; the research baseline for code-model papers | [opencoder-llm.github.io](https://opencoder-llm.github.io) |
| **DeepSeek V3.2** | DeepSeek | Coding-capable general MoE | Best open-weights `cost-per-correct-PR` on SWE-bench Verified | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |

---

## What this page doesn't cover

- **Fine-tunes, distillations, regional models.** The long tail (Phi-4, Aya, Sea-LION, Yi, Falcon, …) lives on the [LM Arena leaderboard](https://lmarena.ai) and [Artificial Analysis](https://artificialanalysis.ai/models). If you need one of these, those leaderboards beat any curated table.
- **Hosted-only "Operator-class" agents.** [Claude Cowork](approaches.md#browser-use--computer-use-frameworks), [OpenAI Operator](approaches.md#browser-use--computer-use-frameworks), [Anthropic Computer Use](approaches.md#browser-use--computer-use-frameworks) — these are *products*, not exposed as raw model APIs; covered in [Approaches](approaches.md#browser-use--computer-use-frameworks).
- **Embedding models.** Out of scope for agentic-engineering routing; the embedding-model choice mostly affects RAG, not agent loops. See [LangChain Embeddings docs](https://python.langchain.com/docs/integrations/text_embedding/) for current rankings.
- **Image / video / voice generation models.** Separate category; not what this page is for.
- **Sub-7B-class models.** The minimum viable agent loop is roughly Llama 3.1 8B / Qwen 7B-class; anything smaller doesn't reliably call tools or follow structured-output specs.

---

## Decision shortcuts

| If you want… | Default to… |
|---|---|
| Best `cost ÷ accuracy` for production agent loops | Sonnet 4.6 or Gemini 3.5 Flash |
| Top-of-leaderboard coding | GPT-5.2-codex (closed) or Qwen3-Coder / Devstral (open-weights) |
| Long-horizon reasoning (debugging, planning) | Opus 4.7, with cost-discipline routing |
| Cheapest call that follows a tool-use spec | Haiku 4.5 or Gemini 3.1 Flash-Lite |
| 1M+ context window | Sonnet 4.6 / Opus 4.6+ / Gemini 3.1 Pro / Llama 4 / Kimi K2 / MiniMax M2.7 |
| Web research | GPT-5.5 (90.1% BrowseComp) > Gemini 3.1 Pro (85.9%) |
| Multimodal (image / video understanding) | Gemini 3.1 Pro |
| EU data residency | Mistral Large 3, or Anthropic with `inference_geo` flag |
| Self-host on your own GPU | Llama 4 Scout (single H100) or Qwen3-Coder |
| Real-time web data | Grok 4 |

---

## Maintenance

This page is a snapshot — Anthropic and Google pricing was verified directly from their pricing pages on the build date. OpenAI and OSS pricing pages were not fetchable at write time (Cloudflare-bot-blocked or empty), so those rows link to the primary source rather than embedding a number that would rot.

**Re-verify before citing:** every row links to its lab's pricing page. The fastest way to keep this page current is to spot-check the Anthropic and Google rows quarterly and let the OpenAI / OSS linkouts handle themselves.

For broader context across the whole field:

- [Artificial Analysis](https://artificialanalysis.ai/models) — independent benchmarks + pricing across 500+ models
- [LM Arena](https://lmarena.ai) — human-preference leaderboard
- [Aider Polyglot Leaderboard](https://aider.chat/docs/leaderboards/) — coding-specific
- [Open Models have crossed a threshold](https://blog.langchain.com/open-models-have-crossed-a-threshold/) — the LangChain post on the 2026 open-weights shift
- [Inference](inference.md) — providers, routers, and how to actually serve any of these models
- [Benchmarks](benchmarks.md) — what the scores in this table mean
