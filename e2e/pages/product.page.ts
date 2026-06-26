import { expect, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  async gotoSlug(slug: string) {
    await this.goto(`/products/${slug}`);
  }

  addToCartButton(): Locator {
    return this.page.getByRole('button', { name: /add to (cart|bag|basket)/i }).first();
  }

  async expectAddToCart() {
    await expect(this.addToCartButton()).toBeVisible({ timeout: 15_000 });
  }
}
