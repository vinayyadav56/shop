// Presentation config for the 3 PlantAtHome verticals.
// Real categories/products come from the API; this holds only the cinematic
// hero scenes, copy and promise bands that aren't stored in the catalogue.

export type VerticalKey = 'plants' | 'tools' | 'farmbox';

export interface PromiseItem {
  icon:
    | 'truck'
    | 'shield'
    | 'spark'
    | 'leaf'
    | 'truckFast'
    | 'droplet'
    | 'sun';
  t: string;
  d: string;
}

export interface VerticalMeta {
  key: VerticalKey;
  label: string;
  /** route base — plants is the home page `/` */
  path: string;
  isHome: boolean;
  tagline: string;
  blurb: string;
  scenes: string[];
  promise: PromiseItem[];
}

export const VERTICALS: Record<VerticalKey, VerticalMeta> = {
  plants: {
    key: 'plants',
    label: 'Plants',
    path: '/plants',
    isHome: true,
    tagline: 'Bring the wild indoors.',
    blurb:
      'Rare foliage, living water-gardens and statement plants — hand-picked by botanists, delivered fresh to your door.',
    scenes: ['/plants-1.jpg', '/plants-2.jpg', '/plants-3.jpg'],
    promise: [
      { icon: 'truck', t: 'Delivered thriving', d: 'Insulated, water-locked packaging keeps roots happy on every mile.' },
      { icon: 'shield', t: '30-day plant guarantee', d: 'If it doesn’t flourish in the first month, we replace it free.' },
      { icon: 'spark', t: 'Lifetime care support', d: 'Chat with our botanists anytime — watering, light, repotting.' },
    ],
  },
  tools: {
    key: 'tools',
    label: 'Tools',
    path: '/tools',
    isHome: false,
    tagline: 'Tools that last a lifetime.',
    blurb:
      'Premium, ergonomic gardening tools and planters — brass, copper and FSC wood, built to be loved for years.',
    scenes: ['/tools-1.jpg', '/tools-2.jpg', '/tools-3.jpg'],
    promise: [
      { icon: 'shield', t: 'Lifetime warranty', d: 'Forged brass & FSC wood — built to be handed down, not thrown away.' },
      { icon: 'spark', t: 'Ergonomic by design', d: 'Balanced, comfortable tools tested by real gardeners.' },
      { icon: 'truckFast', t: 'Free 2-day shipping', d: 'On every tool order above ₹999, across India.' },
    ],
  },
  farmbox: {
    key: 'farmbox',
    label: 'FarmBox',
    path: '/farmbox',
    isHome: false,
    tagline: 'Farm-fresh, every week.',
    blurb:
      'Organic fruits, vegetables and salad greens — harvested at dawn, delivered to your door the same day.',
    scenes: ['/farm-1.jpg', '/farm-2.jpg', '/farm-3.jpg'],
    promise: [
      { icon: 'truckFast', t: 'Harvested at dawn', d: 'Picked the morning of delivery — never cold-stored for weeks.' },
      { icon: 'leaf', t: '100% certified organic', d: 'No pesticides, no chemicals — just clean, honest produce.' },
      { icon: 'shield', t: 'Freshness promise', d: 'Not fresh? Full refund or a replacement box, no questions.' },
    ],
  },
};

export const VERTICAL_LIST = [VERTICALS.plants, VERTICALS.tools, VERTICALS.farmbox];

/** Home hero uses the cinematic luxury penthouse-in-forest scenes. */
export const HOME_SCENES = [
  '/hero-penthouse-1.jpg',
  '/hero-penthouse-2.jpg',
  '/hero-penthouse-3.jpg',
];

export const TRUST_ITEMS = [
  'Same-day metro delivery',
  '30-day plant guarantee',
  'Expert care support',
  'Carbon-neutral packaging',
  'Hand-picked by botanists',
];

export function formatINR(n?: number | null) {
  const v = Number(n ?? 0);
  return '₹' + v.toLocaleString('en-IN');
}

export function isVerticalKey(s?: string | null): s is VerticalKey {
  return s === 'plants' || s === 'tools' || s === 'farmbox';
}
