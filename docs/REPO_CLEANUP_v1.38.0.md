# Repo cleanup — v1.38.0

## Scope

This cleanup pass reduces the repo to the current release-ready app surface:

- removes unreferenced/superseded assets
- removes historical patch-note clutter
- removes old one-off cleanup/build scripts
- consolidates documentation into a small maintained set

## Removed files

- Assets removed: **38**
- Docs removed/consolidated: **24**
- Tools removed: **4**
- Total removed/consolidated: **66**

Full manifest: `docs/cleanup_manifest_v1_38_0.csv`

## Retained docs

- `README.md`
- `docs/README.md`
- `docs/CHANGELOG.md`
- `docs/MAINTENANCE.md`
- `docs/RELEASE_READINESS.md`
- `docs/ASSET_MANIFEST_CURRENT.csv`
- `docs/cleanup_manifest_v1_38_0.csv`

## Retained tools

- `tools/validate_content.py`
- `tools/release_readiness_audit.py`

## Validation

Validated after cleanup:

```text
node --check app.js
node --check data/year9-content.js
node --check data/year9-notes.js
python3 tools/validate_content.py
python3 tools/release_readiness_audit.py
missing referenced media: 0
```
