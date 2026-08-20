# Reels — "Chegue com dor. Saia mais leve."

**Arquivos:**
`reels-com-voz.mp4` — **a versão para publicar**: 42,0 s, com a locução da Terezinha
`reels.mp4` — o mesmo vídeo mudo, 1080×1920, 30 fps, H.264
`reels-com-trilha.mp4` — o mudo com uma trilha ambiente sintetizada aqui

**Formato:** 9:16, dentro das zonas seguras do Reels (320 px livres no topo,
520 px no pé) — nada de texto some atrás do nome do perfil, da legenda ou dos
botões.

---

## Cenas

| # | Tempo | Imagem | Texto na tela |
| --- | --- | --- | --- |
| 1 | 0,0 – 6,1 s | foto: Terezinha atendendo | Chegue com dor. |
| 2 | 5,6 – 9,7 s | foto: mesma cena, outro enquadramento | Saia mais leve. |
| 3 | 9,2 – 15,0 s | fundo greige | O ombro que trava no fim da tarde. |
| 4 | 14,5 – 17,0 s | fundo greige | A lombar que reclama na hora de levantar. |
| 5 | 16,5 – 20,3 s | fundo greige | O pescoço que virou pedra depois de uma semana difícil. |
| 6 | 19,8 – 24,7 s | foto: atendimento nas costas | *A sessão começa com uma conversa:* como você chegou, o que dói, o que anda tirando seu sono. |
| 7 | 24,3 – 30,2 s | fundo greige | SÓ DEPOIS VEM A TÉCNICA / Relaxante · Terapêutica · Drenagem linfática · Pedras quentes · Ventosaterapia |
| 8 | 29,7 – 33,2 s | foto: atendimento | Um tempo só seu. |
| 9 | 32,7 – 37,8 s | foto: atendimento nas pernas | **5,0 ★★★★★** / 28 avaliações no Google e clientes que voltam desde 2009. |
| 10 | 37,4 – 42,0 s | foto: Terezinha sorrindo | **Agende sua sessão** / WhatsApp (51) 98958-2730 · Menino Deus, Porto Alegre |

Os tempos se sobrepõem porque cada corte é um crossfade de 0,45 s.

---

## Locução

O vídeo foi cortado **em cima da locução** que está em `audio_voicebox.wav`
(enviado pelo Matheus): as dez cenas trocam nas pausas naturais da fala, não em
tempos redondos.

O arquivo original tem 46,9 s — 2 s de silêncio no começo, 41 s de fala e 4 s de
silêncio no fim. O preparo antes de entrar no vídeo:

```
ffmpeg -i audio_voicebox.wav \
  -af "atrim=start=1.454:end=43.481,asetpts=N/SR/TB,loudnorm=I=-16:TP=-1.5:LRA=11" \
  quadros/locucao.wav

python3 src/montar.py --forcar --narracao quadros/locucao.wav
```

O `atrim` deixa meio segundo de respiro antes da primeira palavra e quase um
segundo depois da última; o `loudnorm` sobe a voz para o padrão de redes sociais
(−16 LUFS), porque o arquivo vinha baixo (média de −30,7 dB).

**Atenção ao conteúdo:** eu não escuto o áudio — cortei pelas pausas, não pelo
sentido das frases. Vale assistir uma vez conferindo se o texto na tela combina
com o que está sendo dito em cada trecho. Se algo estiver trocado, é só me dizer
a ordem das frases que eu reordeno as cenas.

Se um dia a locução mudar, refaça o `silencedetect` para achar as novas pausas:

```
ffmpeg -i audio.wav -af "silencedetect=noise=-32dB:d=0.30" -f null -
```

e ajuste a lista `CENAS` em `src/montar.py`.

**No Windows**, com o repositório clonado e o Python instalado:

```powershell
pip install imageio-ffmpeg
cd social\instagram\2026-08-reels-chegue-com-dor
python src\montar.py --narracao "C:\Massoterapeuta Terezinha\Audios\audio_voicebox.wav"
```

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

Com locução, publique o `reels-com-voz.mp4` — a voz vem à frente e a trilha
ambiente fica a 25% atrás dela. Legendas automáticas do próprio Instagram ajudam
quem assiste sem som (a maioria).

O `reels.mp4` mudo continua útil para colocar um áudio em alta pela plataforma, e
o `reels-com-trilha.mp4` para publicar só com a trilha — um acorde sintetizado
pelo `src/montar.py`, sem direitos de terceiros.

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
  síntese de voz. A locução usada é o `audio_voicebox.wav` que já existia, gerado
  fora daqui — com a autorização da Terezinha para o uso da voz dela.
