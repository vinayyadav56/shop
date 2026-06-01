import { useRouter } from 'next/router';
import { Element } from 'react-scroll';
import { useProducts } from '@/framework/product';
import { useCategories } from '@/framework/category';
import type { HomePageProps } from '@/types';
import { Hero } from '@/components/storefront/sections/hero';
import { TrustStrip } from '@/components/storefront/sections/trust-strip';
import { VerticalShowcase } from '@/components/storefront/sections/vertical-showcase';
import { CategoryGrid } from '@/components/storefront/sections/category-grid';
import { ProductGrid } from '@/components/storefront/sections/product-grid';
import { Benefits } from '@/components/storefront/sections/benefits';
import { PromiseBand } from '@/components/storefront/sections/promise-band';
import { RitualVideo } from '@/components/storefront/sections/ritual-video';
import { VERTICALS, HOME_SCENES, isVerticalKey } from '@/components/storefront/verticals';

/**
 * Premium PlantAtHome storefront layout — drives all three verticals.
 * `/` (isHome=plants) shows the brand intro + 3-vertical showcase; `/plants`
 * `/tools` `/farmbox` each render their own hero, real categories & products.
 * Wired to the SSR-prefetched react-query cache (no first-paint loading flash).
 */
export default function PlantAtHomeLayout({ variables }: HomePageProps) {
  const { query } = useRouter();
  const isRoot = !(query.pages as string[] | undefined)?.length;
  const isFiltering = Boolean(query.text || query.category);

  const typeSlug: string = variables?.types?.type || 'plants';
  const meta = isVerticalKey(typeSlug) ? VERTICALS[typeSlug] : VERTICALS.plants;

  const { categories, isLoading: catLoading } = useCategories(
    variables.categories,
  );
  const { products, isLoading, hasMore, loadMore, isLoadingMore } = useProducts({
    ...variables.products,
    ...(query.category && { categories: query.category }),
    ...(query.text && { name: query.text }),
  });

  // Hero: home = cinematic penthouse + brand copy; vertical = its own scenes
  const scenes = isRoot ? HOME_SCENES : meta.scenes;
  const eyebrow = isRoot
    ? 'PlantAtHome · Living greener'
    : `PlantAtHome · ${meta.label}`;
  const tagline = isRoot ? 'Bring your home to life.' : meta.tagline;
  const words = tagline.split(' ');
  const titleA = words.slice(0, -1).join(' ');
  const titleB = words.slice(-1).join(' ');
  const sub = isRoot
    ? 'Plants, premium tools and farm-fresh boxes — everything to make your home greener, calmer and more alive.'
    : meta.blurb;

  return (
    <>
      <Hero
        scenes={scenes}
        eyebrow={eyebrow}
        titleA={titleA}
        titleB={titleB}
        sub={sub}
        primary={isRoot ? 'Explore the collection' : `Shop ${meta.label}`}
        primaryTo="#categories"
        tourTitle={
          isRoot
            ? 'Step inside a PlantAtHome home'
            : `Inside the world of ${meta.label}`
        }
        tourSubtitle={meta.blurb}
      />

      <TrustStrip />

      {isRoot && !isFiltering && <VerticalShowcase />}

      <CategoryGrid
        categories={categories}
        typeSlug={typeSlug}
        isLoading={catLoading}
        eyebrow={`${meta.label} categories`}
        title="Shop by category."
        tone={isRoot ? 'soft' : 'light'}
      />

      <Element name="grid">
        <ProductGrid
          products={products}
          typeSlug={typeSlug}
          isLoading={isLoading}
          eyebrow={isFiltering ? 'Search results' : `${meta.label} edit`}
          title={
            isFiltering ? 'What you’re looking for.' : `This week in ${meta.label}.`
          }
          viewAllTo={`/${typeSlug}/search`}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isLoadingMore={isLoadingMore}
        />
      </Element>

      {!isFiltering && (
        <>
          <Benefits />
          <PromiseBand items={meta.promise} />
          <RitualVideo />
        </>
      )}
    </>
  );
}
