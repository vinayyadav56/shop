'use client';
import React from 'react';
import Link from 'next/link';
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

/**
 * Mockup-style section header: small green eyebrow label + large Playfair title
 * on the left, optional "View All →" link on the right.
 */
export function SectionHead({
  label,
  title,
  viewAllHref,
  viewAllText,
}: {
  label: string;
  title: string;
  viewAllHref?: string;
  viewAllText?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--ds-accent)]">
          {label}
        </p>
        <h2 className="mt-1.5 flex items-center gap-2.5 font-playfair text-[1.9rem] font-bold leading-tight tracking-tight text-forest-900 sm:text-[2.4rem]">
          {title}
          <Icon.leaf className="h-5 w-5 shrink-0 text-gold" />
        </h2>
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-forest-700 transition hover:gap-2.5 hover:text-[var(--ds-accent)]"
        >
          {viewAllText ?? 'View All'} <Icon.arrow className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
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
