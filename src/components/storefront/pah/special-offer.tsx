'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { useBannerEnabled } from '@/lib/use-home-config';

const PERKS = [
  { label: 'Secure Packaging', icon: <><path d="M3 8 12 3l9 5v8l-9 5-9-5Z" /><path d="M3 8l9 5 9-5M12 13v8" /></> },
  { label: 'Live Plant Guarantee', icon: <><path d="M12 21V11" /><path d="M12 11c0-3.4 2.4-5.8 6-6.3C17.5 8 15.4 11 12 11Z" /><path d="M12 13c0-2.8-1.9-4.8-5-5.2C6.6 11 9 13 12 13Z" /></> },
  { label: 'Easy Returns', icon: <><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 3v4h-4" /></> },
  { label: 'Fast & Safe Delivery', icon: <><path d="M2 7h11v8H2zM13 9h4l3 3v3h-7z" /><circle cx="6" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></> },
];

export function SpecialOffer() {
  const router = useRouter();
  if (!useBannerEnabled('specialOffer')) return null;
  return (
    <div className="mb-6 px-5">
      <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#234a2a,#0e2012)] p-4 text-white shadow-[0_8px_24px_rgba(34,48,26,0.09)]">
        <div className="w-[112px] flex-none">
          <div className="mb-[5px] font-hanken text-[7.5px] font-bold uppercase tracking-[0.18em] text-[#DCC07A]">Special Offer</div>
          <div className="whitespace-nowrap font-hanken text-[18px] font-extrabold leading-none tracking-[-0.01em] text-[#DCC07A]">FLAT 20% OFF</div>
          <div className="mt-1 text-[9px] text-white/[0.72]">On orders above ₹999</div>
          <button type="button" onClick={() => router.push('/plants/search')} className="mt-2.5 inline-flex items-center gap-[5px] rounded-[9px] bg-forest-600 px-3 py-1.5 font-hanken text-[11px] font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-forest-700 active:scale-95">
            Shop now
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="flex min-w-0 flex-1 justify-between gap-[7px] border-l border-white/[0.16] pl-3.5">
          {PERKS.map((p) => (
            <div key={p.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center text-white/[0.92]">
              <span className="text-sage-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg></span>
              <span className="text-[8.5px] leading-[1.2]">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpecialOffer;
