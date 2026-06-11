'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function PromoBanners() {
  return (
    <section className="bg-gradient-to-b from-[#F4FBF7] to-[#E6F4EC]">
      <div className="container mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-2">
        {/* left — dark green with photo */}
        <div className="grid min-h-[260px] grid-cols-1 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D3B2E] via-[#13503E] to-[#1B6B50] sm:grid-cols-[1.1fr_0.9fr]">
          <div className="relative flex flex-col items-start justify-center p-6 sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_70%_20%,rgba(227,206,151,0.10),transparent_70%)]"
              aria-hidden="true"
            />
            <span className="mb-3 block h-px w-10 bg-goldlight/70" aria-hidden="true" />
            <h3 className="font-cormorant text-[1.7rem] font-medium leading-[1.05] text-white sm:text-[2.3rem]">
              Bring Green to Every Corner
            </h3>
            <p className="mt-2.5 text-[13px] leading-6 text-white/75">Plants for every space, style and mood.</p>
            <Link
              href="/plants/search"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-goldlight px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-forest-900 transition hover:bg-gold hover:text-white sm:w-auto"
            >
              Shop Collection
            </Link>
          </div>
          <div className="relative h-[200px] min-h-0 sm:h-full sm:min-h-[220px]">
            <Image
              src="https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=900&q=75&auto=format&fit=crop"
              alt="Potted plants styled on a sideboard"
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 45vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#13503E] to-transparent sm:block" />
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#13503E] to-transparent sm:hidden" />
          </div>
        </div>

        {/* right — light consultation with photo */}
        <div className="grid min-h-[260px] grid-cols-1 overflow-hidden rounded-3xl border border-forest-900/10 bg-gradient-to-br from-[#EAF6EF] to-[#D9EDE2] sm:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start justify-center p-6 sm:p-10">
            <span className="mb-3 block h-px w-10 bg-gold/50" aria-hidden="true" />
            <h3 className="font-cormorant text-[1.7rem] font-medium leading-[1.05] text-forest-900 sm:text-[2.3rem]">
              Not Sure Which Plant is Right for You?
            </h3>
            <p className="mt-2.5 text-[13px] leading-6 text-stone-600">
              Our plant experts are here to help you find the perfect green companion.
            </p>
            <Link
              href="/garden-service"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[#175840] to-[#2E8B63] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition hover:from-[#1B6B50] hover:to-[#35A175] sm:w-auto"
            >
              Get Free Consultation
            </Link>
          </div>
          <div className="relative h-[200px] min-h-0 sm:h-full sm:min-h-[220px]">
            <Image
              src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=75&auto=format&fit=crop"
              alt="Hands holding a potted monstera plant"
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 45vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#D9EDE2] to-transparent sm:block" />
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#EAF6EF] to-transparent sm:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
