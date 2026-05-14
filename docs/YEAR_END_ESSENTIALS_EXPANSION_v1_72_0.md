# Year-end essentials expansion v1.72.0

## Purpose

This patch moves the exam-prep flow fully toward the format shown in the uploaded practice papers. The retired 110-mark challenge paper mode has been removed from the active exam builder so the app now focuses on the expected normal source-style format.

## Main changes

### Exam builder

- Removed active 110-mark challenge papers from `data/year9-exam-paper-bank.js`.
- Removed the **Challenge 110-mark** option from `exam-paper.html`.
- Kept:
  - normal 80-mark papers
  - source-example papers
  - section-only practice
  - answer-key toggle
  - print / save PDF layout
- Added a third normal 80-mark paper:
  - `YEAREND-NORMAL-80-C`

### Year-end essentials page

Expanded `year-end-essentials.html` into a more complete source-style study checklist covering:

- Biology essentials
  - cells, microscopy and organisation
  - photosynthesis, respiration and plant transport
  - digestion, enzymes and food tests
- Chemistry essentials
  - atoms, elements, compounds and the periodic table
  - acids, alkalis, reactions and safety
  - states of matter, particles and density
- Physics essentials
  - forces, speed and graphs
  - energy resources, transfers and electricity
  - waves, light and sound
- Working scientifically essentials
  - graph plotting and interpretation
  - variables, controls, repeats and safety

Each topic now includes:

- must-know content
- exam wording patterns
- model answer move where useful

### Source-style subquestion bank

Added:

- `data/year9-source-style-question-bank.js`
- `tools/validate_source_style_question_bank.py`

The new bank stores reusable short-answer subquestions matching the source-exam wording style. It is intended as the next foundation for true paper randomisation while preserving the 80-mark source-style structure.

## Retired active format

The 110-mark challenge papers are no longer active in the paper bank. The app should now prioritise:

- normal 80-mark papers
- source examples
- section-only practice

## Validation

Run:

```bash
python3 tools/validate_exam_paper_bank.py
python3 tools/validate_source_style_question_bank.py
python3 tools/validate_question_ids.py
python3 tools/validate_unit_overviews.py
python3 tools/validate_content.py
node --check data/year9-exam-paper-bank.js
node --check data/year9-source-style-question-bank.js
node --check exam-paper.html
```
