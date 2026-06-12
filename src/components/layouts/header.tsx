import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const Search = dynamic(() => import('@/components/ui/search/search'));

// Nav per the PLANTAHOME mockup, mapped to real routes.
const NAV = [
  { label: 'Plants', href: '/plants' },
  { label: 'Planters', href: '/tools' },
  { label: 'Plant Care', href: '/plant-doctor' },
  { label: 'Tools', href: '/tools' },
  { label: 'FarmBox', href: '/farmbox' },
  { label: 'Inspiration', href: '/garden-service' },
  { label: 'Sale', href: '/plants/search' },
];

const UTILITY = [
  'India’s Most Trusted Plant Brand',
  '10,00,000+ Happy Plant Parents',
  'Premium Quality',
  'Sustainable & Responsible',
  'Pan India Delivery',
];

/**
 * PLANTAHOME dark-emerald header (mockup): gold-accented utility bar, serif gold
 * wordmark, uppercase nav, dark search pill, account + cart. Site-wide, sticky.
 */
const Header = ({ layout }: { layout?: string }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { totalUniqueItems } = useCart();
  const [, setDrawer] = useAtom(drawerAtom);
  const [isAuthorize] = useAtom(authorizationAtom);
  const { openModal } = useModalAction();

  const [searchOpen, setSearchOpen] = useAtom(displayMobileHeaderSearchAtom);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openCart = () => setDrawer({ display: true, view: 'cart' });
  const onProfile = () => {
    if (isAuthorize) router.push('/profile');
    else openModal('LOGIN_VIEW');
  };

  const iconBtn =
    'grid h-10 w-10 place-items-center rounded-full text-[#F0EAD8] transition hover:bg-white/10';

  return (
    <>
      <motion.header
        id="site-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EXPO }}
        className="sticky inset-x-0 top-0 z-50 w-full"
      >
        {/* utility bar */}
        <div className="bg-[#0C1F13] text-[#F0EAD8]/85">
          <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-1.5 text-[10.5px] tracking-wide sm:px-6">
            <div className="flex min-w-0 items-center gap-4 overflow-hidden lg:gap-5">
              {UTILITY.map((u, i) => (
                <span key={u} className={`flex shrink-0 items-center gap-1.5 ${i > 1 ? 'hidden xl:flex' : i > 0 ? 'hidden md:flex' : ''}`}>
                  <Icon.leaf className="h-3 w-3 text-[#C9A24B]" /> {u}
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href="/track-order" className="flex items-center gap-1.5 transition hover:text-[#D9BC7A]">
                <Icon.truckFast className="h-3 w-3 text-[#C9A24B]" /> Track Order
              </Link>
              <Link href="/help" className="hidden items-center gap-1.5 transition hover:text-[#D9BC7A] sm:flex">
                <Icon.shield className="h-3 w-3 text-[#C9A24B]" /> Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* main bar */}
        <div className="border-b border-[#C9A24B]/20 bg-[#12281A]">
          <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" aria-label="Plantahome home" className="shrink-0">
              <BrandLogo light />
            </Link>

            <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#F0EAD8]/90 transition hover:text-[#D9BC7A]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden w-[200px] items-center gap-2 rounded-full border border-[#F0EAD8]/15 bg-white/5 px-4 py-2.5 text-[12.5px] text-[#F0EAD8]/50 transition hover:border-[#C9A24B]/50 xl:flex 2xl:w-[230px]"
              >
                <SearchIcon className="h-4 w-4" /> Search for plants, tools, care...
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen((s) => !s)}
                className={`${iconBtn} xl:hidden`}
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
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#C9A24B] px-1 text-[10.5px] font-bold text-[#12281A]">
                    {totalUniqueItems}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#F0EAD8] lg:hidden"
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
                className="border-t border-[#C9A24B]/20 bg-[#0C1F13]"
              >
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4 sm:px-8">
                  <div className="flex-1">
                    <Search label={t('text-search') ?? 'Search'} variant="minimal" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#F0EAD8] hover:bg-white/10"
                    aria-label="Close search"
                  >
                    <Icon.x className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* full-screen mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[#0C1F13] p-7 text-[#F0EAD8]"
          >
            <div className="mb-8 flex items-center justify-between">
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
                transition={{ delay: i * 0.05, ease: EXPO }}
                onClick={() => {
                  setMenuOpen(false);
                  if (l.href === '#search') setSearchOpen(true);
                  else if (l.href === '#cart') openCart();
                  else if (l.href === '#account') onProfile();
                  else router.push(l.href);
                }}
                className="block border-b border-[#C9A24B]/15 py-4 text-left font-cormorant text-2xl font-medium"
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
