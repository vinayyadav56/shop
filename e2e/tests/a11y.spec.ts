import { test, expect } from '../fixtures/test-base';
import AxeBuilder from '@axe-core/playwright';

/** Accessibility gate — fail only on serious/critical WCAG 2 A/AA violations (actionable signal). */
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'listing', path: '/plants/search' },
];

for (const p of PAGES) {
  test(`a11y: ${p.name} has no serious/critical violations`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    const summary = blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect(blocking, `serious/critical a11y violations:\n${JSON.stringify(summary, null, 2)}`).toEqual([]);
  });
}
