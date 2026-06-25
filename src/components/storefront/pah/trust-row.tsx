'use client';
import React from 'react';

const TRUST = [
  { label: 'Live Arrival Guarantee', icon: <><path d="M12 3 5 6v5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6Z" /><path d="m9 11.5 2 2 4-4" /></> },
  { label: '100% Secure Payment', icon: <><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></> },
  { label: 'Easy Returns & Refunds', icon: <><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 3v4h-4" /></> },
  { label: 'Fast & Safe Delivery', icon: <><path d="M2 7h11v8H2zM13 9h4l3 3v3h-7z" /><circle cx="6" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></> },
];

export function TrustRow() {
  return (
    <div className="px-5">
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-[18px] border border-kraft-200 bg-white p-[16px_14px] shadow-[0_2px_8px_rgba(34,48,26,0.07)]">
        {TRUST.map((t) => (
          <div key={t.label} className="flex items-center gap-2.5">
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
            </span>
            <span className="text-[11.5px] font-semibold leading-[1.25] text-forest-900">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustRow;
