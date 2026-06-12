import Link from 'next/link';
import { WordmarkStacked } from '@/components/storefront/logo-mark';
import { Icon } from '@/components/storefront/icons';

const COLS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { name: 'All Plants', href: '/plants/search' },
      { name: 'Planters', href: '/tools' },
      { name: 'Plant Care', href: '/plant-doctor' },
      { name: 'Tools', href: '/tools' },
      { name: 'FarmBox', href: '/farmbox' },
      { name: 'Sale', href: '/plants/search' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'FAQs', href: '/help' },
      { name: 'Shipping', href: '/terms' },
      { name: 'Returns', href: '/terms' },
      { name: 'Track Order', href: '/track-order' },
      { name: 'Plant Care Guide', href: '/plant-doctor' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'About',
    links: [
      { name: 'Our Story', href: '/contact' },
      { name: 'Sustainability', href: '/contact' },
      { name: 'Careers', href: '/contact' },
      { name: 'Blog', href: '/garden-service' },
      { name: 'Media', href: '/contact' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/customer-refund-policies' },
      { name: 'Cancellation Policy', href: '/terms' },
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
  {
    name: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.2 20.5 12 11.5" />
        <path d="M10.2 12.8a3.4 3.4 0 1 1 4.9 1.2c-1 .8-2.4.8-3.1-.3" />
      </svg>
    ),
  },
];

const PAYMENTS = ['VISA', 'MasterCard', 'RuPay', 'UPI'];

const Footer = () => {
  return (
    <footer className="border-t border-[#C9A24B]/20 bg-[#0C1F13] text-[#F0EAD8]">
      <div className="mx-auto max-w-[88rem] px-4 pb-8 pt-14 sm:px-6 lg:pt-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[1.5fr_repeat(4,1fr)_1.3fr]">
          {/* (1) brand */}
          <div className="col-span-2 lg:col-span-1 lg:pr-6">
            <WordmarkStacked light />
            <p className="mt-4 max-w-xs text-[12.5px] leading-6 text-[#F0EAD8]/60">
              India&apos;s most loved D2C plant brand, bringing nature into your everyday life.
            </p>
            <div className="mt-5 flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="text-[#F0EAD8]/60 transition hover:text-[#C9A24B]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* (2–5) link columns */}
          {COLS.map((col) => (
            <div key={col.title} className="min-w-0">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C9A24B]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-[12.5px] leading-7 text-[#F0EAD8]/65 transition hover:text-[#D9BC7A]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* (6) secure payments */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C9A24B]">
              Secure Payments
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="rounded bg-white/95 px-2.5 py-1 text-[10.5px] font-bold text-[#12281A]"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#C9A24B]/25 p-3">
              <Icon.lock className="h-4 w-4 shrink-0 text-[#C9A24B]" />
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#F0EAD8]">100% Secure</p>
                <p className="text-[10.5px] text-[#F0EAD8]/55">Your data is safe with us</p>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#C9A24B]/15 pt-5 sm:flex-row">
          <p className="text-[11.5px] text-[#F0EAD8]/45">
            © 2024 Plantahome. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[11.5px] text-[#F0EAD8]/45">
            <Link href="/terms" className="transition hover:text-[#D9BC7A]">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-[#D9BC7A]">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
