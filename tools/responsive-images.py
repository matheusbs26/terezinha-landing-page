#!/usr/bin/env python3
"""
Gera as versões menores (WebP) das fotos do site, usadas no srcset.

As fotos originais têm 1350 px de largura, mas no celular o hero ocupa só a
largura da tela (~400 px CSS, ~800 px físicos). Servir a original fazia o
celular baixar o dobro do necessário justamente na imagem do LCP.

Rode quando trocar ou adicionar uma foto em assets/img/ (precisa do Pillow):

    python tools/responsive-images.py
    node tools/build.js

O build.js detecta sozinho os arquivos <nome>-<largura>w.webp ao lado do
original e monta o srcset; sem eles, a página continua usando só a original.
Fotos já convertidas não são refeitas, a não ser que o original seja mais novo.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"

# Larguras geradas por foto. A original (1350 px) continua no srcset como a
# maior opção, então o desktop segue recebendo a mesma imagem de antes.
PHOTO_WIDTHS = (480, 800, 1080)
PHOTOS = [
    "massage-1", "massage-2", "massage-3", "massage-4", "massage-5",
    "portrait-about", "portrait-laugh3", "portrait-smile",
]

# O logo aparece com 46 px (cabeçalho) e 64 px (rodapé) de altura: a metade
# do arquivo original (368 px) já cobre telas de densidade 3x.
LOGO_WIDTHS = (184,)

QUALITY = 80


def generate(name, widths):
    source = IMG / f"{name}.webp"
    with Image.open(source) as im:
        for width in widths:
            if width >= im.width:
                continue
            target = IMG / f"{name}-{width}w.webp"
            if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
                continue
            height = round(im.height * width / im.width)
            im.resize((width, height), Image.LANCZOS).save(
                target, "WEBP", quality=QUALITY, method=6
            )
            print(f"{target.relative_to(ROOT)}  {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    for photo in PHOTOS:
        generate(photo, PHOTO_WIDTHS)
    generate("logo-mark", LOGO_WIDTHS)
