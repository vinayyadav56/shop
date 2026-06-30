'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { EXPO } from '@/components/storefront/motion';

const ITEMS: { title: string; sub: string; stat?: string; icon: JSX.Element }[] = [
  {
    title: '100% Quality Assured',
    sub: 'Only healthy & handpicked plants',
    stat: '100%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Secure Packaging',
    sub: 'Safe delivery to your doorstep',
    stat: '0%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 8V21H3V8" />
        <path d="M23 3H1v5h22V3Z" />
        <path d="M10 12h4" />
      </svg>
    ),
  },
  {
    title: 'Loved by 10,000+',
    sub: 'Happy plant parents across India',
    stat: '10K+',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Expert Guidance',
    sub: 'Helping you at every step',
    stat: '24/7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export function TrustRow() {
  return (
    <section className="font-hanken">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: EXPO }}
        className="relative overflow-hidden bg-[linear-gradient(135deg,#f8f7f2_0%,#f0ede4_100%)] px-6 py-8 sm:px-10 lg:px-16 lg:py-10"
      >
        {/* subtle leaf watermark */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 opacity-[0.045]"
          width="180" height="180" viewBox="0 0 24 24"
          fill="#1a3d22" stroke="none"
        >
          <path d="M11 21A8 8 0 0 1 3 13c0-6 5-10 10-10 0 6-2.5 10-2.5 10S15 11 19 11c0 5-4 9-8 10Z" />
        </svg>

        <div className="relative grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-0">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: EXPO }}
              className="group relative flex flex-col gap-3 lg:px-8"
            >
              {/* vertical divider between items on desktop */}
              {i > 0 && (
                <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-forest-900/10 to-transparent lg:block" />
              )}

              {/* icon + stat row */}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] border border-forest-200/60 bg-white text-forest-700 shadow-[0_2px_8px_rgba(34,48,26,0.08)] transition-all duration-300 group-hover:border-forest-300 group-hover:shadow-[0_4px_14px_rgba(34,48,26,0.13)] group-hover:text-forest-600">
                  {it.icon}
                </div>
                {it.stat && (
                  <span className="font-hanken text-[22px] font-extrabold leading-none tracking-[-0.02em] text-forest-800">
                    {it.stat}
                  </span>
                )}
              </div>

              {/* text */}
              <div>
                <div className="text-[13.5px] font-bold leading-[1.2] text-forest-900 transition-colors group-hover:text-forest-700">
                  {it.title}
                </div>
                <div className="mt-1 text-[11.5px] leading-[1.4] text-stone-500">
                  {it.sub}
                </div>
                {/* accent underline */}
                <div className="mt-2.5 h-[2px] w-4 rounded-full bg-forest-400 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-7 group-hover:bg-[#4ADE80]" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default TrustRow;
