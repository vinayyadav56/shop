'use client';
import { useAtom } from 'jotai';
import { RadioGroup } from '@headlessui/react';
import {
  deliverToAtom,
  recipientNameAtom,
  recipientPhoneAtom,
  saveRecipientAddressAtom,
} from '@/store/deliver-to';

/**
 * Checkout Delivery-Type step: "Deliver to Me" (default, existing address flow)
 * vs "Deliver to Someone Else" (recipient name + phone captured here; the
 * address itself is still picked/created through the same grid + map-pin
 * form, so recipient addresses get identical city validation).
 */
export default function DeliverTo({ count, label }: { count?: number; label?: string }) {
  const [deliverTo, setDeliverTo] = useAtom(deliverToAtom);
  const [name, setName] = useAtom(recipientNameAtom);
  const [phone, setPhone] = useAtom(recipientPhoneAtom);
  const [save, setSave] = useAtom(saveRecipientAddressAtom);

  return (
    <div className="pa-checkout-step">
      <div className="mb-4 flex items-center gap-3">
        {count ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-800 text-sm font-semibold text-white">
            {count}
          </span>
        ) : null}
        <p className="text-lg font-semibold capitalize text-heading">
          {label ?? 'Delivery type'}
        </p>
      </div>

      <RadioGroup value={deliverTo} onChange={setDeliverTo}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { value: 'me', title: 'Deliver to Me', sub: 'Use one of my addresses' },
            {
              value: 'someone_else',
              title: 'Deliver to Someone Else',
              sub: 'Send as a gift — add their details',
            },
          ].map((opt) => (
            <RadioGroup.Option key={opt.value} value={opt.value}>
              {({ checked }) => (
                <div
                  className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                    checked
                      ? 'border-forest-800 bg-forest-800/5 ring-1 ring-forest-800'
                      : 'border-border-200 hover:border-forest-800/40'
                  }`}
                >
                  <p className="text-sm font-semibold text-heading">{opt.title}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{opt.sub}</p>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      {deliverTo === 'someone_else' ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-heading">
              Recipient name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Who receives this order?"
              className="w-full rounded-lg border border-border-base px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-heading">
              Recipient phone <span className="text-red-500">*</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ''))}
              placeholder="Their contact number"
              inputMode="tel"
              className="w-full rounded-lg border border-border-base px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <label className="col-span-full flex cursor-pointer items-center gap-2.5 text-sm text-heading">
            <input
              type="checkbox"
              checked={save}
              onChange={(e) => setSave(e.target.checked)}
              className="h-4 w-4 rounded border-border-base text-accent focus:ring-accent"
            />
            Save this address to my address book
          </label>
          <p className="col-span-full text-xs text-stone-500">
            Pick or add the recipient&rsquo;s address below — it must be in your
            current shopping city.
          </p>
        </div>
      ) : null}
    </div>
  );
}
