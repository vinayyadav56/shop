'use client';
import React from 'react';
import Link from 'next/link';

/**
 * "By care level" discovery chips. Care levels aren't a backend taxonomy, so each
 * chip links to the closest real category (precedent: home/category-row.tsx) or a
 * search query. Icons reused verbatim from the Claude Design file.
 */
const CARE: { label: string; href: string; icon: JSX.Element }[] = [
  {
    label: 'Easy-going',
    href: '/plants/search?text=easy%20care',
    icon: (<><path d="M12 21V11" /><path d="M12 11c0-3.2 2.2-5.5 6-6C17.6 8.6 15.5 11 12 11Z" /><path d="M12 13c0-2.7-1.8-4.6-5-5C7.2 11 9 13 12 13Z" /></>),
  },
  {
    label: 'Air purifying',
    href: '/c/air-purifying',
    icon: (<><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h8a2.5 2.5 0 1 1-2.5 2.5" /></>),
  },
  {
    label: 'Low light',
    href: '/c/indoor',
    icon: (<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" />),
  },
  {
    label: 'Bright light',
    href: '/c/outdoor',
    icon: (<><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>),
  },
  {
    label: 'Pet friendly',
    href: '/c/pet-friendly',
    icon: (<><circle cx="6.5" cy="10" r="1.6" /><circle cx="11" cy="7.6" r="1.6" /><circle cx="16" cy="8.4" r="1.6" /><circle cx="18.6" cy="12.4" r="1.4" /><path d="M9 15.5c1.2-1.8 4.2-2 5.6 0 .85 1.2 2.4 1.5 2.2 3-.2 1.6-2.2 1.4-3.7 1-.9-.22-2-.22-3 0-1.5.4-3.5.6-3.7-1-.2-1.5 1.7-1.9 2.6-3Z" /></>),
  },
  {
    label: 'Drought tolerant',
    href: '/plants/search?text=succulent',
    icon: (<><path d="M9 21h6" /><path d="M12 21V7" /><path d="M12 11H9a2 2 0 0 1-2-2V7" /><path d="M12 13h3a2 2 0 0 0 2-2V9" /></>),
  },
];

export function CareLevelChips() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {CARE.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-forest-800 transition hover:border-ds-accent hover:bg-ds-accent hover:text-white active:scale-95"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            {c.icon}
          </svg>
          {c.label}
        </Link>
      ))}
    </div>
  );
}

export default CareLevelChips;
