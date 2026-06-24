import type { Category } from '@/types';

/** Best available image URL for a category card. */
export function imgOf(c?: Category): string | undefined {
  return c?.image?.original || c?.image?.thumbnail || undefined;
}

/** "12 items" / "1 item" / "Explore" when the count is unknown. */
export function countLabel(c?: Category): string {
  const n = c?.products_count ?? 0;
  return n > 0 ? `${n} item${n === 1 ? '' : 's'}` : 'Explore';
}
