'use client';
import React from 'react';
import Link from 'next/link';
import { Gift, Stethoscope, ArrowRight } from 'lucide-react';

const CARDS = [
  {
    href: '/corporate-gifting',
    img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=70',
    icon: Gift,
    eyebrow: 'Gifting',
    title: 'Green gifts they’ll love',
    sub: 'Curated plant hampers for every occasion.',
    cta: 'Explore gifting',
  },
  {
    href: '/plant-doctor',
    img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=70',
    icon: Stethoscope,
    eyebrow: 'Plant doctor',
    title: 'Sick plant? Ask our AI',
    sub: 'Snap a photo, get an instant diagnosis & care plan.',
    cta: 'Diagnose now',
  },
];

export function EditorialBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-9">
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group relative flex min-h-[180px] items-end overflow-hidden rounded-3xl bg-brand-900 sm:min-h-[210px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,53,33,0.15)_30%,rgba(7,53,33,0.92)_100%)]" />
              <div className="relative p-5 sm:p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/20">
                  <Icon className="h-3.5 w-3.5 text-cta" /> {c.eyebrow}
                </span>
                <h3 className="mt-2.5 font-jakarta text-[22px] font-extrabold leading-tight text-white sm:text-[26px]">{c.title}</h3>
                <p className="mt-1 max-w-xs text-[13px] text-white/80">{c.sub}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-cta">
                  {c.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default EditorialBand;
