'use client';
import React from 'react';
import { SectionHeader, HScroll } from './rail';
import { ProductCard } from './product-card';
import type { Product } from '@/types';

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line2 bg-white">
      <div className="aspect-[4/5] bg-brand-50" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 rounded bg-brand-50" />
        <div className="h-3 w-2/5 rounded bg-brand-50" />
        <div className="h-4 w-1/2 rounded bg-brand-50" />
      </div>
    </div>
  );
}

export function ProductRail({
  eyebrow,
  title,
  href,
  products,
  isLoading,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  products?: Product[];
  isLoading?: boolean;
}) {
  const list = (products ?? []).filter(Boolean).slice(0, 14);
  if (!isLoading && list.length === 0) return null;

  const itemW = 'w-[150px] sm:w-[185px] lg:w-[210px]';

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-9">
      <SectionHeader eyebrow={eyebrow} title={title} href={href} />
      <HScroll itemClassName={itemW}>
        {isLoading && list.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : list.map((p) => <ProductCard key={p.id} product={p} />)}
      </HScroll>
    </section>
  );
}

export default ProductRail;
