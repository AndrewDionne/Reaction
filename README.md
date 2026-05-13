# Reaction — Year 9 Science Study App

A static, GitHub Pages-ready Year 9 science revision app covering units **9A, 9B, 9E, 9F, 9I and 9J**.

The app focuses on class notes, visual revision tiles, practice cards, Revisit practice, test mode, end-of-unit written tests and balanced written exam practice.

## Current content status

- Content version: **1.68.0**
- Notes version: **1.67.0**
- Question cards: **675**
- Class notes: **38**
- Unit overview pages: **6**
- Written exam prompts: **284**
- Referenced media assets: **207**
- Missing referenced media: **0**

## Card count by unit

| Unit | Cards | Visual cards | Written prompts |
|---|---:|---:|---:|
| 9A | 77 | 12 | 25 |
| 9B | 103 | 28 | 48 |
| 9E | 104 | 45 | 51 |
| 9F | 135 | 62 | 50 |
| 9I | 105 | 35 | 52 |
| 9J | 151 | 66 | 58 |

## App features

- Revision journey for selected units or sub-units
- Revisit list and Revisit test mode
- Test your knowledge mode
- End-of-unit written tests
- Balanced written exam mode with structured sections, answer-format help and self-marking
- Unit overview pages with lead visuals and revision tiles
- Class Notes linked to learning objectives
- Local browser progress storage
- Static deployment; no backend, API key or build step required

## Run locally

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

## Useful checks

```bash
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
```

## Documentation

Current maintainer docs and inventories are in `docs/`.

## Source/licence note

The study content was built to align closely with the supplied Year 9 revision materials. Keep the repo private or within the permitted classroom/institution context unless the reconstructed source-pack wording is replaced with original wording.
