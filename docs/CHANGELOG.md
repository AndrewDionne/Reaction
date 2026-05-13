## v1.63.0 — Written exam marking and section polish

- Preserved the 301-question written exam pool and made no student-facing question text changes.
- Structured generated written exams into neutral student-facing sections: core knowledge, written reasoning and data/calculations.
- Improved hidden command-specific answer-format guidance and answer-structure checks without changing question wording.
- Improved derived-card mark schemes with clearer credit checklists tied to the model answer.
- Added post-submit student answer review and a low-mark route to add linked study cards to Revisit.

## v1.62.0 — Written exam pruning without coverage loss

- Retired 98 weaker derived prompts from written-exam selection without deleting study cards.
- Preserved exact/source-style question wording and retained all learning-objective coverage.
- Reduced the active written-exam pool from 399 to 301 prompts.
- Kept 15, 30 and 45 mark balanced papers possible across Biology, Chemistry and Physics.

## v1.61.0 — Written prompt command flags and answer-format support

- Systematically reviewed all 367 derived written prompts.
- Preserved exact/source-recorded student-facing question wording.
- Added hidden command-format metadata for every eligible derived written prompt.
- Added per-question answer-format support used by the Answer format button.
- Kept the written exam question cards free of visible command-word labels.

## v1.58.0 - Unit overview visual cleanup
## v1.60.0 — Restore source-style written question wording

- Restored the 54 written-review prompts to their original/source-recorded question wording.
- Kept hidden exam classification metadata for answer-format help and balanced written-paper selection.
- Removed the visible command-word pill from written exam cards so students read the question wording first.
- Restored the broad 9F extraction/rusting source prompt to exam eligibility and retired the two v1.56 split prompts from exam selection.
- Written exam mode now uses 399 eligible prompts: 32 curated visual prompts plus 367 derived open-answer prompts.

- Upgraded the restored unit overview pages into visual revision hubs with one lead image and supporting visual tiles per unit.
- Reused the strongest current `assets/webp/` visuals instead of generating new images.
- Replaced patch-history status wording with student-facing revision guidance.
- Marked 9E material families and 9F metal reaction products as covered now that suitable visuals exist.
- Removed empty infographic-backlog sections and fixed the stale overview header title.
- Preserved the v1.56 written-exam derived bank and its 400 eligible written prompts.

## v1.57.0 - Unit overview route restoration

- Restored the unit overview button event binding that was present in the v1.50.0 overview patch but dropped during later written-exam/app merges.
- Preserved the current v1.54+ unit overview data, r153 image/status updates and v1.56 written-exam derived-bank work.
- Verified all six overview entries are still available for 9A, 9B, 9E, 9F, 9I and 9J.
- Added a restoration audit documenting the regression and the minimal repair.

## v1.56.0 - Written-review source-style polish

- Polished the 54 `written-review` prompts from v1.55.0 into cleaner source-style written exam wording.
- Promoted 53 reviewed prompts from `written-review` to `written-main` while preserving source answers, references and media.
- Split one broad 9F extraction/rusting progress-check prompt into two focused written exam prompts and retained the original as a study card only.
- Adjusted marks on multi-part identify/state/describe items where the expected answer has more than two separate points.
- Removed the `written-review` pool from active exam selection; the written mode now has 400 eligible prompts including the 32 curated visual prompts and 368 derived open-answer prompts.

## v1.55.0 - Written exam derived-bank expansion

- Added exam metadata to 367 existing open-answer cards so written exam mode can draw from the broader source-aligned card bank.
- Combined the restored 32 visual-training questions with the derived open-answer pool for 399 eligible written exam prompts.
- Replaced the previous combo search with a bounded exact-mark selector so 15, 30 and 45 mark exams remain balanced by Biology, Chemistry and Physics without browser freeze risk.
- Preserved hidden mark schemes, Answer format hints, difficulty bubbles and randomized test generation.
- Added a derived-bank inventory CSV and implementation audit for source/coverage QA.

## v1.54.0 - Written exam visual training restoration

- Restored the r152 written exam visual-training mode on top of the r153 image repo.
- Expanded the written exam bank from 18 fixed questions to 32 media-backed written prompts.
- Replaced deterministic written exam blueprints with randomized balanced exact-mark selection by domain.
- Added student-controlled Answer format hints and 1-5 difficulty bubbles.
- Preserved hidden mark schemes until answer submission and retained all r153 image/content updates.

## v1.53.0 - Reaction images r6 integration

- Integrated 12 useful r6 images as WebP app assets.
- Added class-note and question-safe visuals for gas pressure, reactive metal products, plant transport, DNA hierarchy, current-voltage graphs and force fields.
- Added 6 new image-driven question cards.
- Added r6 media support to selected existing cards and written exam prompts.
- Updated unit overview visual coverage statuses and reduced the remaining infographic backlog to optional polish.


## v1.52.0 - Reaction images r5 integration

- Integrated 21 useful r5 image assets as WebP files.
- Added class-note and question-safe visuals for photosynthesis limiting factors, speed-time graphs, wire resistance, extraction methods, natural selection, recycling, displacement, terminal velocity, static electricity, electromagnets and motor effect.
- Added 11 new image-driven cards and media support for selected existing cards.
- Updated unit overview visual coverage statuses and reduced the infographic backlog to a small final set.
- Skipped only superseded or technically weaker duplicate images.

# Changelog — consolidated

## v1.48.0 — Full QA pass for image batches 1 and 2
- Ran a combined QA pass across the v1.46 and v1.47 image integrations.
- Fixed mis-mapped image assets where several v1.46 filenames did not match the visual content, especially in magnetism/static electricity/motor effect and moments/electromagnet images.
- Added corrected semantic aliases for the mis-mapped images and rewired class-note media to the correct visuals.
- Added 51 additional conservative question-safe media references using blank images from the last two image batches.
- Increased active cards with media from 153 to 203.
- Preserved remaining SVG source-style diagrams where exact labels, arrows, or answer-key structure are still required.

## v1.47.0 — R2 image audit and integration
- Audited the uploaded `Images for reaction R2.zip` archive for class-note and question use.
- Accepted 26 of 33 source images and converted them to 1600 × 1000 WEBP assets.
- Integrated cleaner class-note visuals for bioaccumulation, quadrats, seed dispersal, formulae, elements/compounds/mixtures, particle changes of state, gas pressure, Brownian motion, diffusion, pH/acid/alkali, neutralisation, chromatography/distillation, metal extraction, and balancing equations.
- Added 17 conservative question-safe media references using blank images only where they supported the prompt without revealing the answer.
- Skipped duplicate or over-dense alternates, including the second bioaccumulation human-body variant and duplicate balancing/changing-state variants.

## v1.46.0 — New image archive audit and integration
- Audited the uploaded `images for reaction.zip` archive for class-note and question use.
- Converted 64 accepted PNG images to 1600 × 1000 WEBP assets.
- Replaced the remaining SVG-based class-note visuals for DNA/gene hierarchy and polymers/composites, and upgraded multiple active class-note visuals.
- Wired selected question-safe blank images into active question cards where labels and answer keys could be preserved or safely retargeted.
- Retargeted the circuit-symbol grid questions to the new A–H grid: cell, battery, open switch, closed switch, lamp, resistor, ammeter and voltmeter.
- Retargeted the meter-placement questions to the new X/Y/Z candidate-position diagram.
- Left remaining source-style SVG question diagrams in place where the new images did not preserve the exact labels or would risk answer-key drift.

## v1.45.0 — Question-safe image asset integration
- Integrated blank/question-safe WEBP assets into selected question cards where the image supports interpretation or written-answer reasoning.
- Preserved annotated images for class notes only.
- Retained source-style SVGs where cards depend on specific labels or where a blank replacement would leak the answer.

## v1.44.0 — Focused image QA pass
- Verified accepted image integration from the current repo snapshot.
- Confirmed no missing media references in notes or card content.
- Added focused image QA documentation and media-reference reports.
- Kept question-card media rewiring out of scope to avoid answer-leakage changes without a dedicated pass.

## v1.43.0 — Accepted image asset integration
- Converted accepted archive PNG assets to 1600 × 1000 WEBP files under `assets/webp/`.
- Replaced weak class-note concept SVGs with high-quality image-first class-note visuals.
- Preserved blank/question-safe counterparts for future question-card integration.
- Added archive source register, review matrix copy, superseded visual register, and integration notes.

## v1.42.0 — SVG note-graphics expansion
- Added a new round of clean SVG study visuals using the existing Phase 1/2 diagram approach: diagram-first SVG assets plus app-rendered teaching text.
- Covered high-value notes for variation, seed lifecycle, farming trade-offs, recycling, peer review, pressure, heating/cooling, periodic table, greenhouse effect, chemical energy, combustion/rate, speed-time graphs, meter placement, wire resistance investigations, and significant figures.
- Integrated the new SVGs into class notes only, avoiding unnecessary question-card answer leakage.

## v1.41.0 — Deferred non-study-pack CGP bridge topics
- Removed waves, breathing / gas exchange, and anaerobic respiration from the active study/test pool because they are not clearly included in the uploaded Year 9 revision study pack.
- Preserved the deferred cards and notes in docs for later restoration if confirmed as examinable.
- Kept pressure, heating/cooling, periodic table, climate and chemical energy bridge coverage active.

## v1.37.0 — Release-readiness QA
- Removed unnecessary Revisit micro-note.
- Added answer shuffling and resume-position support.
- Added release-readiness audit tooling.
- Confirmed no missing referenced media.

## v1.36.0 — Question quality balance
- Improved distractors and reduced answer leakage.
- Rebalanced source-close cards.
- Added high-value application/challenge questions.

## v1.35.0 — Revision-pack polish
- Added thermite, neutralisation, thermal decomposition nuance and significant figures / rounding coverage.
- Added final targeted cards for 9A, 9F and 9J.

## v1.34.0 — Revision-pack question alignment
- Added source-traceable cards for newly covered revision-pack topics.
- Filled major test-bank holes across 9B, 9E, 9F, 9I and 9J.

## v1.33.0 — Class notes revision alignment
- Added new class notes for farming/yield, recycling, atomic structure, combustion/rates, speed-time graphs and wire resistance.

## v1.27.0 to v1.32.0 — SVG / image discipline
- Adopted the SVG Phase 1/2 approach: clean diagram base layers plus app-rendered text.
- Replaced weak illustrative SVGs with WEBP assets where suitable.
- Fixed circuit-symbol consistency, including full X lamp symbols.

## v1.9.0 to v1.26.0 — Learning flow and notes expansion
- Added class notes, guided learning modes, source-style visual questions, common-mistake formatting and app UX refinements.

## v1.0.0 to v1.8.0 — Initial Year 9 static app
- Established static GitHub Pages app, Year 9 content bank, diagrams, brand graphics and core study/test flows.
