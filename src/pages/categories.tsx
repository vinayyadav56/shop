import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import { useCategories } from '@/framework/category';
import { CATEGORIES_PER_PAGE } from '@/framework/client/variables';
import {
  CategoriesHero,
  CategorySearch,
  FeaturedPillar,
  PillarGrid,
  CareLevelChips,
  RoomGrid,
  Eyebrow,
} from '@/components/storefront/categories';

export { getStaticProps } from '@/framework/general.ssr';

/** Loading placeholder for the featured + pillar tiles. */
function PillarsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[172px] rounded-2xl bg-forest-900/[0.06] sm:h-[220px]" />
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[128px] rounded-2xl bg-forest-900/[0.06] sm:h-[150px]" />
        ))}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories({
    limit: CATEGORIES_PER_PAGE,
    parent: 'null',
  });

  // Largest top-level categories first → featured + a 4-up pillar grid.
  const top = [...(categories ?? [])].sort(
    (a, b) => (b.products_count ?? 0) - (a.products_count ?? 0),
  );
  const featured = top[0];
  const pillars = top.slice(1, 5);

  return (
    <div className="bg-[color:var(--pa-bg)]">
      <Seo
        title="All Categories — PlantAtHome"
        description="Browse every PlantAtHome collection — plants by care level, by room, pots & planters, décor and more."
        url="categories"
      />

      <CategoriesHero />

      {/* cream content rounds over the forest header (design overlap) */}
      <div className="relative z-10 -mt-4 rounded-t-[22px] bg-[color:var(--pa-bg)] pb-24 pt-5 lg:pb-14">
        <div className="mx-auto max-w-7xl">
          <CategorySearch />

          {/* Shop by category — live catalog */}
          <section className="mt-6 px-5 sm:px-8">
            <Eyebrow>Shop by category</Eyebrow>
            {featured ? (
              <>
                <FeaturedPillar category={featured} />
                <div className="mt-3">
                  <PillarGrid categories={pillars} />
                </div>
              </>
            ) : isLoading ? (
              <PillarsSkeleton />
            ) : (
              <p className="text-sm text-stone-500">No categories yet.</p>
            )}
          </section>

          {/* By care level */}
          <section className="mt-8 px-5 sm:px-8">
            <Eyebrow>By care level</Eyebrow>
            <CareLevelChips />
          </section>

          {/* Shop by room */}
          <section className="mt-8 px-5 sm:px-8">
            <Eyebrow>Shop by room</Eyebrow>
            <RoomGrid />
          </section>
        </div>
      </div>
    </div>
  );
}

CategoriesPage.getLayout = getSiteLayout;
