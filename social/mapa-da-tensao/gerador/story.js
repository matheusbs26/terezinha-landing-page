let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const path = require('path');
(async () => {
  const dpr = parseFloat(process.env.DPR || '1');
  const suffix = process.env.SUFFIX || '';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: dpr });
  await page.goto('file://' + path.join(__dirname, 'plate.html') + `?slide=5&h=1920&dpr=${dpr}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await (await page.$('#stage')).screenshot({ path: path.join(__dirname, `out/story${suffix}.png`) });
  console.log('ok');
  await browser.close();
})();
