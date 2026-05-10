# v1.27.0 — SVG Phase 1 + Phase 2 patch

## Scope

This patch applies the new SVG methodology:

1. **Phase 1 — App-layer text support**
   - SVGs act as clean base diagrams.
   - Longer teaching text is rendered by the app below the image, using structured media fields.
   - Question cards still hide captions and note text so test-mode diagrams do not give away answers.

2. **Phase 2 — Reveal/note SVG cleanup**
   - Rebuilt the worst text-heavy reveal/note SVGs as clean diagram base layers.
   - Removed or reduced long embedded SVG text.
   - Kept essential short labels only, such as axis labels, object labels, and component names.

## Files changed

### App layer
- `app.js`
  - Adds `renderMediaLayerText()`.
  - Extends `renderMediaItems()` to support:
    - `mediaTitle`
    - `mediaLead`
    - `mediaPoints`
    - `presentation`

- `styles.css`
  - Adds styling for app-rendered media text blocks.
  - Adds a reusable `media-diagram-base` presentation class.

### Data
- `data/year9-notes.js`
  - Bumped notes version to `1.27.0`.
  - Adds structured app-layer media text to major SVG note visuals.

### Cleaned SVG base layers
- `assets/diagrams/9A-dna-genes-chromosomes.svg`
- `assets/diagrams/9B-photosynthesis-light-graph.svg`
- `assets/diagrams/9B-plant-transport-clean-note.svg`
- `assets/diagrams/9B-food-production-methods-clean-note.svg`
- `assets/diagrams/9B-food-web.svg`
- `assets/diagrams/9B-carbon-cycle-source-style.svg`
- `assets/diagrams/9B-leaf-xylem-phloem.svg`
- `assets/diagrams/9E-vulcanisation-crosslinks-source-style.svg`
- `assets/diagrams/9E-polymers-composites.svg`
- `assets/diagrams/9F-displacement-reaction.svg`
- `assets/diagrams/9F-reactivity-extraction.svg`
- `assets/diagrams/9F-blast-furnace-question.svg`
- `assets/diagrams/9I-sankey-efficiency.svg`
- `assets/diagrams/9I-distance-time-VWXYZ.svg`
- `assets/diagrams/9I-falling-forces.svg`
- `assets/diagrams/9I-lever-XYZ-source-style.svg`
- `assets/diagrams/9J-current-voltage-graph.svg`
- `assets/diagrams/9J-electromagnet-relay-motor-clean-note.svg`

## Notes

This patch does **not** convert the illustrative SVGs to image assets yet. That remains the next phase once the new image assets are generated.

## Validation

Validated:

```text
media refs: no missing files
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
all patched SVGs render with CairoSVG
```
