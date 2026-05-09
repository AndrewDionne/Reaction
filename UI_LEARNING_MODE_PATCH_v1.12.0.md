# UI Learning Mode Patch v1.12.0

## Purpose

This patch refines the main hub into a cleaner learning-mode and multi-selection flow.

## Changes

- Converted the route cards into a learning-mode selector.
- Exactly one mode is active at all times: Revision journey, Revisit, or Mastery check.
- Removed per-card entry buttons from the route cards.
- Added one single entry button below the learning-mode selector.
- Added multi-select unit selection.
- Added multi-select sub-unit / learning-objective selection.
- Added a Class Notes button to every sub-unit row.
- Removed the large bottom class-notes dashboard.
- Added six unit graphics as visual identity thumbnails:
  - 9A: DNA
  - 9B: plant/photosynthesis
  - 9E: crystal structure
  - 9F: reaction beaker
  - 9I: forces and motion
  - 9J: magnet / fields

## UX behaviour

- If no unit or sub-unit is selected, the entry button uses all cards.
- Unit selections and sub-unit selections can be combined.
- Revision journey uses all matching selected cards.
- Revisit uses only matching cards marked Revisit.
- Mastery check uses only matching cards marked Mastered.
- Class Notes are now entered from each sub-unit row.
