
## v1.69.6 - Question QC identifiers

- Added short `qid` values to all 675 question cards using `UNIT-TYPE-NUMBER` format, such as `9A-MCQ-01` and `9A-WE-01`.
- Displayed question identifiers in normal card sessions, written exam sessions and the content review/export page.
- Added `docs/QUESTION_IDENTIFIER_MAP_v1_69_6.csv` for reviewer lookup.
- Added `tools/validate_question_ids.py` to check uniqueness, format and numbering continuity.

# Changelog

## v1.69.1 — Student-facing unit overview rewrite

- Rewrote all six unit overview pages against the uploaded Year 9 source materials and assess-yourself criteria.
- Added sub-unit must-know points and removed status/developer-style badges from overview pages.
- Changed overview visuals to full-width, single-column display and documented dense images needing replacement.

## v1.69.0 — Docs cleanup and consolidation

- Consolidated the `docs/` folder from **138** historical/generated files to a compact current documentation set.
- Replaced per-patch image, written-exam and readiness reports with current summary docs and current CSV inventories.
- Regenerated the asset manifest and written-exam bank inventory against content version **1.68.0**.
- Updated the release-readiness audit script so future reports use the active content version instead of a stale fixed report version.

## v1.68.0 — Targeted question-safe image integration

- Integrated the corrected question-safe blast furnace image with A-E labels.
- Integrated the corrected question-safe metal reactions image.
- Preserved student-facing question wording while improving visual support for 9F written prompts.

## v1.67.0 — Reaction Images R7 targeted visual integration

- Integrated selected R7 visuals into class notes, unit overviews and targeted question cards.
- Added stronger visuals for 9A ecosystems/extinction, 9I moments/terminal velocity/liquid pressure and 9J wire resistance/electric fields.
- Kept answer-leaking variants out of active question flow.

## v1.66.0 — End of unit written test

- Added an End of unit test mode that draws from existing written/test-bank prompts only.
- Added unit-specific written tests with 15, 30 and 45 mark options.
- Preserved existing visuals and source-style question wording.

## v1.65.0 — Revisit test loop

- Added Revisit test mode as a test-building filter over cards marked for Revisit.
- Added unit/sub-unit progress bars on the main hub.
- Kept Revisit decisions student-controlled.

## v1.64.0 — Exam-readiness QA and weak-question trim

- Reduced the active written-exam pool from 301 to 284 prompts without deleting study cards.
- Preserved all learning-objective coverage and objective-command coverage.
- Added paper-level quality scoring for generated written exams.

## v1.63.0 — Written exam marking and section polish

- Structured written exams into Core knowledge, Written reasoning and Data/calculations sections.
- Added post-submit student answer review, credit checklists, self-mark buttons and Revisit support.
- Preserved source-style question wording.

## v1.62.0 — Written exam pruning without coverage loss

- Retired weaker derived prompts from written-exam selection while keeping them in study/revision mode.
- Reduced the active written-exam pool from 399 to 301 prompts.

## v1.61.0 — Written prompt command flags and answer-format support

- Added hidden command-format metadata and per-question answer-format support for derived written prompts.
- Kept command labels hidden from the question card.

## v1.60.0 — Restore source-style written question wording

- Restored the reviewed written prompts to original/source-recorded question wording.
- Kept hidden metadata for test balancing and answer-format support.

## v1.58.0 — Unit overview visual cleanup

- Upgraded unit overview pages with lead images and visual revision tiles.
- Replaced implementation/status language with student-facing revision guidance.

## v1.55.0 to v1.57.0 — Written bank expansion and overview restoration

- Expanded written exam mode by deriving eligible prompts from existing open-answer cards.
- Restored the 32 curated visual written prompts.
- Restored unit overview navigation after a regression.

## v1.52.0 to v1.53.0 — Reaction image integrations R5/R6

- Integrated high-value class-note and question-safe visuals for graphs, forces, electromagnets, extraction, plant transport and chemistry reactions.

## v1.43.0 to v1.48.0 — Image asset audit and integration phase

- Converted accepted image batches into `assets/webp/`.
- Replaced weak class-note visuals and wired conservative question-safe media into active cards.
- Preserved source-style SVGs where exact labels or answer-key structure were required.

## v1.39.0 to v1.42.0 — Written exam and SVG note expansion

- Added written exam mode and SVG/diagram-first class-note visuals.
- Deferred non-source-pack bridge topics from active study/test use.

## v1.0.0 to v1.38.0 — Initial app, content bank and first cleanup

- Established the static GitHub Pages app, Year 9 content bank, diagrams, brand graphics, core study/test flows and early release-readiness tooling.
