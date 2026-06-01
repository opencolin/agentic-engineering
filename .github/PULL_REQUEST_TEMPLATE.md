<!--
Thanks for the PR. We are an opinionated reference, so we ask every contributor
to walk the five commandments before submitting. The CI hype-word linter will
catch (4); the rest are on the reviewer and the author.
-->

## What does this PR change?

<!-- 1-3 sentences. Link the issue if there is one (#NNN). -->

## Commandment checklist

Tick all that apply. If something doesn't apply, write "n/a — <reason>" next to it.

- [ ] **(1) Every page ends in a decision framework.** If you added a page or section, it ends in either a "When to pick X" / "When to pick something else" or a decision table.
- [ ] **(2) Comparison pages name the loser.** If you added a comparison table or "alternatives" section, you named at least one specific alternative and said when *not* to pick the thing you're recommending.
- [ ] **(3) Every load-bearing claim cites a primary source.** Vendor docs, papers, GitHub repos, conference talks. Press releases do not count as the only source.
- [ ] **(4) No hype vocabulary.** The CI linter (`scripts/check-hype-words.sh`) will fail on `revolutionary`, `game-changing`, `seamless`, `leverage` as a verb, `transformative`, `paradigm shift`. If yours is a quoted phrase from a primary source, mark the line `<!-- quote -->` and the linter will skip it.
- [ ] **(5) Frontmatter is set.** `lastVerified` is today (or earlier, if you're confirming an unchanged claim). `staleBy` is no more than 6 months out. If you renamed a page, the slug in frontmatter matches the filename.

## Type of change

- [ ] Content addition (new vendor, paper, framework, section)
- [ ] Correction (a specific stale or wrong claim)
- [ ] New page
- [ ] Editorial pass (rewording, structural cleanup — no factual changes)
- [ ] Build / tooling / CI
- [ ] Dataset update (`src/data/*.json`)

## Primary sources cited in this PR

<!-- List them. URLs are fine. -->

-
-

## Reviewers — what to look for

<!-- Optional. If you want a specific kind of review, ask for it here. -->

## Anything else?

<!-- Conflict-of-interest disclosure goes here. If you work for a vendor mentioned in this PR, say so. -->
