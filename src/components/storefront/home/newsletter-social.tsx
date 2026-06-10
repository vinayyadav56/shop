'use client';
import React from 'react';
import Image from 'next/image';
import { Icon } from '../icons';

const SOCIAL = ['/plants-1.jpg', '/plants-2.jpg', '/plants-3.jpg', '/foliage-corner.png', '/editorial-botanical.png'];

export function NewsletterSocial() {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);

  return (
    <section className="bg-sage-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-14">
        {/* newsletter */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-forest-800 sm:text-[13px]">Stay Green, Stay Inspired</h2>
          <p className="mt-3 max-w-md text-[14px] leading-7 text-forest-800/70">
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
              className="h-12 min-w-0 flex-1 rounded-lg border border-kraft-300 bg-white px-4 text-[14px] text-forest-900 outline-none placeholder:text-stone-400 focus:border-forest-500"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-forest-800 text-white transition hover:bg-forest-700"
            >
              <Icon.arrow className="h-5 w-5" />
            </button>
          </form>
          {done && <p className="mt-3 text-[12.5px] font-medium text-forest-700">Thanks — you’re on the list 🌿</p>}
        </div>

        {/* follow us */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-forest-800 sm:text-[13px]">Follow Us @PlantAtHome</h2>
          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
            {SOCIAL.map((src, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-white"
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
