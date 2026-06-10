'use client';
import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Product } from '@/types';
import { Icon } from '../icons';
import { CenterHeading, useTrackScroll } from './section-heading';

const ProductCard = dynamic(() => import('@/components/products/cards/card'));

export function BestSellers({
  products,
  isLoading,
  viewAllTo = '/plants/search',
}: {
  products?: Product[];
  isLoading?: boolean;
  viewAllTo?: string;
}) {
  const { ref, left, right } = useTrackScroll();
  const list = (products ?? []).slice(0, 12);

  return (
    <section className="bg-[#F3F7F1]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
        <CenterHeading>Best Sellers</CenterHeading>

        <div className="relative mt-8">
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
            className="flex snap-x gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
          >
            {isLoading && list.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-[46%] shrink-0 sm:w-[230px] lg:w-[calc(20%-13px)]">
                    <div className="aspect-square w-full animate-pulse rounded-xl bg-sage-100" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-sage-100" />
                    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-sage-100" />
                    <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-sage-100" />
                    <div className="mt-3 h-9 w-full animate-pulse rounded-md bg-sage-100" />
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
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={viewAllTo}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-forest-800 px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-forest-800 transition hover:bg-forest-800 hover:text-white sm:w-auto"
          >
            View All Plants <Icon.arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
