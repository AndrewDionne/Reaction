# v1.37.0 release-readiness QA report

## Summary

- Content version: `1.37.0`
- Notes version: `1.35.0`
- Cards: **579**
- Class notes: **33**
- Learning objectives: **33**
- Referenced media assets: **67**
- Missing referenced media: **0**
- Findings: **17 pass**, **0 warn**, **0 fail**

## Release-readiness judgement

The app is ready for a student trial if all `fail` checks remain at zero. Warnings are content-quality follow-up items rather than blockers.

## App-flow regression guards

- Resume-session support: pass
- Multiple-choice shuffle support: pass
- Revisit micro-note removed: pass
- Duplicate `finishTest()` call removed: pass
- Question media captions hidden: pass
- Missed test cards move to Revisit: pass

## Unit balance snapshot

| Unit | Cards | L1 | L2 | L3 | Visual | Open answer |
|---|---:|---:|---:|---:|---:|---:|
| 9A | 74 | 41 | 21 | 10 | 5 | 54 |
| 9B | 99 | 36 | 24 | 33 | 5 | 79 |
| 9E | 75 | 35 | 18 | 15 | 2 | 55 |
| 9F | 105 | 40 | 27 | 29 | 13 | 71 |
| 9I | 82 | 33 | 24 | 22 | 6 | 63 |
| 9J | 144 | 44 | 49 | 37 | 26 | 106 |

## Files generated

- `docs/release_readiness_findings_v1_37_0.csv`
- `docs/release_readiness_unit_balance_v1_37_0.csv`
- `docs/release_readiness_media_refs_v1_37_0.csv`
- `docs/release_readiness_answer_leakage_flags_v1_37_0.csv`

## Recommendation

Proceed to student trial after applying this patch. The next pass should be based on actual student usage, not further broad content expansion.

