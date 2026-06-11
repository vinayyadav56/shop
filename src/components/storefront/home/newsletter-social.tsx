'use client';
import React from 'react';
import Image from 'next/image';
import { Icon } from '../icons';

const SOCIAL = [
  'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&q=72&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521334884684-d80222895322?w=500&q=72&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&q=72&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=500&q=72&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=500&q=72&auto=format&fit=crop',
];

export function NewsletterSocial() {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);

  return (
    <section className="relative overflow-hidden g-band">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_70%_20%,var(--g-band-glow),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-14">
        {/* newsletter */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[color:var(--g-band-accent)] sm:text-[13px]">Stay Green, Stay Inspired</h2>
          <p className="mt-3 max-w-md text-[14px] leading-7 text-[color:var(--g-band-ink-soft)]">
            Subscribe to get plant care tips, exclusive offers and more.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setDone(true);
            }}
            className="mt-5 flex max-w-md gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="h-12 min-w-0 flex-1 rounded-lg border border-[color:var(--g-band-hairline)] bg-white/60 px-4 text-[14px] text-[color:var(--g-band-ink)] outline-none backdrop-blur placeholder:opacity-50 focus:border-[color:var(--g-cta-from)]"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="g-cta grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white transition hover:brightness-110"
            >
              <Icon.arrow className="h-5 w-5" />
            </button>
          </form>
          {done && <p className="mt-3 text-[12.5px] font-medium text-[color:var(--g-band-accent)]">Thanks — you’re on the list 🌿</p>}
        </div>

        {/* follow us */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[color:var(--g-band-accent)] sm:text-[13px]">Follow Us @PlantAtHome</h2>
          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
            {SOCIAL.map((src, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-white/40 ring-1 ring-[color:var(--g-band-hairline)] transition hover:ring-[color:var(--g-cta-from)]"
              >
                <Image src={src} alt="PlantAtHome on Instagram" fill sizes="18vw" className="object-cover transition duration-500 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSocial;
