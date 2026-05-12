# Unit overview pages and infographic coverage patch v1.50.0

## What changed

This patch adds a unit-overview layer above the existing sub-unit class notes. Each unit card now has a **Unit overview** button. The overview page gives students the full revision-pack map before they dive into the sub-unit pages.

The overview pages include:

- revision-pack must-know points
- formulae/equations where relevant
- how the sub-unit pages fit together
- diagram, graph and calculation coverage status
- written-answer moves for state / identify / describe / explain questions
- a prioritized infographic backlog

## Why this structure is useful

The existing sub-unit pages are granular enough for card-by-card revision, but students also need a unit-level map. The overview pages prevent the notes from feeling like disconnected fragments and make it easier to see what a full written-answer exam could ask from each unit.

## Implemented overview coverage

| Unit | Sub-unit routes shown | Visual coverage checks | Highest-priority infographic gaps |
|---|---:|---:|---|
| 9A | 4 | 4 | Natural selection answer-chain infographic |
| 9B | 5 | 4 | Photosynthesis limiting-factor graph set, Farming impact trade-off table |
| 9E | 8 | 4 | Recycling methods grid, Peer-review process flowchart |
| 9F | 8 | 4 | Reactivity series to extraction method decision tree, Metal reaction products map |
| 9I | 6 | 4 | Distance-time graph family, Speed-time graph family |
| 9J | 7 | 5 | Circuit symbols and meter-placement master sheet, Wire resistance investigation diagram |

## Recommended infographic development order

1. **9I graph family** — distance-time and speed-time graph class-note/question-safe sets.
2. **9J circuit/wire investigation set** — circuit symbols, meter placement and wire-resistance practical setup.
3. **9B photosynthesis limiting-factor graph set** — light intensity, carbon dioxide and temperature.
4. **9F reactivity/extraction decision tree** — carbon reduction vs electrolysis using the reactivity series.
5. **9E recycling and peer-review flowcharts** — source-table style visuals that match the revision pack.
6. **9A natural-selection answer-chain** — variation → selection pressure → survival/reproduction → inherited change over generations.

## Files changed

- `data/year9-notes.js`
- `data/year9-content.js`
- `app.js`
- `styles.css`
- `index.html`
- `docs/UNIT_OVERVIEW_INFOGRAPHIC_BACKLOG_v1_50_0.csv`

## QA

Run:

```bash
python tools/validate_content.py
node --check app.js
```

Expected result:

- content validates
- JavaScript syntax check passes
- no new media references are introduced, so no media-missing risk is added
