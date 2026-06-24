'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

const BottomNav = dynamic(() => import('./bottom-nav').then((m) => m.BottomNav), { ssr: false });

/** Revamped (v2) shell: sticky header + content + footer + mobile bottom nav. */
export default function HomeShellV2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-jakarta text-brand-900 antialiased">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {/* keeps content clear of the fixed mobile bottom nav */}
      <div aria-hidden className="h-[60px] lg:hidden" />
      <BottomNav />
    </div>
  );
}
