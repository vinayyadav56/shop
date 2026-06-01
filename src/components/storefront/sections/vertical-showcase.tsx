import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeUp, WordReveal, ClipReveal } from '../motion';
import { Icon } from '../icons';
import { VERTICAL_LIST } from '../verticals';

/** Home-only — introduces the three PlantAtHome worlds and links into each. */
export function VerticalShowcase() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <div className="mb-8 text-center sm:mb-12">
          <FadeUp>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              One home, three worlds
            </p>
          </FadeUp>
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold leading-tight text-forest sm:text-4xl lg:text-5xl">
            <WordReveal text="Everything to grow your green life." />
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {VERTICAL_LIST.map((v, i) => (
            <ClipReveal key={v.key} delay={i * 0.08}>
              <Link href={v.isHome ? '/' : v.path}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-80 overflow-hidden rounded-[1.6rem]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.scenes[0]}
                    alt={v.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="font-heading text-2xl font-black">{v.label}</h3>
                    <p className="mt-1 max-w-xs text-sm text-white/80">
                      {v.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-goldlight">
                      Explore {v.label}{' '}
                      <Icon.arrow className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </ClipReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
