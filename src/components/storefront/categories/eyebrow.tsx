'use client';
import React from 'react';

/** Small gold-rule + uppercase label used above each section (design reference). */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span aria-hidden className="h-px w-[18px] bg-gold" />
      <span className="font-heading text-[10px] font-bold uppercase tracking-[0.26em] text-gold">
        {children}
      </span>
    </div>
  );
}

export default Eyebrow;
