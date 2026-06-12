'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { EXPO, WordReveal } from '../motion';

// The PLANTAHOME mockup hero — the user's exact image (dark emerald room, arched
// window, monstera, brass watering can) with the copy/CTAs/stat card per mockup.
const FEATURES: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'wind', title: 'Air Purifying', sub: 'Cleaner Air, Better Life' },
  { icon: 'sprout', title: 'Live Arrival Guarantee', sub: 'Healthy Plants Promise' },
  { icon: 'spark', title: 'Premium Quality', sub: 'Handpicked & Tested' },
  { icon: 'truckFast', title: 'Easy Returns', sub: 'Hassle-free Returns' },
  { icon: 'shield', title: 'Secure Packaging', sub: 'Plants Delivered Safely' },
];

export function HeroEmerald() {
  return (
    <section className="relative flex w-full flex-col overflow-hidden bg-[#12281A]">
      {/* the user's hero image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-emerald.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[72%_50%]"
      />
      {/* left text-protect scrim (image already has a dark wall on the left) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C1F13]/80 via-[#12281A]/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0C1F13]/85 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[480px] w-full max-w-[88rem] flex-1 items-center px-4 py-14 sm:min-h-[540px] sm:px-6 lg:min-h-[580px]">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EXPO }}
            className="mb-5 text-[10.5px] font-bold uppercase tracking-[0.3em] text-[#F0EAD8]/80"
          >
            Curated Greens. Conscious Living.
          </motion.p>

          <h1 className="font-cormorant text-[2.15rem] font-medium leading-[1.05] text-[#F0EAD8] sm:text-[3.3rem] lg:text-[3.8rem]">
            <WordReveal text="Bring Nature In." delay={0.1} />
            <span className="block italic text-[#C9A24B]">
              <WordReveal text="Live Extraordinary." delay={0.4} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: EXPO }}
            className="mt-6 max-w-sm text-[13.5px] leading-7 text-[#F0EAD8]/75 sm:text-[14.5px]"
          >
            Exceptional plants, premium tools &amp; farm-fresh essentials for beautiful spaces and better
            living.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: EXPO }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/plants/search"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-[#C9A24B] px-7 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#12281A] shadow-[0_16px_40px_-16px_rgba(201,162,75,0.55)] transition hover:bg-[#D9BC7A]"
            >
              Shop Plants <Icon.arrow className="h-4 w-4" />
            </Link>
            <Link
              href="#collections"
              className="inline-flex items-center justify-center gap-2.5 rounded-md border border-[#F0EAD8]/30 px-7 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#F0EAD8] transition hover:border-[#C9A24B] hover:text-[#D9BC7A]"
            >
              Explore Collections
            </Link>
          </motion.div>
        </div>

        {/* glass stat card — right (mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: EXPO }}
          className="absolute bottom-24 right-6 hidden w-[200px] rounded-xl border border-[#C9A24B]/35 bg-[#0C1F13]/55 p-5 text-center backdrop-blur-md lg:block xl:right-12"
        >
          <Icon.leaf className="mx-auto h-6 w-6 text-[#C9A24B]" />
          <div className="mt-2.5 font-cormorant text-[1.7rem] font-medium leading-none text-[#F0EAD8]">
            10,00,000+
          </div>
          <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F0EAD8]/70">
            Happy Plant Parents
          </div>
        </motion.div>
      </div>

      {/* feature row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.8 }}
        className="relative z-10 border-t border-[#F0EAD8]/12 bg-[#0C1F13]/70 backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-[88rem] grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:px-6 md:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:py-4.5">
          {FEATURES.map((f) => {
            const Ico = Icon[f.icon];
            return (
              <div key={f.title} className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#C9A24B]/45 text-[#C9A24B]">
                  <Ico className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[11.5px] font-bold leading-tight text-[#F0EAD8]">{f.title}</span>
                  <span className="block text-[10.5px] leading-tight text-[#F0EAD8]/55">{f.sub}</span>
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroEmerald;
