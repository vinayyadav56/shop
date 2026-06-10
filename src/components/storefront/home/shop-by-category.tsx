'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { Icon } from '../icons';
import { CenterHeading, ScrollArrows, useTrackScroll } from './section-heading';

function CategoryTile({ category }: { category: Category }) {
  const img =
    (category as any)?.image?.original ||
    (category as any)?.image?.thumbnail ||
    (category as any)?.icon ||
    '';
  return (
    <Link
      href={`/c/${category.slug}`}
      className="group flex w-[44%] shrink-0 snap-start flex-col items-center gap-3 sm:w-[30%] lg:w-auto"
    >
      <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-kraft-200 bg-[radial-gradient(130%_130%_at_30%_15%,#FAF9F6,#E7EEE2_70%,#D2E0CB)] shadow-[0_10px_28px_-20px_rgba(34,48,26,0.4)] transition group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_-18px_rgba(34,48,26,0.35)]">
        {img ? (
          <Image
            src={img}
            alt={category.name}
            fill
            sizes="(max-width:640px) 44vw, (max-width:1024px) 30vw, 14vw"
            className="object-cover p-1.5"
          />
        ) : (
          <Icon.leaf className="h-10 w-10 text-forest-500/60" />
        )}
      </div>
      <span className="text-center text-[12.5px] font-semibold text-forest-900">{category.name}</span>
    </Link>
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
    <section className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <CenterHeading>Shop by Category</CenterHeading>

        <div className="relative mt-8">
          <div
            ref={ref}
            className="flex snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible"
          >
            {isLoading && list.length === 0
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="w-[44%] shrink-0 sm:w-[30%] lg:w-auto">
                    <div className="aspect-square w-full animate-pulse rounded-2xl bg-sage-100" />
                  </div>
                ))
              : list.map((c) => <CategoryTile key={c.id} category={c} />)}
          </div>

          {/* desktop arrows only matter when the row overflows the 7-col grid */}
          {list.length > 7 && (
            <ScrollArrows onLeft={left} onRight={right} className="mt-6 justify-center lg:hidden" />
          )}
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;
