# Reaction images r6 integration v1.53.0

## Scope

This patch integrates the uploaded `reaction images r6` batch into the Year 9 science revision app. It closes the remaining high-priority infographic backlog from the previous audit.

## Accepted image groups

- **9F gas pressure and particle collisions** — class-note and question-safe versions.
- **9F reactive metal product map** — class-note and question-safe versions.
- **9A DNA / gene / chromosome hierarchy** — class-note and question-safe versions.
- **9B whole-plant transport overview** — class-note and question-safe versions.
- **9J current-voltage graph comparison** — class-note and question-safe versions.
- **9J force-field comparison** — class-note and question-safe versions.

## Skipped images

Three images were skipped because they were duplicated or superseded:

- Earlier reactive-metal products notes version.
- Earlier reactive-metal products question version.
- Alternate DNA hierarchy question version.

## App integration

- Added **12 WebP assets** under `assets/webp/`.
- Added **6 new image-driven question cards**.
- Added r6 media support to selected existing cards.
- Added new class-note media to the relevant note pages.
- Added r6 visuals to written exam mode where useful.
- Updated unit overview visual-coverage statuses and remaining backlog.

## Coverage effect

The original required infographic backlog is now effectively covered. Remaining items are optional polish or extra variants rather than core coverage gaps.

## Content counts

- App content version: `1.53.0`
- Notes version: `1.53.0`
- Cards: **673**
- Notes: **38**
- Unit overviews: **6**

## QA

- `python tools/validate_content.py` passes.
- `node --check app.js` passes.
- Media-reference check found **0 missing media files**.
- MCQ answer-key check found **0 invalid keys**.
- All card learning-objective references resolve to visible learning objectives.
