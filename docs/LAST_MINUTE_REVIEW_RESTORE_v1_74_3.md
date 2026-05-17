# v1.74.3 — Restore last-minute review sheet with balanced sets

## What changed
- Restored the Last-minute review sheet builder UI and logic after the balanced question set patch.
- Kept the v1.74.2 Number of questions selector and balanced set generation intact.
- Restored class-notes item selection, question-card Last-minute review buttons, digital review sheet pop-out, remove actions, and print/PDF styling.

## Regression notes
- Progress export/import still includes `reviewSheet`.
- Test your knowledge still avoids answer leakage before submission.
- Smaller balanced question sets still use new/revisit/recent-question weighting.
