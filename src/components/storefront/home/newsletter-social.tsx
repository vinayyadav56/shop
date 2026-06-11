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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0D3B2E] via-[#13503E] to-[#1B6B50]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_70%_20%,rgba(227,206,151,0.10),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-14">
        {/* newsletter */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-goldlight sm:text-[13px]">Stay Green, Stay Inspired</h2>
          <p className="mt-3 max-w-md text-[14px] leading-7 text-white/60">
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
              className="h-12 min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-goldlight/60"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-goldlight text-forest-900 transition hover:bg-white"
            >
              <Icon.arrow className="h-5 w-5" />
            </button>
          </form>
          {done && <p className="mt-3 text-[12.5px] font-medium text-goldlight">Thanks — you’re on the list 🌿</p>}
        </div>

        {/* follow us */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-goldlight sm:text-[13px]">Follow Us @PlantAtHome</h2>
          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
            {SOCIAL.map((src, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/15 transition hover:ring-goldlight/60"
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
