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

- Content version: **1.64.0**
- Notes version: **1.60.0**
- Cards: **675**
- Class notes: **38**
- Unit overview pages: **6**
- Written exam prompts: **284**
- Missing referenced media: **0**

## Asset policy

Keep assets that are referenced by the app, data files, CSS, manifest or current audit records.

Current retained catalogue:

```text
docs/ASSET_MANIFEST_CURRENT.csv
```

When adding new images:

1. Put diagrammatic SVGs in `assets/diagrams/`.
2. Put teaching images in `assets/webp/`.
3. Keep question media answer-safe.
4. Keep teaching text in class-note media fields where possible.
5. Run the readiness audit after changing references.

## Tool policy

Retained tools:

- `tools/validate_content.py`
- `tools/release_readiness_audit.py`

Keep any future helper scripts small, documented and tied to a repeatable validation task.
