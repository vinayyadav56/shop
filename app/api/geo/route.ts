import { NextRequest, NextResponse } from 'next/server';

/**
 * Same-origin IP → city/pincode resolver for the storefront location gate.
 * App Router port of V1's pages/api/geo.ts — identical behavior: prefer edge
 * geo headers, fall back to a server-side ipapi.co lookup, always fail-safe
 * (returns {} on any error, never throws).
 */
export async function GET(req: NextRequest) {
  const headers = { 'Cache-Control': 'private, max-age=300' };

  const dec = (s: string | null): string | undefined => {
    if (!s) return undefined;
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };

  // 1) Vercel edge geo headers — fast, reliable, no external call.
  const vercelCity = dec(req.headers.get('x-vercel-ip-city'));
  if (vercelCity) {
    return NextResponse.json(
      {
        city: vercelCity,
        region: dec(req.headers.get('x-vercel-ip-country-region')),
        region_code: dec(req.headers.get('x-vercel-ip-country-region')),
        postal: undefined,
        country_name: dec(req.headers.get('x-vercel-ip-country')),
      },
      { headers },
    );
  }

  // 2) Fallback: server-side ipapi.co lookup with the client's IP (no browser CORS).
  try {
    const fwd = req.headers.get('x-forwarded-for') || '';
    const ip = fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
    const url = ip ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : 'https://ipapi.co/json/';
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    if (!r.ok) return NextResponse.json({}, { headers });
    const j: any = await r.json();
    return NextResponse.json(
      {
        city: j?.city,
        region: j?.region,
        region_code: j?.region_code,
        postal: j?.postal,
        country_name: j?.country_name,
      },
      { headers },
    );
  } catch {
    return NextResponse.json({}, { headers });
  }
}
