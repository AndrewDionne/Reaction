# SVG Diagram Patch v1.2.0

This patch adds a first pass of embedded SVG diagrams and charts to improve the visual fidelity of the Year 9 study app.

## What changed

- added `assets/diagrams/` with original classroom-style SVG files
- updated `app.js` to render card media inside practice and boss mode
- updated `styles.css` for media display
- updated `data/year9-content.js` to attach diagrams to relevant cards

## Coverage improvement

This patch focuses mainly on questions that were previously reconstructed from diagrams, charts, graphs, and visual prompts. It also adds a few high-value support diagrams for progress-check cards.

## Added SVG assets

- `9A-continuous-variation.svg`
- `9B-photosynthesis-plant.svg`
- `9B-photosynthesis-light-graph.svg`
- `9B-root-hair-cell.svg`
- `9B-food-web.svg`
- `9E-brittle-lattice.svg`
- `9I-falling-forces.svg`
- `9I-sankey-efficiency.svg`
- `9I-distance-time-graph.svg`
- `9I-fulcrum-lever.svg`
- `9I-lever-advantage.svg`
- `9J-current-voltage-graph.svg`
- `9J-series-parallel.svg`
