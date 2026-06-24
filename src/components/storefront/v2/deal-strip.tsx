'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export function DealStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-offer to-[#ff7a4d] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/15" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 text-white">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">Deal of the week</p>
            <p className="font-jakarta text-[20px] font-extrabold leading-tight text-white sm:text-[24px]">
              Up to 40% off best-selling plants
            </p>
          </div>
        </div>
        <Link
          href="/plants/search"
          className="relative inline-flex w-max items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-[14px] font-bold text-offer transition hover:bg-brand-50 active:scale-95"
        >
          Shop deals <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default DealStrip;
