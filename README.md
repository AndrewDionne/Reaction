# Reaction — Year 9 Science Study App

A static, GitHub Pages-ready Year 9 science revision app covering units **9A, 9B, 9E, 9F, 9I and 9J**.

This cleaned repo snapshot reflects the post-release-readiness state after the content, visual, QA and revision-pack alignment passes.

## Current content status

- Content version: **1.51.0**
- Notes version: **1.51.0**
- Question cards: **579**
- Class notes: **33**
- Learning objectives: **33**
- Referenced media assets: **81**
- Missing referenced media: **0**

## Card count by unit

| Unit | Cards |
|---|---:|
| 9A | 74 |
| 9B | 99 |
| 9E | 75 |
| 9F | 105 |
| 9I | 82 |
| 9J | 144 |

## App features

- Practice / Need Notes / Revisit / Test your knowledge flows
- Boss-style test mode with saved or discarded scores
- Revision list for missed questions
- Resume-position support for active sessions
- Multiple-choice answer shuffling
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

## Useful commands

```bash
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
```

## Documentation

- `docs/MAINTENANCE.md` — how to validate and maintain the app
- `docs/RELEASE_READINESS.md` — latest QA summary
- `docs/CHANGELOG.md` — consolidated history of major patch phases
- `docs/ASSET_MANIFEST_CURRENT.csv` — current retained asset catalogue
- `docs/REPO_CLEANUP_v1.38.0.md` — files removed in this cleanup pass

## Source/licence note

The study content was built to align closely with the supplied Year 9 revision materials. Keep the repo private or within the permitted classroom/institution context unless the reconstructed source-pack wording is replaced with original wording.
