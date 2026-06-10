'use client';
import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Product } from '@/types';
import { Icon } from '../icons';
import { CenterHeading, ScrollArrows, useTrackScroll } from './section-heading';

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
    <section className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="relative flex items-center justify-center">
          <CenterHeading>Best Sellers</CenterHeading>
          <ScrollArrows onLeft={left} onRight={right} className="absolute right-0 hidden sm:flex" />
        </div>

        <div
          ref={ref}
          className="mt-8 flex snap-x gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {isLoading && list.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[46%] shrink-0 sm:w-[230px]">
                  <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-sage-100" />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-sage-100" />
                  <div className="mt-2 h-9 w-full animate-pulse rounded-full bg-sage-100" />
                </div>
              ))
            : list.map((p) => (
                <div key={p.id} className="flex w-[46%] shrink-0 snap-start sm:w-[230px] lg:w-[224px]">
                  <ProductCard product={p} className="w-full" />
                </div>
              ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={viewAllTo}
            className="inline-flex items-center gap-2 rounded-full border border-forest-700 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-forest-700 transition hover:bg-forest-700 hover:text-white"
          >
            View All Plants <Icon.arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
