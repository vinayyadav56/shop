'use client';
import React from 'react';

const ITEMS: { title: string; icon: JSX.Element }[] = [
  {
    title: 'Live Arrival Guarantee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
  },
  {
    title: '100% Secure Payment',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    ),
  },
  {
    title: 'Easy Returns & Refunds',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
    ),
  },
  {
    title: 'Fast & Safe Delivery',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M5 17H3V6a1 1 0 0 1 1-1h11v12" /><path d="M15 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>
    ),
  },
];

export function TrustRow() {
  return (
    <section className="bg-[color:var(--pa-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-8">
        <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-forest-900/[0.06] bg-white px-2 py-4 shadow-[0_18px_50px_-32px_rgba(13,59,36,0.4)] sm:gap-4 sm:px-6">
          {ITEMS.map((it) => (
            <div key={it.title} className="flex flex-col items-center gap-2 px-0.5 text-center sm:flex-row sm:gap-3 sm:px-2 sm:text-left">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--ds-accent-soft)] text-[var(--ds-accent)]">
                {it.icon}
              </span>
              <span className="text-[10.5px] font-semibold leading-tight text-forest-900 sm:text-[12.5px]">{it.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustRow;
