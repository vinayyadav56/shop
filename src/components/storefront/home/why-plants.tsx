'use client';
import React from 'react';
import Link from 'next/link';
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
  return (
    <section className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        {/* centred header */}
        <div className="mx-auto mb-10 max-w-[760px] text-center lg:mb-12">
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-forest-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] text-forest-500"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
            Why We Need Plants
          </span>
          <div className="mx-auto mt-3.5 h-0.5 w-[54px] rounded-full bg-forest-500" />
          <h2 className="font-heading mt-4 text-[2.4rem] font-bold not-italic leading-[1.02] tracking-[-0.012em] text-forest-900 sm:text-[3.25rem]">
            Small Plants, Big Impact
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-stone-500 sm:text-[17px]">
            Plants do more than just beautify your space — they nourish your well-being and support a{' '}
            <strong className="font-bold text-forest-700">healthier planet.</strong>
          </p>
        </div>

        {/* benefit cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-[18px]">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-[18px] border border-forest-900/10 bg-white shadow-[0_2px_12px_rgba(27,94,32,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(27,94,32,0.12)]"
            >
              <div className="relative h-[140px] overflow-hidden bg-cream-100 sm:h-[160px] lg:h-[178px]">
                <SafeImage src={b.img} alt={b.title} fill sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 16vw" className="object-cover" />
              </div>
              {/* circular icon badge straddling the image bottom */}
              <div className="absolute left-1/2 top-[140px] flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sage-200 bg-white text-forest-700 shadow-[0_6px_16px_rgba(20,40,24,0.12)] sm:top-[160px] lg:top-[178px]">
                {b.icon}
              </div>
              <div className="px-[18px] pb-[26px] pt-[42px] text-center">
                <h3 className="text-[15px] font-bold leading-[1.2] text-forest-900 sm:text-[16px]">{b.title}</h3>
                <div className="mx-auto my-[13px] h-0.5 w-[26px] rounded-full bg-forest-500" />
                <p className="text-[12px] leading-[1.62] text-stone-500 sm:text-[12.5px]">{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* closing CTA band */}
        <div className="mt-9 flex flex-col items-center gap-5 rounded-[18px] border border-sage-200 bg-sage-100 p-6 text-center sm:flex-row sm:gap-7 sm:px-8 sm:text-start">
          <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-forest-800 text-white shadow-[0_8px_20px_rgba(20,40,24,0.22)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[25px] w-[25px]"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
          </div>
          <div className="hidden w-px self-stretch bg-sage-300 sm:block" />
          <p className="flex-1 text-[16px] leading-[1.45] text-forest-900 sm:text-[18px]">
            Adding plants to your space is a simple step towards <strong className="font-bold">a healthier you</strong> and{' '}
            <strong className="font-bold">a healthier planet.</strong>
          </p>
          <Link
            href="/plants/search"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-ds-accent px-6 py-3.5 text-[15px] font-bold text-white transition hover:opacity-90 active:scale-[0.97]"
          >
            Bring Nature Home
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhyPlants;
