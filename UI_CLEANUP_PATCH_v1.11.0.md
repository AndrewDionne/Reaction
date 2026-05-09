# UI Cleanup Patch v1.11.0

This patch implements the marked-up UI cleanup pass.

## Main changes

- Hero is now a blended Reaction brand block using the new beaker background artwork.
- Removed hero action buttons and large card-count block.
- Converted top route cards into compact status/action cards.
- Removed the separate Study route from the main route cards; deeper study now starts from Class Notes.
- Hid the admin-like filter/control panel from the main UI. Unit cards and objective chips are now the primary navigation.
- Simplified the session header to a focused one-line session title with progress count.
- Removed the large learning-objective panel from card bodies; metadata now appears as compact chips.
- Moved source fidelity to the bottom source line.
- Removed Read aloud from the card action row.
- Added Class Notes as the help route from a card.
- Multiple-choice behaviour is now automatic:
  - correct answer -> Mastered
  - wrong answer -> Revisit
  - reveal answer -> Revisit

## Files changed

- `index.html`
- `app.js`
- `styles.css`
- `assets/brand/*.webp`
