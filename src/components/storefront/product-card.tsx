import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from './icons';
import { PlantMark } from './logo-mark';
import { formatINR } from './verticals';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { cartAnimation } from '@/lib/cart-animation';
import { useModalAction } from '@/components/ui/modal/modal.context';
import type { Product } from '@/types';

/**
 * Premium plant card (matches the reference): rounded white card with the real
 * product photo (or a sage house-plant placeholder) up top, a clay "Sale" pill,
 * heart wishlist, serif name, italic botanical, sage care chips, ₹ price +
 * strikethrough, and a solid forest "+" add button.
 */
export function StorefrontProductCard({
  product,
}: {
  product: Product;
  /** kept for API compatibility with callers; no longer rendered */
  tag?: string;
}) {
  const { addItemToCart, isInCart, updateCartLanguage, language } = useCart();
  const { openModal } = useModalAction();
  const [wish, setWish] = React.useState(false);

  const regular = Number(product?.price ?? 0);
  const sale = Number(product?.sale_price ?? 0) || regular;
  const off = regular > sale ? Math.round((1 - sale / regular) * 100) : 0;
  const image = product?.image?.original || product?.image?.thumbnail || '';
  const botanical = product?.scientific_name;
  const care = product?.care ?? [];

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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-[0_10px_40px_rgba(31,42,33,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_55px_rgba(31,42,33,0.14)]"
    >
      {/* image panel — real photo, or sage + house-plant placeholder */}
      <Link
        href={`/products/${product?.slug}`}
        className="relative grid aspect-[1/0.92] place-items-center overflow-hidden bg-gradient-to-b from-[#DEE8D4] to-[#CBDDBF]"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product?.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <PlantMark className="h-[45%] w-[45%]" stroke="#8FA373" />
        )}

        {off > 0 && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-clay px-3.5 py-1.5 text-xs font-semibold text-cream shadow-sm">
            Sale
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-[0_4px_14px_rgba(31,42,33,0.12)] transition"
          aria-label="Add to wishlist"
        >
          <Icon.heart
            className="h-[18px] w-[18px]"
            stroke={wish ? '#B5654A' : '#2E7D52'}
            fill={wish ? '#B5654A' : 'none'}
          />
        </button>
      </Link>

      {/* info */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/products/${product?.slug}`}
          className="font-serif text-2xl font-semibold leading-tight text-ink transition line-clamp-2 hover:text-forest"
        >
          {product?.name}
        </Link>

        {botanical && (
          <p className="mt-0.5 font-serif text-base italic text-forest/55">{botanical}</p>
        )}

        {care.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {care.map((c) => (
              <span
                key={c}
                className="rounded-full bg-mint px-3.5 py-1.5 text-xs font-medium text-forest"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ink">{formatINR(sale)}</span>
            {off > 0 && (
              <span className="text-base text-forest/40 line-through">
                {formatINR(regular)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-cream transition hover:bg-deep"
            aria-label={`Add ${product?.name} to cart`}
          >
            <Icon.plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
