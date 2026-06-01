import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { FadeUp, WordReveal, ClipReveal, Counter } from '../motion';

const BENEFITS = [
  {
    icon: Icon.droplet,
    title: 'Cleaner air, naturally',
    text: 'NASA-studied species that filter indoor toxins and lift humidity for easier breathing.',
  },
  {
    icon: Icon.sun,
    title: 'Calmer, focused spaces',
    text: 'Biophilic greenery proven to cut stress and sharpen focus at home and work.',
  },
  {
    icon: Icon.shield,
    title: '30-day healthy guarantee',
    text: 'Every plant arrives thriving — or we replace it free, no questions asked.',
  },
];

const STATS = [
  { value: 12000, divide: 1000, decimals: 0, suffix: 'k+', label: 'Happy customers' },
  { value: 840, divide: 1, decimals: 0, suffix: '+', label: 'Varieties in stock' },
  { value: 4.9, divide: 1, decimals: 1, suffix: '/5', label: 'Average rating' },
  { value: 50, divide: 1, decimals: 0, suffix: '+', label: 'Cities served' },
];

const EDITORIAL_IMG =
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1100&q=80';

export function Benefits() {
  return (
    <section id="benefits" className="bg-mintsoft">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
        <ClipReveal>
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_70px_rgba(31,42,33,0.16)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EDITORIAL_IMG}
              alt="Indoor botanical styling"
              className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[540px]"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur-xl sm:right-auto sm:w-72"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldlight">
                Living interiors
              </div>
              <div className="mt-1 text-sm">
                Foliage, planters & calm green corners — designed to breathe.
              </div>
            </motion.div>
          </div>
        </ClipReveal>
        <div>
          <FadeUp>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Why a plant?
            </p>
          </FadeUp>
          <h2 className="mb-8 font-heading text-4xl font-extrabold leading-tight text-forest sm:text-5xl">
            <WordReveal text="More than décor. A daily dose of calm." />
          </h2>
          <div className="space-y-5">
            {BENEFITS.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(31,42,33,0.05)]">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mint text-forest">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-forest">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#5e6d61]">{b.text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20 lg:pb-24">
        <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-forest px-8 py-12 text-center sm:grid-cols-4">
          {STATS.map((st, i) => (
            <FadeUp key={st.label} delay={i * 0.08}>
              <div className="font-heading text-4xl font-black text-goldlight sm:text-5xl">
                <Counter
                  value={st.value}
                  divide={st.divide}
                  decimals={st.decimals}
                  suffix={st.suffix}
                />
              </div>
              <div className="mt-2 text-xs uppercase tracking-wide text-white/70">
                {st.label}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
