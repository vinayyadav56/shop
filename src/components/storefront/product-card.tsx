import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from './icons';
import { formatINR } from './verticals';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { cartAnimation } from '@/lib/cart-animation';
import { useModalAction } from '@/components/ui/modal/modal.context';
import type { Product } from '@/types';

/**
 * Plant At Home Design System product card: white surface, hairline kraft
 * border, soft low shadow, 0.5rem radius. Real photo (or sage panel + house
 * mark). Clay "Sale" badge, heart fav, serif name, italic botanical, sage
 * care chips, ₹ price + strikethrough, forest "+" add button.
 */
export function StorefrontProductCard({
  product,
}: {
  product: Product;
  /** kept for caller API compatibility; not rendered */
  tag?: string;
}) {
  const { addItemToCart, isInCart, updateCartLanguage, language } = useCart();
  const { openModal } = useModalAction();
  const [wish, setWish] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const isBundle = product?.product_type === 'bundle';
  // Variable plants carry no price/sale_price — they price per size, so show
  // "from ₹{min_price}" and skip the sale/strikethrough.
  const isVariable = product?.product_type === 'variable';
  const bundleTotal = Number(product?.bundle_total_value ?? 0);
  const regular = Number(product?.price ?? 0);
  const sale = isVariable
    ? Number(product?.min_price ?? 0)
    : Number(product?.sale_price ?? 0) || regular;
  // for bundles, compare the offer price against the items' total value
  const compareAt = isBundle && bundleTotal > sale ? bundleTotal : regular;
  const off = isVariable ? 0 : compareAt > sale ? Math.round((1 - sale / compareAt) * 100) : 0;
  const image = product?.image?.original || product?.image?.thumbnail || '';
  const botanical = product?.scientific_name;
  const care = product?.care ?? [];
  const bundleCount = product?.bundle_items?.length ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (Number(product?.quantity) < 1) return;
    if (product?.product_type === 'variable') {
      openModal('PRODUCT_DETAILS', product?.slug);
      return;
    }
    const item = generateCartItem(product as any, {} as any);
    if (item?.language && item.language !== language) {
      updateCartLanguage(item.language);
    }
    addItemToCart(item, 1);
    if (!isInCart(item.id)) cartAnimation(e);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-kraft-200/80 bg-white transition-all duration-300 hover:border-[#B58E39]/40 hover:shadow-[0_10px_30px_-12px_rgba(34,48,26,0.18)]"
    >
      {/* photo — real photo, else an elegant cream→sage panel with the mark + name */}
      <Link
        href={`/products/${product?.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[radial-gradient(130%_130%_at_30%_15%,#FAF9F6,#E7EEE2_60%,#D2E0CB)]"
      >
        {image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product?.name}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark-house.png" alt="" aria-hidden className="h-12 w-auto opacity-35" />
            <span className="font-serif text-sm italic text-forest-800/70 line-clamp-2">{product?.name}</span>
          </span>
        )}

        {isBundle ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-forest-900/90 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            Bundle{bundleCount ? ` · ${bundleCount}` : ''}
          </span>
        ) : off > 0 ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-[#B58E39]/60 bg-white/85 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a6a23] backdrop-blur">
            {off}% off
          </span>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white"
          aria-label="Save to favourites"
        >
          <Icon.heart className="h-[15px] w-[15px]" stroke={wish ? '#C26B45' : '#2E5E2A'} fill={wish ? '#C26B45' : 'none'} />
        </button>
      </Link>

      {/* body — tight, editorial */}
      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/products/${product?.slug}`}
          className="font-serif text-[15px] font-semibold leading-[1.15] text-forest-900 transition line-clamp-2 hover:text-forest-700 sm:text-base"
        >
          {product?.name}
        </Link>

        {botanical && (
          <p className="mt-0.5 font-serif text-[11px] italic text-stone-500 line-clamp-1">{botanical}</p>
        )}

        {care.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {care.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded-full bg-sage-100/70 px-2 py-[2px] text-[10px] font-medium text-forest-800"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            {isVariable && (
              <span className="text-[9px] uppercase tracking-[0.14em] text-stone-400">from</span>
            )}
            <span className="flex items-baseline gap-1.5">
              <span className="font-serif text-[17px] font-semibold leading-none text-forest-900">{formatINR(sale)}</span>
              {off > 0 && (
                <span className="text-[11px] text-stone-400 line-through">{formatINR(compareAt)}</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-forest-700/35 text-forest-700 transition duration-200 hover:bg-forest-700 hover:text-white"
            aria-label={`Add ${product?.name} to cart`}
          >
            <Icon.plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
