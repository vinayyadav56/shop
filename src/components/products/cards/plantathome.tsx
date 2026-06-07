'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useToggleWishlist } from '@/framework/wishlist';
import usePrice from '@/lib/use-price';
import type { Product, Tag } from '@/types';

const AddToCart = dynamic(
  () => import('@/components/products/add-to-cart/add-to-cart').then((m) => m.AddToCart),
  { ssr: false },
);

/* ─── helpers ─────────────────────────────────────────────────── */
const BENEFIT_SLUGS = new Set([
  'air-purifying','air-purifier','air purifying',
  'pet-friendly','pet friendly',
  'low-light','low light',
  'easy-care','easy care','easy to grow',
  'rare','rare plant',
  'flowering','blooms',
  'fast-growing','fast growing',
  'drought-tolerant',
]);

const BADGE_MAP: Record<string, string> = {
  'best-seller':   'Best Seller',
  'bestseller':    'Best Seller',
  'best seller':   'Best Seller',
  'editors-pick':  "Editor's Pick",
  "editor's pick": "Editor's Pick",
  'new-arrival':   'New Arrival',
  'new arrival':   'New Arrival',
  'air-purifier':  'Air Purifier',
  'air purifier':  'Air Purifier',
};

function getBadge(tags: Tag[] = []) {
  for (const tag of tags) {
    const key = (tag.slug ?? tag.name ?? '').toLowerCase();
    if (BADGE_MAP[key]) return BADGE_MAP[key];
    const nameKey = (tag.name ?? '').toLowerCase();
    if (BADGE_MAP[nameKey]) return BADGE_MAP[nameKey];
  }
  return null;
}

function getBenefits(tags: Tag[] = []) {
  return tags
    .filter((t) => BENEFIT_SLUGS.has((t.slug ?? t.name ?? '').toLowerCase()) ||
                   BENEFIT_SLUGS.has((t.name ?? '').toLowerCase()))
    .slice(0, 2)
    .map((t) => t.name);
}

function getBotanical(product: Product): string {
  // prefer a real scientific name if present
  const sci = (product as any)?.scientific_name as string | undefined;
  if (sci) return sci;
  const firstLine = product.description?.split(/\n|<br/)[0]?.replace(/<[^>]+>/g, '').trim();
  if (firstLine && firstLine.length < 48) return firstLine;
  return '';
}

/* ─── Loading Skeleton ─────────────────────────────────────────── */
export const PlantAtHomeCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-md border border-kraft-200/70 bg-white">
    <div className="aspect-[4/5] w-full animate-pulse bg-gradient-to-br from-[#F2F1EC] to-[#E7EEE2]" />
    <div className="flex flex-1 flex-col gap-2 p-3">
      <div className="h-3.5 w-4/5 animate-pulse rounded bg-stone-200/80" />
      <div className="h-2.5 w-2/5 animate-pulse rounded bg-stone-200/60" />
      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200/80" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200/70" />
      </div>
    </div>
  </div>
);

/* ─── Heart icon ───────────────────────────────────────────────── */
const Heart = ({ active }: { active: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? '#C26B45' : 'none'}
    stroke={active ? '#C26B45' : '#2E5E2A'} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* ─── Main small-luxury listing card ──────────────────────────── */
type Props = { product: Product; className?: string };

const PlantAtHomeCard: React.FC<Props> = ({ product, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const { openModal } = useModalAction();
  const { toggleWishlist } = useToggleWishlist(product.id);

  const { price, basePrice, discount } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
  });
  const { price: minPrice } = usePrice({ amount: product.min_price });

  const badge     = getBadge(product.tags);
  const benefits  = getBenefits(product.tags);
  const botanical = getBotanical(product);
  const inStock   = Number(product.quantity) > 0;
  const isVariable = product.product_type?.toLowerCase() === 'variable';
  const image = product.image?.original ?? product.image?.thumbnail ?? '';

  function handleQuickView() {
    openModal('PRODUCT_DETAILS', product.slug);
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    setWishlisting(true);
    await toggleWishlist({ product_id: product.id });
    setWishlisting(false);
  }

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`group flex h-full flex-col overflow-hidden rounded-md border border-kraft-200/80 bg-white transition-all duration-300 hover:border-[#B58E39]/40 hover:shadow-[0_10px_30px_-12px_rgba(34,48,26,0.18)] ${className}`}
    >
      {/* photo — real photo, else cream→sage panel with mark + name */}
      <button
        type="button"
        onClick={handleQuickView}
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(130%_130%_at_30%_15%,#FAF9F6,#E7EEE2_60%,#D2E0CB)] text-left"
      >
        {image && !imgError ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setImgError(true)}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark-house.png" alt="" aria-hidden className="h-12 w-auto opacity-35" />
            <span className="font-serif text-sm italic text-forest-800/70 line-clamp-2">{product.name}</span>
          </span>
        )}

        {/* badge / flash / discount — single, top-left */}
        {badge ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-forest-900/90 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            {badge}
          </span>
        ) : product.in_flash_sale ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#C26B45]/95 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            Flash Deal
          </span>
        ) : discount ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-[#B58E39]/60 bg-white/85 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a6a23] backdrop-blur">
            {discount}
          </span>
        ) : null}

        {/* wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlisting}
          className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white focus:opacity-100 disabled:opacity-60"
          aria-label="Add to wishlist"
        >
          <Heart active={!!product.in_wishlist} />
        </button>

        {/* out of stock */}
        {!inStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
            <span className="rounded-full bg-forest-900/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Out of Stock
            </span>
          </span>
        )}
      </button>

      {/* body — tight, editorial */}
      <div className="flex flex-1 flex-col p-3">
        <button
          type="button"
          onClick={handleQuickView}
          className="text-left font-serif text-[15px] font-semibold leading-[1.15] text-forest-900 transition line-clamp-2 hover:text-forest-700 sm:text-base"
        >
          {product.name}
        </button>

        {botanical && (
          <p className="mt-0.5 font-serif text-[11px] italic text-stone-500 line-clamp-1">{botanical}</p>
        )}

        {benefits.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {benefits.map((b) => (
              <span
                key={b}
                className="rounded-full bg-sage-100/70 px-2 py-[2px] text-[10px] font-medium text-forest-800"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-col">
            {isVariable && (
              <span className="text-[9px] uppercase tracking-[0.14em] text-stone-400">from</span>
            )}
            <span className="flex items-baseline gap-1.5">
              <span className="font-serif text-[17px] font-semibold leading-none text-forest-900">
                {isVariable ? minPrice : price}
              </span>
              {!isVariable && basePrice && (
                <del className="text-[11px] text-stone-400">{basePrice}</del>
              )}
            </span>
            {product.unit && (
              <span className="mt-0.5 text-[10px] text-stone-400">/ {product.unit}</span>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            {inStock ? (
              <AddToCart variant="argon" data={product} />
            ) : (
              <button
                type="button"
                onClick={handleQuickView}
                className="rounded-full border border-forest-700/30 px-3 py-1.5 text-[11px] font-medium text-forest-700 transition hover:bg-forest-700 hover:text-white"
              >
                Notify
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PlantAtHomeCard;
