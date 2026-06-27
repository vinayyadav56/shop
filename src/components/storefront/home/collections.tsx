'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHead } from './section-heading';

const COLLECTIONS: { title: string; desc: string; href: string; img: string }[] = [
  {
    title: 'Low Light Plants',
    desc: 'Ideal for homes & offices',
    href: '/c/indoor',
    img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=72&auto=format&fit=crop',
  },
  {
    title: 'Air Purifying Plants',
    desc: 'Breathe clean, live healthy',
    href: '/c/air-purifying',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=72&auto=format&fit=crop',
  },
  {
    title: 'Flowering Plants',
    desc: 'Add colors to your life',
    href: '/c/flowering',
    img: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&q=72&auto=format&fit=crop',
  },
  {
    title: 'Premium Planters',
    desc: 'Elevate your plant game',
    href: '/tools',
    img: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&q=72&auto=format&fit=crop',
  },
  {
    title: 'Succulents Collection',
    desc: 'Tiny plants, big charm',
    href: '/c/succulents-cacti',
    img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=72&auto=format&fit=crop',
  },
];

function CollectionCard({ c }: { c: (typeof COLLECTIONS)[number] }) {
  const [err, setErr] = React.useState(false);
  return (
    <Link
      href={c.href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E5A35] to-[#0A2E1B] shadow-[0_24px_60px_-34px_rgba(13,59,36,0.6)]"
    >
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.img}
          alt={c.title}
          loading="lazy"
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,22,13,0.9)_4%,rgba(9,22,13,0.42)_44%,rgba(9,22,13,0.03)_74%)]" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="font-playfair text-[1.25rem] font-bold leading-tight text-white sm:text-[1.4rem]">
          {c.title}
        </h3>
        <p className="mt-0.5 text-[12px] text-white/80">{c.desc}</p>
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A8E6B0] opacity-0 transition group-hover:opacity-100">
          Explore <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export function Collections() {
  return (
    <section className="g-light-a">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <SectionHead
          label="Curated for You"
          title="Shop Our Best Collections"
          viewAllHref="/plants/search"
          viewAllText="View All Collections"
        />
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <CollectionCard c={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Collections;
