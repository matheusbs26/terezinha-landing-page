let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const path = require('path');

(async () => {
  const dir = __dirname;
  const dpr = parseFloat(process.env.DPR || '2');
  const suffix = process.env.SUFFIX || '';
  const browser = await chromium.launch();
  for (const slide of [1, 2, 3, 4]) {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1350 },
      deviceScaleFactor: dpr,
    });
    const url = 'file://' + path.join(dir, 'plate.html') + `?slide=${slide}&dpr=${dpr}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const el = await page.$('#stage');
    const out = path.join(dir, `out/prancha-${slide}${suffix}.png`);
    await el.screenshot({ path: out });
    console.log('ok', out);
    await page.close();
  }
  await browser.close();
})();
