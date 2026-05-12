# Question Asset Integration — v1.45.0

## Purpose

Integrate the blank/question-safe image assets into question cards, without using annotated class-note images or changing answer logic.

## Design rules used

- Use **blank/question-safe** images only.
- Do not use annotated notes images in question cards.
- Do not replace source-style diagrams when the card depends on labels that only exist in the current SVG.
- Do not add an image when it would directly reveal the answer, such as a meter-placement image that already shows the ammeter and voltmeter correctly connected.
- Prefer written/apply/check questions where the image supports reasoning rather than simple recall.

## Results

- Cards updated: **80**
- Assets deliberately skipped or retained as existing: **4**

## Important non-changes

- The A–H circuit-symbol questions still use the existing SVG because the blank archive image does not provide matching A–H labels.
- The ammeter/voltmeter placement quiz still uses the existing SVG because the blank archive image would leak the answer.
- The current–voltage resistor comparison still uses the existing SVG because the blank archive image does not show the same labelled resistor A/B comparison.

## Validation

Run after patch:

```bash
python tools/validate_content.py
node --check app.js
```

Additional media-reference QA checked that every `media.src` in `year9-content.js` and `year9-notes.js` exists in the repo.
