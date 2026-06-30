'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useBannerEnabled } from '@/lib/use-home-config';
import { EXPO } from '@/components/storefront/motion';

const PERKS = [
  {
    label: 'Best Quality',
    sub: 'Hand-picked, nursery-fresh',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
      </svg>
    ),
  },
  {
    label: 'Expert Support',
    sub: 'Real guidance, anytime',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    label: 'Easy Returns',
    sub: '7-day, hassle-free',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    label: 'Secure Payments',
    sub: '100% protected checkout',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export function SpringSaleBand() {
  const { t } = useTranslation('common');
  if (!useBannerEnabled('specialOffer')) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: EXPO }}
      className=""
    >
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#1c4d28_0%,#0f2d1a_48%,#081a0f_100%)]">

        {/* grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />

        {/* soft radial glow on left */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[380px] bg-[radial-gradient(ellipse_at_10%_50%,rgba(74,222,128,0.13)_0%,transparent_65%)]" />

        {/* decorative background leaf */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -bottom-10 right-6 opacity-[0.065]"
          width="220" height="220" viewBox="0 0 24 24"
          fill="none" stroke="white" strokeWidth="0.55"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:gap-0 lg:px-16 lg:py-6">

          {/* ── LEFT — offer block ── */}
          <div className="shrink-0 lg:w-[260px]">
            {/* pulsing badge */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/10 px-3 py-1">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-70" />
                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#4ADE80]" />
              </span>
              <span className="font-hanken text-[10px] font-bold uppercase tracking-[0.16em] text-[#86EFAC]">
                {t('home-sale-eyebrow')}
              </span>
            </div>

            {/* discount */}
            <div className="font-hanken text-[28px] font-extrabold leading-none tracking-[-0.03em] text-white">
              {t('home-sale-discount')}
            </div>
            <div className="mt-1 font-hanken text-[11px] leading-snug text-white/80">
              {t('home-sale-condition')}
            </div>

            {/* CTA */}
            <Link
              href="/plants/search"
              className="mt-3 inline-flex items-center gap-1.5 rounded-[9px] bg-[#4ADE80] px-4 py-2 font-hanken text-[12.5px] font-bold text-[#061a0b] transition duration-200 hover:bg-[#22c55e] active:scale-[0.97]"
            >
              {t('home-sale-cta')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* vertical divider */}
          <div className="hidden w-px self-stretch bg-white/[0.1] lg:mx-10 lg:block" />
          {/* horizontal divider on mobile */}
          <div className="h-px w-full bg-white/[0.08] lg:hidden" />

          {/* ── RIGHT — perks ── */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 lg:flex-1 lg:grid-cols-4 lg:gap-x-4">
            {PERKS.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: EXPO }}
                className="flex items-center gap-2.5"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-[#4ADE80]/20 bg-[#4ADE80]/[0.09] text-[#86EFAC] [&>svg]:h-4 [&>svg]:w-4">
                  {p.icon}
                </span>
                <div>
                  <div className="font-hanken text-[12.5px] font-bold leading-snug text-white">{p.label}</div>
                  <div className="font-hanken text-[10.5px] leading-snug text-white/80">{p.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </motion.section>
  );
}

export default SpringSaleBand;
