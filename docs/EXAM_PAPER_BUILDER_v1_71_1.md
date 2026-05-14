# Exam paper builder v1.71.1

## What changed

This patch extends the first year-end paper builder from a single fixed paper into a small paper-variant system.

## Added

- Three complete fixed papers:
  - Paper A
  - Paper B
  - Paper C
- Paper selector in `exam-paper.html`
- Random paper button
- Section selector:
  - Full paper
  - Section A only
  - Section B only
  - Section C only
  - Section D only
- Answer key updates automatically for the selected paper/section.
- Total marks update automatically for the selected section or full paper.

## Current model

The builder now supports multiple fixed paper variants. It does not yet generate each sub-question dynamically from a large random pool.

This is intentional for this step: it keeps the paper structure stable while giving the student multiple authentic practice papers.

## Next recommended patch

`v1.71.2` should add question pools inside each topic block so the builder can generate a unique version of the same paper each time while preserving:

- section structure
- topic coverage
- mark totals
- state / calculate / explain / graph / practical balance
- answer key alignment
