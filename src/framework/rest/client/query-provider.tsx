import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import type { AppProps } from 'next/app';

interface QueryProviderProps {
  pageProps: AppProps['pageProps'];
}

export default function QueryProvider({
  pageProps,
  children,
}: React.PropsWithChildren<QueryProviderProps>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Catalog data (products/categories/types) is short-lived-cacheable
            // and now edge-cached at the API. Treat client copies as fresh for
            // 60s and don't refetch on every tab focus/reconnect — kills the
            // redundant /products refetch storm the storefront grid caused.
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate
        state={
          //@ts-ignore
          pageProps.dehydratedState
        }
      >
        {children}
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
