'use client';
import Link from 'next/link';
import React from 'react';
import { useSettings, useSubscription } from '@/framework/settings';
import { WordmarkStacked } from '@/components/storefront/logo-mark';

/** Footer matched to the "Grow with us." Web Home reference: newsletter band →
 *  brand + 5 link columns → sustainability badges → bottom bar with payment marks.
 *  Uses the design-system band vars so it still follows the active theme. */

const COLS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { name: 'Indoor Plants', href: '/c/indoor' },
      { name: 'Pots & Planters', href: '/tools' },
      { name: 'Seeds', href: '/c/seeds' },
      { name: 'Fertilizers', href: '/c/fertilizers' },
      { name: 'Garden Tools', href: '/tools' },
    ],
  },
  {
    title: 'Plant Care',
    links: [
      { name: 'Care Guides', href: '/plant-doctor' },
      { name: 'Repotting', href: '/plant-doctor' },
      { name: 'Plant Doctor', href: '/plant-doctor' },
      { name: 'Watering Tips', href: '/plant-doctor' },
      { name: 'Light Guide', href: '/plant-doctor' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Our Story', href: '/contact' },
      { name: 'Sustainability', href: '/garden-service' },
      { name: 'Stores', href: '/contact' },
      { name: 'Careers', href: '/contact' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Track Order', href: '/track-order' },
      { name: 'Shipping & Returns', href: '/terms' },
      { name: 'Bulk & Corporate', href: '/corporate-gifting' },
      { name: 'FAQ', href: '/terms' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
];

const SOCIALS: { name: string; href: string; icon: JSX.Element }[] = [
  { name: 'Instagram', href: 'https://instagram.com', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" /></svg>) },
  { name: 'Facebook', href: 'https://facebook.com', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><path d="M14.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H9v3h2.7v7" /></svg>) },
  { name: 'YouTube', href: 'https://youtube.com', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10.2 9.5l5 2.5-5 2.5Z" fill="currentColor" stroke="none" /></svg>) },
  { name: 'X', href: 'https://x.com', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" /></svg>) },
  { name: 'Pinterest', href: 'https://pinterest.com', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><circle cx="12" cy="12" r="9.5" /><path d="M9.5 17.5 12 8m0 0c2-1.5 4 .2 4 2.4 0 2-1.4 3.6-3.2 3.6-1 0-1.8-.6-1.8-1.6" /></svg>) },
];

const BADGES: { label: string; icon: JSX.Element }[] = [
  { label: 'Peat-free soil & recycled pots', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 5-2 9-2 9" /><path d="M11 20c0-3 1-6 3-8" /></svg>) },
  { label: 'Carbon-neutral delivery', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 17H3V6h11v11" /><path d="M14 9h4l3 3v5h-2" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>) },
  { label: '30-day plant guarantee', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6Z" /><path d="m9 12 2 2 4-4" /></svg>) },
  { label: 'Secure checkout', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>) },
];

// Compact monochrome payment marks (inherit the muted footer ink colour).
const PayMark = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <span aria-label={label} className="inline-flex h-[22px] w-[34px] items-center justify-center rounded-[4px] border border-current/25 text-[8px] font-bold tracking-tight">
    {children}
  </span>
);

function NewsletterForm() {
  const [email, setEmail] = React.useState('');
  const { mutate: subscribe, isLoading, isSubscribed } = useSubscription();
  return (
    <div className="w-full lg:w-[430px]">
      <form
        onSubmit={(e) => { e.preventDefault(); if (email.trim() && !isLoading) subscribe({ email: email.trim() }); }}
        className="flex items-center gap-2.5 rounded-[14px] border border-[color:var(--g-band-hairline)] bg-white/[0.07] py-1.5 pe-1.5 ps-4"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[17px] w-[17px] shrink-0 text-[color:var(--g-band-accent)]" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address" aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-white outline-none placeholder:text-[color:var(--g-band-ink-soft)]"
        />
        <button type="submit" disabled={isLoading} className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-[color:var(--g-cta-from,#2E5E2A)] px-6 py-3 text-[14px] font-bold text-white transition hover:brightness-110 active:scale-[0.97] disabled:opacity-60">
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </button>
      </form>
      <p className="mt-2.5 flex items-center gap-2 text-[12px] text-[color:var(--g-band-ink-soft)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
        We respect your inbox. Unsubscribe anytime.
      </p>
    </div>
  );
}

const Footer = () => {
  const { settings }: any = useSettings();
  const contact = settings?.contactDetails ?? {};
  const email = contact?.emailAddress || settings?.contactEmail || 'hello@plantathome.in';
  const phone = contact?.contact || settings?.contactPhone || '+91 98765 43210';
  const year = new Date().getFullYear();
  const contactRow = 'flex items-center gap-3 text-[13px] text-[color:var(--g-band-ink-soft)]';
  const iconC = 'h-[14px] w-4 shrink-0 text-[color:var(--g-band-accent)]';

  return (
    <footer className="relative overflow-hidden g-footer text-[color:var(--g-band-ink)]">
      {/* faint seedling ornament */}
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="pointer-events-none absolute -top-10 right-12 z-0 h-52 w-52 text-[color:var(--g-band-accent)] opacity-[0.05]"><path d="M11 21A8 8 0 0 1 3 13c0-6 5-10 10-10 0 6-2.5 10-2.5 10S15 11 19 11c0 5-4 9-8 10Z" /></svg>

      {/* newsletter band */}
      <div className="relative z-[1] border-b border-[color:var(--g-band-hairline)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-16 lg:py-[50px]">
          <div className="flex-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[color:var(--g-band-accent)]">Join the plant club</span>
            <h3 className="font-cormorant mt-2.5 text-[2rem] font-medium leading-[1.02] tracking-[0.01em] text-white sm:text-[2.5rem]">Grow with us.</h3>
            <p className="mt-2.5 max-w-[440px] text-[14.5px] leading-relaxed text-[color:var(--g-band-ink-soft)]">Plant care tips, new arrivals, and members-only offers — thoughtfully sent, never spammy.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* main grid: brand + 4 link columns */}
      <div className="relative z-[1] mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-5 py-12 sm:px-8 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-10 lg:px-16 lg:pb-[46px] lg:pt-[54px]">
        {/* brand column */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:max-w-[330px]">
          <WordmarkStacked light className="[&_*]:!text-white" />
          <p className="mt-[18px] text-[13.5px] leading-relaxed text-[color:var(--g-band-ink-soft)]">Easy-care plants, beautiful pots, and everything you need to bring a little wilderness indoors — delivered with care.</p>
          <div className="mt-[22px] flex flex-col gap-2.5">
            <span className={contactRow}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={iconC} aria-hidden><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>Bengaluru, Karnataka, India</span>
            <a href={`tel:${phone}`} className={`${contactRow} transition hover:text-[color:var(--g-band-accent)]`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={iconC} aria-hidden><path d="M5.5 3h3l1.7 4.3-2 1.6a13.5 13.5 0 0 0 6 6l1.6-2L20 14.6v3.1A2.3 2.3 0 0 1 17.7 20 15.8 15.8 0 0 1 4 6.3 2.3 2.3 0 0 1 5.5 3Z" /></svg>{phone}</a>
            <a href={`mailto:${email}`} className={`${contactRow} transition hover:text-[color:var(--g-band-accent)]`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={iconC} aria-hidden><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>{email}</a>
          </div>
          <div className="mt-6 flex items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--g-band-hairline)] text-[color:var(--g-band-ink-soft)] transition hover:border-[color:var(--g-band-accent)] hover:bg-white/[0.08] hover:text-white active:scale-90">{s.icon}</a>
            ))}
          </div>
        </div>

        {/* link columns */}
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--g-band-accent)]">{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.name}><Link href={l.href} className="text-[13.5px] text-[color:var(--g-band-ink-soft)] transition hover:ps-1 hover:text-white">{l.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* sustainability badge strip */}
      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-x-9 gap-y-3 border-t border-[color:var(--g-band-hairline)] bg-white/[0.03] px-5 py-[18px] sm:px-8 lg:px-16">
        {BADGES.map((b) => (
          <span key={b.label} className="flex items-center gap-2.5 text-[13px] text-[color:var(--g-band-ink-soft)]"><span className="text-[color:var(--g-band-accent)]">{b.icon}</span>{b.label}</span>
        ))}
      </div>

      {/* bottom bar */}
      <div className="relative z-[1] mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-[12.5px] sm:px-8 sm:flex-row lg:px-16">
        <span className="text-[color:var(--g-band-ink-soft)]">© {year} Plant At Home. Made in India with care.</span>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="text-[color:var(--g-band-ink-soft)] transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="text-[color:var(--g-band-ink-soft)] transition hover:text-white">Terms</Link>
          <Link href="/track-order" className="text-[color:var(--g-band-ink-soft)] transition hover:text-white">Track Order</Link>
          <span className="h-4 w-px bg-[color:var(--g-band-hairline)]" />
          <div className="flex items-center gap-2 text-[color:var(--g-band-ink-soft)]">
            <PayMark label="Visa"><span className="italic">VISA</span></PayMark>
            <PayMark label="Mastercard"><svg viewBox="0 0 36 22" className="h-3.5 w-auto" aria-hidden><circle cx="14" cy="11" r="7" fill="currentColor" opacity="0.7" /><circle cx="22" cy="11" r="7" fill="currentColor" opacity="0.4" /></svg></PayMark>
            <PayMark label="UPI">UPI</PayMark>
            <PayMark label="RuPay">RuPay</PayMark>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
