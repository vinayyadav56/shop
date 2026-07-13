'use client';

import PrivateRoute from '@/lib/private-route';
import Card from '@/components/ui/cards/card';
import Seo from '@/components/seo/seo';
import WishlistProducts from '@/components/products/wishlist-products';
import { useWindowSize } from '@/lib/use-window-size';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/layouts/_dashboard';

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);
const MyWishlistPage = () => {
  const { width } = useWindowSize();
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="w-full shadow-none sm:shadow">
        <WishlistProducts />
      </Card>
      {width > 767 && <CartCounterButton />}
    </>
  );
};

MyWishlistPage.authenticationRequired = true;

MyWishlistPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyWishlistPage;


/* ── App Router body wrapper (added by port; V1 _app.tsx getLayout semantics) ── */

export function PageBody(props: any) {
  const page = <MyWishlistPage {...props} />;
  const withLayout = (MyWishlistPage as any).getLayout ? (MyWishlistPage as any).getLayout(page) : page;
  return <PrivateRoute>{withLayout}</PrivateRoute>;
}
