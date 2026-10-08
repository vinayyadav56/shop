/**
 * /farmbox page copy — the owner's approved mock and spec (2026-10-09), verbatim. UI copy
 * only: products, categories and prices always come from the API.
 *
 * The benefit and promise lines ("Same Day Delivery", "Chemical Free", "No middlemen") are the
 * owner's own claims; nothing in the catalogue states them, so edit them here and only here.
 *
 * Plain module on purpose: no 'use client' and no ui/icon import, so the server loader
 * (loadFarmboxData) can import the query options below. Icons are string keys that the client
 * sections resolve to glyphs. Produce glyphs, never a leaf: a leaf means a PLANT on this site
 * (scripts/check-icon-rules.mjs).
 */

import { CATEGORIES_PER_PAGE } from '@/framework/client/variables';

export type FarmboxIconKey = 'carrot' | 'truck' | 'flask' | 'heart' | 'tractor' | 'basket' | 'package' | 'home';

export interface FarmboxLink {
  label: string;
  href: string;
}

/** An icon + title + one line (hero benefit bar, trust strip, story steps). */
export interface IconCopy {
  icon: FarmboxIconKey;
  t: string;
  d: string;
}

/*
 * The two lists the page renders, as hook options. The server loader prefetches EXACTLY these
 * (plus language), so the categories and combos arrive as server HTML; one object for both
 * sides means the keys can't drift apart.
 */

/** Combos: the vertical's best-sellers, six to a row like /tools. No combo category or tag
 *  exists in either environment yet, so this is every listable FarmBox product. */
export const combosQuery = (type: string) => ({
  type,
  limit: 6,
  orderBy: 'sold_quantity',
  sortedBy: 'DESC',
});

/** Every root category, NOT just the homepage-flagged ones: production flags none, so `home:1`
 *  would hide the section there. Same key as /categories and the old FarmBox landing. */
export const categoriesQuery = (type: string) => ({
  type,
  parent: 'null',
  limit: CATEGORIES_PER_PAGE,
});

export const HERO = {
  eyebrow: 'FarmBox',
  /** The H1, one string; `titleLines` is how the mock breaks it. */
  title: 'Fresh, Natural Goodness at Your Doorstep',
  titleLines: ['Fresh, Natural', 'Goodness', 'at Your Doorstep'],
  sub: 'Farm fresh fruits, vegetables, greens and more, sourced from trusted farms and delivered fresh to your doorstep.',
  primary: { label: 'Shop FarmBox', href: '#categories' } as FarmboxLink,
  /** No video exists, so this scrolls to the four steps below. */
  secondary: { label: 'How it works', href: '#how-it-works' } as FarmboxLink,
  note: ['From Our Farms', 'to Your Home'],
  photo: '/images/farmbox/farmbox-hero.webp',
  photoAlt: 'A wooden crate of fresh vegetables and leafy greens, with tomatoes, carrots and peppers, on a sunlit table',
};

export const HERO_BENEFITS: IconCopy[] = [
  { icon: 'carrot', t: 'Farm Fresh', d: 'Direct from farms' },
  { icon: 'truck', t: 'Same Day Delivery', d: 'In selected cities' },
  { icon: 'flask', t: 'Chemical Free', d: 'Naturally grown' },
  { icon: 'heart', t: 'Healthy Living', d: 'Fresh nutrition for your family' },
];

export const SECTION = {
  categories: {
    title: 'Shop by Category',
    sub: 'Explore our wide range of fresh produce, carefully sourced for a healthier you.',
    viewAll: 'View All Categories',
  },
  combos: {
    title: 'Our FarmBox Combos',
    sub: 'Curated boxes with seasonal fruits, vegetables and greens for a healthier you.',
    viewAll: 'View All Combos',
    empty: 'No FarmBox selections available right now.',
    emptyCta: 'Explore FarmBox Categories',
    error: 'Something went wrong while loading FarmBox.',
    retry: 'Try Again',
  },
};

export const SEASONAL = {
  eyebrow: 'Seasonal Freshness',
  titleLines: ['Seasonal Freshness', 'in Every Box'],
  sub: 'Handpicked seasonal fruits, vegetables and greens, curated to bring natural nutrition to your family.',
  cta: { label: 'Explore Combos', href: '#combos' } as FarmboxLink,
  note: ['Eat Fresh', 'Live Healthy'],
  photo: '/images/farmbox/farmbox-seasonal.webp',
  photoAlt: 'A wooden crate of seasonal fruit and vegetables: oranges, apples, tomatoes, broccoli and greens',
};

export const TRUST: IconCopy[] = [
  { icon: 'tractor', t: 'Direct from Trusted Farms', d: 'No middlemen' },
  { icon: 'truck', t: 'Same Day Delivery', d: 'In selected cities' },
  { icon: 'flask', t: 'Naturally Grown Produce', d: 'Chemical free' },
  { icon: 'heart', t: 'Healthy Living', d: 'Fresh nutrition for your family' },
];

export const STORY = {
  eyebrow: 'Our Promise',
  title: 'From Farm to Your Home',
  sub: 'We work with trusted farmers to bring you the freshest produce, harvested at the right time and delivered with care.',
  steps: [
    { icon: 'tractor', t: 'Sourced', d: 'from trusted farms' },
    { icon: 'basket', t: 'Handpicked', d: 'with care' },
    { icon: 'package', t: 'Hygienically', d: 'packed' },
    { icon: 'home', t: 'Delivered', d: 'to your home' },
  ] as IconCopy[],
  photo: '/images/farmbox/farmbox-farm-story.webp',
  photoAlt: 'Rows of leafy crops on a farm at sunset, with greenhouses beyond',
};
