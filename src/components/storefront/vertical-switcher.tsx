import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTypes } from '@/framework/type';
import { TYPES_PER_PAGE } from '@/framework/client/variables';

/** Segmented switcher — data-driven from the live API types. The home type
 *  (settings.isHome) links to `/`; every other type links to `/{slug}`.
 *  `light` styles it for a transparent header over the hero. */
export function VerticalSwitcher({
  className = '',
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const router = useRouter();
  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  const list = types ?? [];
  if (list.length === 0) return null;

  const homeSlug =
    list.find((t) => t?.settings?.isHome)?.slug ?? list[0]?.slug;
  const currentSlug =
    (router.query.pages as string[] | undefined)?.[0] ?? homeSlug;

  return (
    <div
      className={`inline-flex items-center rounded-full p-1 ${
        light ? 'bg-white/15 backdrop-blur' : 'bg-forest/8'
      } ${className}`}
    >
      {list.map((t) => {
        const active = currentSlug === t.slug;
        const href = t.slug === homeSlug ? '/' : `/${t.slug}`;
        return (
          <Link
            key={t.slug}
            href={href}
            className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              active
                ? 'text-white'
                : light
                ? 'text-white/80 hover:text-white'
                : 'text-forest/70 hover:text-forest'
            }`}
          >
            {active && (
              <motion.span
                layoutId="vpill-header"
                className="absolute inset-0 -z-10 rounded-full bg-leaf"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {t.name}
          </Link>
        );
      })}
    </div>
  );
}
