# Year-end essentials class notes v1.72.2

## Purpose

This patch promotes the repeated source-exam essentials from the checklist page into full app class notes. The revision answer key can now send students to a detailed note instead of only to the year-end essentials page.

## New class notes

Added to `data/year9-notes.js`:

- `9B-cells-microscopy-organisation` — Cells, microscopy and organisation
- `9B-digestion-enzymes-food-tests` — Digestion, enzymes and food tests
- `9F-acids-alkalis-neutralisation` — Acids, alkalis, pH and neutralisation
- `9F-particle-model-states-density` — States of matter, particle model and density
- `9I-waves-light-sound` — Waves, light and sound
- `9I-energy-resources` — Energy resources and energy transfers
- `9S-working-scientifically` — Working scientifically: graphs, variables and safety

## Link updates

Updated the revision-answer learn-more links in:

- `data/year9-exam-paper-bank.js`
- `data/year9-source-style-question-bank.js`

The exam answer key now links to `index.html#note=...` class notes wherever possible.

## Essentials page update

`year-end-essentials.html` now has **Open class notes** links on the main repeated topic blocks.

## Remaining content work

These new notes are text-first. A later visual pass could add full-width images for:

- cells / microscope / organisation
- food tests and enzyme denaturation
- acids / pH / neutralisation
- particle states and density
- waves / light / sound
- working scientifically graph and variable examples
