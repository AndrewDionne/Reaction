# Written Exam Readiness QA v1.64.0

## Summary

- Content version: `1.64.0`
- Written exam prompts before r164: **301**
- Written exam prompts after r164: **284**
- Curated visual prompts retained: **32 / 32**
- Derived open-answer prompts retained: **252**
- Prompts retired from written-exam selection: **17**
- Student-facing question text changes: **0**
- Retired prompts remain available as normal study/revision cards: **yes**

## Coverage checks

| Check | Result |
|---|---:|
| Learning objectives represented before pruning | 38 |
| Learning objectives represented after pruning | 38 |
| Learning-objective + command pairs before pruning | 108 |
| Learning-objective + command pairs after pruning | 108 |
| Lost learning objectives | 0 |
| Lost learning-objective + command pairs | 0 |

## By domain

| Item | Prompts |
|---|---:|
| `biology` | 73 |
| `chemistry` | 101 |
| `physics` | 110 |

## By unit

| Item | Prompts |
|---|---:|
| `9A` | 25 |
| `9B` | 48 |
| `9E` | 51 |
| `9F` | 50 |
| `9I` | 52 |
| `9J` | 58 |

## By hidden command flag

| Item | Prompts |
|---|---:|
| `explain` | 114 |
| `state` | 55 |
| `describe` | 55 |
| `identify` | 29 |
| `calculate` | 26 |
| `graph` | 5 |

## By exam section

| Item | Prompts |
|---|---:|
| `Section A` | 77 |
| `Section B` | 155 |
| `Section C` | 52 |

## Sample-paper QA

15 generated-paper samples were simulated for each paper size after pruning and selection tuning.

| Paper size | Avg questions | Avg visual questions | Avg Section A marks | Avg Section B marks | Avg Section C marks |
|---:|---:|---:|---:|---:|---:|
| 15 | 9–12 | 5–8 | 3–6 | 6–9 | 1–4 |
| 30 | 14–18 | 7–10 | 6–10 | 12–18 | 4–9 |
| 45 | 20–25 | 9–14 | 9–15 | 18–28 | 6–13 |


## Exact domain-balance checks

| Paper size | Domain | Exact target possible |
|---:|---|---|
| 15 | Biology | yes |
| 15 | Chemistry | yes |
| 15 | Physics | yes |
| 30 | Biology | yes |
| 30 | Chemistry | yes |
| 30 | Physics | yes |
| 45 | Biology | yes |
| 45 | Chemistry | yes |
| 45 | Physics | yes |

## r164 implementation notes

- Pruned exact duplicates, redundant formula-only prompts, and weak one-mark recall survivors from written-exam selection only.
- Preserved all source-style question wording on retained prompts.
- Added paper-level quality scoring so generated papers prefer section balance, visual variety, command variety and calculation/graph coverage.
- Kept the answer-format system hidden behind the existing Answer format button.

## Files

- `docs/WRITTEN_EXAM_BANK_v1_64_0.csv`
- `docs/WRITTEN_EXAM_READINESS_PRUNING_v1_64_0.csv`
- `docs/WRITTEN_EXAM_SAMPLE_PAPER_QA_v1_64_0.csv`
- `docs/WRITTEN_EXAM_EXACT_MARK_CHECKS_v1_64_0.csv`
- `docs/WRITTEN_EXAM_QUESTION_TEXT_DIFF_v1_64_0.csv`
