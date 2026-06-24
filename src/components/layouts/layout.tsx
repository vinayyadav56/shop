import useLayout from '@/lib/hooks/use-layout';
import Header from './header';
import HeaderMinimal from './header-minimal';
import Footer from './footer';
import NoticeHighlightedBar from '@/components/store-notice/notice-highlightedBar';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const GreenPicker = dynamic(() => import('@/components/storefront/green-picker'), { ssr: false });

const MobileNavigation = dynamic(() => import('./mobile-navigation'), {
  ssr: false,
});

export default function SiteLayout({ children }: React.PropsWithChildren<{}>) {
  const { layout } = useLayout();
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col transition-colors duration-150" style={{ background: 'var(--pa-bg)' }}>
      {router.query.slug && <NoticeHighlightedBar />}

      {['minimal', 'compact'].includes(layout) ? (
        <HeaderMinimal layout={layout} />
      ) : (
        <Header layout={layout} />
      )}
      {children}
      <Footer />
      {/* reserve space for the fixed mobile bottom nav (h-16) */}
      <div aria-hidden className="h-16 lg:hidden" />
      <GreenPicker />
      <MobileNavigation />
    </div>
  );
}
export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);
