# v1.59.0 — student-facing copy QA cleanup

## Scope

This pass removed development-style wording from the student-facing app copy while preserving source-traceability metadata inside the data files.

The scan covered:

- `index.html`
- `app.js`
- `styles.css`
- `data/year9-content.js`
- `data/year9-notes.js`
- `README.md`

Maintainer docs in `docs/` were not treated as student-facing copy and were retained for audit history.

## Main cleanup actions

- Removed the visible source/fidelity footer from practice cards.
- Replaced “Original question” with “Question to practise”.
- Replaced “Revision-pack must know” with “Must know for this unit”.
- Replaced “Revision-pack map” with “Unit map”.
- Replaced “Diagram, graph and calculation coverage” with “Diagrams, graphs and calculations”.
- Converted overview status pills from internal statuses like `covered` to student-facing labels like “Ready”.
- Reworded app subtitles and unit descriptions so they no longer mention restored/upgraded patch history.
- Reworded displayed explanations/cues that referred to “revision-pack wording”, “source-style”, “question-safe”, version numbers, or patch wording.
- Removed unused written-review/polish metadata fields from cards where they were not needed by the app.
- Updated cache-busting versions in `index.html` to `1.59.0`.
- Updated `README.md` to the current r159 counts and student-facing feature summary.

## Display-copy scan result

| Scan | Flagged student-facing strings |
|---|---:|
| r158 before cleanup | 461 |
| r159 after cleanup | 0 |

The remaining raw grep hits are either internal metadata/source trace fields, file paths, CSS class names, or genuine science content such as “sustainable development”.

## Preserved functionality

- Written exam prompt total remains **400**.
- Derived open-answer prompts remain **368**.
- Curated visual written prompts remain **32**.
- `written-review` prompt count remains **0**.
- Source fields and fidelity fields remain in data for internal audit traceability, but they are no longer displayed on normal practice cards.
