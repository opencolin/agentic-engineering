#!/usr/bin/env bash
# check-hype-words.sh — fail the CI if banned vocabulary appears in content/.
#
# Rules:
# - The banned list is below. Word-boundary, case-insensitive.
# - Lines ending with the literal HTML comment <!-- quote --> are skipped
#   (escape hatch for verbatim quotes from primary sources).
# - Scans content/**.md by default. Pass paths as args to scan specific files.
# - Exit 0 = clean. Exit 1 = at least one offender found.
#
# Banned words (commandment #4 — see CONTRIBUTING.md):
#   revolutionary
#   game-changing / game changer / game changing
#   seamless / seamlessly
#   leverage (as a verb only; nouns like "Coral's leverage" are fine, but the
#     pattern below catches the common verb form "leverage <X> to <Y>").
#   transformative
#   paradigm shift

set -euo pipefail

# Banned word patterns. Each is a POSIX ERE the script will match
# case-insensitively against each line. Add new entries by appending below.
BANNED_PATTERNS=(
  '\brevolutionary\b'
  '\bgame[ -]chang(er|ing)\b'
  '\bseamless(ly)?\b'
  '(^|[^-[:alnum:]])leverag(e|es|ed|ing)[[:space:]]+(the|a|an|our|their|its|this|that|these|those|[A-Z][a-z])'
  '\btransformative\b'
  '\bparadigm[ -]shift\b'
)

# Files to scan.
if [[ $# -gt 0 ]]; then
  FILES=("$@")
else
  # Default: all markdown under content/.
  mapfile -t FILES < <(find content -type f -name '*.md' 2>/dev/null | sort)
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "check-hype-words: no markdown files to scan." >&2
  exit 0
fi

OFFENDERS=0

for file in "${FILES[@]}"; do
  [[ -f "$file" ]] || continue
  line_no=0
  while IFS= read -r line || [[ -n "$line" ]]; do
    line_no=$((line_no + 1))
    # Skip explicit-quote escape hatch.
    if [[ "$line" == *'<!-- quote -->'* ]]; then
      continue
    fi
    for pattern in "${BANNED_PATTERNS[@]}"; do
      if echo "$line" | grep -E -i -q -- "$pattern"; then
        # Find the matched word for the report.
        matched=$(echo "$line" | grep -E -i -o -- "$pattern" | head -1)
        echo "::error file=$file,line=$line_no::banned word '$matched' (see CONTRIBUTING.md commandment #4)"
        echo "  $file:$line_no: $line"
        OFFENDERS=$((OFFENDERS + 1))
      fi
    done
  done < "$file"
done

if [[ $OFFENDERS -gt 0 ]]; then
  echo ""
  echo "check-hype-words: $OFFENDERS offending line(s). See CONTRIBUTING.md commandment #4."
  echo "  To verbatim-quote a primary source, append <!-- quote --> at the end of the line."
  exit 1
fi

echo "check-hype-words: clean (${#FILES[@]} file(s) scanned)."
exit 0
