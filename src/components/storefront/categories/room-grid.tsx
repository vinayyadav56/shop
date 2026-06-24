'use client';
import React from 'react';
import Link from 'next/link';

/**
 * "Shop by room" discovery grid. Rooms aren't a backend taxonomy, so each tile
 * links to a search query. Icons reused verbatim from the Claude Design file.
 */
const ROOMS: { label: string; href: string; icon: JSX.Element }[] = [
  {
    label: 'Living room',
    href: '/plants/search?text=living%20room',
    icon: (<><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M2 12a2 2 0 0 1 2-2 2 2 0 0 1 2 2v3h12v-3a2 2 0 0 1 4 0v5H2Z" /><path d="M5 17v2M19 17v2" /></>),
  },
  {
    label: 'Bedroom',
    href: '/plants/search?text=bedroom',
    icon: (<><path d="M3 18V8h12a4 4 0 0 1 4 4v6" /><path d="M3 13h16" /><path d="M3 18v2M19 18v2" /></>),
  },
  {
    label: 'Bathroom',
    href: '/plants/search?text=bathroom',
    icon: (<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />),
  },
  {
    label: 'Home office',
    href: '/plants/search?text=office',
    icon: (<><rect x="3" y="8" width="18" height="11" rx="2" /><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>),
  },
  {
    label: 'Balcony',
    href: '/c/outdoor',
    icon: (<><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>),
  },
  {
    label: 'Kitchen',
    href: '/plants/search?text=kitchen',
    icon: (<><path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10" /><path d="M16 3c-1.5 1-2 3-2 5s.5 3 2 3v10" /></>),
  },
];

export function RoomGrid() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {ROOMS.map((r) => (
        <Link
          key={r.label}
          href={r.href}
          className="flex items-center gap-3 rounded-2xl border border-forest-900/[0.06] bg-white px-3.5 py-3 transition hover:-translate-y-0.5 hover:border-ds-accent/40 hover:shadow-[0_14px_30px_-22px_rgba(13,59,36,0.5)] active:scale-[0.98]"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ds-accent-soft text-ds-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {r.icon}
            </svg>
          </span>
          <span className="text-[13px] font-semibold text-forest-900">{r.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default RoomGrid;
