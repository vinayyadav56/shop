'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { useCart } from '@/store/quick-cart/cart.context';

const HERO_IMG =
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=70';

const CHIPS = [
  { label: 'Air purifying', icon: <path d="M12 22V8M12 8c0-3 2-5.5 6-6-.2 4-2.5 6-6 6ZM12 12c0-2.6-1.8-4.6-5-5 .2 3.4 2 5 5 5Z" /> },
  { label: 'Easy care', icon: <><path d="M9 4 12 9 15 4" /><path d="M12 9v11" /><path d="M12 13c-2.4 0-4.4-1.6-5-4 2.6.2 4.4 1.6 5 4Z" /></> },
  { label: 'Fast delivery', icon: <><path d="M2 7h11v8H2zM13 9h4l3 3v3h-7z" /><circle cx="6" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></> },
];

export function Hero() {
  const router = useRouter();
  const [, setDrawer] = useAtom(drawerAtom);
  const { totalUniqueItems } = useCart();

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,18,0.72)_0%,rgba(15,30,18,0.34)_38%,rgba(15,30,18,0.30)_62%,rgba(15,30,18,0.66)_100%)]" />

      <div className="relative z-[2] px-5 pb-[30px] pt-3.5 text-white">
        {/* top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button type="button" aria-label="Menu" onClick={() => setDrawer({ display: true, view: 'MAIN_MENU_VIEW' })} className="flex p-1 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-jost text-[18px] font-normal uppercase tracking-[0.3em] text-white">PLANT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86E0A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11" /><path d="M12 11c0-3.5 2.5-6 6.5-6.5C18 8.5 15.5 11 12 11Z" /><path d="M12 13c0-3-2-5-5.5-5.5C6 11 8.5 13 12 13Z" /></svg>
            <span className="font-jost text-[18px] font-normal uppercase tracking-[0.3em] text-white">HOME</span>
          </div>
          <button type="button" aria-label="Cart" onClick={() => setDrawer({ display: true, view: 'cart' })} className="relative flex p-1 text-white transition active:scale-90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M2 3h2.2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h9.2a1.5 1.5 0 0 0 1.5-1.2L21 7H5" /></svg>
            {totalUniqueItems > 0 ? (
              <span className="absolute -right-1.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-clay-500 px-1 text-[11px] font-bold text-white">{totalUniqueItems}</span>
            ) : null}
          </button>
        </div>

        {/* hero body */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <span className="mb-4 inline-flex items-center gap-[7px] rounded-full border border-[#86E0A3]/60 bg-[#0F1E12]/40 px-[13px] py-[5px] text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />Live Plants
            </span>
            <h1 className="font-hanken text-[38px] font-extrabold leading-[1.0] tracking-[-0.02em] text-white">
              Bring Nature<br />Home.<br /><span className="text-[#5FE08A]">Live Better.</span>
            </h1>
          </div>

          {/* offer card */}
          <div className="mt-2 w-[138px] shrink-0 rounded-[18px] border border-white/20 bg-[#0F1E12]/[0.46] p-[14px_13px] text-center shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur-lg">
            <div className="mb-1.5 text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white/85">Limited Time Offer</div>
            <div className="font-hanken text-[34px] font-extrabold leading-none text-white">40%<span className="text-[18px]"> OFF</span></div>
            <div className="my-1.5 mb-3 text-[11px] text-white/80">On selected plants</div>
            <button type="button" onClick={() => router.push('/plants/search')} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-700 py-[9px] text-[12.5px] font-semibold text-white transition hover:bg-forest-800 active:scale-95">
              Shop now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        {/* feature chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[12.5px] font-medium text-forest-900">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2E5E2A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
