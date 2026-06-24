'use client';
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../icons';
import { EXPO, WordReveal } from '../motion';
import { usePincodeServiceability } from '@/lib/use-pincode-serviceability';
import { useSettings } from '@/framework/settings';

// Luxury hero, round 6 — a cinematic HOUSE-TOUR sequence through the glass-walled
// greenhouse villa: approach the exterior → step into the living space → linger on
// the glasshouse at dusk. This villa tour is the BUILT-IN DEFAULT; admins can
// override it entirely from Settings → Hero Slides (images/videos + per-slide
// copy/CTA), and the storefront falls back to this tour whenever none are set.
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

type HeroSlideView = {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  overlayOpacity?: number;
};

const str = (v: any): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined;

/**
 * Resolve the hero slides: admin-configured (Settings → Hero Slides) when present
 * and valid, otherwise the built-in villa-tour images. `configured` lets the
 * render path keep the default look byte-for-byte when nothing is set.
 */
function useHeroSlides(): { slides: HeroSlideView[]; configured: boolean } {
  const { settings } = useSettings() as any;
  const raw = settings?.heroSlides;

  if (Array.isArray(raw) && raw.length) {
    const slides = raw
      .map((s: any): HeroSlideView | null => {
        const isVideo = s?.type === 'video';
        const src = isVideo ? s?.video?.original : s?.image?.original;
        if (!src || typeof src !== 'string') return null;
        return {
          type: isVideo ? 'video' : 'image',
          src,
          poster: str(s?.videoPoster?.original),
          headline: str(s?.headline),
          subheadline: str(s?.subheadline),
          ctaText: str(s?.ctaText),
          ctaLink: str(s?.ctaLink),
          overlayOpacity:
            typeof s?.overlayOpacity === 'number' ? s.overlayOpacity : undefined,
        };
      })
      .filter(Boolean) as HeroSlideView[];
    if (slides.length) return { slides, configured: true };
  }

  return {
    slides: TOUR_SCENES.map((src) => ({ type: 'image' as const, src })),
    configured: false,
  };
}

function SlideMedia({
  slide,
  index,
  reduce,
}: {
  slide: HeroSlideView;
  index: number;
  reduce: boolean;
}) {
  const mv = MOVES[index % MOVES.length];
  const common = {
    className: 'absolute inset-0 h-full w-full object-cover',
    initial: { opacity: 0, scale: mv.scale[0], x: mv.x[0], y: mv.y[0] },
    animate: { opacity: 1, scale: mv.scale[1], x: mv.x[1], y: mv.y[1] },
    exit: { opacity: 0 },
    transition: {
      opacity: { duration: 2, ease: 'easeInOut' as const },
      scale: { duration: SCENE_SECONDS + 2.5, ease: 'linear' as const },
      x: { duration: SCENE_SECONDS + 2.5, ease: 'linear' as const },
      y: { duration: SCENE_SECONDS + 2.5, ease: 'linear' as const },
    },
  };
  if (slide.type === 'video') {
    return (
      <motion.video
        key={index}
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={slide.poster}
        {...common}
      >
        <source src={slide.src} type="video/mp4" />
      </motion.video>
    );
  }
  return <motion.img key={index} src={slide.src} alt="" aria-hidden {...common} />;
}

function TourBurns({
  slides,
  active,
  reduce,
}: {
  slides: HeroSlideView[];
  active: number;
  reduce: boolean;
}) {
  const idx = slides.length ? active % slides.length : 0;
  const slide = slides[idx];

  if (reduce) {
    const first = slides[0];
    if (first?.type === 'video' && !first.poster) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          >
            <source src={first.src} type="video/mp4" />
          </video>
        </div>
      );
    }
    const bg = first?.type === 'video' ? first.poster : first?.src;
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {slide ? <SlideMedia slide={slide} index={idx} reduce={reduce} /> : null}
      </AnimatePresence>
    </div>
  );
}

const CHIPS: { icon: keyof typeof Icon; label: string }[] = [
  { icon: 'leaf', label: 'Air Purifying' },
  { icon: 'sprout', label: 'Easy Care' },
  { icon: 'truck', label: 'Fast Delivery' },
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
        <span className="grid h-10 w-9 shrink-0 place-items-center text-[var(--ds-accent)]">
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
          className="shrink-0 rounded-xl bg-[var(--ds-accent)] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#3f7327]"
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

/** Subtle drifting leaf particles for hero atmosphere (low-opacity, slow, non-interactive). */
function LeafParticles() {
  const leaves = [
    { left: '14%', top: '24%', size: 26, delay: 0, dur: 15 },
    { left: '80%', top: '18%', size: 20, delay: 2.5, dur: 19 },
    { left: '58%', top: '68%', size: 22, delay: 5, dur: 17 },
    { left: '34%', top: '78%', size: 16, delay: 1.5, dur: 21 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {leaves.map((l, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(168,230,176,0.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ left: l.left, top: l.top, width: l.size, height: l.size }}
          className="absolute"
          initial={{ opacity: 0 }}
          animate={{ y: [0, -20, 8, 0], x: [0, 12, -8, 0], rotate: [0, 18, -12, 0], opacity: [0, 0.55, 0.5, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </motion.svg>
      ))}
    </div>
  );
}

export function HeroPlant() {
  const { slides, configured } = useHeroSlides();
  const [reduce, setReduce] = React.useState(false);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  React.useEffect(() => {
    if (reduce || slides.length < 2) return;
    const t = setInterval(
      () => setActive((p) => (p + 1) % slides.length),
      SCENE_SECONDS * 1000,
    );
    return () => clearInterval(t);
  }, [slides.length, reduce]);

  const idx = slides.length ? active % slides.length : 0;
  const slide = slides[idx];

  // Copy/CTA overrides only apply when admin-configured slides supply them;
  // otherwise the built-in headline/sub/CTA render exactly as before.
  const headline = configured ? slide?.headline : undefined;
  const subheadline = configured ? slide?.subheadline : undefined;
  const ctaText = configured ? slide?.ctaText : undefined;
  const ctaLink = configured ? slide?.ctaLink : undefined;

  // Overlay darkness: k=1 (default) reproduces the current grade byte-for-byte.
  const k =
    configured && typeof slide?.overlayOpacity === 'number'
      ? Math.max(0, Math.min(100, slide.overlayOpacity)) / 100
      : 1;
  const gradeStyle = {
    background: `linear-gradient(90deg, rgba(8,34,20,${0.94 * k}) 0%, rgba(8,34,20,${0.76 * k}) 45%, rgba(8,34,20,${0.3 * k}) 100%)`,
  };

  return (
    <section className="relative -mt-[115px] flex w-full overflow-hidden bg-[#081209]">
      <TourBurns slides={slides} active={active} reduce={reduce} />
      <LeafParticles />

      {/* premium green grade — protect the type on the left, reveal the room on the right */}
      <div className="absolute inset-0" style={gradeStyle} />
      <div className="absolute inset-0 bg-[#0C1F13]/45 lg:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#081209]/85 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-16 pt-[150px] sm:px-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7, ease: EXPO }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-ds-accent-bright shadow-[0_0_8px_var(--ds-accent-bright)]" /> Live Plants
          </motion.span>

          {headline ? (
            <motion.h1
              key={`h-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="font-heading text-[2.7rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[4rem] lg:text-[4.6rem]"
            >
              {headline}
            </motion.h1>
          ) : (
            <h1 className="font-heading text-[2.7rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[4rem] lg:text-[4.6rem]">
              <WordReveal text="Bring Nature Home." delay={0.1} />
              <span className="block text-ds-accent-bright">
                <WordReveal text="Live Better." delay={0.32} />
              </span>
            </h1>
          )}

          <motion.p
            key={`p-${configured ? idx : 'default'}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: headline ? 0.12 : 0.58, duration: 0.7, ease: EXPO }}
            className="mt-6 max-w-lg text-[15px] leading-7 text-white/85 sm:text-[17px]"
          >
            {subheadline ??
              'Premium plants, planters, seeds, fertilizers & everything you need for a thriving green space.'}
          </motion.p>

          {ctaText && ctaLink ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: EXPO }}
              className="mt-7"
            >
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--ds-accent)] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition hover:bg-[#3f7327]"
              >
                {ctaText} <span aria-hidden>→</span>
              </Link>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.7, ease: EXPO }}
            className="mt-7 flex flex-wrap items-center gap-2.5"
          >
            {CHIPS.map((c) => {
              const Ico = Icon[c.icon];
              return (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-[12px] font-semibold text-forest-900 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)] backdrop-blur"
                >
                  <Ico className="h-3.5 w-3.5 text-ds-accent" /> {c.label}
                </span>
              );
            })}
          </motion.div>

          <PincodeChecker />
        </div>
      </div>

      {/* dark "Limited Time Offer" card — top-right on mobile, centred-right on desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.85, ease: EXPO }}
        className="absolute right-3 top-[104px] z-10 w-[150px] sm:right-8 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 lg:right-20"
      >
        <div className="rounded-[20px] border border-white/15 bg-[#0D3B24]/90 px-5 py-5 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:rounded-[28px] sm:px-10 sm:py-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[12px]">Limited Time Offer</p>
          <p className="font-heading text-[2rem] font-extrabold leading-none text-white sm:text-[3.6rem]">40% OFF</p>
          <p className="mt-1 text-[11px] text-white/75 sm:text-[13.5px]">On Selected Plants</p>
          <Link
            href="/offers"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-ds-accent px-4 py-2 text-[12px] font-semibold text-white transition hover:brightness-110 sm:mt-5 sm:px-6 sm:py-2.5 sm:text-[13px]"
          >
            Shop Now <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroPlant;
