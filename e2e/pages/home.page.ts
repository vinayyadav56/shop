import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  async open() {
    await this.goto('/');
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/PlantAtHome/i);
    // Deterministic render signal (works across desktop/mobile home + all card variants).
    // The high-value assertion is the console-error gate in the spec.
    await expect(this.page.locator('img').first()).toBeVisible({ timeout: 20_000 });
  }
}
