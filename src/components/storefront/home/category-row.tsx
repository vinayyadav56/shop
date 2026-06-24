'use client';
import React from 'react';
import Link from 'next/link';

/**
 * Circular category shortcuts (design reference): round photo + label, in a
 * horizontal scroll on mobile and a centered row on desktop.
 */
const CATEGORIES: { title: string; href: string; img: string }[] = [
  { title: 'Air Purifying', href: '/c/air-purifying', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&q=70&auto=format&fit=crop' },
  { title: 'Pet Friendly', href: '/c/pet-friendly', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&q=70&auto=format&fit=crop' },
  { title: 'Low Light', href: '/c/indoor', img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=200&q=70&auto=format&fit=crop' },
  { title: 'Office Plants', href: '/c/indoor', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&q=70&auto=format&fit=crop' },
  { title: 'Outdoor', href: '/c/outdoor', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=70&auto=format&fit=crop' },
];

function Circle({ title, href, img }: { title: string; href: string; img: string }) {
  const [err, setErr] = React.useState(false);
  return (
    <Link href={href} className="group flex w-[78px] shrink-0 flex-col items-center gap-2 sm:w-auto">
      <span className="relative grid h-[68px] w-[68px] place-items-center overflow-hidden rounded-full bg-ds-accent-soft ring-1 ring-forest-900/[0.06] transition group-hover:ring-2 group-hover:ring-ds-accent/40 sm:h-20 sm:w-20">
        {!err ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" loading="lazy" onError={() => setErr(true)} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--ds-accent)" strokeWidth="1.6" className="h-6 w-6"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /></svg>
        )}
      </span>
      <span className="text-center text-[11.5px] font-medium leading-tight text-forest-900">{title}</span>
    </Link>
  );
}

export function CategoryRow() {
  return (
    <section className="relative z-20 bg-[color:var(--pa-bg)] pt-6 sm:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex items-start gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-8 lg:gap-12 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <Circle key={c.title} {...c} />
          ))}
          {/* View All */}
          <Link href="/plants" className="group flex w-[78px] shrink-0 flex-col items-center gap-2 sm:w-auto">
            <span className="grid h-[68px] w-[68px] place-items-center rounded-full border border-dashed border-forest-900/20 bg-white transition group-hover:border-ds-accent sm:h-20 sm:w-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--ds-accent)" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6"><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>
            </span>
            <span className="text-center text-[11.5px] font-medium leading-tight text-forest-900">View All</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CategoryRow;
