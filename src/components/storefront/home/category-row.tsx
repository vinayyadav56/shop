'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Premium category quick-links that overlap the hero foot (mockup row of 5).
 * Each card carries a photo with a graceful gradient+icon fallback so a missing
 * image never breaks the row.
 */
const CATEGORIES: {
  title: string;
  desc: string;
  href: string;
  img: string;
  icon: JSX.Element;
}[] = [
  {
    title: 'Indoor Plants',
    desc: 'Purify air & brighten your space',
    href: '/c/indoor',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&q=70&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
    ),
  },
  {
    title: 'Pots & Planters',
    desc: 'Stylish pots for every plant & space',
    href: '/tools',
    img: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=200&q=70&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 9Z" /><path d="M4 9h16" /><path d="M9 6c0-1.5 1.5-3 3-3s3 1.5 3 3" /></svg>
    ),
  },
  {
    title: 'Seeds',
    desc: 'High quality seeds for your home garden',
    href: '/farmbox',
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&q=70&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22V12" /><path d="M12 12c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" /><path d="M12 14c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" /></svg>
    ),
  },
  {
    title: 'Fertilizers',
    desc: 'Nourish your plants for a greener tomorrow',
    href: '/plants/search',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=70&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22a7 7 0 0 0 7-7c0-4-7-12-7-12S5 11 5 15a7 7 0 0 0 7 7Z" /></svg>
    ),
  },
  {
    title: 'Garden Tools',
    desc: 'Handy tools for happy gardening',
    href: '/tools',
    img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=200&q=70&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" /></svg>
    ),
  },
];

function Thumb({ img, icon }: { img: string; icon: JSX.Element }) {
  const [err, setErr] = React.useState(false);
  return (
    <div className="relative grid h-[84px] w-[84px] shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-[var(--ds-accent-soft)] to-[#D2E5CC] text-[var(--ds-accent)]">
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt=""
          loading="lazy"
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      ) : (
        icon
      )}
    </div>
  );
}

export function CategoryRow() {
  return (
    <section className="relative z-20 -mt-14 sm:-mt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={c.href}
                className="group flex h-full items-center justify-between gap-3 rounded-[9px] bg-[#F3F2E8] p-3 shadow-[0_8px_22px_rgba(20,40,24,0.10)] ring-1 ring-forest-900/[0.05] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(20,40,24,0.15)]"
              >
                <div className="min-w-0">
                  <h3 className="text-[14px] font-semibold leading-tight text-forest-900">{c.title}</h3>
                  <p className="mt-1 text-[11.5px] leading-snug text-stone-500">{c.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--ds-accent)] transition group-hover:gap-1.5">
                    Shop Now <span aria-hidden>→</span>
                  </span>
                </div>
                <Thumb img={c.img} icon={c.icon} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryRow;
