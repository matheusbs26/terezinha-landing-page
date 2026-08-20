# Artes de post

Gerador das imagens estáticas de post (feed do Instagram, 1080×1350).

```bash
node tools/posts/render.mjs tools/posts/trapezio.html
# saída: assets/img/posts/trapezio.jpg
```

Cada arte é um HTML que declara o próprio tamanho em `window.__size` e avisa
`window.__ready = true` quando as fontes e as fotos terminaram de carregar. O
renderizador serve a raiz do projeto por http (carregar por `file://` faz o
Chromium recusar as fontes locais), abre a página no Chromium e salva um JPG.

Fontes, cores e fotos são as mesmas do site e do reel — `tools/reels/fonts/`,
as variáveis de `assets/css/style.css` e `assets/img/`.

## trapezio.jpg

**Por que esse assunto.** Escolhido a partir do feed real de @terezinhamassoterapia
(234 seguidores, 28 posts) e das 28 avaliações do Perfil da Empresa:

- Nos últimos dois anos o perfil publicou sobre drenagem estética, lipo enzimática,
  tensão no pescoço e ombros, um panorama das nove técnicas e drenagem
  pós-operatória. **Ventosaterapia nunca teve post próprio** — aparece só como
  hashtag na lista.
- Nas avaliações, é a única técnica com relato concreto de resultado ("estava com
  dores no trapézio, fiz as ventosas, liberação e saí novo").
- Tem gancho de curiosidade — "por que isso funciona?" —, que é o que rende
  salvamento e comentário.

O enquadramento inicial era "tensão no pescoço e ombro", mas o post de 10/08/2026
já cobre exatamente isso (22 curtidas, 3 comentários). O kicker foi reescrito para
o mecanismo da ventosa, que é o que há de novo.

**O que os dados de busca não sustentam.** No Google Ads da Terezinha não há uma
única busca por "ventosa" em 172 cliques de 6 meses. A demanda paga é genérica
("massagem porto alegre" puxa 26 cliques e 4 das 13 conversões) e o específico que
aparece é dor, não técnica: "dor nas costas", "tratamento nervo ciático",
"liberação miofascial". Este post vale pelo feed e pelas avaliações, não por
volume de busca — quem planejar a sequência deve lembrar que as pessoas procuram
pela dor, não pelo nome da técnica.

**Temas ainda descobertos no feed,** com respaldo nas avaliações ou nas buscas:
dor lombar, nervo ciático, atendimento a quem treina (há duas avaliações de
praticantes de musculação e Muay Thai), reflexologia podal, pedras quentes e reiki.

**Legenda sugerida:**

> Massagem comprime. A ventosa levanta.
>
> Parece detalhe, mas é o contrário uma da outra. A massagem empurra o músculo
> para dentro. A ventosa faz pressão negativa e puxa o tecido para fora — por
> isso ela alcança aquele nó no trapézio que não cede só com alongamento.
>
> Se você passa o dia no computador e sente o ombro subindo em direção à orelha,
> é provavelmente disso que o seu corpo está reclamando.
>
> Atendimento no Menino Deus, em Porto Alegre.
> Agende pelo WhatsApp: (51) 98958-2730
>
> #ventosaterapia #massoterapia #portoalegre #meninodeus #dornoombro
> #tensaomuscular #trapezio #massagemportoalegre #poa

**Antes de publicar:** confirme que a ventosaterapia continua na lista de
serviços ativos da Terezinha e que ela está confortável com o texto — o post
descreve a técnica, não promete resultado.
