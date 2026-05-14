#!/usr/bin/env python3
"""Validate data/year9-exam-paper-bank.js."""
from __future__ import annotations
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "data" / "year9-exam-paper-bank.js"


def load_bank() -> dict:
    raw = PATH.read_text(encoding="utf-8").strip()
    raw = re.sub(r"^\s*window\.YEAR9_EXAM_PAPER_BANK\s*=\s*", "", raw)
    if raw.endswith(";"):
        raw = raw[:-1]
    return json.loads(raw)


def main() -> int:
    bank = load_bank()
    errors: list[str] = []
    papers = bank.get("papers", [])
    if not papers:
        errors.append("No papers found")
    for paper in papers:
        pid = paper.get("id", "paper")
        section_total = 0
        for section in paper.get("sections", []):
            if not section.get("title"):
                errors.append(f"{pid}: section missing title")
            for question in section.get("questions", []):
                qid = f"{pid} Q{question.get('number', '?')}"
                marks = int(question.get("marks", 0) or 0)
                section_total += marks
                if not question.get("topic"):
                    errors.append(f"{qid}: missing topic")
                if marks <= 0:
                    errors.append(f"{qid}: marks must be positive")
                if not question.get("parts"):
                    errors.append(f"{qid}: missing parts")
                for part in question.get("parts", []):
                    label = part.get("label", "?")
                    if not part.get("prompt"):
                        errors.append(f"{qid}({label}): missing prompt")
                    if not part.get("answer"):
                        errors.append(f"{qid}({label}): missing answer")
                    if not part.get("explanation"):
                        errors.append(f"{qid}({label}): missing revision explanation")
                    if not part.get("learnMore") and not part.get("practice"):
                        errors.append(f"{qid}({label}): missing learnMore/practice reference")
                    if part.get("command") not in {"state", "identify", "describe", "explain", "calculate", "graph", "name", "complete", "interpret", "suggest"}:
                        errors.append(f"{qid}({label}): invalid command {part.get('command')!r}")
                if question.get("graph"):
                    graph = question["graph"]
                    if len(graph.get("xValues", [])) != len(graph.get("yValues", [])):
                        errors.append(f"{qid}: graph xValues and yValues length mismatch")
        declared = int(paper.get("totalMarks", 0) or 0)
        if declared and declared != section_total:
            errors.append(f"{pid}: totalMarks {declared} does not equal section total {section_total}")
    if errors:
        print("Exam paper bank validation failed:")
        for error in errors:
            print(" - " + error)
        return 1
    print(f"Exam paper bank validation passed for {len(papers)} paper(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
