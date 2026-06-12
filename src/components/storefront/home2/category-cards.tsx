'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { Icon } from '../icons';

type CategoryKey = 'leaf' | 'home' | 'droplet' | 'spark' | 'truck';

const CATEGORIES: {
  name: string;
  tagline: string;
  href: string;
  img: string;
  icon: CategoryKey;
}[] = [
  {
    name: 'Plants',
    tagline: 'Bring life to your space',
    href: '/plants',
    img: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=700&q=75&auto=format&fit=crop',
    icon: 'leaf',
  },
  {
    name: 'Planters',
    tagline: 'Style meets nature',
    href: '/tools',
    img: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=700&q=75&auto=format&fit=crop',
    icon: 'home',
  },
  {
    name: 'Plant Care',
    tagline: 'Nourish & protect',
    href: '/plant-doctor',
    img: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=700&q=75&auto=format&fit=crop',
    icon: 'droplet',
  },
  {
    name: 'Tools',
    tagline: 'For every gardener',
    href: '/tools',
    img: '/tools-1.jpg',
    icon: 'spark',
  },
  {
    name: 'FarmBox',
    tagline: 'Farm fresh to your home',
    href: '/farmbox',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=75&auto=format&fit=crop',
    icon: 'truck',
  },
];

export function CategoryCards() {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * row.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#F2EFE5] py-12 lg:py-16">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        {/* eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-[#C9A24B]/60" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#C9A24B] sm:text-[11px]">
            Shop by Category
          </span>
          <span className="h-px w-6 bg-[#C9A24B]/60" />
        </div>

        {/* track */}
        <div className="relative mt-8 min-w-0">
          <div
            ref={rowRef}
            className="flex min-w-0 snap-x gap-3.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
          >
            {CATEGORIES.map((c) => {
              const Glyph = Icon[c.icon];
              return (
                <Link
                  key={c.name}
                  href={c.href}
                  className="group block w-[62%] shrink-0 snap-start overflow-hidden rounded-xl bg-[#16271B] ring-1 ring-[#C9A24B]/20 sm:w-[34%] lg:w-auto"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* icon badge overlapping photo/caption seam */}
                  <div className="relative z-10 mx-auto -mt-5 grid h-10 w-10 place-items-center rounded-full bg-[#F2EFE5] text-[#12281A]">
                    <Glyph className="h-[18px] w-[18px]" />
                  </div>
                  <div className="px-3 pb-4 pt-1 text-center">
                    <h3 className="font-cormorant text-[15.5px] font-medium text-[#F0EAD8]">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-[#F0EAD8]/60">{c.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* desktop arrows */}
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#C9A24B]/40 bg-white/80 text-[#C9A24B] backdrop-blur-[2px] shadow-sm transition hover:bg-white lg:grid"
          >
            <Icon.arrow className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-[#C9A24B]/40 bg-white/80 text-[#C9A24B] backdrop-blur-[2px] shadow-sm transition hover:bg-white lg:grid"
          >
            <Icon.arrow className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CategoryCards;
