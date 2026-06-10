'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '../icons';
import { KenBurns, EXPO, WordReveal } from '../motion';

// Luxury hero, round 5 — subject-correct media:
// • Backdrop: rain-glistened foliage macro film (Mixkit 1707, frame-verified) dimmed
//   under the deep-emerald gradient = a living texture, not a competing scene.
// • Right panel: gold-framed cinematic frame crossfading VERIFIED luxury
//   plant-styled interiors (the brand subject) via KenBurns.
// Villa stills remain the instant-paint/fallback layer beneath the film.
const BACKDROP_VIDEO = 'https://assets.mixkit.co/videos/1707/1707-1080.mp4';
const BACKDROP_STILLS = ['/hero-villa-interior.jpg', '/hero-villa-exterior.jpg'];
const FRAME_SCENES = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1100&q=78&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1100&q=78&auto=format&fit=crop',
  '/hero-villa-interior.jpg',
];

const FEATURES: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'wind', title: 'Air Purifying', sub: 'Better air, better life' },
  { icon: 'heart', title: 'Stress Relief', sub: 'Creates a calming environment' },
  { icon: 'sprout', title: 'Sustainable Living', sub: 'Good for you and the planet' },
];

export function HeroPlant() {
  const [videoOk, setVideoOk] = React.useState(true);
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  const showVideo = videoOk && !reduce;

  return (
    <section className="relative flex w-full flex-col overflow-hidden bg-[#081209]">
      {/* fallback stills under the film */}
      <div className="absolute inset-0 opacity-50">
        <KenBurns images={BACKDROP_STILLS} interval={9} />
      </div>

      {showVideo && (
        <video
          src={BACKDROP_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoOk(false)}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}

      {/* deep emerald luxury grade + vignette + gold glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#081209]/96 via-[#0E2415]/80 to-[#123018]/55" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#081209]/85 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(42%_55%_at_24%_42%,rgba(227,206,151,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-[540px] w-full max-w-7xl flex-1 items-center gap-12 px-5 py-16 sm:min-h-[600px] sm:px-8 lg:min-h-[660px]">
        {/* copy */}
        <div className="max-w-xl flex-1">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EXPO }}
            className="mb-6 inline-flex w-fit items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.25em] text-goldlight"
          >
            <span className="h-px w-8 bg-goldlight/60" /> India’s Premium Plant Studio
          </motion.span>

          <h1 className="font-cormorant text-[2.6rem] font-medium leading-[1.02] tracking-tight text-white sm:text-[3.6rem] lg:text-[4.4rem]">
            <WordReveal text="Bring Nature" delay={0.1} />
            <span className="block text-goldlight">
              <WordReveal text="Into Your Space" delay={0.35} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: EXPO }}
            className="mt-6 max-w-md text-[14px] leading-7 text-white/75 sm:text-[15.5px]"
          >
            Curated plants and planters to elevate your home, office and lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.7, ease: EXPO }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/plants/search"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-goldlight px-8 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-forest-900 shadow-[0_18px_44px_-16px_rgba(227,206,151,0.55)] transition hover:bg-white"
            >
              Shop Now <Icon.arrow className="h-4 w-4" />
            </Link>
            <Link
              href="/garden-service"
              className="inline-flex items-center justify-center gap-2.5 rounded-md border border-white/30 bg-white/10 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Free Consultation
            </Link>
          </motion.div>
        </div>

        {/* gold-framed cinematic panel — luxury plant interiors (desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: EXPO }}
          className="relative hidden h-[360px] w-[440px] shrink-0 self-center lg:block xl:h-[400px] xl:w-[500px]"
        >
          <div className="absolute -inset-3 rounded-3xl bg-goldlight/10 blur-xl" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-goldlight/40">
            <KenBurns images={FRAME_SCENES} interval={6} />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            <span className="absolute bottom-4 left-4 rounded-md bg-[#081209]/55 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-goldlight backdrop-blur-sm">
              Styled by PlantAtHome
            </span>
          </div>
        </motion.div>
      </div>

      {/* glass feature strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 border-t border-white/12 bg-white/[0.08] backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl flex-col divide-y divide-white/12 px-5 sm:flex-row sm:divide-x sm:divide-y-0 sm:px-8">
          {FEATURES.map((f) => {
            const Ico = Icon[f.icon];
            return (
              <div key={f.title} className="flex flex-1 items-center gap-3.5 py-4 sm:px-6 sm:py-5 sm:first:pl-0">
                <Ico className="h-6 w-6 shrink-0 text-goldlight" />
                <span>
                  <span className="block text-[13px] font-bold leading-tight text-white">{f.title}</span>
                  <span className="block text-[11.5px] leading-tight text-white/60">{f.sub}</span>
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroPlant;
