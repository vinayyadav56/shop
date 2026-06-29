'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import SafeImage from '@/components/ui/safe-image';

/**
 * "Small Plants, Big Impact" — the Web Home reference benefit section: a centred
 * header + 6 benefit cards (image + circular icon badge straddling the image,
 * title, divider, body) + a closing CTA band. Responsive 2 → 3 (md) → 6 (lg) cols
 * so tablets get a real grid (matches the breakpoint contract).
 */
const BENEFITS: { title: string; body: string; img: string; icon: React.ReactNode }[] = [
  {
    title: 'Purify the Air',
    body: 'Plants naturally filter toxins and increase oxygen levels for cleaner, fresher air.',
    img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=78&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h9a2.5 2.5 0 1 1-2.5 2.5" /></svg>
    ),
  },
  {
    title: 'Reduce Stress',
    body: 'Being around plants lowers stress, boosts mood, and promotes mental well-being.',
    img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=78&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M12 21c5-3 8-6.5 8-11a4 4 0 0 0-8-1 4 4 0 0 0-8 1c0 4.5 3 8 8 11Z" /><path d="M12 9v12" /></svg>
    ),
  },
  {
    title: 'Boost Productivity',
    body: 'Plants improve focus and concentration, making homes and workplaces more productive.',
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=78&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px]"><path d="m3 17 6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>
    ),
  },
  {
    title: 'Increase Humidity',
    body: 'Plants release moisture into the air, helping maintain natural humidity and comfort.',
    img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=78&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px]"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>
    ),
  },
  {
    title: 'Reduce Noise',
    body: 'Plants act as natural sound barriers, reducing noise pollution and creating calm.',
    img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=78&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px]"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m22 9-6 6" /><path d="m16 9 6 6" /></svg>
    ),
  },
  {
    title: 'Support the Planet',
    body: 'More plants mean a greener Earth — they absorb CO₂ and help combat climate change.',
    img: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=78&auto=format&fit=crop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>
    ),
  },
];

export function WhyPlants() {
  const { t } = useTranslation('common');
  return (
    <section className="border-t border-kraft-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-11 sm:px-8 lg:px-16 lg:pb-[48px] lg:pt-[52px]">
        {/* centred header */}
        <div className="mx-auto mb-[32px] max-w-[760px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest-600/15 bg-forest-600/[0.07] px-4 py-1.5 font-jost text-[11.5px] font-semibold uppercase tracking-[0.22em] text-forest-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[14px] w-[14px] text-forest-500"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
            {t('home-why-eyebrow')}
          </span>
          <h2 className="font-pahserif mt-4 text-[30px] font-bold not-italic leading-[1.05] tracking-[-0.012em] text-forest-900 sm:text-[42px]">
            {t('home-why-title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-hanken text-[14px] leading-[1.55] text-stone-500 sm:text-[15.5px]">
            {t('home-why-subtitle')}{' '}
            <strong className="font-bold text-forest-700">{t('home-why-subtitle-strong')}</strong>
          </p>
        </div>

        {/* benefit cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-[18px]">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-[18px] border border-kraft-200 bg-white shadow-[0_2px_8px_rgba(34,48,26,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(34,48,26,0.09)]"
            >
              <div className="relative h-[140px] overflow-hidden bg-cream-100 sm:h-[160px] lg:h-[178px]">
                <SafeImage src={b.img} alt={b.title} fill sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 16vw" className="object-cover" />
              </div>
              {/* circular icon badge straddling the image bottom */}
              <div className="absolute left-1/2 top-[140px] flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sage-200 bg-white text-forest-700 shadow-[0_6px_16px_rgba(20,40,24,0.12)] sm:top-[160px] lg:top-[178px]">
                {b.icon}
              </div>
              <div className="px-[18px] pb-[26px] pt-[42px] text-center">
                <h3 className="text-[16px] font-bold leading-[1.2] text-forest-900">{b.title}</h3>
                <div className="mx-auto mb-[14px] mt-[11px] h-0.5 w-[26px] rounded-full bg-forest-500" />
                <p className="text-[12.5px] leading-[1.62] text-stone-500">{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* closing CTA band — luxury forest + gold treatment */}
        <div className="relative mt-[40px] flex flex-col items-center gap-5 overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#16301A_0%,#1E4023_55%,#2E5E2A_100%)] p-7 text-center shadow-[0_28px_60px_-30px_rgba(20,40,24,0.65)] ring-1 ring-white/10 sm:flex-row sm:gap-[30px] sm:px-9 sm:py-7 sm:text-start">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#DCC07A]/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#8FD56F]/10 blur-3xl" />
          <div className="relative flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(160deg,#DCC07A,#B8923E)] text-[#16301A] shadow-[0_12px_26px_rgba(184,146,62,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-[25px] w-[25px]"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
          </div>
          <div className="relative hidden w-px self-stretch bg-white/15 sm:my-[3px] sm:block" />
          <p className="relative flex-1 font-hanken text-[16px] leading-[1.5] text-white/90 sm:text-[18px]">
            {t('home-why-cta-band-text')} <strong className="font-bold text-[#DCC07A]">{t('home-why-cta-band-strong-1')}</strong> {t('home-why-cta-band-and')}{' '}
            <strong className="font-bold text-[#DCC07A]">{t('home-why-cta-band-strong-2')}</strong>
          </p>
          <Link
            href="/plants/search"
            className="relative inline-flex shrink-0 items-center gap-[9px] rounded-xl bg-[linear-gradient(180deg,#DCC07A,#B8923E)] px-[26px] py-[14px] font-jost text-[15px] font-bold text-[#16301A] shadow-[0_12px_26px_rgba(184,146,62,0.38)] transition hover:brightness-105 active:scale-[0.97]"
          >
            {t('home-why-cta')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhyPlants;
