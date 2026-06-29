'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');
  const [err, setErr] = React.useState(false);
  return (
    <Link
      href={c.href}
      className="group relative block h-[212px] cursor-pointer overflow-hidden rounded-[16px] bg-gradient-to-br from-[#1E5A35] to-[#0A2E1B] shadow-[0_2px_8px_rgba(34,48,26,0.07)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(34,48,26,0.09)]"
    >
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.img}
          alt={c.title}
          loading="lazy"
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,22,13,0.9)_4%,rgba(9,22,13,0.42)_44%,rgba(9,22,13,0.03)_74%)]" />
      <div className="absolute inset-x-0 bottom-0 p-[16px] text-white">
        <div className="text-[15px] font-bold leading-[1.16] text-white">
          {c.title}
        </div>
        <div className="mt-[4px] text-[11px] leading-[1.35] text-white/[0.82]">{c.desc}</div>
        <span className="mt-[11px] inline-flex items-center gap-[5px] text-[12px] font-bold text-[#8FD56F]">
          {t('home-collections-explore')}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function Collections() {
  const { t } = useTranslation('common');
  return (
    <section className="g-light-a px-5 pb-[40px] pt-[40px] sm:px-8 lg:px-[64px] lg:pb-[52px] lg:pt-[48px]">
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-[9px] font-jost text-[11px] font-medium uppercase tracking-[0.2em] text-forest-600">
            {t('home-collections-eyebrow')}
          </div>
          <h2 className="m-0 flex items-center gap-[9px] font-pahserif text-[34px] font-semibold tracking-[-0.005em] text-forest-900 sm:text-[46px]">
            {t('home-collections-title')}
            <i className="fa-solid fa-spa text-[23px] text-forest-500" aria-hidden />
          </h2>
        </div>
        <Link
          href="/plants/search"
          className="inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap text-[14px] font-semibold text-forest-700"
        >
          {t('home-collections-view-all')}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-5">
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
    </section>
  );
}

export default Collections;
