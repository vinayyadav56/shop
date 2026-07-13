'use client';

/**
 * next-seo compat no-op. App Router sets metadata via generateMetadata in the
 * server page files; V1's two seo components (default-seo.tsx, seo.tsx) render
 * nothing here so they can port unchanged.
 */
import * as React from 'react';

export type NextSeoProps = Record<string, any>;

export const NextSeo = (_props: NextSeoProps) => null;
export const DefaultSeo = (_props: NextSeoProps) => null;
export const ProductJsonLd = (_props: any) => null;
export const BreadcrumbJsonLd = (_props: any) => null;
