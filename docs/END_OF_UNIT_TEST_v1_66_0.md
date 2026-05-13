# End of Unit Test v1.66.0

## Scope

Adds an **End of unit test** route that uses the existing written/test-bank prompts only. It does not introduce MCQs and does not alter any student-facing question wording.

## Implemented behaviour

- Adds a hub mode card: **End of unit test**.
- Requires a single selected unit context.
- Builds 15, 30 or 45 mark source-style written tests from the selected unit.
- Pulls from the retained written exam bank, including existing visual prompts.
- Prefers coverage across the unit's sub-units / learning objectives where possible.
- Reuses the existing written-answer renderer, answer-format support, mark schemes and self-marking flow.
- Shows unit/sub-unit balance on the completion screen instead of Biology/Chemistry/Physics balance.

## Guardrails

- MCQs are not included.
- The source-style question text is unchanged.
- Existing Revisit test mode remains separate.
- Existing full written exam mode remains balanced 1/3 Biology, 1/3 Chemistry, 1/3 Physics.

## Static QA summary

| Unit | Written prompts | Sub-units covered | Visual prompts | 15 marks | 30 marks | 45 marks |
|---|---:|---:|---:|---|---|---|
| 9A | 25 | 4/4 | 6 | yes | yes | yes |
| 9B | 48 | 5/5 | 25 | yes | yes | yes |
| 9E | 51 | 8/8 | 32 | yes | yes | yes |
| 9F | 50 | 8/8 | 24 | yes | yes | yes |
| 9I | 52 | 6/6 | 23 | yes | yes | yes |
| 9J | 58 | 7/7 | 32 | yes | yes | yes |

## QA commands

- `node --check app.js`
- `node --check data/year9-content.js`
- `node --check data/year9-notes.js`
- `python3 tools/validate_content.py`
- `python3 tools/release_readiness_audit.py`

All passed with **15 pass, 2 warn, 0 fail** from the release-readiness audit.
