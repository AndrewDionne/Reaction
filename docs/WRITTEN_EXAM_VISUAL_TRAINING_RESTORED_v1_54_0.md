# Written Exam Visual Training Restoration v1.54.0

## Scope

This restoration integrates the r152 written-exam patch onto the r153 image-rich repo without reverting r153 content. It turns written exam mode into a diagram/graph/calculation training mode. The question text stays in the app and the image acts as the source diagram.

## Implemented

- Expanded the written exam bank to **32 questions**.
- Added media-backed written questions across Biology, Chemistry/materials and Physics.
- Replaced the fixed blueprint with a randomized balanced builder. Each exam now draws a new exact-mark mix by science domain.
- Added **Answer format** as a student-controlled hint button beside the written answer area.
- Kept the mark scheme hidden until the student submits their answer.
- Added 1–5 difficulty bubbles to written exam cards.
- Added question metadata for skills such as visual, graph, calculation, practical, explain and identify.

## Written bank coverage

| Domain | Questions | Available marks | With media | Graph prompts | Calculation prompts | Command words |
|---|---:|---:|---:|---:|---:|---|
| Biology | 11 | 30 | 9 | 1 | 0 | describe, explain, identify, state |
| Chemistry/materials | 9 | 23 | 7 | 0 | 0 | describe, explain, identify, state |
| Physics | 12 | 34 | 11 | 3 | 3 | calculate, describe, explain, identify, state |

## Exam builder behavior

- 15-mark exam = 5 marks Biology, 5 marks Chemistry/materials, 5 marks Physics.
- 30-mark exam = 10 marks per domain.
- 45-mark exam = 15 marks per domain.
- Within each domain, the builder scores combinations for command-word variety, unit variety, visual prompts, graph/calculation prompts and explain/identify coverage.
- The final order is shuffled so students do not see the same exam sequence every time.

## Best remaining follow-up

Use this mode with students first, then add the next question-safe infographic batch where the written bank still has lower visual coverage: full speed-time graph family, photosynthesis limiting-factor graphs, reactivity/extraction decision tree, natural selection answer-chain and wire-resistance practical refinements.

## QA

- `python tools/validate_content.py` passes.
- `node --check app.js` passes.
- Release-readiness audit reports 0 fails.
- Custom media reference check reports 0 missing media.
- Exact-mark combination check confirms valid Biology/Chemistry/Physics subsets for 15, 30 and 45 mark exams.


## Integration note

Applied selectively on top of v1.53.0. Kept r153 data/year9-content.js, data/year9-notes.js, image assets and unit-overview updates; restored only the written exam bank, randomized exam builder, written-answer UI controls, difficulty bubbles and documentation.
