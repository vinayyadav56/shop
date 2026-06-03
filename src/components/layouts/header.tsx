import React from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { BrandLogo } from '@/components/storefront/logo-mark';
import { VerticalSwitcher } from '@/components/storefront/vertical-switcher';
import { Icon } from '@/components/storefront/icons';
import { EXPO } from '@/components/storefront/motion';
import { SearchIcon } from '@/components/icons/search-icon';
import { useTypes } from '@/framework/type';
import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { useCart } from '@/store/quick-cart/cart.context';
import { drawerAtom } from '@/store/drawer-atom';
import { authorizationAtom } from '@/store/authorization-atom';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useIsHomePage } from '@/lib/use-is-homepage';

const Search = dynamic(() => import('@/components/ui/search/search'));

/**
 * PlantAtHome brand header — a faithful port of the prototype Nav.
 * Transparent over the hero (home/vertical pages) → solid cream on scroll;
 * solid + sticky on every other page. Logo · vertical switcher · Categories ·
 * search · profile · cart, with a full-screen mobile overlay. Wired to the REAL
 * cart drawer, login modal and search.
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

  // transparent only while at the top of a hero page; solid everywhere else
  const solid = scrolled || !isHomePage || searchOpen;
  const position = isHomePage ? 'fixed' : 'sticky';

  const { types } = useTypes({ limit: TYPES_PER_PAGE });
  const typeList = types ?? [];
  const homeSlug =
    typeList.find((t) => t?.settings?.isHome)?.slug ?? typeList[0]?.slug ?? 'plants';
  const currentSlug =
    (router.query.pages as string[] | undefined)?.[0] ?? homeSlug;
  const categoriesHref = `/${currentSlug}/search`;

  const openCart = () => setDrawer({ display: true, view: 'cart' });
  const onProfile = () => {
    if (isAuthorize) router.push('/profile');
    else openModal('LOGIN_VIEW');
  };

  const iconBtn = `grid h-10 w-10 place-items-center rounded-full transition ${
    solid ? 'hover:bg-forest/8' : 'hover:bg-white/10'
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
            ? 'bg-cream-50/90 shadow-[0_4px_24px_rgba(34,48,26,0.10)] backdrop-blur-xl'
            : 'bg-deep/75 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="PlantAtHome home">
            <BrandLogo light={!solid} />
          </Link>

          {/* vertical switcher — the single control for the 3 verticals */}
          <div className="hidden md:block">
            <VerticalSwitcher light={!solid} />
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              solid ? 'text-forest' : 'text-white'
            }`}
          >
            <Link
              href="/corporate-gifting"
              className={`hidden rounded-full px-3 py-2 text-sm font-medium lg:block ${
                solid ? 'hover:text-leaf' : 'hover:text-white/80'
              }`}
            >
              Gifting
            </Link>

            <Link
              href={categoriesHref}
              className={`hidden rounded-full px-3 py-2 text-sm font-medium lg:block ${
                solid ? 'hover:text-leaf' : 'hover:text-white/80'
              }`}
            >
              Categories
            </Link>

            <Link
              href="/garden-service"
              className="mr-1 hidden items-center gap-1.5 rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf/90 lg:inline-flex"
            >
              🌿 Garden Service
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              className={iconBtn}
              aria-label={t('text-search') ?? 'Search'}
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={onProfile}
              className={iconBtn}
              aria-label={isAuthorize ? 'My account' : 'Login'}
            >
              <Icon.user className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={openCart}
              className={`relative ${iconBtn}`}
              aria-label="Cart"
            >
              <Icon.bag className="h-5 w-5" />
              {totalUniqueItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-leaf px-1 text-[10px] font-bold text-white">
                  {totalUniqueItems}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${
                solid ? 'bg-forest text-white' : 'bg-white/15 text-white backdrop-blur'
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
              className="border-t border-forest/10 bg-cream/95 backdrop-blur-xl"
            >
              <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4 sm:px-8">
                <div className="flex-1">
                  <Search label={t('text-search') ?? 'Search'} variant="minimal" />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-forest hover:bg-forest/8"
                  aria-label="Close search"
                >
                  <Icon.x className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* full-screen mobile overlay (prototype) */}
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

            <div className="mb-6 flex rounded-full bg-white/10 p-1">
              {typeList.map((tp) => (
                <Link
                  key={tp.slug}
                  href={tp.slug === homeSlug ? '/' : `/${tp.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={`flex-1 whitespace-nowrap rounded-full py-2 text-center text-sm font-semibold ${
                    currentSlug === tp.slug ? 'bg-leaf text-white' : 'text-white/80'
                  }`}
                >
                  {tp.name}
                </Link>
              ))}
            </div>

            {[
              { label: '🌿 Garden Service', onClick: () => router.push('/garden-service') },
              { label: '🎁 Corporate Gifting', onClick: () => router.push('/corporate-gifting') },
              { label: 'Categories', onClick: () => router.push(categoriesHref) },
              {
                label: 'Search',
                onClick: () => setSearchOpen(true),
              },
              { label: 'Cart', onClick: openCart },
              { label: isAuthorize ? 'My account' : 'Login', onClick: onProfile },
            ].map((l, i) => (
              <motion.button
                key={l.label}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, ease: EXPO }}
                onClick={() => {
                  setMenuOpen(false);
                  l.onClick();
                }}
                className="block border-b border-white/10 py-5 text-left font-heading text-2xl font-bold"
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
