'use client';
import React from 'react';
import { useRouter } from 'next/router';

/** Prominent "Search categories…" pill (design reference). Routes to search. */
export function CategorySearch() {
  const router = useRouter();
  const [q, setQ] = React.useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    router.push(text ? `/search?text=${encodeURIComponent(text)}` : '/search');
  }

  return (
    <div className="px-5 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={submit}
          className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[0_18px_50px_-30px_rgba(13,59,36,0.5)] ring-1 ring-forest-900/[0.06]"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center text-stone-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-[18px] w-[18px]"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search categories…"
            aria-label="Search categories"
            className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-forest-900 outline-none placeholder:text-stone-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ds-accent px-5 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 active:scale-95"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default CategorySearch;
