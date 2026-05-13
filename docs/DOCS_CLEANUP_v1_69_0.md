# Docs cleanup v1.69.0

## Summary

The `docs/` folder had accumulated historical patch reports, generated CSVs and large contact sheets from many development rounds. This patch consolidates the folder into current maintainer documentation and current audit inventories.

## Result

| Metric | Before | After |
|---|---:|---:|
| Docs files | 138 | 16 |
| Current content version | 1.68.0 | 1.68.0 |
| Current notes version | 1.67.0 | 1.67.0 |
| Written exam prompts | 284 | 284 |

## Preserved current inventories

- `ASSET_MANIFEST_CURRENT.csv`
- `UNIT_CONTENT_STATUS_CURRENT.csv`
- `WRITTEN_EXAM_BANK_CURRENT.csv`

## Consolidated history

Detailed historical patch files were consolidated into:

- `CHANGELOG.md`
- `VISUAL_ASSET_STATUS.md`
- `WRITTEN_TEST_MODES_STATUS.md`
- `DOCS_ARCHIVE_MANIFEST_v1_69_0.csv`

## Removed from root docs

- old per-version release-readiness CSVs and markdown reports
- old per-version written-bank inventories
- old image-batch audit CSVs
- large contact-sheet images
- superseded one-off patch reports

No app content, question wording or media references were changed by this docs cleanup.
