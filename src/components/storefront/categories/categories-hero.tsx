'use client';
import React from 'react';

/**
 * Forest-gradient title banner for /categories — the design's bespoke header,
 * minus the phone chrome / nav / cart (the app's own sticky header sits above).
 * Eyebrow "Browse" + Manrope "All categories" with a gold accent word.
 */
export function CategoriesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-[#0e2012] px-5 pb-9 pt-6 text-white sm:px-8 sm:pb-12 sm:pt-9">
      {/* gold radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-9 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(212,164,75,0.18),transparent_70%)]"
      />
      {/* faint leaf watermark */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-0 h-32 w-32 opacity-[0.12]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--ds-gold)"
        strokeWidth="0.9"
      >
        <path d="M12 22V9M12 9c0-4 3-7 8-7.5C19.5 6 16.5 9 12 9ZM12 13c0-3.4-2.4-6-7-6.5C5.3 11 8 13 12 13Z" />
      </svg>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-2 flex items-center gap-2">
          <span aria-hidden className="h-px w-[18px] bg-ds-gold" />
          <span className="font-heading text-[10px] font-bold uppercase tracking-[0.26em] text-ds-gold">
            Browse
          </span>
        </div>
        <h1 className="font-heading text-[2.35rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[3rem]">
          All <span className="text-ds-gold">categories</span>
        </h1>
      </div>
    </section>
  );
}

export default CategoriesHero;
