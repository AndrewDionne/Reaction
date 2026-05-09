# Definition Compare Notes Patch v1.14.0

## Purpose

Definition and vocabulary cards now use a compare-notes flow instead of a simple reveal-answer flow.

## Why

A student can write a valid definition in their own words, even if it does not exactly match the stored answer. A strict automatic checker would create false negatives. This patch uses keyword matching as guidance while leaving the final judgement to the learner.

## Behaviour

For definition-style cards:

1. The learner types an answer in their own words.
2. They click **Compare notes**.
3. The app shows:
   - the learner's answer
   - the expected definition
   - key words found / missing
   - a guidance label: good match, partly there, or compare carefully
4. The learner then chooses:
   - **Good match · Mastered**
   - **Nearly there · Revisit**
   - **Open Class Notes**

## Assessment rule

Keyword matching is used only as a prompt, not as the final authority.

- high keyword match: likely good definition
- partial keyword match: close but needs checking
- low keyword match: compare carefully with the expected definition

## Files changed

- `app.js`
- `styles.css`
- `index.html`
- `data/year9-content.js`
