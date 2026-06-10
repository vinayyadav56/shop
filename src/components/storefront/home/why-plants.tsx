'use client';
import React, { useRef } from 'react';
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
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-b from-[#F8FBF5] to-[#EDF4E8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.4fr] lg:items-center lg:gap-12 lg:py-24">
        {/* left — editorial copy */}
        <div>
          <span className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.3em] text-gold">
            Why Plants? <Icon.leaf className="h-3.5 w-3.5 text-gold" />
          </span>
          <h2 className="font-cormorant mt-3 text-[2.2rem] font-medium not-italic leading-[1.05] text-forest-900 sm:text-[3rem]">
            Small Change,<br />Big Impact
          </h2>
          <p className="mt-4 max-w-md text-[13.5px] leading-7 text-stone-500 sm:text-[14px]">
            Plants do more than just look good. They improve your well-being, purify the air, and bring balance
            to your everyday life.
          </p>
          <Link
            href="/plants/search"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-forest-800 to-forest-600 px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90 sm:w-auto"
          >
            Explore Benefits <Icon.arrow className="h-4 w-4" />
          </Link>
        </div>

        {/* right — 4 image cards (horizontal scroll track, arrow nav on desktop) */}
        <div className="relative min-w-0">
          <div
            ref={rowRef}
            className="flex min-w-0 snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="w-[72%] shrink-0 snap-start overflow-hidden rounded-xl border border-forest-900/10 bg-white/80 backdrop-blur-[2px] shadow-[0_18px_40px_-28px_rgba(22,48,26,0.35)] sm:w-[42%] lg:w-[24%]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
                  <Image src={c.img} alt={c.title} fill sizes="(max-width:1024px) 60vw, 20vw" className="object-cover" />
                </div>
                <div className="p-3.5">
                  <h3 className="text-[13px] font-bold text-forest-900">{c.title}</h3>
                  <p className="mt-1 text-[11.5px] leading-snug text-stone-500">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll cards right"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 hidden h-9 w-9 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-forest-900/10 bg-white/80 backdrop-blur-[2px] shadow-sm transition hover:bg-white lg:grid"
          >
            <Icon.arrow className="h-4 w-4 text-forest-800" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhyPlants;
