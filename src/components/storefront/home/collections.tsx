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

type CardData = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
};

/** Circular/organic collection tile: arch-cropped photo, copy below. */
function CollectionCard({ c }: { c: CardData }) {
  const [err, setErr] = React.useState(false);
  return (
    <Link
      href={`/c/${c.slug}`}
      className="group flex cursor-pointer flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-b-[18px] rounded-t-[999px] border border-kraft-200 bg-sage-100 shadow-[0_2px_8px_rgba(34,48,26,0.07)] transition-shadow duration-300 group-hover:shadow-[0_12px_28px_rgba(34,48,26,0.15)]">
        {c.image && !err ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt={c.name}
            loading="lazy"
            onError={() => setErr(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sage-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9" aria-hidden>
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3.5 text-[15.5px] font-bold leading-tight text-forest-900 transition-colors group-hover:text-forest-700">
        {c.name}
      </div>
      {c.description ? (
        <div className="mt-1 line-clamp-2 max-w-[220px] text-[11.5px] leading-[1.4] text-stone-500">
          {c.description}
        </div>
      ) : null}
    </Link>
  );
}

// Tailwind needs literal class strings — map the admin-chosen count to columns.
const COLS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  // 6-up squeezes cards below ~180px between lg and xl — show 5 there,
  // all 6 from xl (1280+). 1440+ desktop look is unchanged.
  6: 'lg:grid-cols-5 xl:grid-cols-6 lg:max-xl:[&>*:nth-child(6)]:hidden',
};

export function Collections() {
  const { t } = useTranslation('common');
  const { categories: raw, isLoading } = useCategories({ limit: HOME_CATEGORIES_LIMIT, parent: 'null' } as any);
  const { homeCategories, homeCollections } = useHomeConfig();

  const count = Math.max(3, Math.min(6, Number(homeCollections?.count) || 5));
  const bySlug = new Map((raw ?? []).map((c: any) => [c.slug, c]));

  // Admin cards override; every field falls back to the linked category so a
  // half-filled entry still renders complete.
  const cards: CardData[] = (
    homeCollections?.cards?.length
      ? homeCollections.cards.map((card) => {
          const cat: any = card.categorySlug ? bySlug.get(card.categorySlug) : null;
          return {
            slug: card.categorySlug || cat?.slug || '',
            name: card.title || cat?.name || '',
            description: card.subtitle || cat?.description || '',
            image:
              (typeof card.image === 'string' ? card.image : card.image?.original) ||
              cat?.image?.original ||
              cat?.image?.thumbnail ||
              '',
          };
        })
      : applyCuration(raw ?? [], homeCategories).map((c: any) => ({
          slug: c.slug,
          name: c.name,
          description: c.description,
          image: c.image?.original ?? c.image?.thumbnail ?? '',
        }))
  )
    .filter((c) => c.slug && c.name)
    .slice(0, count);

  if (homeCollections?.enabled === false) return null;

  return (
    <section className="g-light-a px-5 pb-[40px] pt-[40px] sm:px-8 lg:px-[64px] lg:pb-[52px] lg:pt-[48px]">
      <div className="mb-[26px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-[9px] font-jost text-[11px] font-medium uppercase tracking-[0.2em] text-forest-600">
            {homeCollections?.eyebrow || t('home-collections-eyebrow')}
          </div>
          <h2 className="m-0 flex items-center gap-[9px] font-pahserif text-[26px] font-semibold tracking-[-0.005em] text-forest-900 sm:text-[34px]">
            {homeCollections?.heading || t('home-collections-title')}
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
      <div className={`pah-rail [--rail-w:38%] grid grid-cols-2 gap-[18px] sm:grid-cols-3 ${COLS[count] ?? COLS[5]}`}>
        {isLoading && cards.length === 0
          ? Array.from({ length: count }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-b-[18px] rounded-t-[999px] bg-sage-100" />
            ))
          : cards.map((c, i) => (
              <motion.div
                key={c.slug || i}
                initial={{ y: 24 }}
                whileInView={{ y: 0 }}
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
