'use client';
import React from 'react';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { useCategories } from '@/framework/category';
import { CATEGORIES_PER_PAGE } from '@/framework/client/variables';
import { SectionHeader, HScroll } from './rail';
import { PLACEHOLDER } from './_img';
import type { Category } from '@/types';

function Tile({ c }: { c: Category }) {
  const [err, setErr] = React.useState(false);
  const img = c?.image?.original || c?.image?.thumbnail;
  return (
    <Link href={`/c/${c.slug}`} className="group/cat flex w-[92px] flex-col items-center gap-2 sm:w-[112px]">
      <span className="relative grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-2xl bg-brand-50 ring-1 ring-line2 transition group-hover/cat:ring-2 group-hover/cat:ring-cta/50 sm:h-[112px] sm:w-[112px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={err || !img ? PLACEHOLDER : img}
          alt={c.name}
          loading="lazy"
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover/cat:scale-110"
        />
      </span>
      <span className="line-clamp-2 text-center text-[12px] font-semibold leading-tight text-brand-900">{c.name}</span>
    </Link>
  );
}

export function CategoryRail() {
  const { categories, isLoading } = useCategories({ limit: CATEGORIES_PER_PAGE, parent: 'null' });
  const list = (categories ?? []).filter((c) => c?.slug).slice(0, 14);
  if (!isLoading && list.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-9">
      <SectionHeader eyebrow="Browse" title="Shop by category" href="/categories" />
      <HScroll>
        {isLoading && list.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex w-[92px] flex-col items-center gap-2 sm:w-[112px]">
                <div className="h-[92px] w-[92px] animate-pulse rounded-2xl bg-brand-50 sm:h-[112px] sm:w-[112px]" />
                <div className="h-3 w-14 animate-pulse rounded bg-brand-50" />
              </div>
            ))
          : list.map((c) => <Tile key={c.id ?? c.slug} c={c} />)}
        <Link href="/categories" className="flex w-[92px] flex-col items-center gap-2 sm:w-[112px]">
          <span className="grid h-[92px] w-[92px] place-items-center rounded-2xl border border-dashed border-brand/30 bg-white text-brand transition hover:border-cta sm:h-[112px] sm:w-[112px]">
            <LayoutGrid className="h-6 w-6" />
          </span>
          <span className="text-center text-[12px] font-semibold text-brand-900">All categories</span>
        </Link>
      </HScroll>
    </section>
  );
}

export default CategoryRail;
