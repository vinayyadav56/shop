'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@/lib/api/endpoints';
import { formatMoney } from '@/lib/money';

export default function TrackOrderPage() {
  const [input, setInput] = useState('');
  const [uuid, setUuid] = useState('');
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', uuid],
    queryFn: () => getOrder(uuid),
    enabled: !!uuid,
    retry: 0,
  });

  return (
    <div className="container-wide max-w-2xl py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-accent">Where’s my order?</p>
        <h1 className="mt-2 font-pahserif text-section font-semibold text-forest-ink">Track your order</h1>
        <p className="mt-1 text-forest-ink/60">Enter your order ID to see its status.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setUuid(input.trim()); }} className="mx-auto mt-8 flex max-w-md gap-2">
        <input className="field" placeholder="Order ID (e.g. 8fc0b712…)" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn-cta shrink-0 px-6" type="submit">Track</button>
      </form>

      {isLoading && <p className="mt-8 text-center text-forest-ink/50">Looking up your order…</p>}
      {isError && <p className="mt-8 text-center text-clay">We couldn’t find an order with that ID.</p>}
      {order && (
        <div className="card mt-8 p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm text-forest-ink/60">{order.uuid.slice(0, 8)}</p>
            <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-semibold capitalize text-forest">{order.status}</span>
          </div>
          {order.totals?.grand_total && (
            <p className="mt-4 text-lg font-bold text-forest-ink">Total {formatMoney(order.totals.grand_total)}</p>
          )}
          <p className="mt-1 text-sm text-forest-ink/60">{order.sub_orders.length} nursery shipment(s)</p>
        </div>
      )}
    </div>
  );
}
