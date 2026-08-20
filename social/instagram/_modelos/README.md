# Modelos de slide

Biblioteca de layouts para os carrosséis do feed (1080×1350). Serve de apoio na
hora de montar um post novo: escolha os modelos que contam a história, copie os
blocos para o `src/slides.html` do post e troque só os textos e as fotos.

As prévias `m01…m15.png` mostram cada layout com texto de exemplo. O canto
superior esquerdo traz o código do modelo (`M03 · palavra vertical`) — esse
rótulo é só da prévia, some quando o bloco é copiado para um post (a linha
`<span class="code">…</span>`).

## Catálogo

| Modelo | Layout | Quando usar |
| --- | --- | --- |
| **M01** | Capa com foto dissolvida ao lado do título | Abertura de qualquer carrossel |
| **M02** | Só texto, com o monograma no topo | Miolo do carrossel, quando o texto manda sozinho |
| **M03** | Palavra gigante de pé na borda | Transição entre dois assuntos; nome da técnica |
| **M04** | Foto na metade de cima, texto embaixo | Explicar uma técnica passo a passo |
| **M05** | Card arredondado com botão de chamada | Informação prática + para onde ir |
| **M06** | Painel verde-oliva com foto ao lado | Abrir um tema, destacar um dado ou uma fala |
| **M07** | Três fotos em coluna ao lado do título | Etapas, ambientes, variações de uma técnica |
| **M08** | Dois cards claros sobre fundo verde | Comparar dois cenários (antes/depois, mito/verdade) |
| **M09** | Foto ocupando tudo, texto em duas colunas | Slide de respiro com bastante ar |
| **M10** | Chamada final com WhatsApp e endereço | Último slide, sempre |
| **M11** | Fechamento "gostou do conteúdo?" | Pedido de salvar/marcar, antes do CTA |
| **M12** | Depoimento com nota do Google | Prova social |
| **M13** | Lista numerada com círculos | Dicas, cuidados, passos — até cinco itens |
| **M14** | Capa com foto dentro de moldura girada | Capa alternativa, mais editorial |
| **M15** | Monograma grande em marca d'água | Respiro no meio de um carrossel longo |

## Como montar um post novo

1. Duplique a pasta de um post existente:
   `cp -r 2026-08-chegue-com-dor 2026-09-meu-post` (ou copie só `src/`).
2. Abra `src/slides.html` e substitua os `<section class="slide">` pelos modelos
   deste arquivo — os estilos comuns (`.head`, `.footrule`, `h2`, `p.body`,
   `.photo`) já vêm juntos.
3. Ajuste os nomes dos arquivos em `src/render.sh` e rode `./src/render.sh`.
4. Escreva a `legenda.md` (legenda, hashtags, texto alternativo, checklist).

## Sistema visual

- **Fundo:** greige `#ddd7cd`; variação clara `#efede8` para peças mais arejadas.
- **Verde-oliva:** `#475438` (títulos e painéis), `#69745b` para apoios.
- **Texto:** `#1d1d1b`, sempre Poppins Light.
- **Títulos:** Italiana, entrelinha fechada (0,96).
- **Assinatura:** `@mtekaramos` à esquerda, filete, tema à direita.
- **Fotos:** entram em `multiply` com máscara em degradê, para a parede clara do
  consultório se dissolver no fundo — exceto nos mosaicos (M07), em que a foto é
  um bloco recortado.
- **Ornamentos:** ramo a uma linha, arcos concêntricos e a estrela de quatro
  pontas, todos desenhados em SVG dentro do próprio HTML.

## Regerando as prévias

```
./src/render.sh
```

Ver `social/README.md` para os requisitos (Chromium + Pillow).

---

**Nota:** estes modelos foram remontados a partir dos carrosséis de referência
enviados pelo Matheus, adaptados à paleta e à tipografia da Terezinha. Os
arquivos originais não estão versionados aqui — se quiser guardá-los, é só
soltar os PNGs em `_modelos/referencias/`.
