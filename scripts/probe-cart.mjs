import { chromium } from 'playwright';
const SHOT = process.env.SHOT ?? '/tmp';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 950 } });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
p.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message.slice(0, 120)));
await p.goto('http://localhost:3010/products/monstera-deliciosa', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(6000);
// dismiss location gate / language modal if present
for (const sel of ['button:has-text("×")', '[aria-label="close"]', 'button:has-text("Skip")', 'button:has-text("Continue")']) {
  const el = p.locator(sel).first();
  if (await el.count() && await el.isVisible().catch(() => false)) { await el.click().catch(() => {}); await p.waitForTimeout(500); }
}
const title = await p.locator('h1').first().textContent().catch(() => '?');
console.log('h1:', title?.trim());
// pick a Size chip (variation attribute button)
const chips = p.locator('button, [role="button"]').filter({ hasText: /^(Small|Medium|Large)$/ });
console.log('size chips found:', await chips.count());
if (await chips.count()) {
  await chips.first().click();
  await p.waitForTimeout(1200);
}
const priceText = await p.locator('text=/₹[0-9,]+/').first().textContent().catch(() => 'none');
console.log('resolved price on page:', priceText?.trim().slice(0, 30));
await p.screenshot({ path: SHOT + '/pdp-selected.png', timeout: 20000 });
// add to cart
const addBtn = p.locator('button', { hasText: /add to cart/i }).first();
console.log('add-to-cart visible:', await addBtn.isVisible().catch(() => false));
await addBtn.click({ timeout: 5000 }).catch((e) => console.log('add click failed:', e.message.slice(0, 60)));
await p.waitForTimeout(2500);
// cart state from localStorage (V1 client-side cart)
const cart = await p.evaluate(() => JSON.parse(localStorage.getItem('plantathome-cart') ?? '{}'));
console.log('cart items:', cart?.items?.length, '| first:', cart?.items?.[0]?.name, '| price:', cart?.items?.[0]?.price, '| variationId:', cart?.items?.[0]?.variationId);
await p.screenshot({ path: SHOT + '/pdp-after-add.png', timeout: 20000 });
console.log('console errors:', errs.length ? '\n  ' + [...new Set(errs)].slice(0, 6).join('\n  ') : 'NONE ✓');
await b.close();
process.exit(0);
