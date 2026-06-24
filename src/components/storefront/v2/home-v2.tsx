'use client';
import React from 'react';
import { useProducts, usePopularProducts, useBestSellingProducts } from '@/framework/product';
import { Hero } from './hero';
import { CategoryRail } from './category-rail';
import { DealStrip } from './deal-strip';
import { TrustBand } from './trust-band';
import { ProductRail } from './product-rail';
import { EditorialBand } from './editorial-band';

/**
 * Revamped storefront home (v2). Renders inside HomeShellV2 (header + footer +
 * bottom nav). Binds to the existing REST data hooks (city-scoped automatically).
 */
export default function HomeV2(_props: { variables?: any }) {
  const { products: bestSelling, isLoading: bestLoading } = useBestSellingProducts({
    type_slug: 'plants',
    limit: 12,
  });
  const { products: popular, isLoading: popLoading } = usePopularProducts({
    type_slug: 'plants',
    limit: 12,
  });
  const { products: fresh, isLoading: freshLoading } = useProducts({
    type: 'plants',
    limit: 12,
    orderBy: 'created_at',
    sortedBy: 'DESC',
  });
  // General fallback so the flagship "Best-selling" rail always has content even
  // if the best-selling endpoint is empty for this city/catalog.
  const { products: general, isLoading: generalLoading } = useProducts({
    type: 'plants',
    limit: 12,
  });

  const bestList = bestSelling?.length ? bestSelling : general;
  const bestBusy = bestLoading || (!bestSelling?.length && generalLoading);

  return (
    <div className="font-jakarta bg-canvas pb-20 text-brand-900 antialiased lg:pb-10">
      <Hero />
      <CategoryRail />
      <DealStrip />
      <ProductRail
        eyebrow="Most loved"
        title="Best-selling plants"
        href="/plants/search"
        products={bestList}
        isLoading={bestBusy}
      />
      <TrustBand />
      <ProductRail
        eyebrow="Just in"
        title="New arrivals"
        href="/plants/search"
        products={fresh}
        isLoading={freshLoading}
      />
      <EditorialBand />
      <ProductRail
        eyebrow="Trending now"
        title="Popular near you"
        href="/plants/search"
        products={popular}
        isLoading={popLoading}
      />
    </div>
  );
}
