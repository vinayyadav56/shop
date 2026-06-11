'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { getVerticalMeta } from '../verticals';
import { useTypes } from '@/framework/type';
import { TYPES_PER_PAGE } from '@/framework/client/variables';

/** Real-photography scene overrides per vertical slug (fallback: meta.scenes[0]). */
const SCENE_OVERRIDES: Record<string, string> = {
  plants:
    'https://images.unsplash.com/photo-1521334884684-d80222895322?w=900&q=78&auto=format&fit=crop',
  tools: '/tools-1.jpg',
  equipment: '/tools-1.jpg',
  farmbox:
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=78&auto=format&fit=crop',
  'fresh-fruits':
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=78&auto=format&fit=crop',
};

/** Home — the brand's three worlds (data-driven from API types), luxury treatment. */
export function VerticalsShowcase() {
  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  const list = (types ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="relative overflow-hidden g-band">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_70%_20%,rgba(227,206,151,0.10),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-24">
        <div className="mb-8 text-center lg:mb-12">
          <p className="mb-3 flex items-center justify-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.3em] text-goldlight">
            <span className="h-px w-8 bg-goldlight/50" /> One Home, Three Worlds <span className="h-px w-8 bg-goldlight/50" />
          </p>
          <h2 className="mx-auto max-w-2xl font-cormorant text-[2.1rem] font-medium leading-[1.08] text-white sm:text-[2.8rem]">
            Everything to grow your green life.
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {list.map((t) => {
            const meta = getVerticalMeta(t.slug, t.name);
            return (
              <Link key={t.slug} href={`/${t.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-64 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-72 lg:h-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SCENE_OVERRIDES[t.slug] ?? meta.scenes[0]}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="font-cormorant text-[1.6rem] font-medium leading-tight text-white">{t.name}</h3>
                    <p className="mt-1 max-w-xs text-[13px] leading-snug text-white/75">{meta.tagline}</p>
                    <span className="mt-3.5 inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-goldlight">
                      Explore {t.name}
                      <Icon.arrow className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VerticalsShowcase;
