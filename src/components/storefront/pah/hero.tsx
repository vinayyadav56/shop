'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { useCart } from '@/store/quick-cart/cart.context';
import { useBannerEnabled } from '@/lib/use-home-config';

const HERO_IMG =
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=70';

const CHIPS = [
  { label: 'Air Purifying', icon: <path d="M12 22V8M12 8c0-3 2-5.5 6-6-.2 4-2.5 6-6 6ZM12 12c0-2.6-1.8-4.6-5-5 .2 3.4 2 5 5 5Z" /> },
  { label: 'Easy Care', icon: <><path d="M9 4 12 9 15 4" /><path d="M12 9v11" /><path d="M12 13c-2.4 0-4.4-1.6-5-4 2.6.2 4.4 1.6 5 4Z" /></> },
  { label: 'Fast Delivery', icon: <><path d="M2 7h11v8H2zM13 9h4l3 3v3h-7z" /><circle cx="6" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></> },
];

export function Hero() {
  const router = useRouter();
  const [, setDrawer] = useAtom(drawerAtom);
  const { totalUniqueItems } = useCart();
  const showOffer = useBannerEnabled('heroOffer');

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,30,18,0.72)_0%,rgba(15,30,18,0.34)_38%,rgba(15,30,18,0.26)_64%,rgba(15,30,18,0.40)_100%)]" />

      <div className="relative z-[2] px-5 pb-11 pt-3.5 text-white">
        {/* top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button type="button" aria-label="Menu" onClick={() => setDrawer({ display: true, view: 'MAIN_MENU_VIEW' })} className="flex p-1 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" /></svg>
          </button>
          <div className="flex items-end gap-[9px]">
            <span className="font-jost text-[18px] font-normal uppercase tracking-[0.3em] text-white">PLANT</span>
            <span className="relative inline-flex items-center justify-center">
              <svg className="absolute -top-[11px]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#86E0A3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11" /><path d="M12 11c0-3.5 2.5-6 6.5-6.5C18 8.5 15.5 11 12 11Z" /><path d="M12 13c0-3-2-5-5.5-5.5C6 11 8.5 13 12 13Z" /></svg>
              <span className="font-jost text-[18px] font-normal uppercase tracking-[0.2em] text-white">A</span>
            </span>
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
        <div>
          <span className="mb-3.5 inline-flex items-center gap-[7px] rounded-full border border-[#86E0A3]/60 bg-[#0F1E12]/[0.55] px-[13px] py-[5px] text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />Live Plants
          </span>
          <h1 className="m-0 whitespace-nowrap font-hanken text-[30px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white">
            Bring Nature Home.<br /><span className="text-[#5FE08A]">Live Better.</span>
          </h1>

          {/* chips pill (left) + offer card (right) */}
          <div className="mt-5 flex items-end justify-between gap-2">
            <div className="inline-flex shrink-0 items-stretch rounded-full bg-white/[0.96] p-[3px_3px] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
              {CHIPS.map((c, i) => (
                <React.Fragment key={c.label}>
                  {i > 0 ? <span className="my-[3px] w-px bg-kraft-200" /> : null}
                  <span className="inline-flex items-center gap-[3px] whitespace-nowrap px-[5px] py-0.5 text-[8.5px] font-bold text-forest-900">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3A6B33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                    {c.label}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {showOffer ? (
              <div className="w-[100px] shrink-0 rounded-[14px] border border-white/20 bg-[#0D1C10]/[0.64] p-[9px_8px] text-center shadow-[0_10px_26px_rgba(0,0,0,0.32)]">
                <div className="mb-[3px] text-[7px] font-semibold uppercase tracking-[0.1em] text-white/[0.82]">Limited Time Offer</div>
                <div className="font-hanken text-[23px] font-extrabold leading-none text-white">40%<span className="text-[13px]"> OFF</span></div>
                <div className="my-0.5 mb-2 text-[8px] text-white/[0.78]">On selected plants</div>
                <button type="button" onClick={() => router.push('/plants/search')} className="flex w-full items-center justify-center gap-1 rounded-[9px] bg-forest-600 px-1 py-1.5 text-[10px] font-semibold text-white transition hover:bg-forest-700 active:scale-95">
                  Shop now
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
