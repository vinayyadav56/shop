'use client';
import React from 'react';
import Link from 'next/link';
import { Leaf, Instagram, Facebook, Youtube, Mail, Phone, ArrowRight } from 'lucide-react';

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Plants', href: '/plants/search' },
      { label: 'Indoor Plants', href: '/c/indoor' },
      { label: 'Outdoor Plants', href: '/c/outdoor' },
      { label: 'Planters & Tools', href: '/tools' },
      { label: 'Categories', href: '/categories' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Corporate Gifting', href: '/corporate-gifting' },
      { label: 'Garden Packages', href: '/garden-service' },
      { label: 'Plant Doctor', href: '/plant-doctor' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Track Order', href: '/track-order' },
      { label: 'Shipping & Delivery', href: '/terms' },
      { label: 'Returns & Refunds', href: '/terms' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-2 bg-brand-900 font-jakarta text-white/85">
      {/* newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-jakarta text-[22px] font-extrabold text-white">Grow a greener life with us.</h3>
            <p className="mt-1 text-[13px] text-white/70">Care tips, new arrivals & members-only offers. No spam, ever.</p>
          </div>
          <form className="flex w-full max-w-md items-center gap-2 rounded-xl bg-white/10 p-1.5 pl-4 ring-1 ring-white/15" onSubmit={(e) => e.preventDefault()}>
            <Mail className="h-[18px] w-[18px] shrink-0 text-white/60" />
            <input placeholder="Your email address" aria-label="Email address" className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-white outline-none placeholder:text-white/50" />
            <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2 text-[13px] font-bold text-white transition hover:bg-cta-600">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* main */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cta text-white">
              <Leaf className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[18px] font-extrabold text-white">Plant<span className="text-cta">At</span>Home</span>
          </div>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/70">
            Bringing nature closer to you — curated plants & planters, delivered with a 30-day healthy-arrival promise.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="https://instagram.com" aria-label="Social" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-cta">
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-[13px] font-bold uppercase tracking-wide text-white">{col.title}</h4>
            <ul className="mt-3 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] text-white/70 transition hover:text-cta">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-[12px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <a href="mailto:hello@plantathome.in" className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="h-4 w-4" /> hello@plantathome.in</a>
            <a href="tel:+918000000000" className="inline-flex items-center gap-1.5 hover:text-white"><Phone className="h-4 w-4" /> +91 8000 000000</a>
          </div>
          <p>© 2026 PlantAtHome. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
