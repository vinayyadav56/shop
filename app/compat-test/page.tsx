'use client';

/**
 * P0 compat scratch page (deleted after P1) — exercises every shim:
 * next-i18next t(), next/router useRouter, react-query useQuery/useInfiniteQuery
 * through the tsconfig/turbopack aliases, and the /rest-api proxy to the live
 * legacy marvel API.
 */

import { Suspense } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useQuery, useInfiniteQuery } from 'react-query';
import axios from 'axios';

function CompatBody() {
  const { t } = useTranslation('common');
  const router = useRouter();

  const settings = useQuery<any>(['/settings-test'], () =>
    axios.get('/rest-api/settings', { params: { language: 'en' } }).then((r) => r.data),
  );

  const products = useInfiniteQuery<any>(
    ['/products-test', { limit: 4 }],
    ({ queryKey, pageParam }) =>
      axios
        .get('/rest-api/products', {
          params: {
            ...(queryKey[1] as object),
            ...(pageParam ?? {}),
            searchJoin: 'and',
            search: 'status:publish;visibility:visibility_public',
            with: 'type;author',
          },
        })
        .then((r) => r.data),
    {
      getNextPageParam: ({ current_page, last_page }: any) =>
        last_page > current_page && { page: current_page + 1 },
    },
  );

  const rows = products.data?.pages?.flatMap((p: any) => p.data) ?? [];

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', fontSize: 14 }}>
      <h1 className="font-heading text-3xl text-accent">Compat scratch</h1>
      <ul>
        <li data-testid="t-plain">t plain: {t('text-search')}</li>
        <li data-testid="t-ns">t ns: {t('common:text-home')}</li>
        <li data-testid="t-missing">t missing: {t('zz-key-does-not-exist')}</li>
        <li data-testid="router">
          router: path={router.pathname} q={JSON.stringify(router.query)} locale={router.locale}
        </li>
        <li data-testid="settings">
          settings: {settings.isLoading ? 'loading…' : settings.data?.options?.siteTitle ?? 'n/a'} (currency{' '}
          {settings.data?.options?.currency ?? '?'})
        </li>
        <li data-testid="products">
          products page1: {products.isLoading ? 'loading…' : `${rows.length} items`} hasNext=
          {String(products.hasNextPage)}
        </li>
        <li data-testid="first-product">{rows[0]?.name ?? '—'}</li>
      </ul>
      {products.hasNextPage && (
        <button data-testid="load-more" onClick={() => products.fetchNextPage()}>
          load more ({rows.length})
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
