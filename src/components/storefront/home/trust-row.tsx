'use client';
import React from 'react';

const ITEMS: { title: string; sub: string; icon: JSX.Element }[] = [
  {
    title: '100% Quality Assured',
    sub: 'Only healthy & handpicked plants',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
  },
  {
    title: 'Secure Packaging',
    sub: 'Safe delivery to your doorstep',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
    ),
  },
  {
    title: 'Loved by 10,000+',
    sub: 'Happy plant parents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 6 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7 7-7Z" /></svg>
    ),
  },
  {
    title: 'Expert Guidance',
    sub: 'Helping you at every step',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
    ),
  },
];

export function TrustRow() {
  return (
    <section className="border-t border-forest-900/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-7 px-5 py-12 sm:px-8 lg:grid-cols-4 lg:gap-x-8 lg:px-12 lg:py-16">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-3.5 px-2">
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700">
              {it.icon}
            </span>
            <div>
              <div className="text-[14px] font-bold text-forest-900 sm:text-[14.5px]">{it.title}</div>
              <div className="text-[12px] leading-tight text-stone-500">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustRow;
