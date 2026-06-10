'use client';
import React from 'react';
import type { Category, Product } from '@/types';
import { HeroPlant } from './hero-plant';
import { ShopByCategory } from './shop-by-category';
import { BenefitsStrip } from './benefits-strip';
import { WhyPlants } from './why-plants';
import { BestSellers } from './best-sellers';
import { PromoBanners } from './promo-banners';
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
      <ShopByCategory categories={categories} isLoading={catLoading} />
      <BenefitsStrip />
      <WhyPlants />
      <BestSellers products={products} isLoading={productsLoading} />
      <PromoBanners />
      <TrustRow />
      <NewsletterSocial />
    </>
  );
}

export default PlantCompanyHome;
