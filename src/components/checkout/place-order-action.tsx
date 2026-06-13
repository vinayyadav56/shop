import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import { useCreateOrder } from '@/framework/order';
import ValidationError from '@/components/ui/validation-error';
import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { getStoredLatLng } from '@/lib/customer-location';
import { useCart } from '@/store/quick-cart/cart.context';
import { checkoutAtom, discountAtom, walletAtom } from '@/store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useLogout, useUser } from '@/framework/user';
import { PaymentGateway } from '@/types';
import { useSettings } from '@/framework/settings';
import { usePincodeServiceability } from '@/lib/use-pincode-serviceability';
import Cookies from 'js-cookie';
import { REVIEW_POPUP_MODAL_KEY } from '@/lib/constants';

export const PlaceOrderAction: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = (props) => {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading } = useCreateOrder();
  const { locale }: any = useRouter();
  const { items } = useCart();
  const { me } = useUser();

  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      verified_response,
      customer_contact,
      customer_name,
      payment_gateway,
      payment_sub_gateway,
      note,
      token,
      payable_amount,
      delivery_verification,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);

  // Hard-block ordering to a non-serviceable pincode (admin allow-list).
  const shippingZip = (shipping_address as any)?.address?.zip as string | undefined;
  const { result: pincodeResult } = usePincodeServiceability(shippingZip);
  const pincodeBlocked = pincodeResult?.serviceable === false;

  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);

  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id),
  );

  const subtotal = calculateTotal(available_items);
  const { settings } = useSettings();
  const freeShippingAmount = settings?.freeShippingAmount;
  const freeShipping = settings?.freeShipping;
  let freeShippings = freeShipping && Number(freeShippingAmount) <= subtotal;
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: verified_response?.total_tax!,
      shipping_charge: verified_response?.shipping_charge!,
    },
    Number(discount),
  );
  const handlePlaceOrder = () => {
    if (!customer_contact) {
      setErrorMessage('Contact Number Is Required');
      return;
    }
    if (pincodeBlocked) {
      setErrorMessage(
        `We don't deliver to ${pincodeResult?.pincode ?? shippingZip} yet. Please use a serviceable delivery address.`,
      );
      return;
    }
    if (!use_wallet_points && !payment_gateway) {
      setErrorMessage('Gateway Is Required');
      return;
    }

    // Fold the optional shared-location check into the order note so it's
    // persisted + visible to admins without an API change.
    let locationLine = '';
    if (delivery_verification) {
      const dv: any = delivery_verification;
      const coords = `${Number(dv.lat).toFixed(5)}, ${Number(dv.lng).toFixed(5)}`;
      if (dv.at_delivery_location === true) {
        locationLine = `📍 Location verified: customer at delivery address (${coords}).`;
      } else if (dv.at_delivery_location === false) {
        const km =
          dv.distance_km != null ? `${Number(dv.distance_km).toFixed(2)} km` : 'unknown';
        locationLine = `⚠️ Location mismatch: customer ~${km} from delivery address (${coords}).`;
      } else {
        locationLine = `📍 Customer location: ${coords} (delivery address has no map coordinates).`;
      }
    }
    const finalNote = [note, locationLine].filter(Boolean).join('\n');

    // P3 matching — persist the customer's coordinates on the order so the admin
    // vendor/delivery-partner matching has precise distances. Prefer the location
    // shared at checkout, then the delivery address's map pin, then the stored one.
    const dvLoc =
      delivery_verification &&
      Number.isFinite(Number((delivery_verification as any).lat)) &&
      Number.isFinite(Number((delivery_verification as any).lng))
        ? { lat: Number((delivery_verification as any).lat), lng: Number((delivery_verification as any).lng) }
        : null;
    const addrLoc = (shipping_address as any)?.address?.location;
    const customerLatLng =
      dvLoc ||
      (addrLoc && Number(addrLoc.lat) && Number(addrLoc.lng)
        ? { lat: Number(addrLoc.lat), lng: Number(addrLoc.lng) }
        : null) ||
      getStoredLatLng();

    const isFullWalletPayment =
      use_wallet_points && payable_amount == 0 ? true : false;
    const gateWay = isFullWalletPayment
      ? PaymentGateway.FULL_WALLET_PAYMENT
      : payment_gateway;

    let input = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      amount: subtotal,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      sales_tax: verified_response?.total_tax,
      delivery_fee: freeShippings ? 0 : verified_response?.shipping_charge,
      total,
      delivery_time: delivery_time?.title,
      customer_contact,
      customer_name,
      note: finalNote,
      payment_gateway: gateWay,
      payment_sub_gateway,
      use_wallet_points,
      isFullWalletPayment,
      billing_address: {
        ...(billing_address?.address && billing_address.address),
      },
      shipping_address: {
        ...(shipping_address?.address && shipping_address.address),
        ...(customerLatLng && { location: customerLatLng }),
      },
    };
    delete input.billing_address.__typename;
    delete input.shipping_address.__typename;
    //@ts-ignore
    createOrder(input);
    Cookies.remove(REVIEW_POPUP_MODAL_KEY);
  };
  const isDigitalCheckout = available_items.find((item) =>
    Boolean(item.is_digital),
  );

  let formatRequiredFields = isDigitalCheckout
    ? [customer_contact, payment_gateway, available_items]
    : [
        customer_contact,
        payment_gateway,
        billing_address,
        shipping_address,
        delivery_time,
        available_items,
      ];
  if (!isDigitalCheckout && !me) {
    formatRequiredFields.push(customer_name);
  }

  const isAllRequiredFieldSelected = formatRequiredFields.every(
    (item) => !isEmpty(item),
  );
  return (
    <>
      <button
        className="pa-place-order-btn"
        onClick={handlePlaceOrder}
        disabled={!isAllRequiredFieldSelected || !!isLoading || pincodeBlocked}
      >
        {isLoading ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
          </svg>
        )}
        {props.children ?? t('text-place-order')}
      </button>
      {pincodeBlocked && (
        <div className="mt-3">
          <ValidationError
            message={`We don't deliver to ${pincodeResult?.pincode ?? shippingZip} yet. Please use a serviceable delivery address.`}
          />
        </div>
      )}
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
      {!isAllRequiredFieldSelected && (
        <div className="mt-3">
          <ValidationError message={t('text-place-order-helper-text')} />
        </div>
      )}
    </>
  );
};
