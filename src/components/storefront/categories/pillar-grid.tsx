'use client';
import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types';
import { imgOf, countLabel } from './helpers';

function PillarCard({ category }: { category: Category }) {
  const [err, setErr] = React.useState(false);
  const img = imgOf(category);
  return (
    <Link
      href={`/c/${category.slug}`}
      className="group relative block h-[128px] overflow-hidden rounded-2xl shadow-[0_14px_40px_-30px_rgba(13,59,36,0.55)] sm:h-[150px]"
    >
      {img && !err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={category.name}
          loading="lazy"
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-forest-900" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,32,18,0)_36%,rgba(14,32,18,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="font-heading text-[16px] font-bold leading-tight text-white">
          {category.name}
        </div>
        <div className="mt-0.5 text-[10.5px] font-medium text-ds-gold">
          {countLabel(category)}
        </div>
      </div>
    </Link>
  );
}

/** 2-up (4-up on desktop) grid of the next-biggest top-level categories. */
export function PillarGrid({ categories }: { categories: Category[] }) {
  if (!categories?.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((c) => (
        <PillarCard key={c.id ?? c.slug} category={c} />
      ))}
    </div>
  );
}

export default PillarGrid;
