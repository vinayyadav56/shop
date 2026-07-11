import Link from 'next/link';
import type { Metadata } from 'next';
import { getCmsPage } from '@/lib/api/endpoints';

const FALLBACK: Record<string, { title: string; body: string }> = {
  about: { title: 'Our story', body: 'PlantAtHome began with a simple belief: everyone deserves a home that breathes. We hand-pick plants from trusted nurseries and deliver them thriving, with lifetime care support.' },
  sustainability: { title: 'Sustainability', body: 'Peat-free growing, carbon-neutral delivery and plastic-light packaging. Every order plants a little more good into the world.' },
  shipping: { title: 'Shipping & returns', body: 'Insulated, water-locked packaging keeps roots happy in transit. Free delivery over ₹999. 30-day plant guarantee — if it doesn’t thrive, we replace it free.' },
  faq: { title: 'FAQ', body: 'Have a question about care, delivery or returns? Our botanists are here to help — reach us any time via chat.' },
};

async function loadPage(slug: string) {
  const remote = await getCmsPage(slug).catch(() => null);
  if (remote?.title) return { title: remote.title, body: remote.body ?? '' };
  return FALLBACK[slug] ?? { title: slug.replace(/-/g, ' '), body: 'This page is coming soon.' };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadPage(slug);
  return { title: `${page.title} — PlantAtHome` };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await loadPage(slug);

  return (
    <div className="container-wide max-w-3xl py-14">
      <nav className="mb-6 text-sm text-forest-ink/60"><Link href="/" className="hover:text-forest">Home</Link> / <span className="text-forest-ink">{page.title}</span></nav>
      <h1 className="font-pahserif text-[clamp(2.2rem,1.6rem+3vw,3.5rem)] font-semibold capitalize text-forest-ink">{page.title}</h1>
      <div className="prose mt-6 max-w-none whitespace-pre-line leading-relaxed text-forest-ink/80">{page.body}</div>
    </div>
  );
}
