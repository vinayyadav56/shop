import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { useState } from 'react';
import Header from './header';
import HeaderMinimal from './header-minimal';
import Footer from '@/components/layouts/footer';
import { SearchIcon } from '@/components/icons/search-icon';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import dynamic from 'next/dynamic';


const MobileNavigation = dynamic(() => import('./mobile-navigation'), {
  ssr: false,
});

export default function HomeLayout({
  children,
  layout,
}: React.PropsWithChildren<{ layout: string }>) {
  const { t } = useTranslation('common');
  const [, setDisplayMobileHeaderSearch] = useAtom(displayMobileHeaderSearchAtom);

  return (
    <div className="flex min-h-screen flex-col transition-colors duration-150" style={{ background: 'var(--pa-bg)' }}>
      {/* Brand header is fixed + transparent over the hero (see header.tsx) */}
      {['minimal', 'compact'].includes(layout) ? (
        <HeaderMinimal layout={layout} />
      ) : (
        <Header layout={layout} />
      )}

      <main className="min-h-screen flex-1">{children}</main>

      <Footer />


      <MobileNavigation>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-0"
        >
          <span className="sr-only">{t('text-search')}</span>
          <SearchIcon width="17.05" height="18" />
        </motion.button>
      </MobileNavigation>
    </div>
  );
}
