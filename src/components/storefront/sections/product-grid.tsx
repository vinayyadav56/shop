import Link from 'next/link';
import { Icon } from '../icons';
import { FadeUp, WordReveal } from '../motion';
import { StorefrontProductCard } from '../product-card';
import type { Product } from '@/types';

export function ProductGrid({
  products,
  typeSlug,
  isLoading,
  eyebrow,
  title,
  viewAllTo,
  viewAllLabel,
  tint,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: {
  products: Product[];
  typeSlug: string;
  isLoading?: boolean;
  eyebrow: string;
  title: string;
  viewAllTo?: string;
  viewAllLabel?: string;
  tint?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section id="products" className={tint ? 'bg-cream-100' : ''}>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <FadeUp>
              <p className="mb-2.5 font-display text-xs font-medium uppercase tracking-[0.28em] text-forest-700">
                {eyebrow}
              </p>
            </FadeUp>
            <h2 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-forest-900 sm:text-5xl">
              <WordReveal text={title} />
            </h2>
          </div>
          {viewAllTo && (
            <FadeUp delay={0.1}>
              <Link
                href={viewAllTo}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-forest-700 px-[22px] py-3 text-[15px] font-semibold text-forest-800 transition hover:bg-sage-100"
              >
                {viewAllLabel ?? 'View all'}
                <Icon.arrow className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[5/4] animate-pulse rounded-lg bg-sage-200" />
              ))
            : products.map((p, i) => (
                <FadeUp key={p.id ?? p.slug} delay={(i % 4) * 0.05}>
                  <StorefrontProductCard product={p} />
                </FadeUp>
              ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-7 py-3 text-[15px] font-semibold text-white transition hover:bg-forest-800 disabled:opacity-60"
            >
              {isLoadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
