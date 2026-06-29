'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useBannerEnabled } from '@/lib/use-home-config';

// title / sub-title / supporting line / Font Awesome icon
const PERKS: { a: string; b: string; c: string; icon: string }[] = [
  { a: 'Best Quality', b: 'Products', c: 'Hand-picked, nursery-fresh', icon: 'fa-award' },
  { a: 'Expert Plant', b: 'Care Support', c: 'Real guidance, anytime', icon: 'fa-headset' },
  { a: 'Easy Returns', b: '& Refunds', c: '7-day, hassle-free', icon: 'fa-arrow-rotate-left' },
  { a: 'Secure', b: 'Payments', c: '100% protected checkout', icon: 'fa-shield-halved' },
];

export function SpringSaleBand() {
  const { t } = useTranslation('common');
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
            {t('home-sale-eyebrow')}
            <i className="fa-solid fa-seedling" aria-hidden style={{ color: '#8FD56F', fontSize: 14 }} />
          </div>
          <div className="font-hanken" style={{ fontWeight: 800, fontSize: 30, lineHeight: 1, color: '#DCC07A' }}>
            {t('home-sale-discount')}
          </div>
          <div className="font-hanken" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 7 }}>
            {t('home-sale-condition')}
          </div>
          <Link
            href="/plants/search"
            className="font-hanken"
            style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#3A6B33', color: '#fff', borderRadius: 10, padding: '11px 22px', fontSize: 14, fontWeight: 700 }}
          >
            {t('home-sale-cta')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {/* perks */}
        <div
          style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 18, paddingLeft: 34, borderLeft: '1px solid rgba(255,255,255,0.16)' }}
        >
          {PERKS.map((p) => (
            <div key={`${p.a}-${p.b}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{ flexShrink: 0, display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 999, background: 'rgba(143,213,111,0.12)', border: '1px solid rgba(143,213,111,0.25)' }}
              >
                <i className={`fa-solid ${p.icon}`} aria-hidden style={{ color: '#8FD56F', fontSize: 17 }} />
              </span>
              <div className="font-hanken" style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  {p.a} {p.b}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.62)', marginTop: 2 }}>
                  {p.c}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpringSaleBand;
