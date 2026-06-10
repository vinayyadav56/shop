'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { getVerticalMeta } from '../verticals';
import { useTypes } from '@/framework/type';
import { TYPES_PER_PAGE } from '@/framework/client/variables';

/** Home — the brand's three worlds (data-driven from API types), luxury treatment. */
export function VerticalsShowcase() {
  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  const list = (types ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
        <div className="mb-8 text-center lg:mb-12">
          <p className="mb-3 flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
            <span className="h-px w-8 bg-gold/50" /> One Home, Three Worlds <span className="h-px w-8 bg-gold/50" />
          </p>
          <h2 className="mx-auto max-w-2xl font-cormorant text-[2.1rem] font-bold leading-[1.08] text-forest-900 sm:text-[2.8rem]">
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
                  className="group relative h-64 overflow-hidden rounded-2xl sm:h-72 lg:h-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.scenes[0]}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081209]/85 via-[#0E2415]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="font-cormorant text-[1.6rem] font-bold leading-tight text-white">{t.name}</h3>
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
