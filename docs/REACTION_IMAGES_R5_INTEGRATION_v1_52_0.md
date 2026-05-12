# Reaction images r5 integration v1.52.0

## Scope

This patch reviews and integrates the uploaded `reacation image r5` batch. It keeps the useful class-note and question-safe assets, rejects only superseded/technically weaker duplicates, and updates the app content/notes to use the accepted assets.

## Accepted image groups

- 9B photosynthesis limiting-factor graphs: class-note and question-safe versions.
- 9I speed-time graph: class-note and question-safe versions.
- 9J wire-resistance investigation: corrected class-note version and clean question-safe setup.
- 9F reactivity/extraction decision tree: class-note and question-safe versions.
- 9A natural selection sequence: class-note and question-safe versions.
- 9E recycling methods grid: class-note and question-safe versions.
- 9F displacement reaction sequence: class-note and question-safe versions.
- 9I terminal velocity force-chain: class-note and question-safe versions.
- 9J static charge transfer: class-note and question-safe versions.
- 9J electromagnet / motor effect: question-safe electromagnet and motor images, plus class-note combined image.

## Skipped images

Skipped only three files:

- the earlier wire-resistance class-note image with unclear voltmeter/test-length alignment;
- an earlier wire-resistance question image superseded by a cleaner version;
- an earlier electromagnet/motor-effect class-note version superseded by the cleaner final version.

## App integration

- Added 21 r5 WebP assets.
- Added 11 new image-driven cards.
- Added r5 media support to selected existing cards.
- Added r5 class-note media to the relevant sub-unit pages.
- Updated unit-overview visual coverage statuses and remaining infographic backlog.
- Retained the previous diagram/calculation, r4 image, and unit-overview work in this full patch.

## What we still need

The priority image backlog is now small. Remaining useful graphics are:

1. **9F gas pressure variable panels** — temperature, number of particles and volume, each linked to collision frequency/force.
2. **9F metal reaction products map** — metal + oxygen / water / acid product families.
3. **9A DNA to characteristic hierarchy** — cell → nucleus → chromosome → DNA → gene → characteristic.
4. **9B plant transport overview** — roots/root hairs, xylem to leaves, stomata, phloem sugars.
5. **9J current-voltage graph comparison set** — 2–3 variants for greater resistance/gradient practice.
6. **9J force-field comparison** — gravitational, magnetic and electric fields side-by-side.

The bigger next development step is now app-side: finish the written-exam training patch so the exam builder deliberately uses these diagrams, graphs and calculation images.

## QA

- `python tools/validate_content.py` passes.
- `node --check app.js` passes.
- Media-reference check found **0 missing media files**.
- MCQ answer-key check found **0 invalid keys**.
- All card learning-objective references resolve to visible learning objectives.
