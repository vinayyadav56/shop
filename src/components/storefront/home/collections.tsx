'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useCategories } from '@/framework/category';
import { useHomeConfig, applyCuration } from '@/lib/use-home-config';

// The home only needs the top-level categories. limit=1000 (CATEGORIES_PER_PAGE)
// makes the API truncate the JSON mid-stream (server fatal while serializing),
// which parse-fails in the browser and blanked this grid entirely.
const HOME_CATEGORIES_LIMIT = 100;

function CollectionCard({ c }: { c: any }) {
  const img = c.image?.original ?? c.image?.thumbnail;
  const [err, setErr] = React.useState(false);
  return (
    <Link
      href={`/c/${c.slug}`}
      className="group flex aspect-[4/5] cursor-pointer flex-col overflow-hidden rounded-[16px] border border-kraft-200 bg-white shadow-[0_2px_8px_rgba(34,48,26,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(34,48,26,0.12)]"
    >
      {/* text — top (per reference) */}
      <div className="p-4 pb-3">
        <div className="line-clamp-2 text-[15.5px] font-bold leading-tight text-forest-900">
          {c.name}
        </div>
        {c.description || c.details ? (
          <div className="mt-1 line-clamp-2 text-[11.5px] leading-[1.35] text-stone-500">{c.description || c.details}</div>
        ) : null}
      </div>
      {/* photo — fills the rest */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {img && !err ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={c.name}
            loading="lazy"
            onError={() => setErr(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-sage-100" />
        )}
      </div>
    </Link>
  );
}

export function Collections() {
  const { t } = useTranslation('common');
  const { categories: raw, isLoading } = useCategories({ limit: HOME_CATEGORIES_LIMIT, parent: 'null' } as any);
  const { homeCategories } = useHomeConfig();
  const categories = applyCuration(raw ?? [], homeCategories).slice(0, 5);

  return (
    <section className="g-light-a px-5 pb-[40px] pt-[40px] sm:px-8 lg:px-[64px] lg:pb-[52px] lg:pt-[48px]">
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-[9px] font-jost text-[11px] font-medium uppercase tracking-[0.2em] text-forest-600">
            {t('home-collections-eyebrow')}
          </div>
          <h2 className="m-0 flex items-center gap-[9px] font-pahserif text-[26px] font-semibold tracking-[-0.005em] text-forest-900 sm:text-[34px]">
            {t('home-collections-title')}
            <i className="fa-solid fa-spa text-[23px] text-forest-500" aria-hidden />
          </h2>
        </div>
        <Link
          href="/plants/search"
          className="inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap text-[14px] font-semibold text-forest-700"
        >
          {t('home-collections-view-all')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-5">
        {isLoading && categories.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-[16px] bg-sage-100" />
            ))
          : categories.map((c: any, i: number) => (
              <motion.div
                key={c.id ?? c.slug}
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
