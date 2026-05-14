# v1.73.0 — Simplified learning modes

## Goal

Simplify the student-facing learning routes so the app has only three main modes on the home page.

## Mode structure

### 1. Revision journey

Flexible learn-as-you-go practice. Students select units or sub-units, use feedback and class notes during learning, then sort questions into Secure or Revisit.

### 2. Test your knowledge

Selected-unit/sub-unit test mode using the app question bank. Answers are hidden while the test is in progress. After submission, the app shows the auto-marked multiple-choice score, student answers, expected answers, explanations, common mistakes and class-note links.

Selecting one full unit now acts as the end-of-unit style filter, so End of unit test no longer needs a separate top-level card.

### 3. Exam mode

Digital-first 80-mark source-style written paper route. Students type answers into first-class answer boxes, submit to unlock answer guidance under each answer, and can still use Print / Save PDF as a secondary option.

## Consolidated or removed from home page

- Removed standalone Revisit test card.
- Removed standalone End of unit test card.
- Removed old duplicate Written exam mode naming from the home-page cards.
- Removed the Written test builder home-page panel.
- Removed quick / standard / full written-test buttons.
- Removed standalone Year-end essentials shortcut from the home page. Year-end essentials remain represented through class notes and overview content.

## Header rule

The global header remains stable: Reaction title/logo plus Sound, Export and Import. Exam-specific controls now live inside the exam page body.

## Files changed

- `index.html`
- `app.js`
- `styles.css`
- `exam-paper.html`
- `docs/CHANGELOG.md`
- `docs/SIMPLIFIED_LEARNING_MODES_v1_73_0.md`
