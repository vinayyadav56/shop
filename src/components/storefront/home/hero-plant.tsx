'use client';
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../icons';
import { EXPO, WordReveal } from '../motion';

// Luxury hero, round 6 — a cinematic HOUSE-TOUR sequence through the glass-walled
// greenhouse villa: approach the exterior → step into the living space → linger on
// the glasshouse at dusk. Built from the user's villa renders + a verified UHD
// glass-house photograph, with slow directional camera moves per scene (a free
// hotlinkable real tour film of this exact subject does not exist — ~450 stock
// clips were previewed; swap TOUR_SCENES for a licensed mp4 if one is provided).
const TOUR_SCENES = [
  '/hero-emerald.jpg', // open: emerald room, arched window, monstera (user's pick)
  '/hero-villa-interior.jpg', // inside: jungle living room
  '/hero-villa-exterior.jpg', // approach: glass villa in the forest
  '/hero-glasshouse-dusk.jpg', // dusk: glass walls glowing (2560px)
];

// Per-scene choreography: alternating push-in / pull-back + lateral drift, slow
// 2s crossfades — reads like a steadicam walkthrough rather than a slideshow.
const MOVES = [
  { scale: [1.18, 1.02], x: ['3%', '-2%'], y: ['1%', '-1%'] }, // dolly forward
  { scale: [1.04, 1.2], x: ['-2%', '2%'], y: ['-1%', '1%'] }, // push toward the green
  { scale: [1.16, 1.04], x: ['2%', '-2%'], y: ['1.5%', '-1%'] }, // settle on the glow
  { scale: [1.2, 1.04], x: ['-2.5%', '2%'], y: ['1%', '-1.5%'] }, // drift past the window
];
const SCENE_SECONDS = 8;

function TourBurns({ images }: { images: string[] }) {
  const [reduce, setReduce] = React.useState(false);
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  React.useEffect(() => {
    if (reduce || images.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % images.length), SCENE_SECONDS * 1000);
    return () => clearInterval(t);
  }, [images.length, reduce]);

  if (reduce) {
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
    );
  }
  const mv = MOVES[i % MOVES.length];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={i}
          src={images[i]}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: mv.scale[0], x: mv.x[0], y: mv.y[0] }}
          animate={{ opacity: 1, scale: mv.scale[1], x: mv.x[1], y: mv.y[1] }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 2, ease: 'easeInOut' },
            scale: { duration: SCENE_SECONDS + 2.5, ease: 'linear' },
            x: { duration: SCENE_SECONDS + 2.5, ease: 'linear' },
            y: { duration: SCENE_SECONDS + 2.5, ease: 'linear' },
          }}
        />
      </AnimatePresence>
    </div>
  );
}

const FEATURES: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'wind', title: 'Air Purifying', sub: 'Better air, better life' },
  { icon: 'heart', title: 'Stress Relief', sub: 'Creates a calming environment' },
  { icon: 'sprout', title: 'Sustainable Living', sub: 'Good for you and the planet' },
];

export function HeroPlant() {
  return (
    <section className="relative -mt-[88px] flex w-full flex-col overflow-hidden bg-[#081209]">
      {/* the tour */}
      <TourBurns images={TOUR_SCENES} />

      {/* light luxury grade — protect the type, let the architecture read */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#081209]/90 via-[#0E2415]/55 to-transparent" />
      <div className="absolute inset-0 bg-[#0C1F13]/35 sm:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#081209]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(42%_55%_at_22%_42%,rgba(227,206,151,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-[540px] w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 sm:min-h-[600px] sm:px-8 lg:min-h-[660px]">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: EXPO }}
          className="mb-6 inline-flex w-fit items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.25em] text-goldlight"
        >
          <span className="h-px w-8 bg-goldlight/60" /> India’s Premium Plant Studio
        </motion.span>

        <h1 className="max-w-3xl font-cormorant text-[2.6rem] font-medium leading-[1.02] tracking-tight text-white sm:text-[3.6rem] lg:text-[4.6rem]">
          <WordReveal text="Bring Nature" delay={0.1} />
          <span className="block text-goldlight">
            <WordReveal text="Into Your Space" delay={0.35} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: EXPO }}
          className="mt-6 max-w-md text-[14px] leading-7 text-white/80 sm:text-[15.5px]"
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
