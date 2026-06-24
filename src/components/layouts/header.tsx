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
import CitySwitcher from '@/components/location/city-switcher';

const Search = dynamic(() => import('@/components/ui/search/search'));

// Nav matches the design reference: Plants, Pots & Planters, Seeds, Fertilizers,
// Garden Tools (each with a category dropdown), then Plant Care + Offers.
const NAV: { label: string; href: string; menu?: { label: string; href: string }[] }[] = [
  {
    label: 'Plants',
    href: '/plants',
    menu: [
      { label: 'Indoor Plants', href: '/c/indoor' },
      { label: 'Outdoor Plants', href: '/c/outdoor' },
      { label: 'Flowering Plants', href: '/c/flowering' },
      { label: 'Air-purifying', href: '/c/air-purifying' },
      { label: 'Succulents & Cacti', href: '/c/succulents-cacti' },
      { label: 'Pet-friendly', href: '/c/pet-friendly' },
      { label: 'Herbs', href: '/c/herbs' },
      { label: 'Climbers & Vines', href: '/c/climbers-vines' },
    ],
  },
  {
    label: 'Pots & Planters',
    href: '/tools',
    menu: [
      { label: 'Ceramic Pots', href: '/c/ceramic-pots' },
      { label: 'Plastic Planters', href: '/c/plastic-planters' },
      { label: 'Hanging Planters', href: '/c/hanging-planters' },
      { label: 'Self-Watering Pots', href: '/c/self-watering' },
      { label: 'Pot Stands', href: '/c/pot-stands' },
    ],
  },
  {
    label: 'Seeds',
    href: '/c/seeds',
    menu: [
      { label: 'Flower Seeds', href: '/c/flower-seeds' },
      { label: 'Vegetable Seeds', href: '/c/vegetable-seeds' },
      { label: 'Herb Seeds', href: '/c/herb-seeds' },
      { label: 'Microgreens', href: '/c/microgreens' },
      { label: 'Seed Kits', href: '/c/seed-kits' },
    ],
  },
  {
    label: 'Fertilizers',
    href: '/c/fertilizers',
    menu: [
      { label: 'Organic Fertilizers', href: '/c/organic-fertilizers' },
      { label: 'Liquid Fertilizers', href: '/c/liquid-fertilizers' },
      { label: 'Compost & Manure', href: '/c/compost' },
      { label: 'Plant Food', href: '/c/plant-food' },
      { label: 'Soil & Potting Mix', href: '/c/soil-mix' },
    ],
  },
  {
    label: 'Garden Tools',
    href: '/tools',
    menu: [
      { label: 'Hand Tools', href: '/c/hand-tools' },
      { label: 'Watering Cans', href: '/c/watering' },
      { label: 'Pruning & Cutting', href: '/c/pruning' },
      { label: 'Gloves & Aprons', href: '/c/gloves' },
      { label: 'Tool Sets', href: '/c/tool-sets' },
    ],
  },
  { label: 'Plant Care', href: '/plant-doctor' },
  { label: 'Offers', href: '/offers' },
];

/**
 * PlantAtHome brand header — clean white bar with a top announcement strip,
 * centred nav, inline search, profile + cart. Transparent over the home hero,
 * solid white everywhere else. Wired to the real cart drawer, login + search.
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

  // Transparent over the homepage hero, then a smooth transition to the solid
  // white bar after a small scroll. Every other page (no hero behind the nav) is
  // solid from the top. The homepage hero is pulled up behind the sticky header
  // (negative margin) so the transparent state reveals the cinematic hero.
  // The homepage is served by the optional-catch-all route, so router.pathname is
  // '/[[...pages]]' — use asPath (the real URL) to detect it.
  const isHome = (router?.asPath?.split(/[?#]/)[0] || '/') === '/';
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);
  const solid = !isHome || scrolled;
  const position = 'sticky';

  const openCart = () => setDrawer({ display: true, view: 'cart' });

  // Premium add-to-cart feedback: the fly-to-cart animation (lib/cart-animation)
  // dispatches `pah-cart-bump` when the product image lands (pulse the badge) and
  // `pah-open-cart` to reveal the mini-cart. Decoupled via window events so any
  // add-to-cart button anywhere triggers it without prop-drilling.
  const cartBtnRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const onBump = () =>
      cartBtnRef.current?.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.35)' },
          { transform: 'scale(1)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      );
    const onOpen = () => setDrawer({ display: true, view: 'cart' });
    window.addEventListener('pah-cart-bump', onBump);
    window.addEventListener('pah-open-cart', onOpen);
    return () => {
      window.removeEventListener('pah-cart-bump', onBump);
      window.removeEventListener('pah-open-cart', onOpen);
    };
  }, [setDrawer]);

  const onProfile = () => {
    if (isAuthorize) router.push('/profile');
    else openModal('LOGIN_VIEW');
  };

  // When the search overlay is open we drop a dark scrim behind the bar so the
  // (white) nav items stay readable — the requested "black transparent overlay".
  // useLight = white text/icons (transparent-over-hero OR search-open).
  const useLight = !solid || searchOpen;
  const iconBtn = `grid h-10 w-10 place-items-center rounded-full transition ${
    useLight ? 'text-white hover:bg-white/10' : 'text-forest-900 hover:bg-forest/8'
  }`;

  return (
    <>
      <motion.header
        id="site-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EXPO }}
        className={`${position} inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
          searchOpen
            ? 'bg-forest-900/95 shadow-[0_8px_28px_rgba(22,48,26,0.28)] backdrop-blur-xl'
            : solid
            ? 'bg-white/95 shadow-[0_4px_24px_rgba(34,48,26,0.08)] backdrop-blur-xl'
            : 'bg-gradient-to-b from-deep/85 via-deep/45 to-transparent'
        }`}
      >
        {/* announcement bar — centered shipping message (per reference); the city
            switcher stays on the left for the city-first delivery UX. */}
        <div className="bg-forest-900 text-white">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2 text-[11px] font-medium tracking-wide sm:px-8">
            <CitySwitcher tone="light" />
            <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-2.5 whitespace-nowrap sm:flex">
              <Icon.leaf className="h-3.5 w-3.5 text-sage-300" />
              FREE SHIPPING on orders above ₹499
              <span className="h-3 w-px bg-white/30" />
              Extra 5% OFF on prepaid orders
            </span>
            <span aria-hidden className="hidden w-20 sm:block" />
          </div>
        </div>

        {/* main bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="PlantAtHome home" className="shrink-0">
            <BrandLogo light={useLight} />
          </Link>

          {/* centred nav */}
          <nav
            className={`hidden items-center gap-4 lg:flex xl:gap-7 ${
              useLight ? 'text-white' : 'text-forest-900'
            }`}
          >
            {NAV.map((n) =>
              n.menu ? (
                <div key={n.label} className="group relative">
                  <Link
                    href={n.href}
                    className={`inline-flex items-center gap-1 text-[13px] font-medium transition xl:text-[14px] ${
                      useLight ? 'hover:text-white/80' : 'hover:text-forest-600'
                    }`}
                  >
                    {n.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-70 transition-transform duration-200 group-hover:rotate-180">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Link>
                  {/* hover dropdown — white panel, readable over the transparent or solid bar */}
                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-1 gap-0.5 rounded-2xl border border-forest-900/10 bg-white p-2 shadow-[0_28px_64px_-26px_rgba(13,59,36,0.45)]">
                      {n.menu.map((m) => (
                        <Link
                          key={m.label}
                          href={m.href}
                          className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-forest-900 transition hover:bg-[#EAF4E6] hover:text-[#4E8B31]"
                        >
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`text-[13px] font-medium transition xl:text-[14px] ${
                    useLight ? 'hover:text-white/80' : 'hover:text-forest-600'
                  }`}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          {/* right cluster — Track Order · Wishlist · Cart · Login (per reference) */}
          {(() => {
            const actionCol = `group flex flex-col items-center gap-1 transition ${
              useLight ? 'text-white hover:text-white/80' : 'text-forest-900 hover:text-forest-600'
            }`;
            const actionLabel = 'text-[10.5px] font-medium leading-none';
            return (
              <div className="flex items-center gap-2.5 sm:gap-4">
                {/* compact search */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className={`${actionCol} hidden lg:flex`}
                  aria-label={t('text-search') ?? 'Search'}
                >
                  <SearchIcon className="h-[19px] w-[19px]" />
                  <span className={actionLabel}>Search</span>
                </button>

                {/* Track Order */}
                <Link href="/track-order" className={`${actionCol} hidden lg:flex`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]"><path d="M5 17H3V6a1 1 0 0 1 1-1h11v12" /><path d="M15 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>
                  <span className={actionLabel}>Track Order</span>
                </Link>

                {/* Wishlist */}
                <Link href="/wishlists" className={`${actionCol} hidden lg:flex`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>
                  <span className={actionLabel}>Wishlist</span>
                </Link>

                {/* Cart */}
                <button ref={cartBtnRef} data-cart-target type="button" onClick={openCart} className={`${actionCol} relative`} aria-label="Cart">
                  <span className="relative">
                    <Icon.bag className="h-[19px] w-[19px]" />
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ds-accent px-1 text-[9px] font-bold text-white">
                      {totalUniqueItems}
                    </span>
                  </span>
                  <span className={`${actionLabel} hidden lg:block`}>Cart</span>
                </button>

                {/* Login / Account */}
                <button type="button" onClick={onProfile} className={`${actionCol} hidden lg:flex`} aria-label={isAuthorize ? 'My account' : 'Login'}>
                  <Icon.user className="h-[19px] w-[19px]" />
                  <span className={actionLabel}>{isAuthorize ? 'Account' : 'Login'}</span>
                </button>

                {/* mobile: search + menu */}
                <button type="button" onClick={() => setSearchOpen(true)} className={`${iconBtn} lg:hidden`} aria-label={t('text-search') ?? 'Search'}>
                  <SearchIcon className="h-[18px] w-[18px]" />
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
            );
          })()}
        </div>

        {/* search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EXPO }}
              className="border-t border-white/10 bg-white/95 backdrop-blur-xl"
            >
              <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4 sm:px-8">
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
