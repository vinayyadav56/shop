import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from './icons';
import { formatINR } from './verticals';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { cartAnimation } from '@/lib/cart-animation';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { productPlaceholder } from '@/lib/placeholders';
import type { Product } from '@/types';

/** Immersive product card — full-bleed image, overlaid info, real add-to-cart. */
export function StorefrontProductCard({
  product,
  tag,
}: {
  product: Product;
  tag?: string;
}) {
  const { addItemToCart, isInCart, updateCartLanguage, language } = useCart();
  const { openModal } = useModalAction();
  const [wish, setWish] = React.useState(false);

  const regular = Number(product?.price ?? 0);
  const sale = Number(product?.sale_price ?? 0) || regular;
  const off = regular > sale ? Math.round((1 - sale / regular) * 100) : 0;
  const rating = Number(product?.ratings ?? 0);
  const image =
    product?.image?.original || product?.image?.thumbnail || productPlaceholder;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Products with variations must be configured in the detail modal/page.
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-mintsoft"
    >
      <Link href={`/products/${product?.slug}`} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product?.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep via-deep/15 to-transparent" />

      {/* top chips */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
        <div className="flex flex-col gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-leaf px-2.5 py-1 text-[11px] font-bold text-white shadow">
              {off}% OFF
            </span>
          )}
          {tag && (
            <span className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-forest">
              {tag}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
            wish ? 'bg-leaf text-white' : 'bg-white/80 text-forest hover:bg-white'
          }`}
          aria-label="wishlist"
        >
          <Icon.leaf className="h-4 w-4" />
        </button>
      </div>

      {/* bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-base font-bold leading-tight drop-shadow line-clamp-2 sm:text-lg">
            {product?.name}
          </h3>
          {rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold">
              <Icon.star className="h-3.5 w-3.5 text-goldlight" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-white">
            {formatINR(sale)}
          </span>
          {off > 0 && (
            <span className="text-sm text-white/60 line-through">
              {formatINR(regular)}
            </span>
          )}
        </div>
        {/* add to cart — slides up on hover (always tappable on touch) */}
        <div className="mt-3 max-h-16 overflow-hidden opacity-100 transition-all duration-300 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-16 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-bold text-forest transition hover:bg-leaf hover:text-white"
          >
            <Icon.bag className="h-4 w-4" /> Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
