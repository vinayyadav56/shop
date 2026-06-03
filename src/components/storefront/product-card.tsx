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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-kraft-200 bg-white shadow-[0_2px_8px_rgba(34,48,26,0.07)] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(34,48,26,0.10)]"
    >
      {/* photo block — real photo, else sage panel + house-mark watermark */}
      <Link
        href={`/products/${product?.slug}`}
        className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_20%,#E7EEE2,#CFE0C6)]"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product?.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/brand/mark-house.png" alt="" aria-hidden className="h-[52%] w-auto opacity-50" />
        )}

        {isBundle ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-forest-700 px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-white">
            Bundle{bundleCount ? ` · ${bundleCount}` : ''}
          </span>
        ) : off > 0 ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-clay-500 px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-white">
            Sale
          </span>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/85 transition hover:bg-white"
          aria-label="Save to favourites"
        >
          <Icon.heart className="h-4 w-4" stroke={wish ? '#C26B45' : '#2E5E2A'} fill={wish ? '#C26B45' : 'none'} />
        </button>
      </Link>

      {/* body */}
      <div className="flex flex-1 flex-col p-3.5">
        <Link
          href={`/products/${product?.slug}`}
          className="font-serif text-xl font-semibold leading-[1.1] text-forest-900 transition line-clamp-2 hover:text-forest-700"
        >
          {product?.name}
        </Link>

        {botanical && (
          <p className="mt-0.5 text-[13px] italic text-stone-500">{botanical}</p>
        )}

        {care.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {care.map((c) => (
              <span
                key={c}
                className="rounded-full bg-sage-100 px-2.5 py-[3px] text-[11px] font-medium text-forest-800"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-1.5">
            {isVariable && <span className="text-[13px] text-stone-500">from</span>}
            <span className="text-[17px] font-bold text-forest-900">{formatINR(sale)}</span>
            {off > 0 && (
              <span className="text-[13px] text-stone-500 line-through">{formatINR(compareAt)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-forest-700 text-white transition hover:bg-forest-800"
            aria-label={`Add ${product?.name} to cart`}
          >
            <Icon.plus className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
