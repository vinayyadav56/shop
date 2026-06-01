import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { scroller } from 'react-scroll';
import HomeLayout from '@/components/layouts/_home';
import Seo from '@/components/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import { getStaticPaths, getStaticProps } from '@/framework/home-pages.ssr';
import { useType } from '@/framework/type';

export { getStaticPaths, getStaticProps };

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false },
);
const Classic = dynamic(() => import('@/components/layouts/classic'));
const Standard = dynamic(() => import('@/components/layouts/standard'));
const Modern = dynamic(() => import('@/components/layouts/modern'));
const Minimal = dynamic(() => import('@/components/layouts/minimal'));
const Compact = dynamic(() => import('@/components/layouts/compact'));
const PlantAtHome = dynamic(() => import('@/components/layouts/plantathome'));

// Single-brand shop: every PlantAtHome vertical (plants/tools/farmbox) renders
// the premium immersive storefront. `classic` + `default` map to it so the
// look is consistent regardless of the type's stored layoutType.
const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: PlantAtHome,
  plantathome: PlantAtHome,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: PlantAtHome,
};
const Home: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables, layout }) => {
  const { query } = useRouter();
  const { width } = useWindowSize();
  const { type } = useType(variables.types.type);

  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo('grid', {
        smooth: true,
        offset: -110,
      });
    }
  }, [query.text, query.category]);

  const Component = MAP_LAYOUT_TO_GROUP[layout];
  return (
    <>
      <Seo title={type?.name} url={type?.slug} images={type?.banners} />
      <Component variables={variables} />
      {!['compact', 'minimal'].includes(layout) && width > 1023 && (
        <CartCounterButton />
      )}
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <HomeLayout layout={page.props.layout}>{page}</HomeLayout>;
};

export default Home;
