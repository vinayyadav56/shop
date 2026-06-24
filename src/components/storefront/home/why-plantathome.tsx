'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from './section-heading';

const REASONS: { title: string; desc: string; icon: JSX.Element }[] = [
  {
    title: '100% Healthy Plants',
    desc: 'Hand-picked & quality-checked before every dispatch.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
    ),
  },
  {
    title: 'Safe Packaging',
    desc: 'Secure, plant-safe boxes for damage-free delivery.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
    ),
  },
  {
    title: 'Plant Experts',
    desc: 'Free, ongoing care guidance from our horticulturists.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
    ),
  },
  {
    title: 'Fast Delivery',
    desc: 'Quick, careful shipping across 500+ Indian cities.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 17H3V5a1 1 0 0 1 1-1h11v13" /><path d="M15 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></svg>
    ),
  },
  {
    title: 'Trusted Vendors',
    desc: 'Sourced from India’s finest, vetted nurseries.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
  },
  {
    title: 'Easy Returns',
    desc: '30-day healthy-arrival guarantee, hassle-free.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
    ),
  },
];

export function WhyPlantAtHome() {
  return (
    <section className="g-light-b">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionHead label="The PlantAtHome Difference" title="Why PlantAtHome" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-4 rounded-2xl border border-forest-900/[0.06] bg-white p-5 shadow-[0_20px_50px_-34px_rgba(13,59,36,0.4)] transition hover:-translate-y-1 hover:shadow-[0_26px_56px_-30px_rgba(13,59,36,0.45)]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EAF4E6] text-[#4E8B31]">
                {r.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-forest-900">{r.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-stone-500">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyPlantAtHome;
