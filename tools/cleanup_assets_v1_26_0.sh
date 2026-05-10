#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
TARGETS=(
  "assets/brand/reaction-brand-crystal.webp"
  "assets/brand/reaction-brand-dna.webp"
  "assets/brand/reaction-brand-magnet.webp"
  "assets/brand/reaction-brand-motion.webp"
  "assets/brand/reaction-brand-plant.webp"
  "assets/webp/9B-food-production-methods.webp"
  "assets/webp/9B-plant-transport-root-xylem-phloem.webp"
  "assets/webp/9J-electromagnets-relays-motor-effect-sequence.webp"
)
for f in "${TARGETS[@]}"; do
  if [[ -f "$f" ]]; then
    rm "$f"
    echo "removed $f"
  else
    echo "already absent $f"
  fi
done
