"""Validate and summarize the static Year 9 content bank.

The app is static and reads data/year9-content.js directly. This tool does not
rebuild content; it checks that the content file is valid and prints useful
counts for audit purposes.
"""
import json
import re
from collections import Counter
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
content_path = repo / "data" / "year9-content.js"
raw = content_path.read_text(encoding="utf-8")
match = re.match(r"\s*window\.YEAR9_CONTENT\s*=\s*(.*);\s*$", raw, re.S)
if not match:
    raise SystemExit("Could not parse data/year9-content.js")
content = json.loads(match.group(1))
cards = content.get("cards", [])
required = {"id", "unit", "type", "question", "answer", "choices", "source", "level"}
ids = [card.get("id") for card in cards]
missing = [(card.get("id", "<no id>"), sorted(required - set(card))) for card in cards if required - set(card)]
duplicates = [item for item, count in Counter(ids).items() if count > 1]
print(f"Version: {content.get('version')}")
print(f"Total cards: {len(cards)}")
print("By unit:", dict(sorted(Counter(card.get("unit") for card in cards).items())))
print("By type:", dict(sorted(Counter(card.get("type") for card in cards).items())))
print("By level:", dict(sorted(Counter(card.get("level") for card in cards).items())))
if missing:
    print("Cards missing required keys:")
    for card_id, keys in missing:
        print(f"  {card_id}: {keys}")
if duplicates:
    print("Duplicate IDs:")
    for card_id in duplicates:
        print(f"  {card_id}")
if missing or duplicates:
    raise SystemExit(1)
print("Content file looks valid.")
