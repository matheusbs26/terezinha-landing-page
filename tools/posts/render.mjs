#!/usr/bin/env node
/**
 * Renderiza uma arte estatica de post (HTML) em JPG.
 *
 * Mesma ideia do tools/reels/render.mjs, so que sem linha do tempo: abre o HTML
 * no Chromium, espera as fontes e as fotos carregarem e salva um quadro. O
 * tamanho sai do proprio HTML (window.__size), entao cada arte define o formato
 * que precisa — 1080x1350 para feed, 1080x1080 para quadrado, e assim por diante.
 *
 *   node tools/posts/render.mjs tools/posts/trapezio.html
 *   node tools/posts/render.mjs tools/posts/trapezio.html --outdir assets/img/posts
 */

import { chromium } from 'playwright';
import http from 'node:http';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

const argv = process.argv.slice(2);
const positional = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
const flag = (name, fallback = null) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? fallback : argv[i + 1];
};

const SRC = positional[0];
if (!SRC) {
  console.error('uso: node tools/posts/render.mjs <arquivo.html> [--outdir dir] [--quality 92]');
  process.exit(1);
}
const OUT_DIR = path.resolve(ROOT, flag('outdir', 'assets/img/posts'));
const QUALITY = Number(flag('quality', '92'));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};

// Servir por http em vez de file://: o Chromium trata cada arquivo local como
// origem opaca e recusa carregar as fontes.
const server = http.createServer(async (req, res) => {
  try {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const body = await fsp.readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    }).end(body);
  } catch {
    res.writeHead(404).end('nao encontrado');
  }
});
const port = await new Promise(r => server.listen(0, '127.0.0.1', () => r(server.address().port)));

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

const rel = path.relative(ROOT, path.resolve(SRC)).split(path.sep).join('/');
await page.goto(`http://127.0.0.1:${port}/${rel}`, { waitUntil: 'load' });
await page.waitForFunction('window.__ready === true', null, { timeout: 60_000 });

const size = await page.evaluate(() => window.__size);
await page.setViewportSize(size);

await fsp.mkdir(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, path.basename(SRC).replace(/\.html$/, '') + '.jpg');
await page.screenshot({ path: out, type: 'jpeg', quality: QUALITY });

await browser.close();
server.close();

const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(`${path.relative(ROOT, out)} — ${size.width}x${size.height}, ${kb} KB`);
