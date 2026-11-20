# terezinha-landing-page

Landing page da Massoterapeuta Terezinha Ramos.

Site estático (HTML/CSS/JS puro, sem build) pensado para conversão via WhatsApp.
A home segue a ordem da decisão de quem chega por anúncio: hero (quem, o quê,
onde, nota do Google e botão) → técnicas com preço → protocolos → avaliações
→ sobre a Terezinha e diferenciais → galeria → como funciona → fotos do
consultório → localização → convite final. Botão flutuante de WhatsApp em
todas as páginas.

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
404.html                           # página de erro do Pages (gerada, noindex)
assets/
  css/style.css
  js/script.js
  fonts/          # Fraunces e Work Sans (OFL), servidas pelo próprio site
  img/            # logo, favicons e fotos (Google Drive da Terezinha)
                  # + versões menores <nome>-<largura>w.webp para o srcset
docs/
  google-ads-sitelinks.md   # textos prontos para colar no Google Ads
  google-ads-sitelinks.csv  # mesma coisa, para importar no Google Ads Editor
  medicao-ga4.md            # eventos, valor da conversão e config. do GA4
tools/
  services.js     # conteúdo dos serviços (fonte única de verdade)
  build.js        # gera as páginas a partir de services.js
  lastmod.json    # hash do conteúdo + data da última mudança (lastmod)
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

Isso reescreve as nove páginas, a `/agendar/`, a `404.html`, o grid de serviços e a lista do rodapé em
`index.html` (entre os marcadores `<!-- services:start -->`, `<!-- footer-services:start -->`
e `<!-- jsonld:start -->`), o `sitemap.xml`, o `robots.txt` e os dois arquivos
em `docs/`. O script valida os limites de caracteres dos sitelinks do Google Ads
e falha se algum texto passar do permitido.

Regras de SEO que o build aplica (e o `npm test` confere):

- **Links entre técnicas:** em `intro` e nas respostas do `faq`, escreva
  `[massagem terapêutica](/massagem-terapeutica/)` para virar link. O build
  falha se o slug não existir. O campo `related` define quais técnicas
  aparecem primeiro em "Outras técnicas".
- **Description:** no máximo 160 caracteres, e única por página.
- **`lastmod` do sitemap:** muda só quando muda o conteúdo relevante da
  página: título, description, `<main>` e JSON-LD.
  - Cabeçalho, rodapé, CSS e scripts não alteram a data.
  - `tools/lastmod.json` guarda, por página, um hash desse conteúdo e a data
    em que ele mudou.
  - Rode o build no dia da alteração, inclusive depois de editar a home à
    mão, e faça o commit do `lastmod.json` junto.
- **JSON-LD:** `WebSite` na home e, em todas as páginas, o negócio com `geo`,
  `hasMap`, `sameAs`, horário, `logo` e `priceRange` (calculado dos preços
  publicados).

Editar as páginas geradas à mão funciona, mas a próxima execução do build
sobrescreve as alterações — prefira mexer em `tools/services.js`.

## Conteúdo a revisar

- **Serviços e preços**: as nove técnicas e os três protocolos, com duração,
  sessão avulsa e pacotes, vêm de `tools/services.js` (fonte única).
- **Radiofrequência e endermologia**: o responsável pelo projeto informa que a
  Terezinha oferece os dois. Eles ainda não têm página nem preço no site.
  - Para criar as páginas, é preciso confirmar: duração, valores da sessão e
    dos pacotes, indicações e contraindicações, aparelho usado e fotos reais
    do atendimento.
  - Feito isso, basta acrescentar os serviços em `services.js` e rodar o
    build.
- **Fotos por técnica**: reflexologia podal, pedras quentes e ventosaterapia
  usam fotos genéricas de massagem nas costas, com alt que descreve o que
  aparece nelas.
  - Faltam fotos reais de cada técnica: pés, pedras posicionadas e ventosas
    aplicadas.
  - Também não há foto específica de Reiki nem de drenagem pós-operatória.
- **Textos das páginas de cada técnica**: descrevem as técnicas de forma
  genérica (indicações, como é a sessão, dúvidas frequentes) e evitam prometer
  resultado. Vale a Terezinha ler e ajustar o que não corresponder ao
  atendimento dela, principalmente as perguntas frequentes.
- **Instagram**: o único perfil oficial é
  [@terezinhamassoterapia](https://www.instagram.com/terezinhamassoterapia/).
  Ele está no `sameAs` e no rodapé, a partir de `SITE.instagram` em
  `tools/services.js`.
  - O perfil antigo (@mtekaramos) e a marca anterior (MOOREA) não
    representam a identidade atual.
  - Um teste impede que voltem ao site.
- **Medição**: eventos, valor da conversão e configuração pendente no GA4 em
  `docs/medicao-ga4.md`.
- **Avaliações**: `#avaliacoes` traz 6 depoimentos reais extraídos do perfil
  do Google Meu Negócio (5,0 ★, 28 avaliações), com link para ver todas.
- **WhatsApp/endereço**: já preenchidos com os dados informados
  ((51) 98958-2730 — R. José de Alencar, 658/306, Menino Deus, Porto Alegre).
