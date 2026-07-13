'use client';

/**
 * next/router → next/navigation compat shim.
 *
 * 130 V1 files import from 'next/router'; the tsconfig alias points them here.
 * Covers the patterns V1 actually uses:
 *  - useRouter().query        (route params ∪ search params, v1-style merged)
 *  - .locale / .pathname / .asPath
 *  - .push / .replace / .back / .reload / .prefetch
 *  - .events.on/off           (no-op; tracking-bridge was rewritten to usePathname)
 *  - module-scope `Router` default export (http-client interceptor) — navigates
 *    via window.location (no React context available at module scope).
 */

import { useMemo } from 'react';
import {
  useRouter as useNavRouter,
  usePathname,
  useSearchParams,
  useParams,
} from 'next/navigation';

const NOOP_EVENTS = {
  on: (_e: string, _cb: (...a: any[]) => void) => {},
  off: (_e: string, _cb: (...a: any[]) => void) => {},
  emit: (_e: string, ..._a: any[]) => {},
};

export function useRouter() {
  const nav = useNavRouter();
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const params = useParams() ?? {};

  const query = useMemo(() => {
    const q: Record<string, string | string[]> = {};
    searchParams?.forEach((value, key) => {
      const existing = q[key];
      if (existing === undefined) q[key] = value;
      else q[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    });
    for (const [k, v] of Object.entries(params)) q[k] = v as string | string[];
    return q;
  }, [searchParams, params]);

  return useMemo(
    () => ({
      query,
      locale: 'en',
      locales: ['en'],
      defaultLocale: 'en',
      pathname,
      route: pathname,
      asPath: pathname + (searchParams && searchParams.size ? `?${searchParams.toString()}` : ''),
      isReady: true,
      push: (url: any, _as?: any, _opts?: any) => Promise.resolve(nav.push(typeof url === 'string' ? url : url?.pathname ?? '/')),
      replace: (url: any, _as?: any, _opts?: any) => Promise.resolve(nav.replace(typeof url === 'string' ? url : url?.pathname ?? '/')),
      back: () => nav.back(),
      reload: () => window.location.reload(),
      prefetch: (url: string) => Promise.resolve(nav.prefetch(url)),
      events: NOOP_EVENTS,
    }),
    [query, pathname, searchParams, nav],
  );
}

/** Module-scope singleton (V1: `import Router from 'next/router'`). */
const Router = {
  locale: 'en' as string | undefined,
  pathname: '/',
  events: NOOP_EVENTS,
  push(url: string) {
    if (typeof window !== 'undefined') window.location.assign(url);
    return Promise.resolve(true);
  },
  replace(url: string) {
    if (typeof window !== 'undefined') window.location.replace(url);
    return Promise.resolve(true);
  },
  reload() {
    if (typeof window !== 'undefined') window.location.reload();
  },
  back() {
    if (typeof window !== 'undefined') window.history.back();
  },
};

export default Router;
