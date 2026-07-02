import { useSettings } from '@/framework/settings';

/** Admin-editable "Why Plants" section content (settings.options.whyPlants). */
export type WhyPlantsConfig = {
  heading?: string;
  subtitle?: string;
  cards?: Array<{
    title?: string;
    body?: string;
    image?: { original?: string; thumbnail?: string } | string | null;
    iconKey?: string;
    order?: number;
  }>;
};

/** Admin-editable Collections section (settings.options.homeCollections). */
export type HomeCollectionsConfig = {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  count?: number;
  cards?: Array<{
    categorySlug?: string;
    image?: { original?: string; thumbnail?: string } | string | null;
    title?: string;
    subtitle?: string;
    order?: number;
  }>;
};

/**
 * Admin-driven homepage config from settings.options (passthrough, no API change):
 * - banners: per-banner on/off flags (default ON when unset)
 * - homeCategories: ordered category slugs to feature on the home (null = all top-level)
 * - whyPlants / homeCollections: full section CMS (null = built-in defaults)
 * Settings are SSR-prefetched on the home, so this is stable on first paint (no flash).
 */
export function useHomeConfig() {
  const { settings } = useSettings() as any;
  return {
    banners: (settings?.homeBanners ?? {}) as Record<string, boolean>,
    homeCategories: (Array.isArray(settings?.homeCategories)
      ? (settings.homeCategories as string[])
      : null) as string[] | null,
    whyPlants: (settings?.whyPlants ?? null) as WhyPlantsConfig | null,
    homeCollections: (settings?.homeCollections ??
      null) as HomeCollectionsConfig | null,
  };
}

/** A single banner's on/off (default ON). */
export function useBannerEnabled(key: string): boolean {
  const { banners } = useHomeConfig();
  return banners?.[key] ?? true;
}

/**
 * Order/filter a fetched category list by the admin-curated slugs (homeCategories).
 * When no curation is set, return the input unchanged (all top-level).
 */
export function applyCuration<T extends { slug?: string }>(
  categories: T[],
  curated: string[] | null,
): T[] {
  if (!curated || curated.length === 0) return categories;
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const curatedList = curated.map((s) => bySlug.get(s)).filter(Boolean) as T[];
  // Stale/mismatched admin slugs (data drift, localized slugs) must never
  // blank the home grids — fall back to the uncurated list.
  return curatedList.length > 0 ? curatedList : categories;
}
