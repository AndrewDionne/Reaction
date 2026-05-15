# v1.73.3 — Written-answer help pop-out simplification

## Purpose

This patch simplifies the written-answer guidance so it supports students without taking over unit overviews or individual question cards.

## Changes

- Moved the general written-answer format guide out of unit overview pages.
- Added a single **How to answer written questions** button in the learning-mode panel.
- The help now opens as a pop-out with three stacked answer types:
  - **Identify** — answer the what / which / where / name clue.
  - **Describe** — say what happens, what changes, or the pattern.
  - **Explain** — give the reason using why / how / because / suggest / compare clues.
- Each type includes:
  - what the question clue looks like
  - what the answer should give
  - the answer format
  - one simple example
  - one common pitfall
- The test-mode **Question type** button now shows a compact, question-specific strategy instead of a large guide panel.

## Design note

The distinction is intentionally simple for Year 9 written-answer practice:

- **Identify** gives the answer.
- **Describe** says what happens.
- **Explain** says why or how it happens.
