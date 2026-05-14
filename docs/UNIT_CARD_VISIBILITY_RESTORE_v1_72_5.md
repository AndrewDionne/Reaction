# Unit card visibility restore v1.72.5

## Problem

The unit selection cards were still below the mode selector and the always-visible written-test builder, so they were easy to miss on the hub screen. The user expected the class-notes and overview entry points to be visible as part of the unit-selection experience.

## Fix

- The unit cards now sit inside a dedicated **Study units** section.
- The written-test builder is hidden unless **Written exam mode** is selected.
- Each unit card has prominent top-level buttons:
  - **Unit overview**
  - **Class notes**
- The class-notes button opens a unit-level index listing note pages for that unit.

## Files changed

- `index.html`
- `app.js`
- `styles.css`
- `docs/CHANGELOG.md`
