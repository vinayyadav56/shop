'use client';
import React from 'react';
import { Icon } from '../icons';

/** Centred eyebrow heading used by the mockup ("SHOP BY CATEGORY", "BEST SELLERS"). */
export function CenterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center justify-center gap-2.5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-forest-800">
      <span aria-hidden className="h-px w-8 bg-gold/50" />
      {children}
      <Icon.leaf className="h-4 w-4 text-gold" />
      <span aria-hidden className="h-px w-8 bg-gold/50" />
    </h2>
  );
}

/** Left-aligned scroll arrows used by the category + bestseller carousels. */
export function ScrollArrows({
  onLeft,
  onRight,
  className = '',
}: {
  onLeft: () => void;
  onRight: () => void;
  className?: string;
}) {
  const btn =
    'grid h-9 w-9 place-items-center rounded-full border border-kraft-300 bg-white text-forest-800 shadow-sm transition hover:border-forest-500 hover:text-forest-600';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button type="button" aria-label="Scroll left" onClick={onLeft} className={btn}>
        <Icon.chevron className="h-4 w-4 rotate-180" />
      </button>
      <button type="button" aria-label="Scroll right" onClick={onRight} className={btn}>
        <Icon.chevron className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Shared hook: scroll a horizontal track left/right by ~80% of its width. */
export function useTrackScroll() {
  const ref = React.useRef<HTMLDivElement>(null);
  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.82), behavior: 'smooth' });
  };
  return { ref, left: () => by(-1), right: () => by(1) };
}
