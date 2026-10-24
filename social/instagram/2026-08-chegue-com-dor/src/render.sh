#!/usr/bin/env bash
# Gera os PNGs 1080x1350 (4:5) do carrossel a partir de slides.html.
#
#   ./src/render.sh            # usa o Chromium do Playwright, se existir
#   CHROME=/usr/bin/chromium ./src/render.sh
#
# Rode a partir da pasta do post (social/instagram/<post>/).
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="$PWD/src/slides.html"

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

names=(01-capa 02-dores 03-estresse 04-circulacao 05-tecnicas 06-avaliacoes 07-agende)

# A janela é pedida mais alta que o slide porque o headless reserva alguns
# pixels da moldura do navegador; o excesso é cortado depois (Pillow).
for i in $(seq 1 ${#names[@]}); do
  out="$PWD/${names[$((i-1))]}.png"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --allow-file-access-from-files \
    --force-device-scale-factor=1 \
    --window-size=1080,1550 \
    --virtual-time-budget=4000 \
    --screenshot="$out" \
    "file://$SRC?slide=$i" >/dev/null 2>&1

  python3 - "$out" <<'PY'
import sys
from PIL import Image
p = sys.argv[1]
im = Image.open(p)
if im.size != (1080, 1350):
    im.crop((0, 0, 1080, 1350)).convert("RGB").save(p, optimize=True)
PY
  echo "→ ${names[$((i-1))]}.png"
done
