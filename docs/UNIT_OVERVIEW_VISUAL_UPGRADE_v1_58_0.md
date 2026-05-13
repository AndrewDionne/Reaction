# v1.58.0 unit overview visual cleanup

## Scope

This patch restores the unit overview pages as visual revision hubs rather than text-only coverage/status pages. It intentionally leaves the v1.55/v1.56 written-exam derived-bank logic untouched.

## Implemented changes

- Added one `leadMedia` image to each of the six unit overview pages.
- Added `visualTiles` to each overview using the strongest current assets already in `assets/webp/`.
- Replaced patch-history wording such as `r152 adds...` with student-facing revision guidance.
- Upgraded stale visual statuses:
  - 9E Material families comparison: `partial` → `covered`.
  - 9F Metal reaction products map: `partial` → `covered`.
- Removed the empty `Infographics to develop next` section when there is no backlog.
- Changed the overview session header from the stale `Reaction` title to the active unit title.
- Updated app/content and notes versions to `1.58.0`.

## Overview asset counts

| Unit | Lead image | Visual tiles | Coverage statuses | Backlog items |
|---|---:|---:|---:|---:|
| 9A | 1 | 3 | 4 | 0 |
| 9B | 1 | 3 | 4 | 0 |
| 9E | 1 | 3 | 4 | 0 |
| 9F | 1 | 4 | 5 | 0 |
| 9I | 1 | 4 | 5 | 0 |
| 9J | 1 | 5 | 6 | 0 |


## Written exam regression guard

- Curated visual written bank: **32** prompts.
- Derived exam-eligible cards: **368** prompts.
- Derived pool breakdown: `{'written-main': 280, 'written-recall': 88}`.
- Combined written prompt count remains **400**.
- `written-review` count remains **0**.

## QA

Passed:

- `node --check app.js`
- `python tools/validate_content.py`
- `python tools/release_readiness_audit.py` → **15 pass, 2 warn, 0 fail**
- Static overview media-reference check → **28 / 28 overview media references exist**
- Overview structure check → six overview records, each with one lead image, 3–5 visual tiles, no partial/gap statuses, and no remaining backlog items

## Files added

- `docs/UNIT_OVERVIEW_VISUAL_ASSETS_v1_58_0.csv`
- `docs/UNIT_OVERVIEW_COVERAGE_STATUS_v1_58_0.csv`
- `docs/UNIT_OVERVIEW_VISUAL_UPGRADE_v1_58_0.md`

## Recommended next step

Do a small UI smoke test in the browser: open each unit dashboard, click **📚 Unit overview**, and confirm the lead image, visual tiles and practice button feel good on mobile width. No new science content is required for the next pass unless user testing exposes a specific weak page.
