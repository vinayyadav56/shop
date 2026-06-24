'use client';
import React from 'react';
import { Sprout, ShieldCheck, RotateCcw, Truck } from 'lucide-react';

const ITEMS = [
  { icon: Sprout, title: 'Live-arrival promise', sub: 'Healthy or replaced free' },
  { icon: ShieldCheck, title: '100% secure payment', sub: 'UPI, cards & COD' },
  { icon: RotateCcw, title: 'Easy returns', sub: '7-day hassle-free' },
  { icon: Truck, title: 'Fast & safe delivery', sub: 'Specialised plant courier' },
];

export function TrustBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
      <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-line2 bg-white p-3 sm:grid-cols-4 sm:p-4">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="flex items-center gap-3 rounded-xl px-2 py-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                <Icon className="h-[20px] w-[20px]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-bold text-brand-900">{it.title}</p>
                <p className="truncate text-[11px] text-stone-500">{it.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrustBand;
