'use client';

/**
 * Client provider tree — App Router port of V1 _app.tsx.
 * P1 state: Query + Search + Modal + Cart + DesignSystemApplier.
 * P2 adds: GlobalFetchBar, CitySync, LocationGate, TrackingBridge, Maintenance,
 * NotificationProvider, ManagedModal, ManagedDrawer, ToastContainer,
 * FirstVisitLanguageModal (they depend on component trees ported in P2).
 */

import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SearchProvider } from '@/components/ui/search/search.context';
import { ModalProvider } from '@/components/ui/modal/modal.context';
import { CartProvider } from '@/store/quick-cart/cart.context';
import DesignSystemApplier from '@/lib/design-system-applier';

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
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <ModalProvider>
          <CartProvider>
            <DesignSystemApplier />
            {children}
          </CartProvider>
        </ModalProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}
