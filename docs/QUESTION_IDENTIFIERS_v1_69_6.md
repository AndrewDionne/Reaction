# Question identifiers v1.69.6

## Purpose

Each question card now has a short QC identifier so reviewers can refer to questions without copying the full prompt or long legacy ID.

## Identifier format

`UNIT-TYPE-NUMBER`

Examples:

- `9A-MCQ-01`
- `9A-WE-01`
- `9J-CALC-03`
- `9E-VOC-08`

## Type codes

| Code | Meaning |
|---|---|
| `MCQ` | Multiple-choice question |
| `WE` | Written explanation / open written-response question |
| `CALC` | Calculation question |
| `VOC` | Vocabulary / key-term question |

## Numbering rule

Numbers restart for each `unit + type` group.

Example:

- `9A-MCQ-01`
- `9A-MCQ-02`
- `9A-WE-01`
- `9B-MCQ-01`

## Data changes

- Added `qid` to every card in `data/year9-content.js`.
- Kept all existing legacy `id` values unchanged.
- Progress, mastered/revisit state and saved sessions should continue to use the legacy `id` values.

## UI changes

The app now displays the short QC identifier on:

- normal card sessions
- written exam sessions
- the content review/export page

## Reviewer mapping

See:

- `docs/QUESTION_IDENTIFIER_MAP_v1_69_6.csv`

This file maps every short `qid` back to the long legacy card ID, unit, type, prompt and source.

## Validation

Run:

```bash
python3 tools/validate_question_ids.py
```

The validator checks:

- every card has a `qid`
- the format is valid
- identifiers are unique
- the unit/type code matches the question shape
- numbering is continuous within each unit/type group

## Maintenance note

Now that IDs exist, future content additions should append the next available identifier within that unit/type group rather than renumbering old questions.
