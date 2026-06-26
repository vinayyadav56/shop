import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ListingPage } from '../pages/listing.page';
import { ProductPage } from '../pages/product.page';

/**
 * Third-party / browser noise we don't own — never fail the suite on these. The gate asserts on
 * OUR app's console errors (the assertion that caught the CORS analytics bug + the React
 * hydration #418/#423/#425 storm).
 */
const IGNORE_PATTERNS = [
  /google-analytics\.com|googletagmanager\.com|google\.com\/g\/collect/i,
  /\bgtag\b|doubleclick|facebook\.net|connect\.facebook/i,
  /ResizeObserver loop/i,
  /Download the React DevTools/i,
];

type Fixtures = {
  /** App console errors collected over the test (third-party noise filtered out). */
  consoleErrors: string[];
  home: HomePage;
  listing: ListingPage;
  product: ProductPage;
};

export const test = base.extend<Fixtures>({
  // Seed a serviceable delivery city BEFORE any page script runs, so the city-first product
  // feeds render deterministically and the IP-based "we don't deliver here" location gate
  // (which fires for the CI/runner IP) doesn't suppress the catalog.
  context: async ({ context }, use) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('pah_customer_city', 'Gurugram');
      } catch {
        /* storage unavailable — ignore */
      }
    });
    await use(context);
  },

  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    const keep = (text: string) => !IGNORE_PATTERNS.some((re) => re.test(text));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && keep(msg.text())) errors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      const text = String((err && err.message) || err);
      if (keep(text)) errors.push(text);
    });
    await use(errors);
  },
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  listing: async ({ page }, use) => {
    await use(new ListingPage(page));
  },
  product: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
});

export { expect };
