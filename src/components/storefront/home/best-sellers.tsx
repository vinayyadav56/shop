'use client';
import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Product } from '@/types';
import { Icon } from '../icons';
import { CenterHeading, useTrackScroll } from './section-heading';
import { useTypes } from '@/framework/type';
import { useProducts } from '@/framework/product';
import { TYPES_PER_PAGE } from '@/framework/client/variables';

const ProductCard = dynamic(() => import('@/components/products/cards/card'));

/** Vertical tab pills — lets the home sell all three worlds, not just plants. */
export function VerticalTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (slug: string) => void;
}) {
  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  const list = (types ?? []).slice(0, 3);
  if (list.length < 2) return null;
  return (
    <div className="mt-5 flex justify-center">
      <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-forest-900/10 bg-white/75 p-1.5 backdrop-blur-[2px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((t) => {
          const on = t.slug === active;
          return (
            <button
              key={t.slug}
              type="button"
              onClick={() => onChange(t.slug)}
              className={`shrink-0 rounded-full px-5 py-2 text-[11.5px] font-bold uppercase tracking-[0.12em] transition ${
                on
                  ? 'bg-gradient-to-r from-[#175840] to-[#2E8B63] text-white shadow-sm'
                  : 'text-forest-800/75 hover:text-forest-900'
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BestSellers({
  products,
  isLoading,
}: {
  products?: Product[];
  isLoading?: boolean;
}) {
  const { ref, left, right } = useTrackScroll();
  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  const homeSlug =
    (types ?? []).find((t) => t?.settings?.isHome)?.slug ?? (types ?? [])[0]?.slug ?? 'plants';
  const [picked, setPicked] = React.useState<string | null>(null);
  const activeSlug = picked ?? homeSlug;
  const isHomeTab = activeSlug === homeSlug;

  // SSR prop already covers the home vertical; other tabs fetch via the same hook.
  const { products: tabProducts, isLoading: tabLoading } = useProducts({
    type: activeSlug,
    limit: 12,
  });
  const list = ((isHomeTab && (products?.length ?? 0) > 0 ? products : tabProducts) ?? []).slice(0, 12);
  const loading = isHomeTab ? Boolean(isLoading) && list.length === 0 : tabLoading;

  return (
    <section className="bg-gradient-to-b from-[#E6F4EC] to-[#DCF0E5]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
        <CenterHeading>Best Sellers</CenterHeading>
        <VerticalTabs active={activeSlug} onChange={setPicked} />

        <div className="relative mt-7">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={left}
            className="absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-forest-800/30 bg-white text-forest-800 shadow-sm transition hover:border-forest-600 hover:text-forest-600 sm:grid"
          >
            <Icon.chevron className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={right}
            className="absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-forest-800/30 bg-white text-forest-800 shadow-sm transition hover:border-forest-600 hover:text-forest-600 sm:grid"
          >
            <Icon.chevron className="h-4 w-4" />
          </button>

          <div
            ref={ref}
            className="flex min-w-0 snap-x gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-[46%] shrink-0 sm:w-[230px] lg:w-[calc(20%-13px)]">
                    <div className="aspect-square w-full animate-pulse rounded-xl bg-[#D9EDE2]" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-[#D9EDE2]" />
                    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-[#D9EDE2]" />
                    <div className="mt-3 h-9 w-full animate-pulse rounded-md bg-[#D9EDE2]" />
                  </div>
                ))
              : list.map((p) => (
                  <div
                    key={p.id}
                    className="flex w-[46%] shrink-0 snap-start sm:w-[230px] lg:w-[calc(20%-13px)]"
                  >
                    <ProductCard product={p} className="w-full" />
                  </div>
                ))}
            {!loading && list.length === 0 && (
              <p className="w-full py-10 text-center text-[13px] text-stone-500">
                New arrivals coming soon to this collection.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={`/${activeSlug}/search`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#175840] to-[#2E8B63] px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-28px_rgba(23,88,64,0.45)] transition hover:brightness-110 sm:w-auto"
          >
            View All <Icon.arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
