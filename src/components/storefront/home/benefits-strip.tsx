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
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-sage-200/50 bg-sage-100/70 px-6 py-7 sm:px-8 md:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((it, i) => {
            const Ico = Icon[it.icon];
            return (
              <div
                key={it.title}
                className={`flex items-start gap-3 ${i === ITEMS.length - 1 ? 'col-span-2 justify-center md:col-span-1 md:justify-start' : ''}`}
              >
                <Ico className="h-7 w-7 shrink-0 text-forest-700" />
                <div>
                  <div className="text-[13px] font-bold text-forest-900">{it.title}</div>
                  <div className="text-[11.5px] leading-snug text-stone-500">{it.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BenefitsStrip;
