'use client';
import React from 'react';
import Link from 'next/link';
import { useCategories } from '@/framework/category';
import { CATEGORIES_PER_PAGE } from '@/framework/client/variables';
import { PLACEHOLDER } from '@/components/storefront/v2/_img';
import type { Category } from '@/types';

function Card({ c }: { c: Category }) {
  const [err, setErr] = React.useState(false);
  const img = c?.image?.original || c?.image?.thumbnail;
  const n = c?.products_count ?? 0;
  return (
    <Link href={`/c/${c.slug}`} className="relative block h-[180px] w-[140px] shrink-0 overflow-hidden rounded-[18px] shadow-[0_2px_8px_rgba(34,48,26,0.07)] transition hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(34,48,26,0.09)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={err || !img ? PLACEHOLDER : img} alt={c.name} loading="lazy" onError={() => setErr(true)} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,18,0)_38%,rgba(15,30,18,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <div className="font-pahserif text-[17px] font-semibold leading-[1.08]">{c.name}</div>
        <div className="mt-[3px] text-[11px] text-white/[0.82]">{n > 0 ? `${n}+ items` : 'Shop now'}</div>
      </div>
    </Link>
  );
}

export function Collections() {
  const { categories, isLoading } = useCategories({ limit: CATEGORIES_PER_PAGE, parent: 'null' });
  const list = (categories ?? []).filter((c) => c?.slug).slice(0, 8);
  if (!isLoading && list.length === 0) return null;

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between px-5">
        <h2 className="font-hanken text-[21px] font-extrabold tracking-[-0.01em] text-forest-900">Shop our best collections</h2>
        <Link href="/categories" className="flex shrink-0 items-center gap-[3px] text-[12.5px] font-semibold text-forest-700">
          View all
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E5E2A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
      <div className="pah-scroll flex gap-3 overflow-x-auto px-5 pb-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading && list.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[180px] w-[140px] shrink-0 animate-pulse rounded-[18px] bg-sage-100" />)
          : list.map((c) => <Card key={c.id ?? c.slug} c={c} />)}
      </div>
    </div>
  );
}

export default Collections;
