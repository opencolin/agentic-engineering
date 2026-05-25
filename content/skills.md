<!-- description: Cross-vendor primitive (Anthropic open standard, Dec 2025) for giving an agent a capability without bloating its context window — SKILL.md format, three-level progressive disclosure, empirical bounds (82% vs 9% lift, ~12-skill ceiling, 70% invocation reliability), and security model. -->

# Skills

The cross-vendor primitive for giving an agent a capability without bloating its context window. Defined by Anthropic as an [open standard in December 2025](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) and now portable across Claude.ai, Claude Code, the Claude Agent SDK, and the Claude Developer Platform.

> "Instead of building fragmented, custom-designed agents for each use case, anyone can now specialize their agents with composable capabilities." — Anthropic

The empirical case: Claude Code on its eval set scored **82% with skills vs 9% without** — a ~9× lift. ([LangChain, Evaluating Skills](https://www.langchain.com/blog/evaluating-skills))

---

## The SKILL.md format

A skill is a filesystem artifact, not a programmatic registration. The contract:

```
.claude/skills/pdf-form-filler/
├── SKILL.md          # YAML frontmatter + markdown body
├── fill_form.py      # bundled script
└── examples/
    └── sample.pdf
```

`SKILL.md` has YAML frontmatter (most importantly a `description` field — Claude uses this to decide whether to invoke the skill) and a markdown body with the instructions and references to bundled files.

**Locations the SDK looks for skills:**

- `.claude/skills/` — project-scoped, committed to the repo
- `~/.claude/skills/` — user-scoped, across all projects
- Plugin skills — bundled with plugins (see [Claude Code best practices](https://github.com/shanraisshan/claude-code-best-practice))

**SDK options:**

- `skills: "all"` — load every skill found
- `skills: ["pdf-form-filler", "sql-generator"]` — explicit list
- `skills: []` — disable
- `settingSources: ["user", "project"]` — which scopes to scan

**SDK quirk:** the `allowed-tools` YAML frontmatter field that works in Claude Code CLI is *ignored* in the SDK — use the top-level `allowedTools` option instead.

Full spec: [Claude Agent SDK — Skills](https://code.claude.com/docs/en/agent-sdk/skills).

---

## Progressive disclosure — the key idea

A skill exists at three levels of detail and the model loads only what it needs:

| Level | When loaded | What's in it |
|---|---|---|
| **Metadata** | Always — at session start | The `description` field; ~50 tokens per skill |
| **SKILL.md body** | When the model decides the skill is relevant | The full instructions; ~500-2K tokens |
| **Bundled files** | When the skill body references them | Python scripts, examples, data — could be megabytes |

This is why complexity isn't bounded by context size. The PDF-skill example: it can manipulate PDFs (fill forms, extract fields) via a bundled Python script that the model invokes — *the PDF itself never enters the context window*. Deterministic operations run outside generation in [code execution](tool-design.md).

---

## Empirical bounds (from production data)

| Bound | Source | Implication |
|---|---|---|
| 82% vs 9% success | [LangChain, Evaluating Skills](https://www.langchain.com/blog/evaluating-skills) | Skills are a real lever, not a packaging trick |
| ~12 similar skills max | LangChain | Loading 20 similar LangGraph skills caused mis-invocation; ~12 stabilized |
| 70% invocation reliability | LangChain | Even with explicit invocation prompts, Claude Code only invoked some skills 70% of the time |
| Limited markdown vs XML impact | LangChain | For 300-500-line skills, formatting choices barely moved the needle — content matters more |

**Operational takeaway:** beyond ~12 similar skills, performance degrades. Group skills into clusters; route via a meta-skill or subagent rather than loading 50 at once. And don't trust 100% invocation — instrument it.

---

## Designing a skill that gets invoked

The `description` field is the single most important line. The model sees descriptions and decides which skill is relevant. Make them:

- **Specific.** "Generate SQL for PostgreSQL with proper escaping" beats "SQL helper."
- **Action-oriented.** Verbs. "Extract tabular data from PDF." Not "PDF utilities."
- **Disambiguated.** If you have multiple skills in the same domain, the descriptions need to clearly signal *which* situation triggers *which* skill.

The body of SKILL.md is where you teach the model how to use the bundled tools — error patterns to watch for, defaults to apply, when to escalate to a human, when to use the bundled script vs do it inline.

---

## What you can ship as a skill

Anything that's:

- **Reusable.** If you'd write it as a prompt suffix in three different conversations, it's a skill.
- **Deterministic at the action layer.** A `fill_pdf_form.py` script is a perfect skill bundle — the model decides *when* to fill the form, deterministic code decides *how*.
- **Independent of the host harness.** A well-designed skill works in Claude Code, the Agent SDK, and Claude.ai with the same `SKILL.md` file.

Real-world examples worth studying:

- [everything-claude-code](https://github.com/affaan-m/ECC) — 232 skills + 60 subagents, cross-harness (Cursor, Codex, OpenCode, Zed, Copilot, Claude Code)
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — most-starred Claude Code reference repo (54.7K stars); see its skills catalog
- Anthropic's bundled skills (PDF, presentations, web research) in the [Claude Agent SDK docs](https://code.claude.com/docs/en/agent-sdk)

---

## Security

From [Anthropic's skills post](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills):

> Skills must come from trusted sources — they can carry exfiltration code or unintended actions.

The model autonomously executes bundled scripts when the skill is invoked. A malicious skill in your repo can call out to the internet, read other files, push to the wrong remote. Treat third-party skills the way you'd treat any third-party dependency: read the bundled scripts before installing.

[Anthropic's Auto Mode](https://anthropic.com/engineering/claude-code-auto-mode) layers a transcript classifier on top to catch overeager skill invocations — see [Harness Engineering](harness-engineering.md#sandboxing--permissions) for the broader security model.

---

## Anti-patterns

- **Skill catalog as documentation dump.** A "skills" directory with 50 entries that are mostly notes is just more context noise. Skills are *invocable capabilities*, not READMEs.
- **Overlapping descriptions.** Two skills with similar descriptions cause invocation collapse — the model picks neither, or picks wrong.
- **Skills that just re-prompt.** If a skill is "system prompt + instruction text" with no bundled code, it's a slash command, not a skill. Slash commands are simpler and more predictable for that case.
- **Skipping the dry-run.** [LangChain's evaluation methodology](https://www.langchain.com/blog/evaluating-skills) — test invocation rate before testing success rate. A perfect skill that's never invoked is worthless.

---

## Related

- [Context Engineering](context-engineering.md) — skills are the progressive-disclosure implementation of "select"
- [Tool Design](tool-design.md) — skills bundle tools; this page covers what makes a *single* tool good
- [Harness Engineering](harness-engineering.md) — where skills slot into the broader system
- [Research Notes](research-notes.md) — primary sources for every claim on this page
