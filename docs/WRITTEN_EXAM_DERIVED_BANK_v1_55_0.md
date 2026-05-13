# Written Exam Derived-Bank Expansion v1.55.0

## Purpose

This patch expands written exam mode without replacing the restored r152/r154 visual-training bank. The current app now keeps the curated 32 visual questions and derives additional written-exam prompts from existing open-answer cards that already carry source references.

## Result

| Inventory | Count |
|---|---:|
| Curated visual written questions preserved | 32 |
| Existing open-answer cards promoted through metadata | 367 |
| Total eligible written exam prompts | 399 |

## Derived open-answer pool breakdown

### By pool

| Pool | Count |
|---|---:|
| written-main | 225 |
| written-recall | 88 |
| written-review | 54 |

### By subject domain

| Domain | Count |
|---|---:|
| biology | 94 |
| chemistry | 122 |
| physics | 151 |

### By command word

| Command | Count |
|---|---:|
| calculate | 54 |
| describe | 57 |
| explain | 115 |
| graph | 5 |
| identify | 13 |
| state | 123 |

## Implementation notes

- `data/year9-content.js` now carries exam metadata on eligible open-answer cards: `examEligible`, `examCommand`, `examMarks`, `examDomain`, `examPool`, `answerFormatHint` and audit/source fields.
- `app.js` builds a combined written bank at runtime from `WRITTEN_EXAM_BANK` plus eligible open-answer cards.
- The exam selector still generates exact 15, 30 and 45 mark papers with one-third Biology, one-third Chemistry and one-third Physics.
- Vocabulary-only cards remain excluded from the main written exam pool.
- `written-review` cards are included but flagged as needing future command-word polishing; they are lower weighted by the selector than `written-main` and curated visual questions.

## QA completed

- `node --check app.js`
- `python tools/validate_content.py`
- `python tools/release_readiness_audit.py`
- VM-level written-exam generation check: 10 generated papers each for 15, 30 and 45 marks, all exact-mark and balanced by domain.

## Follow-up recommendation

Next content pass should rewrite the 54 `written-review` items into cleaner `state`, `identify`, `describe`, `explain`, `calculate` or `graph` wording while preserving source intent.
