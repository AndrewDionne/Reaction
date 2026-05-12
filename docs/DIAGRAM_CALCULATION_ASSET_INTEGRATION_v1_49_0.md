# Diagram and calculation asset integration v1.49.0

## Scope

This patch integrates the uploaded diagram/calculation image set where it directly improves exam-style practice without putting the full question wording inside the graphic.

## Accepted integration

- Added **15 WebP assets** under `assets/webp/`.
- Added **7 new diagram-based cards**:
  - density by water displacement
  - regular-solid density calculation
  - pressure on a solid block
  - pressure/contact-area shoe comparison
  - balanced moment missing-distance calculation
  - distance-time graph stopped-section reading
  - current-voltage graph resistance comparison
- Updated **class notes** for:
  - pressure, density and floating
  - moments
  - speed/distance-time graph reading
  - circuit symbols and meter placement
  - formula rearrangement / calculation support
- Updated written exam mode to render media attached to written questions.
- Added media to written physics prompts for meter placement, speed-time graph reading, and balanced-moment calculation.
- Fixed the five visual MCQ answer-key bugs where stored answers used diagram labels (`F`, `G`, `H`, `X`, `Y`) instead of answer-option keys (`A`–`D`).
- Exposed the previously hidden note-linked sub-units in `learningObjectives`, including `9I-pressure`.

## Selection rule used

Question assets were accepted only when the image mostly contains data, labels, units, diagrams, graph axes, or neutral callouts. Assets that embedded full worksheet questions were not used as live question images because the app should own the question wording outside the image.

## QA

- `python tools/validate_content.py` passes.
- `node --check app.js` passes.
- Custom media-reference check found **0 missing media files**.
- Custom MCQ answer-key check found **0 invalid MCQ answer keys**.

## Files

- Accepted asset register: `DIAGRAM_CALCULATION_ASSET_INTEGRATION_ACCEPTED_v1_49_0.csv`
- Skipped asset register: `DIAGRAM_CALCULATION_ASSET_INTEGRATION_SKIPPED_v1_49_0.csv`
- Contact sheet: `DIAGRAM_CALCULATION_ASSET_INTEGRATION_CONTACT_SHEET_v1_49_0.jpg`
