'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/store/authorization-atom';
import { drawerAtom } from '@/store/drawer-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';

const ICONS: Record<string, React.ReactNode> = {
  Home: <><path d="M3 11 12 4l9 7" /><path d="M5.5 9.5V20h13V9.5" /></>,
  Categories: <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="3.5" cy="6" r="1.2" /><circle cx="3.5" cy="12" r="1.2" /><circle cx="3.5" cy="18" r="1.2" /></>,
  Plants: <><path d="M12 21V11" /><path d="M12 11c0-3.4 2.4-5.8 6-6.3C17.5 8 15.4 11 12 11Z" /><path d="M12 13c0-2.8-1.9-4.8-5-5.2C6.6 11 9 13 12 13Z" /></>,
  Wishlist: <path d="M12 20s-7-4.4-9.2-9C1.3 8.1 2.6 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.2 0 4.5 3.1 3 6-2.2 4.6-9.2 9-9.2 9Z" />,
  Profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-3.6 4-5 7-5s6 1.4 7 5" /></>,
};

export function BottomNav() {
  const router = useRouter();
  const [authorized] = useAtom(authorizationAtom);
  const [, setDrawer] = useAtom(drawerAtom);
  const { openModal } = useModalAction();
  const path = (router.asPath || '/').split(/[?#]/)[0];

  const items = [
    { label: 'Home', active: path === '/', go: () => router.push('/') },
    { label: 'Categories', active: path.startsWith('/c/'), go: () => setDrawer({ display: true, view: 'MAIN_MENU_VIEW' }) },
    { label: 'Plants', active: path.startsWith('/plants') || path.startsWith('/products'), go: () => router.push('/plants') },
    { label: 'Wishlist', active: path.startsWith('/wishlist'), go: () => (authorized ? router.push('/wishlists') : openModal('LOGIN_VIEW')) },
    { label: 'Profile', active: path.startsWith('/profile') || path.startsWith('/orders'), go: () => (authorized ? router.push('/profile') : openModal('LOGIN_VIEW')) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-30 w-full rounded-t-[20px] border-t border-kraft-200 bg-white px-2 pb-[max(16px,env(safe-area-inset-bottom))] pt-[9px] shadow-[0_-6px_20px_rgba(34,48,26,0.08)] md:hidden">
      <div className="mx-auto flex max-w-[440px] justify-around">
        {items.map((n) => (
          <motion.button
            key={n.label}
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={n.go}
            aria-label={n.label}
            aria-current={n.active ? 'page' : undefined}
            className="relative flex flex-col items-center gap-1 px-2 pb-1 pt-2"
            style={{ color: n.active ? 'var(--pah-active,#2E5E2A)' : '#908A7E' }}
          >
            {n.active ? <span className="absolute top-0 h-[5px] w-[5px] rounded-full bg-forest-600 shadow-[0_0_6px_rgba(46,139,87,0.5)]" /> : null}
            <span style={{ color: n.active ? '#2E5E2A' : '#908A7E' }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[n.label]}</svg>
            </span>
            <span className="text-[10.5px]" style={{ color: n.active ? '#2E5E2A' : '#908A7E', fontWeight: n.active ? 700 : 500 }}>{n.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
