# Reaction docs

This folder keeps only the current maintainer documentation and current audit inventories for the Year 9 **Reaction** science app.

## Current app status

- Content version: **1.68.0**
- Notes version: **1.67.0**
- Question cards: **675**
- Class notes: **38**
- Unit overview pages: **6**
- Written exam prompts: **284**
- Referenced media assets: **207**
- Asset files: **304**

## Current files

| File | Purpose |
|---|---|
| `README.md` | Docs index and current status. |
| `CHANGELOG.md` | Consolidated project history. |
| `MAINTENANCE.md` | Validation and maintenance workflow. |
| `RELEASE_READINESS.md` | Current release-readiness summary. |
| `ASSET_MANIFEST_CURRENT.csv` | Current asset inventory and reference status. |
| `UNIT_CONTENT_STATUS_CURRENT.csv` | Current unit/card/written-prompt counts. |
| `WRITTEN_EXAM_BANK_CURRENT.csv` | Current written-exam prompt inventory. |
| `VISUAL_ASSET_STATUS.md` | Consolidated visual asset status after the R7/R8 image work. |
| `WRITTEN_TEST_MODES_STATUS.md` | Consolidated written/end-of-unit/revisit test status. |
| `DOCS_CLEANUP_v1_69_0.md` | This cleanup patch report. |
| `DOCS_ARCHIVE_MANIFEST_v1_69_0.csv` | Manifest of old docs consolidated or removed from root docs. |

## Unit summary

| Unit | Cards | Notes | Visual cards | Written prompts | Written visuals |
|---|---:|---:|---:|---:|---:|
| 9A | 77 | 4 | 12 | 25 | 8 |
| 9B | 103 | 5 | 28 | 48 | 25 |
| 9E | 104 | 8 | 45 | 51 | 32 |
| 9F | 135 | 8 | 62 | 50 | 24 |
| 9I | 105 | 6 | 35 | 52 | 29 |
| 9J | 151 | 7 | 66 | 58 | 35 |

## Validation

Run from repo root:

```bash
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
```
