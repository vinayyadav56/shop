import Link from 'next/link';
import { useSettings } from '@/framework/settings';
import { BrandLogo } from '@/components/storefront/logo-mark';
import { Icon } from '@/components/storefront/icons';

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

const Footer = () => {
  const { settings }: any = useSettings();
  const contact = settings?.contactDetails ?? {};
  const email = contact?.emailAddress || settings?.contactEmail || 'hello@plantathome.in';
  const phone = contact?.contact || settings?.contactPhone || '+91 98765 43210';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
          {/* brand */}
          <div className="lg:pr-6">
            <BrandLogo light />
            <p className="mt-4 max-w-xs text-[13px] leading-6 text-white/60">
              Bringing nature closer to you — curated plants and planters to elevate every home, office and
              lifestyle.
            </p>
          </div>

          {/* link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/80">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-[13px] text-white/65 transition hover:text-white">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* contact */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/80">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-[13px] text-white/65 transition hover:text-white">
                  <Icon.leaf className="h-4 w-4 text-sage-300" /> {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-[13px] text-white/65 transition hover:text-white">
                  <Icon.shield className="h-4 w-4 text-sage-300" /> {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12px] text-white/50">© {year} PlantAtHome. All Rights Reserved.</p>
          <div className="flex items-center gap-5 text-[12px] text-white/50">
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
