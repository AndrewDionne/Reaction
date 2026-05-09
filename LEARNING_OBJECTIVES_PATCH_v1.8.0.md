# Learning Objectives Patch v1.8.0

This patch adds a guided learning-objective layer to Reaction.

## What changed

- Added `learningObjectives` metadata to `data/year9-content.js`.
- Added `learningObjective`, `learningObjectiveTitle`, and `learningObjectiveDescription` to every card.
- Added a Learning Objective filter to the main deck controls.
- Added objective chips to each unit card so a learner can jump into a focused objective directly.
- Added a learning-objective panel to each card.
- Improved Study mode with a study-support panel and more explicit next-step guidance.
- Kept Mastery Check limited to cards already marked Mastered.
- Removed unused heavy `assets/png/` images from the cumulative repo because cards now point to optimized WebP assets.

## Result

The app now supports a more intentional revision path:

1. Pick a unit.
2. Pick a learning objective.
3. Work through relevant cards.
4. Sort each card into Mastered, Revisit, or Study.
5. Use Mastery Check only once cards are marked Mastered.
