import { test, expect } from '@playwright/test';

// Storefront auth + account guard spec (staging shop).
// Shop authenticates against the legacy /api (railway staging).
// A pre-seeded throwaway customer is expected; override via env.
const BASE = process.env.SHOP_BASE ?? 'https://plantathome-shop-staging.vercel.app';
// Seeded 2026-07-27 via /api/register on staging (the old customer@… account's
// password no longer matches).
const EMAIL = process.env.QA_EMAIL ?? 'qa-customer-e2e@plantathome.test';
const PASSWORD = process.env.QA_PASSWORD ?? 'Passw0rd!';

// Pre-seed the shopping city everywhere: the blocking first-visit city dialog
// otherwise sits over the page and intercepts every Login click. Its own
// behaviour is covered in the golden-path spec. Also switch OFF the staging
// Agentation toolbar — it is default-on for humans, but its localhost:4747
// polls log CORS console errors that would poison assertions.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pah_customer_city', 'Delhi');
    localStorage.setItem('pah-agentation', 'off');
  });
});

test.describe('storefront auth', () => {
  test('signin page renders login + register forms', async ({ page }) => {
    await page.goto(`${BASE}/signin`, { waitUntil: 'domcontentloaded' });
    // The login identifier takes an email OR a mobile number, so it is type=text (#email).
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('input[type=password]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i }).first()).toBeVisible();
    await expect(page.getByRole('tab', { name: /sign up/i })).toBeVisible();
  });

  test('sign-up: "Already have an account? Login" switches to the login form', async ({ page }) => {
    await page.goto(`${BASE}/signin?mode=register`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/already have an account\?/i)).toBeVisible({ timeout: 20_000 });
    // The tabs are role=tab, so on Sign Up the only "Login" button is that link. A click
    // that lands before hydration is swallowed — retry until the tab really switches.
    await expect(async () => {
      await page.getByRole('button', { name: /^login$/i }).first().click();
      await expect(page.getByRole('tab', { name: /^login$/i })).toHaveAttribute('aria-selected', 'true', { timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    await expect(page.getByText(/don.t have an account\?/i)).toBeVisible();
  });

  test('sign-up with a registered email: the field says so, and "Log in instead" switches to login', async ({ page }) => {
    // The API's duplicate answer is mocked (its real wording and shape), so this never
    // creates an account in any environment.
    await page.route(
      (url) => url.pathname.endsWith('/register'),
      async (route) => {
        const req = route.request();
        const cors = {
          'access-control-allow-origin': req.headers()['origin'] ?? '*',
          'access-control-allow-credentials': 'true',
          'access-control-allow-headers': '*',
          'access-control-allow-methods': 'POST, OPTIONS',
        };
        if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
        if (req.method() !== 'POST') return route.continue();
        return route.fulfill({
          status: 422,
          headers: { ...cors, 'content-type': 'application/json' },
          body: JSON.stringify({
            email: ['This email is already registered. Sign in instead, or use a different email.'],
          }),
        });
      },
    );
    await page.goto(`${BASE}/signin?mode=register`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/already have an account\?/i)).toBeVisible({ timeout: 20_000 });
    await page.locator('#first_name').fill('QA');
    await page.locator('#email').fill(EMAIL);
    await page.locator('#contact').click();
    await page.keyboard.type('9876543210');
    await page.locator('input[type=password]').first().fill('Passw0rd!x');
    await expect(async () => {
      await page.getByRole('button', { name: /^sign up$/i }).click();
      await expect(page.getByText(/already registered\?/i)).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await expect(page.getByText(/this email is already registered/i)).toBeVisible();
    await page.getByRole('button', { name: /log in instead/i }).click();
    await expect(page.getByRole('tab', { name: /^login$/i })).toHaveAttribute('aria-selected', 'true');
  });

  test('empty submit triggers client validation', async ({ page }) => {
    await page.goto(`${BASE}/signin`, { waitUntil: 'load' });
    const login = page.getByRole('button', { name: /^login$/i }).first();
    await login.click().catch(() => {});
    await page.waitForTimeout(800);
    // A click that lands before hydration is silently swallowed (no handler
    // wired yet) — retry once instead of failing on framework timing.
    const body = (await page.locator('body').textContent()) ?? '';
    if (!/required|enter|invalid|must/i.test(body)) {
      await login.click().catch(() => {});
      await page.waitForTimeout(800);
    }
    await expect(page.locator('body')).toContainText(/required|enter|invalid|must/i);
  });

  test('wrong credentials shows an error and stays on /signin', async ({ page }) => {
    await page.goto(`${BASE}/signin`, { waitUntil: 'domcontentloaded' });
    await page.locator('#email').fill(EMAIL);
    await page.locator('input[type=password]').first().fill('definitely-wrong-pw');
    await page.getByRole('button', { name: /^login$/i }).first().click();
    await page.waitForTimeout(2500);
    expect(page.url()).toContain('/signin');
    await expect(page.locator('body')).toContainText(/wrong|incorrect|credential|invalid|not match/i);
  });

  test('successful login sets auth_token cookie and can reach /profile', async ({ page, context }) => {
    await page.goto(`${BASE}/signin`, { waitUntil: 'domcontentloaded' });
    await page.locator('#email').fill(EMAIL);
    await page.locator('input[type=password]').first().fill(PASSWORD);
    await page.getByRole('button', { name: /^login$/i }).first().click();
    await page.waitForTimeout(3500);
    const cookie = (await context.cookies()).find((c) => c.name === 'auth_token');
    expect(cookie, 'auth_token cookie should be set after login').toBeTruthy();

    await page.goto(`${BASE}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    // The profile shows the account email as text (it can't be edited once set),
    // not inside an input.
    await expect(page.getByText(EMAIL, { exact: false }).first()).toBeVisible();
  });
});

test.describe('protected-route guard (guest)', () => {
  for (const path of ['/profile', '/orders', '/wishlists', '/change-password', '/orders/SOMERANDOM123']) {
    test(`guest ${path} is gated with a login form`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);
      // PrivateRoute renders LoginView in place (URL is not redirected to /signin).
      await expect(page.locator('input[type=password]').first()).toBeVisible();
      await expect(page.locator('body')).toContainText(/login|sign in|password/i);
    });
  }
});
