'use client';
import React from 'react';
import Link from 'next/link';
import { Icon } from '../icons';

const COLLECTIONS = [
  {
    name: 'Urban Jungle',
    tagline: 'Lush greens for your modern home',
    image:
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=700&q=75&auto=format&fit=crop',
  },
  {
    name: 'Balcony Garden',
    tagline: 'Small spaces, big green vibes.',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=75&auto=format&fit=crop',
  },
  {
    name: 'Workspace Green',
    tagline: 'Plants that boost productivity',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=75&auto=format&fit=crop',
  },
  {
    name: 'Gift Green',
    tagline: 'Thoughtful gifts that grow',
    image:
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=700&q=75&auto=format&fit=crop',
  },
] as const;

/** Cream "Handpicked Collections" band — intro column + four dark photo cards. */
export function Collections() {
  return (
    <section id="collections" className="bg-[#F2EFE5] py-12 lg:py-16">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_2fr]">
          {/* Intro */}
          <div className="min-w-0">
            <p className="flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#C9A24B] sm:text-[11px]">
              <span className="h-px w-6 bg-[#C9A24B]/60" />
              Collections
            </p>
            <h2 className="mt-3 font-cormorant text-[1.8rem] font-medium leading-[1.12] text-[#12281A] sm:text-[2.3rem]">
              Handpicked for Every Corner of Your Life.
            </h2>
            <p className="mt-3 text-[13px] text-stone-500">
              Premium collections to suit every space and style.
            </p>
            <Link
              href="/plants/search"
              className="mt-6 inline-flex w-full min-h-[40px] items-center justify-center rounded-md bg-[#12281A] px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#F0EAD8] transition-colors hover:bg-[#1A3322] sm:w-auto"
            >
              Explore Collections
            </Link>
          </div>

          {/* Photo cards — scroll row on mobile, 4-up grid on desktop */}
          <div className="min-w-0">
            <div className="-mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
              {COLLECTIONS.map((c) => (
                <Link
                  key={c.name}
                  href="/plants/search"
                  className="group relative block h-56 w-[58%] shrink-0 overflow-hidden rounded-xl ring-1 ring-[#C9A24B]/20 sm:h-64 sm:w-[40%] lg:w-auto"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-cormorant text-[1.15rem] font-medium leading-snug text-[#F0EAD8]">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-[#F0EAD8]/65">{c.tagline}</p>
                    <span className="mt-2.5 grid h-7 w-7 place-items-center rounded-full bg-[#C9A24B] text-[#12281A]">
                      <Icon.arrow className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Collections;
