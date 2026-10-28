# terezinha-landing-page

Landing page da Massoterapeuta Terezinha Ramos.

Site estático (HTML/CSS/JS puro, sem build) pensado para conversão via WhatsApp:
hero com foto real de atendimento, seção sobre, benefícios, serviços, galeria,
link para avaliações no Google, mapa/localização do consultório e botão
flutuante de WhatsApp.

## Estrutura

```
index.html
massagem-relaxante/index.html      # uma página por técnica: são os destinos
massagem-terapeutica/index.html    # dos sitelinks da campanha no Google Ads
drenagem-linfatica/index.html
drenagem-pos-operatoria/index.html
massagem-modeladora/index.html
reflexologia-podal/index.html
massagem-pedras-quentes/index.html
ventosaterapia/index.html
reiki/index.html
assets/
  css/style.css
  js/script.js
  fonts/          # Fraunces e Work Sans (OFL), servidas pelo próprio site
  img/            # logo, favicons e fotos (Google Drive da Terezinha)
                  # + versões menores <nome>-<largura>w.webp para o srcset
docs/
  google-ads-sitelinks.md   # textos prontos para colar no Google Ads
  google-ads-sitelinks.csv  # mesma coisa, para importar no Google Ads Editor
tools/
  services.js     # conteúdo dos serviços (fonte única de verdade)
  build.js        # gera as páginas a partir de services.js
  responsive-images.py  # gera as versões menores das fotos (Pillow)
_config.yml       # o que o GitHub Pages NÃO publica (README, docs/, tools/…)
sitemap.xml
robots.txt
site.webmanifest
```

## Publicação

O GitHub Pages monta o site com Jekyll a partir da `main`. O `_config.yml`
exclui da publicação o que não é página nem recurso das páginas: README,
`docs/`, `tools/`, `tests/`, `package.json` e `cspell.json`. Uma lista própria
de `exclude` substitui a padrão, por isso ela repete o `CNAME` e os padrões do
Jekyll — o teste `tests/seo.test.js` confere isso.

## Fotos novas

Ao trocar ou adicionar uma foto em `assets/img/` (JPEG + WebP de 1350 px),
gere as versões menores e rode o build:

```
python tools/responsive-images.py
node tools/build.js
```

O `build.js` monta o `srcset` com as versões que existirem; sem elas a página
continua usando só a original. Na home (editada à mão fora dos marcadores) o
`srcset` das fotos é escrito direto no `index.html`.

## Rodando localmente

Qualquer servidor estático funciona, por exemplo:

```
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Páginas das técnicas e sitelinks

Cada técnica de massagem tem uma página própria (`/massagem-relaxante/`,
`/drenagem-linfatica/`, …) com o que ela trata, para quem é indicada, como é a
sessão e perguntas frequentes. É para essas URLs que apontam os sitelinks da
campanha no Google Ads — ver `docs/google-ads-sitelinks.md`.

O site segue sem build para rodar: todas as páginas estão commitadas e são
servidas direto pelo GitHub Pages. O gerador só é usado quando o **conteúdo dos
serviços** muda. Nesse caso, edite `tools/services.js` e rode:

```
node tools/build.js
```

Isso reescreve as nove páginas, o grid de serviços e a lista do rodapé em
`index.html` (entre os marcadores `<!-- services:start -->`, `<!-- footer-services:start -->`
e `<!-- jsonld:start -->`), o `sitemap.xml`, o `robots.txt` e os dois arquivos
em `docs/`. O script valida os limites de caracteres dos sitelinks do Google Ads
e falha se algum texto passar do permitido.

Editar as páginas geradas à mão funciona, mas a próxima execução do build
sobrescreve as alterações — prefira mexer em `tools/services.js`.

## Conteúdo a revisar

- **Serviços**: a lista em `#servicos` (Relaxante, Terapêutica, Drenagem
  Linfática, Drenagem Pós-Operatória, Modeladora, Reflexologia Podal, Pedras
  Quentes, Ventosaterapia, Reiki) foi montada a partir de termos comuns de
  massoterapia e do que aparece nas avaliações reais do Google. Sem preço fixo.
  Vale confirmar com a Terezinha se a lista bate exatamente com o que ela
  oferece.
- **Textos das páginas de cada técnica**: descrevem as técnicas de forma
  genérica (indicações, como é a sessão, dúvidas frequentes) e evitam prometer
  resultado, citar duração ou preço, justamente porque esses detalhes não foram
  confirmados. Vale a Terezinha ler e ajustar o que não corresponder ao
  atendimento dela — principalmente as perguntas frequentes.
- **Avaliações**: `#avaliacoes` traz 6 depoimentos reais extraídos do perfil
  do Google Meu Negócio (5,0 ★, 28 avaliações), com link para ver todas.
- **WhatsApp/endereço**: já preenchidos com os dados informados
  ((51) 98958-2730 — R. José de Alencar, 658/306, Menino Deus, Porto Alegre).
