'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, Sprout, Heart, ShoppingBag } from 'lucide-react';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { authorizationAtom } from '@/store/authorization-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useCart } from '@/store/quick-cart/cart.context';
import { cn } from '@/lib/cn';

export function BottomNav() {
  const router = useRouter();
  const [, setDrawer] = useAtom(drawerAtom);
  const [authorized] = useAtom(authorizationAtom);
  const { openModal } = useModalAction();
  const { totalUniqueItems } = useCart();
  const path = (router.asPath || '/').split(/[?#]/)[0];

  const tabs = [
    { key: 'home', label: 'Home', icon: Home, active: path === '/', onClick: () => router.push('/') },
    { key: 'cat', label: 'Categories', icon: LayoutGrid, active: path.startsWith('/categories') || path.startsWith('/c/'), onClick: () => router.push('/categories') },
    { key: 'plants', label: 'Plants', icon: Sprout, active: path.startsWith('/plants') || path.startsWith('/products'), onClick: () => router.push('/plants') },
    { key: 'wish', label: 'Wishlist', icon: Heart, active: path.startsWith('/wishlist'), onClick: () => (authorized ? router.push('/wishlists') : openModal('LOGIN_VIEW')) },
    { key: 'cart', label: 'Cart', icon: ShoppingBag, active: false, badge: totalUniqueItems, onClick: () => setDrawer({ display: true, view: 'cart' }) },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 z-40 flex h-[60px] w-full items-stretch border-t border-line2 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] font-jakarta backdrop-blur-xl lg:hidden"
      style={{ boxShadow: '0 -6px 24px -16px rgba(11,53,33,0.4)' }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <motion.button
            key={t.key}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={t.onClick}
            aria-label={t.label}
            aria-current={t.active ? 'page' : undefined}
            className={cn('relative flex flex-1 flex-col items-center justify-center gap-1 focus:outline-0', t.active ? 'text-cta' : 'text-stone-500')}
          >
            <span className="relative">
              <Icon className="h-[22px] w-[22px]" strokeWidth={t.active ? 2.4 : 2} />
              {t.badge ? (
                <span className="absolute -right-2 -top-1.5 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-offer px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {t.badge}
                </span>
              ) : null}
            </span>
            <span className="text-[10px] font-semibold leading-none">{t.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
