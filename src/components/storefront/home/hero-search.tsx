'use client';
import React from 'react';
import { useRouter } from 'next/router';

/** Prominent search bar that overlaps the hero foot (design reference). */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = React.useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    router.push(text ? `/search?text=${encodeURIComponent(text)}` : '/search');
  }

  return (
    <section className="relative z-30 -mt-7 bg-[color:var(--pa-bg)] sm:-mt-9">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <form
          onSubmit={submit}
          className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-[0_20px_55px_-26px_rgba(13,59,36,0.55)] ring-1 ring-forest-900/[0.05]"
        >
          <span className="grid h-10 w-9 shrink-0 place-items-center text-stone-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for plants, pots..."
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent text-[14.5px] text-forest-900 outline-none placeholder:text-stone-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-ds-accent px-6 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

export default HeroSearch;
