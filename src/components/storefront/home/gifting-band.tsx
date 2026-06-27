'use client';
import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/safe-image';
import { useBannerEnabled } from '@/lib/use-home-config';

/** Corporate Gifting — matched to the Web Home reference: a full-width 56/44 split
 *  (copy + photo) with four reasons + a dark assurance band of three features. */

const REASONS: { a: string; b: string; icon: React.ReactNode }[] = [
  { a: 'Better for People', b: '& Workspaces', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" /><path d="M2 21c0-3 1.85-5.4 5.08-6" /></svg>) },
  { a: 'Elegant Gifts for', b: 'Every Occasion', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" /></svg>) },
  { a: 'Sustainable Choice', b: 'for a Greener Future', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5a15 15 0 0 1 4 9.5 15 15 0 0 1-4 9.5 15 15 0 0 1-4-9.5 15 15 0 0 1 4-9.5Z" /></svg>) },
  { a: 'Perfect for Clients,', b: 'Partners & Employees', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M9 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" /><path d="M9 21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h5" /><path d="M13 8h3M13 12h3M13 16h3" /></svg>) },
];

const ASSURE: { title: string; a: string; b: string; icon: React.ReactNode }[] = [
  { title: 'Curated with Care', a: 'Premium quality plants,', b: 'beautifully packaged.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M12 21s7-3.6 7-9V5.6L12 3 5 5.6V12c0 5.4 7 9 7 9Z" /><path d="M12 8.2c-1.4 0-2.5 1-2.5 2.3 0 1.6 2.5 3.6 2.5 3.6s2.5-2 2.5-3.6c0-1.3-1.1-2.3-2.5-2.3Z" /><path d="M12 11v3.5" /></svg>) },
  { title: 'Customized for You', a: 'Personalized messages,', b: 'branding & bulk options.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><circle cx="12" cy="8.5" r="5.5" /><path d="m12 5.8 1 2 2.2.3-1.6 1.5.4 2.2L12 12.8l-2 1.1.4-2.3L8.8 9.6l2.2-.3Z" /><path d="M8.6 13.6 7 22l5-2.8L17 22l-1.6-8.4" /></svg>) },
  { title: 'Pan India Delivery', a: 'Timely and safe delivery', b: 'across India.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M2 17V6.5A1.5 1.5 0 0 1 3.5 5h10A1.5 1.5 0 0 1 15 6.5V17" /><path d="M15 9h3.6a2 2 0 0 1 1.7 1l1.7 3v4h-3" /><circle cx="6.5" cy="17.5" r="2" /><circle cx="17.5" cy="17.5" r="2" /><path d="M7 11c0-1 .8-1.7 1.9-1.7 0 1.1-.8 1.7-1.9 1.7Z" /></svg>) },
];

export function GiftingBand() {
  if (!useBannerEnabled('gifting')) return null;
  return (
    <section className="bg-[#F8F7F2]">
      {/* top — copy + photo */}
      <div className="flex flex-col lg:min-h-[500px] lg:flex-row lg:items-stretch">
        {/* left copy */}
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:flex-[1_1_56%] lg:py-[34px] lg:pe-[30px] lg:ps-16">
          <span className="font-jost inline-flex w-fit items-center gap-2.5 rounded-full border-[1.5px] border-sage-400 bg-white/45 px-[18px] py-[9px] text-[11px] font-medium uppercase tracking-[0.22em] text-forest-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-forest-600"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
            Green Gifting for Corporate
          </span>
          <h2 className="font-cormorant mt-4 text-[2.4rem] font-semibold leading-[1.0] tracking-[-0.02em] text-forest-900 sm:text-[56px]">
            Gift Green.<br />Grow Meaningful <span className="text-forest-600">Connections.</span>
          </h2>
          <div className="mt-4 flex max-w-[472px] items-center gap-[13px]">
            <div className="h-px w-[120px] shrink-0 bg-kraft-300 sm:w-[186px]" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] text-forest-500"><path d="M7 20s-1-7 4-11c0 0 2 4-1 7" /><path d="M12 20c0-6 4-10 9-10 0 6-4 10-9 10Z" /></svg>
            <div className="h-px flex-1 bg-kraft-300" />
          </div>
          <p className="mt-3.5 max-w-[468px] text-[16px] leading-[1.58] tracking-[0.002em] text-[#33422F] sm:text-[19px]">
            Thoughtful plant gifts that inspire, appreciate and leave a lasting impact.
          </p>
          {/* four reasons */}
          <div className="mt-6 grid max-w-[820px] grid-cols-2 gap-y-7 sm:flex sm:items-stretch">
            {REASONS.map((r, i) => (
              <div key={r.a} className="relative flex flex-1 flex-col items-center px-2 text-center sm:px-3.5">
                {i > 0 && <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-kraft-300 sm:block" />}
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-sage-100 text-forest-700 sm:h-[62px] sm:w-[62px]">{r.icon}</div>
                <div className="mt-3.5 text-[13px] font-semibold leading-[1.45] tracking-[0.01em] text-forest-900 sm:text-[13.5px]">{r.a}<br />{r.b}</div>
              </div>
            ))}
          </div>
          <Link href="/corporate-gifting" className="font-jost mt-6 inline-flex w-fit items-center gap-3 rounded-[11px] bg-forest-800 px-[30px] py-[17px] text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-forest-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" /></svg>
            Gift Green, Grow Together
          </Link>
        </div>
        {/* right photo */}
        <div className="relative h-64 min-h-[260px] w-full sm:h-80 lg:h-auto lg:flex-[1_1_44%]">
          <SafeImage src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1100&q=72&auto=format&fit=crop" alt="Corporate plant gifting" fill sizes="(max-width:1024px) 100vw, 44vw" className="object-cover" />
        </div>
      </div>

      {/* dark assurance band */}
      <div className="px-5 pb-[24px] pt-3.5 sm:px-8 lg:px-16">
        <div className="flex flex-col items-stretch gap-5 rounded-[18px] bg-forest-800 px-6 py-[22px] sm:flex-row sm:gap-0 sm:px-[26px]">
          {ASSURE.map((g, i) => (
            <div key={g.title} className="relative flex flex-1 items-center gap-[18px] px-2 py-1 sm:px-[30px]">
              {i > 0 && <div className="absolute left-0 top-1/2 hidden h-[58px] w-px -translate-y-1/2 bg-white/[0.16] sm:block" />}
              <span className="shrink-0 text-gold-300">{g.icon}</span>
              <div className="min-w-0">
                <div className="font-jost text-[13px] font-semibold uppercase leading-[1.2] tracking-[0.14em] text-white sm:text-[14px]">{g.title}</div>
                <div className="mt-1.5 text-[13px] leading-[1.52] tracking-[0.004em] text-white/[0.74] sm:text-[13.5px]">{g.a}<br />{g.b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GiftingBand;
