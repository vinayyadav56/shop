import Link from 'next/link';
import { useSettings } from '@/framework/settings';
import { WordmarkStacked } from '@/components/storefront/logo-mark';

const COLS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { name: 'All Plants', href: '/plants/search' },
      { name: 'Indoor Plants', href: '/plants/search' },
      { name: 'Planters', href: '/tools' },
      { name: 'Plant Care', href: '/plant-doctor' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { name: 'Gifting', href: '/corporate-gifting' },
      { name: 'Corporate', href: '/corporate-gifting' },
      { name: 'Garden Service', href: '/garden-service' },
      { name: 'Plant Doctor', href: '/plant-doctor' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Our Story', href: '/contact' },
      { name: 'Blog', href: '/garden-service' },
      { name: 'Careers', href: '/contact' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Shipping & Delivery', href: '/terms' },
      { name: 'Returns & Refunds', href: '/terms' },
      { name: 'Plant Care Guide', href: '/plant-doctor' },
      { name: 'Track Order', href: '/track-order' },
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

const Footer = () => {
  const { settings }: any = useSettings();
  const contact = settings?.contactDetails ?? {};
  const email = contact?.emailAddress || settings?.contactEmail || 'hello@plantathome.in';
  const phone = contact?.contact || settings?.contactPhone || '+91 98765 43210';
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/20 bg-gradient-to-b from-[#0A1810] to-[#16301A] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:pt-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)_1.2fr]">
          {/* brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:pr-6">
            <WordmarkStacked light />
            <p className="mt-4 max-w-xs text-[13px] leading-6 text-white/60">
              Bringing nature closer to you — curated plants and planters to elevate every home, office and
              lifestyle.
            </p>
            <div className="mt-5 flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="text-white/60 transition hover:text-goldlight"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-goldlight/80">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-[13px] leading-7 text-white/65 transition hover:text-goldlight">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* contact */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-goldlight/80">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-[13px] leading-7 text-white/65 transition hover:text-goldlight">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-sage-300" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                  </svg>
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-[13px] leading-7 text-white/65 transition hover:text-goldlight">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-sage-300" aria-hidden>
                    <path d="M5.5 3h3l1.7 4.3-2 1.6a13.5 13.5 0 0 0 6 6l1.6-2L20 14.6v3.1A2.3 2.3 0 0 1 17.7 20 15.8 15.8 0 0 1 4 6.3 2.3 2.3 0 0 1 5.5 3Z" />
                  </svg>
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12px] text-white/50">© {year} PlantAtHome. All Rights Reserved.</p>
          <div className="flex items-center gap-5 text-[12px] text-white/50">
            <Link href="/terms" className="transition hover:text-goldlight">Terms</Link>
            <Link href="/privacy" className="transition hover:text-goldlight">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
