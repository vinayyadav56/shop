'use client';
import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types';
import { imgOf, countLabel } from './helpers';

/** Large hero category card — the biggest top-level category (design reference). */
export function FeaturedPillar({ category }: { category?: Category }) {
  const [err, setErr] = React.useState(false);
  if (!category) return null;
  const img = imgOf(category);

  return (
    <Link
      href={`/c/${category.slug}`}
      className="group relative block h-[172px] overflow-hidden rounded-2xl shadow-[0_22px_55px_-32px_rgba(13,59,36,0.6)] sm:h-[220px]"
    >
      {img && !err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={category.name}
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-forest-900" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(14,32,18,0.86)_0%,rgba(14,32,18,0.35)_60%,rgba(14,32,18,0.1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[rgba(212,164,75,0.4)]" />
      <div className="absolute inset-y-0 left-0 flex w-[74%] flex-col justify-center p-5 text-white">
        <div className="font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-ds-gold">
          {countLabel(category)}
        </div>
        <div className="mt-1 font-heading text-[26px] font-extrabold leading-none sm:text-[30px]">
          {category.name}
        </div>
        {category.description ? (
          <div className="mt-1.5 line-clamp-1 text-[12.5px] text-white/80">
            {category.description}
          </div>
        ) : null}
        <span className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ds-gold">
          Explore {category.name.toLowerCase()}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </Link>
  );
}

export default FeaturedPillar;
