import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Seo from '@/components/seo/seo';
import { getStaticPaths, getStaticProps } from '@/framework/home-pages.ssr';
import { useType } from '@/framework/type';

export { getStaticPaths, getStaticProps };

const Standard = dynamic(() => import('@/components/layouts/standard'));
const Modern = dynamic(() => import('@/components/layouts/modern'));
const Minimal = dynamic(() => import('@/components/layouts/minimal'));
const Compact = dynamic(() => import('@/components/layouts/compact'));
const PahHome = dynamic(() => import('@/components/storefront/pah/home'));

// Storefront home faithfully reproduces the Claude Design "PlantAtHome Mobile
// Home". classic/plantathome/default all map to it (it carries its own header +
// bottom nav, so the page uses a bare layout).
const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: PahHome,
  plantathome: PahHome,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: PahHome,
};

const Home: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables, layout }) => {
  const { type } = useType(variables.types.type);
  const Component = MAP_LAYOUT_TO_GROUP[layout] ?? PahHome;
  return (
    <>
      <Seo title={type?.name} url={type?.slug} images={type?.banners} />
      <Component variables={variables} />
    </>
  );
};

// Bare layout: the faithful home renders its own header (in hero) + bottom nav.
Home.getLayout = function getLayout(page) {
  return page;
};

export default Home;
