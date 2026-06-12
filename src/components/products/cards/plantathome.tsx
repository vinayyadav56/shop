'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useToggleWishlist, useInWishlist } from '@/framework/wishlist';
import { useUser } from '@/framework/user';
import { useAskAiEnabled } from '@/framework/ask-ai';
import { useCart } from '@/store/quick-cart/cart.context';
import usePrice from '@/lib/use-price';
import { Icon } from '@/components/storefront/icons';
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

/* ─── Loading Skeleton (export kept for callers) ───────────────── */
export const PlantAtHomeCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#12281A]/[0.08] bg-white">
    <div className="aspect-[4/5] w-full animate-pulse bg-[#EFEDE4]" />
    <div className="relative flex flex-1 flex-col p-3 pb-[52px]">
      <div className="h-3.5 w-4/5 animate-pulse rounded bg-stone-200/80" />
      <div className="mt-2 h-4 w-2/5 animate-pulse rounded bg-stone-200/70" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-stone-200/60" />
      <div className="absolute bottom-2.5 right-2.5 h-9 w-9 animate-pulse rounded-md bg-stone-200/80" />
    </div>
  </div>
);

/* ─── Heart icon ───────────────────────────────────────────────── */
const Heart = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#C9A24B' : 'none'} stroke={active ? '#C9A24B' : '#12281A'} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ─── Star rating row — gold, per the emerald mockup ───────────── */
const StarRow = ({ rating, count }: { rating: number; count: number }) => {
  const r = Math.round(rating);
  return (
    <div className="mt-1 flex items-center gap-1">
      <span className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon.star key={i} className={`h-3 w-3 ${i < r ? 'text-[#C9A24B]' : 'text-[#DCD5C2]'}`} />
        ))}
      </span>
      <span className="text-[11px] text-stone-400">
        {count > 0 ? `(${count.toLocaleString('en-IN')})` : 'New'}
      </span>
    </div>
  );
};

/* ─── Mockup listing card ──────────────────────────────────────── */
type Props = { product: Product; className?: string };

/* Compact icon-only skin for the stock AddToCart button (it renders an icon +
 * a text <span> — see add-to-cart-btn.tsx `plantathome`): shrink to a 36px
 * square, hide the label, flatten the gradient to the emerald token. */
const COMPACT_ADD =
  'absolute bottom-2.5 right-2.5 w-9 [&_button]:h-9 [&_button]:w-9 [&_button]:rounded-md [&_button]:p-0 [&_button]:min-w-0 [&_span:not(.sr-only)]:hidden ' +
  '[&_button]:bg-none [&_button]:bg-[#12281A] [&_button]:text-[#F0EAD8] [&_button]:hover:bg-[#1A3322]';
/* Once in cart, AddToCart swaps to the qty Counter — give it room and the
 * same dark-emerald treatment. */
const COMPACT_COUNTER =
  'absolute bottom-2.5 right-2.5 w-[104px] [&>div]:h-9 [&>div]:rounded-md [&>div]:bg-[#12281A] [&>div]:text-[#F0EAD8] ' +
  '[&_button]:h-9 [&_button]:min-w-0 [&_button]:p-0 [&_button]:px-2 [&_span:not(.sr-only)]:hidden [&_button]:hover:!bg-[#1A3322]';

const PlantAtHomeCard: React.FC<Props> = ({ product, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const { openModal } = useModalAction();
  const { isAuthorized } = useUser();
  const { toggleWishlist } = useToggleWishlist(product.id);
  const { inWishlist } = useInWishlist({
    product_id: product.id,
    enabled: isAuthorized,
  });
  const { isInCart } = useCart();

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
  const inCart = !isVariable && isInCart(product.id);
  const image = product.image?.original ?? product.image?.thumbnail ?? '';

  const { data: askAiSettings } = useAskAiEnabled();
  const askAiEnabled = Boolean(askAiSettings?.data?.enabled);

  function handleQuickView() {
    openModal('PRODUCT_DETAILS', product.slug);
  }
  function handleAskAi(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    openModal('ASK_AI', { product });
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
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-[#12281A]/[0.08] bg-white transition-all duration-300 hover:border-[#C9A24B]/40 hover:shadow-[0_18px_40px_-28px_rgba(18,40,26,0.4)] ${className}`}
    >
      {/* photo + wishlist (heart is a sibling of the image button — not nested) */}
      <div className="relative">
        <button
          type="button"
          onClick={handleQuickView}
          aria-label={`View ${product.name}`}
          className="relative block aspect-[4/5] w-full overflow-hidden bg-[#EFEDE4] text-left"
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
              <span className="font-cormorant text-sm font-medium text-[#12281A]/70 line-clamp-2">{product.name}</span>
            </span>
          )}

          {/* badge / flash / discount — top-left pill */}
          {badge ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold text-[#12281A] shadow-sm backdrop-blur">
              {badge}
            </span>
          ) : product.in_flash_sale ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#FCE9D9] px-2.5 py-1 text-[10.5px] font-bold text-[#B4501E] shadow-sm">
              🔥 Flash Deal
            </span>
          ) : discount ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#E8F3EC] px-2.5 py-1 text-[10.5px] font-bold text-[#1F6B3B] shadow-sm">
              {discount} Off
            </span>
          ) : null}

          {!inStock && (
            <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
              <span className="rounded-full bg-[#12281A]/85 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#F0EAD8]">
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

        {/* Ask AI — per-plant chat (admin-toggled); overlay pill, bottom-left */}
        {askAiEnabled && (
          <button
            type="button"
            onClick={handleAskAi}
            aria-label={`Ask AI about ${product.name}`}
            className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#12281A]/85 px-2.5 py-1.5 text-[11px] font-semibold text-[#F0EAD8] shadow-sm backdrop-blur transition hover:scale-[1.03] hover:bg-[#12281A]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z" />
            </svg>
            Ask AI
          </button>
        )}
      </div>

      {/* body — relative so the square cart button can pin bottom-right;
          pb reserve keeps the corner control clear of text */}
      <div className="relative flex flex-1 flex-col p-3 pb-[52px]">
        <button
          type="button"
          onClick={handleQuickView}
          className="text-left text-[13px] font-semibold leading-snug text-[#1A2A1E] transition line-clamp-1 hover:text-[#12281A]"
        >
          {product.name}
        </button>

        <div className="mt-1 flex items-baseline gap-1.5">
          {isVariable && (
            <span className="text-[10.5px] uppercase tracking-[0.12em] text-stone-400">from</span>
          )}
          <span className="text-[14.5px] font-bold leading-none text-[#12281A]">
            {isVariable ? minPrice : price}
          </span>
          {!isVariable && basePrice && (
            <del className="text-[11px] text-stone-400">{basePrice}</del>
          )}
        </div>

        <StarRow rating={ratingVal} count={reviewCount} />

        {/* square cart action — simple+in-stock uses the real AddToCart
            (compact icon-only skin); variable / out-of-stock opens quick view */}
        {inStock && !isVariable ? (
          <div onClick={(e) => e.stopPropagation()} className={inCart ? COMPACT_COUNTER : COMPACT_ADD}>
            <AddToCart variant="plantathome" counterVariant="plantathome" data={product} />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleQuickView}
            aria-label={inStock ? `Select options for ${product.name}` : `View ${product.name}`}
            className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-md bg-[#12281A] text-[#F0EAD8] transition hover:bg-[#1A3322]"
          >
            <Icon.bag className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.article>
  );
};

export default PlantAtHomeCard;
