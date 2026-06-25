'use client';
import React from 'react';
import Link from 'next/link';
import { useProducts } from '@/framework/product';
import { useTypes } from '@/framework/type';
import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { ProductCard } from './product-card';
import { cn } from '@/lib/cn';

export function BestSellers() {
  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  // Vertical filter chips: "All" + one per vertical (Plants, Tools, Farmbox…).
  const chips = [{ label: 'All', slug: null as string | null }, ...((types ?? []).map((t) => ({ label: t.name, slug: t.slug as string })))];
  const [active, setActive] = React.useState<string | null>(null);

  const { products, isLoading } = useProducts({
    limit: 12,
    ...(active ? { type: active } : {}),
  });
  const list = (products ?? []).filter(Boolean).slice(0, 12);

  return (
    <div>
      <div className="mb-1 px-5">
        <div className="mb-[5px] font-hanken text-[9.5px] font-bold uppercase tracking-[0.2em] text-forest-600">Best Sellers</div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-1.5 font-hanken text-[18px] font-extrabold tracking-[-0.01em] text-forest-900">
            Our Most Loved Plants
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4E8244" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20c-4 0-7-3-7-7 0-1 .2-2 .6-2.8C8 11 11 13 11 17Z" /><path d="M11 20c4 0 9-3 9-9 0-2-.5-4-1-5-3 .5-8 2.5-8 9Z" /></svg>
          </h2>
          <Link href="/plants/search" className="flex shrink-0 items-center gap-[3px] text-[12.5px] font-semibold text-forest-700">
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E5E2A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>

      <div className="pah-scroll flex gap-[9px] overflow-x-auto px-5 pb-1 pt-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => {
          const on = c.slug === active;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setActive(c.slug)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-hanken text-[13px] font-semibold capitalize transition active:scale-95',
                on ? 'border-forest-700 bg-forest-700 text-white shadow-[0_2px_8px_rgba(34,48,26,0.07)]' : 'border-kraft-200 bg-white text-stone-600',
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="pah-scroll flex gap-3 overflow-x-auto px-5 pb-1 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[165px] shrink-0 overflow-hidden rounded-[18px] border border-kraft-200 bg-white">
                <div className="h-[150px] animate-pulse bg-sage-100" />
                <div className="space-y-2 p-3"><div className="h-3 w-3/4 animate-pulse rounded bg-sage-100" /><div className="h-3 w-1/2 animate-pulse rounded bg-sage-100" /></div>
              </div>
            ))
          : list.length > 0
          ? list.map((p) => <ProductCard key={p.id} product={p} />)
          : <p className="py-6 text-[13px] text-stone-500">No products here yet — try another filter.</p>}
      </div>
    </div>
  );
}

export default BestSellers;
