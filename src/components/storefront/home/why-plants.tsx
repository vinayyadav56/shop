'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '../icons';

const CARDS = [
  { img: '/plants-1.jpg', title: 'Purifies Indoor Air', sub: 'Removes toxins and improves air quality naturally.' },
  { img: '/plants-2.jpg', title: 'Enhances Well-being', sub: 'Reduce stress and promote mental clarity.' },
  { img: '/plants-3.jpg', title: 'Boosts Productivity', sub: 'Creates a refreshing environment to help you focus better.' },
  { img: '/editorial-botanical.png', title: 'Supports Sustainability', sub: 'Make an eco-friendly choice for a greener tomorrow.' },
];

export function WhyPlants() {
  return (
    <section className="bg-cream-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.4fr] lg:items-center lg:gap-12 lg:py-16">
        {/* left — editorial copy */}
        <div>
          <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-forest-600">
            Why Plants? <Icon.leaf className="h-3.5 w-3.5" />
          </span>
          <h2 className="font-cormorant mt-3 text-[2.4rem] font-bold leading-[1.05] text-forest-900 sm:text-[3rem]">
            Small Change,<br />Big Impact
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-7 text-stone-500">
            Plants do more than just look good. They improve your well-being, purify the air, and bring balance
            to your everyday life.
          </p>
          <Link
            href="/plants/search"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest-700 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-forest-600"
          >
            Explore Benefits <Icon.arrow className="h-4 w-4" />
          </Link>
        </div>

        {/* right — 4 image cards (horizontal scroll on mobile, 4-up on desktop) */}
        <div className="flex snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="w-[68%] shrink-0 snap-start overflow-hidden rounded-2xl border border-kraft-200 bg-white shadow-[0_12px_30px_-22px_rgba(34,48,26,0.3)] sm:w-[42%] lg:w-auto"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={c.img} alt={c.title} fill sizes="(max-width:1024px) 60vw, 20vw" className="object-cover" />
              </div>
              <div className="p-3.5">
                <h3 className="text-[13.5px] font-semibold text-forest-900">{c.title}</h3>
                <p className="mt-1 text-[11.5px] leading-snug text-stone-500">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyPlants;
