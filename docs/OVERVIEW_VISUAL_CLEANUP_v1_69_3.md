# Overview visual cleanup v1.69.3

## What changed

- All **unit overview explainer images** are now intended to render **full width** (one per row).
- The student-facing heading **"Visual revision tiles"** was renamed to **"Revision images"**.
- Several overview visuals that traced back to older SVG-style assets were replaced with better raster images.

## Replacement mapping applied

| Unit | Old / weaker overview visual | Replacement now used |
|---|---|---|
| 9A | `assets/webp/9A-dna-inheritance-hierarchy-notes-v153.webp` | `assets/webp/9A-dna-hierarchy-overview.webp` |
| 9B | `assets/webp/9B-photosynthesis-limiting-factors-notes-v152.webp` | `assets/webp/9B-photosynthesis-light-graph-notes.webp` |
| 9E | `assets/webp/9E-polymers-monomers-composites-notes-v2.webp` | `assets/webp/9E-structure-of-materials-overview.webp` |
| 9J | `assets/webp/9J-circuit-symbols-grid-notes-v2.webp` | `assets/webp/9J-circuit-symbols-overview.webp` |
| 9J | `assets/webp/9J-current-voltage-graph-comparison-notes-v153.webp` | `assets/webp/9J-current-voltage-overview.webp` |
| 9J | `assets/webp/9J-electric-fields-direction-notes-r167.webp` | `assets/webp/9J-force-field-comparison-notes-v153.webp` |

## Strong existing WebP replacements from the current asset library

These are already in the repo and are the best current candidates when we need overview-friendly visuals that originated from question-diagram work:

- `assets/webp/9A-continuous-discontinuous-variation-notes-v2.webp`
- `assets/webp/9A-dna-chromosome-gene-hierarchy-notes-v2.webp`
- `assets/webp/9B-photosynthesis-light-graph-notes.webp`
- `assets/webp/9E-recycling-methods-notes.webp`
- `assets/webp/9I-distance-time-graph-notes.webp`
- `assets/webp/9J-force-field-comparison-notes-v153.webp`

## Asset gaps still worth filling

These do **not** yet have an ideal overview-grade replacement in the current asset library:

1. **9A conservation methods explainer**  
   Need a simpler full-width image with 3 large panels only: protected habitat, seed bank, captive breeding/release.

2. **9E peer review process**  
   Need a clean full-width 4-step flow: investigation → paper submitted → peer review → accept / improve / reject.

3. **9F extraction decision map**  
   Current options are still too dense. Need a simpler full-width flow based on position relative to carbon.

4. **9F metal reaction products**  
   Need a cleaner full-width comparison of metal + oxygen / water / acid.

5. **9J wire resistance investigation**  
   Need a simpler overview-friendly investigation image with clearly separated independent variable, dependent variable and controls.

## Suggested storage location for new overview replacements

Add future overview-grade images directly to:

- `assets/webp/`

Do not create a separate overview asset folder. Use file names with `-overview.webp` when an image is intended mainly for the unit overview pages.

Recommended naming pattern:

- `assets/webp/<unit>-<topic>-overview.webp`

Examples:

- `assets/webp/9A-conservation-methods-overview.webp`
- `assets/webp/9E-peer-review-overview.webp`
- `assets/webp/9F-extraction-decision-overview.webp`
- `assets/webp/9J-wire-resistance-overview.webp`
