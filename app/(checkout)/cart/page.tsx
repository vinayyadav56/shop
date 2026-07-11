'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart, removeCartItem } from '@/lib/api/endpoints';
import { qk } from '@/lib/query-keys';
import { formatMoney } from '@/lib/money';
import { useCartSnaps } from '@/lib/store/cart-snapshots';

const FREE_DELIVERY_MINOR = 99900;

export default function CartPage() {
  const qc = useQueryClient();
  const snaps = useCartSnaps((s) => s.snaps);
  const { data: cart, isLoading } = useQuery({ queryKey: qk.cart, queryFn: getCart });

  const remove = useMutation({
    mutationFn: (itemUuid: string) => removeCartItem(itemUuid),
    onSuccess: (updated) => qc.setQueryData(qk.cart, updated),
  });

  if (isLoading) return <div className="container-wide py-16 text-forest-ink/50">Loading your cart…</div>;

  const items = cart?.items ?? [];
  const subtotalMinor = cart?.grand_total_minor ?? 0;

  if (items.length === 0) {
    return (
      <div className="container-wide py-24 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-forest-soft text-4xl">🌱</div>
        <h1 className="font-pahserif text-4xl font-semibold text-forest-ink">Your cart is empty</h1>
        <p className="mt-2 text-forest-ink/60">Find a plant you love and add it here.</p>
        <Link href="/plants" className="btn-cta mt-6 inline-flex px-7 py-3">Browse plants</Link>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_DELIVERY_MINOR - subtotalMinor);
  const pct = Math.min(100, Math.round((subtotalMinor / FREE_DELIVERY_MINOR) * 100));
  const byNursery = items.reduce<Record<string, typeof items>>((acc, it) => {
    (acc[it.nursery_id] ??= []).push(it);
    return acc;
  }, {});

  return (
    <div className="container-wide grid gap-10 py-10 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <h1 className="font-pahserif text-section font-semibold text-forest-ink">Your cart</h1>

        {/* Free-delivery progress */}
        <div className="card p-5">
          {remaining > 0 ? (
            <p className="text-sm text-forest-ink/70">Add <span className="font-semibold text-forest">{formatMoney({ amount_minor: remaining, currency: 'INR' })}</span> more for FREE delivery</p>
          ) : (
            <p className="text-sm font-medium text-forest-accent">You’ve unlocked FREE delivery! 🎉</p>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-soft">
            <div className="h-full rounded-full bg-cta transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {Object.entries(byNursery).map(([nursery, group], gi) => (
          <div key={nursery} className="card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-forest-accent">Nursery {gi + 1}</p>
            <ul className="divide-y divide-forest/10">
              {group.map((it) => {
                const snap = snaps[it.variant_uuid];
                return (
                  <li key={it.uuid} className="flex items-center gap-4 py-4">
                    <div className="pa-card-art relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      {snap?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={snap.image} alt={snap.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-cormorant text-forest-accent/50">🌿</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {snap?.slug ? (
                        <Link href={`/products/${snap.slug}`} className="font-medium text-forest-ink hover:text-forest">{snap.name}</Link>
                      ) : (
                        <p className="font-medium text-forest-ink">{snap?.name ?? 'Plant'}</p>
                      )}
                      <p className="mt-0.5 text-sm text-forest-ink/55">
                        {snap?.size ? `Size ${snap.size} · ` : ''}Qty {it.qty}
                        {it.options && it.options.length > 0 ? ` · ${it.options.length} add-on(s)` : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-semibold text-forest-ink">{formatMoney(it.price)}</span>
                      <button onClick={() => remove.mutate(it.uuid)} className="text-sm text-clay hover:underline" disabled={remove.isPending}>Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Summary */}
      <aside className="h-fit lg:sticky lg:top-28">
        <div className="card space-y-4 p-6">
          <h2 className="font-heading text-2xl font-semibold text-forest-ink">Summary</h2>
          <div className="flex justify-between text-forest-ink/80">
            <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
            <span className="font-semibold">{formatMoney({ amount_minor: subtotalMinor, currency: 'INR' })}</span>
          </div>
          <div className="flex justify-between text-forest-ink/80">
            <span>Delivery</span>
            <span className="font-medium text-forest-accent">{remaining > 0 ? 'Calculated at checkout' : 'FREE'}</span>
          </div>
          <div className="flex justify-between border-t border-forest/10 pt-4 text-lg font-bold text-forest-ink">
            <span>Total</span>
            <span>{formatMoney({ amount_minor: subtotalMinor, currency: 'INR' })}</span>
          </div>
          <Link href="/checkout" className="btn-cta w-full py-3.5" data-testid="to-checkout">Proceed to checkout</Link>
          <p className="flex items-center justify-center gap-1.5 text-xs text-forest-ink/50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" /></svg>
            Secure checkout · 7-day easy returns
          </p>
        </div>
      </aside>
    </div>
  );
}
