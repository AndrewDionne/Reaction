# Revisit test loop QA v1.65.0

## Scope

This patch upgrades the Revisit loop without changing the r164 written-exam bank or source-style question wording.

## Implemented

- Added a separate **Revisit test** mode on the main hub.
- Revisit test builds a full test from cards currently marked Revisit, respecting the selected unit/sub-unit filters.
- Correct answers in Revisit test move the card to Mastered and remove it from Revisit.
- Missed answers stay in Revisit.
- Written-exam low-mark handling now highlights the **Add linked card to Revisit** button without explanatory suggestion text.
- Added progress bars on the main hub for each unit and each sub-unit/objective.
- Kept progress display at unit/sub-unit granularity only.

## Static QA

| Check | Result |
|---|---|
| revisit-test mode text present | pass |
| revisit-test route card present | pass |
| revisit test uses revisitIds filter | pass |
| written low-mark callout has no explanatory paragraph | pass |
| unit progress label present | pass |
| objective progress bar present | pass |
| test mode helper includes revisit-test | pass |
| revisit test correct answers clear revisit | pass |

## Preservation checks

- Written exam question count remains governed by the r164 bank.
- No source-style written question wording was intentionally changed.
- Revisit cards remain under user control: the app highlights the Revisit action but does not automatically add written answers based on score alone.
