import { test, expect } from '../fixtures/test-base';

/**
 * Storefront smoke + the console-error gate. The 0-app-console-error assertion is the QA
 * tripwire that caught the cross-origin analytics CORS bug and the SSR cart-hydration storm
 * (React #418/#423/#425) — keep it green on every deploy.
 */
test.describe('Storefront smoke', () => {
  test('homepage loads with zero app console errors', async ({ home, consoleErrors }) => {
    await home.open();
    await home.expectLoaded();
    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('product listing renders products (no console errors)', async ({ listing, consoleErrors }) => {
    await listing.open('plants');
    await listing.expectProducts();
    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('PDP loads by slug and renders cleanly', async ({ page, product, consoleErrors, request }) => {
    // Resolve a real published product slug from the public API (same-origin proxy).
    const res = await request.get(
      '/rest-api/products?limit=1&language=en&search=status:publish;visibility:visibility_public',
    );
    const json: any = await res.json().catch(() => ({}));
    const slug = (json?.data?.[0] ?? json?.[0])?.slug as string | undefined;
    test.skip(!slug, 'no published product available to open');

    await product.gotoSlug(slug!);
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.locator('img').first()).toBeVisible({ timeout: 20_000 });
    // Add-to-cart presence is a SOFT signal — it's gated by per-city serviceability, which
    // varies by the runner's IP, so it must not flake the deploy smoke.
    const hasAddToCart = await product
      .addToCartButton()
      .isVisible()
      .catch(() => false);
    test.info().annotations.push({ type: 'add-to-cart visible', description: String(hasAddToCart) });
    // The hard gate: the PDP renders with no app console errors.
    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('unknown product route renders not-found chrome (no crash)', async ({ page }) => {
    await page.goto('/products/__does-not-exist-zzz__', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/PlantAtHome/i);
  });

  test('homepage has no broken images', async ({ home }) => {
    await home.open();
    const broken = await home.brokenImages();
    expect(broken, `broken image srcs:\n${broken.join('\n')}`).toEqual([]);
  });
});
