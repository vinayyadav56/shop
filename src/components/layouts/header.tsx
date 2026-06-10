import React from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { BrandLogo } from '@/components/storefront/logo-mark';
import { Icon } from '@/components/storefront/icons';
import { EXPO } from '@/components/storefront/motion';
import { SearchIcon } from '@/components/icons/search-icon';
import { useCart } from '@/store/quick-cart/cart.context';
import { drawerAtom } from '@/store/drawer-atom';
import { authorizationAtom } from '@/store/authorization-atom';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useIsHomePage } from '@/lib/use-is-homepage';

const Search = dynamic(() => import('@/components/ui/search/search'));

const NAV = [
  { label: 'Plants', href: '/plants' },
  { label: 'Pots', href: '/tools' },
  { label: 'Plant Care', href: '/plant-doctor' },
  { label: 'About Us', href: '/contact' },
  { label: 'Blog', href: '/garden-service' },
];

/**
 * PlantAtHome brand header — clean white bar with a top announcement strip,
 * centred nav, inline search, profile + cart. Transparent over the home hero,
 * solid white everywhere else. Wired to the real cart drawer, login + search.
 */
const Header = ({ layout }: { layout?: string }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isHomePage = useIsHomePage();
  const { scrollY } = useScroll();
  const { totalUniqueItems } = useCart();
  const [, setDrawer] = useAtom(drawerAtom);
  const [isAuthorize] = useAtom(authorizationAtom);
  const { openModal } = useModalAction();

  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = useAtom(displayMobileHeaderSearchAtom);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 40));
    return () => unsub();
  }, [scrollY]);

  const solid = scrolled || !isHomePage || searchOpen;
  const position = isHomePage ? 'fixed' : 'sticky';

  const openCart = () => setDrawer({ display: true, view: 'cart' });
  const onProfile = () => {
    if (isAuthorize) router.push('/profile');
    else openModal('LOGIN_VIEW');
  };

  const iconBtn = `grid h-10 w-10 place-items-center rounded-full transition ${
    solid ? 'text-forest-900 hover:bg-forest/8' : 'text-white hover:bg-white/10'
  }`;

  return (
    <>
      <motion.header
        id="site-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EXPO }}
        className={`${position} inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
          solid
            ? 'bg-white/95 shadow-[0_4px_24px_rgba(34,48,26,0.08)] backdrop-blur-xl'
            : 'bg-gradient-to-b from-deep/85 via-deep/45 to-transparent'
        }`}
      >
        {/* main bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="PlantAtHome home" className="shrink-0">
            <BrandLogo light={!solid} />
          </Link>

          {/* centred nav */}
          <nav
            className={`hidden items-center gap-7 lg:flex ${
              solid ? 'text-forest-900' : 'text-white'
            }`}
          >
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`text-[14px] font-medium transition ${
                  solid ? 'hover:text-forest-600' : 'hover:text-white/80'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* right cluster */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden w-[210px] items-center gap-2 rounded-full border border-kraft-300 bg-white px-4 py-2.5 text-[13px] text-stone-400 transition hover:border-forest-500 lg:flex"
            >
              <SearchIcon className="h-4 w-4" /> Search plants, pots…
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              className={`${iconBtn} lg:hidden`}
              aria-label={t('text-search') ?? 'Search'}
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>

            <button type="button" onClick={onProfile} className={iconBtn} aria-label={isAuthorize ? 'My account' : 'Login'}>
              <Icon.user className="h-5 w-5" />
            </button>

            <button type="button" onClick={openCart} className={`relative ${iconBtn}`} aria-label="Cart">
              <Icon.bag className="h-5 w-5" />
              {totalUniqueItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-forest-700 px-1 text-[10px] font-bold text-white">
                  {totalUniqueItems}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${
                solid ? 'bg-forest-700 text-white' : 'bg-white/15 text-white backdrop-blur'
              }`}
              aria-label="Menu"
            >
              <Icon.menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EXPO }}
              className="border-t border-kraft-200 bg-white/95 backdrop-blur-xl"
            >
              <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4 sm:px-8">
                <div className="flex-1">
                  <Search label={t('text-search') ?? 'Search'} variant="minimal" />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-forest-900 hover:bg-forest/8"
                  aria-label="Close search"
                >
                  <Icon.x className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* full-screen mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-forest p-7 text-white"
          >
            <div className="mb-10 flex items-center justify-between">
              <BrandLogo light />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <Icon.x className="h-6 w-6" />
              </button>
            </div>

            {[
              ...NAV,
              { label: 'Search', href: '#search' },
              { label: 'Cart', href: '#cart' },
              { label: isAuthorize ? 'My account' : 'Login', href: '#account' },
            ].map((l, i) => (
              <motion.button
                key={l.label}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: EXPO }}
                onClick={() => {
                  setMenuOpen(false);
                  if (l.href === '#search') setSearchOpen(true);
                  else if (l.href === '#cart') openCart();
                  else if (l.href === '#account') onProfile();
                  else router.push(l.href);
                }}
                className="block border-b border-white/10 py-5 text-left font-poppins text-2xl font-bold"
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
