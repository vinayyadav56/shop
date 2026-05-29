'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useToggleWishlist } from '@/framework/wishlist';
import usePrice from '@/lib/use-price';
import { useRouter } from 'next/router';
import { productPlaceholder } from '@/lib/placeholders';
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

const BADGE_MAP: Record<string, { label: string; cls: string }> = {
  'best-seller':   { label: 'Best Seller',    cls: 'pa-badge-gold'  },
  'bestseller':    { label: 'Best Seller',    cls: 'pa-badge-gold'  },
  'best seller':   { label: 'Best Seller',    cls: 'pa-badge-gold'  },
  'editors-pick':  { label: "Editor's Pick",  cls: 'pa-badge-dark'  },
  "editor's pick": { label: "Editor's Pick",  cls: 'pa-badge-dark'  },
  'new-arrival':   { label: 'New Arrival',    cls: 'pa-badge-green' },
  'new arrival':   { label: 'New Arrival',    cls: 'pa-badge-green' },
  'air-purifier':  { label: 'Air Purifier',   cls: 'pa-badge-sage'  },
  'air purifier':  { label: 'Air Purifier',   cls: 'pa-badge-sage'  },
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
    .slice(0, 3)
    .map((t) => t.name);
}

function getBotanicalName(product: Product): string {
  const firstLine = product.description?.split(/\n|<br/)[0]?.replace(/<[^>]+>/g, '').trim();
  if (firstLine && firstLine.length < 60) return firstLine;
  const catName = product.categories?.[0]?.name;
  return catName ? `${catName} variety` : '';
}

/* ─── Star rating ──────────────────────────────────────────────── */
const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 1l1.24 2.51L10 3.93l-2 1.95.47 2.76L6 7.36l-2.47 1.28.47-2.76L2 3.93l2.76-.42L6 1z"
          fill={s <= Math.round(rating) ? '#C7A76C' : '#E5E0D5'}
        />
      </svg>
    ))}
    {count > 0 && <span className="text-[10px] text-[#9E9589] ml-0.5">({count})</span>}
  </div>
);

/* ─── Loading Skeleton ─────────────────────────────────────────── */
export const PlantAtHomeCardSkeleton: React.FC = () => (
  <div className="pa-card-skeleton">
    <div className="pa-skel-img" />
    <div className="pa-skel-body">
      <div className="pa-skel-line pa-skel-title" />
      <div className="pa-skel-line pa-skel-sub" />
      <div className="pa-skel-tags">
        <div className="pa-skel-tag" /><div className="pa-skel-tag" />
      </div>
      <div className="pa-skel-line pa-skel-price" />
      <div className="pa-skel-btn" />
    </div>
  </div>
);

/* ─── Main Premium Card ────────────────────────────────────────── */
type Props = { product: Product; className?: string };

const PlantAtHomeCard: React.FC<Props> = ({ product, className = '' }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const { openModal } = useModalAction();
  const { toggleWishlist } = useToggleWishlist(product.id);

  const { price, basePrice, discount } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
  });
  const { price: minPrice } = usePrice({ amount: product.min_price });
  const { price: maxPrice } = usePrice({ amount: product.max_price });

  const badge    = getBadge(product.tags);
  const benefits = getBenefits(product.tags);
  const botanical = getBotanicalName(product);
  const inStock  = Number(product.quantity) > 0;
  const isVariable = product.product_type?.toLowerCase() === 'variable';

  function handleQuickView(e: React.MouseEvent) {
    e.stopPropagation();
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
      className={`pa-premium-card ${className}`}
      initial={false}
      whileHover="hovered"
      onClick={handleQuickView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleQuickView(e as any)}
      aria-label={`View ${product.name}`}
    >
      {/* ── Image zone (70%) ──────────────────────────── */}
      <div className="pa-card-img-zone">
        {/* Shimmer while loading */}
        {!imgLoaded && <div className="pa-card-shimmer" />}

        <motion.div
          className="pa-card-img-inner"
          variants={{ hovered: { scale: 1.05 } }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={product.image?.original ?? productPlaceholder}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="pa-card-img"
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>

        {/* Gold glow overlay on hover */}
        <motion.div
          className="pa-card-glow"
          variants={{ hovered: { opacity: 1 } }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badge */}
        {badge && (
          <div className={`pa-badge ${badge.cls}`}>{badge.label}</div>
        )}

        {/* Flash sale pill */}
        {product.in_flash_sale && !badge && (
          <div className="pa-badge pa-badge-gold">Flash Deal</div>
        )}

        {/* Discount chip */}
        {discount && (
          <div className="pa-discount-chip">{discount}</div>
        )}

        {/* Wishlist */}
        <motion.button
          className="pa-wishlist-btn"
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          animate={wishlisting ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          aria-label="Add to wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={product.in_wishlist ? '#C7A76C' : 'none'}
            stroke={product.in_wishlist ? '#C7A76C' : '#6B7280'} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </motion.button>

        {/* Quick view button */}
        <motion.button
          className="pa-quickview-btn"
          onClick={handleQuickView}
          variants={{
            hovered: { opacity: 1, y: 0 },
          }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          aria-label="Quick view"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          Quick View
        </motion.button>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="pa-out-of-stock">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Info zone (30%) ───────────────────────────── */}
      <div className="pa-card-info">
        {/* Rating */}
        {product.ratings > 0 && (
          <StarRating rating={product.ratings} count={product.total_reviews} />
        )}

        {/* Name */}
        <h3 className="pa-card-name">{product.name}</h3>

        {/* Botanical name */}
        {botanical && (
          <p className="pa-card-botanical">{botanical}</p>
        )}

        {/* Benefit tags */}
        {benefits.length > 0 && (
          <div className="pa-benefit-tags">
            {benefits.map((b) => (
              <span key={b} className="pa-benefit-tag">{b}</span>
            ))}
          </div>
        )}

        {/* Price row */}
        <div className="pa-price-row">
          {isVariable ? (
            <span className="pa-price">{minPrice} – {maxPrice}</span>
          ) : (
            <>
              <span className="pa-price">{price}</span>
              {basePrice && <del className="pa-base-price">{basePrice}</del>}
            </>
          )}
          {product.unit && (
            <span className="pa-unit">/ {product.unit}</span>
          )}
        </div>

        {/* CTA */}
        <motion.div
          className="pa-cta-wrap"
          variants={{ hovered: { y: 0, opacity: 1 } }}
          initial={{ y: 4, opacity: 0.85 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {inStock ? (
            <AddToCart
              variant="argon"
              data={product}
              counterClass="pa-counter"
            />
          ) : (
            <button className="pa-card-atc pa-card-atc--disabled" disabled>
              Notify Me
            </button>
          )}
        </motion.div>
      </div>
    </motion.article>
  );
};

export default PlantAtHomeCard;
