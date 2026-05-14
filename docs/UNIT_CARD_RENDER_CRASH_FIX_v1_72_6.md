# Unit card render crash fix v1.72.6

## Problem

The browser console showed:

```text
Uncaught ReferenceError: cards is not defined
    at initFilters
```

The app now stores the question bank in the `questions` constant, but `initFilters()` still referenced the old `cards` name while building the card-type filter.

Because this error happened during `init()`, initialization stopped before the Study Units cards rendered. This also made buttons appear broken because event listeners later in the initialization flow were not attached.

## Fix

Changed:

```js
const types = unique(cards.map((card) => card.type));
```

to:

```js
const types = unique(questions.map((card) => card.type));
```

## Validation

- `node --check app.js`
- `node --check data/year9-content.js`
- `node --check data/year9-notes.js`
- `python3 tools/validate_content.py`
- `python3 tools/validate_unit_overviews.py`
- `python3 tools/validate_question_ids.py`
