#!/usr/bin/env node
/**
 * Renderiza tools/reels/reel.html em MP4 1080x1920 (Reels / Stories / TikTok).
 *
 * A cena e capturada quadro a quadro: para cada frame chamamos window.__seek(t)
 * e tiramos um screenshot. E mais lento que gravar a tela, mas o resultado nao
 * depende da velocidade da maquina — o mesmo comando gera sempre o mesmo video.
 *
 *   node tools/reels/render.mjs                     # video completo + capa
 *   node tools/reels/render.mjs --frame 2.6         # so um PNG de conferencia
 *   node tools/reels/render.mjs --fps 30 --crf 19
 *
 * Precisa de: playwright (com chromium) e ffmpeg com libx264.
 * Se o ffmpeg nao estiver no PATH, passe --ffmpeg /caminho/do/ffmpeg
 * ou defina a variavel de ambiente FFMPEG.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

/* ---------- argumentos ---------- */
const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? fallback : argv[i + 1];
};
const has = name => argv.includes('--' + name);

const OUT_DIR   = path.resolve(ROOT, flag('outdir', 'assets/video'));
const OUT_NAME  = flag('name', 'reel-terezinha');
const FFMPEG    = flag('ffmpeg', process.env.FFMPEG || 'ffmpeg');
const CRF       = flag('crf', '19');
const QUALITY   = Number(flag('quality', '96'));
const COVER_AT  = Number(flag('cover', '3.4'));
const ONE_FRAME = flag('frame', null);

/* ---------- servidor estatico ---------- */
// Carregar via file:// faz o Chromium tratar cada arquivo como origem opaca e
// recusar as fontes locais. Servir por http resolve isso e ainda deixa a cena
// abrivel no navegador para conferir antes de renderizar.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

function serve(root) {
  const server = http.createServer(async (req, res) => {
    try {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = path.join(root, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
      if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
      const body = await fsp.readFile(file);
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      }).end(body);
    } catch {
      res.writeHead(404).end('nao encontrado');
    }
  });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/* ---------- render ---------- */
const bar = (done, total) => {
  const w = 34;
  const n = Math.round((done / total) * w);
  const pct = String(Math.round((done / total) * 100)).padStart(3);
  process.stdout.write('\r  [' + '#'.repeat(n) + '.'.repeat(w - n) + '] ' + pct + '%  ' + done + '/' + total);
};

const { server, port } = await serve(ROOT);
const url = `http://127.0.0.1:${port}/tools/reels/reel.html`;

const browser = await chromium.launch({
  args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'],
});
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction('window.__ready === true', null, { timeout: 60_000 });

const meta = await page.evaluate(() => window.__meta);
const fps  = Number(flag('fps', meta.fps));
const frames = Math.round(meta.duration * fps);

await fsp.mkdir(OUT_DIR, { recursive: true });

if (ONE_FRAME !== null) {
  // aceita uma lista: --frame 0.8,5.6,11.2 para conferir varias cenas de uma vez
  for (const raw of String(ONE_FRAME).split(',')) {
    const t = Number(raw.trim());
    await page.evaluate(v => window.__seek(v), t);
    const out = path.join(OUT_DIR, `${OUT_NAME}-t${t}.png`);
    await page.screenshot({ path: out, type: 'png' });
    console.log('quadro salvo em', path.relative(ROOT, out));
  }
  await browser.close();
  server.close();
  process.exit(0);
}

const mp4 = path.join(OUT_DIR, `${OUT_NAME}.mp4`);
console.log(`renderizando ${frames} quadros (${meta.duration}s @ ${fps}fps) -> ${path.relative(ROOT, mp4)}`);

const ff = spawn(FFMPEG, [
  '-y',
  '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  // faixa de audio muda: o Instagram aceita video sem audio, mas alguns
  // players e o preview do WhatsApp engasgam quando nao existe faixa nenhuma.
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
  '-shortest',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF),
  '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
  '-x264-params', 'keyint=' + fps * 2 + ':min-keyint=' + fps,
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  '-r', String(fps),
  mp4,
], { stdio: ['pipe', 'ignore', 'pipe'] });

let ffErr = '';
ff.stderr.on('data', d => { ffErr += d.toString(); if (ffErr.length > 8000) ffErr = ffErr.slice(-8000); });
const ffDone = new Promise((resolve, reject) => {
  ff.on('error', reject);
  ff.on('close', code => (code === 0 ? resolve() : reject(new Error('ffmpeg saiu com codigo ' + code + '\n' + ffErr))));
});

// Um listener de erro so, fora do laco: registrar um por quadro estoura o
// limite de listeners do socket e enche o terminal de aviso.
let stdinErr = null;
ff.stdin.on('error', e => { stdinErr = e; });
const write = buf => new Promise((resolve, reject) => {
  if (stdinErr) return reject(stdinErr);
  if (ff.stdin.write(buf)) return resolve();
  ff.stdin.once('drain', resolve);
});

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => window.__seek(t), f / fps);
  const shot = await page.screenshot({ type: 'jpeg', quality: QUALITY });
  await write(shot);
  if (f % 15 === 0 || f === frames - 1) bar(f + 1, frames);
}
ff.stdin.end();
process.stdout.write('\n');
await ffDone;

/* ---------- capa ---------- */
const cover = path.join(OUT_DIR, `${OUT_NAME}-capa.jpg`);
await page.evaluate(t => window.__seek(t), COVER_AT);
await page.screenshot({ path: cover, type: 'jpeg', quality: 92 });

await browser.close();
server.close();

const kb = (fs.statSync(mp4).size / 1048576).toFixed(1);
console.log(`pronto em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`  video: ${path.relative(ROOT, mp4)} (${kb} MB)`);
console.log(`  capa : ${path.relative(ROOT, cover)}`);
