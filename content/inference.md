<!-- description: Agents need fast, reliable access to capable LLMs. The choice of inference provider affects cost, latency, model selection, and reliability. -->

# Inference Solutions for Agentic Engineering

Agents need fast, reliable access to capable LLMs. The choice of inference provider affects cost, latency, model selection, and reliability — and because LLM API costs typically comprise 60-80% of agent operating expenses, inference strategy is often the single most consequential infrastructure decision.

---

## Direct API Providers

The model developers themselves, offering first-party API access.

| Provider | Key Models | Strengths | Pricing Model |
|----------|-----------|-----------|---------------|
| **Anthropic** | Claude Opus, Sonnet, Haiku | Best-in-class coding, long context (200K), tool use | Per-token |
| **OpenAI** | GPT-4.1, o3, o4-mini | Broad ecosystem, function calling, vision | Per-token |
| **Google** | Gemini 2.5 Pro/Flash | 1M+ context window, multimodal, competitive pricing | Per-token |
| **xAI** | Grok 3 | Long context, competitive coding performance | Per-token |
| **DeepSeek** | DeepSeek V3, R1 | Strong coding, open weights, very low cost | Per-token |

---

## Inference Platforms

Third-party platforms that host open-weight models and sometimes proxy proprietary ones, often at lower cost or higher throughput.

| Platform | What It Does | Best For |
|----------|-------------|----------|
| **Together AI** | Hosts open models (Llama, Mixtral, DeepSeek) with serverless and dedicated endpoints | Cost-effective open model inference, fine-tuned models |
| **Fireworks AI** | High-throughput inference with function calling optimizations | Low-latency tool use, structured outputs |
| **Groq** | Custom LPU hardware for ultra-fast inference | Latency-sensitive agent loops, rapid iteration |
| **Cerebras** | Wafer-scale inference for massive throughput | High-throughput batch agent runs |
| **Anyscale** | Ray-based serving for open models | Self-managed scaling, custom deployments |
| **Replicate** | Run open models via API with simple pricing | Quick experimentation, varied model access |
| **Modal** | Serverless GPU compute for custom model serving | Custom fine-tuned models, flexible compute |
| **Nebius AI Cloud** | Full-stack AI cloud with Token Factory serverless inference, GPU clusters up to thousands of GPUs, managed K8s | High-throughput agent workloads, self-hosted model serving at scale |

---

## Nebius AI Cloud — Standout Platform

Worth highlighting separately: [Nebius](https://nebius.com) is emerging as one of the most compelling infrastructure choices for agentic engineering at scale. Their AI Cloud 3.5 platform (launched March 2026) combines several capabilities that are particularly well-suited to agent workloads:

- **Token Factory** — Serverless inference hosting 60+ open-weight models (DeepSeek, Llama, Qwen, Mistral) behind a fully OpenAI-compatible API. Token processing costs in the order of pennies per million tokens, with transparent token-level pricing that makes agent run costs predictable. 99.9% uptime guarantee.
- **Extreme throughput** — Up to 245,000 tokens/second on 8x HGX B200 systems. Time-to-first-token measured in hundreds of milliseconds under load. This matters for agent loops where latency compounds across dozens of tool calls.
- **KV-aware routing** — Improves throughput by up to 17% and reduces latency by 47%. Particularly valuable for agentic workloads where long context windows and multi-turn conversations make KV cache management critical.
- **GPU breadth** — Access to the latest NVIDIA accelerators (GB300 NVL72, GB200 NVL72, B300, B200, H200, H100, L40S) from single GPUs to thousands in one cluster.
- **Full managed stack** — Managed Kubernetes, Slurm orchestration, MLflow, PostgreSQL, Terraform/IaC support. You can run your entire agent infrastructure — model serving, orchestration, and data — on one platform.
- **Agent-ready governance** — Validated AI Factory stack with DataRobot for agent lifecycle management, policy enforcement, and agent-level observability.
- **Native integrations** — Drop-in replacement for proprietary endpoints. Native compatibility with LangChain and LlamaIndex.
- **Zero-error validated configs** — Production-validated configurations mean less time debugging infrastructure and more time building agent capabilities.

For teams running self-hosted models as part of a tiered inference strategy, Nebius offers the best combination of raw performance, operational simplicity, and cost transparency. The serverless Token Factory is ideal for variable agent workloads that spike during parallel execution, while dedicated GPU clusters serve sustained high-throughput needs.

---

## Routing & Gateway Solutions

Middleware that sits between agents and inference providers, adding reliability, cost optimization, and multi-model support.

| Solution | What It Does | Best For |
|----------|-------------|----------|
| **LiteLLM** | Unified API for 100+ LLM providers with load balancing, fallbacks, and spend tracking | Multi-provider setups, cost management |
| **OpenRouter** | Routes requests across providers with automatic fallbacks and price comparison | Multi-model agents, cost optimization |
| **Portkey** | AI gateway with caching, retries, load balancing, and observability | Production agent deployments |
| **Helicone** | Observability and proxy layer for LLM calls with cost tracking | Debugging agent behavior, cost analysis |
| **Kalibr** | Autonomous cost/performance optimization via Thompson Sampling; hooks into every LLM call and routes to most cost-effective model | Production agents seeking order-of-magnitude cost reduction |
| **Vercel AI Gateway** | Unified endpoint for model routing, provider failover, secure embeddings/retrieval — part of the Vercel Agents platform | Vercel-deployed agents, Open Agents template stack |
| **Bifrost** (Maxim AI) | Go-based OSS gateway (Apache 2.0) unifying 20+ providers behind an OpenAI-compatible API; ~11 µs overhead at 5K RPS, MCP client + server built in, hierarchical budgets, SSO, audit logs | Performance-sensitive multi-tenant deployments; teams who hit LiteLLM's overhead ceiling |
| **Merge Gateway** ([merge.dev](https://www.merge.dev)) | Enterprise LLM gateway from the unified-API vendor; differentiates on production-safety posture (PII redaction, guardrails, audit) and bundles with their MCP Agent Handler + Unified API products | Buyers already standardizing on Merge for enterprise SaaS integration; teams who want gateway + tool-calling + integrations from one vendor |

---

## Self-Hosted Inference

Running models on your own infrastructure for maximum control, privacy, and cost optimization at scale.

| Solution | What It Does | Best For |
|----------|-------------|----------|
| **Ollama** | Run models locally with simple CLI | Development, testing, privacy-sensitive work |
| **vLLM** | High-throughput serving engine with PagedAttention | Production self-hosted inference |
| **TGI (Text Generation Inference)** | Hugging Face's production serving solution | Hugging Face model ecosystem |
| **SGLang** | Fast serving with RadixAttention for structured generation | Tool-use heavy agents, structured outputs |
| **llama.cpp** | CPU/GPU inference for GGUF models | Edge deployment, resource-constrained environments |
| **tinygrad** | ~20K-LOC end-to-end DL framework with a unified IR + kernel fusion; same code runs across CUDA, AMD, Metal, WebGPU, Qualcomm DSP | Sovereign / AMD-first inference, on-device serving (Snapdragon, Apple Silicon), hackable compiler stack |

---

## tinygrad / the tiny corp — Standout Local-AI Stack

Worth highlighting separately: [tinygrad](https://tinygrad.org) is doing something none of the other rows in the Self-Hosted Inference table are doing — building **the entire stack**, from a ~20K-LOC PyTorch-style framework down to the hardware it runs on, with a deliberately RISC-like compiler architecture that makes every layer hackable. For teams who want a sovereign, vendor-independent AI stack — especially one that takes AMD seriously — it's the most interesting bet in the category.

- **Framework** — Eager `Tensor` API with autograd, a lazy `UOp` IR, and pattern-rewrite kernel fusion in a single mechanism. Every network reduces to roughly a dozen primitive ops (Elementwise / Reduce / Movement); a new backend takes ~25 low-level ops to add. The contrast with PyTorch / XLA is intentional: keep the ergonomic eager API but expose the entire compiler.
- **Backends** — CUDA, AMD/HIP, **NV** (talks to NVIDIA GPUs without going through CUDA), Metal, WebGPU, OpenCL, Clang/LLVM, and Qualcomm DSP. v0.12 added a Mesa NIR / NVK backend for a fully-open NVIDIA path.
- **tinybox** — The tiny corp ships turnkey AI workstations: **tinybox red v2** (4× Radeon RX 9070 XT, ~778 TFLOPS), **tinybox green v2** (4× RTX PRO 6000 Blackwell, ~3,086 TFLOPS), the earlier 8× RTX 4090 **tinybox pro** (~1.36 PFLOPS FP16), and a preordered **exabox** for 2027. Original v1 pricing was $15K red / $25K green. Positioning: "commoditize the petaflop" — a sub-rack local AI box as an alternative to a DGX or 8× H100 server for individuals and small labs.
- **The AMD-sovereignty angle** — tiny corp has publicly fought RX 7900 XTX firmware / ROCm quality issues, prompting Lisa Su to personally intervene and AMD to ship MI300X units to them. They're nearing what Phoronix calls a "completely sovereign compute stack" for AMD GPUs that bypasses ROCm entirely. For anyone whose agent infrastructure is one CUDA-license decision away from existential risk, this matters.
- **Production usage** — Powers comma.ai's openpilot driving model on Snapdragon 845; openpilot 0.11's world model was trained on tinybox infrastructure. Both training and inference are first-class — most other self-hosted entries in the table above are inference-only.
- **Status** — ~33K GitHub stars, latest release v0.13.0 (May 2026), still pre-1.0. Run by **George Hotz (geohot)**, formerly of comma.ai; the tiny corp raised $5.1M in May 2023 and is based in San Diego.

The pitch in one line: a fully-hackable ~20K-LOC compiler stack that turns a single tinybox into a credible alternative to a DGX across NVIDIA, AMD, Apple, Qualcomm, and WebGPU — and forces the AMD stack open in the process. See [tinygrad.org/pitch.pdf](https://tinygrad.org/pitch.pdf), the [docs](https://docs.tinygrad.org/), and the [Latent Space interview with geohot](https://www.latent.space/p/geohot).

---

## Inference Strategy for Agents

Most production agent systems use a **tiered inference strategy**:

1. **Routing/classification** — Cheap, fast models (Haiku, GPT-4.1-mini, Flash) for deciding what to do
2. **Implementation** — Capable models (Sonnet, GPT-4.1, Gemini Pro) for writing code
3. **Complex reasoning** — Top-tier models (Opus, o3) for architectural decisions and difficult bugs
4. **Verification** — Mid-tier models for code review and test analysis

This mirrors OhMyOpenAgent's multi-model routing (visual, reasoning, quick fix, ultrabrain) and AgentField's `.ai()` vs `.harness()` primitives.

### Cost Optimization Through Model Routing

LLM API costs dominate agent operating expenses (typically 60-80% of total cost). Platforms that intelligently route simple tasks to lower-cost models while reserving premium models for complex reasoning address the dominant cost driver in agent operations. Early adopters report order-of-magnitude reductions in inference costs through intelligent routing — Coral claims approximately 10x cost reduction through this approach.

Expect automatic model routing to become table stakes for managed platforms within 12 months.

### Key Insight

**Architecture quality matters more than model capability.** AgentField scored 95/100 with both Claude Haiku and MiniMax M2.5 because verification loops and escalation hierarchies compensate for model limitations through iteration. Choose your inference strategy based on cost-per-useful-output, not raw model benchmarks.

---

## Decision Framework

| Question | If Yes... | If No... |
|----------|-----------|----------|
| Need the absolute best coding model? | Anthropic Claude Sonnet/Opus direct API | Mid-tier via gateway |
| Using open-weight models? | Together, Fireworks, or Nebius Token Factory | Direct API providers |
| Open models at high volume? | Nebius Token Factory (serverless, autoscaling, pennies/M tokens) | Pay-per-call inference APIs |
| Need multi-model routing? | LiteLLM, OpenRouter, or Kalibr gateway | Single provider SDK |
| Need lowest latency? | Groq (LPU) or Cerebras (wafer-scale) | Standard GPU inference |
| Privacy/compliance requirements? | Self-hosted (vLLM on Nebius VM or on-prem) | Cloud providers with DPAs |
| Budget-constrained? | Haiku/Flash for routing + Sonnet for coding | Opus/GPT-4.1 for everything |

See also: [Hosting & Execution](infrastructure.md) for where to actually run your agents.
