import { type Page } from '@playwright/test';

/** Shared page-object behaviour. Uses resilient role/URL locators (the storefront has no testids). */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    // Settle client fetches/hydration; tolerate a busy analytics socket. Bounded so a
    // never-idle socket (analytics / lazy images) can't consume the whole test budget —
    // the page is interactive ~1.5s after domcontentloaded.
    await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => undefined);
    await this.dismissLocationGate();
  }

  /**
   * Best-effort dismiss of the location gate, in any of its variants: the IP "we don't deliver
   * here" popup, and the "your detected city changed" popup ("Yes, use <city>"). Accepting the
   * affirmative button closes the modal so the page underneath is interactable.
   */
  async dismissLocationGate() {
    const btn = this.page
      .getByRole('button', {
        name: /continue anyway|continue|got it|yes,?\s*use|keep .*city|^ok$|^close$|dismiss/i,
      })
      .first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => undefined);
      await this.page.waitForTimeout(300);
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
