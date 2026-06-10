'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { Icon } from '../icons';
import { CenterHeading, useTrackScroll } from './section-heading';

function CategoryTile({ category }: { category: Category }) {
  const img =
    (category as any)?.image?.original ||
    (category as any)?.image?.thumbnail ||
    (category as any)?.icon ||
    '';
  return (
    <Link
      href={`/c/${category.slug}`}
      className="group block w-[46%] shrink-0 snap-start rounded-xl border border-kraft-200 bg-white p-2 shadow-[0_14px_34px_-24px_rgba(34,48,26,0.25)] transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(34,48,26,0.32)] sm:w-[30%] lg:w-[13.2%]"
    >
      <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-lg bg-[radial-gradient(130%_130%_at_30%_15%,#FAF9F6,#E7EEE2_70%,#D2E0CB)]">
        {img ? (
          <Image
            src={img}
            alt={category.name}
            fill
            sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 14vw"
            className="object-cover"
          />
        ) : (
          <Icon.leaf className="h-10 w-10 text-forest-500/60" />
        )}
      </div>
      <div className="pb-3 pt-2 text-center text-[13px] font-semibold text-forest-900">
        {category.name}
      </div>
    </Link>
  );
}

function ArrowButton({
  dir,
  onClick,
}: {
  dir: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-kraft-300 bg-white text-forest-800 shadow-sm transition hover:border-forest-500 hover:text-forest-600 sm:grid ${
        dir === 'left' ? '-left-1' : '-right-1'
      }`}
    >
      <Icon.chevron className={`h-4 w-4 ${dir === 'left' ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function ShopByCategory({
  categories,
  isLoading,
}: {
  categories?: Category[];
  isLoading?: boolean;
}) {
  const { ref, left, right } = useTrackScroll();
  const list = (categories ?? []).slice(0, 12);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
        <CenterHeading>Shop by Category</CenterHeading>

        <div className="relative mt-8">
          <div
            ref={ref}
            className="flex min-w-0 snap-x gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
          >
            {isLoading && list.length === 0
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[46%] shrink-0 snap-start rounded-xl border border-kraft-200 bg-white p-2 sm:w-[30%] lg:w-[13.2%]"
                  >
                    <div className="aspect-square w-full animate-pulse rounded-lg bg-sage-100" />
                    <div className="mx-auto mb-3 mt-2 h-3 w-2/3 animate-pulse rounded bg-sage-100" />
                  </div>
                ))
              : list.map((c) => <CategoryTile key={c.id} category={c} />)}
          </div>

          <ArrowButton dir="left" onClick={left} />
          <ArrowButton dir="right" onClick={right} />
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;
