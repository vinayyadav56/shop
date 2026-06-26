import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  async open() {
    await this.goto('/');
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/PlantAtHome/i);
    // Render signal that's robust across the desktop/mobile home + all card variants: the page
    // paints imagery + a meaningful amount of content. (The real assertion is the console gate.)
    await expect(this.page.locator('img').first()).toBeVisible({ timeout: 20_000 });
    expect(await this.page.locator('img').count()).toBeGreaterThan(3);
  }
}
