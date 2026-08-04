#!/usr/bin/env node
/**
 * Gera as páginas de cada técnica de massagem a partir de tools/services.js.
 *
 * O site continua sendo estático e sem build: tudo o que este script produz é
 * commitado no repositório e servido direto pelo GitHub Pages. Rode o script
 * apenas quando mexer no conteúdo dos serviços (tools/services.js):
 *
 *     node tools/build.js
 *
 * Saídas:
 *   <slug>/index.html            página de cada técnica (destino dos sitelinks)
 *   index.html                   grid de serviços, lista do rodapé e JSON-LD
 *   sitemap.xml, robots.txt
 *   docs/google-ads-sitelinks.md textos prontos para colar no Google Ads
 *   docs/google-ads-sitelinks.csv importação em massa pelo Google Ads Editor
 */

const fs = require("fs");
const path = require("path");
const { SITE, SERVICES } = require("./services");

const ROOT = path.join(__dirname, "..");

/* Limites do Google Ads para sitelinks. */
const LIMITS = { text: 25, desc: 35 };

const WA_NUMBER = "5551989582730";
const WA_DEFAULT = "Olá, Terezinha! Vim pelo site e gostaria de agendar uma sessão.";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const wa = (message) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

const WA_ICON =
  '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.02 3C9.4 3 4 8.38 4 15c0 2.36.68 4.56 1.86 6.42L4 29l7.77-1.83A11.9 11.9 0 0 0 16.02 27C22.63 27 28 21.62 28 15S22.63 3 16.02 3Zm0 21.6c-2.02 0-3.9-.57-5.5-1.56l-.4-.24-4.6 1.08 1.1-4.48-.26-.42A9.53 9.53 0 0 1 6.4 15c0-5.3 4.32-9.6 9.62-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6Zm5.27-7.19c-.29-.15-1.7-.84-1.96-.93-.26-.1-.46-.15-.65.14-.19.29-.75.93-.92 1.12-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.12-.59.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38 0 1.4 1.02 2.76 1.16 2.95.14.19 2 3.05 4.85 4.28.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z"/></svg>';

/* ========================================================================== */
/* Validação                                                                   */
/* ========================================================================== */

function validate() {
  const problems = [];
  const slugs = new Set();

  SERVICES.forEach((s) => {
    if (slugs.has(s.slug)) problems.push(`slug duplicado: ${s.slug}`);
    slugs.add(s.slug);

    if (s.sitelink.text.length > LIMITS.text) {
      problems.push(
        `${s.slug}: sitelink.text tem ${s.sitelink.text.length} caracteres (máx. ${LIMITS.text}) — "${s.sitelink.text}"`
      );
    }
    ["desc1", "desc2"].forEach((key) => {
      const value = s.sitelink[key];
      if (value.length > LIMITS.desc) {
        problems.push(
          `${s.slug}: sitelink.${key} tem ${value.length} caracteres (máx. ${LIMITS.desc}) — "${value}"`
        );
      }
    });

    const img = path.join(ROOT, s.image);
    if (!fs.existsSync(img)) problems.push(`${s.slug}: imagem não encontrada — ${s.image}`);
  });

  if (problems.length) {
    console.error("Erros de conteúdo:\n  " + problems.join("\n  "));
    process.exit(1);
  }
}

/* ========================================================================== */
/* Blocos compartilhados                                                       */
/* ========================================================================== */

/* Mesmos snippets da home, copiados sem alteração: são eles que já registram
   as conversões em produção, e as páginas de serviço são destino de anúncio. */
const GTAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18025240124"></script>
<script>
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('config', 'AW-18025240124');
</script>`;

const GTAG_GT = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-5DFB7B74"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-5DFB7B74');
</script>`;

const header = () => `<header class="site-header" id="topo">
  <div class="container header-inner">
    <a href="/" class="brand">
      <img src="/assets/img/logo.png" alt="Terezinha Ramos Massoterapeuta" class="brand-logo">
    </a>

    <nav class="main-nav" id="mainNav">
      <a href="/#sobre">Sobre</a>
      <a href="/#servicos">Serviços</a>
      <a href="/#galeria">Galeria</a>
      <a href="/#localizacao">Localização</a>
      <a href="${wa(WA_DEFAULT)}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-small nav-cta">
        ${WA_ICON}
        <span>Agendar</span>
      </a>
    </nav>

    <button class="nav-toggle" id="navToggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="mainNav">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;

/** Lista de serviços usada no rodapé de todas as páginas. */
const footerServices = (currentSlug) =>
  SERVICES.map((s) => {
    const current = s.slug === currentSlug ? ' aria-current="page"' : "";
    return `      <a href="/${s.slug}/"${current}>${esc(s.shortName)}</a>`;
  }).join("\n");

const footer = (currentSlug) => `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <img src="/assets/img/logo.png" alt="Terezinha Ramos Massoterapeuta" class="footer-logo">
      <p>Massoterapia com técnica, presença e cuidado.</p>
    </div>
    <nav class="footer-nav">
      <p class="footer-title">Navegação</p>
      <a href="/#sobre">Sobre</a>
      <a href="/#servicos">Serviços</a>
      <a href="/#galeria">Galeria</a>
      <a href="/#localizacao">Localização</a>
    </nav>
    <nav class="footer-nav footer-services">
      <p class="footer-title">Massagens</p>
<!-- footer-services:start -->
${footerServices(currentSlug)}
<!-- footer-services:end -->
    </nav>
    <div class="footer-contact">
      <p class="footer-title">Contato</p>
      <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">${SITE.phoneLabel}</a>
      <address>${SITE.street} — ${SITE.district}, ${SITE.city} - ${SITE.state}</address>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; <span id="year"></span> Terezinha Ramos Massoterapeuta. Todos os direitos reservados.</p>
  </div>
</footer>

<a href="${wa(WA_DEFAULT)}" target="_blank" rel="noopener" class="whatsapp-float" id="whatsappFloat" aria-label="Agendar no WhatsApp">
  ${WA_ICON}
</a>

<script src="/assets/js/script.js"></script>`;

/* ========================================================================== */
/* Dados estruturados                                                          */
/* ========================================================================== */

const business = {
  "@type": "HealthAndBeautyBusiness",
  "@id": `${SITE.url}/#business`,
  name: SITE.name,
  url: `${SITE.url}/`,
  image: `${SITE.url}/assets/img/og-image.jpg`,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    postalCode: SITE.zip,
    addressCountry: "BR"
  },
  areaServed: { "@type": "City", name: SITE.city }
};

function serviceJsonLd(service) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "Service",
        name: service.name,
        serviceType: service.name,
        description: service.description,
        url: `${SITE.url}/${service.slug}/`,
        image: `${SITE.url}/${service.image}`,
        provider: { "@id": `${SITE.url}/#business` },
        areaServed: { "@type": "City", name: SITE.city }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE.url}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Serviços",
            item: `${SITE.url}/#servicos`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: `${SITE.url}/${service.slug}/`
          }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a }
        }))
      }
    ]
  };
}

function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      Object.assign({}, business, {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços de massoterapia",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              url: `${SITE.url}/${s.slug}/`
            }
          }))
        }
      })
    ]
  };
}

const jsonLdTag = (data) =>
  `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;

/* ========================================================================== */
/* Página de serviço                                                           */
/* ========================================================================== */

function relatedCards(service) {
  return SERVICES.filter((s) => s.slug !== service.slug)
    .map(
      (s) => `        <a class="related-card" href="/${s.slug}/">
          <span class="related-name">${esc(s.name)}</span>
          <span class="related-text">${esc(s.cardText)}</span>
        </a>`
    )
    .join("\n");
}

function servicePage(service) {
  const url = `${SITE.url}/${service.slug}/`;
  const waHref = wa(service.waMessage);

  const noteBlock = service.note
    ? `\n        <p class="note-box">${esc(service.note)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
${GTAG}

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

${GTAG_GT}

<title>${esc(service.title)}</title>
<meta name="description" content="${esc(service.description)}">
<link rel="canonical" href="${url}">

<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(service.title)}">
<meta property="og:description" content="${esc(service.description)}">
<meta property="og:image" content="${SITE.url}/${service.image}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1b1a17">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Work+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/assets/css/style.css">
<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>

${jsonLdTag(serviceJsonLd(service))}
</head>
<body data-service="${esc(service.name)}">

<a class="skip-link" href="#inicio">Pular para o conteúdo</a>

${header()}

<main id="inicio">

  <!-- HERO -->
  <section class="hero hero-service">
    <div class="hero-text">
      <p class="eyebrow">Massoterapia em ${SITE.city}</p>
      <h1>${esc(service.h1)}</h1>
      <p class="hero-sub">${esc(service.heroSub)}</p>
      <div class="hero-actions">
        <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-large" data-service="${esc(service.name)}">
          ${WA_ICON}
          <span>Agendar no WhatsApp</span>
        </a>
        <a href="#detalhes" class="btn btn-ghost btn-large">Ver como funciona</a>
      </div>
      <ul class="hero-trust">
        <li>${SITE.district}, ${SITE.city}</li>
        <li>5,0 ★ no Google (28 avaliações)</li>
        <li>Atendimento individualizado</li>
      </ul>
    </div>
    <div class="hero-image">
      <img src="/${service.image}" alt="${esc(service.imageAlt)}" loading="eager">
    </div>
  </section>

  <nav class="breadcrumb" aria-label="Você está em">
    <div class="container">
      <a href="/">Início</a>
      <span aria-hidden="true">›</span>
      <a href="/#servicos">Serviços</a>
      <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(service.name)}</span>
    </div>
  </nav>

  <!-- SOBRE A TÉCNICA -->
  <section class="section" id="detalhes">
    <div class="container info-grid">
      <div class="reveal">
        <p class="eyebrow">A técnica</p>
        <h2>${esc(service.name)}</h2>
${service.intro.map((p) => `        <p>${esc(p)}</p>`).join("\n")}
        <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-dark" data-service="${esc(service.name)}">Tirar dúvidas no WhatsApp</a>
      </div>
      <div class="info-aside reveal">
        <h3>Indicada para</h3>
        <ul class="check-list">
${service.indications.map((i) => `          <li>${esc(i)}</li>`).join("\n")}
        </ul>
        <p class="info-note">Não tem certeza se é a técnica ideal? A Terezinha ajuda a escolher no primeiro contato.</p>
      </div>
    </div>
  </section>

  <!-- BENEFÍCIOS -->
  <section class="section section-alt">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Benefícios</p>
        <h2>O que essa sessão faz por você</h2>
      </div>
      <div class="benefit-grid cols-3">
${service.benefits
  .map(
    (b) => `        <div class="benefit-card reveal">
          <h3>${esc(b.title)}</h3>
          <p>${esc(b.text)}</p>
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </section>

  <!-- COMO É A SESSÃO -->
  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Como funciona</p>
        <h2>Como é a sessão</h2>
      </div>
      <ol class="steps steps-stack">
${service.session
  .map(
    (s, i) => `        <li class="reveal">
          <span class="step-number">${i + 1}</span>
          <div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
          </div>
        </li>`
  )
  .join("\n")}
      </ol>${noteBlock}
    </div>
  </section>

  <!-- DEPOIMENTO -->
  <section class="section section-alt">
    <div class="container">
      <div class="section-head reveal">
        <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.8 2.5 30.3 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.8 6C12.2 13 17.6 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 3-2.2 5.5-4.7 7.2l7.3 5.6c4.2-3.9 6.7-9.7 6.7-17.3Z"/><path fill="#FBBC05" d="M10.3 19.2A14.5 14.5 0 0 0 9.5 24c0 1.7.3 3.3.8 4.8l-7.8 6A24 24 0 0 1 0 24c0-3.9.9-7.5 2.5-10.8l7.8 6Z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.6c-2 1.4-4.7 2.3-8.6 2.3-6.4 0-11.8-3.5-13.7-8.7l-7.8 6C6.4 42.6 14.6 48 24 48Z"/></svg>
        <p class="eyebrow">5,0 ★★★★★ · 28 avaliações no Google</p>
        <h2>Quem já foi atendido, recomenda</h2>
      </div>
      <article class="review-card review-single reveal">
        <div class="review-stars">★★★★★</div>
        <p>“${esc(service.review.quote)}”</p>
        <div class="review-author"><span class="review-avatar" style="background:${service.review.color}">${service.review.initial}</span> ${esc(service.review.author)}</div>
      </article>
      <p class="service-note reveal"><a href="https://share.google/sohlg0fapp4EK8zgD" target="_blank" rel="noopener">Ver todas as avaliações no Google →</a></p>
    </div>
  </section>

  <!-- PERGUNTAS FREQUENTES -->
  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Dúvidas</p>
        <h2>Perguntas frequentes</h2>
      </div>
      <div class="faq-list reveal">
${service.faq
  .map(
    (item, i) => `        <details class="faq-item"${i === 0 ? " open" : ""}>
          <summary>${esc(item.q)}</summary>
          <p>${esc(item.a)}</p>
        </details>`
  )
  .join("\n")}
      </div>
    </div>
  </section>

  <!-- OUTRAS TÉCNICAS -->
  <section class="section section-alt" id="outras-tecnicas">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Outras técnicas</p>
        <h2>Conheça os demais atendimentos</h2>
      </div>
      <div class="related-grid reveal">
${relatedCards(service)}
      </div>
    </div>
  </section>

  <!-- LOCALIZAÇÃO -->
  <section class="section">
    <div class="container location-strip reveal">
      <div>
        <p class="eyebrow">Onde é o atendimento</p>
        <h2>Consultório no ${SITE.district}</h2>
        <address>
          ${SITE.street}<br>
          ${SITE.district}, ${SITE.city} - ${SITE.state}<br>
          CEP ${SITE.zip}
        </address>
      </div>
      <div class="location-actions">
        <a href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(
          `${SITE.street.replace("/306", "")}, ${SITE.district}, ${SITE.city} - ${SITE.state}, ${SITE.zip}`
        )}" target="_blank" rel="noopener" class="btn btn-dark">Como chegar</a>
        <a href="/#localizacao" class="btn btn-outline">Ver no mapa</a>
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="cta-final">
    <div class="container reveal">
      <h2>Vamos agendar a sua sessão?</h2>
      <p>Chame a Terezinha no WhatsApp, conte como você está se sentindo e combinem juntos o melhor horário.</p>
      <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-large" data-service="${esc(service.name)}">
        ${WA_ICON}
        <span>Agendar ${esc(service.shortName)}</span>
      </a>
    </div>
  </section>

</main>

${footer(service.slug)}
</body>
</html>
`;
}

/* ========================================================================== */
/* Blocos injetados na home                                                    */
/* ========================================================================== */

function homeServiceCards() {
  return SERVICES.map(
    (s) => `        <article class="service-card reveal" id="${s.slug}">
          <h3><a href="/${s.slug}/">${esc(s.name)}</a></h3>
          <p>${esc(s.cardText)}</p>
          <div class="service-actions">
            <a href="/${s.slug}/" class="service-cta">Ver detalhes →</a>
            <a href="${wa(s.waMessage)}" target="_blank" rel="noopener" class="service-wa" data-service="${esc(s.name)}">
              ${WA_ICON}
              <span>WhatsApp</span>
            </a>
          </div>
        </article>`
  ).join("\n\n");
}

/**
 * Substitui o conteúdo entre <!-- nome:start --> e <!-- nome:end -->.
 * Falha alto se o marcador não existir, para não gerar um arquivo pela metade.
 */
function injectBlock(source, name, content, file) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const pattern = new RegExp(
    `${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}`
  );
  if (!pattern.test(source)) {
    console.error(`Marcador "${name}" não encontrado em ${file}.`);
    process.exit(1);
  }
  // Replacer como função: numa string de substituição, "$&", "$$" e afins são
  // tratados como padrões e comeriam caracteres do conteúdo gerado.
  return source.replace(pattern, () => `${start}\n${content}\n${end}`);
}

/* ========================================================================== */
/* Sitemap, robots e documentação da campanha                                  */
/* ========================================================================== */

function sitemap() {
  const urls = [`${SITE.url}/`].concat(SERVICES.map((s) => `${SITE.url}/${s.slug}/`));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u, i) => `  <url>
    <loc>${u}</loc>
    <priority>${i === 0 ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

const robots = () => `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;

function sitelinksDoc() {
  const rows = SERVICES.map(
    (s) =>
      `| ${s.sitelink.text} | ${s.sitelink.desc1} | ${s.sitelink.desc2} | \`${SITE.url}/${s.slug}/\` |`
  ).join("\n");

  return `# Sitelinks da campanha no Google Ads

Gerado por \`node tools/build.js\` a partir de \`tools/services.js\`. Não edite
este arquivo à mão: ajuste os dados na fonte e rode o build de novo.

Cada técnica de massagem tem uma página própria no site, com conteúdo específico
sobre ela. É para essas páginas que os sitelinks devem apontar — nunca todas para
a home. Isso melhora a experiência da página de destino (um dos componentes do
Índice de qualidade) e faz o clique cair direto no assunto que a pessoa procurou.

## Textos prontos

Limites do Google Ads: **texto do sitelink até 25 caracteres**, **cada linha de
descrição até 35 caracteres**. Os textos abaixo já respeitam esses limites — o
build falha se algum passar.

| Texto do sitelink | Descrição 1 | Descrição 2 | URL final |
| --- | --- | --- | --- |
${rows}

## Como cadastrar

1. Google Ads → **Recursos** → botão **+** → **Sitelink**.
2. Escolha o nível: **campanha** (recomendado, para a campanha de massoterapia)
   ou grupo de anúncios, se quiser sitelinks diferentes por técnica.
3. Preencha texto, as duas descrições e a URL final de cada linha da tabela.
4. Cadastre **no mínimo 4 sitelinks** — o Google só exibe a extensão a partir
   de 2, e com 4 ou mais ele tem margem para testar combinações.
5. Deixe o Google escolher quais mostrar; não é preciso definir programação.

Para importar em massa, use \`docs/google-ads-sitelinks.csv\` no Google Ads
Editor (Conta → Importar → Do arquivo). Se a sua interface estiver em português,
pode ser necessário renomear os cabeçalhos das colunas para os equivalentes
traduzidos.

## Sugestão de quais usar

Os sitelinks aparecem em número limitado (normalmente de 2 a 6). Vale começar
pelos serviços de maior procura e intenção de compra:

1. Massagem Relaxante
2. Massagem Terapêutica
3. Drenagem Linfática
4. Drenagem Pós-Operatória

E rodar os demais em teste depois de acumular dados de cliques.

## Medição

Todas as páginas carregam o mesmo Google tag (\`AW-18025240124\` e
\`GT-5DFB7B74\`) da home, e o clique em qualquer botão de WhatsApp dispara:

- o evento \`whatsapp_click\` (com \`service\`, \`link_url\` e \`link_text\`), útil
  para ver no GA4 qual técnica gera mais contato;
- a conversão \`Contato - whats\` do Google Ads.

Como cada técnica tem URL própria, dá para separar o desempenho por página em
Relatórios → Página de destino.

## Âncoras (alternativa)

Se em algum momento fizer sentido apontar um sitelink para um trecho da home em
vez de uma página inteira, cada card da seção de serviços tem \`id\` próprio —
por exemplo \`${SITE.url}/#massagem-relaxante\`. As páginas dedicadas continuam
sendo a melhor opção para anúncios.
`;
}

function sitelinksCsv() {
  const header = "Sitelink text,Description line 1,Description line 2,Final URL";
  const rows = SERVICES.map((s) =>
    [s.sitelink.text, s.sitelink.desc1, s.sitelink.desc2, `${SITE.url}/${s.slug}/`]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header].concat(rows).join("\n") + "\n";
}

/* ========================================================================== */
/* Execução                                                                    */
/* ========================================================================== */

function write(relativePath, content) {
  const file = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`  ${relativePath}`);
}

validate();

console.log("Páginas de serviço:");
SERVICES.forEach((s) => write(path.join(s.slug, "index.html"), servicePage(s)));

console.log("Home:");
const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = injectBlock(index, "services", homeServiceCards(), "index.html");
index = injectBlock(index, "footer-services", footerServices(null), "index.html");
index = injectBlock(index, "jsonld", jsonLdTag(homeJsonLd()), "index.html");
fs.writeFileSync(indexPath, index);
console.log("  index.html");

console.log("SEO:");
write("sitemap.xml", sitemap());
write("robots.txt", robots());

console.log("Campanha:");
write("docs/google-ads-sitelinks.md", sitelinksDoc());
write("docs/google-ads-sitelinks.csv", sitelinksCsv());

console.log(`\n${SERVICES.length} serviços gerados.`);
