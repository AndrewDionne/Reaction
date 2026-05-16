# v1.74.0 — Last-minute review sheet builder

## Purpose

Adds a compact last-minute review workflow without creating a fourth learning mode.

The review sheet is built from content the student selects while using class notes, unit overviews, Revision journey, and Test your knowledge.

## User-facing changes

- Added a **Last-minute review** button beside the written-answer help button in the learning-mode panel.
- Added **Add to last-minute review** controls to class notes and unit overviews.
- When active, class-note and overview items show checkboxes so students can select only the useful items.
- Added a small **Last-minute review** button on question cards so questions can be added to the review sheet.
- Added **Last-minute review** buttons to submitted Test your knowledge review cards.
- Review sheet content is organised into:
  - **Formulas**
  - **Vocabulary**
  - **Concepts**
  - **Questions**

## Digital review sheet

The review sheet opens as a pop-out and shows compact grouped sections. Items can be removed individually, and linked class-note items can reopen their notes.

## Print / PDF

The pop-out includes a **Print / Save PDF** action. Print styling compresses the review sheet into a compact two-column layout and hides app navigation and item controls.

## Data handling

- Review-sheet items are stored in the existing exported/imported progress object under `progress.reviewSheet`.
- The feature reuses canonical app content rather than introducing a duplicate content bank.
- Test-mode question additions do not store answer text before the test is submitted, avoiding answer leakage.
