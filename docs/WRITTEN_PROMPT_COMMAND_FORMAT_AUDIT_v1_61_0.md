# v1.61.0 — Written prompt command-format audit

This patch systematically reviews the derived written prompt bank and adds hidden command-format support while preserving the exact/source-recorded question wording.

## Scope

| Item | Count |
|---|---:|
| Derived eligible written prompts reviewed | 367 |
| Curated visual written prompts checked | 32 |
| Total written prompts with command-format support | 399 |
| Student-facing question text changed | 0 |
| Prompts with hidden `examCommand` flag | 367 |
| Prompts with `answerFormatHint` | 367 |
| Prompts with `answerFormatSteps` | 367 |
| Command flags changed during this review | 1 |

## Derived command flag distribution

| Command flag | Count |
|---|---:|
| `state` | 106 |
| `identify` | 22 |
| `describe` | 60 |
| `explain` | 120 |
| `calculate` | 54 |
| `graph` | 5 |

## Unit distribution

| Unit | Reviewed prompts |
|---|---:|
| 9A | 33 |
| 9B | 61 |
| 9E | 54 |
| 9F | 68 |
| 9I | 62 |
| 9J | 89 |

## Exam-pool distribution

| Pool | Reviewed prompts |
|---|---:|
| `written-main` | 279 |
| `written-recall` | 88 |

## Student-facing behaviour

- The question card still shows the exact/source-recorded question text.
- The hidden command flag is used only for selection balance, mark guidance and the Answer format support.
- The Answer format panel gives structure without displaying a visible command-word label beside the question.

## Files changed

- `data/year9-content.js`
- `app.js`
- `tools/release_readiness_audit.py`
- `README.md`
- `docs/README.md`
- `docs/MAINTENANCE.md`
- `docs/CHANGELOG.md`

## Combined written-bank command distribution

| Command flag | Count |
|---|---:|
| `state` | 109 |
| `identify` | 29 |
| `describe` | 70 |
| `explain` | 130 |
| `calculate` | 56 |
| `graph` | 5 |

The combined total includes the 32 curated visual prompts plus the 367 derived open-answer prompts.
