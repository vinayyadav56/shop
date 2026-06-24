/* ────────────────────────────────────────────────────────────────────────
   PlantAtHome Design System presets — SHARED between admin (the picker) and
   shop (the runtime applier). Keep this file identical in both apps.
   The chosen ids persist in settings.options.designSystem; the applier resolves
   them to CSS font-family values + a Google Fonts URL, applied via CSS vars.
   ──────────────────────────────────────────────────────────────────────── */

export type FontPairing = {
  id: string;
  name: string;
  heading: string; // CSS font-family value
  body: string; // CSS font-family value
  google: string; // Google Fonts css2 `family=` params (no leading ?)
  stars: number; // 1-5 luxury level
  recommended?: boolean;
};

export type ColorScheme = {
  id: string;
  name: string;
  accent: string; // CTAs, links, eyebrows
  accentSoft: string; // tints / chips / icon badges
  accentInk: string; // accent text on light surfaces
};

export type DesignSystem = {
  fontTheme: { id: string; heading: string; body: string };
  colorTheme: { id: string; accent: string; accentSoft: string; accentInk: string };
  density: 'comfortable' | 'compact';
};

const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'playfair-inter',
    name: 'Playfair Display + Inter',
    heading: `'Playfair Display', ${SERIF}`,
    body: `'Inter', ${SANS}`,
    google: 'family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700',
    stars: 5,
  },
  {
    id: 'cormorant-inter',
    name: 'Cormorant Garamond + Inter',
    heading: `'Cormorant Garamond', ${SERIF}`,
    body: `'Inter', ${SANS}`,
    google: 'family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700',
    stars: 5,
  },
  {
    id: 'dmserif-manrope',
    name: 'DM Serif Display + Manrope',
    heading: `'DM Serif Display', ${SERIF}`,
    body: `'Manrope', ${SANS}`,
    google: 'family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700;800',
    stars: 5,
  },
  {
    id: 'libre-inter',
    name: 'Libre Baskerville + Inter',
    heading: `'Libre Baskerville', ${SERIF}`,
    body: `'Inter', ${SANS}`,
    google: 'family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700',
    stars: 4,
  },
  {
    id: 'merriweather-sourcesans',
    name: 'Merriweather + Source Sans',
    heading: `'Merriweather', ${SERIF}`,
    body: `'Source Sans 3', ${SANS}`,
    google: 'family=Merriweather:wght@400;700;900&family=Source+Sans+3:wght@400;500;600;700',
    stars: 4,
  },
  {
    id: 'lora-manrope',
    name: 'Lora + Manrope',
    heading: `'Lora', ${SERIF}`,
    body: `'Manrope', ${SANS}`,
    google: 'family=Lora:wght@500;600;700&family=Manrope:wght@400;500;600;700;800',
    stars: 4,
  },
  {
    id: 'poppins-poppins',
    name: 'Poppins',
    heading: `'Poppins', ${SANS}`,
    body: `'Poppins', ${SANS}`,
    google: 'family=Poppins:wght@400;500;600;700;800',
    stars: 3,
  },
  {
    id: 'jakarta-jakarta',
    name: 'Plus Jakarta Sans',
    heading: `'Plus Jakarta Sans', ${SANS}`,
    body: `'Plus Jakarta Sans', ${SANS}`,
    google: 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800',
    stars: 4,
  },
  {
    id: 'outfit-inter',
    name: 'Outfit + Inter',
    heading: `'Outfit', ${SANS}`,
    body: `'Inter', ${SANS}`,
    google: 'family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700',
    stars: 4,
  },
  {
    id: 'cormorant-manrope',
    name: 'Cormorant Garamond + Manrope',
    heading: `'Cormorant Garamond', 'Playfair Display', ${SERIF}`,
    body: `'Manrope', 'Inter', ${SANS}`,
    google: 'family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800',
    stars: 5,
    recommended: true,
  },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  { id: 'forest', name: 'Forest (default)', accent: '#4E8B31', accentSoft: '#EAF4E6', accentInk: '#2E5E2A' },
  { id: 'emerald', name: 'Emerald', accent: '#1B7A4B', accentSoft: '#E2F3EB', accentInk: '#125C38' },
  { id: 'pine', name: 'Deep Pine', accent: '#2E5E2A', accentSoft: '#E7EEE2', accentInk: '#1E4023' },
  { id: 'terracotta', name: 'Terracotta', accent: '#C26B45', accentSoft: '#F3E2D8', accentInk: '#A8542F' },
];

export const DENSITIES = [
  { id: 'comfortable', name: 'Comfortable' },
  { id: 'compact', name: 'Compact' },
] as const;

export const DEFAULT_FONT_PAIRING =
  FONT_PAIRINGS.find((p) => p.recommended) ?? FONT_PAIRINGS[FONT_PAIRINGS.length - 1];
export const DEFAULT_COLOR_SCHEME = COLOR_SCHEMES[0];

export const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  fontTheme: {
    id: DEFAULT_FONT_PAIRING.id,
    heading: DEFAULT_FONT_PAIRING.heading,
    body: DEFAULT_FONT_PAIRING.body,
  },
  colorTheme: {
    id: DEFAULT_COLOR_SCHEME.id,
    accent: DEFAULT_COLOR_SCHEME.accent,
    accentSoft: DEFAULT_COLOR_SCHEME.accentSoft,
    accentInk: DEFAULT_COLOR_SCHEME.accentInk,
  },
  density: 'comfortable',
};

export const GOOGLE_FONTS_BASE = 'https://fonts.googleapis.com/css2?';

/** Build the Google Fonts stylesheet URL for a pairing (by id or object). */
export function googleFontsUrl(pairing: FontPairing | string | undefined | null): string | null {
  const p = typeof pairing === 'string' ? FONT_PAIRINGS.find((x) => x.id === pairing) : pairing;
  if (!p) return null;
  return `${GOOGLE_FONTS_BASE}${p.google}&display=swap`;
}

/** Resolve a persisted designSystem (possibly partial) to a complete object. */
export function resolveDesignSystem(raw: any): DesignSystem {
  const fp = FONT_PAIRINGS.find((p) => p.id === raw?.fontTheme?.id) ?? DEFAULT_FONT_PAIRING;
  const cs = COLOR_SCHEMES.find((c) => c.id === raw?.colorTheme?.id) ?? DEFAULT_COLOR_SCHEME;
  const density = raw?.density === 'compact' ? 'compact' : 'comfortable';
  return {
    fontTheme: { id: fp.id, heading: fp.heading, body: fp.body },
    colorTheme: { id: cs.id, accent: cs.accent, accentSoft: cs.accentSoft, accentInk: cs.accentInk },
    density,
  };
}

export const DS_STORAGE_KEY = 'pah-design-system';

/** Inject the Google Fonts <link> for a pairing once (browser only). */
export function ensureFontLoaded(pairingId: string | undefined | null): void {
  if (typeof document === 'undefined' || !pairingId) return;
  const id = `ds-font-${pairingId}`;
  if (document.getElementById(id)) return;
  const href = googleFontsUrl(pairingId);
  if (!href) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/** Apply a (possibly partial) design system to <html> via CSS vars (browser only). */
export function applyDesignSystem(raw: any, persist = true): DesignSystem {
  const ds = resolveDesignSystem(raw);
  if (typeof document === 'undefined') return ds;
  const root = document.documentElement;
  ensureFontLoaded(ds.fontTheme.id);
  root.style.setProperty('--font-heading', ds.fontTheme.heading);
  root.style.setProperty('--font-body', ds.fontTheme.body);
  root.style.setProperty('--ds-accent', ds.colorTheme.accent);
  root.style.setProperty('--ds-accent-soft', ds.colorTheme.accentSoft);
  root.style.setProperty('--ds-accent-ink', ds.colorTheme.accentInk);
  root.setAttribute('data-density', ds.density);
  if (persist) {
    try {
      // Store resolved values + the font URL so the pre-paint script in
      // _document can apply them directly (no config import) without FOUC.
      localStorage.setItem(
        DS_STORAGE_KEY,
        JSON.stringify({
          heading: ds.fontTheme.heading,
          body: ds.fontTheme.body,
          accent: ds.colorTheme.accent,
          accentSoft: ds.colorTheme.accentSoft,
          accentInk: ds.colorTheme.accentInk,
          density: ds.density,
          google: googleFontsUrl(ds.fontTheme.id),
          fontId: ds.fontTheme.id,
          colorId: ds.colorTheme.id,
        }),
      );
    } catch (e) {
      /* ignore */
    }
  }
  return ds;
}

/** The inline pre-paint script (string) — reads DS_STORAGE_KEY and applies CSS
 *  vars + lazy font link on <html> before first paint to avoid FOUC. Embed the
 *  SAME string in both apps' _document.tsx. */
export const DS_PREPAINT_SCRIPT =
  "(function(){try{var s=localStorage.getItem('" +
  DS_STORAGE_KEY +
  "');if(!s)return;var d=JSON.parse(s);var r=document.documentElement;if(d.heading)r.style.setProperty('--font-heading',d.heading);if(d.body)r.style.setProperty('--font-body',d.body);if(d.accent)r.style.setProperty('--ds-accent',d.accent);if(d.accentSoft)r.style.setProperty('--ds-accent-soft',d.accentSoft);if(d.accentInk)r.style.setProperty('--ds-accent-ink',d.accentInk);if(d.density)r.setAttribute('data-density',d.density);if(d.google&&d.fontId){var id='ds-font-'+d.fontId;if(!document.getElementById(id)){var l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href=d.google;document.head.appendChild(l);}}}catch(e){}})();";
