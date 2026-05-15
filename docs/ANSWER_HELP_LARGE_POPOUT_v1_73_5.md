# v1.73.5 — Larger written-answer help pop-out

## Purpose

Make the **How to answer written questions** guide feel like a substantial app reference panel instead of a small pop-out.

## Changes

- Increased the written-answer help modal width to `min(1100px, 92vw)`, which is approximately 80–90% of the main app page on desktop.
- Increased modal max-height to keep the guide readable while preserving internal scrolling on smaller screens.
- Increased modal padding and border radius slightly to match the larger panel scale.
- Left the in-question **Question type** hint cards unchanged so test questions remain compact.

## Files changed

- `styles.css`
- `index.html`
- `docs/CHANGELOG.md`
- `docs/ANSWER_HELP_LARGE_POPOUT_v1_73_5.md`
