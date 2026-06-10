'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function PromoBanners() {
  return (
    <section className="bg-white">
      <div className="container mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-2">
        {/* left — dark green with photo */}
        <div className="grid min-h-[260px] grid-cols-1 overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start justify-center p-8 sm:p-10">
            <h3 className="font-cormorant text-[1.9rem] font-bold leading-[1.05] text-white sm:text-[2.3rem]">
              Bring Green to Every Corner
            </h3>
            <p className="mt-2.5 text-[13px] leading-6 text-white/75">Plants for every space, style and mood.</p>
            <Link
              href="/plants/search"
              className="mt-6 inline-flex items-center rounded-md bg-white px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-forest-900 transition hover:bg-sage-100"
            >
              Shop Collection
            </Link>
          </div>
          <div className="relative h-[180px] min-h-0 sm:h-full sm:min-h-[220px]">
            <Image
              src="https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=900&q=75&auto=format&fit=crop"
              alt="Potted plants styled on a sideboard"
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 45vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-forest-800 to-transparent sm:block" />
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-forest-800 to-transparent sm:hidden" />
          </div>
        </div>

        {/* right — light consultation with photo */}
        <div className="grid min-h-[260px] grid-cols-1 overflow-hidden rounded-3xl border border-kraft-200 bg-sage-100 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start justify-center p-8 sm:p-10">
            <h3 className="font-cormorant text-[1.9rem] font-bold leading-[1.05] text-forest-900 sm:text-[2.3rem]">
              Not Sure Which Plant is Right for You?
            </h3>
            <p className="mt-2.5 text-[13px] leading-6 text-stone-600">
              Our plant experts are here to help you find the perfect green companion.
            </p>
            <Link
              href="/garden-service"
              className="mt-6 inline-flex items-center rounded-md bg-forest-800 px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-forest-700"
            >
              Get Free Consultation
            </Link>
          </div>
          <div className="relative h-[180px] min-h-0 sm:h-full sm:min-h-[220px]">
            <Image
              src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=75&auto=format&fit=crop"
              alt="Hands holding a potted monstera plant"
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 45vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-sage-100 to-transparent sm:block" />
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-sage-100 to-transparent sm:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
