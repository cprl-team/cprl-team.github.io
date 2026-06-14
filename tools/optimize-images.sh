#!/usr/bin/env bash
# ==========================================================
#  optimize-images.sh — shrink the CPR site's heavy assets
# ----------------------------------------------------------
#  Run LOCALLY (the CI/sandbox has no image tooling). It:
#    1. Optimizes the 5 research PNGs in place (pngquant),
#       backing up originals to images/_original/ — this is a
#       drop-in win that needs NO HTML/CSS/JS changes.
#    2. Emits WebP variants (images/*.webp) for optional
#       <picture> adoption later (ask Claude to wire it up
#       once the .webp files exist — do NOT reference .webp
#       in markup before they exist, or browsers 404).
#    3. Optionally regenerates a smaller favicon + a 1200x630
#       og:image from banner.jpg if tools are present.
#
#  Tools used if available: pngquant, cwebp, ImageMagick
#  (magick/convert). Each step is skipped with a note if its
#  tool is missing. Safe to re-run (idempotent).
#
#  Install (macOS):  brew install pngquant webp imagemagick
#  Install (Debian): sudo apt-get install pngquant webp imagemagick
# ==========================================================
set -euo pipefail

cd "$(dirname "$0")/.."   # repo root
IMG_DIR="images"
BACKUP_DIR="$IMG_DIR/_original"
RESEARCH_PNGS=(causal_video causal_document causal_healthcare physics_causal neuro_symbolic)

# Display/source target: cards render ~16:10 in a half-width column,
# so ~1200px wide @2x is plenty. Square sources are cropped by CSS.
MAX_W=1200
WEBP_Q=80

have() { command -v "$1" >/dev/null 2>&1; }
note() { printf '  \033[33m- %s\033[0m\n' "$1"; }
ok()   { printf '  \033[32m✓ %s\033[0m\n' "$1"; }

echo "▸ CPR image optimization"
mkdir -p "$BACKUP_DIR"

# ---- 1 & 2: research illustrations -----------------------
for name in "${RESEARCH_PNGS[@]}"; do
  src="$IMG_DIR/$name.png"
  [ -f "$src" ] || { note "missing $src — skipped"; continue; }
  before=$(du -h "$src" | cut -f1)

  # back up the pristine original once
  [ -f "$BACKUP_DIR/$name.png" ] || cp "$src" "$BACKUP_DIR/$name.png"

  # (a) lossy palette PNG, in place — no markup change needed
  if have pngquant; then
    pngquant --force --quality=65-85 --strip --output "$src" -- "$BACKUP_DIR/$name.png" \
      && ok "pngquant $name.png  ($before → $(du -h "$src" | cut -f1))" \
      || note "pngquant failed for $name.png"
  else
    note "pngquant not found — PNG left as-is"
  fi

  # (b) WebP variant for future <picture>
  if have cwebp; then
    cwebp -quiet -q "$WEBP_Q" -resize "$MAX_W" 0 "$BACKUP_DIR/$name.png" -o "$IMG_DIR/$name.webp" \
      && ok "webp $name.webp  ($(du -h "$IMG_DIR/$name.webp" | cut -f1))"
  elif have magick; then
    magick "$BACKUP_DIR/$name.png" -resize "${MAX_W}x" -quality "$WEBP_Q" "$IMG_DIR/$name.webp" \
      && ok "webp $name.webp (magick)"
  else
    note "cwebp/magick not found — no .webp for $name"
  fi
done

# ---- 3a: favicon (currently a 755x755 ~116KB JPEG-in-.ico) ----
if have magick || have convert; then
  CONV=$(have magick && echo magick || echo convert)
  if [ -f logo.png ]; then
    $CONV logo.png -background none -resize 64x64 -define icon:auto-resize=16,32,48 favicon.ico \
      && ok "favicon.ico rebuilt from logo.png ($(du -h favicon.ico | cut -f1))"
  fi
else
  note "ImageMagick not found — favicon left as-is"
fi

# ---- 3b: 1200x630 og:image from banner.jpg ----------------
if have magick || have convert; then
  CONV=$(have magick && echo magick || echo convert)
  if [ -f banner.jpg ]; then
    $CONV banner.jpg -resize 1200x630^ -gravity center -extent 1200x630 -quality 82 og-image.jpg \
      && ok "og-image.jpg generated (1200x630, $(du -h og-image.jpg | cut -f1))" \
      && note "then point og:image/twitter:image at og-image.jpg in each <head>"
  fi
fi

echo "▸ Done. Review changes with: git status && git diff --stat"
echo "  Commit the smaller PNGs for an immediate win. For .webp, ask Claude"
echo "  to switch renderResearch() to <picture> (only after .webp exist)."
