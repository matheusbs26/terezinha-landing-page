#!/usr/bin/env bash
# Baixa as fontes da marca (Fraunces e Work Sans, licença OFL) ao lado do gerador.
set -e
cd "$(dirname "$0")"
for w in 400 500 600 700; do
  url=$(curl -sS -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,${w}&display=swap" | grep -oE 'https://fonts.gstatic.com[^)]+' | head -1)
  curl -sSL -o "Fraunces-${w}.ttf" "$url"
done
url=$(curl -sS -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&display=swap" | grep -oE 'https://fonts.gstatic.com[^)]+' | head -1)
curl -sSL -o "Fraunces-italic.ttf" "$url"
for w in 300 400 500 600; do
  url=$(curl -sS -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Work+Sans:wght@${w}&display=swap" | grep -oE 'https://fonts.gstatic.com[^)]+' | head -1)
  curl -sSL -o "WorkSans-${w}.ttf" "$url"
done
