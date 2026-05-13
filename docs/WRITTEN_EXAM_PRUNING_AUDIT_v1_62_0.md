# Written exam pruning audit v1.62.0

## Purpose

Reduce the written-exam selector without reducing coverage. This patch does **not** delete study cards and does **not** alter source-style question wording. It only retires lower-value derived prompts from written-exam selection.

## Result

| Area | Before | After | Change |
|---|---:|---:|---:|
| Curated visual prompts | 32 | 32 | 0 |
| Derived open-answer prompts eligible for written exam | 367 | 269 | -98 |
| Total written-exam prompts | 399 | 301 | -98 |

## Coverage preservation checks

| Coverage check | Before | After | Result |
|---|---:|---:|---|
| Learning objectives represented by derived written prompts | 38 | 38 | pass |
| Learning objective + command pairs represented | 108 | 108 | pass |
| Graph prompts | 5 | 5 | pass |

## Derived prompt count by unit

| Unit | Before | After | Retired |
|---|---:|---:|---:|
| 9A | 33 | 23 | 10 |
| 9B | 61 | 39 | 22 |
| 9E | 54 | 48 | 6 |
| 9F | 68 | 55 | 13 |
| 9I | 62 | 47 | 15 |
| 9J | 89 | 57 | 32 |

## Derived prompt count by hidden command flag

| Command flag | Before | After | Retired |
|---|---:|---:|---:|
| state | 106 | 62 | 44 |
| identify | 22 | 22 | 0 |
| describe | 60 | 45 | 15 |
| explain | 120 | 105 | 15 |
| calculate | 54 | 30 | 24 |
| graph | 5 | 5 | 0 |

## Retirement reasons

| Reason code | Count |
|---|---:|
| low_value_recall_overlap | 42 |
| surplus_calculation_variant | 23 |
| objective_pool_trim | 17 |
| micro_prompt_overlap | 14 |
| project_style_prompt | 1 |
| duplicate_or_near_duplicate | 1 |

## Pruning rules

1. Keep every curated visual written prompt.
2. Keep every learning objective represented.
3. Keep every existing learning objective + command flag pair represented.
4. Prefer prompts with media, source-style diagram redraws, exact-source-answer records, and stronger written-answer structure.
5. Retire only from written-exam selection; retain cards in the wider study app.
6. Preserve source-style question wording for every retained prompt.

## Files

- `docs/WRITTEN_EXAM_PRUNING_DECISIONS_v1_62_0.csv`
- `docs/WRITTEN_EXAM_RETAINED_BANK_v1_62_0.csv`
- `docs/WRITTEN_EXAM_COMMAND_FORMAT_BANK_v1_62_0.csv`
