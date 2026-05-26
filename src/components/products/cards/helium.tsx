import { Image } from '@/components/ui/image';
import cn from 'classnames';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { productPlaceholder } from '@/lib/placeholders';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';
const AddToCart = dynamic(
  () =>
    import('@/components/products/add-to-cart/add-to-cart').then(
      (module) => module.AddToCart,
    ),
  { ssr: false },
);


type HeliumProps = {
  product: any;
  className?: string;
};

const Helium: React.FC<HeliumProps> = ({ product, className }) => {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const {
    name,
    image,
    unit,
    quantity,
    min_price,
    max_price,
    product_type,
    in_flash_sale,
  } = product ?? {};

  const { price, basePrice, discount } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price!,
    baseAmount: product.price,
  });
  const { price: minPrice } = usePrice({
    amount: min_price,
  });
  const { price: maxPrice } = usePrice({
    amount: max_price,
  });

  const { openModal } = useModalAction();

  function handleProductQuickView() {
    return openModal('PRODUCT_DETAILS', product.slug);
  }

  return (
    <article
      className={twMerge(
        cn(
          'product-card pa-helium cart-type-helium h-full overflow-hidden',
          className
        )
      )}
    >
      <div
        onClick={handleProductQuickView}
        className={cn(
          'relative flex h-48 w-auto items-center justify-center sm:h-64 cursor-pointer',
          query?.pages
            ? query?.pages?.includes('medicine')
              ? 'm-4 mb-0'
              : ''
            : ''
        )}
      >
        <span className="sr-only">{t('text-product-image')}</span>
        <Image
          src={image?.original ?? productPlaceholder}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="block object-contain product-image"
        />
        {discount && (
          <div className="pa-helium-badge absolute top-3 ltr:right-3 rtl:left-3 md:top-4 ltr:md:right-4 rtl:md:left-4">
            {discount}
          </div>
        )}
      </div>

      <header className="relative p-3 md:p-5 md:py-6">
        <h3
          onClick={handleProductQuickView}
          role="button"
          className="pa-helium-name mb-2 truncate"
        >
          {name}
        </h3>
        <p className="text-xs text-muted">{unit}</p>

        <div className="relative flex items-center justify-between mt-7 min-h-6 md:mt-8">
          {product_type.toLowerCase() === 'variable' ? (
            <>
              <div>
                <span className="pa-helium-price text-sm md:text-[15px]">
                  {minPrice}
                </span>
                <span className="text-muted mx-1">-</span>
                <span className="pa-helium-price text-sm md:text-[15px]">
                  {maxPrice}
                </span>
              </div>

              {Number(quantity) > 0 && (
                <button
                  onClick={handleProductQuickView}
                  className="pa-add-btn order-5 sm:order-4"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ltr:mr-1.5 rtl:ml-1.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  <span>{t('text-view')}</span>
                </button>
              )}
            </>
          ) : (
            <>
              <div className="relative">
                {basePrice && (
                  <del className="absolute text-xs italic text-opacity-75 -top-4 text-muted md:-top-5">
                    {basePrice}
                  </del>
                )}
                <span className="pa-helium-price text-sm md:text-base">
                  {price}
                </span>
              </div>

              {Number(quantity) > 0 && (
                <AddToCart data={product} variant="single" counterVariant="helium" />
              )}
            </>
          )}

          {Number(quantity) <= 0 && (
            <div className="px-2 py-1 text-xs bg-red-500 rounded text-light">
              {t('text-out-stock')}
            </div>
          )}
        </div>
      </header>
    </article>
  );
};

export default Helium;
