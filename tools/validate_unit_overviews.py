#!/usr/bin/env python3
"""Validate targeted unit overview checklist references."""
from __future__ import annotations
import json, re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def load_js(path: Path, var: str) -> dict:
    raw=path.read_text(encoding='utf-8').strip()
    raw=re.sub(rf'^\s*window\.{re.escape(var)}\s*=\s*','',raw)
    if raw.endswith(';'):
        raw=raw[:-1]
    return json.loads(raw)

def main() -> int:
    notes=load_js(ROOT/'data'/'year9-notes.js','YEAR9_NOTES')
    content=load_js(ROOT/'data'/'year9-content.js','YEAR9_CONTENT')
    qids={c.get('qid') for c in content.get('cards',[]) if c.get('qid')}
    note_ids={n.get('id') for n in notes.get('notes',[]) if n.get('id')}
    errors=[]
    required=['subUnits','vocabulary','understand','identify','memorize']
    for ov in notes.get('unitOverviews',[]):
        unit=ov.get('unit','?')
        target=ov.get('targetedOverview')
        if not target:
            errors.append(f'{unit}: missing targetedOverview')
            continue
        for key in required:
            if not isinstance(target.get(key), list) or not target.get(key):
                errors.append(f'{unit}: targetedOverview.{key} missing or empty')
        for section in ['understand','identify','memorize']:
            for idx,item in enumerate(target.get(section,[]), start=1):
                if not item.get('title'):
                    errors.append(f'{unit}.{section}[{idx}]: missing title')
                note_id=item.get('noteId')
                if note_id and note_id not in note_ids:
                    errors.append(f'{unit}.{section}[{idx}]: unknown noteId {note_id}')
                for qid in item.get('practice',[]) or []:
                    if qid not in qids:
                        errors.append(f'{unit}.{section}[{idx}]: unknown practice qid {qid}')
                media=item.get('media') or []
                if isinstance(media, str): media=[media]
                for m in media:
                    src=m.get('src') if isinstance(m,dict) else str(m)
                    if src and not (ROOT/src).exists():
                        errors.append(f'{unit}.{section}[{idx}]: missing media {src}')
    if errors:
        print('Unit overview validation failed:')
        for err in errors:
            print(' - '+err)
        return 1
    print(f'Unit overview validation passed for {len(notes.get("unitOverviews",[]))} units.')
    return 0
if __name__=='__main__':
    raise SystemExit(main())
