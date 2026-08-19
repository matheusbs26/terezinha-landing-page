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

**Por que esse assunto.** Escolhido a partir de dados conectados, não de palpite:

- Nas 28 avaliações do Perfil da Empresa, a ventosaterapia aparece com um relato
  concreto de resultado ("estava com dores no trapézio, fiz as ventosas,
  liberação e saí novo"), e dor de coluna/ombro é o motivo mais citado para
  procurar a Terezinha.
- Nos termos de busca do Perfil da Empresa, o único acima do limiar de
  divulgação é o nome dela. Tudo que é genérico — "massoterapeuta menino deus",
  "massagem relaxante porto alegre" — fica abaixo. Ou seja: quem chega já a
  conhece. O conteúdo precisa alcançar quem ainda não sabe o nome dela, e para
  isso funciona melhor um post sobre um problema específico do que sobre a marca.
- Ventosaterapia tem gancho de curiosidade ("por que isso funciona?"), que rende
  salvamento e comentário, e não repete o assunto do reel.

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
