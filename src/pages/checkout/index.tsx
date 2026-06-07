import { useTranslation } from 'next-i18next';
import { billingAddressAtom, shippingAddressAtom } from '@/store/checkout';
import dynamic from 'next/dynamic';
import { getLayout } from '@/components/layouts/layout';
import { AddressType } from '@/framework/utils/constants';
import Seo from '@/components/seo/seo';
import { useUser } from '@/framework/user';
import OrderNote from '@/components/checkout/order-note';
export { getStaticProps } from '@/framework/general.ssr';

const ScheduleGrid = dynamic(
  () => import('@/components/checkout/schedule/schedule-grid')
);
const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false }
);
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid')
  // { ssr: false }
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view'),
  { ssr: false }
);
const CheckoutRecommendations = dynamic(
  () =>
    import('@/components/checkout/checkout-recommendations').then(
      (m) => m.CheckoutRecommendations
    ),
  { ssr: false }
);
const DeliveryLocationVerification = dynamic(
  () => import('@/components/checkout/delivery-location-verification'),
  { ssr: false }
);
const CheckoutSteps = dynamic(
  () => import('@/components/checkout/checkout-steps'),
  { ssr: false }
);
const MobileCheckoutBar = dynamic(
  () => import('@/components/checkout/mobile-checkout-bar'),
  { ssr: false }
);

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { me } = useUser();
  const { id, address, profile } = me ?? {};
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="pa-checkout-page">
        <div className="m-auto w-full max-w-5xl mb-6">
          <p className="pa-checkout-eyebrow">Secure checkout</p>
          <h1 className="pa-checkout-page-title">{t('text-checkout')}</h1>
          <p className="pa-checkout-page-sub">Encrypted payment · Free returns · Trusted by gardeners</p>
        </div>

        <div className="m-auto w-full max-w-5xl mb-8">
          <CheckoutSteps />
        </div>

        <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">
            <ContactGrid
              className="pa-checkout-step"
              contact={profile?.contact}
              label={t('text-contact-number')}
              count={1}
            />

            <AddressGrid
              userId={id!}
              className="pa-checkout-step"
              label={t('text-billing-address')}
              count={2}
              //@ts-ignore
              addresses={address?.filter(
                (item) => item?.type === AddressType.Billing
              )}
              //@ts-ignore
              atom={billingAddressAtom}
              type={AddressType.Billing}
            />
            <AddressGrid
              userId={me?.id!}
              className="pa-checkout-step"
              label={t('text-shipping-address')}
              count={3}
              //@ts-ignore
              addresses={address?.filter(
                (item) => item?.type === AddressType.Shipping
              )}
              //@ts-ignore
              atom={shippingAddressAtom}
              type={AddressType.Shipping}
            />
            <ScheduleGrid
              className="pa-checkout-step"
              label={t('text-delivery-schedule')}
              count={4}
            />
            <DeliveryLocationVerification
              count={5}
              label={t('Verify delivery location')}
            />
            <OrderNote count={6} label={t('Order Note')} />
          </div>
          <div className="mt-10 mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
            <RightSideView />
          </div>
        </div>

        {/* premium content: trust strip + product recommendations */}
        <CheckoutRecommendations />
      </div>
      <MobileCheckoutBar />
    </>
  );
}
CheckoutPage.authenticationRequired = true;
CheckoutPage.getLayout = getLayout;
