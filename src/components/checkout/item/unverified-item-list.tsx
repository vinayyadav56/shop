import { useCart } from '@/store/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import ItemCard from './item-card';
import EmptyCartIcon from '@/components/icons/empty-cart';
import usePrice from '@/lib/use-price';
import { ItemInfoRow } from './item-info-row';
import { CheckAvailabilityAction } from '@/components/checkout/check-availability-action';

const UnverifiedItemList = ({ hideTitle = false }: { hideTitle?: boolean }) => {
  const { t } = useTranslation('common');
  const { items, total, isEmpty } = useCart();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  return (
    <div className="pa-order-summary">
      {!hideTitle && (
        <h3 className="pa-order-summary-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C5F2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          {t('text-your-order')}
        </h3>
      )}
      {isEmpty ? (
        <div className="pa-empty-state" style={{ padding: '32px 0' }}>
          <EmptyCartIcon width={100} height={120} />
          <p className="pa-empty-state-sub" style={{ marginTop: 12 }}>
            {t('text-no-products')}
          </p>
        </div>
      ) : (
        items?.map((item) => <ItemCard item={item} key={item.id} />)
      )}
      <div className="mt-3">
        <div className="pa-order-row">
          <span>{t('text-sub-total')}</span>
          <span style={{ fontWeight: 600, color: '#2E6B4A' }}>{subtotal}</span>
        </div>
        <div className="pa-order-row">
          <span>{t('text-tax')}</span>
          <span>{t('text-calculated-checkout')}</span>
        </div>
        <div className="pa-order-row">
          <span>{t('text-estimated-shipping')}</span>
          <span>{t('text-calculated-checkout')}</span>
        </div>
      </div>
      <CheckAvailabilityAction>
        {t('text-check-availability')}
      </CheckAvailabilityAction>
    </div>
  );
};
export default UnverifiedItemList;
