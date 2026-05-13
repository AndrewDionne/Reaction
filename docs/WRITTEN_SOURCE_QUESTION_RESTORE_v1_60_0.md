# v1.60.0 — Source question wording restore

## Purpose

This patch reverses the visible wording polish from v1.56 for the 54 reviewed written prompts. The question card now shows the unaltered/source-recorded prompt text again, while the hidden exam metadata still classifies each prompt for answer-format help and balanced written-exam assembly.

## What changed

- Restored **54 / 54** reviewed prompts to the `old_question` text recorded in `WRITTEN_REVIEW_POLISH_CHANGES_v1_56_0.csv`.
- Removed the visible command-word pill from written exam cards.
- Kept `examCommand`, `examMarks`, `examDomain` and `answerFormatHint` metadata for hidden selection logic and the optional Answer format helper.
- Restored the broad 9F source prompt — `Prepare a talk: what should be included on extracting iron and preventing rusting?` — to written exam eligibility.
- Retired the two v1.56 split prompts from written-exam selection so the source prompt is not duplicated by rewritten child prompts.

## Current written prompt count

| Source | Count |
|---|---:|
| Curated visual written prompts | 32 |
| Derived open-answer prompts | 367 |
| **Total written prompts** | **399** |

## Derived written bank breakdown

### By pool

- `written-main`: 279
- `written-recall`: 88

### By command metadata

- `calculate`: 53
- `describe`: 60
- `explain`: 120
- `graph`: 5
- `identify`: 22
- `state`: 107

### By domain

- `biology`: 94
- `chemistry`: 122
- `physics`: 151

## QA

- `node --check app.js` passed.
- `python3 tools/validate_content.py` passed.
- `python3 tools/release_readiness_audit.py` passed with **15 pass, 2 warn, 0 fail**.
- Static written-bank check confirms exact 1/3 Biology / Chemistry / Physics mark combinations remain possible for 15, 30 and 45 mark papers.

## Notes

The restored wording is the source-recorded prompt text from the 54-question review queue. The hidden `examCommand` is intentionally retained: it supports paper balancing and the optional Answer format help, but no longer appears as a visible command-word label on the question card.
