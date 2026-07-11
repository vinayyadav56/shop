'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authLogin } from '@/lib/api/auth';
import { addCartItem } from '@/lib/api/endpoints';
import { useSession } from '@/lib/store/session';
import { qk } from '@/lib/query-keys';
import { Logo } from '@/components/layout/Logo';

function AuthPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const setUser = useSession((s) => s.setUser);
  const pendingCart = useSession((s) => s.pendingCart);
  const setPendingCart = useSession((s) => s.setPendingCart);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('customer@plantathome.test');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = params.get('next') || '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'register') {
      toast.info('Account creation is arriving soon — please sign in with the demo account for now.');
      setMode('login');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const user = await authLogin(email, password);
      setUser(user);
      if (pendingCart) {
        const { slug: _slug, ...intent } = pendingCart;
        await addCartItem(intent).catch(() => {});
        setPendingCart(null);
        await qc.invalidateQueries({ queryKey: qk.cart });
        router.replace('/cart');
        return;
      }
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-6.5rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-villa-interior.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/90 via-forest-ink/40 to-forest-ink/30" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-cream">
          <Logo dark />
          <div>
            <h2 className="font-pahserif text-4xl font-semibold leading-tight">Your greenest home starts here.</h2>
            <p className="mt-3 max-w-sm text-cream/80">Save your cart, track deliveries and get lifetime care support from our botanists.</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70">
            <li>🌿 30-day guarantee</li>
            <li>🚚 Same-day metro delivery</li>
            <li>💬 Expert care support</li>
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden"><Logo /></div>
          <div className="mt-6 flex rounded-full bg-forest-soft p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition ${mode === m ? 'bg-white text-forest shadow-sm' : 'text-forest-ink/60'}`}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <h1 className="mt-8 font-pahserif text-4xl font-semibold text-forest-ink">
            {mode === 'login' ? 'Welcome back' : 'Join PlantAtHome'}
          </h1>
          <p className="mt-1 text-sm text-forest-ink/60">
            {mode === 'login' ? 'Sign in to check out and track orders.' : 'Create an account to start growing.'}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-forest-ink">Full name</label>
                <input className="field" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-forest-ink">Email</label>
              <input className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-forest-ink">Password</label>
              <input className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required={mode === 'login'} />
              {mode === 'login' && <Link href="#" className="mt-1 inline-block text-xs text-forest-accent hover:underline">Forgot password?</Link>}
            </div>

            {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay" role="alert">{error}</p>}

            <button type="submit" className="btn-cta w-full py-3.5" disabled={busy}>
              {busy ? 'Signing in…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-4 rounded-lg bg-forest-soft/60 px-3 py-2 text-xs text-forest-ink/70">
              Demo: <b>customer@plantathome.test</b> / <b>Passw0rd!</b>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-wrap py-16 text-center text-forest-ink/50">Loading…</div>}>
      <AuthPanel />
    </Suspense>
  );
}
