# v1.73.1 — Exam mode UI cleanup and digital graph answers

## Purpose

This patch continues the simplified learning-mode work by making Exam mode feel like a real digital GCSE-style written paper instead of a written-test builder page.

## Changes

- Replaced the crowded exam control panel with a compact setup/action bar.
- Kept the global app header stable: Reaction title, Sound, Export, and Import remain unchanged.
- Added a GCSE-style app cover page with:
  - time allowed
  - total marks
  - equipment
  - instructions
  - candidate details
  - information notes
- Removed exam-page builder controls:
  - Paper type dropdown
  - Section dropdown
  - Answer view dropdown
  - Random paper button
  - Answer-key locked button
  - Back to app button
- Moved **Submit paper** to the bottom of the paper.
- Kept **Print / Save PDF** as a secondary action near the top of the exam route.
- Preserved answer locking: expected answers, explanations, common mistakes, and class-note links only appear after submission.
- Added digital graph plotting for graph questions:
  - click grid to plot points
  - click plotted point to remove it
  - clear plotted points
  - add/remove a straight line
  - plotted graph work is included in export/import payloads and remains visible when printing
- Integrated Year-end essentials into relevant unit overview/class-note content instead of restoring a separate button or mode.

## Regression guardrails

- Existing class notes, unit overviews, question IDs, and exam paper data were preserved.
- The exam page still reads from `data/year9-exam-paper-bank.js`.
- The global header contents were not made page-specific.
