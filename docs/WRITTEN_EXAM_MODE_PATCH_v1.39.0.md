# v1.39.0 — Written Exam Mode Patch

## Scope

Adds an end-of-year written exam builder for the Year 9 Science app.

The mode is designed for exam practice where students need to write answers using command words such as:

- state
- identify
- describe
- explain
- calculate

## What changed

### App UI

- Added **Written exam mode** to the learning-mode cards.
- Added direct exam-builder buttons:
  - Quick · 15 marks
  - Standard · 30 marks
  - Full · 45 marks
- Added written-answer cards with:
  - command word
  - mark allocation
  - answer-format guide
  - free-text response box
  - hidden mark scheme
  - self-mark buttons
  - model answer
  - key words/actions
  - common mistakes

### Exam balance

Every generated written exam is balanced by science domain:

| Paper | Biology | Chemistry | Physics | Total |
|---|---:|---:|---:|---:|
| Quick | 5 | 5 | 5 | 15 |
| Standard | 10 | 10 | 10 | 30 |
| Full | 15 | 15 | 15 | 45 |

### Question bank

Added an app-level written-question bank with 18 written exam questions:

- 6 Biology
- 6 Chemistry
- 6 Physics

The questions are focused on high-value revision-pack topics and written-answer structure.

## Files changed

- `index.html`
- `app.js`
- `styles.css`
- `docs/WRITTEN_EXAM_MODE_v1.39.0.md`
- `docs/written_exam_bank_v1_39_0.csv`

## Validation

Validated with:

```bash
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
```

All checks passed.
