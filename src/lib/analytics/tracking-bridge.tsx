import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/framework/user';
import { setTrackUser, trackPage } from '@/lib/analytics/track';

/**
 * Mounts inside the app providers (so useUser/react-query work) and drives
 * storefront analytics: attaches the logged-in user id (advisory) and emits a
 * page view (+ funnel step) on every navigation. Renders nothing; everything is
 * fail-safe inside the tracker.
 */
export default function TrackingBridge() {
  const router = useRouter();
  const { me } = useUser();

  useEffect(() => {
    setTrackUser(me?.id ?? null);
  }, [me?.id]);

  useEffect(() => {
    try {
      trackPage(window.location.pathname);
    } catch {
      /* noop */
    }
    const handle = (url: string) => trackPage(url);
    router.events.on('routeChangeComplete', handle);
    return () => router.events.off('routeChangeComplete', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  return null;
}
