'use client';
import React from 'react';
import { useBannerEnabled } from '@/lib/use-home-config';

/**
 * Top promo strip from the Web Home reference. Desktop/tablet only (the Mobile
 * Home reference has no announcement bar) and admin-toggleable via
 * settings.options.homeBanners.announcement (defaults on).
 */
export function AnnouncementBar() {
  if (!useBannerEnabled('announcement')) return null;
  return (
    <div className="hidden w-full bg-[#0E2413] md:block">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-[12.5px] font-medium tracking-[0.01em] text-white/[0.92]">
        <span className="inline-flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] text-[#8FD56F]" aria-hidden><path d="M5 17H3V6h11v11" /><path d="M14 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>
          Free shipping on orders above ₹499
        </span>
        <span className="text-white/25" aria-hidden>|</span>
        <span>Extra 5% off on prepaid orders</span>
      </div>
    </div>
  );
}

export default AnnouncementBar;
