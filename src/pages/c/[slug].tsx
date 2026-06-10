import { useRouter } from 'next/router';
import Link from 'next/link';
import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import { Grid } from '@/components/products/grid';
import ErrorMessage from '@/components/ui/error-message';
import { useCategory } from '@/framework/category';
import { useProducts } from '@/framework/product';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import { productPlaceholder } from '@/lib/placeholders';
import type { Product } from '@/types';

export { getStaticProps } from '@/framework/general.ssr';

export async function getStaticPaths() {
  // Slugs are resolved on demand; SSG-fallback so new categories work without a rebuild.
  return { paths: [], fallback: 'blocking' };
}

export default function CategoryPage() {
  const { query } = useRouter();
  const slug = query?.slug as string;

  const { category, isLoading: loadingCategory, error } = useCategory({ slug });

  const typeSlug = (category?.type as any)?.slug;
  const {
    products,
    isLoading,
    loadMore,
    isLoadingMore,
    hasMore,
    error: productsError,
  } = useProducts({
    limit: PRODUCTS_PER_PAGE,
    categories: slug,
    ...(typeSlug && { type: typeSlug }),
  });

  if (error) return <ErrorMessage message={error.message} />;

  const banner =
    category?.banner_image?.original ||
    category?.banner_image?.thumbnail ||
    category?.image?.original ||
    category?.image?.thumbnail ||
    productPlaceholder;

  const children = category?.children ?? [];

  return (
    <div className="bg-cream-50">
      <Seo
        title={
          category?.name
            ? `${category.name} — PlantAtHome`
            : 'Category — PlantAtHome'
        }
        description={
          category?.details ||
          category?.description ||
          `Shop ${category?.name ?? 'our'} collection at PlantAtHome.`
        }
        url={`c/${slug}`}
      />

      {/* BANNER */}
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner}
          alt={category?.name ?? 'Category'}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/45 to-deep/15" />
        <div className="relative mx-auto flex min-h-[260px] max-w-1920 flex-col justify-end px-5 py-10 sm:min-h-[340px] sm:px-8 lg:px-16 lg:py-14">
          {typeSlug && (
            <Link
              href={`/${typeSlug}/search`}
              className="mb-3 inline-flex w-max items-center gap-1 text-xs font-medium uppercase tracking-wide text-white/80 hover:text-white"
            >
              ← {(category?.type as any)?.name ?? 'All products'}
            </Link>
          )}
          <h1 className="font-cormorant text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {category?.name ?? (loadingCategory ? 'Loading…' : 'Category')}
          </h1>
          {(category?.details || category?.description) && (
            <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
              {category?.details || category?.description}
            </p>
          )}
        </div>
      </section>

      {/* SUB-CATEGORY TILES */}
      {children.length > 0 && (
        <section className="mx-auto max-w-1920 px-5 pt-10 sm:px-8 lg:px-16">
          <div className="flex flex-wrap gap-3">
            {children.map((child) => (
              <Link
                key={child.id ?? child.slug}
                href={`/c/${child.slug}`}
                className="rounded-full border border-kraft-300 bg-white px-4 py-2 text-sm font-medium text-forest-800 transition hover:border-forest-500 hover:text-forest-600"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="mx-auto min-h-[40vh] max-w-1920 px-5 py-10 sm:px-8 lg:px-16 xl:py-14">
        <Grid
          products={products as Product[] | undefined}
          loadMore={loadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={productsError}
          column="six"
        />
      </section>
    </div>
  );
}

CategoryPage.getLayout = getSiteLayout;
