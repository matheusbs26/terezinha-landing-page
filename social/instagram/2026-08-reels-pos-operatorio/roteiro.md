# Reels — "Operou. E agora?" (drenagem pós-operatória)

**Arquivos:**
`reels.mp4` — 1080×1920, 33,6 s, 30 fps, H.264 (mudo)
`reels-com-trilha.mp4` — o mesmo vídeo com a trilha ambiente sintetizada pelo script

**Tema:** drenagem linfática pós-operatória — o serviço de maior valor e de maior
intenção de busca da Terezinha. Todo o texto vem da página
`/drenagem-pos-operatoria/`, ou seja, já está alinhado com o que o site promete.

---

## Cenas

| # | Tempo | Imagem | Texto na tela |
| --- | --- | --- | --- |
| 1 | 0,0 – 4,4 s | mãos nas costas, luz de janela | DRENAGEM PÓS-OPERATÓRIA / **Operou. E agora?** |
| 2 | 4,0 – 7,2 s | fundo greige | **O inchaço. O peso. O medo de encostar.** |
| 3 | 6,7 – 10,9 s | atendimento nas costas | Depois de uma cirurgia, o corpo precisa de *tempo e de cuidado*. A drenagem pós-operatória acompanha essa fase. |
| 4 | 10,5 – 14,1 s | fundo greige | ANTES DE TUDO · **A liberação do seu cirurgião.** |
| 5 | 13,6 – 17,6 s | mãos, enquadramento fechado | *Toque leve*, só nas regiões liberadas, com atenção constante ao seu conforto. |
| 6 | 17,2 – 21,8 s | fundo greige | COMO FUNCIONA · 01 você traz as orientações da equipe médica · 02 o protocolo é combinado a partir delas · 03 uma série de sessões, mais frequentes no começo |
| 7 | 21,3 – 26,1 s | atendimento | *"Drenagem pós-operatória, massagem terapêutica — todos os protocolos com resultado muito bom."* — Taís Fagundes, cliente desde 2011 |
| 8 | 25,7 – 29,3 s | fundo greige | **Leve as suas orientações médicas.** São elas que guiam todo o protocolo da sessão. |
| 9 | 28,8 – 33,6 s | Terezinha sorrindo | **Vamos combinar?** / WhatsApp (51) 98958-2730 · Menino Deus, Porto Alegre |

Os tempos se sobrepõem porque cada corte é um crossfade de 0,45 s.

---

## Locução

Texto cronometrado para os 33,6 s, na voz da Terezinha. As pausas entre os
blocos marcam as trocas de cena:

> (0–4 s) Você operou. E agora, o que fazer com o inchaço?
>
> (4–7 s) O peso na região, o medo de encostar — isso assusta.
>
> (7–11 s) Depois de uma cirurgia, o corpo precisa de tempo e de cuidado. A
> drenagem pós-operatória acompanha essa fase.
>
> (11–14 s) Mas antes de tudo vem a liberação do seu cirurgião.
>
> (14–18 s) O toque é leve, só nas regiões liberadas, sempre atenta ao seu
> conforto.
>
> (18–22 s) Você traz as orientações da equipe médica, a gente combina o
> protocolo a partir delas, e faz uma série de sessões — mais frequentes no
> começo.
>
> (22–26 s) Tem cliente comigo desde 2011.
>
> (26–30 s) Leve as suas orientações médicas: são elas que guiam tudo.
>
> (30–34 s) Me chama no WhatsApp e a gente combina.

Para montar com a locução pronta:

```
ffmpeg -i locucao.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" quadros/locucao.wav
python3 src/montar.py --forcar --narracao quadros/locucao.wav
```

Se a duração da gravação não bater com os 33,6 s, ache as pausas com
`silencedetect` e ajuste a lista `CENAS` em `src/montar.py` — o passo a passo
está no `roteiro.md` do reels "Chegue com dor".

---

## Legenda do post

Operou e ficou com aquela dúvida: e agora, o que fazer com o inchaço?

A drenagem pós-operatória é um trabalho delicado, feito para acompanhar a fase de
recuperação — mas ela só começa depois da liberação do seu cirurgião. São as
orientações da sua equipe médica que guiam o protocolo: o tempo de cada etapa e as
regiões que podem ou não ser tocadas.

Na prática: toque leve, só nas áreas liberadas, com hora marcada e em ambiente
reservado. Como a recuperação é gradual, o mais comum é combinar uma série de
sessões, com frequência maior no começo.

Traga as suas orientações e a gente combina o resto. 🤍

📍 R. José de Alencar, 658/306 — Menino Deus, Porto Alegre
📱 (51) 98958-2730 (link na bio)

.
.
.

#drenagemposoperatoria #drenagemlinfatica #posoperatorio #cirurgiaplastica
#recuperacaoposoperatoria #massoterapia #massagemportoalegre #massoterapiapoa
#meninodeus #portoalegre #poa #abdominoplastia #lipoaspiracao #maisalemdaestetica
#autocuidado

**Capa do Reels:** o quadro da cena 1 (`quadros/cena-1-fundo.png` com o texto por
cima) — o enquadramento vertical funciona bem no grid.

---

## Antes de publicar

- **Conferir com a Terezinha** os três passos da cena 6 e o texto da cena 5: eles
  descrevem o protocolo dela, tirados da página do site, mas vale a confirmação de
  quem atende.
- A exigência de liberação médica aparece **duas vezes** de propósito (cenas 4 e
  8). É o que protege ela e a cliente, e ainda filtra quem chega no WhatsApp sem
  ter operado ainda.
- O depoimento da cena 7 é real, do perfil no Google (Taís Fagundes), recortado do
  trecho que fala de drenagem pós-operatória.
- Se for impulsionar, este é o melhor dos dois reels para anúncio: público com
  intenção alta e serviço de ticket maior.

---

## Refazendo o vídeo

```
./src/render.sh          # regera as camadas em quadros/
python3 src/montar.py    # monta o mp4 (leva ~1 min)
```

Conteúdo em `src/cenas.html`; duração e sentido do zoom de cada cena na lista
`CENAS` de `src/montar.py`.
