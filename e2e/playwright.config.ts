import { defineConfig, devices } from '@playwright/test';

/**
 * Storefront e2e/QA config. Targets a DEPLOYED storefront (default: staging) so the suite
 * doubles as a smoke gate after every deploy. Override with BASE_URL.
 *
 *   BASE_URL=https://plantathome.in npx playwright test        # prod smoke
 *   npx playwright test --project=chromium                      # one browser
 *
 * Cross-browser (chromium/firefox/webkit) + a representative device matrix. Traces,
 * screenshots and video are captured on failure for triage.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.BASE_URL || 'https://plantathome-shop-staging.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
});
