'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, Heart, User, ShoppingBag, Leaf } from 'lucide-react';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { authorizationAtom } from '@/store/authorization-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useCart } from '@/store/quick-cart/cart.context';
import CitySwitcher from '@/components/location/city-switcher';
import { cn } from '@/lib/cn';

const NAV = [
  { label: 'All Plants', href: '/plants' },
  { label: 'Indoor', href: '/c/indoor' },
  { label: 'Outdoor', href: '/c/outdoor' },
  { label: 'Planters & Tools', href: '/tools' },
  { label: 'Gifting', href: '/corporate-gifting' },
  { label: 'Plant Doctor', href: '/plant-doctor' },
];

function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = q.trim();
        router.push(t ? `/search?text=${encodeURIComponent(t)}` : '/plants/search');
      }}
      className={cn('flex items-center gap-2 rounded-xl border border-line2 bg-canvas px-3 py-2 transition focus-within:border-cta focus-within:ring-2 focus-within:ring-cta/20', className)}
    >
      <Search className="h-[18px] w-[18px] shrink-0 text-stone-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search plants, planters, tools…"
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-[13.5px] text-brand-900 outline-none placeholder:text-stone-400"
      />
    </form>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const [, setDrawer] = useAtom(drawerAtom);
  const [authorized] = useAtom(authorizationAtom);
  const { openModal } = useModalAction();
  const { totalUniqueItems } = useCart();

  const openCart = () => setDrawer({ display: true, view: 'cart' });
  const account = () => (authorized ? router.push('/profile') : openModal('LOGIN_VIEW'));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line2 bg-white/95 font-jakarta backdrop-blur">
      {/* top bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" aria-label="PlantAtHome home" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white sm:h-9 sm:w-9">
            <Leaf className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[16px] font-extrabold tracking-tight text-brand-900 sm:text-[18px]">
            Plant<span className="text-cta">At</span>Home
          </span>
        </Link>

        <HeaderSearch className="mx-2 hidden flex-1 lg:flex" />

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <CitySwitcher tone="dark" className="mr-1 hidden xl:inline-flex" />
          <Link href="/wishlists" aria-label="Wishlist" className="hidden h-10 w-10 place-items-center rounded-full text-brand-900 transition hover:bg-brand-50 sm:grid">
            <Heart className="h-[21px] w-[21px]" />
          </Link>
          <button type="button" onClick={account} aria-label="Account" className="hidden h-10 w-10 place-items-center rounded-full text-brand-900 transition hover:bg-brand-50 sm:grid">
            <User className="h-[21px] w-[21px]" />
          </button>
          <button type="button" onClick={openCart} aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-brand-900 transition hover:bg-brand-50">
            <ShoppingBag className="h-[21px] w-[21px]" />
            {totalUniqueItems > 0 ? (
              <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-cta px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {totalUniqueItems}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* mobile search row */}
      <div className="border-t border-line2 px-4 py-2 lg:hidden">
        <HeaderSearch />
      </div>

      {/* desktop nav row */}
      <nav className="hidden border-t border-line2 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6">
          {NAV.map((n) => {
            const active = router.asPath.split('?')[0] === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'border-b-2 py-2.5 text-[13.5px] font-semibold transition',
                  active ? 'border-cta text-brand' : 'border-transparent text-brand-900/80 hover:text-brand',
                )}
              >
                {n.label}
              </Link>
            );
          })}
          <CitySwitcher tone="dark" className="ml-auto xl:hidden" />
        </div>
      </nav>
    </header>
  );
}

export default SiteHeader;
