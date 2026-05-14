# Revision answer key enhancement v1.72.1

## Purpose

The normal exam-paper builder now supports two answer-key modes:

1. **Mark scheme** — short expected answers for quick marking.
2. **Revision answer key** — expanded answers explaining why each answer is correct, with links back to learning material.

This keeps the student paper unchanged while making the post-test review step more useful.

## What changed

### Exam paper renderer

Updated `exam-paper.html` with an **Answer key** selector:

- `Mark scheme`
- `Revision answer key`

The revision answer key shows, for each sub-question:

- expected answer
- why this answer is correct
- common mistakes
- Learn more link

### Exam paper data

Updated `data/year9-exam-paper-bank.js` so every exam-paper sub-question now includes:

- `explanation`
- `learnMore`
- `commonMistakes`

### Source-style question bank

Updated `data/year9-source-style-question-bank.js` so reusable source-style subquestions also include:

- `explanation`
- `learnMore`
- `commonMistakes`

### Class-note deep links

Updated `app.js` so links such as:

```text
index.html#note=9J-circuits
```

open the relevant class note automatically.

### Validation

Updated validators so exam-paper and source-style subquestions must include the revision-support fields.

## Files changed

- `exam-paper.html`
- `app.js`
- `index.html`
- `year-end-essentials.html`
- `data/year9-exam-paper-bank.js`
- `data/year9-source-style-question-bank.js`
- `tools/validate_exam_paper_bank.py`
- `tools/validate_source_style_question_bank.py`
- `docs/CHANGELOG.md`

## Notes

Some repeated source-exam topics, such as cells, digestion and waves, do not yet have full dedicated class-note pages. Their Learn more links point to `year-end-essentials.html` until those topics are promoted into full class-note content.
