## v1.73.0 — Simplified learning modes

- Consolidated the home learning routes into three primary cards: **Revision journey**, **Test your knowledge**, and **Exam mode**.
- Removed the standalone home-page entries for Revisit test, End of unit test, Written exam mode naming, Written test builder, quick/standard/full written-test buttons, normal-paper shortcut, and year-end essentials shortcut.
- Reworked **Test your knowledge** to use the selected unit/sub-unit question bank directly, keep answers hidden during the test, and unlock score/review content only after submission.
- Moved the end-of-unit workflow into the Test your knowledge selection model: selecting a single full unit now acts as the end-of-unit style filter without a separate top-level card.
- Reworked **Exam mode** as the route to the normal 80-mark source-style written paper, with digital answer boxes first and Print / Save PDF retained as a secondary control.
- Updated `exam-paper.html` so answer guidance is locked until submission, then appears under each written answer with expected answer, explanation, common mistakes and class-note links.
- Kept the global header consistent and moved exam-specific controls into the page body.
- Fixed stale `cardsForMode(...)` references so app actions consistently use the canonical `questions` data source.

## v1.72.6 — Fix unit card render crash

- Fixed a startup crash in `initFilters()` where `cards` was referenced after the app data variable had been renamed to `questions`.
- This crash prevented the rest of `init()` from running, so the Study Units cards and their buttons did not render and existing buttons appeared non-functional.
- Bumped `index.html` cache strings to `1.72.6`.

## v1.72.3 — Refreshed five overview explainer images

- Replaced the five overview explainer images below with updated source images from `reaction image coverage.zip` and converted them to `webp` in `assets/webp/`:
  - `9A-conservation-methods-overview.webp`
  - `9E-peer-review-overview.webp`
  - `9F-extraction-decision-overview.webp`
  - `9F-metal-reaction-products-overview.webp`
  - `9J-wire-resistance-overview.webp`
- Kept the same filenames and asset paths so no content or note references needed to change.
- Preserved text-forward layout and readable type for overview expansion panels.

## v1.72.2 — Year-end essentials promoted to class notes

- Added full class notes for repeated source-exam essentials: cells/microscopy, digestion/enzymes/food tests, acids/alkalis, states/particles/density, waves/light/sound, energy resources, and working scientifically.
- Updated revision answer-key learn-more links so source-exam topics now open app class notes via `index.html#note=...`.
- Added **Open class notes** links to `year-end-essentials.html` topic blocks.
- Added `tools/validate_learn_more_links.py` to check that exam-bank learn-more note links resolve to existing class notes.

## v1.72.1 — Revision answer key enhancement

- Added answer-key mode selector to `exam-paper.html` with **Mark scheme** and **Revision answer key** modes.
- Added expanded revision explanations, learn-more links and common-mistake guidance to exam-paper subquestions.
- Added the same revision-support fields to `data/year9-source-style-question-bank.js`.
- Added class-note deep-link support in `app.js` for links such as `index.html#note=9J-circuits`.
- Added anchors to `year-end-essentials.html` so source-exam gap topics can be linked from the revision answer key.
- Updated validators to require answer explanations and learn-more/practice references.

## v1.72.0 — Year-end essentials expansion and 80-mark paper focus

- Retired the active 110-mark challenge paper format from the exam builder.
- Removed the **Challenge 110-mark** mode from `exam-paper.html`.
- Kept the exam builder focused on normal 80-mark papers, source examples and section-only practice.
- Added `YEAREND-NORMAL-80-C`, a third 80-mark source-style generated paper.
- Expanded `year-end-essentials.html` into a detailed source-style study checklist with must-know content and exam wording patterns.
- Added `data/year9-source-style-question-bank.js` as a reusable source-style subquestion bank for future randomised papers.
- Added `tools/validate_source_style_question_bank.py`.

## v1.71.4 — Normal 80-mark paper mode and year-end essentials

- Added two source-style 80-mark normal practice papers to `data/year9-exam-paper-bank.js`.
- Added a paper mode selector in `exam-paper.html`: Normal 80-mark, Challenge 110-mark, Source examples, and All papers.
- Kept the existing 110-mark papers as challenge papers.
- Added `year-end-essentials.html` as a study checklist based on the two uploaded source-style exams.
- Updated the written-builder links on the home page to point students toward the normal 80-mark paper and year-end essentials.
- Extended the exam-paper validator to accept source-style command words such as `name`, `complete`, `interpret`, and `suggest`.

## v1.71.3 — Program test alignment audit

- Generated program paper samples from the current exam-paper bank for Paper B and Paper C.
- Compared generated papers against the two uploaded source exams.
- Added an alignment matrix covering topic family, source-exam overlap, and command-word wording.
- Added a coverage-gap audit showing source-exam topics that need stronger study content in the app.
- Recommended a shorter 80–90 mark normal paper mode and keeping the 110-mark paper as a challenge paper.

## v1.71.2 — Source exam 2 logging and overlap audit

- Added the second user-provided practice examination as `YEAREND-PAPER-D-SOURCE2` in `data/year9-exam-paper-bank.js`.
- Preserved the source paper as a selectable Paper D / normal-version paper.
- Documented that the second paper cover states 80 marks, while visible question-block marks sum to 88.
- Added `docs/EXAM_SOURCE_COMPARISON_v1_71_2.md` and `.csv` to compare the two source papers and identify repeated topic/question trends.

## v1.71.1 — Exam paper variants and section practice

- Added Paper A, Paper B and Paper C to `data/year9-exam-paper-bank.js`.
- Added a paper selector and random paper button to `exam-paper.html`.
- Added section-only filtering for Biology, Chemistry, Physics and Working scientifically.
- Updated total marks and answer key rendering so they follow the selected paper/section.

## v1.71.0 — Year-end exam paper format

- Added `exam-paper.html`, a print/PDF-friendly year-end written paper view.
- Added `data/year9-exam-paper-bank.js` with a structured section/question/part/answer-key data model based on the uploaded year-end exam example.
- Added Biology, Chemistry, Physics and Working scientifically sections with topic-level question blocks.
- Added lined answer spaces, graph grid rendering and a separate answer key.
- Added a `Year-end paper · 110 marks` entry point in the written builder panel.

## v1.70.3 — Generated and integrated overview explainer images

- Generated and added five new full-width overview explainer images in `assets/webp/`.
- Replaced the targeted overview image references for biodiversity conservation, peer review, metal extraction, metal reaction products, and wire resistance.
- Updated `data/year9-notes.js` to wire the new images into the relevant overview checklist items.
- Bumped cache-busting query strings in `index.html` to `1.70.3`.

## v1.70.2 — Vocabulary definitions, secure label, and image prompt audit

- Replaced visible **Mastered** wording with **Secure** across the student UI and guided note prompts.
- Kept question IDs visible as small badge-style labels on question cards and written questions.
- Upgraded targeted unit overview vocabulary lists so each term now shows a direct definition when opened.
- Updated the overview review export so vocabulary definitions appear in the audit view.
- Tightened the question-ID badge styling so it stays compact.
- Added `docs/OVERVIEW_IMAGE_PROMPTS_v1_70_2.md` and `docs/OVERVIEW_IMAGE_NEEDS_v1_70_2.csv` for the remaining overview-image gaps.
- Extended `tools/validate_unit_overviews.py` so vocabulary entries must include definitions.

## v1.70.1 — Overview QA and student-language cleanup

- Audited the targeted unit overview mode for student-facing wording.
- Removed leftover developer/reviewer wording from visible overview and review-export text.
- Fixed an extra closing section tag in the targeted overview render.
- Changed visible “card” wording to “question” where it appears in student-facing instructions.
- Removed unused legacy overview status/backlog render helpers.
- Kept the targeted overview structure and coverage mapping from v1.70.0.

## v1.70.0 - Targeted unit overview checklist

- Replaced the unit overview mode with a targeted learning checklist structure.
- Added expandable sections for sub-units, must-know vocabulary, must understand, must identify and must memorise equations/calculations.
- Added full-width graphics inside expanded checklist rows only.
- Added class-note jump links from overview rows and a Back to unit overview action from linked class notes.
- Added practice QC ID buttons inside overview rows.
- Added `tools/validate_unit_overviews.py` and coverage-audit documentation.


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
