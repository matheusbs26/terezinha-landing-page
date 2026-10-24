#!/usr/bin/env bash
# Gera o PNG 1080x1350 (4:5) do post único a partir de slide.html.
#
#   ./src/render.sh            # usa o Chromium do Playwright, se existir
#   CHROME=/usr/bin/chromium ./src/render.sh
#
# Rode a partir da pasta do post (social/instagram/<post>/).
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="$PWD/src/slide.html"

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux/chrome \
           "$(command -v chromium || true)" \
           "$(command -v chromium-browser || true)" \
           "$(command -v google-chrome || true)"; do
    [ -x "${c:-}" ] && CHROME="$c" && break
  done
fi
[ -n "$CHROME" ] || { echo "Chromium não encontrado. Defina CHROME=/caminho/do/chrome" >&2; exit 1; }

out="$PWD/post.png"
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --allow-file-access-from-files \
  --force-device-scale-factor=1 \
  --window-size=1080,1550 \
  --virtual-time-budget=4000 \
  --screenshot="$out" \
  "file://$SRC" >/dev/null 2>&1

python3 - "$out" <<'PY'
import sys
from PIL import Image
p = sys.argv[1]
im = Image.open(p)
if im.size != (1080, 1350):
    im.crop((0, 0, 1080, 1350)).convert("RGB").save(p, optimize=True)
PY
echo "→ post.png"
