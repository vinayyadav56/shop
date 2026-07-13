'use client';

/**
 * P1 framework scratch page (deleted after P2) — exercises the PORTED V1
 * framework hooks end-to-end against the live legacy API: useSettings,
 * useTypes, useProducts (infinite + search DSL + city param), useCart.
 */

import { Suspense } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSettings } from '@/framework/settings';
import { useTypes } from '@/framework/type';
import { useProducts } from '@/framework/product';
import { useCart } from '@/store/quick-cart/cart.context';

function CompatBody() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { types, isLoading: typesLoading } = useTypes({ limit: 15 });
  const { products, isLoading: productsLoading, loadMore, hasMore, paginatorInfo } = useProducts({
    type: 'plants',
    limit: 6,
  });
  const { totalUniqueItems } = useCart();

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', fontSize: 14 }}>
      <h1 className="font-heading text-3xl text-accent">Framework scratch</h1>
      <ul>
        <li data-testid="t">t: {t('text-search')}</li>
        <li data-testid="router">router: {router.pathname} locale={router.locale}</li>
        <li data-testid="settings">settings: {settingsLoading ? 'loading…' : `${settings?.siteTitle ?? 'n/a'} / ${settings?.currency ?? '?'}`}</li>
        <li data-testid="types">types: {typesLoading ? 'loading…' : (types ?? []).map((x: any) => x.slug).join(', ')}</li>
        <li data-testid="products">
          products(type=plants): {productsLoading ? 'loading…' : `${products.length} of ${(paginatorInfo as any)?.total}`} hasMore={String(hasMore)}
        </li>
        <li data-testid="first-product">{(products?.[0] as any)?.name ?? '—'}</li>
        <li data-testid="cart">cart unique items: {totalUniqueItems}</li>
      </ul>
      {hasMore && (
        <button data-testid="load-more" onClick={() => loadMore()}>
          load more ({products.length})
        </button>
      )}
    </div>
  );
}

export default function CompatTestPage() {
  return (
    <Suspense fallback={<p>…</p>}>
      <CompatBody />
    </Suspense>
  );
}
