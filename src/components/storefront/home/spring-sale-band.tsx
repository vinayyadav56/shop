'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useBannerEnabled } from '@/lib/use-home-config';
import { EXPO } from '@/components/storefront/motion';

const PERKS = [
  {
    label: 'Best Quality Products',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
      </svg>
    ),
  },
  {
    label: 'Expert Plant Care Support',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    label: 'Easy Returns & Refunds',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    label: 'Secure Payments',
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
      initial={{ y: 32 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: EXPO }}
      className="py-6 lg:py-8"
    >
      <div className="mx-auto max-w-none px-5 sm:px-8 lg:px-16">
      <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#1c4d28_0%,#0f2d1a_48%,#081a0f_100%)]">

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

        {/* tree renders from md up, so base classes = the compact tablet design;
            lg restores the original desktop band untouched. */}
        <div className="relative z-10 flex items-center px-6 py-5 sm:px-8 lg:px-10 lg:py-6">

          {/* ── LEFT — offer block ── */}
          <div className="w-[188px] shrink-0 lg:w-[260px]">
            {/* pulsing badge */}
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/10 px-3 py-1 lg:mb-3">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-70" />
                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#4ADE80]" />
              </span>
              <span className="whitespace-nowrap font-hanken text-[9px] font-bold uppercase tracking-[0.14em] text-[#86EFAC] lg:text-[10px] lg:tracking-[0.16em]">
                {t('home-sale-eyebrow')}
              </span>
            </div>

            {/* discount */}
            <div className="whitespace-nowrap font-pahserif text-[27px] font-bold leading-none tracking-[-0.01em] text-[#F2E3B8] lg:text-[34px]">
              {t('home-sale-discount')}
            </div>
            <div className="mt-1 whitespace-nowrap font-hanken text-[10.5px] leading-snug text-white/80 lg:text-[11px]">
              {t('home-sale-condition')}
            </div>

            {/* CTA */}
            <Link
              href="/plants/search"
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-[9px] bg-ds-cta px-3.5 py-1.5 font-hanken text-[11.5px] font-bold text-ds-cta-ink transition duration-200 hover:bg-ds-cta-hover active:scale-[0.97] lg:mt-3 lg:px-4 lg:py-2 lg:text-[12.5px]"
            >
              {t('home-sale-cta')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* vertical divider */}
          <div className="mx-6 w-px self-stretch bg-white/[0.1] lg:mx-10" />

          {/* ── RIGHT — perks: 2×2 grid with one-line labels on tablet,
                original 4-across row with dividers from lg ── */}
          <div className="grid flex-1 grid-cols-2 gap-x-7 gap-y-3.5 lg:flex lg:items-center lg:justify-between lg:gap-0">
            {PERKS.map((p, i) => (
              <React.Fragment key={p.label}>
                {i > 0 && <span aria-hidden className="hidden h-8 w-px shrink-0 bg-white/15 lg:block" />}
                <motion.div
                  initial={{ y: 14 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: EXPO }}
                  className="flex items-center gap-2.5 lg:gap-3"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/25 text-[#4ADE80] lg:h-11 lg:w-11 [&>svg]:h-[13px] [&>svg]:w-[13px] lg:[&>svg]:h-[18px] lg:[&>svg]:w-[18px]">
                    {p.icon}
                  </span>
                  <div className="whitespace-nowrap font-hanken text-[11px] font-semibold leading-[1.35] text-white lg:max-w-[120px] lg:whitespace-normal lg:text-[12.5px]">
                    {p.label}
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
      </div>
    </motion.section>
  );
}

export default SpringSaleBand;
