# Maintenance guide

## Validate before committing

Run from repo root:

```bash
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
```

Expected current state:

- Cards: **579**
- Notes: **33**
- Referenced media: **81**
- Missing referenced media: **0**

## Asset policy

Keep assets only if they are referenced by the app, data files, CSS or manifest.

Current retained catalogue:

```text
docs/ASSET_MANIFEST_CURRENT.csv
```

When adding new images:

1. Put diagrams in `assets/diagrams/` only if they are true diagrammatic SVGs.
2. Put illustrative/teaching images in `assets/webp/`.
3. Keep question media answer-safe.
4. Keep teaching text in app-layer media fields where possible.
5. Run the release-readiness audit after changing references.

## Tool policy

Retained tools:

- `tools/validate_content.py`
- `tools/release_readiness_audit.py`

Removed tools were old generation or cleanup scripts that no longer represent the current repo workflow.
