import Cookies from 'js-cookie';

/**
 * Storefront analytics tracker (Phase 3 — Visitor / Live Activity NOC).
 *
 * RUTHLESSLY fail-safe: every path is wrapped so tracking can NEVER throw into
 * the storefront. Fire-and-forget via navigator.sendBeacon (fetch keepalive
 * fallback) so it never blocks rendering or navigation. Disable instantly with
 * NEXT_PUBLIC_TRACKING_ENABLED='false'.
 */

const ENABLED = process.env.NEXT_PUBLIC_TRACKING_ENABLED !== 'false';
const VID_COOKIE = 'pah_vid';
const SID_KEY = 'pah_sid';
const FLUSH_DELAY = 1200;

type EventInput = { url?: string; label?: string; value?: number; meta?: any };

let queue: any[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let currentUserId: string | number | null = null;

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID();
    }
  } catch {
    /* noop */
  }
  return 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function visitorId(): string {
  try {
    let id = Cookies.get(VID_COOKIE);
    if (!id) {
      id = uuid();
      Cookies.set(VID_COOKIE, id, { expires: 365, sameSite: 'lax' });
    }
    return id;
  } catch {
    return uuid();
  }
}

function sessionId(): string {
  try {
    let s = sessionStorage.getItem(SID_KEY);
    if (!s) {
      s = uuid();
      sessionStorage.setItem(SID_KEY, s);
    }
    return s;
  } catch {
    return '';
  }
}

function endpoint(): string | null {
  // Post SAME-ORIGIN via the Next rewrite (/rest-api/:path* → <API>/api/:path*), NOT the
  // absolute API URL. A cross-origin sendBeacon sends credentials, which the browser rejects
  // when the API replies Access-Control-Allow-Origin:'*' — the CORS error thrown on every page.
  // Same-origin → no preflight, no CORS, and it still proxies to /api/track. track() only ever
  // runs client-side (it guards on `typeof window`), so a relative URL resolves correctly.
  return '/rest-api/track';
}

function send(payload: any): void {
  const url = endpoint();
  if (!url) return;
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(url, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body,
      }).catch(() => {});
    }
  } catch {
    /* tracking must never throw */
  }
}

/** Attach the logged-in user id (advisory — analytics only). */
export function setTrackUser(id: string | number | null | undefined): void {
  currentUserId = id ?? null;
}

export function flush(page?: string): void {
  if (!ENABLED || typeof window === 'undefined' || !queue.length) return;
  try {
    const events = queue;
    queue = [];
    send({
      visitor_id: visitorId(),
      session_id: sessionId(),
      user_id: currentUserId,
      page: page ?? window.location.pathname,
      referrer: document.referrer || null,
      events,
    });
  } catch {
    /* noop */
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_DELAY);
}

export function track(type: string, data: EventInput = {}): void {
  if (!ENABLED || typeof window === 'undefined') return;
  try {
    queue.push({
      type,
      url: data.url ?? window.location.pathname,
      label: data.label,
      value: data.value,
      meta: data.meta,
    });
    scheduleFlush();
  } catch {
    /* noop */
  }
}

/** Classify a path → page_view + the matching funnel step; flush promptly. */
export function trackPage(pathname: string): void {
  if (!ENABLED || typeof window === 'undefined') return;
  try {
    const path = (pathname || window.location.pathname).split('?')[0];
    track('page_view', { url: path });
    if (/\/products\//.test(path)) {
      track('product_view', { url: path });
    } else if (/\/checkout/.test(path)) {
      track('checkout_start', { url: path });
    } else if (/\/orders\/.+\/thank-you/.test(path)) {
      track('payment_complete', { url: path });
    }
    flush(path);
  } catch {
    /* noop */
  }
}

// Capture any queued events when the tab is hidden/closed.
if (typeof window !== 'undefined') {
  try {
    window.addEventListener('pagehide', () => flush());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  } catch {
    /* noop */
  }
}
