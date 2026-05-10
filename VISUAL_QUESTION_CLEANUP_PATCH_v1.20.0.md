# Visual Question Cleanup Patch v1.20.0

## What changed

- Question-card diagrams now hide captions so the image does not give away the answer.
- Required diagrams are constrained to a cleaner, smaller display area.
- Replaced the falling-object force diagram with a cleaner source-style SVG.
- Removed manual Mastered/Revisit buttons from multiple-choice cards.
- Multiple-choice sorting now relies on the selected answer:
  - correct answer → Mastered
  - wrong answer → Revisit
- If a learner gets a multiple-choice card wrong, it stays in Revisit even if they go back and later click the correct answer. It can only be cleared by answering correctly in Revisit mode.
- Wrong answers in Test your knowledge remove the card from Mastered and put it into Revisit.

## Why

This keeps visual prompts useful without adding answer leakage, and it makes the revision queue more trustworthy.
