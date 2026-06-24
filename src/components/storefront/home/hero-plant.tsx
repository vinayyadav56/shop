'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../icons';
import { EXPO, WordReveal } from '../motion';
import { usePincodeServiceability } from '@/lib/use-pincode-serviceability';

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

const TRUST: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'sprout', title: 'Healthy Plants', sub: 'Carefully Handpicked' },
  { icon: 'truck', title: 'Pan India Delivery', sub: 'Fast & Safe' },
  { icon: 'shield', title: 'Safe Packaging', sub: 'Secure & Reliable' },
];

/** Functional delivery checker wired to the pincode serviceability allow-list. */
function PincodeChecker() {
  const [pincode, setPincode] = React.useState('');
  const [submitted, setSubmitted] = React.useState('');
  const { result, loading, checked } = usePincodeServiceability(submitted);
  const serviceable = result?.serviceable;
  const isFetching = loading;
  return (
    <div className="mt-9 w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(pincode);
        }}
        className="flex items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]"
      >
        <span className="grid h-10 w-9 shrink-0 place-items-center text-[#4E8B31]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
        <input
          value={pincode}
          inputMode="numeric"
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter your pincode"
          aria-label="Delivery pincode"
          className="min-w-0 flex-1 bg-transparent text-[14.5px] text-forest-900 outline-none placeholder:text-stone-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-[#4E8B31] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#3f7327]"
        >
          {isFetching ? 'Checking…' : 'Check Delivery'}
        </button>
      </form>
      {checked ? (
        <p className={`mt-3 pl-1 text-[13px] font-medium ${serviceable ? 'text-[#A8E6B0]' : 'text-amber-200'}`}>
          {serviceable
            ? `✓ Great news — we deliver to ${submitted}.`
            : `${submitted} isn’t in our direct network yet — courier delivery may apply.`}
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 pl-1 text-[13px] text-white/80">
          <span className="text-[#A8E6B0]">✓</span> Delivering to 500+ cities across India
        </p>
      )}
    </div>
  );
}

export function HeroPlant() {
  return (
    <section className="relative -mt-[115px] flex w-full overflow-hidden bg-[#081209]">
      <TourBurns images={TOUR_SCENES} />

      {/* premium green grade — protect the type on the left, reveal the room on the right */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,34,20,0.94)_0%,rgba(8,34,20,0.76)_45%,rgba(8,34,20,0.30)_100%)]" />
      <div className="absolute inset-0 bg-[#0C1F13]/45 lg:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#081209]/85 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-16 pt-[150px] sm:px-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7, ease: EXPO }}
            className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
          >
            <Icon.leaf className="h-3.5 w-3.5 text-[#A8E6B0]" /> India’s Most Loved Plant Store
          </motion.span>

          <h1 className="font-playfair text-[2.9rem] font-bold leading-[1.03] tracking-tight text-white sm:text-[4rem] lg:text-[4.7rem]">
            <WordReveal text="Bring Nature Home." delay={0.1} />
            <span className="block text-[#5FBF6A]">
              <WordReveal text="Live Better." delay={0.32} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.7, ease: EXPO }}
            className="mt-6 max-w-lg text-[15px] leading-7 text-white/85 sm:text-[17px]"
          >
            Premium plants, planters, seeds, fertilizers &amp; everything you need for a thriving green space.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.7, ease: EXPO }}
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            {TRUST.map((f) => {
              const Ico = Icon[f.icon];
              return (
                <div key={f.title} className="flex items-center gap-2.5">
                  <Ico className="h-5 w-5 shrink-0 text-[#A8E6B0]" />
                  <span>
                    <span className="block text-[13px] font-semibold leading-tight text-white">{f.title}</span>
                    <span className="block text-[11px] leading-tight text-white/60">{f.sub}</span>
                  </span>
                </div>
              );
            })}
          </motion.div>

          <PincodeChecker />
        </div>
      </div>

      {/* floating glass offer card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.85, ease: EXPO }}
        className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 lg:block xl:right-20"
      >
        <div className="rounded-[28px] border border-white/20 bg-white/10 px-10 py-9 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
            <Icon.leaf className="h-6 w-6 text-[#A8E6B0]" />
          </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/80">Up To</p>
          <p className="font-playfair text-[3.6rem] font-bold leading-[0.95] text-white">40% OFF</p>
          <p className="mt-1.5 text-[13.5px] text-white/75">On Bestsellers</p>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroPlant;
