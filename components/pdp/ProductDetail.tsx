'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePdp } from '@/lib/hooks/usePdp';
import { formatMoney } from '@/lib/money';
import { useSession } from '@/lib/store/session';
import { useDrawer } from '@/lib/store/drawer';
import { useCartSnaps } from '@/lib/store/cart-snapshots';
import { ProductRail } from '@/components/products/ProductRail';
import type { Product } from '@/lib/api/types';

function Stars() {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#B58E39"><path d="m12 2 3 6.5 7 .8-5 4.7 1.3 7L12 17.8 5.4 21l1.3-7-5-4.7 7-.8L12 2Z" /></svg>
      ))}
    </span>
  );
}

function Accordion({ product }: { product: Product }) {
  const items: { title: string; body: React.ReactNode }[] = [];
  if (product.description) items.push({ title: 'Description', body: <p className="leading-relaxed">{product.description}</p> });
  const care = product.care as Record<string, unknown> | null | undefined;
  if (care && typeof care === 'object' && Object.keys(care).length) {
    items.push({
      title: 'Plant care',
      body: (
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(care).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-kraft-300/60 py-1.5">
              <dt className="capitalize text-forest-ink/60">{k.replace(/_/g, ' ')}</dt>
              <dd className="font-medium text-forest-ink">{String(v)}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  }
  items.push({
    title: 'Shipping & returns',
    body: <p className="leading-relaxed">Insulated, water-locked packaging keeps roots happy in transit. Free delivery over ₹999. 30-day plant guarantee — if it doesn’t thrive, we replace it free.</p>,
  });

  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-12 divide-y divide-kraft-300/70 border-y border-kraft-300/70">
      {items.map((it, i) => (
        <div key={it.title}>
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-4 text-left">
            <span className="font-heading text-xl font-semibold text-forest-ink">{it.title}</span>
            <span className="text-clay">{open === i ? '−' : '+'}</span>
          </button>
          <div className={`grid transition-all ${open === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden text-sm text-forest-ink/75">{it.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const pdp = usePdp(product);
  const cityName = useSession((s) => s.cityName);
  const openCart = useDrawer((s) => s.openCart);
  const bump = useDrawer((s) => s.bump);
  const recordSnap = useCartSnaps((s) => s.record);

  const media = product.media ?? [];
  const [activeImg, setActiveImg] = useState(0);
  const mainImg = media[activeImg]?.url;
  const selectedVariant = pdp.variants.find((v) => v.uuid === pdp.variantUuid);

  function onAdd() {
    pdp.add.mutate(undefined, {
      onSuccess: (res) => {
        if (res !== 'added') return; // null = redirected to login for anon
        if (pdp.variantUuid) {
          recordSnap(pdp.variantUuid, {
            name: product.name,
            image: media[0]?.url ?? null,
            slug: product.uuid,
            size: selectedVariant?.size_code ?? selectedVariant?.name ?? null,
          });
        }
        bump();
        openCart();
        toast.success(`${product.name} added to cart`);
      },
      onError: (e) => toast.error((e as Error)?.message ?? 'Could not add to cart'),
    });
  }

  return (
    <article className="pb-32 lg:pb-16">
      <div className="container-wide pt-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-forest-ink/60">
          <Link href="/" className="hover:text-forest">Home</Link>
          <span>/</span>
          {product.category?.slug && (
            <>
              <Link href={`/c/${product.category.slug}`} className="hover:text-forest">{product.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="font-medium text-clay">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="flex gap-4">
            {media.length > 1 && (
              <div className="flex flex-col gap-3">
                {media.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-16 overflow-hidden rounded-2xl border-2 transition ${i === activeImg ? 'border-forest-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="pa-card-art relative aspect-square flex-1 overflow-hidden rounded-3xl">
              {mainImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImg} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-cormorant text-6xl text-forest-accent/30">🌿</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              {product.category?.name && <p className="text-xs font-semibold uppercase tracking-wide text-forest-accent">{product.category.name}</p>}
              <h1 className="font-pahserif text-[clamp(2.2rem,1.6rem+2vw,3.2rem)] font-semibold leading-tight text-forest-900">{product.name}</h1>
              {product.botanical_name && <p className="font-cormorant text-lg italic text-stone-500">{product.botanical_name}</p>}
              {product.hindi_name && <p className="text-forest-ink/70">{product.hindi_name}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Stars />
              <span className="text-sm text-forest-ink/60">Loved by plant parents</span>
            </div>

            {/* Variant chips */}
            {pdp.variants.length > 1 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-forest-900">Size</p>
                <div className="flex flex-wrap gap-2">
                  {pdp.variants.map((v) => (
                    <button
                      key={v.uuid}
                      onClick={() => pdp.setVariant(v.uuid)}
                      className={`min-w-[3.25rem] rounded-full border px-5 py-2 text-sm transition ${pdp.variantUuid === v.uuid ? 'border-forest-700 bg-forest-700 text-white' : 'border-kraft-300 text-forest-900 hover:border-forest-500'}`}
                    >
                      {v.name || v.size_code || 'Standard'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* City / config / price / add */}
            {!pdp.city ? (
              <div className="rounded-2xl border border-forest-accent/30 bg-forest-soft/50 p-4 text-sm text-forest-ink/80">
                Choose your <b>city</b> (top bar) to see the price and delivery.
              </div>
            ) : pdp.configLoading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-forest-soft/60" />
            ) : !pdp.nursery ? (
              <div className="rounded-2xl border border-clay/30 bg-clay/5 p-4 text-sm text-clay">
                Sorry — no nursery delivers this to {cityName ?? 'your city'} yet.
              </div>
            ) : (
              <>
                {pdp.config?.groups.map((g) => {
                  const err = pdp.violations.find((v) => v.group === g.code);
                  return (
                    <div key={g.uuid}>
                      <p className="mb-2 text-sm font-semibold text-forest-900">{g.name}{g.required && <span className="text-clay"> *</span>}</p>
                      <div className="flex flex-wrap gap-2">
                        {g.options.map((o) => {
                          const selected = (pdp.selection[g.code] ?? []).includes(o.uuid);
                          return (
                            <button
                              key={o.uuid}
                              disabled={o.in_stock === false}
                              onClick={() => pdp.toggleOption(g, o.uuid)}
                              className={`rounded-full border px-4 py-1.5 text-sm transition disabled:opacity-40 ${selected ? 'border-forest-accent bg-forest-soft text-forest' : 'border-forest/20 text-forest-ink/80 hover:border-forest/40'}`}
                            >
                              {o.name}
                              {o.price && o.price.amount_minor > 0 && <span className="ml-1.5 text-forest-ink/50">+{formatMoney(o.price)}</span>}
                            </button>
                          );
                        })}
                      </div>
                      {err && <p className="mt-1 text-xs text-clay">{err.message}</p>}
                    </div>
                  );
                })}

                <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm text-forest-ink/60">Price</span>
                  <span className="text-3xl font-bold text-forest-900" data-testid="pdp-price">{pdp.quote ? formatMoney(pdp.quote.total) : '—'}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-kraft-300">
                    <button onClick={() => pdp.setQty(Math.max(1, pdp.qty - 1))} className="h-10 w-10 text-forest" aria-label="Decrease quantity">−</button>
                    <span className="w-10 text-center text-sm font-semibold">{String(pdp.qty).padStart(2, '0')}</span>
                    <button onClick={() => pdp.setQty(pdp.qty + 1)} className="h-10 w-10 text-forest" aria-label="Increase quantity">+</button>
                  </div>
                  <button
                    onClick={onAdd}
                    disabled={pdp.add.isPending || !pdp.quote}
                    className="flex-1 rounded-full bg-ds-btn px-7 py-3.5 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(46,94,42,0.65)] transition hover:bg-ds-btn-hover disabled:bg-stone-300"
                    data-testid="add-to-cart"
                  >
                    {pdp.add.isPending ? 'Adding…' : 'Add to cart'}
                  </button>
                </div>

                <p className="flex items-center gap-2 text-sm text-forest-ink/60">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-forest-accent"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.5" /></svg>
                  Delivered thriving to {cityName} · same-day metro delivery
                </p>
              </>
            )}
          </div>
        </div>

        <Accordion product={product} />
      </div>

      {/* Related */}
      {product.category?.uuid && (
        <ProductRail title="You may also like" eyebrow="More from this collection" categoryUuids={[product.category.uuid]} limit={4} />
      )}

      {/* Sticky mobile add bar */}
      {pdp.nursery && pdp.quote && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-forest/10 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="truncate text-sm font-medium text-forest-ink">{product.name}</p>
              <p className="text-lg font-bold text-forest-900">{formatMoney(pdp.quote.total)}</p>
            </div>
            <button onClick={onAdd} disabled={pdp.add.isPending} className="rounded-full bg-ds-btn px-6 py-3 font-semibold text-white disabled:bg-stone-300">
              {pdp.add.isPending ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
