import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Same-origin IP → city/pincode resolver for the storefront location gate.
 *
 * The client used to fetch ipapi.co directly, which is CORS-blocked from the Vercel origin
 * (no Access-Control-Allow-Origin) → a console error on every fresh visit AND the auto-detect
 * never worked. This route resolves location SERVER-side instead: it prefers Vercel's edge geo
 * headers (no external call), and falls back to a server-side ipapi.co lookup with the visitor's
 * IP (server-side fetch has no CORS). Always fail-safe — returns {} on any error, never throws.
 *
 * Response shape mirrors the ipapi.co fields the client already parses
 * (city, region, region_code, postal, country_name).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, max-age=300');

  const dec = (v?: string | string[]): string | undefined => {
    const s = Array.isArray(v) ? v[0] : v;
    if (!s) return undefined;
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };

  // 1) Vercel edge geo headers — fast, reliable, no external call.
  const vercelCity = dec(req.headers['x-vercel-ip-city']);
  if (vercelCity) {
    return res.status(200).json({
      city: vercelCity,
      region: dec(req.headers['x-vercel-ip-country-region']),
      region_code: dec(req.headers['x-vercel-ip-country-region']),
      postal: undefined, // edge headers don't carry postal; serviceability falls back to city
      country_name: dec(req.headers['x-vercel-ip-country']),
    });
  }

  // 2) Fallback: server-side ipapi.co lookup with the client's IP (no browser CORS).
  try {
    const fwd = (req.headers['x-forwarded-for'] as string) || '';
    const ip = fwd.split(',')[0].trim() || (req.headers['x-real-ip'] as string) || '';
    const url = ip ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : 'https://ipapi.co/json/';
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    if (!r.ok) return res.status(200).json({});
    const j: any = await r.json();
    return res.status(200).json({
      city: j?.city,
      region: j?.region,
      region_code: j?.region_code,
      postal: j?.postal,
      country_name: j?.country_name,
    });
  } catch {
    return res.status(200).json({});
  }
}
