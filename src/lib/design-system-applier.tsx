'use client';
import { useEffect } from 'react';
import { useSettings } from '@/framework/settings';
import { applyDesignSystem } from '@/lib/design-system';

/**
 * Applies the admin-configured Design System (font pairing / accent / density)
 * to the storefront at runtime and persists it for the next load's pre-paint
 * script. Renders nothing. Mounted once in _app.
 */
export default function DesignSystemApplier() {
  const { settings } = useSettings() as any;
  const designSystem = settings?.designSystem;

  useEffect(() => {
    // Apply whenever settings resolve/change. Falls back to the default theme
    // (Cormorant + Manrope) when nothing is configured.
    applyDesignSystem(designSystem, true);
  }, [JSON.stringify(designSystem ?? null)]);

  return null;
}
