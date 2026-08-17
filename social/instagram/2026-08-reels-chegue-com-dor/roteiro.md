# Reels — "Chegue com dor. Saia mais leve."

**Arquivos:**
`reels.mp4` — 1080×1920, 23,7 s, 30 fps, H.264 (mudo)
`reels-com-trilha.mp4` — o mesmo vídeo com uma trilha ambiente sintetizada aqui

**Formato:** 9:16, dentro das zonas seguras do Reels (320 px livres no topo,
520 px no pé) — nada de texto some atrás do nome do perfil, da legenda ou dos
botões.

---

## Cenas

| # | Tempo | Imagem | Texto na tela |
| --- | --- | --- | --- |
| 1 | 0,0 – 3,4 s | Terezinha atendendo (aproxima) | MASSOTERAPIA · PORTO ALEGRE / **Chegue com dor.** |
| 2 | 3,0 – 6,0 s | mesma cena, outro enquadramento (afasta) | **Saia mais leve.** |
| 3 | 5,5 – 8,2 s | fundo greige | **O ombro que trava no fim da tarde.** |
| 4 | 7,8 – 10,5 s | fundo greige | **A lombar que reclama na hora de levantar.** |
| 5 | 10,0 – 13,8 s | atendimento nas costas | *A sessão começa com uma conversa:* como você chegou, o que dói, o que anda tirando seu sono. |
| 6 | 13,4 – 17,0 s | fundo greige | SÓ DEPOIS VEM A TÉCNICA / Relaxante · Terapêutica · Drenagem linfática · Pedras quentes · Ventosaterapia |
| 7 | 16,5 – 19,7 s | atendimento nas pernas | **5,0 ★★★★★** / 28 avaliações no Google e clientes que voltam desde 2009. |
| 8 | 19,3 – 23,7 s | Terezinha sorrindo | **Agende sua sessão** / WhatsApp (51) 98958-2730 · Menino Deus, Porto Alegre |

Os tempos se sobrepõem porque cada corte é um crossfade de 0,45 s.

---

## Locução (para a voz da Terezinha)

Texto cronometrado para caber nos 23 s, na primeira pessoa. Grave com ela ou
use o áudio de voz já clonado que está no Drive
(`Massoterapeuta Terezinha/Audios/`):

> (0–6 s) Tem dor que a gente vai empurrando com o dia.
>
> (6–10 s) O ombro que trava no fim da tarde. A lombar que reclama na hora de
> levantar.
>
> (10–14 s) Aqui, a sessão começa com uma conversa: como você chegou, o que dói,
> o que anda tirando seu sono.
>
> (14–17 s) Só depois eu escolho a técnica.
>
> (17–20 s) São vinte e oito avaliações no Google, todas cinco estrelas.
>
> (20–23 s) Chegue com dor. Saia mais leve. Me chama no WhatsApp.

Para montar o vídeo já com a locução:

```
python3 src/montar.py --narracao caminho/do/audio.wav
```

Isso gera `reels-com-voz.mp4` — a locução entra por cima e a trilha cai para 25 %.

---

## Legenda do post

Tem dor que a gente vai empurrando com o dia. O ombro que trava no fim da tarde,
a lombar que reclama na hora de levantar, o pescoço que virou pedra depois de uma
semana difícil.

Aqui, a sessão começa com uma conversa — e só depois vem a técnica: relaxante,
terapêutica, drenagem linfática, pós-operatória, modeladora, reflexologia podal,
pedras quentes, ventosaterapia ou reiki.

Atendimento individual, sem pressa, em um consultório reservado no Menino Deus.

Chegue com dor. Saia mais leve. 🤍

📍 R. José de Alencar, 658/306 — Menino Deus, Porto Alegre
📱 (51) 98958-2730 (link na bio)

.
.
.

#massagemportoalegre #massoterapia #massagempoa #massoterapiaportoalegre
#massagemrelaxante #massagemterapeutica #drenagemlinfatica #reflexologiapodal
#pedrasquentes #ventosaterapia #meninodeus #portoalegre #poa #dornascostas
#bemestar #autocuidado

**Capa do Reels:** use o quadro da cena 1 (`quadros/cena-1-fundo.png` com o texto
por cima) ou o `01-capa.png` do carrossel, para o feed ficar coerente.

---

## Sobre o áudio

O `reels.mp4` é mudo de propósito: colocar um áudio em alta pelo próprio
Instagram costuma render mais alcance do que subir o vídeo com trilha embutida.
O `reels-com-trilha.mp4` existe para quando isso não for possível — a trilha é um
acorde sintetizado pelo `src/montar.py`, sem direitos de terceiros.

---

## Refazendo o vídeo

```
./src/render.sh          # regera as camadas de cada cena em quadros/
python3 src/montar.py    # monta o mp4 (leva ~1 min)
```

Para mudar texto, foto ou tempo de cena: `src/cenas.html` (conteúdo) e a lista
`CENAS` em `src/montar.py` (duração e sentido do zoom).

---

## O que ficou de fora

- **A filmagem do Drive** (`Vídeo/WhatsApp Video 2026-08-13 …mp4`, 9,6 MB) não
  entrou: o conector do Drive devolve os arquivos como texto codificado dentro da
  conversa, e um vídeo desse tamanho não passa por esse caminho. Para usá-lo,
  baixe o arquivo e coloque em `quadros/` — dá para trocar as cenas de foto por
  trechos dele.
- **A clonagem de voz** não foi feita aqui: esta sessão não tem ferramenta de
  síntese de voz, então nem com a autorização da Terezinha eu conseguiria gerar o
  áudio. O caminho é usar os arquivos que já estão em `Audios/` no Drive
  (`audio_voicebox.wav`, `audio_voicebox_29s.wav`) com a opção `--narracao`.
