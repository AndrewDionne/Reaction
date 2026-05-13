#!/usr/bin/env python3
"""Static readiness audit for the Year 9 Reaction app.

Run from the repository root:
    python3 tools/release_readiness_audit.py

The script checks the content pack, notes, media references and key app-flow
regression guards. It writes CSV/Markdown reports into docs/.
"""
from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)
VERSION = "1.64.0"

CONTENT_FILE = ROOT / "data" / "year9-content.js"
NOTES_FILE = ROOT / "data" / "year9-notes.js"
APP_FILE = ROOT / "app.js"


def read_assignment(path: Path, var_name: str) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    match = re.search(rf"window\.{re.escape(var_name)}\s*=\s*(\{{.*\}})\s*;?\s*$", text, re.S)
    if not match:
      raise ValueError(f"Could not find window.{var_name} assignment in {path}")
    return json.loads(match.group(1))


def normalize_question(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", str(text).lower())).strip()


def normalize_choice(choice: str, index: int = 0) -> tuple[str, str]:
    raw = str(choice or "").strip()
    match = re.match(r"^([A-Z])(?:[).:\-]|\s)+(.+)$", raw)
    if match:
        return match.group(1), match.group(2).strip()
    return chr(65 + index), raw


def media_refs_from_item(item: Any) -> list[str]:
    refs: list[str] = []
    if isinstance(item, dict):
        src = item.get("src")
        if isinstance(src, str) and src.startswith("assets/"):
            refs.append(src)
        for value in item.values():
            refs.extend(media_refs_from_item(value))
    elif isinstance(item, list):
        for child in item:
            refs.extend(media_refs_from_item(child))
    return refs


def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in fieldnames})


def main() -> int:
    content = read_assignment(CONTENT_FILE, "YEAR9_CONTENT")
    notes_bundle = read_assignment(NOTES_FILE, "YEAR9_NOTES")
    cards = content.get("cards", []) if isinstance(content.get("cards"), list) else []
    notes = notes_bundle.get("notes", []) if isinstance(notes_bundle.get("notes"), list) else []
    units = content.get("units", []) if isinstance(content.get("units"), list) else []
    objectives = content.get("learningObjectives", []) if isinstance(content.get("learningObjectives"), list) else []
    app_text = APP_FILE.read_text(encoding="utf-8") if APP_FILE.exists() else ""

    findings: list[dict[str, Any]] = []
    def finding(severity: str, area: str, check: str, result: str, detail: str = "") -> None:
        findings.append({"severity": severity, "area": area, "check": check, "result": result, "detail": detail})

    # Basic counts and identity checks.
    card_ids = [card.get("id") for card in cards]
    duplicate_ids = [cid for cid, count in Counter(card_ids).items() if cid and count > 1]
    finding("pass" if not duplicate_ids else "fail", "content", "unique card ids", "pass" if not duplicate_ids else "fail", "; ".join(map(str, duplicate_ids[:20])))

    note_ids = {note.get("id") for note in notes}
    objective_ids = {obj.get("id") for obj in objectives}
    missing_note_links = [card.get("id") for card in cards if card.get("noteId") and card.get("noteId") not in note_ids]
    missing_objective_links = [card.get("id") for card in cards if card.get("learningObjective") and card.get("learningObjective") not in objective_ids]
    finding("pass" if not missing_note_links else "warn", "content", "card note links", "pass" if not missing_note_links else "warn", f"missing note links: {len(missing_note_links)}")
    finding("pass" if not missing_objective_links else "warn", "content", "card learning-objective links", "pass" if not missing_objective_links else "warn", f"missing objective links: {len(missing_objective_links)}")

    normalized_questions = Counter(normalize_question(card.get("question", "")) for card in cards)
    duplicate_questions = [question for question, count in normalized_questions.items() if question and count > 1]
    finding("pass" if not duplicate_questions else "warn", "content", "duplicate normalized questions", "pass" if not duplicate_questions else "warn", f"duplicates: {len(duplicate_questions)}")

    # MCQ integrity and answer leakage.
    mcq_errors = []
    leakage_flags = []
    weak_distractor_flags = []
    for card in cards:
        choices = card.get("choices")
        answer = str(card.get("answer", "")).strip()
        if isinstance(choices, list) and choices:
            normalized = [normalize_choice(choice, idx) for idx, choice in enumerate(choices)]
            keys = [key for key, _ in normalized]
            texts = [text for _, text in normalized]
            if answer not in keys:
                mcq_errors.append(card.get("id"))
            if len(set(normalize_question(text) for text in texts)) < len(texts):
                weak_distractor_flags.append({"card_id": card.get("id"), "issue": "duplicate choice text"})
            correct_text = next((text for key, text in normalized if key == answer), "")
            question_norm = normalize_question(card.get("question", ""))
            answer_norm = normalize_question(correct_text)
            if len(answer_norm) >= 12 and answer_norm in question_norm:
                leakage_flags.append({"card_id": card.get("id"), "issue": "correct answer text appears in question", "answer": correct_text})
    finding("pass" if not mcq_errors else "fail", "content", "MCQ answer keys resolve", "pass" if not mcq_errors else "fail", f"bad answer keys: {len(mcq_errors)}")
    finding("pass" if not leakage_flags else "warn", "content", "automated answer-leakage scan", "pass" if not leakage_flags else "warn", f"flags: {len(leakage_flags)}")
    finding("pass" if not weak_distractor_flags else "warn", "content", "duplicate distractor text scan", "pass" if not weak_distractor_flags else "warn", f"flags: {len(weak_distractor_flags)}")

    # Source traceability.
    missing_source = [card.get("id") for card in cards if not card.get("source")]
    missing_fidelity = [card.get("id") for card in cards if not card.get("sourceFidelity")]
    finding("pass" if not missing_source else "warn", "content", "source field present", "pass" if not missing_source else "warn", f"missing source: {len(missing_source)}")
    finding("pass" if not missing_fidelity else "warn", "content", "source fidelity present", "pass" if not missing_fidelity else "warn", f"missing sourceFidelity: {len(missing_fidelity)}")

    # Media references.
    media_usage: dict[str, list[str]] = defaultdict(list)
    for card in cards:
        for ref in media_refs_from_item(card.get("media", [])):
            media_usage[ref].append(card.get("id", "unknown-card"))
    for note in notes:
        for ref in media_refs_from_item(note.get("media", [])):
            media_usage[ref].append(note.get("id", "unknown-note"))
    media_rows = []
    missing_media = []
    for ref, used_by in sorted(media_usage.items()):
        exists = (ROOT / ref).exists()
        if not exists:
            missing_media.append(ref)
        media_rows.append({"path": ref, "exists": exists, "used_by_count": len(used_by), "sample_used_by": "; ".join(used_by[:8])})
    finding("pass" if not missing_media else "fail", "media", "referenced media exists", "pass" if not missing_media else "fail", f"missing media: {len(missing_media)}")

    # Unit/difficulty/type balance.
    balance_rows: list[dict[str, Any]] = []
    for unit in [u.get("id") for u in units]:
        unit_cards = [card for card in cards if card.get("unit") == unit]
        levels = Counter(str(card.get("level", "")) for card in unit_cards)
        types = Counter(str(card.get("type", "")) for card in unit_cards)
        visual = sum(1 for card in unit_cards if card.get("media"))
        open_cards = sum(1 for card in unit_cards if not card.get("choices"))
        balance_rows.append({
            "unit": unit,
            "cards": len(unit_cards),
            "level_1": levels.get("1", 0),
            "level_2": levels.get("2", 0),
            "level_3": levels.get("3", 0),
            "visual_cards": visual,
            "open_answer_cards": open_cards,
            "types": "; ".join(f"{k}:{v}" for k, v in sorted(types.items())),
        })
        if not all(levels.get(str(level), 0) for level in (1, 2, 3)):
            finding("warn", "balance", f"{unit} difficulty spread", "warn", dict(levels).__repr__())
    finding("pass", "balance", "unit difficulty spread generated", "pass", f"units: {len(balance_rows)}")

    # App-flow static regression guards.
    flow_checks = [
        ("resume session position support", "sessionPositions" in app_text and "restoreSessionPosition" in app_text),
        ("MCQ answer shuffle support", "getDisplayChoices" in app_text and "choiceOrder" in app_text),
        ("revisit note removed", "stays in Revisit" not in app_text and "remains in the Revisit queue" not in app_text),
        ("duplicate finishTest call removed", "finishTest();\n      finishTest();" not in app_text),
        ("question captions hidden", "showCaptions: false" in app_text),
        ("missed test cards move to revisit", "revisit.add(card.id)" in app_text and "mastered.delete(card.id)" in app_text),
    ]
    for name, ok in flow_checks:
        finding("pass" if ok else "fail", "app-flow", name, "pass" if ok else "fail")

    # Write detailed outputs.
    write_csv(DOCS / f"release_readiness_findings_v{VERSION.replace('.', '_')}.csv", findings, ["severity", "area", "check", "result", "detail"])
    write_csv(DOCS / f"release_readiness_unit_balance_v{VERSION.replace('.', '_')}.csv", balance_rows, ["unit", "cards", "level_1", "level_2", "level_3", "visual_cards", "open_answer_cards", "types"])
    write_csv(DOCS / f"release_readiness_media_refs_v{VERSION.replace('.', '_')}.csv", media_rows, ["path", "exists", "used_by_count", "sample_used_by"])
    write_csv(DOCS / f"release_readiness_answer_leakage_flags_v{VERSION.replace('.', '_')}.csv", leakage_flags, ["card_id", "issue", "answer"])

    fail_count = sum(1 for row in findings if row["severity"] == "fail")
    warn_count = sum(1 for row in findings if row["severity"] == "warn")
    pass_count = sum(1 for row in findings if row["severity"] == "pass")
    report = f"""# v{VERSION} readiness QA report

## Summary

- Content version: `{content.get('version')}`
- Notes version: `{notes_bundle.get('version')}`
- Cards: **{len(cards)}**
- Class notes: **{len(notes)}**
- Learning objectives: **{len(objectives)}**
- Referenced media assets: **{len(media_rows)}**
- Missing referenced media: **{len(missing_media)}**
- Findings: **{pass_count} pass**, **{warn_count} warn**, **{fail_count} fail**

## Readiness judgement

The app is ready for a student trial when all `fail` checks remain at zero. Warnings are content-quality follow-up items rather than blockers.

## App-flow checks

- Resume-session support: {'pass' if flow_checks[0][1] else 'fail'}
- Multiple-choice shuffle support: {'pass' if flow_checks[1][1] else 'fail'}
- Revisit micro-note removed: {'pass' if flow_checks[2][1] else 'fail'}
- Duplicate `finishTest()` call removed: {'pass' if flow_checks[3][1] else 'fail'}
- Question media captions hidden: {'pass' if flow_checks[4][1] else 'fail'}
- Missed test cards move to Revisit: {'pass' if flow_checks[5][1] else 'fail'}

## Unit balance snapshot

| Unit | Cards | L1 | L2 | L3 | Visual | Open answer |
|---|---:|---:|---:|---:|---:|---:|
"""
    for row in balance_rows:
        report += f"| {row['unit']} | {row['cards']} | {row['level_1']} | {row['level_2']} | {row['level_3']} | {row['visual_cards']} | {row['open_answer_cards']} |\n"
    report += f"""
## Files generated

- `docs/release_readiness_findings_v{VERSION.replace('.', '_')}.csv`
- `docs/release_readiness_unit_balance_v{VERSION.replace('.', '_')}.csv`
- `docs/release_readiness_media_refs_v{VERSION.replace('.', '_')}.csv`
- `docs/release_readiness_answer_leakage_flags_v{VERSION.replace('.', '_')}.csv`

## Recommendation

Proceed to student trial when all fail checks remain at zero. The next pass should be based on actual student usage.
"""
    (DOCS / f"release_readiness_report_v{VERSION.replace('.', '_')}.md").write_text(report, encoding="utf-8")

    print(report)
    return 1 if fail_count else 0


if __name__ == "__main__":
    raise SystemExit(main())
