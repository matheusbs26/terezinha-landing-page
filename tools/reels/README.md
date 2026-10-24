# Reel — Terezinha Ramos

Gerador do vídeo vertical de divulgação (Instagram Reels / Stories / TikTok).

**Saída:** `assets/video/reel-terezinha.mp4` — 1080×1920, 27,4s, 30 fps, H.264 + faixa
de áudio muda, ~5,9 MB. Junto sai `assets/video/reel-terezinha-capa.jpg`, para usar
como capa do Reels.

## Como funciona

`reel.html` é a cena inteira em HTML/CSS. Não há CSS animation nem
`requestAnimationFrame`: tudo é desenhado por `window.__seek(t)`, que recebe o tempo
em segundos e posiciona cada elemento. `render.mjs` abre a página no Chromium
(Playwright), chama `__seek` uma vez por quadro, tira um screenshot e joga o fluxo
direto no ffmpeg.

O motivo dessa volta é reprodutibilidade: gravando a tela, o resultado depende da
velocidade da máquina e sai com quadros repetidos ou perdidos. Assim o mesmo comando
gera sempre exatamente o mesmo vídeo.

## Rodar

```bash
# dependências: playwright (com chromium) e ffmpeg com libx264
npm i -D playwright && npx playwright install chromium

node tools/reels/render.mjs                      # vídeo completo + capa
node tools/reels/render.mjs --frame 3.4          # um PNG só, para conferir
node tools/reels/render.mjs --frame 4.4,9.3,13.4 # vários quadros de uma vez
node tools/reels/render.mjs --ffmpeg /caminho/do/ffmpeg
```

Opções: `--fps`, `--crf` (padrão 19, menor = mais qualidade e arquivo maior),
`--cover` (segundo usado na capa), `--outdir`, `--name`.

Para ver a cena parada no navegador, sirva a raiz do projeto
(`npx http-server .`) e abra `/tools/reels/reel.html` — ela carrega no tempo 0.
No console dá para navegar com `__seek(12.5)`.

## Mudar o conteúdo

- **Textos:** direto no HTML, cada bloco tem `data-el`.
- **Fotos:** as tags `<img>` apontam para `assets/img/`. Trocar o arquivo já muda a cena.
- **Tempos:** o array `SCENES` no `<script>` define início e fim de cada cena; dentro de
  cada função (`hook`, `pain`, `who`, `serv`, `proof`, `cta`) os `seg(rel, início, duração)`
  controlam cada elemento.
- **Cores e fontes:** as variáveis no `:root` são as mesmas de `assets/css/style.css`.
  As fontes (Fraunces e Work Sans) estão em `fonts/` para o render não depender de internet.

Depois de qualquer mudança, rode o render de novo — o MP4 versionado não se atualiza sozinho.

## Roteiro (27,4s)

| Tempo | Cena | O que aparece |
|---|---|---|
| 0,0–4,4 | Gancho | Foto de atendimento, "Chegue com dor. / Saia mais leve." |
| 4,4–9,3 | Dor | Dor no pescoço · Tensão nos ombros · Noites mal dormidas → "Isso tem tratamento." |
| 9,3–13,4 | Quem | Retrato, nome, bairro e selos |
| 13,4–18,1 | Serviços | As 9 técnicas em chips |
| 18,1–22,3 | Prova | 5,0 no Google, 28 avaliações e depoimento do Sidnei Schneider |
| 22,3–27,4 | Chamada | Marca, WhatsApp, telefone, endereço e site |

## Ao publicar

- **Áudio:** o MP4 sai com faixa muda de propósito. Colocar uma trilha da biblioteca do
  Instagram na hora de postar rende mais alcance do que subir música embutida — e evita
  problema de direito autoral.
- **Capa:** usar `reel-terezinha-capa.jpg` (o quadro dos 3,4s).
- **Área segura:** a interface do Instagram cobre o rodapé e a lateral direita. Todo o
  texto foi mantido entre ~y=200 e ~y=1480 por causa disso; se mexer no layout, respeite.
- **Legenda sugerida:**

  > Chegue com dor. Saia mais leve.
  >
  > Massoterapia feita com calma, no seu ritmo e do jeito que o seu corpo pede — dor no
  > pescoço, tensão nos ombros, noite mal dormida.
  >
  > Relaxante, terapêutica, drenagem linfática, pós-operatória, modeladora, reflexologia
  > podal, pedras quentes, ventosaterapia e reiki.
  >
  > 5,0 no Google · Menino Deus, Porto Alegre
  > Agende pelo WhatsApp: (51) 98958-2730
  >
  > #massoterapia #portoalegre #meninodeus #massagemportoalegre #drenagemlinfatica
  > #massagemrelaxante #dornascostas #bemestar #poa
