import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import { QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { dehydrate } from 'react-query/hydration';
import client from '@/framework/client';
import {
  CategoryQueryOptions,
  SettingsQueryOptions,
  TypeQueryOptions,
} from '@/types';
import { TYPES_PER_PAGE } from '@/framework/client/variables';

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  res,
}) => {
  invariant(params, 'params is required');
  // This page prefetches only anonymous, language-keyed data (settings, types,
  // categories) — safe to cache at the edge. Serve repeat requests from the CDN
  // for 60s and revalidate in the background for up to 5min so we don't hit the
  // API origin on every listing visit.
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );
  const { searchType } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
  );

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE, language: locale }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
  );

  const categoryVariable = {
    type: searchType,
    limit: 1000,
    parent: 'null',
    language: locale
  };

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariable],
    ({ queryKey }) => client.categories.all(queryKey[1] as CategoryQueryOptions)
  );

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
