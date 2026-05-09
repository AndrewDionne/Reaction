# UI Journey Patch v1.6.0

This patch updates the app from a test-heavy dashboard into a focused revision journey.

## Main changes

- Added Reaction brand header and brand hero image.
- Moved Sound, Export and Import into the header/brand area.
- Removed the old sidebar/progress-card layout.
- Added a clear main hub with: Revision journey, Revisit, Study, and Mastery check.
- Renamed the test flow away from “Boss mode”.
- Added card state buckets:
  - Mastered
  - Revisit
  - Study
- Revisit mode now shows cards marked Revisit.
- Study mode now shows cards marked Study.
- Mastery check now tests cards marked Mastered.
- Main screen remains a hub; learning/test sessions open into a focused page.
- Unit cards are more compact and show mastered/revisit/study counts.
- Added backwards-compatible progress migration from the previous storage model.

## Files changed

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `assets/brand/reaction-beaker.png`
- `assets/brand/reaction-brand-hero.png`

## Notes

The educational content remains unchanged at 419 cards. This is a UI and learning-flow patch only.
