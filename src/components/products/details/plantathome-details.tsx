'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { Routes } from '@/config/routes';
import type { Product } from '@/types';
import usePrice from '@/lib/use-price';
import Truncate from '@/components/ui/truncate';
import { useSanitizeContent } from '@/lib/sanitize-content';
import { displayImage } from '@/lib/display-product-preview-images';
import { getVariations } from '@/lib/get-variations';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useAttributes } from './attributes.context';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { cartAnimation } from '@/lib/cart-animation';
import PlantAtHomeGallery from './plantathome/gallery';
import TrustBar from './plantathome/trust-bar';
import SizeGuide from './plantathome/size-guide';

/* ── inline icons ───────────────────────────────────────────────── */
const Bag = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const StarSm = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
  </svg>
);
const Chevron = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);
const X = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
);
const Leaf = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
);
const Paw = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="1.8" /><circle cx="18" cy="8" r="1.8" /><circle cx="5" cy="9" r="1.8" /><path d="M8.5 14a3.5 3.5 0 0 1 7 0c0 1.5-1 2-1 3.5a2.5 2.5 0 0 1-5 0c0-1.5-1-2-1-3.5z" /></svg>
);
const Droplet = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
);
const Sprout = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10M12 20V8M12 8a4 4 0 0 0-4-4H5v1a4 4 0 0 0 4 4h3zM12 11a4 4 0 0 1 4-4h3v1a4 4 0 0 1-4 4h-3z" /></svg>
);

const FEATURES = [
  { label: 'Air Purifying', icon: Leaf },
  { label: 'Pet Friendly', icon: Paw },
  { label: 'Easy Care', icon: Droplet },
  { label: 'Fast Growing', icon: Sprout },
];

const SIZE_DIMS: Record<string, string> = {
  Small: '12-18 inches',
  Medium: '24-30 inches',
  Large: '36-48 inches',
  XL: '60+ inches',
  'Extra Large': '60+ inches',
};
const DEFAULT_SIZES = [
  { value: 'Small', dim: '12-18 inches' },
  { value: 'Medium', dim: '24-30 inches' },
  { value: 'Large', dim: '36-48 inches' },
  { value: 'XL', dim: '60+ inches' },
];
const DEFAULT_POTS = [
  { value: 'Ivory White', hex: '#F1ECE0' },
  { value: 'Sage Green', hex: '#8AA886' },
  { value: 'Matte Black', hex: '#2B2B2B' },
  { value: 'Stone Grey', hex: '#9D9D95' },
  { value: 'Sand Beige', hex: '#D8C29C' },
];

const isColorGroup = (name: string, options: any[]) =>
  name.toLowerCase().includes('color') ||
  name.toLowerCase().includes('colour') ||
  name.toLowerCase().includes('pot') ||
  options?.some((o) => typeof o?.meta === 'string' && /^#|rgb/.test(o.meta));

type Props = { product: Product; isModal?: boolean };

const PlantAtHomeProductDetails: React.FC<Props> = ({ product, isModal = false }) => {
  const router = useRouter();
  const { closeModal } = useModalAction();
  const { attributes, setAttributes } = useAttributes();

  const {
    id, name, description, gallery, image, type, categories,
    quantity, slug, ratings, product_type, total_reviews, scientific_name,
  } = (product ?? {}) as any;

  const variations = useMemo(
    () => (product_type?.toLowerCase() === 'variable' ? getVariations(product?.variations) : {}),
    [product?.variations, product_type],
  );
  const hasVariations = !isEmpty(variations) && product_type?.toLowerCase() === 'variable';
  const isSelected = isVariationSelected(variations, attributes);

  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(o.options.map((v: any) => v.value).sort(), Object.values(attributes).sort()),
    );
  }

  const priceSource: any = hasVariations && isSelected ? selectedVariation : product;
  const { price, basePrice, discount } = usePrice({
    amount: priceSource?.sale_price ? priceSource.sale_price : priceSource?.price ?? 0,
    baseAmount: priceSource?.price ?? 0,
  });

  const previewImages = displayImage(selectedVariation?.image, gallery, image);
  const content = useSanitizeContent({ description });

  const availableQty = hasVariations && isSelected ? Number(selectedVariation?.quantity) : Number(quantity);
  const inStock = availableQty > 0 && !(selectedVariation?.is_disable);
  const needsSelection = hasVariations && !isSelected;

  /* real variation groups mapped to the mockup's Size / Pot selectors */
  const groupNames = Object.keys(variations);
  const potGroup = groupNames.find((g) => isColorGroup(g, variations[g] as any[]));
  const sizeGroup = groupNames.find((g) => g !== potGroup);

  const sizeOptions =
    sizeGroup && (variations[sizeGroup] as any[])?.length
      ? (variations[sizeGroup] as any[]).map((o) => ({ value: o.value, dim: SIZE_DIMS[o.value] ?? '', real: true }))
      : DEFAULT_SIZES.map((s) => ({ ...s, real: false }));
  const potOptions =
    potGroup && (variations[potGroup] as any[])?.length
      ? (variations[potGroup] as any[]).map((o) => ({ value: o.value, hex: o.meta || '#8AA886', real: true }))
      : DEFAULT_POTS.map((p) => ({ ...p, real: false }));

  const [sizeSel, setSizeSel] = useState(
    Math.max(0, sizeOptions.findIndex((s) => s.value === 'Large')),
  );
  const [potSel, setPotSel] = useState(
    Math.max(0, potOptions.findIndex((p) => p.value === 'Sage Green')),
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const pickSize = (i: number) => {
    setSizeSel(i);
    if (sizeGroup && sizeOptions[i]?.real) setAttributes((p: any) => ({ ...p, [sizeGroup]: sizeOptions[i].value }));
  };
  const pickPot = (i: number) => {
    setPotSel(i);
    if (potGroup && potOptions[i]?.real) setAttributes((p: any) => ({ ...p, [potGroup]: potOptions[i].value }));
  };

  /* cart */
  const { addItemToCart, updateCartLanguage, language } = useCart();
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!inStock || needsSelection) return;
    const item = generateCartItem(product as any, selectedVariation);
    if (item?.language && item.language !== language) updateCartLanguage(item.language);
    addItemToCart(item, 1);
    cartAnimation(e as any);
  };
  const buyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (needsSelection) return;
    handleAdd(e);
    router.push('/checkout');
    closeModal();
  };

  const ratingVal = Number(ratings) || 4.8;
  const ratingInt = Math.round(ratingVal);
  const reviewCount = Number(total_reviews) > 0 ? Number(total_reviews).toLocaleString('en-IN') : '1,284';

  const firstCat = categories?.[0];
  const crumbs: { label: string; href?: string }[] = [
    { label: 'Home', href: Routes.home },
    { label: type?.name ?? 'Plants', href: type?.slug ? `/${type.slug}` : Routes.home },
    ...(firstCat ? [{ label: firstCat.name, href: `/${type?.slug}/search?category=${firstCat.slug}` }] : []),
    { label: name },
  ];

  /* ── buy box (shared between modal + page layouts) ── */
  const buyBox = (
    <div className="flex flex-col">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-forest-600/30 bg-forest-600/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-forest-700">
        <Leaf className="h-3.5 w-3.5" /> Best Seller
      </span>

      <h1
        className={classNames(
          'font-poppins mt-3 text-[1.6rem] font-bold leading-[1.06] tracking-[-0.01em] text-forest-900 sm:mt-4 sm:text-[2.2rem] lg:text-[2.7rem]',
          { 'cursor-pointer transition-colors hover:text-forest-700': isModal },
        )}
        {...(isModal && { onClick: () => { router.push(Routes.product(slug)); closeModal(); } })}
      >
        {name}
      </h1>

      <p className="font-caveat mt-0.5 text-[1.5rem] font-medium leading-none text-forest-600 sm:text-[1.8rem]">
        {scientific_name || 'Brings nature home'}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarSm key={i} className={`h-[18px] w-[18px] ${i < ratingInt ? 'text-[#F5B400]' : 'text-stone-300'}`} />
          ))}
        </div>
        <span className="text-[14px] font-medium text-stone-600">
          {ratingVal.toFixed(1)} ({reviewCount} Reviews)
        </span>
      </div>

      {content && (
        <div className="react-editor-description mt-4 max-w-md text-[14px] leading-7 text-stone-500">
          <Truncate character={140}>{content}</Truncate>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="font-poppins text-[2rem] font-bold leading-none text-forest-700">{price}</span>
        {basePrice && <del className="text-[1.1rem] text-stone-400">{basePrice}</del>}
        {discount && (
          <span className="rounded-full bg-forest-600/12 px-3 py-1.5 text-[13px] font-semibold text-forest-700">
            {discount} OFF
          </span>
        )}
      </div>

      <div className="mt-5 grid max-w-md grid-cols-4 gap-2">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-1.5 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-100 text-forest-700">
              <f.icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-medium leading-tight text-stone-600">{f.label}</span>
          </div>
        ))}
      </div>

      {/* CHOOSE SIZE */}
      <div className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-forest-900">Choose Size</p>
          <button type="button" onClick={() => setSizeGuideOpen(true)} className="inline-flex items-center gap-1 text-[12px] font-medium text-forest-600 hover:text-forest-700">
            <Leaf className="h-3.5 w-3.5" /> Size Guide
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {sizeOptions.map((s, i) => {
            const on = sizeSel === i;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => pickSize(i)}
                className={classNames(
                  'relative rounded-xl border px-2 py-2.5 text-center transition',
                  on ? 'border-forest-600 bg-forest-600/[0.06]' : 'border-kraft-300 hover:border-forest-500',
                )}
              >
                {on && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-forest-600 text-white">
                    <Check />
                  </span>
                )}
                <span className="block text-[13px] font-semibold text-forest-900">{s.value}</span>
                <span className="mt-0.5 block text-[10.5px] text-stone-500">{s.dim}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHOOSE POT */}
      <div className="mt-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-forest-900">Choose Pot</p>
        <div className="flex flex-wrap gap-4">
          {potOptions.map((p, i) => {
            const on = potSel === i;
            return (
              <button key={p.value} type="button" onClick={() => pickPot(i)} className="flex flex-col items-center gap-1.5" aria-label={p.value}>
                <span className={classNames('grid h-11 w-11 place-items-center rounded-full transition', on ? 'ring-2 ring-forest-600 ring-offset-2 ring-offset-[#FAF8F2]' : 'ring-1 ring-black/5')}>
                  <span className="h-9 w-9 rounded-full border border-black/10" style={{ backgroundColor: (p as any).hex }} />
                </span>
                <span className={classNames('text-[10.5px] leading-tight', on ? 'font-semibold text-forest-800' : 'text-stone-500')}>{p.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock || needsSelection}
          className={classNames(
            'flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white transition',
            !inStock || needsSelection ? 'cursor-not-allowed bg-stone-300' : 'bg-forest-700 shadow-[0_14px_30px_-12px_rgba(46,94,42,0.6)] hover:bg-forest-800',
          )}
        >
          {!inStock ? 'Out of Stock' : 'Add to Cart'} <Bag className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={buyNow}
          disabled={needsSelection}
          className="flex items-center justify-center gap-2 rounded-xl border border-forest-700 bg-white px-6 py-3.5 text-[15px] font-semibold text-forest-700 transition hover:bg-forest-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now <Bag className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );

  const galleryEl = <PlantAtHomeGallery gallery={previewImages} productName={name} />;

  return (
    <article className="bg-[#FAF8F2]">
      {/* breadcrumb (in container) */}
      {!isModal && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-[14px]">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={i} className="flex items-center gap-2">
                  {c.href && !last ? (
                    <Link href={c.href} className="text-forest-800/70 transition hover:text-forest-900">{c.label}</Link>
                  ) : (
                    <span className={last ? 'font-medium text-forest-700' : 'text-forest-800/70'}>{c.label}</span>
                  )}
                  {!last && <span className="text-forest-800/35"><Chevron /></span>}
                </span>
              );
            })}
          </nav>
        </div>
      )}

      {/* hero */}
      {isModal ? (
        <div className="grid gap-6 px-4 pb-4 pt-4 sm:px-6 lg:grid-cols-2">
          <div className="relative min-h-[360px]">{galleryEl}</div>
          <div>{buyBox}</div>
        </div>
      ) : (
        <div className="mt-4 grid lg:grid-cols-[1.08fr_1fr] lg:items-stretch">
          {/* image — bleeds to the LEFT page edge */}
          <div className="relative">{galleryEl}</div>
          {/* details — padded, right-aligned to the 1280px container */}
          <div className="flex items-center px-5 py-8 sm:px-8 lg:py-12 lg:pl-12 xl:pr-[calc((100vw-80rem)/2+2rem)]">
            <div className="mx-auto w-full max-w-xl lg:mx-0">{buyBox}</div>
          </div>
        </div>
      )}

      <TrustBar />

      {/* Size Guide modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" aria-label="Close size guide" onClick={() => setSizeGuideOpen(false)} className="absolute inset-0 cursor-default bg-forest-900/40 backdrop-blur-sm" />
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-[#FAF8F2] p-6 shadow-[0_30px_80px_-30px_rgba(34,48,26,0.5)] sm:p-8">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-forest-900 shadow-sm transition hover:bg-cream-100"
            >
              <X />
            </button>
            <SizeGuide product={product} />
          </div>
        </div>
      )}
    </article>
  );
};

export default PlantAtHomeProductDetails;
