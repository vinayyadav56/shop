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
import { StoryVideo } from '@/components/storefront/sections/story-video';
import { Testimonials } from '@/components/storefront/sections/testimonials';
import { RitualVideo } from '@/components/storefront/sections/ritual-video';
import { VERTICALS, HOME_SCENES, isVerticalKey } from '@/components/storefront/verticals';

/**
 * Premium PlantAtHome storefront layout — mirrors the prototype's Home + Vertical
 * pages exactly (copy + section order), wired to live API data + the SSR cache.
 * `/` (isHome=plants) = brand intro + 3-vertical showcase; `/plants` `/tools`
 * `/farmbox` = each vertical's hero, real categories & products.
 */
export default function PlantAtHomeLayout({ variables }: HomePageProps) {
  const { query } = useRouter();
  const isFiltering = Boolean(query.text || query.category);

  const typeSlug: string = variables?.types?.type || 'plants';
  const meta = isVerticalKey(typeSlug) ? VERTICALS[typeSlug] : VERTICALS.plants;
  const isHome = meta.isHome;

  const { categories, isLoading: catLoading } = useCategories(
    variables.categories,
  );
  const { products, isLoading, hasMore, loadMore, isLoadingMore } = useProducts({
    ...variables.products,
    ...(query.category && { categories: query.category }),
    ...(query.text && { name: query.text }),
  });

  // ── Hero copy (exact prototype text) ──
  const heroProps = isHome
    ? {
        scenes: HOME_SCENES,
        eyebrow: 'India’s premium plant studio',
        titleA: 'Bring the wild',
        titleB: 'indoors.',
        sub: 'Step into a home that breathes — plants, premium tools and farm-fresh organic produce, all delivered to your door across India.',
        primary: 'Shop the collection',
        primaryTo: '#products',
        tourTitle: 'Step inside a PlantAtHome home',
        tourSubtitle: meta.blurb,
      }
    : {
        scenes: meta.scenes,
        eyebrow: `PlantAtHome · ${meta.label}`,
        titleA: meta.tagline.split(' ').slice(0, -1).join(' '),
        titleB: meta.tagline.split(' ').slice(-1).join(' '),
        sub: meta.blurb,
        primary: `Shop ${meta.label}`,
        primaryTo: '#categories',
        tourTitle: `Inside the world of ${meta.label}`,
        tourSubtitle: meta.blurb,
      };

  return (
    <>
      <Hero {...heroProps} />

      <TrustStrip />

      {/* HOME → 3-vertical showcase; VERTICAL → real category grid */}
      {isHome && !isFiltering && <VerticalShowcase />}
      {!isHome && (
        <CategoryGrid
          categories={categories}
          typeSlug={typeSlug}
          isLoading={catLoading}
          eyebrow={`${meta.label} categories`}
          title="Shop by category."
        />
      )}

      <Element name="grid">
        <ProductGrid
          products={products}
          typeSlug={typeSlug}
          isLoading={isLoading}
          eyebrow={
            isFiltering ? 'Search results' : isHome ? 'Featured' : `${meta.label} bestsellers`
          }
          title={
            isFiltering
              ? 'What you’re looking for.'
              : isHome
              ? 'Signature plants, styled to impress.'
              : `This week in ${meta.label}.`
          }
          viewAllTo={`/${typeSlug}/search`}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isLoadingMore={isLoadingMore}
        />
      </Element>

      {!isFiltering && (
        <>
          {isHome ? (
            <>
              <Benefits />
              <StoryVideo />
            </>
          ) : (
            <PromiseBand items={meta.promise} />
          )}
          <Testimonials />
          <RitualVideo />
        </>
      )}
    </>
  );
}
