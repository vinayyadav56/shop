'use client';
import React from 'react';
import { Icon } from '../icons';
import { Counter } from '../motion';

// Dark-emerald trust/stats band — 5 stats per the PLANTAHOME mockup.
const STATS: {
  icon: keyof typeof Icon;
  numeral: React.ReactNode;
  label: string;
}[] = [
  {
    icon: 'truck',
    numeral: <Counter value={50000} suffix="+" />,
    label: 'Plants Delivered Daily',
  },
  {
    icon: 'home',
    numeral: <Counter value={200} suffix="+" />,
    label: 'Cities Served',
  },
  {
    icon: 'star',
    numeral: (
      <>
        <Counter value={4.9} decimals={1} />★
      </>
    ),
    label: 'Average Rating',
  },
  { icon: 'shield', numeral: '100%', label: 'Satisfaction Guarantee' },
  { icon: 'user', numeral: '24/7', label: 'Expert Support' },
];

export function StatsBand() {
  return (
    <section className="border-y border-[#C9A24B]/20 bg-[#12281A] py-10 lg:py-12">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 lg:flex lg:items-center lg:justify-between lg:gap-x-8">
          {STATS.map((s, i) => {
            const Ic = Icon[s.icon];
            return (
            <div
              key={s.label}
              className={`flex min-w-0 items-center gap-4 ${
                i === STATS.length - 1
                  ? 'col-span-2 justify-center lg:col-span-1 lg:justify-start'
                  : ''
              }`}
            >
              <Ic className="h-8 w-8 shrink-0 text-[#C9A24B]" />
              <div className="min-w-0">
                <div className="font-cormorant text-[1.8rem] font-medium leading-none text-[#F0EAD8]">
                  {s.numeral}
                </div>
                <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.18em] text-[#F0EAD8]/55">
                  {s.label}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsBand;
