'use client';
import React from 'react';
import { useRouter } from 'next/router';

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  return (
    <div className="px-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = q.trim();
          router.push(t ? `/search?text=${encodeURIComponent(t)}` : '/plants/search');
        }}
        className="flex items-center gap-2 rounded-full border border-kraft-200 bg-white py-1.5 pl-4 pr-1.5 shadow-[0_8px_24px_rgba(34,48,26,0.09)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#908A7E" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for plants, pots…"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent py-2 font-hanken text-[14px] text-forest-900 outline-none placeholder:text-stone-500"
        />
        <button type="submit" className="rounded-full bg-forest-700 px-5 py-[11px] font-hanken text-[14px] font-semibold text-white transition hover:bg-forest-800 active:scale-95">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
