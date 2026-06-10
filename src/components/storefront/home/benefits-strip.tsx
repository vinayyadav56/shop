'use client';
import React from 'react';
import { Icon } from '../icons';

const ITEMS: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'wind', title: 'Air Purifying', sub: 'Improves air quality naturally' },
  { icon: 'zap', title: 'Boosts Productivity', sub: 'Enhances focus & creativity' },
  { icon: 'spark', title: 'Elevates Aesthetics', sub: 'Brings life to your space' },
  { icon: 'heart', title: 'Reduces Stress', sub: 'Creates a calming environment' },
  { icon: 'sprout', title: 'Sustainable Living', sub: 'Good for you and the planet' },
];

export function BenefitsStrip() {
  return (
    <section className="bg-sage-100">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-7 px-5 py-10 sm:px-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {ITEMS.map((it, i) => {
          const Ico = Icon[it.icon];
          return (
            <div
              key={it.title}
              className={`flex items-center gap-3 ${i === ITEMS.length - 1 ? 'col-span-2 justify-center md:col-span-1 md:justify-start' : ''}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-forest-600 shadow-sm">
                <Ico className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[13px] font-semibold text-forest-900">{it.title}</div>
                <div className="text-[11.5px] leading-tight text-forest-800/70">{it.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BenefitsStrip;
