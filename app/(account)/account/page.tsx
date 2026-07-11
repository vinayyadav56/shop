'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/store/session';
import { authLogout } from '@/lib/api/auth';

export default function AccountPage() {
  const user = useSession((s) => s.user);
  const setUser = useSession((s) => s.setUser);
  const router = useRouter();
  const qc = useQueryClient();

  async function onLogout() {
    await authLogout();
    setUser(null);
    qc.clear();
    router.push('/');
  }

  return (
    <div className="container-wide max-w-3xl py-12">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-2xl font-semibold text-cream">
          {(user?.name ?? 'G').charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-pahserif text-3xl font-semibold text-forest-ink">{user?.name ?? 'Your account'}</h1>
          <p className="text-forest-ink/60">{user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/track-order" className="card flex items-center gap-4 p-6 transition hover:shadow-card">
          <span className="text-2xl">📦</span>
          <div><p className="font-heading text-lg font-semibold text-forest-ink">Track an order</p><p className="text-sm text-forest-ink/60">See where your plants are</p></div>
        </Link>
        <Link href="/plants" className="card flex items-center gap-4 p-6 transition hover:shadow-card">
          <span className="text-2xl">🌿</span>
          <div><p className="font-heading text-lg font-semibold text-forest-ink">Keep shopping</p><p className="text-sm text-forest-ink/60">Discover new arrivals</p></div>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-forest/10 bg-forest-soft/40 p-6 text-center">
        <p className="text-forest-ink/70">Your order history will appear here once you place an order.</p>
      </div>

      <button onClick={onLogout} className="pa-btn pa-btn-outline mt-8">Sign out</button>
    </div>
  );
}
