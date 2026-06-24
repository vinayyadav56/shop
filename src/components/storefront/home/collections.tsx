'use client';
import React from 'react';
import Link from 'next/link';
import { SectionHead } from './section-heading';

const COLLECTIONS: { title: string; count: string; href: string; img: string }[] = [
  { title: 'Low Light Plants', count: '30+ Plants', href: '/c/indoor', img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=72&auto=format&fit=crop' },
  { title: 'Air Purifying Plants', count: '25+ Plants', href: '/c/air-purifying', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=72&auto=format&fit=crop' },
  { title: 'Flowering Plants', count: '20+ Plants', href: '/c/flowering', img: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&q=72&auto=format&fit=crop' },
  { title: 'Succulents & Cacti', count: '40+ Plants', href: '/c/succulents-cacti', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=72&auto=format&fit=crop' },
  { title: 'Decorative Pots', count: '50+ Pots', href: '/tools', img: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&q=72&auto=format&fit=crop' },
];

function CollectionCard({ c }: { c: (typeof COLLECTIONS)[number] }) {
  const [err, setErr] = React.useState(false);
  return (
    <Link
      href={c.href}
      className="group relative block aspect-[3/4] w-[150px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E5A35] to-[#0A2E1B] shadow-[0_22px_55px_-32px_rgba(13,59,36,0.6)] sm:w-auto"
    >
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.img} alt={c.title} loading="lazy" onError={() => setErr(true)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <h3 className="font-heading text-[15px] font-bold leading-tight text-white">{c.title}</h3>
        <p className="mt-0.5 text-[11px] font-medium text-white/85">{c.count}</p>
      </div>
    </Link>
  );
}

export function Collections() {
  return (
    <section className="bg-[color:var(--pa-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-8 lg:py-14">
        <SectionHead
          label="Curated for You"
          title="Shop Our Best Collections"
          viewAllHref="/plants/search"
          viewAllText="View all"
        />
        <div className="mt-6 flex gap-3.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
          {COLLECTIONS.map((c) => (
            <CollectionCard key={c.title} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Collections;
