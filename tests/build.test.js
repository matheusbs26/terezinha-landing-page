/**
 * Consistência do build: o que está commitado tem de ser exatamente o que
 * `node tools/build.js` gera a partir de tools/services.js.
 *
 * O build roda numa CÓPIA temporária do projeto, então o repositório nunca é
 * alterado. Fins de linha são ignorados (os arquivos commitados usam CRLF e o
 * build gera LF), para o teste acusar só diferença de conteúdo.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const IGNORED_DIRS = new Set([".git", "node_modules", ".sonarlint", ".vscode", ".claude"]);

const normalize = (buffer) => buffer.toString("utf8").replace(/\r\n/g, "\n");

/** Caminhos relativos (com "/") de todos os arquivos de texto do projeto. */
function listFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (IGNORED_DIRS.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, base);
    return [path.relative(base, full).split(path.sep).join("/")];
  });
}

const isText = (file) => /\.(html|xml|txt|md|csv)$/.test(file);

test("os arquivos gerados commitados são idênticos à saída do build", (t) => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), "terezinha-build-"));
  t.after(() => fs.rmSync(copy, { recursive: true, force: true }));

  fs.cpSync(ROOT, copy, {
    recursive: true,
    filter: (source) => !IGNORED_DIRS.has(path.basename(source))
  });
  execFileSync(process.execPath, [path.join(copy, "tools", "build.js")], { stdio: "pipe" });

  const before = new Set(listFiles(ROOT));
  const after = new Set(listFiles(copy));

  const created = [...after].filter((file) => !before.has(file));
  assert.deepEqual(created, [], "o build criou arquivos que não estão no repositório");

  const outdated = [...before]
    .filter(isText)
    .filter((file) => normalize(fs.readFileSync(path.join(ROOT, file))) !== normalize(fs.readFileSync(path.join(copy, file))));

  assert.deepEqual(
    outdated,
    [],
    "arquivos fora de sincronia com tools/services.js — rode `node tools/build.js`"
  );
});

test("o lastmod só muda quando muda o conteúdo da página, não o rodapé", (t) => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), "terezinha-lastmod-"));
  t.after(() => fs.rmSync(copy, { recursive: true, force: true }));
  fs.cpSync(ROOT, copy, { recursive: true, filter: (source) => !IGNORED_DIRS.has(path.basename(source)) });

  const HOME = "https://terezinharamos.com.br/";
  const registryFile = path.join(copy, "tools", "lastmod.json");
  const build = () => execFileSync(process.execPath, [path.join(copy, "tools", "build.js")], { stdio: "pipe" });
  const homeDate = () =>
    fs.readFileSync(path.join(copy, "sitemap.xml"), "utf8").match(new RegExp(`<loc>${HOME}</loc>\\s*<lastmod>([^<]+)`))[1];

  // Data antiga conhecida, para distinguir "manteve" de "virou hoje".
  const registry = JSON.parse(fs.readFileSync(registryFile, "utf8"));
  registry[HOME].date = "2000-01-01";
  fs.writeFileSync(registryFile, JSON.stringify(registry));

  const index = path.join(copy, "index.html");
  fs.writeFileSync(index, fs.readFileSync(index, "utf8").replace("Massoterapia com técnica, presença e cuidado.", "Rodapé alterado."));
  build();
  assert.equal(homeDate(), "2000-01-01", "mudança só no rodapé não deveria mudar o lastmod");

  fs.writeFileSync(index, fs.readFileSync(index, "utf8").replace("Um espaço tranquilo para o seu cuidado", "Um espaço tranquilo e novo"));
  build();
  assert.equal(homeDate(), new Date().toLocaleDateString("sv-SE"), "mudança no conteúdo deveria atualizar o lastmod");
});

test("cada serviço tem página e entrada no sitemap", () => {
  const { SERVICES } = require("../tools/services.js");
  const sitemap = normalize(fs.readFileSync(path.join(ROOT, "sitemap.xml")));

  for (const { slug } of SERVICES) {
    assert.ok(fs.existsSync(path.join(ROOT, slug, "index.html")), `falta ${slug}/index.html`);
    assert.ok(sitemap.includes(`/${slug}/`), `${slug} não está no sitemap.xml`);
  }
});
