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
              One home for everything green
            </p>
          </FadeUp>
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold leading-tight text-forest sm:text-4xl lg:text-5xl">
            <WordReveal text="Three worlds. One green obsession." />
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {VERTICAL_LIST.map((v, i) => (
            <ClipReveal key={v.key} delay={i * 0.08}>
              <Link href={v.isHome ? '/' : v.path}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-[26rem] overflow-hidden rounded-[1.6rem]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.scenes[0]}
                    alt={v.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldlight">
                      PlantAtHome · {v.label}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-black sm:text-3xl">
                      {v.tagline}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
                      {v.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold backdrop-blur transition group-hover:bg-leaf">
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
