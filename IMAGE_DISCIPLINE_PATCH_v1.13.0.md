# Image Discipline Patch v1.13.0

## Purpose

Reduce friction in the question experience by showing images only when they are needed to answer the question.

## What changed

- Removed non-essential conceptual/photographic media from question cards.
- Kept source-style diagrams, labelled options and graph/chart visuals in the question flow.
- Moved useful conceptual images into Class Notes.
- Added `mediaTiming: "question"` to required question visuals.
- Added `mediaPolicy` metadata to cards.
- Updated class-note rendering to support dedicated note visuals.

## Counts

- Question media kept: 12
- Question media removed/moved: 91
- Class notes with dedicated visuals: 24

## Rule going forward

Images belong in the question flow only when the learner must use that image to answer. Otherwise, images belong in Class Notes.
