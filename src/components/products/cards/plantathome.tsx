'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useToggleWishlist, useInWishlist } from '@/framework/wishlist';
import { useUser } from '@/framework/user';
import usePrice from '@/lib/use-price';
import type { Product, Tag } from '@/types';

const AddToCart = dynamic(
  () => import('@/components/products/add-to-cart/add-to-cart').then((m) => m.AddToCart),
  { ssr: false },
);

/* ─── badge helpers ───────────────────────────────────────────── */
const BADGE_MAP: Record<string, string> = {
  'best-seller': 'Best Seller',
  bestseller: 'Best Seller',
  'best seller': 'Best Seller',
  'editors-pick': "Editor's Pick",
  "editor's pick": "Editor's Pick",
  'new-arrival': 'New Arrival',
  'new arrival': 'New Arrival',
  'air-purifier': 'Air Purifier',
  'air purifier': 'Air Purifier',
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

/* ─── feature-grid icons (reference: car-spec row → plant attrs) ── */
const FeatIcon: Record<string, React.ReactNode> = {
  sun: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
  ),
  water: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
  ),
  ruler: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l13 13 5-5L8 3z" /><path d="M7 7l2 2M11 5l2 2M15 9l2 2M9 13l2 2" /></svg>
  ),
  paw: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="5" cy="9" r="2" /><path d="M8.5 14a3.5 3.5 0 0 1 7 0c0 1.5-1 2-1 3.5a2.5 2.5 0 0 1-5 0c0-1.5-1-2-1-3.5z" /></svg>
  ),
  box: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>
  ),
  leaf: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
  ),
  pin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
};

/** Map whatever attributes a product has into a small icon feature grid. */
function getFeatures(product: Product): { icon: string; label: string }[] {
  const pa: any = (product as any)?.plant_attribute ?? {};
  const out: { icon: string; label: string }[] = [];
  const push = (icon: string, label?: string | null) => {
    if (label && String(label).trim()) out.push({ icon, label: String(label).trim() });
  };
  push('sun', pa.sunlight);
  push('water', pa.water_requirement);
  push('ruler', pa.height_range);
  if (pa.pet_friendly ?? (product as any)?.pet_friendly) out.push({ icon: 'paw', label: 'Pet-friendly' });
  push('pin', pa.origin ?? (product as any)?.origin);
  push('box', product.unit);
  // fallback: surface benefit/care tags so the grid is never empty
  if (out.length < 2 && Array.isArray(product.tags)) {
    for (const t of product.tags) {
      if (out.length >= 4) break;
      if (t?.name) out.push({ icon: 'leaf', label: t.name });
    }
  }
  return out.slice(0, 4);
}

/* ─── Loading Skeleton (export kept for callers) ───────────────── */
export const PlantAtHomeCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-kraft-200 bg-white">
    <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-[#FBFBF8] to-[#EEF2EA]" />
    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200/80" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200/70" />
      <div className="h-3 w-2/5 animate-pulse rounded bg-stone-200/60" />
      <div className="mt-auto pt-3">
        <div className="h-9 w-full animate-pulse rounded-md bg-stone-200/70" />
      </div>
    </div>
  </div>
);

/* ─── Heart icon ───────────────────────────────────────────────── */
const Heart = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#C26B45' : 'none'} stroke={active ? '#C26B45' : '#2E5E2A'} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ─── Star rating row (matches the mockup's bestseller card) ─────── */
const Star = ({ on }: { on: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={on ? '#3A6B33' : 'none'} stroke={on ? '#3A6B33' : '#C9D3C0'} strokeWidth="1.6">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const StarRow = ({ rating, count }: { rating: number; count: number }) => {
  const r = Math.round(rating);
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} on={i < r} />
        ))}
      </span>
      <span className="text-[11.5px] font-medium text-stone-500">
        {count > 0 ? `(${count.toLocaleString('en-IN')})` : 'New'}
      </span>
    </div>
  );
};

/* ─── Reference-style listing card ─────────────────────────────── */
type Props = { product: Product; className?: string };

const PlantAtHomeCard: React.FC<Props> = ({ product, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const { openModal } = useModalAction();
  const { isAuthorized } = useUser();
  const { toggleWishlist } = useToggleWishlist(product.id);
  const { inWishlist } = useInWishlist({
    product_id: product.id,
    enabled: isAuthorized,
  });

  const { price, basePrice, discount } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
  });
  const { price: minPrice } = usePrice({ amount: product.min_price });

  const badge = getBadge(product.tags);
  const ratingVal = Number((product as any).ratings) || 0;
  const reviewCount = Number((product as any).total_reviews) || 0;
  const inStock = Number(product.quantity) > 0;
  const isVariable = product.product_type?.toLowerCase() === 'variable';
  const image = product.image?.original ?? product.image?.thumbnail ?? '';

  function handleQuickView() {
    openModal('PRODUCT_DETAILS', product.slug);
  }
  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    toggleWishlist({ product_id: product.id });
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-kraft-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:border-[#B58E39]/40 hover:shadow-[0_14px_34px_-14px_rgba(34,48,26,0.22)] ${className}`}
    >
      {/* photo + wishlist (heart is a sibling of the image button — not nested) */}
      <div className="relative">
      <button
        type="button"
        onClick={handleQuickView}
        aria-label={`View ${product.name}`}
        className="relative block aspect-square w-full overflow-hidden bg-[radial-gradient(130%_130%_at_30%_15%,#FBFBF8,#EEF2EA)] text-left"
      >
        {image && !imgError ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark-house.png" alt="" aria-hidden className="h-12 w-auto opacity-35" />
            <span className="font-cormorant text-sm font-semibold text-forest-800/70 line-clamp-2">{product.name}</span>
          </span>
        )}

        {/* badge / flash / discount — top-left pill */}
        {badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-forest-900 shadow-sm backdrop-blur">
            {badge}
          </span>
        ) : product.in_flash_sale ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#FCE9D9] px-2.5 py-1 text-[10px] font-bold text-[#B4501E] shadow-sm">
            🔥 Flash Deal
          </span>
        ) : discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#E8F3EC] px-2.5 py-1 text-[10px] font-bold text-[#1F6B3B] shadow-sm">
            {discount} Off
          </span>
        ) : null}

        {!inStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
            <span className="rounded-full bg-forest-900/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Out of Stock
            </span>
          </span>
        )}
      </button>

        {/* wishlist — sibling of the image button (valid HTML, reliable click) */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart active={inWishlist} />
        </button>

      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <button
          type="button"
          onClick={handleQuickView}
          className="text-left text-[15px] font-semibold leading-snug text-forest-900 transition line-clamp-1 hover:text-forest-700"
        >
          {product.name}
        </button>

        <div className="mt-1.5 flex items-end gap-1.5">
          {isVariable && (
            <span className="self-end pb-0.5 text-[9px] uppercase tracking-[0.14em] text-stone-400">from</span>
          )}
          <span className="text-[17px] font-bold leading-none text-forest-900">
            {isVariable ? minPrice : price}
          </span>
          {!isVariable && basePrice && (
            <del className="text-[11.5px] text-stone-400">{basePrice}</del>
          )}
          {product.unit && (
            <span className="text-[9px] text-stone-400">/ {product.unit}</span>
          )}
        </div>

        <StarRow rating={ratingVal} count={reviewCount} />

        {/* Add to Cart → becomes a quantity counter on click */}
        <div className="mt-auto pt-3" onClick={(e) => e.stopPropagation()}>
          {!inStock ? (
            <button
              type="button"
              onClick={handleQuickView}
              className="flex w-full items-center justify-center rounded-md border border-forest-800/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-forest-800 transition hover:bg-forest-800 hover:text-white"
            >
              Notify me
            </button>
          ) : isVariable ? (
            <button
              type="button"
              onClick={handleQuickView}
              className="flex w-full items-center justify-center rounded-md bg-forest-800 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-forest-700"
            >
              Select Options
            </button>
          ) : (
            <AddToCart variant="plantathome" counterVariant="plantathome" data={product} />
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default PlantAtHomeCard;
