'use client';
import React from 'react';
import { useRouter } from 'next/router';

const GIFT_IMG =
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=70';

export function Gifting() {
  const router = useRouter();
  return (
    <div className="px-5">
      <div className="relative flex min-h-[160px] overflow-hidden rounded-[18px] bg-[linear-gradient(120deg,#1e4124,#0e2012)] shadow-[0_8px_24px_rgba(34,48,26,0.09)]">
        <div className="relative z-[2] w-[62%] p-[18px_16px] text-white">
          <div className="mb-2 font-hanken text-[9px] font-bold uppercase tracking-[0.2em] text-sage-300">Gifting</div>
          <h3 className="mb-1.5 font-hanken text-[20px] font-extrabold leading-[1.08] text-white">Green gifting,<br />always a good idea.</h3>
          <p className="mb-3.5 text-[12px] leading-[1.45] text-white/80">Wrapped with care and a hand-written note.</p>
          <button type="button" onClick={() => router.push('/corporate-gifting')} className="inline-flex items-center gap-[7px] rounded-full bg-forest-600 px-4 py-2.5 font-hanken text-[12.5px] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-forest-500 active:scale-95">
            Explore gift plants
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={GIFT_IMG} alt="" className="absolute right-0 top-0 h-full w-[46%] object-cover" />
        <div className="absolute right-0 top-0 h-full w-[46%] bg-[linear-gradient(90deg,#0e2012_0%,rgba(14,32,18,0)_60%)]" />
      </div>
    </div>
  );
}

export default Gifting;
