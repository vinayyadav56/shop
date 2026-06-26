# Storefront E2E / QA suite (Playwright POM)

Isolated Playwright suite for the PlantAtHome storefront. It has its **own** `package.json` so it
never touches the app's `yarn.lock` or `next build`, and runs against a **deployed** URL.

## Run
```bash
cd shop/e2e
npm install
npx playwright install            # one-time: download browsers
npm test                          # all projects (chromium/firefox/webkit + mobile) vs staging
npm run test:chromium             # one browser, fastest
BASE_URL=https://plantathome.in npm test   # prod smoke
npm run report                    # open the last HTML report
```

## What it checks
- **Smoke** (`tests/smoke.spec.ts`): home/listing/PDP load, add-to-cart is present, unknown
  product route renders not-found chrome, no broken images — and the **0-app-console-error gate**
  (the assertion that caught the CORS analytics bug + the SSR cart-hydration storm).
- **A11y** (`tests/a11y.spec.ts`): axe-core WCAG 2 A/AA, failing only on serious/critical.

## Layout (Page Object Model)
- `playwright.config.ts` — browser/device matrix, `BASE_URL`, traces/screenshots/video on failure.
- `fixtures/test-base.ts` — the console-error collector fixture + page-object fixtures (third-party
  analytics noise is filtered so the gate asserts on OUR errors only).
- `pages/*.page.ts` — Home / Listing / Product page objects (resilient role/URL locators; the
  storefront currently has no `data-testid`s — adding them would make locators even more stable).

## CI
Wire `cd shop/e2e && npm ci && npx playwright install --with-deps && npm test` as a post-deploy gate
(staging first, then prod) so a regression that reintroduces console errors / hydration / broken
flows fails the pipeline.

## Next coverage (backlog)
Checkout (COD + guest), search/filter/sort/pagination, auth (login/register/forgot/session-expiry),
wishlist, cart persistence across reload, Lighthouse perf budgets. Add `data-testid` to key
interactive nodes (add-to-cart, cart drawer, checkout steps) for durable selectors.
