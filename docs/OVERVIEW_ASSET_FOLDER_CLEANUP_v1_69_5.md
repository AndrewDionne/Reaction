# Overview asset folder cleanup v1.69.5

## Reason

The previous overview visual patch introduced `assets/overview/`. That was unnecessary because the project already uses `assets/webp/` as the canonical folder for raster study images.

## What changed

- Converted/copied the overview images into `assets/webp/` as WebP files.
- Updated all live references in `data/year9-notes.js` from `assets/overview/...` to `assets/webp/...`.
- Removed live use of `assets/overview/`.
- Kept the overview image rendering rule: explainer images are full width on unit overview pages.

## New WebP overview files

- `assets/webp/9A-dna-hierarchy-overview.webp`
- `assets/webp/9B-limiting-factors-overview.webp`
- `assets/webp/9E-structure-of-materials-overview.webp`
- `assets/webp/9J-circuit-symbols-overview.webp`
- `assets/webp/9J-current-voltage-overview.webp`

## Delete after applying

Delete the now-obsolete folder if it exists in your repo:

- `assets/overview/`

There should be no remaining references to `assets/overview/` after this patch.
