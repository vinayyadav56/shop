'use client';
import React from 'react';
import { useRouter } from 'next/router';

const PERKS = [
  { label: 'Secure Packaging', icon: <><path d="M3 8 12 3l9 5v8l-9 5-9-5Z" /><path d="M3 8l9 5 9-5M12 13v8" /></> },
  { label: 'Live Plant Guarantee', icon: <><path d="M12 21V11" /><path d="M12 11c0-3.4 2.4-5.8 6-6.3C17.5 8 15.4 11 12 11Z" /><path d="M12 13c0-2.8-1.9-4.8-5-5.2C6.6 11 9 13 12 13Z" /></> },
  { label: 'Easy Returns', icon: <><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 3v4h-4" /></> },
  { label: 'Fast & Safe Delivery', icon: <><path d="M2 7h11v8H2zM13 9h4l3 3v3h-7z" /><circle cx="6" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></> },
];

export function SpecialOffer() {
  const router = useRouter();
  return (
    <div className="px-5">
      <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(150deg,#1e4124,#0e2012)] p-[20px_18px_16px] text-white shadow-[0_8px_24px_rgba(34,48,26,0.09)]">
        <svg className="absolute -bottom-[22px] -right-[14px] opacity-[0.12]" width="124" height="124" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="0.9"><path d="M12 22V9M12 9c0-4 3-7 8-7.5C19.5 6 16.5 9 12 9ZM12 13c0-3.4-2.4-6-7-6.5C5.3 11 8 13 12 13Z" /></svg>
        <div className="relative flex items-center justify-between gap-3.5">
          <div className="min-w-0">
            <div className="mb-[9px] font-hanken text-[10px] font-bold uppercase tracking-[0.2em] text-sage-300">Special Offer</div>
            <div className="font-hanken text-[32px] font-extrabold leading-[0.98] text-[#DCC07A]">FLAT 20% OFF</div>
            <div className="mt-[7px] text-[13px] text-white/[0.78]">On orders above ₹999</div>
          </div>
          <button type="button" onClick={() => router.push('/plants/search')} className="inline-flex shrink-0 items-center gap-[7px] rounded-full bg-forest-600 px-[18px] py-[11px] font-hanken text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-forest-500 active:scale-95">
            Shop now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="mt-[18px] flex justify-between gap-2 border-t border-white/[0.16] pt-4">
          {PERKS.map((p) => (
            <div key={p.label} className="flex flex-1 flex-col items-center gap-1.5 text-center text-white/90">
              <span className="text-sage-300"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg></span>
              <span className="text-[9.5px] leading-[1.25]">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpecialOffer;
