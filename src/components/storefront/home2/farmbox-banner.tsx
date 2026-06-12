'use client';
import React from 'react';
import Link from 'next/link';

export function FarmboxBanner(props: any) {
  return (
    <section className="bg-[#F2EFE5] py-6 lg:py-8">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-2xl bg-[#12281A] ring-1 ring-[#C9A24B]/25 sm:grid-cols-[1fr_1.1fr]">
          {/* Left — copy */}
          <div className="p-7 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#C9A24B]/60" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#C9A24B] sm:text-[11px]">
                Farmbox
              </span>
            </div>
            <h2 className="mt-4 font-cormorant text-[1.7rem] font-medium leading-tight text-[#F0EAD8] sm:text-[2.1rem]">
              Farm Fresh. Straight to You.
            </h2>
            <p className="mt-3 text-[12.5px] leading-relaxed text-[#F0EAD8]/65">
              Handpicked fruits, veggies, herbs &amp; more from trusted farms.
            </p>
            <div className="mt-6">
              <Link
                href="/farmbox"
                className="inline-flex w-full min-h-[40px] items-center justify-center rounded-md bg-[#C9A24B] px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#12281A] transition-colors hover:bg-[#D9BC7A] sm:w-auto"
              >
                Explore Farmbox
              </Link>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative min-h-[200px] sm:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1000&q=75&auto=format&fit=crop"
              alt="Fresh farm produce — fruits, vegetables and herbs"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            {/* Left-edge blend into the dark panel (desktop) */}
            <div className="hidden sm:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#12281A] to-transparent" />
            {/* Top blend (mobile stack) */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#12281A] to-transparent sm:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmboxBanner;
