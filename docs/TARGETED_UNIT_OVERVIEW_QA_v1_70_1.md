# Targeted unit overview QA v1.70.1

## Scope

This pass reviewed the v1.70.0 targeted unit overview mode after applying it to the current repo snapshot. The goal was to remove visible developer/reviewer language and fix small UI issues before the next content expansion.

## Fixes made

- Fixed an extra closing `</section>` in the targeted overview render.
- Changed visible student-facing references from “cards” to “questions” in key instructions and mode descriptions.
- Changed “Class notes from overview” to “Class notes”.
- Changed “Open class notes” buttons to “Learn this”.
- Changed “Practise:” to “Practise questions:”.
- Changed “Sub-unit coverage” to “Sub-units practised”.
- Changed the definition-comparison helper text so it no longer mentions “final status”.
- Removed unused legacy overview status/backlog render helpers from `app.js`.
- Cleaned review-export wording: “QC ID” is now “Question ID”; “Reviewer answer / mark scheme” is now “Answer / mark scheme”.
- Updated `content-review.html` wording from “question cards” to “questions”.

## Coverage result

The six unit overviews still validate against the targeted overview structure:

- 9A Genetics and evolution
- 9B Plant growth and photosynthesis
- 9E Materials and their impact
- 9F Reactivity and reactions
- 9I Forces, motion and machines
- 9J Electricity and magnetism

No missing media references were found in `data/year9-notes.js` or `data/year9-content.js`.

## Remaining judgement items

These are not blockers, but are worth reviewing visually in the browser:

1. Whether question IDs should remain visible to students, or only in the review/export page.
2. Whether the phrase “Mastered” should stay as the learning-state label.
3. Whether the vocabulary lists should include short meanings directly, rather than terms only.
4. Whether some expanded rows should be shortened after a student read-through.

## Validation run

- `node --check app.js`
- `node --check data/year9-notes.js`
- `node --check data/year9-content.js`
- `python3 tools/validate_unit_overviews.py`
- `python3 tools/validate_question_ids.py`
- `python3 tools/validate_content.py`
