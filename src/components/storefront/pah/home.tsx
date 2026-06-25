'use client';
import React from 'react';
import { Hero } from './hero';
import { SearchBar } from './search-bar';
import { CategoryCircles } from './category-circles';
import { PlantDoctorCard } from './plant-doctor-card';
import { SpecialOffer } from './special-offer';
import { Collections } from './collections';
import { BestSellers } from './best-sellers';
import { TrustRow } from './trust-row';
import { Gifting } from './gifting';
import { BottomNav } from './bottom-nav';

/**
 * Faithful reproduction of the Claude Design "PlantAtHome Mobile Home" — its
 * fonts (Hanken Grotesk / Jost / Cormorant), palette and layout — bound to live
 * data. Centred as an app column on desktop (mobile design is the source).
 */
export default function PahHome(_props: { variables?: any }) {
  return (
    <div className="min-h-screen w-full bg-cream-100 font-hanken text-forest-900 antialiased">
      <div className="mx-auto min-h-screen max-w-[440px] overflow-hidden bg-cream-50 shadow-[0_0_60px_-30px_rgba(34,48,26,0.3)]">
        <Hero />
        <div className="relative -mt-4 rounded-t-[22px] bg-cream-50 px-0 pb-[100px] pt-[22px] lg:pb-8">
          <div className="flex flex-col gap-6">
            <SearchBar />
            <CategoryCircles />
            <PlantDoctorCard />
            <SpecialOffer />
            <Collections />
            <BestSellers />
            <TrustRow />
            <Gifting />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
