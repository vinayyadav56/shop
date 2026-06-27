import type {
  CategoryQueryOptions,
  HomePageProps,
  PopularProductQueryOptions,
  SettingsQueryOptions,
  TypeQueryOptions,
  BestSellingProductQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import invariant from 'tiny-invariant';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CATEGORIES_PER_PAGE,
  PRODUCTS_PER_PAGE,
  TYPES_PER_PAGE,
} from './client/variables';

type ParsedQueryParams = {
  pages: string[];
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  try {
    const data = await client.types.all({ limit: 100 });
    const paths = data?.flatMap((type) =>
      locales?.map((locale) => ({ params: { pages: [type.slug] }, locale }))
    );
    return {
      paths: paths.concat(
        locales?.map((locale) => ({ params: { pages: [] }, locale }))
      ),
      fallback: 'blocking',
    };
  } catch {
    // API unavailable at build time — fall back to root path only, load at runtime
    return {
      paths: locales.map((locale) => ({ params: { pages: [] }, locale })),
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<
  HomePageProps,
  ParsedQueryParams
> = async ({ locale, params }) => {
  const queryClient = new QueryClient();
  let types: Awaited<ReturnType<typeof client.types.all>>;
  try {
    await queryClient.prefetchQuery(
      [API_ENDPOINTS.SETTINGS, { language: locale }],
      ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
    );
    types = await queryClient.fetchQuery(
      [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE, language: locale }],
      ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
    );
  } catch {
    // API temporarily unavailable (e.g. mid-deploy). Return empty dehydrated state and
    // revalidate in 15s so ISR retries quickly — avoids caching a 404 for 2 minutes.
    return {
      props: {
        variables: {
          popularProducts: {},
          products: {},
          categories: {},
          bestSellingProducts: {},
          layoutSettings: {},
          types: { type: '' },
        },
        layout: 'default',
        ...(await serverSideTranslations(locale!, ['common', 'banner'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 15,
    };
  }

  const { pages } = params!;
  let pageType: string | undefined;
  if (!pages) {
    pageType =
      types.find((type) => type?.settings?.isHome)?.slug ?? types?.[0]?.slug;
  } else {
    pageType = pages[0];
  }

  if (!types?.some((t) => t.slug === pageType)) {
    return {
      notFound: true,
      // This is require to regenerate the page
      revalidate: 120,
    };
  }

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.TYPES, { slug: pageType, language: locale }],
    ({ queryKey }: any) => client.types.get(queryKey[1])
  );
  const productVariables = {
    type: pageType,
    limit: PRODUCTS_PER_PAGE,
  };
  await queryClient.prefetchInfiniteQuery(
    [
      API_ENDPOINTS.PRODUCTS,
      { limit: PRODUCTS_PER_PAGE, type: pageType, language: locale },
    ],
    ({ queryKey }) => client.products.all(queryKey[1] as any)
  );

  const popularProductVariables = {
    type_slug: pageType,
    limit: 10,
    with: 'type;author',
    language: locale,
  };

  // Only prefetch popular products for `book` demo
  if (pageType === 'book') {
    await queryClient.prefetchQuery(
      [API_ENDPOINTS.PRODUCTS_POPULAR, popularProductVariables],
      ({ queryKey }) =>
        client.products.popular(queryKey[1] as PopularProductQueryOptions)
    );

    await queryClient.prefetchQuery(
      [API_ENDPOINTS.BEST_SELLING_PRODUCTS, popularProductVariables],
      ({ queryKey }) =>
        client.products.bestSelling(
          queryKey[1] as BestSellingProductQueryOptions
        )
    );
  }

  const categoryVariables = {
    type: pageType,
    limit: CATEGORIES_PER_PAGE,
    language: locale,
    parent:
      types.find((t) => t.slug === pageType)?.settings.layoutType === 'minimal'
        ? 'all'
        : 'null',
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariables],
    ({ queryKey }) =>
      client.categories.all(queryKey[1] as CategoryQueryOptions),
  );
  return {
    props: {
      variables: {
        popularProducts: popularProductVariables,
        products: productVariables,
        categories: categoryVariables,
        bestSellingProducts: popularProductVariables,
        layoutSettings: {
          ...types.find((t) => t.slug === pageType)?.settings,
        },
        types: {
          type: pageType,
        },
      },
      layout:
        types.find((t) => t.slug === pageType)?.settings.layoutType ??
        'default',
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    // Shorter ISR so admin homepage changes (banners/curation) reach the static home faster;
    // the client also refetches settings on mount (see useSettings).
    revalidate: 30,
  };
};

/* Fix : locales: 14kB,
popularProducts: 30kB,
category: 22kB,
groups: 8kB,
group: 2kB,
settings: 2kB,
perProduct: 4.2 * 30 = 120kB,
total = 14 + 30 + 22 + 8 + 2 + 2 + 120 = 198kB
others: 225 - 198 = 27kB

 */
