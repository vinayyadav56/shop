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
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);
  const position = isHome ? 'fixed' : 'sticky';

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

  const iconBtn = 'grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10';

  return (
    <>
      <motion.header
        id="site-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EXPO }}
        className={`${position} inset-x-0 top-0 z-50 w-full bg-[#10230f] transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.35)]' : ''
        }`}
      >
        {/* announcement bar — near-black strip (per reference), slides away on
            scroll. City switcher stays left for the city-first delivery UX. */}
        <div className={`overflow-hidden border-b border-white/10 bg-[#0A0D0A] text-white transition-all duration-300 ${scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'}`}>
          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2 text-[11px] font-medium tracking-wide sm:px-8">

            <CitySwitcher tone="light" />
            <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-2.5 whitespace-nowrap sm:flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-sage-300" aria-hidden><path d="M5 17H3V6h11v11" /><path d="M14 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>
              FREE SHIPPING on orders above ₹499
              <span className="h-3 w-px bg-white/30" />
              Extra 5% OFF on prepaid orders
            </span>
            <span aria-hidden className="hidden w-20 sm:block" />
          </div>
        </div>

        {/* main bar */}
        <div className="relative mx-auto flex max-w-7xl items-center px-5 py-2.5 sm:px-8">
          {/* Logo */}
          <Link href="/" aria-label="PlantAtHome home" className="shrink-0">
            <BrandLogo light />
          </Link>

          {/* ── nav — centered between logo and actions, flat on the dark bar.
              In-flow (not absolutely centered) so it can never overlap the
              actions block at narrower desktop widths. ── */}
          {/* lg+ only: at tablet the 7 pills collide with logo/actions, so
              768–1023 uses the hamburger's full-screen menu instead. */}
          <nav className="hidden min-w-0 flex-1 justify-center lg:flex">
            <div className="flex items-center gap-0.5">
              {NAV.map((n) =>
                n.menu ? (
                  <div key={n.label} className="group relative">
                    <Link
                      href={n.href}
                      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/[0.15] hover:text-white"
                    >
                      {n.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-[11px] w-[11px] opacity-50 transition-transform duration-200 group-hover:rotate-180">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Link>
                    {/* dropdown — glass panel */}
                    <div className="invisible absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="grid grid-cols-1 gap-0.5 rounded-2xl border border-white/[0.18] bg-white/[0.88] p-1.5 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                        {n.menu.map((m) => (
                          <Link
                            key={m.label}
                            href={m.href}
                            className="rounded-[10px] px-3.5 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-black/[0.06] hover:text-neutral-900"
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
                    className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/[0.15] hover:text-white"
                  >
                    {n.label}
                  </Link>
                ),
              )}
            </div>
          </nav>

          {/* ── actions — right, stacked icon-over-label (per reference) ── */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-1 md:flex">
              {/* Search */}
              <button type="button" onClick={() => setSearchOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/10 hover:text-white" aria-label={t('text-search') ?? 'Search'}>
                <SearchIcon className="h-[18px] w-[18px]" />
              </button>
              {/* Track Order */}
              <Link href="/track-order" className="flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white" aria-label="Track Order">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M5 17H3V6a1 1 0 0 1 1-1h11v12" /><path d="M15 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>
                <span className="hidden text-[11px] font-medium leading-none xl:inline">Track Order</span>
              </Link>
              {/* Wishlist */}
              <Link href="/wishlists" className="flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>
                <span className="hidden text-[11px] font-medium leading-none xl:inline">Wishlist</span>
              </Link>
              {/* Cart */}
              <button ref={cartBtnRef} data-cart-target type="button" onClick={openCart} className="flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white" aria-label="Cart">
                <span className="relative">
                  <Icon.bag className="h-[18px] w-[18px]" />
                  <span className="absolute -right-1.5 -top-1 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-ds-accent px-1 text-[9px] font-bold text-white">
                    {totalUniqueItems}
                  </span>
                </span>
                <span className="hidden text-[11px] font-medium leading-none xl:inline">Cart</span>
              </button>
              {/* Login */}
              <button type="button" onClick={onProfile} className="flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white" aria-label={isAuthorize ? 'My account' : 'Login'}>
                <Icon.user className="h-[18px] w-[18px]" />
                <span className="hidden text-[11px] font-medium leading-none xl:inline">{isAuthorize ? 'Account' : 'Login'}</span>
              </button>
            </div>

            {/* mobile: search + hamburger */}
            <button type="button" onClick={() => setSearchOpen(true)} className={`${iconBtn} md:hidden`} aria-label={t('text-search') ?? 'Search'}>
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>
            <button type="button" onClick={() => setMenuOpen(true)} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur lg:hidden" aria-label="Menu">
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
              className="border-t border-black/[0.06] bg-white/[0.96] backdrop-blur-2xl"
            >
              <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4 sm:px-8">
                <div className="flex-1">
                  <Search label={t('text-search') ?? 'Search'} variant="minimal" />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-neutral-700 hover:bg-black/[0.06]"
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
