'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { useBannerEnabled } from '@/lib/use-home-config';

export function Gifting() {
  const router = useRouter();
  if (!useBannerEnabled('gifting')) return null;
  return (
    <div className="px-5 pb-1.5 pt-[26px]">
      <div className="relative overflow-hidden rounded-[18px] bg-[radial-gradient(130%_90%_at_50%_-10%,#2a5535_0%,#16321e_42%,#0c1d12_100%)] shadow-[0_18px_40px_rgba(10,22,14,0.4)]">
        {/* botanical line art */}
        <svg className="absolute -right-[26px] -top-[30px] z-0 opacity-[0.10]" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#DCC07A" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V5" /><path d="M12 10c0-3.2 2.2-5.7 6.2-6.2C18 7.6 15.6 10 12 10Z" /><path d="M12 13c0-2.7-1.9-4.8-5.2-5.2C6.6 11.3 9 13 12 13Z" /><path d="M12 7.5c0-2 1.2-3.6 3.4-4" /></svg>
        <svg className="absolute -bottom-[34px] -left-[30px] z-0 -scale-x-100 opacity-[0.08]" width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#DCC07A" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V5" /><path d="M12 10c0-3.2 2.2-5.7 6.2-6.2C18 7.6 15.6 10 12 10Z" /><path d="M12 13c0-2.7-1.9-4.8-5.2-5.2C6.6 11.3 9 13 12 13Z" /></svg>
        {/* top gilt glow */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(80%_55%_at_50%_0%,rgba(220,192,122,0.16),rgba(220,192,122,0)_70%)]" />
        {/* inset gilded double frame */}
        <div className="pointer-events-none absolute inset-[9px] z-[1] rounded-[13px] border border-[#C8A24B]/50 shadow-[inset_0_0_0_3px_rgba(220,192,122,0.12)]" />
        {/* corner brackets */}
        <div className="absolute left-[5px] top-[5px] z-[2] h-4 w-4 rounded-tl-md border-l-[1.5px] border-t-[1.5px] border-[#DCC07A]" />
        <div className="absolute right-[5px] top-[5px] z-[2] h-4 w-4 rounded-tr-md border-r-[1.5px] border-t-[1.5px] border-[#DCC07A]" />
        <div className="absolute bottom-[5px] left-[5px] z-[2] h-4 w-4 rounded-bl-md border-b-[1.5px] border-l-[1.5px] border-[#DCC07A]" />
        <div className="absolute bottom-[5px] right-[5px] z-[2] h-4 w-4 rounded-br-md border-b-[1.5px] border-r-[1.5px] border-[#DCC07A]" />

        {/* content */}
        <div className="relative z-[3] flex flex-col items-center px-[26px] pb-[26px] pt-[28px] text-center text-white">
          <span className="font-jost text-[9.5px] font-medium uppercase tracking-[0.34em] text-[#DCC07A]">The Art of Gifting</span>
          <div className="my-[11px] mb-[13px] flex items-center gap-[9px]">
            <span className="h-px w-[34px] bg-[linear-gradient(90deg,rgba(220,192,122,0),#C9A24B)]" />
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DCC07A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-8" /><path d="M12 13c0-3 2-5.2 5.4-5.6C17.2 11 14.8 13 12 13Z" /><path d="M12 15c0-2.4-1.7-4.3-4.6-4.7C7.2 13.2 9.3 15 12 15Z" /></svg>
            <span className="h-px w-[34px] bg-[linear-gradient(90deg,#C9A24B,rgba(220,192,122,0))]" />
          </div>
          <h3 className="m-0 font-pahserif text-[30px] font-medium leading-[1.06] tracking-[0.01em] text-[#FCFBF6]">
            Green gifting,<br /><span className="italic text-[#DCC07A]">always</span> a good idea.
          </h3>
          <p className="mx-0 mb-[18px] mt-3 max-w-[248px] font-hanken text-[12px] leading-[1.55] text-[#F5F2EA]/[0.74]">
            Hand-tied plants and gilded keepsakes, delivered with care to someone you love.
          </p>
          <button type="button" onClick={() => router.push('/corporate-gifting')} className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#DCC07A,#B8923E)] px-[22px] py-[11px] font-jost text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-900 shadow-[0_8px_20px_rgba(184,146,62,0.35)] transition hover:shadow-[0_10px_26px_rgba(184,146,62,0.5)] active:scale-95">
            Explore gift plants
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16301A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gifting;
