import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { VERTICAL_LIST, type VerticalKey } from './verticals';

/** Segmented Plants · Tools · FarmBox switcher — the single control to move
 *  between the three storefronts. Plants is the home route (`/`). */
export function VerticalSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter();
  const current = (router.query.pages as string[] | undefined)?.[0];
  const activeKey: VerticalKey =
    current === 'tools' || current === 'farmbox' ? current : 'plants';

  return (
    <div
      className={`inline-flex items-center rounded-full bg-forest/8 p-1 ${className}`}
    >
      {VERTICAL_LIST.map((v) => {
        const active = activeKey === v.key;
        const href = v.isHome ? '/' : v.path;
        return (
          <Link
            key={v.key}
            href={href}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              active ? 'text-white' : 'text-forest/70 hover:text-forest'
            }`}
          >
            {active && (
              <motion.span
                layoutId="vpill-header"
                className="absolute inset-0 -z-10 rounded-full bg-leaf"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}
