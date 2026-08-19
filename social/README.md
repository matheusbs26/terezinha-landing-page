# Social

Peças de redes sociais da Terezinha. Cada post fica em uma pasta própria com os
arquivos prontos para publicar e a fonte usada para gerá-los.

```
social/instagram/<ano-mes-slug>/
  01-*.png …            # imagens prontas: 1080×1350 (feed 4:5)
                        # ou 1080×1920 (stories 9:16)
  legenda.md            # legenda, hashtags, texto alternativo e checklist
  roteiro.md            # nos stories e no reels: textos, tempos e publicação
  filosofia-visual.md   # direção estética da peça
  src/slides.html       # fonte dos slides (paleta e tipografia da peça)
  src/render.sh         # regera os PNGs a partir do HTML
```

Posts existentes:

- `2026-08-chegue-com-dor/` — carrossel do feed, 7 imagens 4:5
- `2026-08-stories-duvidas/` — stories de perguntas frequentes, 8 imagens 9:16
- `2026-08-reels-chegue-com-dor/` — reels de 42 s com locução, 1080×1920
- `2026-08-reels-pos-operatorio/` — reels de 28 s sobre drenagem pós-operatória (mudo)
- `2026-08-reflexologia-podal/` — carrossel do feed, 7 imagens 4:5, "Faz cócegas?"

Antes de montar um post novo, veja `instagram/_modelos/` — a biblioteca de
layouts prontos (15 modelos) com o catálogo de quando usar cada um.

## Regerando as imagens

Entre na pasta do post e rode:

```
./src/render.sh
```

O script usa o Chromium (o do Playwright, se existir; senão o do sistema, ou o
caminho em `CHROME=`) para fotografar cada slide no tamanho da peça e recorta o
resultado com o Pillow (`pip install pillow`).

As fontes usadas ficam em `src/fonts/` para a renderização não depender da rede.

## Reels

O post de reels tem uma etapa a mais: `./src/render.sh` gera duas camadas por
cena (a foto e o texto em PNG transparente) e `python3 src/montar.py` monta o mp4
com ffmpeg — movimento de zoom na imagem, texto em fade e crossfade entre cenas.
Precisa de um ffmpeg com libx264: `pip install imageio-ffmpeg` resolve.
