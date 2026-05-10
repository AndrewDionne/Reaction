#!/usr/bin/env bash
set -eo pipefail

# cleanup_assets.sh
# Removes superseded / bad Year 9 Science asset files after the v1.32.0 asset replacement work.
#
# Safe behaviour:
# - Default is DRY RUN. Nothing is deleted unless you pass --apply.
# - The script refuses to delete any file that is still referenced by app/data/style/html files.
# - A backup tarball is created before deletion when --apply is used.
#
# Usage from repo root:
#   bash tools/cleanup_assets.sh
#   bash tools/cleanup_assets.sh --apply
#
# Usage if stored outside repo:
#   bash cleanup_assets.sh --root /path/to/repo --apply

DRY_RUN=1
ROOT="$(pwd)"
BACKUP=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      DRY_RUN=0
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --root)
      ROOT="${2:-}"
      shift 2
      ;;
    --no-backup)
      BACKUP=0
      shift
      ;;
    -h|--help)
      sed -n '1,32p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

cd "$ROOT"

if [[ ! -d assets ]]; then
  echo "ERROR: assets/ directory not found. Run this from the repo root or pass --root." >&2
  exit 1
fi

# Require content files so the reference-safety check is meaningful.
if [[ ! -f app.js || ! -d data ]]; then
  echo "ERROR: app.js or data/ not found. Refusing to run cleanup without app/data reference files." >&2
  echo "Run this from the full repo root after applying the latest patch." >&2
  exit 1
fi

# Files scanned for asset references. Add more if future refs move elsewhere.
# macOS ships Bash 3.2, which does not have mapfile/readarray.
# Use a Bash-3-compatible read loop instead.
REF_FILES=()
while IFS= read -r ref_file; do
  [[ -n "$ref_file" ]] && REF_FILES+=("$ref_file")
done < <(
  find . \
    -path './.git' -prune -o \
    -path './node_modules' -prune -o \
    -type f \( \
      -name 'app.js' -o \
      -name 'index.html' -o \
      -name 'styles.css' -o \
      -path './data/*.js' \
    \) -print | sort
)

if [[ ${#REF_FILES[@]} -eq 0 ]]; then
  echo "ERROR: no reference files found. Refusing to run cleanup." >&2
  exit 1
fi

# Canonical bad/superseded asset list.
# These are files replaced by newer WEBP assets / app-layer labels, old broken SVGs,
# text-dense note graphics, old generated variants, or redundant brand experiments.
BAD_ASSETS=(
  # Redundant generic brand variants from early brand exploration.
  "assets/brand/reaction-brand-crystal.webp"
  "assets/brand/reaction-brand-dna.webp"
  "assets/brand/reaction-brand-magnet.webp"
  "assets/brand/reaction-brand-motion.webp"
  "assets/brand/reaction-brand-plant.webp"

  # Old text-dense note images / note SVGs superseded by clean WEBP + app-layer notes.
  "assets/diagrams/9B-food-production-methods-clean-note.svg"
  "assets/diagrams/9B-plant-transport-clean-note.svg"
  "assets/diagrams/9J-electromagnet-relay-motor-clean-note.svg"
  "assets/webp/9B-food-production-methods.webp"
  "assets/webp/9B-plant-transport-root-xylem-phloem.webp"
  "assets/webp/9J-electromagnets-relays-motor-effect-sequence.webp"

  # Illustrative/source-style SVGs superseded by image assets.
  "assets/diagrams/9A-prey-adaptation-source-style-question.svg"
  "assets/diagrams/9A-prey-adaptation-source-style.svg"
  "assets/diagrams/9A-triceratops-adaptations-source-style.svg"
  "assets/diagrams/9B-photosynthesis-plant.svg"
  "assets/diagrams/9B-root-hair-source-style.svg"
  "assets/diagrams/9I-falling-forces.svg"
  "assets/diagrams/9I-sankey-efficiency.svg"
  "assets/diagrams/9F-blast-furnace-question.svg"

  # Superseded reveal/note SVGs now replaced by app-layer text + WEBP assets.
  "assets/diagrams/9B-carbon-cycle-source-style.svg"
  "assets/diagrams/9B-food-web.svg"
  "assets/diagrams/9B-leaf-xylem-phloem.svg"
  "assets/diagrams/9B-photosynthesis-source-style-QRS-question.svg"
  "assets/diagrams/9B-photosynthesis-source-style-QRS.svg"
  "assets/diagrams/9B-root-hair-cell.svg"
  "assets/diagrams/9E-brittle-lattice.svg"
  "assets/diagrams/9E-vulcanisation-crosslinks-source-style-question.svg"
  "assets/diagrams/9E-vulcanisation-crosslinks-source-style.svg"
  "assets/diagrams/9F-displacement-reaction.svg"
  "assets/diagrams/9F-electrolysis-carbon-question.svg"
  "assets/diagrams/9F-extraction-method-question.svg"
  "assets/diagrams/9F-reactivity-extraction.svg"
  "assets/diagrams/9F-reactivity-series-question.svg"
  "assets/diagrams/9I-falling-forces-source-style-XY-question.svg"
  "assets/diagrams/9I-falling-forces-source-style-XY.svg"
  "assets/diagrams/9I-lever-XYZ-source-style.svg"
  "assets/diagrams/9I-lever-advantage.svg"
  "assets/diagrams/9I-rock-lever-options-source-style.svg"
  "assets/diagrams/9I-sankey-efficiency-question.svg"
  "assets/diagrams/9J-circuit-symbols-reveal.svg"
  "assets/diagrams/9J-electromagnet.svg"
  "assets/diagrams/9J-motor-effect.svg"
  "assets/diagrams/9J-relay-question.svg"
  "assets/diagrams/9J-relay.svg"
  "assets/diagrams/9J-series-parallel-question.svg"
  "assets/diagrams/9J-series-parallel.svg"
  "assets/diagrams/9J-static-charges.svg"

  # Older WEBP variants superseded by newer selected v1.29-v1.32 assets.
  "assets/webp/9F-blast-furnace-base.webp"
  "assets/webp/9F-blast-furnace-process.webp"
  "assets/webp/9F-displacement-reaction-photo.webp"
  "assets/webp/9F-extraction-carbon-vs-electrolysis.webp"
  "assets/webp/9F-reactivity-series-ladder-simple.webp"
  "assets/webp/9I-forces-parachutist.webp"
  "assets/webp/9J-electromagnet-relay-motor.webp"
)

is_referenced() {
  local rel="$1"
  grep -R -F -q -- "$rel" "${REF_FILES[@]}"
}

TO_DELETE=()
SKIPPED_REFERENCED=()
MISSING=()

for rel in "${BAD_ASSETS[@]}"; do
  if [[ ! -e "$rel" ]]; then
    MISSING+=("$rel")
    continue
  fi
  if is_referenced "$rel"; then
    SKIPPED_REFERENCED+=("$rel")
    continue
  fi
  TO_DELETE+=("$rel")
done

print_array_or_none() {
  if [[ $# -eq 0 ]]; then
    echo "  (none)"
  else
    printf '  %s\n' "$@"
  fi
}

REPORT="asset_cleanup_report_v1_32_0.txt"
{
  echo "Year 9 asset cleanup report — v1.32.0"
  echo "Root: $(pwd)"
  echo "Mode: $([[ $DRY_RUN -eq 1 ]] && echo DRY_RUN || echo APPLY)"
  echo "Reference files scanned: ${#REF_FILES[@]}"
  print_array_or_none "${REF_FILES[@]}"
  echo
  echo "Delete candidates found and safe to remove: ${#TO_DELETE[@]}"
  print_array_or_none "${TO_DELETE[@]}"
  echo
  echo "Skipped because still referenced: ${#SKIPPED_REFERENCED[@]}"
  print_array_or_none "${SKIPPED_REFERENCED[@]}"
  echo
  echo "Candidates not present: ${#MISSING[@]}"
  print_array_or_none "${MISSING[@]}"
} > "$REPORT"

cat "$REPORT"

if [[ ${#SKIPPED_REFERENCED[@]} -gt 0 ]]; then
  echo
  echo "NOTE: Some bad/superseded candidates are still referenced and were not deleted."
  echo "Review these before removing them from content wiring."
fi

if [[ ${#TO_DELETE[@]} -eq 0 ]]; then
  echo
  echo "No safe deletion candidates found."
  exit 0
fi

if [[ $DRY_RUN -eq 1 ]]; then
  echo
  echo "Dry run only. Re-run with --apply to delete the safe candidates."
  exit 0
fi

if [[ $BACKUP -eq 1 ]]; then
  BACKUP_FILE="asset_cleanup_backup_v1_32_0_$(date +%Y%m%d_%H%M%S).tar.gz"
  tar -czf "$BACKUP_FILE" "${TO_DELETE[@]}"
  echo
  echo "Backup written: $BACKUP_FILE"
fi

for rel in "${TO_DELETE[@]}"; do
  rm -f -- "$rel"
done

echo
printf 'Deleted %s files.\n' "${#TO_DELETE[@]}"
echo "Report written: $REPORT"
