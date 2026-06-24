'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function SectionHeader({
  eyebrow,
  title,
  href,
  hrefText = 'View all',
  right,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  hrefText?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cta">{eyebrow}</p>
        ) : null}
        <h2 className="font-jakarta text-[20px] font-extrabold leading-tight tracking-tight text-brand-900 sm:text-[26px]">
          {title}
        </h2>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {right}
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[13px] font-bold text-brand transition hover:gap-1.5"
          >
            {hrefText} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Horizontal scroll-snap track with desktop arrow controls. */
export function HScroll({
  children,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: 'smooth' });
  };
  return (
    <div className="group/rail relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => by(-1)}
        className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line2 bg-white text-brand-900 shadow-md transition hover:bg-brand hover:text-white lg:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div
        ref={ref}
        className={cn(
          'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden',
          className,
        )}
      >
        {React.Children.map(children, (child) => (
          <div className={cn('shrink-0 snap-start', itemClassName)}>{child}</div>
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => by(1)}
        className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line2 bg-white text-brand-900 shadow-md transition hover:bg-brand hover:text-white lg:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
