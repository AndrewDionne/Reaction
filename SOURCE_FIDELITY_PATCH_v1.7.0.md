# Source Fidelity Patch v1.7.0

This patch addresses the content audit findings by improving source fidelity for visual questions, tightening terminology, and improving media performance.

## Visual-source fidelity improvements

Added original source-style SVG redraws for high-impact visual questions:

- 9B photosynthesis plant diagram labelled Q/R/S
- 9I distance-time graph labelled V/W/X/Y/Z
- 9I lever diagram labelled X/Y/Z
- 9I rock lever options A-D
- 9E particle/lattice options A-D
- 9E vulcanisation cross-linking
- 9A prey-feature adaptation options

These are not copied publisher images; they are original redraws built to match the question style more closely.

## Terminology tightening

Updated relevant cards to use more consistent terminology:

- voltage / potential difference
- current as rate of flow of charge
- weight = mass × gravitational field strength
- gravitational field strength rather than loose “gravity” wording where precision matters

## Fidelity metadata

Every card now has a `sourceFidelity` value:

- `exact-source-text`
- `source-style-redraw`
- `text-equivalent`
- `success-criterion-derived`
- `progress-check-derived`
- `calculation-practice-derived`
- `derived`

The UI displays this as a small badge on each card.

## Media performance

PNG study images have been converted to WebP copies under `assets/webp/`, and card references now point to the WebP assets. Existing PNG files can remain in the repo as source assets, but the app will load the smaller WebP versions.
