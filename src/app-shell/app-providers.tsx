'use client';

/**
 * P0 placeholder provider tree — replaced in P1 with the full V1 _app.tsx port
 * (SearchProvider → ModalProvider → CartProvider → gates → ManagedModal/Drawer
 * → ToastContainer). For now: just the TanStack v5 QueryClient with V1's
 * defaults so compat scratch tests can run.
 */

import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
