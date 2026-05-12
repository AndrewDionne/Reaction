# R2 Image Audit and Integration — v1.47.0

## Source reviewed

- Uploaded archive: `Images for reaction R2.zip`
- Source images reviewed: 33
- Accepted and integrated: 26
- Skipped: 7

## Integration summary

This patch integrates the useful R2 images into the current Reaction repo line. The accepted images were converted to WEBP at **1600 × 1000** and added under `assets/webp/`.

The integration follows the current product rule:

- **Class notes** use annotated / notes images.
- **Questions** use blank or question-safe images only.
- Images were not used where labels or notes would reveal the answer.
- Duplicate, dense, or visually weaker alternates were skipped.

## Class-note media added

The patch adds useful class-note media for:

- bioaccumulation in food chains
- quadrat ecosystem sampling
- seed dispersal mechanisms
- chemical formulae and atom counting
- elements, compounds and mixtures
- particle model changes of state
- gas pressure and Brownian motion
- diffusion in liquids and gases
- acids, alkalis and pH
- neutralisation reactions
- chromatography and distillation
- metal extraction methods
- balancing chemical equations

## Question-safe media added

Question-safe blank images were added to selected cards for:

- bioaccumulation / biomagnification
- quadrat sampling
- chemical formulae / H₂
- gas pressure
- neutralisation
- metal extraction methods
- physical changes / changes of state
- thermal decomposition references

Total selected question-card updates: **17**.

## Important skip decisions

The following were deliberately not integrated:

- alternate balancing equation scaffold with less suitable question/class-note separation
- alternate gas-pressure and Brownian-motion versions superseded by clearer accepted versions
- overly dense changes-of-state variant
- duplicate balancing-equation variant
- human-body bioaccumulation alternate, which was more distracting than the cleaner top-predator food-chain image

## QA checks

Passed:

```bash
python tools/validate_content.py
node --check app.js
```

Media reference check:

- no missing media references in `year9-notes.js`
- no missing media references in `year9-content.js`

## Generated audit files

- `R2_IMAGE_AUDIT_ACCEPTED_v1_47_0.csv`
- `R2_IMAGE_AUDIT_SKIPPED_v1_47_0.csv`
- `R2_IMAGE_NOTE_UPDATES_v1_47_0.csv`
- `R2_IMAGE_QUESTION_UPDATES_v1_47_0.csv`
- `R2_IMAGE_AUDIT_CONTACT_SHEET_ALL_v1_47_0.jpg`
- `R2_IMAGE_AUDIT_CONTACT_SHEET_ACCEPTED_v1_47_0.jpg`

