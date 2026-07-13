'use client';

import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NotFound from '@/components/404/404';

export default function NotFoundPage() {
  return <NotFound />;
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
};


/* ── App Router body wrapper (added by port; V1 _app.tsx getLayout semantics) ── */

export function PageBody(props: any) {
  const page = <NotFoundPage {...props} />;
  const withLayout = (NotFoundPage as any).getLayout ? (NotFoundPage as any).getLayout(page) : page;
  return withLayout;
}
