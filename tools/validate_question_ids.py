#!/usr/bin/env python3
"""Validate short QC identifiers in data/year9-content.js.

Expected format:
  9A-MCQ-01
  9A-WE-01
  9J-CALC-03
  9E-VOC-08
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_PATH = ROOT / "data" / "year9-content.js"
QID_RE = re.compile(r"^9[A-Z]-(MCQ|WE|CALC|VOC)-\d{2,3}$")


def load_content() -> dict:
    raw = CONTENT_PATH.read_text(encoding="utf-8").strip()
    raw = re.sub(r"^\s*window\.YEAR9_CONTENT\s*=\s*", "", raw)
    if raw.endswith(";"):
        raw = raw[:-1]
    return json.loads(raw)


def expected_type(card: dict) -> str:
    if card.get("choices"):
        return "MCQ"
    card_type = str(card.get("type", ""))
    if card_type == "Vocabulary":
        return "VOC"
    if "Calculation" in card_type or card.get("examCommand") == "calculate":
        return "CALC"
    return "WE"


def main() -> int:
    content = load_content()
    cards = content.get("cards", [])
    errors: list[str] = []
    qids: list[str] = []

    for index, card in enumerate(cards, start=1):
        qid = str(card.get("qid", "")).strip()
        legacy_id = card.get("id", f"card-{index}")
        unit = str(card.get("unit", "")).upper()
        if not qid:
            errors.append(f"{legacy_id}: missing qid")
            continue
        qids.append(qid)
        if not QID_RE.match(qid):
            errors.append(f"{legacy_id}: invalid qid format {qid!r}")
        if not qid.startswith(f"{unit}-"):
            errors.append(f"{legacy_id}: qid {qid!r} does not match unit {unit!r}")
        expected = expected_type(card)
        parts = qid.split("-")
        actual = parts[1] if len(parts) >= 3 else ""
        if actual != expected:
            errors.append(f"{legacy_id}: qid type {actual!r} should be {expected!r}")

    duplicates = [qid for qid, count in Counter(qids).items() if count > 1]
    for qid in duplicates:
        errors.append(f"duplicate qid: {qid}")

    # Check sequence continuity within each unit/type bucket.
    buckets: dict[tuple[str, str], list[int]] = defaultdict(list)
    for qid in qids:
        parts = qid.split("-")
        if len(parts) != 3:
            continue
        try:
            buckets[(parts[0], parts[1])].append(int(parts[2]))
        except ValueError:
            continue

    for (unit, qtype), numbers in sorted(buckets.items()):
        expected_numbers = list(range(1, max(numbers) + 1))
        if sorted(numbers) != expected_numbers:
            errors.append(f"{unit}-{qtype}: numbering is not continuous")

    if errors:
        print("Question ID validation failed:")
        for error in errors:
            print(f" - {error}")
        return 1

    print(f"Question ID validation passed for {len(cards)} cards.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
