#!/usr/bin/env bash
# Renderiza as camadas de cada cena do Reels (1080x1920):
#   quadros/cena-N-fundo.png   → imagem, opaca
#   quadros/cena-N-texto.png   → tipografia, com fundo transparente
#
# Rode a partir da pasta do post; depois use src/montar.py para gerar o vídeo.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="$PWD/src/cenas.html"
OUT="$PWD/quadros"
mkdir -p "$OUT"

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

CENAS="${CENAS:-8}"

for i in $(seq 1 "$CENAS"); do
  for camada in fundo texto; do
    out="$OUT/cena-$i-$camada.png"
    extra=()
    # O PNG do texto precisa sair com canal alpha.
    [ "$camada" = "texto" ] && extra+=(--default-background-color=00000000)

    "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
      --allow-file-access-from-files \
      --force-device-scale-factor=1 \
      --window-size=1080,2120 \
      --virtual-time-budget=4000 \
      "${extra[@]}" \
      --screenshot="$out" \
      "file://$SRC?cena=$i&camada=$camada" >/dev/null 2>&1

    python3 - "$out" <<'PY'
import sys
from PIL import Image
p = sys.argv[1]
im = Image.open(p)
if im.size != (1080, 1920):
    im = im.crop((0, 0, 1080, 1920))
    im.save(p)          # mantém o modo original (RGBA no texto)
PY
  done
  echo "→ cena $i"
done
