import Link from 'next/link';
import { FadeUp, WordReveal, ClipReveal } from '../motion';
import { Icon } from '../icons';
import { StorefrontCategoryCard } from '../category-card';
import type { Category } from '@/types';

export function CategoryGrid({
  categories,
  typeSlug,
  isLoading,
  eyebrow = 'Shop by category',
  title = 'Find your perfect green.',
  tone = 'light',
}: {
  categories: Category[];
  typeSlug: string;
  isLoading?: boolean;
  eyebrow?: string;
  title?: string;
  tone?: 'light' | 'soft';
}) {
  if (!isLoading && (!categories || categories.length === 0)) return null;

  return (
    <section id="categories" className={tone === 'soft' ? 'bg-mintsoft' : ''}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <FadeUp>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
                {eyebrow}
              </p>
            </FadeUp>
            <h2 className="max-w-xl font-heading text-3xl font-extrabold leading-tight text-forest sm:text-4xl lg:text-5xl">
              <WordReveal text={title} />
            </h2>
          </div>
          <FadeUp delay={0.1}>
            <Link
              href={`/${typeSlug}/search`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-forest"
            >
              View all <Icon.arrow className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl bg-mint sm:h-52"
                />
              ))
            : categories.map((c, i) => (
                <ClipReveal key={c.id ?? c.slug} delay={(i % 6) * 0.06}>
                  <StorefrontCategoryCard category={c} typeSlug={typeSlug} />
                </ClipReveal>
              ))}
        </div>
      </div>
    </section>
  );
}
