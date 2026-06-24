import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { authorizationAtom } from '@/store/authorization-atom';

/**
 * Mobile bottom tab bar (per the design reference): Home · Categories · Plants ·
 * Wishlist · Profile. Fixed, glass-white, shown on mobile only. Rendered on every
 * storefront page via the layout wrappers.
 */
export default function MobileNavigation(_props: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const { openModal } = useModalAction();
  const [isAuthorize] = useAtom(authorizationAtom);
  const [, setDrawerView] = useAtom(drawerAtom);

  const path = (router?.asPath || '/').split(/[?#]/)[0];
  const isActive = (test: (p: string) => boolean) => test(path);

  const ICON = 'h-[22px] w-[22px]';
  const tab = (active: boolean) =>
    `flex h-full flex-1 flex-col items-center justify-center gap-1 focus:outline-0 transition-colors ${
      active ? 'text-ds-accent' : 'text-stone-500 hover:text-forest-800'
    }`;
  const label = 'text-[10px] font-medium leading-none';

  const items: {
    key: string;
    label: string;
    active: boolean;
    onClick: () => void;
    icon: JSX.Element;
  }[] = [
    {
      key: 'home',
      label: 'Home',
      active: isActive((p) => p === '/'),
      onClick: () => router.push('/'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={ICON}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></svg>
      ),
    },
    {
      key: 'categories',
      label: 'Categories',
      active: isActive((p) => p.startsWith('/categories') || p.startsWith('/c/')),
      onClick: () => router.push('/categories'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={ICON}><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></svg>
      ),
    },
    {
      key: 'plants',
      label: 'Plants',
      active: isActive((p) => p.startsWith('/plants') || p.startsWith('/products')),
      onClick: () => router.push('/plants'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={ICON}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
      ),
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      active: isActive((p) => p.startsWith('/wishlist')),
      onClick: () => (isAuthorize ? router.push('/wishlists') : openModal('LOGIN_VIEW')),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={ICON}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>
      ),
    },
    {
      key: 'profile',
      label: 'Profile',
      active: isActive((p) => p.startsWith('/profile') || p.startsWith('/orders')),
      onClick: () =>
        isAuthorize
          ? setDrawerView({ display: true, view: 'AUTH_MENU_VIEW' })
          : openModal('LOGIN_VIEW'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={ICON}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 z-30 flex h-16 w-full items-stretch border-t border-forest-900/10 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      style={{ boxShadow: '0 -6px 24px -16px rgba(13,59,36,0.4)' }}
    >
      {items.map((it) => (
        <motion.button
          key={it.key}
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={it.onClick}
          aria-label={it.label}
          aria-current={it.active ? 'page' : undefined}
          className={tab(it.active)}
        >
          {it.icon}
          <span className={label}>{it.label}</span>
        </motion.button>
      ))}
    </nav>
  );
}
