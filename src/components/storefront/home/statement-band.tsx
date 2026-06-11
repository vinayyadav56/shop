'use client';
import React from 'react';
import { Counter } from '../motion';

const STATS = [
  { value: 50000, suffix: '+', label: 'Plant Parents' },
  { value: 4.9, decimals: 1, suffix: '', label: 'Average Rating' },
  { value: 200, suffix: '+', label: 'Curated Species' },
];

/** Full-bleed dark brand-statement moment with quiet animated stats. */
export function StatementBand() {
  return (
    <section className="relative overflow-hidden g-band">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_70%_20%,var(--g-band-glow),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-24">
        <p className="flex items-center justify-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.3em] text-[color:var(--g-band-accent)]">
          <span className="h-px w-8 bg-[color:var(--g-band-hairline)]" /> The PlantAtHome Promise <span className="h-px w-8 bg-[color:var(--g-band-hairline)]" />
        </p>

        <h2 className="mx-auto mt-6 max-w-3xl font-cormorant text-[1.9rem] font-medium leading-[1.15] text-[color:var(--g-band-ink)] sm:text-[2.6rem] lg:text-[3.2rem]">
          Rooted in nature,
          <span className="text-[color:var(--g-band-accent)]"> designed for modern living.</span>
        </h2>

        <span className="mx-auto mt-8 block h-px w-16 bg-[color:var(--g-band-hairline)]" />

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-center sm:gap-0 sm:divide-x sm:divide-[color:var(--g-band-hairline)]">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 px-6">
              <div className="font-cormorant text-[2.2rem] font-medium leading-none text-[color:var(--g-band-accent)] sm:text-[2.6rem]">
                <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--g-band-ink-soft)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatementBand;
