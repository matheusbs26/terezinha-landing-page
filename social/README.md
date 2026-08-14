# Social

Peças de redes sociais da Terezinha. Cada post fica em uma pasta própria com os
arquivos prontos para publicar e a fonte usada para gerá-los.

```
social/instagram/<ano-mes-slug>/
  01-*.png … 04-*.png   # imagens prontas, 1080×1080
  legenda.md            # legenda, hashtags, texto alternativo e checklist
  filosofia-visual.md   # direção estética da peça
  src/slides.html       # fonte dos slides (mesma paleta e fontes do site)
  src/render.sh         # regera os PNGs a partir do HTML
```

## Regerando as imagens

Entre na pasta do post e rode:

```
./src/render.sh
```

O script usa o Chromium (o do Playwright, se existir; senão o do sistema, ou o
caminho em `CHROME=`) para fotografar cada slide em 1080×1080 e recorta o
resultado com o Pillow (`pip install pillow`).

As fontes (Fraunces e Work Sans, as mesmas do site) ficam em `src/fonts/` para a
renderização não depender da rede.
