'use client';
import React from 'react';
import { Icon } from '../icons';

const ITEMS: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'lock', title: 'Secure Payments', sub: '100% secure transactions' },
  { icon: 'truckFast', title: 'Easy Returns', sub: 'Hassle-free returns' },
  { icon: 'heart', title: 'Live Support', sub: 'We’re here to help' },
  { icon: 'shield', title: 'Quality Assured', sub: 'Only the best for you' },
];

export function TrustRow() {
  return (
    <section className="border-y border-kraft-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-8 sm:px-8 lg:grid-cols-4">
        {ITEMS.map((it) => {
          const Ico = Icon[it.icon];
          return (
            <div key={it.title} className="flex items-center gap-3 px-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-forest-700/25 text-forest-700">
                <Ico className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[13px] font-bold text-forest-900">{it.title}</div>
                <div className="text-[11.5px] leading-tight text-stone-500">{it.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrustRow;
