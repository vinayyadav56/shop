'use client';
import React from 'react';
import Link from 'next/link';
import { useBannerEnabled } from '@/lib/use-home-config';

const PERKS: { a: string; b: string; icon: JSX.Element }[] = [
  {
    a: 'Best Quality',
    b: 'Products',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
  },
  {
    a: 'Expert Plant',
    b: 'Care Support',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
    ),
  },
  {
    a: 'Easy Returns',
    b: '& Refunds',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
    ),
  },
  {
    a: 'Secure',
    b: 'Payments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /></svg>
    ),
  },
];

export function SpringSaleBand() {
  if (!useBannerEnabled('specialOffer')) return null;
  return (
    <section style={{ marginTop: 48 }}>
      <div
        className="relative overflow-hidden bg-[linear-gradient(115deg,#23552f_0%,#143620_52%,#0c2416_100%)]"
        style={{ padding: '22px 64px', display: 'flex', alignItems: 'center', gap: 34 }}
      >
        <svg
          aria-hidden
          width="180"
          height="180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'absolute', right: -20, bottom: -34, opacity: 0.08, zIndex: 0 }}
        >
          <path d="M12 22V6" />
          <path d="M12 11c0-3 2-5.5 6-6-.2 4-2.5 6-6 6Z" />
          <path d="M12 14c0-2.6-1.8-4.6-5-5 .2 3.4 2 5 5 5Z" />
        </svg>

        {/* offer */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, width: 232 }}>
          <div
            className="font-hanken"
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.86)', marginBottom: 7 }}
          >
            Spring Sale is Live!
            <i className="fa-solid fa-seedling" aria-hidden style={{ color: '#8FD56F', fontSize: 14 }} />
          </div>
          <div className="font-hanken" style={{ fontWeight: 800, fontSize: 30, lineHeight: 1, color: '#DCC07A' }}>
            FLAT 20% OFF
          </div>
          <div className="font-hanken" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 7 }}>
            On Orders Above ₹999
          </div>
          <Link
            href="/plants/search"
            className="font-hanken"
            style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#3A6B33', color: '#fff', borderRadius: 10, padding: '11px 22px', fontSize: 14, fontWeight: 700 }}
          >
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {/* perks */}
        <div
          style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 18, paddingLeft: 34, borderLeft: '1px solid rgba(255,255,255,0.16)' }}
        >
          {PERKS.map((p) => (
            <div key={`${p.a}-${p.b}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ flexShrink: 0, color: '#8FD56F' }}>{p.icon}</span>
              <div className="font-hanken" style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.28 }}>
                {p.a}
                <br />
                {p.b}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpringSaleBand;
