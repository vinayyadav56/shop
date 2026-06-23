import Link from 'next/link';
import React from 'react';
import { toast } from 'react-toastify';
import { useSettings } from '@/framework/settings';
import { WordmarkStacked } from '@/components/storefront/logo-mark';
import { useAllCities } from '@/framework/location';

const COLS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { name: 'All Plants', href: '/plants/search' },
      { name: 'Indoor Plants', href: '/c/indoor' },
      { name: 'Outdoor Plants', href: '/c/outdoor' },
      { name: 'Planters & Tools', href: '/tools' },
      { name: 'Pet-friendly', href: '/c/pet-friendly' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { name: 'Corporate Gifting', href: '/corporate-gifting' },
      { name: 'Garden Packages', href: '/garden-service' },
      { name: 'Plant Doctor', href: '/plant-doctor' },
      { name: 'Bulk & B2B', href: '/corporate-gifting' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Our Story', href: '/contact' },
      { name: 'Journal', href: '/garden-service' },
      { name: 'Careers', href: '/contact' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Track Order', href: '/track-order' },
      { name: 'Shipping & Delivery', href: '/terms' },
      { name: 'Returns & Refunds', href: '/terms' },
      { name: 'Care Guide', href: '/plant-doctor' },
    ],
  },
];

const SOCIALS: { name: string; href: string; icon: JSX.Element }[] = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <path d="M14.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H9v3h2.7v7" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.2 9.5l5 2.5-5 2.5Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function NewsletterForm() {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    setDone(true);
    toast.success('You’re on the list — welcome to the garden. 🌿');
    setEmail('');
  };
  return (
    <form onSubmit={onSubmit} className="mt-5 w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-full border border-[color:var(--g-band-hairline)] bg-white/70 p-1.5 pl-4 backdrop-blur">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address for newsletter"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[color:var(--g-band-ink)] placeholder:text-[color:var(--g-band-ink-soft)] focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[color:var(--g-band-accent)] px-5 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
        >
          {done ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>
      <p className="mt-2 pl-1 text-[11px] text-[color:var(--g-band-ink-soft)]">
        Care tips, new arrivals & members-only offers. No spam, ever.
      </p>
    </form>
  );
}

const Footer = () => {
  const { settings }: any = useSettings();
  const contact = settings?.contactDetails ?? {};
  const email = contact?.emailAddress || settings?.contactEmail || 'hello@plantathome.in';
  const phone = contact?.contact || settings?.contactPhone || '+91 98765 43210';
  const year = new Date().getFullYear();
  const { data: cities } = useAllCities();
  const servedCities = (cities ?? []).map((c: any) => c?.name).filter(Boolean).slice(0, 12);

  return (
    <footer className="border-t border-[color:var(--g-band-hairline)] g-footer text-[color:var(--g-band-ink)]">
      {/* Newsletter + brand band */}
      <div className="border-b border-[color:var(--g-band-hairline)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-14">
          <div className="max-w-lg">
            <h2 className="font-cormorant text-[2rem] font-semibold leading-tight text-[color:var(--g-band-ink)] sm:text-[2.5rem]">
              Grow a greener life with us.
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-7 text-[color:var(--g-band-ink-soft)]">
              Hand-picked plants, designer planters and expert care — delivered to your door and
              looked after long after. Join our community of plant parents.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:pt-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)_1.2fr]">
          {/* brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:pr-6">
            <WordmarkStacked light={false} className="[&_*]:!text-[color:var(--g-band-ink)]" />
            <p className="mt-4 max-w-xs text-[13px] leading-6 text-[color:var(--g-band-ink-soft)]">
              Bringing nature closer to you — curated plants and planters to elevate every home,
              office and lifestyle, with a 30-day healthy-arrival promise.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--g-band-hairline)] text-[color:var(--g-band-ink-soft)] transition hover:border-[color:var(--g-band-accent)] hover:text-[color:var(--g-band-accent)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--g-band-accent)]">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-[13px] leading-7 text-[color:var(--g-band-ink-soft)] transition hover:text-[color:var(--g-band-accent)]">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* contact */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--g-band-accent)]">Get in touch</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-[13px] leading-7 text-[color:var(--g-band-ink-soft)] transition hover:text-[color:var(--g-band-accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[color:var(--g-band-accent)]" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                  </svg>
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-[13px] leading-7 text-[color:var(--g-band-ink-soft)] transition hover:text-[color:var(--g-band-accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[color:var(--g-band-accent)]" aria-hidden>
                    <path d="M5.5 3h3l1.7 4.3-2 1.6a13.5 13.5 0 0 0 6 6l1.6-2L20 14.6v3.1A2.3 2.3 0 0 1 17.7 20 15.8 15.8 0 0 1 4 6.3 2.3 2.3 0 0 1 5.5 3Z" />
                  </svg>
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Cities served */}
        {servedCities.length > 0 ? (
          <div className="mt-12 border-t border-[color:var(--g-band-hairline)] pt-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--g-band-accent)]">
              Cities we deliver to
            </h3>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {servedCities.map((name: string) => (
                <span key={name} className="text-[13px] text-[color:var(--g-band-ink-soft)]">
                  {name}
                </span>
              ))}
              <span className="text-[13px] font-medium text-[color:var(--g-band-accent)]">
                & expanding fast
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--g-band-hairline)] pt-6 sm:flex-row">
          <p className="text-[12px] text-[color:var(--g-band-ink-soft)]">© {year} PlantAtHome. All Rights Reserved.</p>
          <div className="flex items-center gap-5 text-[12px] text-[color:var(--g-band-ink-soft)]">
            <Link href="/terms" className="transition hover:text-[color:var(--g-band-accent)]">Terms</Link>
            <Link href="/privacy" className="transition hover:text-[color:var(--g-band-accent)]">Privacy</Link>
            <Link href="/track-order" className="transition hover:text-[color:var(--g-band-accent)]">Track Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
