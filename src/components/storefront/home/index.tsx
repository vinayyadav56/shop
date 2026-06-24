'use client';
import React from 'react';
import type { Category, Product } from '@/types';
import { HeroPlant } from './hero-plant';
import { CategoryRow } from './category-row';
import { SpringSaleBand } from './spring-sale-band';
import { VerticalsShowcase } from './verticals-showcase';
import { ShopByCategory } from './shop-by-category';
import { WhyPlants } from './why-plants';
import { BestSellers } from './best-sellers';
import { StatementBand } from './statement-band';
import { PromoBanners } from './promo-banners';
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
      <HeroPlant />
      <CategoryRow />
      <SpringSaleBand />
      <ShopByCategory categories={categories} isLoading={catLoading} />
      <BestSellers products={products} isLoading={productsLoading} />
      <VerticalsShowcase />
      <WhyPlants />
      <StatementBand />
      <PromoBanners />
      <GiftingBand />
      <TrustRow />
      <NewsletterSocial />
    </>
  );
}

export default PlantCompanyHome;
