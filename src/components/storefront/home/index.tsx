'use client';
import React from 'react';
import type { Category, Product } from '@/types';
import { HeroEmerald } from '../home2/hero-emerald';
import { CategoryCards } from '../home2/category-cards';
import { BestSellers2 } from '../home2/best-sellers2';
import { StatsBand } from '../home2/stats-band';
import { Collections } from '../home2/collections';
import { FarmboxBanner } from '../home2/farmbox-banner';
import { HowEffortless } from '../home2/how-effortless';
import { Testimonials2 } from '../home2/testimonials2';
import { NewsletterStrip } from '../home2/newsletter-strip';

/**
 * PLANTAHOME homepage — the user's dark-emerald + gold mockup, wired to live data.
 * Section order mirrors the mockup exactly: hero (+features) → category cards →
 * best sellers → stats band → collections → farmbox → how-it-works → testimonials
 * → newsletter strip. (Footer is global chrome.)
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
      <HeroEmerald />
      <CategoryCards />
      <BestSellers2 products={products} isLoading={productsLoading} />
      <StatsBand />
      <Collections />
      <FarmboxBanner />
      <HowEffortless />
      <Testimonials2 />
      <NewsletterStrip />
    </>
  );
}

export default PlantCompanyHome;
