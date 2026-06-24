'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, Leaf, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

const HERO_IMG =
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1100&q=70';

const CHIPS = ['Indoor', 'Air purifying', 'Low light', 'Pet friendly', 'Succulents'];

export function Hero() {
  const router = useRouter();
  const [q, setQ] = React.useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    router.push(text ? `/search?text=${encodeURIComponent(text)}` : '/plants/search');
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-brand-900">
        {/* background image + gradient */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,53,33,0.95)_0%,rgba(7,53,33,0.78)_42%,rgba(7,53,33,0.30)_100%)]" />

        <div className="relative px-5 py-8 sm:px-10 sm:py-14 lg:max-w-[60%] lg:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/20">
            <Leaf className="h-3.5 w-3.5 text-cta" /> Live plants · delivered with care
          </span>

          <h1 className="mt-4 font-jakarta text-[2rem] font-extrabold leading-[1.04] tracking-tight text-white sm:text-[3rem] lg:text-[3.4rem]">
            Bring your space <span className="text-cta">to life.</span>
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/80 sm:text-[15.5px]">
            Hand-picked plants, designer planters and expert care — delivered to your door and looked after long after.
          </p>

          {/* prominent search */}
          <form onSubmit={submit} className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
            <Search className="h-5 w-5 shrink-0 text-stone-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search plants, planters, tools…"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[14.5px] text-brand-900 outline-none placeholder:text-stone-400"
            />
            <button type="submit" className="shrink-0 rounded-xl bg-cta px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-cta-600 active:scale-95">
              Search
            </button>
          </form>

          {/* quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <Link
                key={c}
                href={`/search?text=${encodeURIComponent(c)}`}
                className="rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                {c}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/plants" className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-brand-900 transition hover:bg-brand-50 active:scale-95">
              Shop all plants <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-4 text-[12px] font-semibold text-white/85">
              <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-cta" /> Free delivery*</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cta" /> Live-arrival promise</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
