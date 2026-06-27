'use client';
import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/safe-image';
import { useBannerEnabled } from '@/lib/use-home-config';

/** Corporate Gifting — matched to the Web Home reference: a full-width 56/44 split
 *  (copy + photo) with four reasons + a dark assurance band of three features. */

const REASONS: { a: string; b: string; icon: React.ReactNode }[] = [
  { a: 'Better for People', b: '& Workspaces', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="3.2" /><path d="M5 21v-1.5a3 3 0 0 1 2-2.8M19 21v-1.5a3 3 0 0 0-2-2.8" /></svg>) },
  { a: 'Elegant Gifts for', b: 'Every Occasion', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect x="3" y="8" width="18" height="13" rx="1.5" /><path d="M3 12h18M12 8v13" /><path d="M12 8S10.5 3.5 8 4.5 9 8 12 8Zm0 0s1.5-4.5 4-3.5S15 8 12 8Z" /></svg>) },
  { a: 'Sustainable Choice', b: 'for a Greener Future', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M11 20A8 8 0 0 1 3 12C3 6 8 2 13 2c0 6-2.5 10-2.5 10S15 10 19 10c0 5-4 9-8 10Z" /></svg>) },
  { a: 'Perfect for Clients,', b: 'Partners & Employees', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m8 12 2.5 2.5L14 11" /><path d="M21 11.5 12.5 20a2 2 0 0 1-2.8 0L3 13.3V5a2 2 0 0 1 2-2h7.3" /></svg>) },
];

const ASSURE: { title: string; a: string; b: string; icon: React.ReactNode }[] = [
  { title: 'Curated with Care', a: 'Premium quality plants,', b: 'beautifully packaged.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M12 3l1.9 4.3L18.5 8l-3.4 3.1.9 4.6L12 13.6 8 15.7l.9-4.6L5.5 8l4.6-.7Z" /></svg>) },
  { title: 'Customized for You', a: 'Personalized messages,', b: 'branding & bulk options.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>) },
  { title: 'Pan India Delivery', a: 'Timely and safe delivery', b: 'across India.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M5 17H3V6h11v11" /><path d="M14 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>) },
];

export function GiftingBand() {
  if (!useBannerEnabled('gifting')) return null;
  return (
    <section className="bg-[#F8F7F2]">
      {/* top — copy + photo */}
      <div className="flex flex-col lg:min-h-[500px] lg:flex-row lg:items-stretch">
        {/* left copy */}
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:flex-[1_1_56%] lg:py-12 lg:pe-8 lg:ps-16">
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full border-[1.5px] border-sage-400 bg-white/45 px-[18px] py-[9px] text-[11px] font-medium uppercase tracking-[0.22em] text-forest-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-forest-600"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
            Green Gifting for Corporate
          </span>
          <h2 className="font-cormorant mt-4 text-[2.4rem] font-semibold leading-[1.0] tracking-[-0.02em] text-forest-900 sm:text-[3.25rem]">
            Gift Green.<br />Grow Meaningful <span className="text-forest-600">Connections.</span>
          </h2>
          <div className="mt-4 flex max-w-[472px] items-center gap-3">
            <div className="h-px w-[120px] shrink-0 bg-kraft-300 sm:w-[186px]" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] text-forest-500"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
            <div className="h-px flex-1 bg-kraft-300" />
          </div>
          <p className="mt-3.5 max-w-[468px] text-[16px] leading-[1.58] text-[#33422F] sm:text-[19px]">
            Thoughtful plant gifts that inspire, appreciate and leave a lasting impact.
          </p>
          {/* four reasons */}
          <div className="mt-6 grid max-w-[820px] grid-cols-2 gap-y-7 sm:flex sm:items-stretch">
            {REASONS.map((r, i) => (
              <div key={r.a} className="relative flex flex-1 flex-col items-center px-2 text-center sm:px-3.5">
                {i > 0 && <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-kraft-300 sm:block" />}
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-sage-100 text-forest-700 sm:h-[62px] sm:w-[62px]">{r.icon}</div>
                <div className="mt-3.5 text-[13px] font-semibold leading-[1.45] text-forest-900 sm:text-[13.5px]">{r.a}<br />{r.b}</div>
              </div>
            ))}
          </div>
          <Link href="/corporate-gifting" className="mt-7 inline-flex w-fit items-center gap-3 rounded-[11px] bg-forest-800 px-[30px] py-[17px] text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-forest-900 active:scale-[0.98] sm:text-[14px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7S10 2.5 7 3.5 9 7 12 7Zm0 0s2-4.5 5-3.5S15 7 12 7Z" /></svg>
            Gift Green, Grow Together
          </Link>
        </div>
        {/* right photo */}
        <div className="relative h-64 min-h-[260px] w-full sm:h-80 lg:h-auto lg:flex-[1_1_44%]">
          <SafeImage src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1100&q=72&auto=format&fit=crop" alt="Corporate plant gifting" fill sizes="(max-width:1024px) 100vw, 44vw" className="object-cover" />
        </div>
      </div>

      {/* dark assurance band */}
      <div className="px-5 pb-6 pt-3.5 sm:px-8 lg:px-16">
        <div className="flex flex-col items-stretch gap-5 rounded-[18px] bg-forest-800 px-6 py-5 sm:flex-row sm:gap-0 sm:px-[26px]">
          {ASSURE.map((g, i) => (
            <div key={g.title} className="relative flex flex-1 items-center gap-[18px] px-2 py-1 sm:px-[30px]">
              {i > 0 && <div className="absolute left-0 top-1/2 hidden h-[58px] w-px -translate-y-1/2 bg-white/[0.16] sm:block" />}
              <span className="shrink-0 text-[#E3CE97]">{g.icon}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold uppercase leading-[1.2] tracking-[0.14em] text-white sm:text-[14px]">{g.title}</div>
                <div className="mt-1.5 text-[13px] leading-[1.52] text-white/[0.74] sm:text-[13.5px]">{g.a}<br />{g.b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GiftingBand;
