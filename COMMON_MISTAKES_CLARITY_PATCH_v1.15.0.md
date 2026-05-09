# Common Mistakes Clarity Patch v1.15.0

## Purpose

The previous Class Notes used plain bullet points under “Common mistakes.” Some bullets were written as incorrect ideas, while others were written as correct reminders. That made it unclear what was wrong and what was actually correct.

## What changed

- Converted all Class Notes `commonMistakes` entries into structured objects:
  - `wrong`
  - `correct`
  - `why`
- Updated the Class Notes UI to render each item as:
  - **Common mistake**
  - **Actually**
  - **Why**
- Added styling that visually separates misconceptions from corrections.
- Kept backward compatibility for any older plain-string mistake entries.

## Result

Learners can now clearly see:

1. the incorrect idea to avoid,
2. the correct science statement, and
3. why the correction is true.
