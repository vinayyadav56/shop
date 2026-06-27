'use client';
import React from 'react';
import Link from 'next/link';
import { useBannerEnabled } from '@/lib/use-home-config';
import { PLACEHOLDER } from './_img';

/** Mobile "Corporate Gifting" section (sage card + hero photo + 4 reasons + dark
 *  assurance band), matched to the Mobile Home reference. Separate from the luxury
 *  gilded banner (pah/gifting.tsx) that follows it. */
const REASONS: { a: string; b: string; icon: React.ReactNode }[] = [
  { a: 'Better for People', b: '& Workspaces', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="3.2" /></svg>) },
  { a: 'Elegant Gifts for', b: 'Every Occasion', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><rect x="3" y="8" width="18" height="13" rx="1.5" /><path d="M3 12h18M12 8v13" /><path d="M12 8S10.5 3.5 8 4.5 9 8 12 8Zm0 0s1.5-4.5 4-3.5S15 8 12 8Z" /></svg>) },
  { a: 'Sustainable Choice', b: 'for a Greener Future', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M11 20A8 8 0 0 1 3 12C3 6 8 2 13 2c0 6-2.5 10-2.5 10S15 10 19 10c0 5-4 9-8 10Z" /></svg>) },
  { a: 'Perfect for Clients,', b: 'Partners & Team', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="m8 12 2.5 2.5L14 11" /><path d="M21 11.5 12.5 20a2 2 0 0 1-2.8 0L3 13.3V5a2 2 0 0 1 2-2h7.3" /></svg>) },
];

const ASSURE: { title: string; sub: string; icon: React.ReactNode }[] = [
  { title: 'Curated with Care', sub: 'Premium plants, beautifully packaged.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M12 3l1.9 4.3L18.5 8l-3.4 3.1.9 4.6L12 13.6 8 15.7l.9-4.6L5.5 8l4.6-.7Z" /></svg>) },
  { title: 'Customized for You', sub: 'Personalized messages, branding & bulk.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>) },
  { title: 'Pan India Delivery', sub: 'Timely and safe delivery across India.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M5 17H3V6h11v11" /><path d="M14 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.7" /><circle cx="17.5" cy="18" r="1.7" /></svg>) },
];

function HeroImg() {
  const [err, setErr] = React.useState(false);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={err ? PLACEHOLDER : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=700&q=72&auto=format&fit=crop'} alt="Corporate plant gifting" loading="lazy" onError={() => setErr(true)} className="absolute inset-0 h-full w-full object-cover" />;
}

export function CorporateGifting() {
  if (!useBannerEnabled('gifting')) return null;
  return (
    <div className="mx-5 mb-7 rounded-[28px] bg-sage-100 p-5 shadow-[0_1px_3px_rgba(20,40,24,0.06)]">
      {/* hero photo */}
      <div className="relative mb-5 h-[182px] overflow-hidden rounded-2xl shadow-[0_2px_8px_rgba(34,48,26,0.07)]"><HeroImg /></div>
      {/* copy */}
      <div className="text-center">
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-forest-600">Green Gifting for Corporate</span>
        <h2 className="font-pahserif mt-2 text-[27px] font-semibold leading-[1.05] tracking-[-0.01em] text-forest-900">Gift Green. Grow Meaningful <span className="text-forest-600">Connections.</span></h2>
        <p className="mx-auto mt-2.5 max-w-[300px] text-[12.5px] leading-[1.5] text-[#33422F]">Thoughtful plant gifts that inspire, appreciate and leave a lasting impact.</p>
      </div>
      {/* 4 reasons (2x2) */}
      <div className="mt-5 grid grid-cols-2 gap-x-2.5 gap-y-5">
        {REASONS.map((r) => (
          <div key={r.a} className="flex flex-col items-center text-center">
            <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-forest-700 shadow-[0_2px_8px_rgba(20,40,24,0.06)]">{r.icon}</span>
            <span className="mt-2.5 text-[12px] font-semibold leading-[1.4] text-forest-900">{r.a}<br />{r.b}</span>
          </div>
        ))}
      </div>
      {/* CTA */}
      <Link href="/corporate-gifting" className="pa-btn pa-btn-primary mt-5 w-full gap-2.5 rounded-[12px] px-4 py-4 text-[12px] uppercase tracking-[0.12em]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7S10 2.5 7 3.5 9 7 12 7Zm0 0s2-4.5 5-3.5S15 7 12 7Z" /></svg>
        Gift Green, Grow Together
      </Link>
      {/* assurance band */}
      <div className="mt-4 rounded-2xl bg-forest-800 px-[18px] py-1">
        {ASSURE.map((g, i) => (
          <div key={g.title} className={`flex items-center gap-3.5 py-3.5 ${i > 0 ? 'border-t border-white/[0.12]' : ''}`}>
            <span className="shrink-0 text-[#E3CE97]">{g.icon}</span>
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-white">{g.title}</div>
              <div className="mt-0.5 text-[11.5px] leading-[1.45] text-white/[0.74]">{g.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CorporateGifting;
