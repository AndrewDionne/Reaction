# Maintenance guide

## Validate before committing

Run from repo root:

```bash
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
```

Expected current state:

- Content version: **1.68.0**
- Notes version: **1.67.0**
- Cards: **675**
- Class notes: **38**
- Unit overview pages: **6**
- Written exam prompts: **284**
- Missing referenced media: **0**

## Documentation policy

Keep root `docs/` focused on current maintainer docs and current inventories only.

Do not keep every generated patch CSV/contact sheet in root `docs/`. When a patch generates temporary audit material, consolidate the useful result into one of:

- `CHANGELOG.md`
- `RELEASE_READINESS.md`
- `VISUAL_ASSET_STATUS.md`
- `WRITTEN_TEST_MODES_STATUS.md`
- a current inventory CSV

Large contact sheets should be kept outside the repo unless they are still actively needed.

## Asset policy

- Referenced media must exist under `assets/`.
- Question media must remain answer-safe.
- Class-note media may include explanatory labels.
- Keep direct text labels out of question images where the label is the answer.
- Update `ASSET_MANIFEST_CURRENT.csv` after significant image work.

Current asset inventory:

```text
docs/ASSET_MANIFEST_CURRENT.csv
```

## Tool policy

Retained tools:

- `tools/validate_content.py`
- `tools/release_readiness_audit.py`

Keep future helper scripts small, documented and tied to repeatable validation.
