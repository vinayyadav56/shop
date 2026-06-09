import React from 'react';

const Truck = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></svg>
);
const Replace = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
);
const Lock = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
const Gem = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M12 3L8 9l4 12 4-12-4-6z" /></svg>
);

const ITEMS = [
  { icon: Truck, title: 'Free Delivery', sub: 'Above ₹999' },
  { icon: Replace, title: '7 Day Replacement', sub: 'For Damaged Plants' },
  { icon: Lock, title: 'Secure Payment', sub: '100% Safe & Secure' },
  { icon: Gem, title: 'Premium Quality', sub: 'Hand Picked Plants' },
];

export default function TrustBar() {
  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-7 sm:px-8 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <div
            key={it.title}
            className={`flex items-center gap-3 px-2 sm:justify-center ${i > 0 ? 'lg:border-l lg:border-kraft-200' : ''}`}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700">
              <it.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[13.5px] font-semibold text-forest-900">{it.title}</div>
              <div className="text-[12px] text-stone-500">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
