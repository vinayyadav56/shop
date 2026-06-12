'use client';
import React from 'react';
import { Icon } from '../icons';

type Testimonial = {
  quote: string;
  name: string;
  city: string;
  avatar?: string;
  initials?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The plants I received were super fresh and beautifully packed. My new favourite place to shop!',
    name: 'Neha Sharma',
    city: 'Bangalore',
    avatar: '/images/people/t1.jpg',
  },
  {
    quote: 'Amazing collection and great customer support. My plants are thriving!',
    name: 'Rohit Mehta',
    city: 'Mumbai',
    avatar: '/images/people/t2.jpg',
  },
  {
    quote: 'Loved the packaging and quality. Highly recommended!',
    name: 'Sneha Iyer',
    city: 'Chennai',
    avatar: '/images/people/t3.jpg',
  },
  {
    quote: 'Best online plant store in India. Period.',
    name: 'Arjun Kapoor',
    city: 'Delhi',
    initials: 'AK',
  },
];

export function Testimonials2(props: any) {
  return (
    <section className="bg-[#0C1F13] py-12 lg:py-16">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.7fr_2.6fr]">
          {/* Left stacked label */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#F0EAD8]">
              What Our
            </p>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A24B]">
              Plant Parents
            </p>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#F0EAD8]">
              Say
            </p>
          </div>

          {/* Cards — mobile scroll row, desktop 4-up grid */}
          <div className="flex gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="w-[78%] min-w-0 shrink-0 rounded-xl bg-[#1A3322] p-5 ring-1 ring-[#C9A24B]/15 sm:w-[46%] lg:w-auto"
              >
                <div className="flex gap-1 text-[#C9A24B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon.star key={i} className="h-3 w-3" />
                  ))}
                </div>
                <blockquote className="mt-3 text-[12px] leading-6 text-[#F0EAD8]/80 line-clamp-4">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#C9A24B] text-[11px] font-bold text-[#12281A]">
                      {t.initials}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold text-[#F0EAD8]">
                      {t.name}
                    </span>
                    <span className="block text-[10.5px] text-[#F0EAD8]/50">{t.city}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials2;
