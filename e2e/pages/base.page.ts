import { type Page } from '@playwright/test';

/** Shared page-object behaviour. Uses resilient role/URL locators (the storefront has no testids). */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    // Settle client fetches/hydration; tolerate a busy analytics socket.
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    await this.dismissLocationGate();
  }

  /** Best-effort dismiss of the IP-based "we don't deliver here" / city-changed popup. */
  async dismissLocationGate() {
    const btn = this.page
      .getByRole('button', { name: /continue anyway|continue|got it|^close$|dismiss/i })
      .first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => undefined);
    }
  }

  /** Returns the srcs of images that finished loading but have zero intrinsic width (broken). */
  async brokenImages(): Promise<string[]> {
    return this.page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
  }
}
