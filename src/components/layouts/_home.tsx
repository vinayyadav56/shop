import Header from './header';
import HeaderMinimal from './header-minimal';
import Footer from '@/components/layouts/footer';
import dynamic from 'next/dynamic';

const GreenPicker = dynamic(() => import('@/components/storefront/green-picker'), { ssr: false });

const MobileNavigation = dynamic(() => import('./mobile-navigation'), {
  ssr: false,
});

export default function HomeLayout({
  children,
  layout,
}: React.PropsWithChildren<{ layout: string }>) {
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

      {/* reserve space for the fixed mobile bottom nav (h-16) */}
      <div aria-hidden className="h-16 lg:hidden" />

      <GreenPicker />

      <MobileNavigation />
    </div>
  );
}
