import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Hydrate } from '@/compat/react-query-hydration';
import { loadProductData } from '@/framework/ssr/prefetch';
import { PageBody } from '@/page-bodies/product';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadProductData(slug);
  if (!data) return {};
  const p: any = data.product;
  return {
    title: `${p?.name} — PlantAtHome`,
    description: p?.description?.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: p?.image?.original ? { images: [p.image.original] } : undefined,
  };
}

export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadProductData(slug);
  if (!data) return notFound();
  return (
    <Hydrate state={data.dehydratedState}>
      <PageBody product={data.product} />
    </Hydrate>
  );
}
