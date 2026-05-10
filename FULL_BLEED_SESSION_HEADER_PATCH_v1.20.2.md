# Full-Bleed Session Header Patch v1.20.2

This patch updates the active revision/test session screen so the title header uses the wide unit artwork as a full-bleed background.

## Changes

- Adds six wide unit hero images under `assets/brand/`.
- Uses the active unit hero image as the session header background.
- Removes the previous small floating image strip treatment.
- Keeps Reaction branding and unit/mode subtitle directly on the image backdrop with a readability overlay.
- Prevents the unit/mode subtitle from being cut off.
- Keeps the question card clean and separate below the header.
- Keeps the progress badge in the header.

## Files changed

- `app.js`
- `styles.css`
- `index.html`
- `assets/brand/unit-*-hero.webp`
