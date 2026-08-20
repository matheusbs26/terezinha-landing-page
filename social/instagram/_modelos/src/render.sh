#!/usr/bin/env bash
# Gera as prévias 1080x1350 de cada modelo a partir de modelos.html.
#
#   ./src/render.sh            # usa o Chromium do Playwright, se existir
#   CHROME=/usr/bin/chromium ./src/render.sh
#
# Rode a partir de social/instagram/_modelos/.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="$PWD/src/modelos.html"

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

names=(m01-capa m02-so-texto m03-palavra-vertical m04-foto-texto m05-card-cta \
       m06-painel-verde m07-mosaico m08-dois-cards m09-foto-cheia \
       m10-chamada-final m11-fechamento m12-depoimento m13-lista-numerada \
       m14-capa-moldura m15-marca-dagua)

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
