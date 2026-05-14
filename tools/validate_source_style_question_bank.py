#!/usr/bin/env python3
"""Validate data/year9-source-style-question-bank.js."""
from __future__ import annotations
import json, re
from collections import Counter
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'data' / 'year9-source-style-question-bank.js'
VALID_COMMANDS = {'state','identify','describe','explain','calculate','graph','name','complete','interpret','suggest'}
VALID_SECTIONS = {'Biology','Chemistry','Physics','Working scientifically'}

def load() -> dict:
    raw = PATH.read_text(encoding='utf-8').strip()
    raw = re.sub(r'^\s*window\.YEAR9_SOURCE_STYLE_QUESTION_BANK\s*=\s*', '', raw)
    if raw.endswith(';'):
        raw = raw[:-1]
    return json.loads(raw)

def main() -> int:
    data = load()
    errors = []
    qs = data.get('questions', [])
    if not qs:
        errors.append('No source-style questions found')
    ids = [q.get('id') for q in qs]
    for dup, count in Counter(ids).items():
        if count > 1:
            errors.append(f'Duplicate id: {dup}')
    for q in qs:
        qid = q.get('id', '?')
        if q.get('section') not in VALID_SECTIONS:
            errors.append(f'{qid}: invalid section {q.get("section")!r}')
        if not q.get('topic'):
            errors.append(f'{qid}: missing topic')
        if q.get('command') not in VALID_COMMANDS:
            errors.append(f'{qid}: invalid command {q.get("command")!r}')
        if not q.get('prompt'):
            errors.append(f'{qid}: missing prompt')
        if not q.get('answer'):
            errors.append(f'{qid}: missing answer')
        if not q.get('explanation'):
            errors.append(f'{qid}: missing revision explanation')
        if not q.get('learnMore') and not q.get('practice'):
            errors.append(f'{qid}: missing learnMore/practice reference')
        if int(q.get('marks', 0) or 0) <= 0:
            errors.append(f'{qid}: marks must be positive')
    if errors:
        print('Source-style question bank validation failed:')
        for e in errors:
            print(' - ' + e)
        return 1
    print(f'Source-style question bank validation passed for {len(qs)} subquestions.')
    return 0
if __name__ == '__main__':
    raise SystemExit(main())
