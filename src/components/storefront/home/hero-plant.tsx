'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { KenBurns, EXPO, WordReveal } from '../motion';

// The two luxury villa photos the user supplied — they crossfade + slow-zoom via
// KenBurns so the still hero reads like a running video. Original penthouse heroes
// are preserved in /public for the vertical pages.
const HERO_SCENES = ['/hero-villa-interior.jpg', '/hero-villa-exterior.jpg'];

const PILLS: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'wind', title: 'Air Purifying', sub: 'Better air, better life' },
  { icon: 'heart', title: 'Stress Relief', sub: 'Creates a calming environment' },
  { icon: 'sprout', title: 'Sustainable Living', sub: 'Good for you and the planet' },
];

export function HeroPlant() {
  return (
    <section className="relative flex min-h-[88svh] w-full items-center overflow-hidden sm:min-h-[92svh]">
      {/* cinematic crossfading background (looks like video) */}
      <KenBurns images={HERO_SCENES} interval={7} />

      {/* soft green overlay so the heading + pills stay legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/85 via-forest-900/55 to-forest-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-transparent to-forest-900/45" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EXPO }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md"
          >
            <Icon.leaf className="h-3.5 w-3.5 text-sage-300" /> India’s premium plant studio
          </motion.span>

          <h1 className="font-cormorant text-[14vw] font-bold leading-[0.98] tracking-tight text-white sm:text-[5.5rem] lg:text-[6.5rem]">
            <WordReveal text="Bring Nature" delay={0.1} />
            <span className="block italic text-sage-300">
              <WordReveal text="Into Your Space" delay={0.4} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EXPO }}
            className="mt-6 max-w-md text-[15px] leading-7 text-white/90 sm:text-lg"
          >
            Curated plants and planters to elevate your home, office and lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EXPO }}
            className="mt-8"
          >
            <Link
              href="/plants/search"
              className="inline-flex items-center gap-2.5 rounded-full bg-forest-700 px-8 py-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_18px_44px_-16px_rgba(20,40,20,0.9)] transition hover:bg-forest-600"
            >
              Shop Now <Icon.arrow className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* three feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {PILLS.map((p) => {
              const Ico = Icon[p.icon];
              return (
                <div
                  key={p.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-md sm:flex-col sm:items-start sm:gap-2"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-sage-300">
                    <Ico className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-semibold leading-tight text-white">{p.title}</span>
                    <span className="block text-[11px] leading-tight text-white/70">{p.sub}</span>
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroPlant;
