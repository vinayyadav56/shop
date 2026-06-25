'use client';
import React from 'react';
import Link from 'next/link';
import { useBannerEnabled } from '@/lib/use-home-config';

const PERKS: { title: string; sub: string; icon: JSX.Element }[] = [
  {
    title: 'Customisation',
    sub: 'Available',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
    ),
  },
  {
    title: 'Bulk Discounts',
    sub: 'Best Prices',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.2" /></svg>
    ),
  },
  {
    title: 'On-time Delivery',
    sub: 'Across India',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 17H3V5a1 1 0 0 1 1-1h11v13" /><path d="M15 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></svg>
    ),
  },
];

function GiftImage() {
  const [err, setErr] = React.useState(false);
  if (err) return null;
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-2/5 lg:block">
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0D3B24]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&q=70&auto=format&fit=crop"
        alt=""
        onError={() => setErr(true)}
        className="h-full w-full object-cover opacity-90 mix-blend-luminosity"
      />
    </div>
  );
}

export function GiftingBand() {
  if (!useBannerEnabled('gifting')) return null;
  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2E1B] via-[#0D3B24] to-[#13503E] px-6 py-9 sm:px-10 lg:py-11">
          <GiftImage />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-md">
              <h2 className="flex items-center gap-2.5 font-playfair text-[1.9rem] font-bold leading-tight text-white sm:text-[2.4rem]">
                Green Gifting, Always a Good Idea
                <span aria-hidden className="text-[1.4rem]">🌿</span>
              </h2>
              <p className="mt-3 text-[13.5px] font-medium tracking-wide text-white/80">
                Corporate Gifting&nbsp;&nbsp;|&nbsp;&nbsp;Return Gifts&nbsp;&nbsp;|&nbsp;&nbsp;Bulk Orders
              </p>
              <Link
                href="/corporate-gifting"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C8A96B] px-6 py-3 text-[12.5px] font-semibold text-[#0A2E1B] transition hover:bg-[#d8bd84]"
              >
                Explore Corporate Gifting <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-5 sm:gap-8 lg:pr-[34%]">
              {PERKS.map((p) => (
                <div key={p.title} className="flex flex-col items-center gap-2.5 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-[#A8E6B0]">
                    {p.icon}
                  </span>
                  <span className="text-[12px] leading-tight text-white/90">
                    <span className="block font-semibold">{p.title}</span>
                    <span className="block text-white/60">{p.sub}</span>
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

export default GiftingBand;
