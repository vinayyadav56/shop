import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ListingPage extends BasePage {
  async open(vertical = 'plants') {
    await this.goto(`/${vertical}/search`);
  }

  /** Listing rendered (deterministic; the console-error gate in the spec is the real assertion). */
  async expectProducts() {
    await expect(this.page).toHaveURL(/\/search/);
    await expect(this.page.locator('img').first()).toBeVisible({ timeout: 20_000 });
  }
}
