'use client';
import React from 'react';

const ITEMS: { title: string; sub: string; icon: JSX.Element }[] = [
  {
    title: '100% Quality Assured',
    sub: 'Only healthy & handpicked plants',
    icon: <i className="fa-solid fa-shield-heart" aria-hidden style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Secure Packaging',
    sub: 'Safe delivery to your doorstep',
    icon: <i className="fa-solid fa-box-open" aria-hidden style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Loved by 10,000+',
    sub: 'Happy plant parents',
    icon: <i className="fa-solid fa-users" aria-hidden style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Expert Guidance',
    sub: 'Helping you at every step',
    icon: <i className="fa-solid fa-headset" aria-hidden style={{ fontSize: '20px' }} />,
  },
];

export function TrustRow() {
  return (
    <section className="font-hanken px-5 pt-8 pb-9 sm:px-8 lg:px-[64px] lg:pt-[40px] lg:pb-[44px]">
      <div
        className="grid grid-cols-2 gap-5 lg:grid-cols-4"
        style={{
          background: '#fff',
          border: '1px solid #E9E3D6',
          borderRadius: '16px',
          padding: '16px 28px',
          boxShadow: '0 2px 8px rgba(34,48,26,0.07)',
        }}
      >
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-3.5">
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700">
              {it.icon}
            </span>
            <div>
              <div className="text-[14.5px] font-bold leading-[1.15] text-forest-900">{it.title}</div>
              <div className="mt-[3px] text-[12px] leading-[1.3] text-stone-500">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustRow;
