'use client';

import Link from 'next/link';
import { ProductRail } from '@/components/products/ProductRail';
import { useVerticals } from '@/lib/hooks/useVerticals';

export default function OffersPage() {
  const { verticals } = useVerticals();
  const plants = verticals.find((v) => v.key === 'plants')?.categoryUuids ?? [];

  return (
    <div>
      <section className="g-footer py-20 text-cream">
        <div className="container-wide text-center">
          <span className="inline-flex animate-pulse items-center gap-2 rounded-full bg-cta/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cta">Limited time</span>
          <h1 className="mt-4 font-pahserif text-[clamp(2.6rem,1.8rem+4vw,4.5rem)] font-semibold">Up to 40% off the plant sale</h1>
          <p className="mx-auto mt-3 max-w-lg text-cream/80">Refresh your space for the season — hand-picked plants, tools and gifting, all on offer while stocks last.</p>
          <Link href="/plants" className="btn-cta mt-7 inline-flex px-8 py-3.5">Shop the sale</Link>
        </div>
      </section>

      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Corporate gifting', 'Curated plant gifts for teams & clients, delivered pan-India with your branding.'],
            ['Bulk orders', 'Special pricing for offices, events and landscapers. Talk to our team.'],
            ['Member perks', 'Early access to drops, free care support and members-only bundles.'],
          ].map(([t, d]) => (
            <div key={t} className="card p-6">
              <h3 className="font-heading text-xl font-semibold text-forest-ink">{t}</h3>
              <p className="mt-2 text-sm text-forest-ink/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductRail eyebrow="On offer" title="Bestsellers on sale" categoryUuids={plants} limit={8} viewAllHref="/plants" />
    </div>
  );
}
