# Visual Question Restoration Patch v1.16.0

This patch restores diagrams for cards where the question depends on an image, graph, labelled model or visual source-style prompt.

## Why this patch was needed

The v1.13 image-discipline pass correctly removed decorative images from question cards, but it also removed a few required visual prompts. The most obvious example was the falling-object force question, where the question refers to X/Y labels that were not visible.

## Rule used

Images remain removed unless they are required to answer the card. A visual is included only when the learner must interpret labels, arrows, graph shape, food-web links, or a source-style model.

## Cards restored

- 9I falling object force labels X/Y
- 9B specialised plant cell with long projection
- 9B food web with rose bush, insects and wrens
- 9B carbon cycle process-labelling prompt
- 9I distance-time graph representation prompt
- 9A Triceratops adaptation model prompts

## Added SVGs

- `assets/diagrams/9I-falling-forces-source-style-XY.svg`
- `assets/diagrams/9B-root-hair-source-style.svg`
- `assets/diagrams/9B-carbon-cycle-source-style.svg`
- `assets/diagrams/9A-triceratops-adaptations-source-style.svg`

## Important note

The restored diagrams are deliberately source-style and low-clutter. They do not include answer labels such as “X = weight” because that would give away the answer before the learner tries the question.
