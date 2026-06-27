'use client';
import React from 'react';
import { Hero } from './hero';
import { SearchBar } from './search-bar';
import { CategoryCircles } from './category-circles';
import { SpecialOffer } from './special-offer';
import { Collections } from './collections';
import { BestSellers } from './best-sellers';
import { TrustRow } from './trust-row';
import { WhyPlants } from './why-plants';
import { CorporateGifting } from './corporate-gifting';
import { Gifting } from './gifting';
import { BottomNav } from './bottom-nav';

/**
 * Faithful reproduction of the Claude Design "PlantAtHome Mobile Home" (current
 * version) — Hanken Grotesk / Jost / Cormorant, forest/clay/gold/cream — bound to
 * live, city-scoped data. Centred as an app column on desktop (mobile <lg only).
 */
export default function PahHome(_props: { variables?: any }) {
  return (
    <div className="min-h-screen w-full bg-cream-100 font-hanken text-forest-900 antialiased">
      <div className="mx-auto min-h-screen max-w-[440px] overflow-hidden bg-cream-50 shadow-[0_0_60px_-30px_rgba(34,48,26,0.3)]">
        <Hero />
        <div className="relative rounded-t-[22px] bg-cream-50 pb-[100px]">
          <SearchBar />
          <CategoryCircles />
          <SpecialOffer />
          <Collections />
          <BestSellers />
          <TrustRow />
          <WhyPlants />
          <CorporateGifting />
          <Gifting />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
