# Focused Image QA Pass — v1.44.0

## Scope

Reviewed the uploaded current repo snapshot: `Reaction copy 10.zip`.

QA focus:

- media references in `data/year9-notes.js` and `data/year9-content.js`
- class-note vs question-safe separation
- accepted image integration quality
- missing media references
- unused accepted image assets
- whether high-quality note images are wired into the intended class notes

## Result

The repo is now clean for this focused image QA pass.

- Notes version: `1.44.0`
- Content version: `1.41.0`
- Class notes: 38
- Cards: 644
- Note media references: 55
- Question/card media references: 57
- Missing media references after patch: 0

## Issues found and fixed

Three note media references pointed to SVG files that were not present in the current repo snapshot:

- `assets/diagrams/9A-variation-classification.svg`
- `assets/diagrams/9E-peer-review-flow.svg`
- `assets/diagrams/9J-significant-figures-flow.svg`

These were removed from `data/year9-notes.js` rather than restored, because the current visual direction is to avoid weak class-note SVGs unless they are truly technical and necessary.

## Key findings

1. The accepted high-quality images are present in `assets/webp/`.
2. High-value class notes are wired to notes/annotated images, including greenhouse effect, pressure in fluids, heating/cooling, exothermic/endothermic, combustion, wire resistance, meter placement, periodic table, seed lifecycle, thermal conductors/insulators, graph notes, circuit symbols and Sankey/efficiency.
3. Question-card media were not broadly rewired, which is correct for this pass because blank/question-safe versions should be integrated only after a dedicated answer-leakage QA pass.
4. Blank images remain in `assets/webp/` as reserve assets for the next question-media pass.

## Files produced

- `FOCUSED_IMAGE_QA_PASS_v1_44_0.md`
- `FOCUSED_IMAGE_QA_MEDIA_REFERENCES_v1_44_0.csv`
- `FOCUSED_IMAGE_QA_UNUSED_ACCEPTED_IMAGES_v1_44_0.csv`
- updated `ASSET_MANIFEST_CURRENT.csv`

## Validation

Run locally from the repo root:

```bash
python tools/validate_content.py
node --check app.js
```

A media-reference scan found no missing media in notes or card content after the patch.
