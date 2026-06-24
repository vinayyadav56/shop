'use client';
import React from 'react';
import Link from 'next/link';

function GiftImage() {
  const [err, setErr] = React.useState(false);
  if (err) return null;
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[44%]">
      <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-[#0D3B24]/40 to-[#0D3B24]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=72&auto=format&fit=crop"
        alt=""
        onError={() => setErr(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function GiftingBand() {
  return (
    <section className="bg-[color:var(--pa-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 lg:py-8">
        <div className="relative min-h-[168px] overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2E1B] via-[#0D3B24] to-[#13503E] sm:min-h-[200px]">
          <GiftImage />
          <div className="relative z-20 max-w-[62%] px-5 py-7 sm:max-w-[58%] sm:px-9 sm:py-9">
            <h2 className="font-heading text-[1.55rem] font-bold leading-[1.1] text-white sm:text-[2.2rem]">
              Green Gifting, Always a Good Idea.
            </h2>
            <p className="mt-2 text-[12.5px] leading-snug text-white/80 sm:text-[14px]">
              Surprise your loved ones with the gift of nature.
            </p>
            <Link
              href="/corporate-gifting"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ds-gold px-5 py-2.5 text-[12.5px] font-semibold text-[#0A2E1B] transition hover:brightness-105 sm:mt-5 sm:text-[13px]"
            >
              Explore Gift Plants <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GiftingBand;
