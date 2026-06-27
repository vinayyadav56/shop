'use client';
import React from 'react';
import type { Category, Product } from '@/types';
import { HeroPlant } from './hero-plant';
import { CategoryRow } from './category-row';
import { SpringSaleBand } from './spring-sale-band';
import { Collections } from './collections';
import { BestSellers } from './best-sellers';
import { WhyPlants } from './why-plants';
import { GiftingBand } from './gifting-band';
import { TrustRow } from './trust-row';

/**
 * "THE PLANT COMPANY"-style homepage — the mockup the user provided, wired to live
 * data. Rendered only for the home type (see plantathome.tsx). The cinematic
 * 3-vertical / video layout is preserved for the per-vertical pages.
 */
export function PlantCompanyHome({
  categories,
  catLoading,
  products,
  productsLoading,
}: {
  categories?: Category[];
  catLoading?: boolean;
  products?: Product[];
  productsLoading?: boolean;
}) {
  return (
    <>
      {/* Section order matches the approved design reference:
          Hero → Category → Spring Sale → Collections → Bestsellers → Why Plants → Gifting → Trust */}
      <HeroPlant />
      <CategoryRow />
      <SpringSaleBand />
      <Collections />
      <BestSellers products={products} isLoading={productsLoading} />
      <WhyPlants />
      <GiftingBand />
      <TrustRow />
    </>
  );
}

export default PlantCompanyHome;
