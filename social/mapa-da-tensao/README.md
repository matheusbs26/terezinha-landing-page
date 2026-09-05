# O mapa da tensão

Carrossel de Instagram (4 pranchas, 1080 × 1350) para o perfil da Terezinha.

- `prancha-1.png` … `prancha-4.png` — carrossel, 1080 × 1350.
- `story.png` — story vertical, 1080 × 1920, com as zonas de segurança respeitadas.
- `*@2x.png` — o dobro da resolução, costumam sobreviver melhor à compressão do app.
- `legenda.md` — legenda, textos alternativos e ordem de publicação.
- `filosofia-cartografia-silenciosa.md` — a direção visual por trás das pranchas.

## Regerar as artes

As pranchas são desenhadas por código: o corpo é um campo escalar (distância à
silhueta somada a picos de tensão) e as linhas são as curvas de nível desse
campo, extraídas por *marching squares*. Mudar um ponto de tensão em `HOT`
redesenha o mapa inteiro, mantendo a equidistância entre as curvas.

```
cd gerador
./fontes.sh                 # baixa Fraunces e Work Sans (OFL)
DPR=1 node render.js        # gera out/prancha-N.png em 1080x1350
DPR=2 SUFFIX="@2x" node render.js
DPR=1 node story.js         # gera out/story.png em 1080x1920
DPR=2 SUFFIX="@2x" node story.js
```

Precisa do Playwright com Chromium disponível. As fontes e a pasta `out/` não
são versionadas.

A paleta e a tipografia são as mesmas de `assets/css/style.css`, para o
carrossel ficar coerente com o site.
