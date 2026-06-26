import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ListingPage extends BasePage {
  async open(vertical = 'plants') {
    await this.goto(`/${vertical}/search`);
  }

  /** Listing rendered: the grid paints product imagery (card-component-agnostic). */
  async expectProducts() {
    await expect(this.page).toHaveURL(/\/search/);
    await expect(this.page.locator('img').first()).toBeVisible({ timeout: 20_000 });
    expect(await this.page.locator('img').count()).toBeGreaterThan(3);
  }
}
