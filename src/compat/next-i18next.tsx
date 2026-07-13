'use client';

/**
 * next-i18next compat shim (English-only, statically bundled).
 *
 * V1 wraps every string in next-i18next's useTranslation. Production ships
 * en-only (NEXT_PUBLIC_ENABLE_MULTI_LANG=false), so this shim resolves keys
 * from the copied `public/locales/en/*.json` at build time. Semantics kept:
 *  - t('text-x')            → default namespace lookup
 *  - t('common:text-x')     → explicit namespace prefix
 *  - t(key, {var})          → {{var}} interpolation
 *  - missing key            → returns the key itself (i18next default)
 */

import * as React from 'react';
import common from '../../public/locales/en/common.json';
import banner from '../../public/locales/en/banner.json';
import faq from '../../public/locales/en/faq.json';
import policy from '../../public/locales/en/policy.json';
import terms from '../../public/locales/en/terms.json';

const NAMESPACES: Record<string, Record<string, string>> = {
  common: common as any,
  banner: banner as any,
  faq: faq as any,
  policy: policy as any,
  terms: terms as any,
};

export type TFunction = (key: string, vars?: Record<string, any>) => string;

function translate(defaultNs: string, key: string, vars?: Record<string, any>): string {
  let ns = defaultNs;
  let k = key;
  const idx = key.indexOf(':');
  if (idx > -1) {
    ns = key.slice(0, idx);
    k = key.slice(idx + 1);
  }
  let value = NAMESPACES[ns]?.[k] ?? NAMESPACES.common?.[k] ?? k;
  if (vars) {
    for (const [name, v] of Object.entries(vars)) {
      value = value.split(`{{${name}}}`).join(String(v));
    }
  }
  return value;
}

export function useTranslation(ns: string | string[] = 'common') {
  const defaultNs = Array.isArray(ns) ? ns[0] : ns;
  const t = React.useCallback<TFunction>((key, vars) => translate(defaultNs, key, vars), [defaultNs]);
  return {
    t,
    i18n: {
      language: 'en',
      changeLanguage: async (_lng?: string) => undefined,
      dir: () => 'ltr' as const,
    },
    ready: true,
  };
}

/** Minimal <Trans> — renders the resolved string (V1 uses it in ~5 static spots). */
export function Trans({
  i18nKey,
  ns = 'common',
  values,
  children,
}: {
  i18nKey?: string;
  ns?: string;
  values?: Record<string, any>;
  components?: any;
  children?: React.ReactNode;
}) {
  if (i18nKey) return <>{translate(ns, i18nKey, values)}</>;
  return <>{children}</>;
}

/** no-op HOC (App Router bundles translations statically). */
export const appWithTranslation = <P extends object>(C: React.ComponentType<P>) => C;

/** Tripwire: any surviving pages-router SSR translation call resolves to nothing. */
export const serverSideTranslations = async (
  _locale?: string,
  _namespaces?: string[],
): Promise<Record<string, never>> => ({});
