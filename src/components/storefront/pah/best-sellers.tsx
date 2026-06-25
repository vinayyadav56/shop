'use client';
import React from 'react';
import Link from 'next/link';
import { useProducts } from '@/framework/product';
import { ProductCard } from './product-card';
import { cn } from '@/lib/cn';

// Filter chips mapped to real plant category slugs (precedent: home category links).
const FILTERS: { label: string; slug?: string }[] = [
  { label: 'All' },
  { label: 'Indoor', slug: 'indoor' },
  { label: 'Outdoor', slug: 'outdoor' },
  { label: 'Air Purifying', slug: 'air-purifying' },
  { label: 'Pet Friendly', slug: 'pet-friendly' },
  { label: 'Low Light', slug: 'indoor' },
];

export function BestSellers() {
  const [active, setActive] = React.useState('All');
  const current = FILTERS.find((f) => f.label === active);
  const { products, isLoading } = useProducts({
    type: 'plants',
    limit: 8,
    ...(current?.slug ? { categories: current.slug } : {}),
  });
  const list = (products ?? []).filter(Boolean).slice(0, 8);

  return (
    <div>
      <div className="px-5">
        <div className="mb-[5px] font-hanken text-[9.5px] font-bold uppercase tracking-[0.2em] text-forest-600">Best Sellers</div>
        <div className="flex items-baseline justify-between">
          <h2 className="font-hanken text-[21px] font-extrabold tracking-[-0.01em] text-forest-900">Our most loved picks</h2>
          <Link href="/plants/search" className="flex shrink-0 items-center gap-[3px] text-[12.5px] font-semibold text-forest-700">
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E5E2A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>

      <div className="pah-scroll flex gap-[9px] overflow-x-auto px-5 pb-1 pt-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => {
          const on = f.label === active;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setActive(f.label)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-hanken text-[13px] font-semibold transition active:scale-95',
                on ? 'border-forest-700 bg-forest-700 text-white shadow-[0_2px_8px_rgba(34,48,26,0.07)]' : 'border-kraft-200 bg-white text-stone-600',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3.5 px-5 pt-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[18px] border border-kraft-200 bg-white">
                <div className="h-[150px] animate-pulse bg-sage-100" />
                <div className="space-y-2 p-3"><div className="h-3 w-3/4 animate-pulse rounded bg-sage-100" /><div className="h-3 w-1/2 animate-pulse rounded bg-sage-100" /></div>
              </div>
            ))
          : list.length > 0
          ? list.map((p) => <ProductCard key={p.id} product={p} />)
          : <p className="col-span-2 py-6 text-center text-[13px] text-stone-500">No plants here yet — try another filter.</p>}
      </div>
    </div>
  );
}

export default BestSellers;
