'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { KenBurns, EXPO, WordReveal } from '../motion';

// The two luxury villa photos the user supplied — they crossfade + slow-zoom via
// KenBurns so the still hero reads like a running video. The mockup's light split
// look comes from the left cream gradient; text sits dark-on-light.
const HERO_SCENES = ['/hero-villa-interior.jpg', '/hero-villa-exterior.jpg'];

const FEATURES: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'wind', title: 'Air Purifying', sub: 'Better air, better life' },
  { icon: 'heart', title: 'Stress Relief', sub: 'Creates a calming environment' },
  { icon: 'sprout', title: 'Sustainable Living', sub: 'Good for you and the planet' },
];

export function HeroPlant() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F2]">
      {/* crossfading villa photos (video feel) */}
      <KenBurns images={HERO_SCENES} interval={7} />

      {/* mockup overlay: solid light left fading into the photo on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F2]/95 via-[#FAF9F2]/80 to-[#FAF9F2]/25 lg:from-[#FAF9F2] lg:via-[#FAF9F2]/85 lg:to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[480px] max-w-7xl flex-col justify-between px-5 sm:px-8 lg:min-h-[540px]">
        {/* copy block */}
        <div className="max-w-xl pb-10 pt-12 sm:pt-16 lg:pt-20">
          <h1 className="font-cormorant text-[2.6rem] font-bold leading-[1.04] tracking-tight text-forest-900 sm:text-[3.4rem] lg:text-[4rem]">
            <WordReveal text="Bring Nature" delay={0.1} />
            <span className="block">
              <WordReveal text="Into Your Space" delay={0.35} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: EXPO }}
            className="mt-5 max-w-sm text-[14px] leading-7 text-stone-500 sm:text-[15px]"
          >
            Curated plants and planters to elevate your home, office and lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: EXPO }}
            className="mt-7"
          >
            <Link
              href="/plants/search"
              className="inline-flex items-center gap-2.5 rounded-md bg-forest-800 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_-12px_rgba(20,40,20,0.7)] transition hover:bg-forest-700"
            >
              Shop Now <Icon.arrow className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* feature strip — hairline-divided, on a translucent white bar (mockup bottom-left) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="w-full max-w-2xl rounded-t-xl bg-white/85 backdrop-blur-sm"
        >
          <div className="flex flex-col divide-y divide-kraft-200 sm:flex-row sm:divide-x sm:divide-y-0">
            {FEATURES.map((f) => {
              const Ico = Icon[f.icon];
              return (
                <div key={f.title} className="flex flex-1 items-center gap-3 px-4 py-3.5 sm:px-5">
                  <Ico className="h-6 w-6 shrink-0 text-forest-600" />
                  <span>
                    <span className="block text-[12.5px] font-bold leading-tight text-forest-900">{f.title}</span>
                    <span className="block text-[11px] leading-tight text-stone-500">{f.sub}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroPlant;
