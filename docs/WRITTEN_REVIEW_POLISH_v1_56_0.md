# Written Review Polish v1.56.0

## Purpose

This patch cleans up the 54 `written-review` prompts introduced in v1.55.0 while keeping the question language close to the Year 9 revision-pack style. The patch avoids a broad rewrite: answers, sources and media are preserved wherever possible.

## Result

| Item | Count |
|---|---:|
| Previous `written-review` prompts reviewed | 54 |
| Promoted directly to `written-main` after source-style wording polish | 53 |
| Broad progress-check prompt retained as study card and removed from exam selection | 1 |
| New split prompts created from the broad 9F extraction/rusting prompt | 2 |
| Remaining `written-review` prompts | 0 |

## Current derived written pool

| Pool | Count |
|---|---:|
| written-main | 280 |
| written-recall | 88 |

## By domain

| Domain | Count |
|---|---:|
| biology | 94 |
| chemistry | 123 |
| physics | 151 |

## By command word

| Command | Count |
|---|---:|
| calculate | 53 |
| describe | 60 |
| explain | 121 |
| graph | 5 |
| identify | 22 |
| state | 107 |

## Wording rules used

- Kept revision-pack vocabulary such as `state`, `identify`, `describe`, `explain`, `round`, `word equation`, `state symbols`, `surroundings`, `biodiversity`, `terminal velocity`, and `sacrificial protection`.
- Converted vague prompts such as `What...`, `Where...`, `Use...`, `Match...`, `Suggest...`, and `Correct the misconception...` into exam command-word prompts.
- Preserved source answers and source references.
- Split only the broad 9F `prepare a talk` item, because it mixed extraction, properties and rust prevention in one prompt.
- Adjusted marks where the answer expected more than two separate points, for example A-H circuit symbols, A-D diagram labels, three peer-review checks, and three wire-resistance factors.

## QA checklist

- `node --check app.js`
- `python tools/validate_content.py`
- `python tools/release_readiness_audit.py`
- Static written-bank QA confirms 400 total written prompts including the 32 curated visual questions and 368 derived open-answer prompts.
