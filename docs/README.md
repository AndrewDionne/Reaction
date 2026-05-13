# Reaction — Year 9 Science Study App

A static, GitHub Pages-ready Year 9 science revision app covering units **9A, 9B, 9E, 9F, 9I and 9J**.

The student app focuses on class notes, visual revision tiles, quick practice cards, revisit practice, test mode and balanced written exam practice.

## Current content status

- Content version: **1.64.0**
- Notes version: **1.60.0**
- Question cards: **675**
- Class notes: **38**
- Unit overview pages: **6**
- Written exam prompts: **284**
- Referenced media assets: checked by `tools/release_readiness_audit.py`

## Card count by unit

| Unit | Cards |
|---|---:|
| 9A | 77 |
| 9B | 103 |
| 9E | 104 |
| 9F | 135 |
| 9I | 105 |
| 9J | 151 |

## App features

- Revision journey for selected units or sub-units
- Revisit list for cards that need another attempt
- Test your knowledge mode
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

## Main files

```text
index.html
app.js
styles.css
data/year9-content.js
data/year9-notes.js
assets/
tools/
docs/
```

## Useful checks

```bash
node --check app.js
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
```

## Source/licence note

The study content was built to align closely with the supplied Year 9 revision materials. Keep the repo private or within the permitted classroom/institution context unless the reconstructed source-pack wording is replaced with original wording.
