'use client';

import { Grid } from '@/components/products/grid';
import { useProducts } from '@/framework/product';
import { SectionHead } from './section-head';
import { SECTION } from './tools-content';

/**
 * /tools "Tools gardeners love": the vertical's six best-sellers in the site's one
 * product card, on the same column ladder as every listing.
 *
 * Uses the same useProducts options as loadToolsData's bestsellers list, so the
 * cards arrive as server HTML. Shows skeleton cards while loading. The whole
 * section is absent when the API lists no products: never placeholder products.
 *
 * @param type the vertical slug (`tools`)
 */
export function ToolsBestsellers({ type }: { type: string }) {
  const { products, isLoading } = useProducts({
    type,
    limit: 6,
    orderBy: 'sold_quantity',
    sortedBy: 'DESC',
  });

  if (!isLoading && !products.length) return null;

  return (
    <section aria-labelledby="tools-bestsellers" className="mt-8">
      <SectionHead id="tools-bestsellers" {...SECTION.bestsellers} />
      <Grid
        products={products}
        isLoading={isLoading}
        // Below the hero's LCP image: no card image is preloaded.
        priorityCount={0}
        hasMore={false}
        limit={6}
        // The one card and the shared column ladder, as on /c (owner, 2026-10-09).
        className="mt-5"
      />
    </section>
  );
}

export default ToolsBestsellers;
