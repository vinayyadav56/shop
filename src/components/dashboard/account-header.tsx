'use client';
import React from 'react';
import { useUser } from '@/framework/user';

/** Clean account header for the dashboard — avatar + name + email + wallet stat chips. */
export default function AccountHeader() {
  const { me }: any = useUser();
  const name = me?.name || 'Welcome';
  const email = me?.email || '';
  const avatar = me?.profile?.avatar?.thumbnail || me?.profile?.avatar?.original || '';
  const initials = (me?.name || 'P')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const w = me?.wallet ?? {};
  const stats = [
    { label: 'Total points', value: w?.total_points ?? 0 },
    { label: 'Points used', value: w?.points_used ?? 0 },
    { label: 'Available', value: w?.available_points ?? 0 },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-forest-900/10 bg-white">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        {/* identity */}
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-sage-100 text-[20px] font-bold text-forest-700 ring-2 ring-white">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading truncate text-[1.5rem] font-bold not-italic leading-tight text-forest-900">{name}</h1>
            {email && <p className="truncate text-[13.5px] text-stone-500">{email}</p>}
          </div>
        </div>
        {/* wallet chips */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-forest-900/10 bg-cream-50 px-3 py-2.5 text-center sm:px-5">
              <div className="text-[18px] font-bold leading-none text-forest-900">{s.value}</div>
              <div className="mt-1 text-[10.5px] font-medium uppercase tracking-wide text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
