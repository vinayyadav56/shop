import { chromium } from 'playwright';
const ROUTES = [
  ['/plants/search', 'search PLP'],
  ['/c/succulents-cacti', 'category'],
  ['/categories', 'categories'],
  ['/products/monstera-deliciosa', 'PDP'],
  ['/signin', 'signin'],
  ['/checkout/guest', 'guest checkout'],
  ['/offers', 'offers'],
  ['/track-order', 'track-order'],
  ['/contact', 'contact'],
  ['/profile', 'profile (gated)'],
  ['/flash-sales', 'flash-sales'],
  ['/help', 'help'],
];
const b = await chromium.launch();
for (const [path, label] of ROUTES) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 100)));
  p.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message.slice(0, 100)));
  try {
    await p.goto('http://localhost:3010' + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(6000);
    const alive = await Promise.race([
      p.evaluate(() => document.body.innerText.slice(0, 55).replace(/\s+/g, ' ')),
      new Promise((r) => setTimeout(() => r('⛔BLOCKED'), 5000)),
    ]);
    console.log(`${errs.length ? '⚠️ ' : '✅'} ${label.padEnd(16)} ${String(alive).slice(0, 52)}${errs.length ? ' | ' + errs[0] : ''}`);
  } catch (e) {
    console.log(`❌ ${label.padEnd(16)} ${e.message.slice(0, 65)}`);
  }
  await ctx.close();
}
await b.close();
process.exit(0);
