'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { useQuery } from 'react-query';
import { Routes } from '@/config/routes';
import type { Product } from '@/types';
import usePrice from '@/lib/use-price';
import { HttpClient } from '@/framework/client/http-client';
import { getStoredLatLng, getStoredCity } from '@/lib/customer-location';
import VendorAvailabilityNote from '@/components/products/details/vendor-availability-note';
import Truncate from '@/components/ui/truncate';
import { useSanitizeContent } from '@/lib/sanitize-content';
import { displayImage } from '@/lib/display-product-preview-images';
import { getVariations } from '@/lib/get-variations';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useAttributes } from './attributes.context';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useUser } from '@/framework/user';
import { useAskAiEnabled } from '@/framework/ask-ai';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { cartAnimation } from '@/lib/cart-animation';
import PlantAtHomeGallery from './plantathome/gallery';
import PlantAtHomeAccordion, { AccordionItem } from './plantathome/accordion';

/* ── small inline icons ─────────────────────────────────────────── */
const Star = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
  </svg>
);
const Bag = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const Spark = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z" />
  </svg>
);
const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);

/* ── badge from tags / flash sale ───────────────────────────────── */
function getBadge(product: Product): string | null {
  if ((product as any)?.in_flash_sale) return 'Sale';
  const tags = (product as any)?.tags ?? [];
  for (const t of tags) {
    const k = (t?.slug ?? t?.name ?? '').toLowerCase();
    if (k.includes('best')) return 'Hot';
    if (k.includes('new')) return 'New';
    if (k.includes('editor')) return "Editor's Pick";
  }
  return null;
}

const isColorGroup = (name: string, options: any[]) =>
  name.toLowerCase().includes('color') ||
  name.toLowerCase().includes('colour') ||
  options?.some((o) => typeof o?.meta === 'string' && /^#|rgb/.test(o.meta));

type Props = { product: Product; isModal?: boolean };

const PlantAtHomeProductDetails: React.FC<Props> = ({ product, isModal = false }) => {
  const router = useRouter();
  const { closeModal, openModal } = useModalAction();
  const { attributes, setAttributes } = useAttributes();
  const { isAuthorized } = useUser();
  const { data: askAiSettings } = useAskAiEnabled();
  const askAiEnabled = Boolean(askAiSettings?.data?.enabled);

  const {
    id, name, description, gallery, image, type, categories,
    quantity, slug, ratings, product_type, total_reviews,
  } = (product ?? {}) as any;

  const [qty, setQty] = useState(1);

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
  const { price: minPrice } = usePrice({ amount: product?.min_price ?? 0 });
  const { price: maxPrice } = usePrice({ amount: product?.max_price ?? 0 });

  // Location-derived selling price (margin over the nearest vendor's hidden cost).
  // Only overrides the displayed price when this product actually has a vendor
  // cost sheet — otherwise the catalog price above is shown unchanged.
  const loc = getStoredLatLng();
  const customerCity = getStoredCity();
  const { data: vendorPriceData } = useQuery(
    ['location-price', id, isSelected ? selectedVariation?.id : null, loc?.lat, loc?.lng, customerCity],
    () =>
      HttpClient.get<any>('location-price', {
        product_id: id,
        ...(isSelected && selectedVariation?.id ? { variation_option_id: selectedVariation.id } : {}),
        ...(loc ? { lat: loc.lat, lng: loc.lng } : {}),
        ...(customerCity ? { city: customerCity } : {}),
      }),
    { enabled: !!id, retry: 0, staleTime: 60_000 },
  );
  const fulfillment = vendorPriceData?.fulfillment as
    | { fulfillment_mode?: 'local' | 'courier'; eta_days?: number }
    | null
    | undefined;
  const { price: vendorPrice } = usePrice({ amount: Number(vendorPriceData?.price ?? 0) });
  const useVendorPrice = Boolean(vendorPriceData?.has_vendor_cost && vendorPriceData?.available);
  const displayPrice = useVendorPrice ? vendorPrice : price;
  const displayBasePrice = useVendorPrice ? null : basePrice;

  const previewImages = displayImage(selectedVariation?.image, gallery, image);
  const content = useSanitizeContent({ description });
  const badge = getBadge(product);

  const availableQty = hasVariations && isSelected ? Number(selectedVariation?.quantity) : Number(quantity);
  const inStock = availableQty > 0 && !(selectedVariation?.is_disable);
  const needsSelection = hasVariations && !isSelected;

  /* cart */
  const { addItemToCart, updateCartLanguage, language } = useCart();
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!inStock || needsSelection) return;
    const item = generateCartItem(product as any, selectedVariation);
    if (item?.language && item.language !== language) updateCartLanguage(item.language);
    addItemToCart(item, qty);
    cartAnimation(e as any);
  };

  const navigate = (path: string) => { router.push(path); closeModal(); };
  const onAskAi = () => (isAuthorized ? openModal('ASK_AI', { product }) : openModal('LOGIN_VIEW'));

  const ratingInt = Math.round(Number(ratings) || 5);
  const trustCount = Number(total_reviews) > 0 ? `${total_reviews}` : '12,000+';

  /* breadcrumb crumbs */
  const firstCat = categories?.[0];
  const crumbs: { label: string; href?: string }[] = [
    { label: 'Home', href: Routes.home },
    { label: type?.name ?? 'Shop', href: type?.slug ? `/${type.slug}` : Routes.home },
    ...(firstCat ? [{ label: firstCat.name, href: `/${type?.slug}/search?category=${firstCat.slug}` }] : [{ label: 'All Products', href: type?.slug ? `/${type.slug}` : Routes.home }]),
    { label: name },
  ];

  /* accordion */
  const pa = (product as any)?.plant_attribute;
  const careSpecs: { label: string; value?: string | null }[] = pa
    ? [
        { label: 'Sunlight', value: pa.sunlight },
        { label: 'Water', value: pa.water_requirement },
        { label: 'Temperature', value: pa.temperature_range ? `${pa.temperature_range} °C` : null },
        { label: 'Placement', value: pa.indoor_outdoor },
        { label: 'Height', value: pa.height_range },
        { label: 'Growth rate', value: pa.growth_rate },
        { label: 'Native region', value: pa.native_region },
      ].filter((s) => s.value)
    : [];

  const accordionItems: AccordionItem[] = [];
  if (content) {
    accordionItems.push({
      title: 'Description',
      content: <div className="react-editor-description" dangerouslySetInnerHTML={{ __html: content }} />,
    });
  }
  if (careSpecs.length) {
    accordionItems.push({
      title: 'Plant Care',
      content: (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {careSpecs.map((s) => (
            <div key={s.label} className="flex justify-between gap-4 border-b border-kraft-200/60 py-1.5 last:border-0">
              <dt className="text-forest-800">{s.label}</dt>
              <dd className="text-right font-medium text-stone-700">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  }
  accordionItems.push({
    title: 'Size Guide',
    content: <p>We recommend choosing the larger size for a relaxed, comfortable fit and easy repotting room.</p>,
  });
  accordionItems.push({
    title: 'Shipping Information',
    content: <p>Carefully hand-packed and dispatched within 24–48 hours. Same-day delivery available in select cities. Every plant ships with a 30-day healthy-arrival guarantee.</p>,
  });

  return (
    <article className="bg-cream-100">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-10">
        {/* breadcrumb */}
        {!isModal && (
          <>
            <nav className="flex flex-wrap items-center gap-2 text-[15px]">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <span key={i} className="flex items-center gap-2">
                    {c.href && !last ? (
                      <Link href={c.href} className="text-forest-800/80 transition hover:text-forest-900">{c.label}</Link>
                    ) : (
                      <span className={last ? 'font-medium text-clay-600' : 'text-forest-800/80'}>{c.label}</span>
                    )}
                    {!last && <span className="text-forest-800/40"><Chevron /></span>}
                  </span>
                );
              })}
            </nav>
            <div className="mt-5 h-px w-full bg-kraft-300/70" />
          </>
        )}

        {/* main grid */}
        <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <PlantAtHomeGallery gallery={previewImages} productId={id} productName={name} badge={badge} />

          {/* info panel */}
          <div className="flex flex-col">
            <h1
              className={classNames(
                'font-cormorant text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-forest-900 sm:text-[3rem]',
                { 'cursor-pointer transition-colors hover:text-forest-700': isModal },
              )}
              {...(isModal && { onClick: () => navigate(Routes.product(slug)) })}
            >
              {name}
            </h1>

            {/* rating row */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`grid h-[22px] w-[22px] place-items-center rounded-[5px] ${i < ratingInt ? 'bg-forest-600' : 'bg-forest-600/25'}`}>
                    <Star className="h-3 w-3 text-white" />
                  </span>
                ))}
              </div>
              <span className="text-[15px] text-stone-500">Loved by {trustCount}+ plant parents</span>
            </div>

            {/* price row */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-base text-forest-900/90">Sale price:</span>
              {needsSelection ? (
                <span className="text-2xl font-bold text-forest-900">{minPrice} – {maxPrice}</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-forest-900">{displayPrice}</span>
                  {displayBasePrice && <del className="text-lg text-stone-400">{displayBasePrice}</del>}
                  {!useVendorPrice && discount && <span className="text-lg font-semibold text-clay-600">{discount} Discount</span>}
                </>
              )}
            </div>

            <div className="mt-5 h-px w-full bg-kraft-300/70" />

            {/* description */}
            {content && (
              <div className="mt-5 react-editor-description text-[15px] leading-7 text-stone-600">
                <Truncate character={180}>{content}</Truncate>
              </div>
            )}

            <div className="mt-5 h-px w-full bg-kraft-300/70" />

            {/* variation pickers */}
            {hasVariations &&
              Object.keys(variations).map((groupName) => {
                const options = variations[groupName] as any[];
                const color = isColorGroup(groupName, options);
                const selected = attributes[groupName];
                return (
                  <div key={groupName} className="mt-6">
                    <p className="mb-3 text-base font-semibold capitalize text-forest-900">
                      {`Product ${groupName.replace(/-/g, ' ')}`}
                    </p>
                    {color ? (
                      <div className="flex flex-wrap items-center gap-3">
                        {options.map((o) => {
                          const active = selected === o.value;
                          return (
                            <button
                              key={o.id}
                              type="button"
                              aria-label={o.value}
                              onClick={() => setAttributes((p: any) => ({ ...p, [groupName]: o.value }))}
                              className={classNames(
                                'grid h-10 w-10 place-items-center rounded-full border-2 transition',
                                active ? 'border-forest-600' : 'border-transparent hover:border-kraft-300',
                              )}
                            >
                              <span className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: o.meta || o.value }} />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {options.map((o) => {
                          const active = selected === o.value;
                          return (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => setAttributes((p: any) => ({ ...p, [groupName]: o.value }))}
                              className={classNames(
                                'min-w-[3.25rem] rounded-full border px-5 py-2 text-sm font-medium transition',
                                active
                                  ? 'border-forest-700 bg-forest-700 text-white'
                                  : 'border-kraft-300 bg-transparent text-forest-900 hover:border-forest-500',
                              )}
                            >
                              {o.value}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

            {/* vendor availability ("we'll confirm within 6h" when cost = 0) */}
            <VendorAvailabilityNote
              productId={id}
              variationOptionId={isSelected ? selectedVariation?.id : null}
            />

            {/* Delivery timing — local same-city vs courier (never names the vendor) */}
            {fulfillment?.eta_days != null && customerCity && (
              <div className="mt-4 flex items-center gap-2 text-sm text-forest-900">
                <span aria-hidden>🚚</span>
                <span>
                  {fulfillment.fulfillment_mode === 'local' ? (
                    <>
                      <span className="font-semibold">Local delivery</span> to {customerCity} in{' '}
                      ~{fulfillment.eta_days} day{fulfillment.eta_days === 1 ? '' : 's'}.
                    </>
                  ) : (
                    <>
                      Ships to {customerCity} by <span className="font-semibold">courier</span> in{' '}
                      ~{fulfillment.eta_days} day{fulfillment.eta_days === 1 ? '' : 's'}.
                    </>
                  )}
                </span>
              </div>
            )}

            {/* quantity + add to cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex items-center justify-between gap-2 rounded-full border border-kraft-300 px-2 py-1.5 sm:w-[140px]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-9 w-9 place-items-center rounded-full text-forest-900 transition hover:bg-cream-100 disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                </button>
                <span className="min-w-[1.5rem] text-center text-base font-semibold text-forest-900">
                  {String(qty).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => (availableQty ? Math.min(availableQty, q + 1) : q + 1))}
                  className="grid h-9 w-9 place-items-center rounded-full text-forest-900 transition hover:bg-cream-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!inStock || needsSelection}
                className={classNames(
                  'flex flex-1 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold text-white transition',
                  !inStock || needsSelection
                    ? 'cursor-not-allowed bg-stone-300'
                    : 'bg-forest-700 shadow-[0_14px_30px_-12px_rgba(46,94,42,0.65)] hover:bg-forest-800',
                )}
              >
                <Bag className="h-5 w-5" />
                {!inStock ? 'Out of Stock' : needsSelection ? 'Select Options' : 'Add to Cart'}
              </button>
            </div>

            {/* Ask AI */}
            {askAiEnabled && (
              <button
                type="button"
                onClick={onAskAi}
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-forest-600/30 bg-white/50 px-4 py-2 text-sm font-semibold text-forest-800 transition hover:border-forest-600 hover:bg-white"
              >
                <Spark className="h-4 w-4 text-clay-600" /> Ask AI about this plant
              </button>
            )}
          </div>
        </div>

        {/* additional information */}
        {accordionItems.length > 0 && (
          <div className="mt-14 grid gap-8 border-t border-kraft-300/70 pt-12 lg:mt-20 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16 lg:pt-16">
            <h2 className="font-cormorant text-[2rem] font-semibold leading-tight text-forest-900 sm:text-[2.5rem]">
              Additional information
            </h2>
            <PlantAtHomeAccordion items={accordionItems} />
          </div>
        )}
      </div>
    </article>
  );
};

export default PlantAtHomeProductDetails;
