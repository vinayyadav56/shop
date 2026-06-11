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
    <section className="g-light-b py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-forest-900/10 bg-white/60 backdrop-blur px-5 py-6 shadow-[0_18px_40px_-28px_rgba(22,48,26,0.35)] sm:grid-cols-3 sm:px-8 sm:py-7 lg:grid-cols-5">
          {ITEMS.map((it) => {
            const Ico = Icon[it.icon];
            return (
              <div key={it.title} className="flex items-start gap-3">
                <Ico className="h-7 w-7 shrink-0 text-gold" />
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
