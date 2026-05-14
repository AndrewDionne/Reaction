# Targeted unit overview rewrite v1.70.0

## Purpose

The unit overview mode has been converted from a visual catalogue into a student learning checklist.

Each unit now shows:

1. Unit title and a short description.
2. Sub-unit descriptions.
3. Must know vocabulary, grouped by topic and expandable.
4. Must understand, covering the main explain/describe knowledge.
5. Must be able to identify, covering state/identify/label/recognise skills.
6. Must memorise equations / calculations.

## Interaction model

Checklist rows are expandable. When a student opens a row, they see:

- short class-note bullets
- a full-width graphic when useful
- a button to open the related full class note
- practice question ID buttons where relevant

Opening a class note from an overview now provides a **Back to unit overview** button.

Practice question buttons use the short QC IDs added in v1.69.6, for example:

- `9A-MCQ-01`
- `9A-WE-01`
- `9J-CALC-03`

## Data changes

Updated:

- `data/year9-notes.js`

Each unit overview now includes a `targetedOverview` object with:

- `title`
- `description`
- `subUnits`
- `vocabulary`
- `understand`
- `identify`
- `memorize`

Existing older overview fields were preserved so the data remains backward compatible.

## UI changes

Updated:

- `app.js`
- `styles.css`
- `content-review.html`

The overview renderer now prefers `targetedOverview` when present and falls back to the older overview layout only if the new structure is missing.

## Source basis

Starting content came from:

- `docs/reaction overview content.md`
- the attached `Unit Overview Rewrite.pages`

Coverage was checked against the canonical `Year 9 science 3.zip`, especially summary sheets, word sheets, quick quizzes and assess-yourself files.

## Validation

Added:

- `tools/validate_unit_overviews.py`

This checks that:

- all six units have targeted overviews
- required sections are present
- class-note links point to existing notes
- practice QC IDs point to existing cards
- media references exist
