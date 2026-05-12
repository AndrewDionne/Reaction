# Image asset integration v1.43.0

## Purpose

Integrates accepted high-quality image assets from the uploaded archive into the Reaction Year 9 science repo.

The patch follows the current visual direction:

- Use high-quality WEBP images for rich class-note concept visuals.
- Keep blank/question-safe counterparts in the repo for future test/practice use.
- Stop relying on weak SVG concept drawings where a polished image communicates the science more clearly.
- Keep SVGs/charts where precision and answer-safe technical diagrams are still better.

## Summary

- Accepted archive images converted to WEBP: **40**
- Standardised output size: **1600 × 1000 px**
- Skipped: first dense pressure image, duplicate images, and the overloaded collision-theory notes image.
- Integrated class-note replacements for greenhouse effect, pressure in fluids, heating/cooling, exothermic/endothermic, combustion, farming/yield, recycling, wire resistance, meter placement, periodic table, seed lifecycle, graphs, circuit symbols, Sankey diagrams, and thermal conductors/insulators.

## Important integration choice

The patch uses the notes images directly in Class Notes. Blank images were copied into `assets/webp/` but were not broadly wired into question cards yet. That avoids changing existing question semantics or answer keys without a targeted QA pass.

## New docs

- `docs/ARCHIVE_IMAGE_SOURCE_REGISTER_v1_43_0.csv`
- `docs/IMAGE_ASSET_ARCHIVE_REVIEW_MATRIX_v1_43_0.csv`
- `docs/SUPERSEDED_CLASS_NOTE_VISUALS_v1_43_0.csv`
- `docs/IMAGE_ASSET_INTEGRATION_v1_43_0.md`

## Files changed

- `data/year9-notes.js`
- `docs/CHANGELOG.md`
- `docs/ASSET_MANIFEST_CURRENT.csv`
- Added accepted WEBP image assets under `assets/webp/`

## Deferred / not integrated

- The first pressure image was not integrated because it is too dense and formula-heavy.
- Exact duplicate files were not integrated.
- The collision-theory notes image was not integrated because the text density is too high for mobile. The blank collision-theory visual was integrated and wired into the class note with app-side captions.

## Recommended next QA

1. Mobile check the class-note pages with the new large concept images.
2. Decide which blank images should replace existing question-card SVGs.
3. Remove superseded SVG files in a later cleanup-only patch once confirmed unused.
