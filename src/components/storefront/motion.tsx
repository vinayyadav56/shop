import React from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useInView,
  animate,
} from 'framer-motion';

// Premium scroll/reveal motion primitives ported from the PlantAtHome prototype.
// SSR-safe (window access guarded); works in the Next.js pages router.
//
// Reveal-on-scroll uses framer-motion's built-in `whileInView` + `viewport`
// (NOT a manual `useInView`+`animate` toggle, which could leave an element stuck
// in its hidden initial state if the observer didn't fire — that bug left the
// "Three worlds" showcase cards clipped/invisible).

export const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// trigger a touch before the element is fully in view, and only once
const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' } as const;

/* Text-mask word reveal */
export function WordReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '115%' }}
            whileInView={{ y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, delay: delay + i * 0.06, ease: EXPO }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* Fade + slide up on scroll-in */
export function FadeUp({
  children,
  delay = 0,
  y = 30,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, delay, ease: EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Clip-path image/element reveal (cinematic wipe + scale settle) */
export function ClipReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, delay, ease: EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Magnetic button */
export function Magnetic({
  children,
  className = '',
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22 });
  const sy = useSpring(y, { stiffness: 300, damping: 22 });
  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x: sx, y: sy }}
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.button>
  );
}

/* Infinite marquee */
export function Marquee({
  children,
  duration = 24,
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  return (
    <div className="flex overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="flex shrink-0"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* Count-up number */
export function Counter({
  value,
  divide = 1,
  decimals = 0,
  suffix = '',
}: {
  value: number;
  divide?: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 1.7,
      ease: EXPO,
      onUpdate: (x) => setVal(x),
    });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {(val / divide).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* Ken Burns crossfade slideshow — cinematic motion from still images */
const KB_VARIANTS = [
  { scale: [1.08, 1.22], x: ['0%', '-3%'], y: ['0%', '-2%'] },
  { scale: [1.2, 1.06], x: ['-2%', '2%'], y: ['-1%', '1%'] },
  { scale: [1.1, 1.24], x: ['2%', '-1%'], y: ['1%', '-2%'] },
];
export function KenBurns({
  images,
  interval = 6,
  className = '',
}: {
  images: string[];
  interval?: number;
  className?: string;
}) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (reduce || images.length < 2) return;
    const t = setInterval(
      () => setI((p) => (p + 1) % images.length),
      interval * 1000,
    );
    return () => clearInterval(t);
  }, [images.length, interval, reduce]);

  if (reduce) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `url(${images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  }
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <AnimatePresence>
        {(() => {
          const kb = KB_VARIANTS[i % KB_VARIANTS.length];
          return (
            <motion.img
              key={i}
              src={images[i]}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: kb.scale[0], x: kb.x[0], y: kb.y[0] }}
              animate={{ opacity: 1, scale: kb.scale[1], x: kb.x[1], y: kb.y[1] }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.6, ease: 'easeInOut' },
                scale: { duration: interval + 2, ease: 'linear' },
                x: { duration: interval + 2, ease: 'linear' },
                y: { duration: interval + 2, ease: 'linear' },
              }}
            />
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
