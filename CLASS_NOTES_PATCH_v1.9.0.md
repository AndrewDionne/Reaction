# Class Notes + Study Context Patch v1.9.0

This patch adds a class-notes layer to Reaction.

## What changed

- Added `data/year9-notes.js` with 25 class notes aligned to the learning objectives.
- Added `noteId` metadata to all 419 cards.
- Added a **Review Class Notes** section to the main hub.
- Changed the card-level **Study** action into **Study this**, which opens a context card.
- Context cards include:
  - big idea
  - key points
  - common mistakes
  - worked/example question
  - relevant image/diagram where available
- The Study queue is now reserved for cards marked **Still confused** after reading the class note.

## Intended learning flow

1. Work through revision cards.
2. Reveal the answer.
3. If the answer is not clear, choose **Study this**.
4. Read the class note.
5. Choose:
   - **I get it now · Mastered**
   - **Almost · Revisit**
   - **Still confused · Keep in Study**

This keeps the app as a guided revision journey rather than just a test bank.
