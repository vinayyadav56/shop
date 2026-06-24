'use client';
import React from 'react';
import Link from 'next/link';

const PERKS: { title: string; icon: JSX.Element }[] = [
  {
    title: 'Best Quality\nProducts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
  },
  {
    title: 'Expert Plant\nCare Support',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
    ),
  },
  {
    title: 'Easy Returns\n& Refunds',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
    ),
  },
  {
    title: 'Secure\nPayments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /></svg>
    ),
  },
];

export function SpringSaleBand() {
  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2E1B] via-[#0D3B24] to-[#13503E] px-6 py-8 sm:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_85%_30%,rgba(200,169,107,0.14),transparent_70%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* offer */}
            <div className="lg:max-w-xs">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold text-[#C8A96B]">
                <span aria-hidden>🌿</span> Spring Sale is Live!
              </p>
              <h2 className="mt-2 font-playfair text-[2.1rem] font-bold leading-none text-[#C8A96B] sm:text-[2.6rem]">
                FLAT 20% OFF
              </h2>
              <p className="mt-1 text-[13.5px] text-white/80">On Orders Above ₹999</p>
              <Link
                href="/plants/search"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#4E8B31] px-6 py-2.5 text-[12.5px] font-semibold text-white transition hover:bg-[#5aa03a]"
              >
                Shop Now
              </Link>
            </div>

            {/* perks */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:gap-x-10">
              {PERKS.map((p) => (
                <div key={p.title} className="flex items-center gap-3 lg:flex-col lg:items-center lg:text-center">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-[#A8E6B0]">
                    {p.icon}
                  </span>
                  <span className="whitespace-pre-line text-[12.5px] font-medium leading-tight text-white/90">
                    {p.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpringSaleBand;
