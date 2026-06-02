import Link from 'next/link';
import { Icon } from '../icons';
import { FadeUp, WordReveal } from '../motion';
import { StorefrontProductCard } from '../product-card';
import type { Product } from '@/types';

const TAGS = ['Bestseller', 'Trending', undefined, undefined, 'New', undefined, undefined, 'Value'];

export function ProductGrid({
  products,
  typeSlug,
  isLoading,
  eyebrow,
  title,
  viewAllTo,
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
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section
      id="products"
      className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
        <div>
          <FadeUp>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              {eyebrow}
            </p>
          </FadeUp>
          <h2 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-forest sm:text-5xl lg:text-6xl">
            <WordReveal text={title} />
          </h2>
        </div>
        {viewAllTo && (
          <FadeUp delay={0.1}>
            <Link
              href={viewAllTo}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white"
            >
              View more <Icon.arrow className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-mint"
              />
            ))
          : products.map((p, i) => (
              <FadeUp key={p.id ?? p.slug} delay={(i % 4) * 0.05}>
                <StorefrontProductCard product={p} tag={TAGS[i % TAGS.length]} />
              </FadeUp>
            ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-8 py-3.5 text-sm font-bold text-forest transition hover:bg-forest hover:text-white disabled:opacity-60"
          >
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
}
