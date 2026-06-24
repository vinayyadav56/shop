'use client';
import React from 'react';
import type { Category, Product } from '@/types';
import { HeroPlant } from './hero-plant';
import { HeroSearch } from './hero-search';
import { CategoryRow } from './category-row';
import { SpringSaleBand } from './spring-sale-band';
import { Collections } from './collections';
import { BestSellers } from './best-sellers';
import { GiftingBand } from './gifting-band';
import { TrustRow } from './trust-row';
import { NewsletterSocial } from './newsletter-social';

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
          Hero → Search → Categories → Special Offer → Collections → Bestsellers → Trust → Gifting */}
      <HeroPlant />
      <HeroSearch />
      <CategoryRow />
      <SpringSaleBand />
      <Collections />
      <BestSellers products={products} isLoading={productsLoading} />
      <TrustRow />
      <GiftingBand />
      <NewsletterSocial />
    </>
  );
}

export default PlantCompanyHome;
