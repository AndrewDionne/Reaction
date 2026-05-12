# Image Archive Audit and Integration — v1.46.0

## Scope

Audited the uploaded `images for reaction.zip` archive against the current Reaction repo and the active Year 9 study direction.

The archive contained **64 PNG images**, arranged as **32 note/blank pairs**. Each accepted image was converted to **1600 × 1000 WEBP** and added to `assets/webp/`.

## Integration result

- Converted assets added: **64**
- Class-note visuals updated or added: **22**
- Question-card media/actions updated: **22**
- Missing media references after patch: **0**
- Remaining SVG media references: **21**

## Purpose QA

The archive broadly fits the target visual strategy:

- **notes images**: useful for class notes and review screens because they contain explanatory labels.
- **blank images**: useful for question cards only where the visual labels match the card's answer key.
- **technical question diagrams**: still require exact labels, so some old SVGs were deliberately retained.

## Important answer-key retargeting

### Circuit-symbol grid

The new blank grid uses:

- A = cell
- B = battery
- C = open switch
- D = closed switch
- E = lamp / bulb
- F = resistor
- G = ammeter
- H = voltmeter

The existing motor-symbol question was retargeted to a battery-symbol question because the new grid does not include a motor symbol.

### Meter-placement diagram

The new blank diagram uses X/Y/Z candidate positions.

- Ammeter position answer updated to **X**
- Voltmeter position answer updated to **Y**

## Deliberately retained SVG question diagrams

Some SVGs remain because the new images did not safely preserve the original question labels or answer-key semantics. These include:

- food web with wrens/insecticide
- lattice option question
- existing distance-time labelled sections
- rock-lever options
- displacement test
- mass gain / mass loss calculation diagrams
- rusting and sacrificial-protection source-style questions
- magnet/static/electromagnet/motor labelled question diagrams

## Source/scope note

The uploaded KS3 workbook supports these topics as valid KS3 science visual targets, including variation, particle model, acids/alkalis, reactions, forces, circuits, magnetism and electromagnetism. The app integration remained conservative and focused on active Reaction content first.

## Files changed

- `data/year9-notes.js`
- `data/year9-content.js`
- `docs/CHANGELOG.md`
- `docs/ASSET_MANIFEST_CURRENT.csv`
- `assets/webp/*.webp`

## QA outputs

- `docs/IMAGE_ARCHIVE_AUDIT_MATRIX_v1_46_0.csv`
- `docs/IMAGE_ARCHIVE_CONVERTED_ASSETS_v1_46_0.csv`
- `docs/IMAGE_ARCHIVE_NOTE_UPDATES_v1_46_0.csv`
- `docs/IMAGE_ARCHIVE_QUESTION_UPDATES_v1_46_0.csv`
- `docs/IMAGE_ARCHIVE_REMAINING_SVG_REFERENCES_v1_46_0.csv`

## Validation

Passed:

```bash
python tools/validate_content.py
node --check app.js
```

Additional media QA passed:

- no missing media references in `year9-notes.js`
- no missing media references in `year9-content.js`
