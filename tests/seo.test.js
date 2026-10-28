/**
 * Verificações estáticas das páginas publicadas: SEO técnico, links internos,
 * imagens responsivas, fontes, WhatsApp e o que o GitHub Pages publica.
 *
 * Tudo é lido do disco; nada aqui acessa a rede. As páginas são lidas como
 * texto (regex simples), o que basta para HTML gerado por um template só.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://terezinharamos.com.br";
const WA_NUMBER = "5551989582730";

/** Páginas do site: a home e cada pasta com index.html na raiz. */
const PAGES = [
  "index.html",
  ...fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(ROOT, e.name, "index.html")))
    .map((e) => `${e.name}/index.html`)
];

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const urlPath = (page) => (page === "index.html" ? "/" : `/${path.dirname(page)}/`);
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

/** Resolve um href/src da página para um arquivo do repositório. */
function resolveLocal(page, ref) {
  const clean = ref.split("#")[0].split("?")[0];
  if (!clean) return null;
  const base = clean.startsWith("/") ? clean : path.posix.join(urlPath(page), clean);
  const file = path.join(ROOT, decodeURIComponent(base));
  return base.endsWith("/") ? path.join(file, "index.html") : file;
}

const isExternal = (ref) => /^(https?:|mailto:|tel:|data:)/.test(ref);

test("cada página tem um H1, title, description e canonical para a própria URL", () => {
  for (const page of PAGES) {
    const html = read(page);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${page}: precisa de exatamente um <h1>`);
    assert.match(html, /<title>[^<]{10,}<\/title>/, `${page}: sem <title>`);
    assert.match(html, /<meta name="description" content="[^"]{50,}">/, `${page}: sem description`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/);
    assert.ok(canonical, `${page}: sem canonical`);
    assert.equal(canonical[1], SITE + urlPath(page), `${page}: canonical aponta para outra URL`);
  }
});

test("só a política de privacidade é noindex, e ela fica fora do sitemap", () => {
  const sitemap = read("sitemap.xml");
  for (const page of PAGES) {
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(read(page));
    const inSitemap = sitemap.includes(`<loc>${SITE}${urlPath(page)}</loc>`);
    if (page === "politica-de-privacidade/index.html") {
      assert.ok(noindex, "a política deveria continuar noindex");
      assert.ok(!inSitemap, "página noindex não deve estar no sitemap");
    } else {
      assert.ok(!noindex, `${page}: noindex inesperado`);
      assert.ok(inSitemap, `${page}: indexável mas fora do sitemap`);
    }
  }
  for (const loc of all(sitemap, /<loc>([^<]+)<\/loc>/g)) {
    const page = loc.replace(SITE, "").replace(/^\//, "") + "index.html";
    assert.ok(fs.existsSync(path.join(ROOT, page)), `sitemap aponta para página inexistente: ${loc}`);
  }
});

test("o JSON-LD de todas as páginas é JSON válido", () => {
  for (const page of PAGES) {
    for (const block of all(read(page), /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(block), `${page}: JSON-LD inválido`);
    }
  }
});

test("links e recursos internos apontam para arquivos que existem", () => {
  for (const page of PAGES) {
    const html = read(page);
    const refs = [
      ...all(html, /\shref="([^"]+)"/g),
      ...all(html, /\ssrc="([^"]+)"/g),
      ...all(html, /\s(?:image)?srcset="([^"]+)"/g).flatMap((s) => s.split(",").map((c) => c.trim().split(/\s+/)[0]))
    ];
    for (const ref of refs) {
      if (isExternal(ref) || ref.startsWith("#")) continue;
      const file = resolveLocal(page, ref.replace(/&amp;/g, "&"));
      if (file) assert.ok(fs.existsSync(file), `${page}: link quebrado → ${ref}`);
    }
  }
});

test("âncoras internas (#id) existem na página de destino", () => {
  for (const page of PAGES) {
    for (const ref of all(read(page), /\shref="([^"]*#[^"]+)"/g)) {
      if (isExternal(ref)) continue;
      const [target, id] = ref.split("#");
      const targetPage = target ? resolveLocal(page, target) : path.join(ROOT, page);
      assert.ok(read(path.relative(ROOT, targetPage)).includes(`id="${id}"`), `${page}: âncora inexistente → ${ref}`);
    }
  }
});

test("o preload do hero pede a mesma imagem que o <picture> (sem download duplo)", () => {
  for (const page of PAGES) {
    const html = read(page);
    const preload = html.match(/<link rel="preload" as="image"([^>]*)>/);
    if (!preload) continue;
    const attr = (name) => (preload[1].match(new RegExp(`${name}="([^"]+)"`)) || [])[1];
    const srcset = attr("imagesrcset");
    if (!srcset) continue;
    const hero = html.match(/<div class="hero-image">\s*<picture><source srcset="([^"]+)" sizes="([^"]+)"/);
    assert.ok(hero, `${page}: hero sem srcset, mas o preload tem imagesrcset`);
    assert.equal(srcset, hero[1], `${page}: imagesrcset do preload difere do srcset do hero`);
    assert.equal(attr("imagesizes"), hero[2], `${page}: imagesizes do preload difere do sizes do hero`);
  }
});

test("as fontes são servidas pelo próprio site, e os arquivos existem", () => {
  for (const page of PAGES) {
    assert.ok(!read(page).includes("fonts.googleapis.com"), `${page}: ainda carrega o CSS do Google Fonts`);
  }
  const css = read("assets/css/style.css");
  const fonts = all(css, /url\("\.\.\/fonts\/([^"]+)"\)/g);
  assert.ok(fonts.length >= 2, "style.css deveria declarar as fontes com @font-face");
  for (const font of fonts) {
    assert.ok(fs.existsSync(path.join(ROOT, "assets", "fonts", font)), `fonte inexistente: ${font}`);
  }
});

test("todo link de WhatsApp vai para o número da Terezinha com mensagem pronta", () => {
  for (const page of PAGES) {
    const links = all(read(page), /href="(https:\/\/wa\.me\/[^"]+)"/g);
    assert.ok(links.length > 0, `${page}: sem link de WhatsApp`);
    for (const href of links) {
      const url = new URL(href.replace(/&amp;/g, "&"));
      assert.equal(url.pathname, `/${WA_NUMBER}`, `${page}: número errado em ${href}`);
      assert.ok((url.searchParams.get("text") || "").startsWith("Olá, Terezinha!"), `${page}: mensagem pré-preenchida ausente em ${href}`);
    }
  }
});

test("o _config.yml não exclui nada que as páginas usam", () => {
  const excluded = all(read("_config.yml"), /^\s*-\s*(\S+)\s*$/gm).map((e) => e.replace(/\/$/, ""));
  for (const needed of ["assets", "index.html", "robots.txt", "sitemap.xml", "site.webmanifest"]) {
    assert.ok(!excluded.includes(needed), `_config.yml exclui ${needed}`);
  }
  for (const page of PAGES) {
    assert.ok(!excluded.includes(path.dirname(page)), `_config.yml exclui a página ${page}`);
  }
  // Uma lista própria substitui a padrão do gem github-pages, que excluía o CNAME.
  assert.ok(excluded.includes("CNAME"), "_config.yml precisa manter o CNAME excluído, como o padrão");
});
