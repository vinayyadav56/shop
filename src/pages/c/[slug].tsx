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
  return { paths: [], fallback: 'blocking' };
}

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function CategoryPage() {
  const { query } = useRouter();
  const slug = query?.slug as string;

  const { category, isLoading: loadingCategory, error } = useCategory({ slug });

  const typeSlug = (category?.type as any)?.slug;
  const typeName = (category?.type as any)?.name;
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
  const productCount = (products ?? []).length;

  return (
    <div className="bg-[#F4F1EA]">
      <Seo
        title={category?.name ? `${category.name} — PlantAtHome` : 'Category — PlantAtHome'}
        description={category?.details || category?.description || `Shop ${category?.name ?? 'our'} collection at PlantAtHome.`}
        url={`c/${slug}`}
      />

      {/* ── BANNER ── */}
      <section className="relative isolate overflow-hidden">
        {/* background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner}
          alt={category?.name ?? 'Category'}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* layered gradient scrim — rich bottom-up */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,16,8,0.94)_0%,rgba(5,16,8,0.55)_45%,rgba(5,16,8,0.18)_100%)]" />
        {/* grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
        />
        {/* green radial glow — bottom-left */}
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(ellipse,rgba(74,222,128,0.12)_0%,transparent_65%)]" />

        <div className="relative mx-auto flex min-h-[220px] max-w-7xl flex-col justify-end px-5 py-8 sm:min-h-[280px] sm:px-8 lg:min-h-[340px] lg:px-16 lg:py-11">

          {/* breadcrumb */}
          {typeSlug && (
            <Link
              href={`/${typeSlug}/search`}
              className="mb-5 inline-flex w-max items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 font-hanken text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              {typeName ?? 'All products'}
            </Link>
          )}

          {/* eyebrow */}
          <div className="mb-3 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/[0.15] bg-white/[0.07] px-3.5 py-1.5">
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#4ADE80]" />
            </span>
            <span className="font-hanken text-[10px] font-bold uppercase tracking-[0.2em] text-[#86EFAC]">
              Collection
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-cormorant text-[2.8rem] font-bold leading-[1.05] tracking-[-0.015em] text-white sm:text-[3.6rem] lg:text-[4.8rem]">
            {category?.name ?? (loadingCategory ? 'Loading…' : 'Category')}
          </h1>

          {/* description */}
          {(category?.details || category?.description) && (
            <p className="mt-4 max-w-2xl font-hanken text-[14px] leading-[1.6] text-white/78 sm:text-[15.5px]">
              {category?.details || category?.description}
            </p>
          )}
        </div>
      </section>

      {/* ── SUB-CATEGORY PILLS ── */}
      {children.length > 0 && (
        <section className="border-b border-kraft-200 bg-white px-5 py-5 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2.5">
              {children.map((child) => (
                <Link
                  key={child.id ?? child.slug}
                  href={`/c/${child.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-kraft-200 bg-white px-4 py-2 font-hanken text-[12.5px] font-medium text-forest-800 shadow-[0_1px_4px_rgba(34,48,26,0.07)] transition duration-200 hover:border-forest-400 hover:bg-forest-50 hover:text-forest-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCTS ── */}
      <section className="mx-auto max-w-7xl min-h-[40vh] px-5 py-10 sm:px-8 lg:px-16 xl:py-14" style={{ borderTop: '1px solid #E9E3D6' }}>
        {/* section header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-hanken text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#4ADE80]">
              {category?.name ?? 'Products'}
            </p>
            <h2 className="font-cormorant mt-1.5 text-[2rem] font-bold leading-none tracking-[-0.01em] text-forest-900 sm:text-[2.6rem]">
              Shop the collection.
            </h2>
          </div>
          {productCount > 0 && (
            <span className="shrink-0 font-hanken text-[13px] text-stone-400">
              {productCount}{hasMore ? '+' : ''} plants
            </span>
          )}
        </div>

        <Grid
          products={products as Product[] | undefined}
          loadMore={loadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={productsError}
          column="auto"
          gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          categoryName={category?.name}
        />
      </section>
    </div>
  );
}

CategoryPage.getLayout = getSiteLayout;
