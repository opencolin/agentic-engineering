# Pre-Launch Checklist — v2.0

> Last updated: 2026-06-01. Owner: opencolin. Target launch date: **TBD (Q3 2026 — likely Sept).**

Tick boxes the day they pass. Re-check the morning of launch.

---

## T-14 days: editorial freeze

- [ ] All `content/*.md` carry `lastVerified` ≤ 30 days from launch date.
- [ ] All `content/*.md` carry `staleBy` ≥ launch date + 90 days.
- [ ] Five-commandment audit on every page (decision block, named loser, primary source, no hype, dates set).
- [ ] `scripts/check-hype-words.sh` clean across `content/**.md` on `main`.
- [ ] `src/data/comparison.json` row count documented; categories ≥ 5; rows ≥ 40.
- [ ] `src/data/stack-questions.json` covers ≥ 8 questions and ≥ 6 stacks.
- [ ] `CONTRIBUTING.md` reviewed by 2 reviewers from Who's Who.

## T-10 days: kill the deprecations

- [ ] `content/comparison.md` deleted (replaced by `/compare/`); redirect added in `vercel.json`.
- [ ] `content/sandboxes.md` merged into `content/infrastructure.md` as a featured subsection; redirect added.
- [ ] `content/organizations.md` moved to appendix of `content/harness-engineering.md`; redirect added.
- [ ] IA reshuffled into final v2 groups (Get Started · Coding Agents · Patterns & Schools · Operate · Protocols · Interfaces · Infrastructure · People · Community).
- [ ] Stale banners verified to render on a test page with `staleBy: yesterday`.

## T-7 days: killer features QA

- [ ] `/pick-stack/` — complete 5 distinct answer paths; each produces a distinct recommendation.
- [ ] `/pick-stack/` — share URL round-trips (paste in incognito, restored state matches).
- [ ] `/pick-stack/` — keyboard nav works through the form.
- [ ] `/compare/` — filter on `MCP = yes` AND `isolation = microvm`; result count matches the JSON dataset.
- [ ] `/compare/` — sort columns work in both directions.
- [ ] `/compare/` — each row links to the right URL and the right content page section.
- [ ] Pagefind: Cmd/Ctrl-K opens the palette; arrow nav works; first result + Enter lands on the page.
- [ ] Newsletter form submits to Buttondown; 200 response; confirmation email arrives.
- [ ] `/feed.xml` validates as RSS 2.0 at https://validator.w3.org/feed/.
- [ ] Discussions enabled on the repo; "Discuss this page" link works on 3 sampled pages.
- [ ] "Edit on GitHub" link routes to the correct file in the editor on 3 sampled pages.

## T-7 days: launch artifact polish

- [ ] State of Agentic Engineering 2026 Q* report — final editorial pass.
- [ ] Report — PDF rendering pipeline produces a clean PDF.
- [ ] Report — OG image looks good in the social-card debugger (https://www.opengraph.xyz/).
- [ ] Launch post — reviewed by 3 people in `who-is-who.md`.
- [ ] Launch post — OG image looks good in the social-card debugger.
- [ ] Primary-source interview transcript — published at `/interviews/<subject>-2026-q3/`.
- [ ] Pull-quotes from the interview surfaced on the relevant Who's Who profile.

## T-3 days: distribution warmup

- [ ] Newsletter list seeded with ≥ 20 manual signups (friends + advisors).
- [ ] HN account ready to post (account ≥ 90 days old, karma ≥ 100; not a fresh account).
- [ ] X/Twitter draft thread ready.
- [ ] LinkedIn draft post ready.
- [ ] Lobste.rs invite pre-arranged with a member, if needed.
- [ ] Reviewers tagged with their preferred handle on each platform.

## T-1 day: dress rehearsal

- [ ] Push to staging URL; full link-check (no 404s on internal links).
- [ ] Lighthouse: Performance ≥ 95, Accessibility ≥ 95, SEO = 100 on `/`, `/pick-stack/`, `/compare/`, and the report URL.
- [ ] Build is reproducible from a fresh clone in < 5 minutes.
- [ ] All redirects in `vercel.json` tested with `curl -I`.
- [ ] DNS / domain pointing checked.

## Launch day (T-0)

- [ ] Merge `claude/v2.0-launch` → `main` once approvals are in.
- [ ] Verify deploy on `agentic-engineering.vercel.app` within 5 minutes.
- [ ] Post to HN (10am ET sweet spot).
- [ ] Post to Lobste.rs.
- [ ] Post to X (thread, not single tweet).
- [ ] Post to LinkedIn.
- [ ] Newsletter blast (subject line A/B'd if possible).
- [ ] Tag every reviewer in their relevant post.
- [ ] Watch the runtime logs (Vercel) for the first hour.

## T+1 day: damage control

- [ ] Triage HN comments — respond to top-level threads within 2 hours.
- [ ] Triage GitHub issues opened in the last 24h.
- [ ] Capture corrections raised on HN/X/Lobsters into issues using the correction template.
- [ ] Update the changelog with a launch-week entry.

## T+7 days: retro

- [ ] Newsletter signup count vs. target.
- [ ] HN final position.
- [ ] PR / issue count vs. baseline.
- [ ] One-page retro in `roadmap/` covering: what worked, what didn't, what to change for v2.1.

---

## Distribution tag-list (sketch — confirm pre-launch)

These are the people most relevant to the launch narrative. **None of them have been asked yet** as of 2026-06-01; we ask at T-7 once the artifact is ready.

**HN** — the launch post submission itself. The first comment slot is the maintainer's; second-comment seeding by reviewers helps.

**X / Bluesky / Mastodon — tag list (sketch)**:

- Anthropic agents team handles (Boris Cherny, Erik Schluntz, Barry Zhang — see Who's Who for current handles).
- LangChain team (Harrison Chase, Lance Martin, Will Fu-Hinthorn).
- OpenAI Codex / Agents SDK team (Romain Huet, Logan Kilpatrick for amplification).
- Vercel agents team (Malte Ubl, Lee Robinson for amplification).
- Cognition (Scott Wu, Russell Kaplan).
- Independent voices (Simon Willison, Hamel Husain, Eugene Yan, Shreya Shankar).
- Council reviewers from Who's Who who agreed to be tagged.

**Lobste.rs** — request an invite from a known member at T-7. The site fits Lobsters' "no fluff" bar.

**LinkedIn** — the more enterprise-shaped tag list (Stripe Minions authors named publicly, Block/Goose team, Microsoft Agent Framework team, AWS Strands team).

**Reddit r/LocalLLaMA / r/MachineLearning** — only if the launch post has a self-hosted angle in the thread.

**Newsletters that link out** — TLDR AI, Latent Space, Hamel's notes, Eugene Yan's roundup, AI Engineer Newsletter. Reach out at T-7 with the embargo.

---

## Open questions to close before launch

- Domain — keep `agentic-engineering.vercel.app` or move to a custom domain? (See `vercel.json`.)
- Launch quarter — Q3 vs Q4 depends on Astro merge timing.
- Quarterly Report PDF — render at build time or via Vercel cron? Pick before T-14.
- First interview subject — Cherny, Vincent, Steinberger, Chase, or Polosukhin? Commit at T-21.
