import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import HomeShellV2 from '@/components/layouts/v2/home-shell';
import Seo from '@/components/seo/seo';
import { getStaticPaths, getStaticProps } from '@/framework/home-pages.ssr';
import { useType } from '@/framework/type';

export { getStaticPaths, getStaticProps };

const Standard = dynamic(() => import('@/components/layouts/standard'));
const Modern = dynamic(() => import('@/components/layouts/modern'));
const Minimal = dynamic(() => import('@/components/layouts/minimal'));
const Compact = dynamic(() => import('@/components/layouts/compact'));
const HomeV2 = dynamic(() => import('@/components/storefront/v2/home-v2'));

// Revamped storefront (v2): every PlantAtHome vertical renders the modern
// commerce home. classic/plantathome/default all map to it.
const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: HomeV2,
  plantathome: HomeV2,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: HomeV2,
};

const Home: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables, layout }) => {
  const { type } = useType(variables.types.type);
  const Component = MAP_LAYOUT_TO_GROUP[layout] ?? HomeV2;
  return (
    <>
      <Seo title={type?.name} url={type?.slug} images={type?.banners} />
      <Component variables={variables} />
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <HomeShellV2>{page}</HomeShellV2>;
};

export default Home;
