'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart, startCheckout, payCheckout } from '@/lib/api/endpoints';
import { qk } from '@/lib/query-keys';
import { formatMoney } from '@/lib/money';
import { useSession } from '@/lib/store/session';
import { useCartSnaps } from '@/lib/store/cart-snapshots';
import { ApiError } from '@/lib/api/client';
import type { CheckoutSession } from '@/lib/api/types';

/** One idempotency key per checkout session, reused on every pay retry. */
function idemKeyFor(checkoutUuid: string): string {
  const k = `idem:${checkoutUuid}`;
  let v = sessionStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    sessionStorage.setItem(k, v);
  }
  return v;
}

const STEPS = ['Contact', 'Address', 'Delivery', 'Review'] as const;
const SLOTS = ['Today, 5–9 PM', 'Tomorrow, 9 AM–1 PM', 'Tomorrow, 5–9 PM', 'Pick a weekend slot'];

export function CheckoutWizard() {
  const router = useRouter();
  const qc = useQueryClient();
  const cityName = useSession((s) => s.cityName);
  const snaps = useCartSnaps((s) => s.snaps);
  const { data: cart } = useQuery({ queryKey: qk.cart, queryFn: getCart });

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState(cityName ?? '');
  const [slot, setSlot] = useState(SLOTS[0]);
  const [coupon, setCoupon] = useState('');
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () => startCheckout({ address: { line1, city }, coupon: coupon.trim() || undefined }),
    onSuccess: (s) => { setSession(s); setError(null); },
    onError: (e) => {
      if (e instanceof ApiError && e.code === 'EMPTY_CART') { router.replace('/cart'); return; }
      setError(e instanceof Error ? e.message : 'Could not start checkout.');
    },
  });

  const pay = useMutation({
    mutationFn: () => payCheckout(session!.checkout_uuid, idemKeyFor(session!.checkout_uuid)),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: qk.cart });
      router.replace(`/orders/${res.order.uuid}`);
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'Payment failed.'),
  });

  const items = cart?.items ?? [];
  const subtotalMinor = cart?.grand_total_minor ?? 0;
  const totals = session?.totals;

  const canNext =
    (step === 0 && name.trim() && email.trim() && phone.trim()) ||
    (step === 1 && line1.trim() && city.trim()) ||
    step === 2;

  function next() {
    setError(null);
    if (step < 3) setStep(step + 1);
  }

  return (
    <div className="container-wide py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-accent">Secure checkout</p>
        <h1 className="mt-1 font-pahserif text-section font-semibold text-forest-ink">Almost there</h1>
        <p className="mt-1 text-sm text-forest-ink/60">Encrypted payment · Free returns · Trusted by gardeners</p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                i < step ? 'bg-forest text-cream' : i === step ? 'bg-forest text-cream ring-4 ring-forest-soft' : 'bg-forest-soft text-forest/50'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </button>
            <span className={`hidden text-sm font-medium sm:inline ${i <= step ? 'text-forest-ink' : 'text-forest-ink/40'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-forest' : 'bg-forest-soft'}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Wizard */}
        <div className="card p-6 lg:p-8">
          {step === 0 && (
            <Fieldset title="Contact details">
              <Field label="Full name"><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email"><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
                <Field label="Phone"><input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" /></Field>
              </div>
            </Fieldset>
          )}

          {step === 1 && (
            <Fieldset title="Delivery address">
              <Field label="Address"><input className="field" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Flat / house, street, area" /></Field>
              <Field label="City"><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" /></Field>
            </Fieldset>
          )}

          {step === 2 && (
            <Fieldset title="Delivery slot">
              <div className="grid gap-3 sm:grid-cols-2">
                {SLOTS.map((s) => (
                  <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${slot === s ? 'border-forest bg-forest-soft text-forest' : 'border-forest/20 text-forest-ink/80 hover:border-forest/40'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </Fieldset>
          )}

          {step === 3 && (
            <Fieldset title="Review & pay">
              {!session ? (
                <>
                  <div className="rounded-xl bg-forest-soft/40 p-4 text-sm text-forest-ink/75">
                    <p><b>{name || 'Guest'}</b> · {phone}</p>
                    <p className="mt-1">{line1}, {city}</p>
                    <p className="mt-1 text-forest-ink/55">{slot}</p>
                  </div>
                  <Field label="Coupon (optional)">
                    <input className="field" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="e.g. SAVE10" />
                  </Field>
                  <button onClick={() => create.mutate()} disabled={create.isPending} className="btn-cta w-full py-3.5" data-testid="continue-to-pay">
                    {create.isPending ? 'Preparing…' : 'Confirm & see total'}
                  </button>
                </>
              ) : (
                <>
                  <dl className="space-y-2 text-forest-ink/80">
                    <Row label="Subtotal" value={formatMoney(totals!.subtotal)} />
                    {totals!.discount && totals!.discount.amount_minor > 0 && (
                      <Row label={`Discount${session.coupon ? ` (${session.coupon})` : ''}`} value={`−${formatMoney(totals!.discount)}`} accent />
                    )}
                    <div className="flex justify-between border-t border-forest/10 pt-2 text-lg font-bold text-forest-ink">
                      <dt>Total</dt>
                      <dd data-testid="checkout-total">{formatMoney(totals!.grand_total)}</dd>
                    </div>
                  </dl>
                  <button onClick={() => pay.mutate()} disabled={pay.isPending} className="btn-cta mt-5 w-full py-3.5" data-testid="pay-now">
                    {pay.isPending ? 'Processing…' : `Pay ${formatMoney(totals!.grand_total)}`}
                  </button>
                  <p className="mt-2 text-center text-xs text-forest-ink/45">Simulated payment (staging).</p>
                </>
              )}
            </Fieldset>
          )}

          {error && <p className="mt-4 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}

          {/* Nav */}
          {step < 3 && (
            <div className="mt-6 flex items-center justify-between">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="pa-btn pa-btn-outline">Back</button>
              ) : <Link href="/cart" className="text-sm text-forest-ink/60 hover:text-forest">← Back to cart</Link>}
              <button onClick={next} disabled={!canNext} className="pa-btn pa-btn-primary disabled:opacity-50" data-testid="wizard-next">Continue</button>
            </div>
          )}
          {step === 3 && !session && (
            <div className="mt-6"><button onClick={() => setStep(2)} className="pa-btn pa-btn-outline">Back</button></div>
          )}
        </div>

        {/* Persistent summary */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest-ink">Order summary</h2>
            <ul className="mb-4 space-y-3">
              {items.map((it) => {
                const snap = snaps[it.variant_uuid];
                return (
                  <li key={it.uuid} className="flex items-center gap-3">
                    <div className="pa-card-art h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      {snap?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={snap.image} alt="" className="h-full w-full object-cover" />
                      ) : <div className="flex h-full w-full items-center justify-center text-forest-accent/50">🌿</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-ink">{snap?.name ?? 'Plant'}</p>
                      <p className="text-xs text-forest-ink/55">Qty {it.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-forest-ink">{formatMoney(it.price)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-between border-t border-forest/10 pt-3 text-forest-ink">
              <span className="font-medium">{totals ? 'Total' : 'Subtotal'}</span>
              <span className="text-lg font-bold">{formatMoney(totals?.grand_total ?? { amount_minor: subtotalMinor, currency: 'INR' })}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold text-forest-ink">{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-forest-ink">{label}</span>{children}</label>;
}
function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className={`flex justify-between ${accent ? 'text-forest-accent' : ''}`}><dt>{label}</dt><dd>{value}</dd></div>;
}
