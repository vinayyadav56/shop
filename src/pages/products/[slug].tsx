import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { getLayout } from '@/components/layouts/layout';
import { AttributesProvider } from '@/components/products/details/attributes.context';
import Seo from '@/components/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import ProductQuestions from '@/components/questions/product-questions';
import ProductReviews from '@/components/reviews/product-reviews';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

import { getStaticPaths, getStaticProps } from '@/framework/product.ssr';
export { getStaticPaths, getStaticProps };

const PlantAtHomeProductDetails = dynamic(
  () => import('@/components/products/details/plantathome-details')
);
const BookDetails = dynamic(
  () => import('@/components/products/details/book-details')
);
const ProductCard = dynamic(() => import('@/components/products/cards/card'));
const AboutIncluded = dynamic(
  () => import('@/components/products/details/plantathome/about-included')
);
const CareGuide = dynamic(
  () => import('@/components/products/details/plantathome/care-guide')
);
const StyledSpaces = dynamic(
  () => import('@/components/products/details/plantathome/styled-spaces')
);
const FrequentlyBoughtTogether = dynamic(
  () => import('@/components/products/details/plantathome/frequently-bought-together')
);
const WhyPlantAtHome = dynamic(
  () => import('@/components/products/details/plantathome/why-plantathome')
);
const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);

const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product }: any) => {
  const { width } = useWindowSize();
  const related = (product?.related_products ?? []).filter(
    (r: any) => r.id !== product.id
  );

  return (
    <>
      <Seo
        title={product.name}
        url={product.slug}
        images={!isEmpty(product?.image) ? [product.image] : []}
      />
      <AttributesProvider>
        <div className="min-h-screen overflow-x-hidden bg-[#FAF8F2]">
          {product.type?.slug === 'books' ? (
            <BookDetails product={product} />
          ) : (
            <>
              <PlantAtHomeProductDetails product={product} />

              {/* Frequently Bought Together + Why PlantAtHome */}
              <section className="bg-[#FAF8F2]">
                <div className="mx-auto grid max-w-7xl gap-5 px-5 pb-2 pt-6 sm:px-8 lg:grid-cols-2">
                  <FrequentlyBoughtTogether product={product} />
                  <WhyPlantAtHome />
                </div>
              </section>

              {/* You May Also Like */}
              {related.length > 0 && (
                <section className="bg-[#FAF8F2]">
                  <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="font-poppins flex items-center gap-2 text-[1.4rem] font-bold text-forest-700">
                        You May Also Like
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-forest-500"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
                      </h2>
                      <Link href="/plants/search" className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-600 hover:text-forest-700">
                        View All Plants
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                      {related.slice(0, 6).map((r: any) => (
                        <ProductCard key={r.id} product={r} cardType={r?.type?.slug} />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* About / Video / What's Included */}
              <AboutIncluded product={product} content={product?.description} />

              {/* Care Guide */}
              <CareGuide pa={product?.plant_attribute} />

              {/* Styled in Real Spaces */}
              <StyledSpaces />

              {/* functional reviews + questions (kept) */}
              <ProductReviews
                productId={product?.id}
                productType={product?.type?.slug}
              />
              <ProductQuestions
                productId={product?.id}
                shopId={product?.shop?.id}
                productType={product?.type?.slug}
              />
            </>
          )}
        </div>
        {width > 767 && <CartCounterButton />}
      </AttributesProvider>
    </>
  );
};
ProductPage.getLayout = getLayout;
export default ProductPage;
