'use client';
import React from 'react';
import Link from 'next/link';
import { Star, Heart, Plus, Check } from 'lucide-react';
import { useAtom } from 'jotai';
import usePrice from '@/lib/use-price';
import { cn } from '@/lib/cn';
import { PLACEHOLDER } from './_img';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { useToggleWishlist } from '@/framework/wishlist';
import { authorizationAtom } from '@/store/authorization-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';
import type { Product } from '@/types';

function imgOf(p: Product): string {
  return p?.image?.original || p?.image?.thumbnail || PLACEHOLDER;
}

/** Top-left badge: discount % (priority) → Best Seller tag → flash deal. */
function topBadge(p: Product, discount: string | null) {
  if (discount) return { label: `${discount} OFF`, cls: 'bg-offer text-white' };
  const tag = (p?.tags || []).find((t) =>
    /best.?sell|editor|new.?arriv|trend/i.test(`${t?.slug} ${t?.name}`),
  );
  if (tag) return { label: tag.name, cls: 'bg-brand text-white' };
  if ((p as any)?.in_flash_sale) return { label: 'Flash Deal', cls: 'bg-offer text-white' };
  return null;
}

/** Plant care sub-label (e.g. "Low light • Easy care"). */
function careSub(p: Product): string | null {
  const a = p?.plant_attribute;
  if (!a) return null;
  const bits: string[] = [];
  if (a.sunlight) bits.push(String(a.sunlight).split(/[,/]/)[0].trim());
  if (a.water_requirement) bits.push(`${String(a.water_requirement).split(/[,/]/)[0].trim()} water`);
  if (!bits.length && a.air_purifying) bits.push('Air purifying');
  if (!bits.length && a.pet_friendly) bits.push('Pet friendly');
  return bits.slice(0, 2).join(' • ') || null;
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItemToCart, isInCart } = useCart();
  const [authorized] = useAtom(authorizationAtom);
  const { openModal } = useModalAction();
  const { toggleWishlist, isLoading: wlLoading } = useToggleWishlist(product?.id);
  const [wished, setWished] = React.useState<boolean>(Boolean((product as any)?.in_wishlist));
  const [imgErr, setImgErr] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

  const isVariable = `${(product as any)?.product_type}`.toLowerCase() === 'variable';
  const outOfStock = Number(product?.quantity) <= 0 && !isVariable;
  const hasSale = Boolean(product?.sale_price && product.sale_price < product.price);

  const base = isVariable ? product?.min_price ?? product?.price : product?.price;
  const amount = isVariable
    ? product?.min_price ?? product?.price
    : hasSale
    ? (product?.sale_price as number)
    : product?.price;
  const { price, basePrice, discount } = usePrice({
    amount: Number(amount) || 0,
    baseAmount: hasSale ? Number(base) : undefined,
  });

  const rating = Number((product as any)?.ratings) || 0;
  const reviews = Number((product as any)?.total_reviews) || 0;
  const badge = topBadge(product, hasSale ? discount : null);
  const sub = careSub(product);
  const inCart = isInCart(product?.id);

  function onWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!authorized) return openModal('LOGIN_VIEW');
    setWished((v) => !v);
    toggleWishlist();
  }

  function onQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const item = generateCartItem(product as any, {} as any);
    addItemToCart(item, 1);
    setJustAdded(true);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('pah-cart-bump'));
    setTimeout(() => setJustAdded(false), 1100);
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-line2 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-30px_rgba(11,53,33,0.45)]',
        className,
      )}
    >
      <Link href={`/products/${product?.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-brand-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgErr ? PLACEHOLDER : imgOf(product)}
          alt={product?.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
        />

        {badge ? (
          <span className={cn('absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide', badge.cls)}>
            {badge.label}
          </span>
        ) : null}

        <button
          type="button"
          onClick={onWishlist}
          disabled={wlLoading}
          aria-label="Add to wishlist"
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-brand-900 shadow-sm backdrop-blur transition hover:bg-white active:scale-90"
        >
          <Heart className={cn('h-[17px] w-[17px]', wished && 'fill-offer text-offer')} strokeWidth={2} />
        </button>

        {outOfStock ? (
          <div className="absolute inset-0 grid place-items-center bg-white/55">
            <span className="rounded-full bg-brand-900/85 px-3 py-1 text-[11px] font-semibold text-white">Out of stock</span>
          </div>
        ) : null}

        {/* quick add (simple) / select (variable) */}
        {!outOfStock ? (
          isVariable ? (
            <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-brand shadow-md ring-1 ring-line2">
              Select
            </span>
          ) : (
            <button
              type="button"
              onClick={onQuickAdd}
              aria-label="Add to cart"
              className={cn(
                'absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full text-white shadow-md transition active:scale-90',
                justAdded || inCart ? 'bg-brand' : 'bg-cta hover:bg-cta-600',
              )}
            >
              {justAdded || inCart ? <Check className="h-[18px] w-[18px]" strokeWidth={2.6} /> : <Plus className="h-[19px] w-[19px]" strokeWidth={2.6} />}
            </button>
          )
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product?.slug}`} className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-brand-900 hover:text-brand">
          {product?.name}
        </Link>
        {sub ? <p className="mt-0.5 line-clamp-1 text-[11.5px] text-stone-500">{sub}</p> : null}

        <div className="mt-1.5 flex items-center gap-2">
          {reviews > 0 ? (
            <span className="inline-flex items-center gap-1 rounded bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">
              {rating.toFixed(1)} <Star className="h-3 w-3 fill-white" strokeWidth={0} />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand">
              New
            </span>
          )}
          {reviews > 0 ? <span className="text-[11px] text-stone-500">({reviews})</span> : null}
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 pt-2">
          {isVariable ? <span className="text-[11px] text-stone-500">from</span> : null}
          <span className="text-[15px] font-extrabold text-brand-900">{price}</span>
          {hasSale && basePrice ? <span className="text-[12px] text-stone-400 line-through">{basePrice}</span> : null}
          {hasSale && discount ? <span className="text-[11.5px] font-bold text-offer">{discount} off</span> : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
