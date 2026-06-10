'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '../icons';

export function PromoBanners() {
  return (
    <section className="bg-cream-50">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-2">
        {/* left — dark green */}
        <div className="relative overflow-hidden rounded-3xl bg-forest-800 p-8 sm:p-10">
          <Image src="/plants-2.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/70 to-forest-900/30" />
          <div className="relative max-w-xs">
            <h3 className="font-cormorant text-[2rem] font-bold leading-[1.05] text-white sm:text-[2.4rem]">
              Bring Green to Every Corner
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-6 text-white/80">Plants for every space, style and mood.</p>
            <Link
              href="/plants/search"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-forest-800 transition hover:bg-sage-100"
            >
              Shop Collection <Icon.arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* right — light consultation */}
        <div className="relative overflow-hidden rounded-3xl border border-kraft-200 bg-sage-100 p-8 sm:p-10">
          <Image src="/foliage-corner.png" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-right opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-100 via-sage-100/85 to-transparent" />
          <div className="relative max-w-xs">
            <h3 className="font-cormorant text-[2rem] font-bold leading-[1.05] text-forest-900 sm:text-[2.4rem]">
              Not Sure Which Plant is Right for You?
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-6 text-stone-600">
              Our plant experts are here to help you find the perfect green companion.
            </p>
            <Link
              href="/garden-service"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-forest-600"
            >
              Get Free Consultation <Icon.arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
