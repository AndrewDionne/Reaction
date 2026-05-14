#!/usr/bin/env python3
"""Validate learn-more links in year-end exam banks."""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_js(path: Path, var: str) -> dict:
    raw = path.read_text(encoding="utf-8").strip()
    raw = re.sub(rf"^\s*window\.{re.escape(var)}\s*=\s*", "", raw)
    if raw.endswith(";"):
        raw = raw[:-1]
    return json.loads(raw)


def iter_exam_parts(bank: dict):
    for paper in bank.get("papers", []):
        for section in paper.get("sections", []):
            for question in section.get("questions", []):
                context = f"{paper.get('id')} Q{question.get('number')} {question.get('topic')}"
                for part in question.get("parts", []):
                    yield context, part


def iter_source_questions(bank: dict):
    for question in bank.get("questions", []):
        yield question.get("id", "source-question"), question


def main() -> int:
    notes = load_js(ROOT / "data" / "year9-notes.js", "YEAR9_NOTES")
    note_ids = {note.get("id") for note in notes.get("notes", []) if note.get("id")}
    errors: list[str] = []

    exam = load_js(ROOT / "data" / "year9-exam-paper-bank.js", "YEAR9_EXAM_PAPER_BANK")
    source = load_js(ROOT / "data" / "year9-source-style-question-bank.js", "YEAR9_SOURCE_STYLE_QUESTION_BANK")

    for context, item in list(iter_exam_parts(exam)) + list(iter_source_questions(source)):
        links = item.get("learnMore") or []
        if not links:
            errors.append(f"{context}: missing learnMore")
            continue
        for link in links:
            href = str(link.get("href", ""))
            if href.startswith("index.html#note="):
                note_id = href.split("index.html#note=", 1)[1]
                if note_id not in note_ids:
                    errors.append(f"{context}: learnMore note does not exist: {note_id}")
            elif href.startswith("year-end-essentials.html"):
                errors.append(f"{context}: learnMore still points to year-end essentials instead of class notes: {href}")
            elif href:
                # Allow other internal links only if the file exists.
                file_part = href.split("#", 1)[0]
                if file_part and not (ROOT / file_part).exists():
                    errors.append(f"{context}: learnMore file does not exist: {href}")
            else:
                errors.append(f"{context}: empty learnMore href")

    if errors:
        print("Learn-more link validation failed:")
        for error in errors:
            print(" - " + error)
        return 1
    print("Learn-more link validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
