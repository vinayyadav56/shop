'use client';
import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Product } from '@/types';
import { Icon } from '../icons';
import { useTrackScroll } from '../home/section-heading';
import { PlantAtHomeCardSkeleton } from '@/components/products/cards/plantathome';

const PlantAtHomeCard = dynamic(
  () => import('@/components/products/cards/plantathome'),
);

const TILE =
  'flex w-[46%] min-w-0 shrink-0 snap-start sm:w-[230px] lg:w-[calc(16.66%-14px)]';

const OUTLINE_BTN =
  'items-center justify-center rounded-md border border-[#12281A]/30 px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#12281A] transition hover:border-[#12281A] hover:bg-[#12281A] hover:text-[#F0EAD8]';

/** Best Sellers — cream band, centered serif heading, 6-up product rail. */
export function BestSellers2({
  products,
  isLoading,
}: {
  products?: Product[];
  isLoading?: boolean;
}) {
  const { ref, left, right } = useTrackScroll();
  const list = (products ?? []).slice(0, 6);
  const loading = Boolean(isLoading) && list.length === 0;

  return (
    <section className="bg-[#F2EFE5]">
      <div className="mx-auto max-w-[88rem] px-4 py-14 sm:px-6 sm:py-20">
        <div className="relative">
          {/* eyebrow + serif heading, centered */}
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-6 bg-[#C9A24B]/60" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#C9A24B] sm:text-[11px]">
              Best Sellers
            </span>
            <span aria-hidden className="h-px w-6 bg-[#C9A24B]/60" />
          </div>
          <h2 className="mt-3 text-center font-cormorant text-[1.7rem] font-medium leading-tight text-[#12281A] sm:text-[2.2rem]">
            Loved by 10,00,000+ Plant Parents
          </h2>

          {/* view all — top-right of the row area on sm+ */}
          <Link
            href="/plants/search"
            className={`absolute right-0 top-0 hidden h-10 sm:flex ${OUTLINE_BTN}`}
          >
            View All
          </Link>

          {/* product rail */}
          <div className="relative mt-8 sm:mt-10">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={left}
              className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#C9A24B]/40 bg-white text-[#C9A24B] shadow-sm transition hover:bg-[#C9A24B] hover:text-[#12281A] sm:grid"
            >
              <Icon.chevron className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={right}
              className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#C9A24B]/40 bg-white text-[#C9A24B] shadow-sm transition hover:bg-[#C9A24B] hover:text-[#12281A] sm:grid"
            >
              <Icon.chevron className="h-4 w-4" />
            </button>

            <div
              ref={ref}
              className="flex min-w-0 snap-x gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={TILE}>
                      <PlantAtHomeCardSkeleton />
                    </div>
                  ))
                : list.map((p) => (
                    <div key={p.id} className={TILE}>
                      <PlantAtHomeCard product={p} className="w-full" />
                    </div>
                  ))}
              {!loading && list.length === 0 && (
                <p className="w-full py-10 text-center text-[13px] text-stone-500">
                  New arrivals coming soon to this collection.
                </p>
              )}
            </div>
          </div>

          {/* view all — full-width below the track on mobile */}
          <Link
            href="/plants/search"
            className={`mt-5 flex h-11 w-full sm:hidden ${OUTLINE_BTN}`}
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BestSellers2;
