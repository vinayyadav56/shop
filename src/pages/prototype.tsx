import React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  animate,
  AnimatePresence,
} from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   PlantAtHome — Premium D2C prototype (standalone /prototype)
   Cinematic video hero · forest-green + cream + gold · rich motion
   ──────────────────────────────────────────────────────────────────────────── */

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STAGGER = 0.08;

// Nature/water hero video (Pexels, hotlinkable). Swap among verified alternates:
// 1526909 · 2098989 · 3015510 · 2169880 · 3765078 · 1918465 · 5752729
const HERO_VIDEO = 'https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4';
const HERO_VIDEO_ALT = 'https://videos.pexels.com/video-files/1526909/1526909-hd_1920_1080_24fps.mp4';
const HERO_POSTER = '/hero-poster.png';
const EDITORIAL_IMG = '/editorial-botanical.png';

// ─── Inline SVG icons ──────────────────────────────────────────────────────────
type Ico = React.SVGProps<SVGSVGElement>;
const I = {
  leaf: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>),
  truck: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 17H3V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3" /><polygon points="9 17 9 11 19 11 22 14 22 17 9 17" /><circle cx="13.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>),
  shield: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><polyline points="9 12 11 14 15 10" /></svg>),
  star: (p: Ico) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
  arrow: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
  bag: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>),
  menu: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>),
  x: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
  play: (p: Ico) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="6 3 20 12 6 21 6 3" /></svg>),
  droplet: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2.7s6 5.7 6 10.3a6 6 0 0 1-12 0c0-4.6 6-10.3 6-10.3Z" /></svg>),
  sun: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></svg>),
  spark: (p: Ico) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" /></svg>),
  quote: (p: Ico) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 7h4v6a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2H7V7Zm8 0h4v6a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2h-2V7Z" /></svg>),
};

// ─── Data ───────────────────────────────────────────────────────────────────────
const NAV = ['Collection', 'Why Plants', 'Bestsellers', 'Care', 'Reviews'];

const featured = [
  { name: 'Monstera Deliciosa', price: '₹1,499', mrp: '₹1,999', tag: 'Statement foliage', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Fiddle Leaf Fig', price: '₹1,799', mrp: '₹2,299', tag: 'The designer favourite', img: 'https://images.unsplash.com/photo-1597055181300-e3633a917b6f?auto=format&fit=crop&w=900&q=80' },
  { name: 'Areca Palm', price: '₹999', mrp: '₹1,299', tag: 'Tropical & air-purifying', img: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=900&q=80' },
];

const bestsellers = [
  { name: 'Snake Plant', price: '₹699', rating: 4.9, img: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=700&q=80' },
  { name: 'Golden Pothos', price: '₹349', rating: 4.8, img: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=700&q=80' },
  { name: 'Peace Lily', price: '₹549', rating: 4.9, img: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=700&q=80' },
  { name: 'ZZ Plant', price: '₹499', rating: 4.7, img: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=700&q=80' },
  { name: 'Aloe Vera', price: '₹299', rating: 4.8, img: 'https://images.unsplash.com/photo-1509423350716-97f2360af2e4?auto=format&fit=crop&w=700&q=80' },
  { name: 'Money Plant', price: '₹249', rating: 4.9, img: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=700&q=80' },
];

const benefits = [
  { icon: I.droplet, title: 'Cleaner air, naturally', text: 'NASA-studied species that filter indoor toxins and lift humidity for easier breathing.' },
  { icon: I.sun, title: 'Calmer, focused spaces', text: 'Biophilic greenery proven to cut stress and sharpen focus at home and work.' },
  { icon: I.shield, title: '30-day healthy guarantee', text: 'Every plant arrives thriving — or we replace it free, no questions asked.' },
];

const stats = [
  { value: 12000, suffix: '+', label: 'Happy plant parents' },
  { value: 400, suffix: '+', label: 'Curated varieties' },
  { value: 24, suffix: 'h', label: 'Fresh dispatch' },
  { value: 49, divide: 10, decimals: 1, suffix: '★', label: 'Average rating' },
];

const testimonials = [
  { name: 'Ananya R.', city: 'Bengaluru', quote: 'My living room finally feels alive. The Monstera arrived bigger and healthier than I imagined.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { name: 'Rohan M.', city: 'Mumbai', quote: 'Packaging was unreal — not a single leaf bent. This is how premium plant delivery should feel.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { name: 'Priya S.', city: 'Delhi', quote: 'The care guide and reminders kept my notoriously brown thumb in check. Everything is thriving.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
];

const trust = ['Same-day metro delivery', '30-day plant guarantee', 'Expert care support', 'Carbon-neutral packaging', 'Hand-picked by botanists'];

// ─── Motion helpers ─────────────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div style={{ scaleX: sx, transformOrigin: 'left' }} className="fixed top-0 inset-x-0 z-[60] h-[3px] bg-[#b58e39]" />;
}

function WordReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span className="inline-block" initial={{ y: '110%' }} animate={inView ? { y: 0 } : {}} transition={{ duration: 0.8, delay: delay + i * 0.06, ease: EXPO }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function FadeUp({ children, delay = 0, className = '', y = 30 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: EXPO }} className={className}>
      {children}
    </motion.div>
  );
}

function Magnetic({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22 }); const sy = useSpring(y, { stiffness: 300, damping: 22 });
  return (
    <motion.button
      ref={ref} style={{ x: sx, y: sy }} className={className} onClick={onClick} whileTap={{ scale: 0.96 }}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - (r.left + r.width / 2)) * 0.35); y.set((e.clientY - (r.top + r.height / 2)) * 0.35); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >{children}</motion.button>
  );
}

function Counter({ value, divide = 1, decimals = 0, suffix = '' }: { value: number; divide?: number; decimals?: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.6, ease: EXPO, onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [inView, value]);
  const display = (val / divide).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref}>{display}{suffix}</span>;
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white text-[#20362b]' : 'bg-[#20362b] text-white'}`}><I.leaf className="h-5 w-5" /></span>
      <span className={`font-heading text-[15px] font-extrabold tracking-[0.18em] uppercase ${light ? 'text-white' : 'text-[#20362b]'}`}>PlantAtHome</span>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
function Prototype() {
  const heroRef = React.useRef(null);
  const [menu, setMenu] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  React.useEffect(() => scrollY.on('change', (v) => setScrolled(v > 40)), [scrollY]);

  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const vidY = useTransform(heroProg, [0, 1], [0, 180]);
  const vidScale = useTransform(heroProg, [0, 1], [1, 1.15]);
  const contentY = useTransform(heroProg, [0, 1], [0, 90]);
  const cardA = useTransform(heroProg, [0, 1], [0, -60]);
  const cardB = useTransform(heroProg, [0, 1], [0, 50]);
  const heroFade = useTransform(heroProg, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#f5f2ea] font-body text-[#1f2a21] antialiased">
      <ScrollBar />

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: EXPO }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#f5f2ea]/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,33,0.08)]' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className={scrolled ? 'text-[#20362b]' : 'text-white'}>
            <div className="flex items-center gap-2.5">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${scrolled ? 'bg-[#20362b] text-white' : 'bg-white/15 text-white backdrop-blur'}`}><I.leaf className="h-5 w-5" /></span>
              <span className="font-heading text-[15px] font-extrabold tracking-[0.18em] uppercase">PlantAtHome</span>
            </div>
          </div>
          <nav className={`hidden items-center gap-9 text-sm font-medium md:flex ${scrolled ? 'text-[#46554a]' : 'text-white/90'}`}>
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase().replace(/\s/g, '-')}`} className="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#b58e39] after:transition-all hover:after:w-full">{n}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Magnetic className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition md:inline-flex ${scrolled ? 'bg-[#20362b] text-white' : 'bg-white text-[#20362b]'}`}>
              <I.bag className="h-4 w-4" /> Shop now
            </Magnetic>
            <button onClick={() => setMenu(true)} className={`rounded-full p-2.5 md:hidden ${scrolled ? 'bg-[#20362b] text-white' : 'bg-white/15 text-white backdrop-blur'}`}><I.menu className="h-5 w-5" /></button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex flex-col bg-[#20362b] p-7 text-white">
            <div className="mb-12 flex items-center justify-between"><Brand light /><button onClick={() => setMenu(false)}><I.x className="h-6 w-6" /></button></div>
            {NAV.map((n, i) => (
              <motion.a key={n} href={`#${n.toLowerCase().replace(/\s/g, '-')}`} onClick={() => setMenu(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07, ease: EXPO }} className="border-b border-white/10 py-5 font-heading text-2xl font-bold">{n}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero (cinematic video) ── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <motion.div style={{ y: vidY, scale: vidScale }} className="absolute inset-0">
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={HERO_POSTER}>
            <source src={HERO_VIDEO} type="video/mp4" />
            <source src={HERO_VIDEO_ALT} type="video/mp4" />
          </video>
          <img src={HERO_POSTER} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover" />
        </motion.div>
        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1a12] via-[#0e1a12]/35 to-[#0e1a12]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1a12]/75 via-transparent to-transparent" />

        <motion.div style={{ y: contentY, opacity: heroFade }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EXPO }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
            <I.spark className="h-3.5 w-3.5 text-[#d8c08a]" /> India’s premium plant studio
          </motion.span>

          <h1 className="max-w-4xl font-heading text-[12vw] font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
            <WordReveal text="Bring the wild" delay={0.15} />
            <span className="block text-[#d8c08a]"><WordReveal text="indoors." delay={0.5} /></span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7, ease: EXPO }}
            className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Lush, healthy plants — water gardens, foliage and rare finds — hand-picked by botanists and delivered fresh to your door across India.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.84, duration: 0.7, ease: EXPO }} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic className="inline-flex items-center gap-2 rounded-full bg-[#b58e39] px-7 py-4 text-sm font-bold text-[#1a1407] shadow-[0_14px_40px_rgba(181,142,57,0.4)]">
              Shop the collection <I.arrow className="h-4 w-4" />
            </Magnetic>
            <Magnetic className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md">
              <I.play className="h-3.5 w-3.5" /> Watch the story
            </Magnetic>
          </motion.div>

          {/* trust pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="mt-10 flex flex-wrap gap-2.5">
            {['Same-day delivery', '30-day guarantee', 'Botanist-picked'].map((t) => (
              <span key={t} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md">{t}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* floating glass stat cards w/ parallax */}
        <motion.div style={{ y: cardA, opacity: heroFade }} className="absolute right-8 top-[28%] z-10 hidden w-52 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl lg:block">
          <div className="font-heading text-3xl font-black text-white">12k+</div>
          <div className="mt-1 text-xs text-white/75">happy plant parents across India</div>
        </motion.div>
        <motion.div style={{ y: cardB, opacity: heroFade }} className="absolute bottom-[16%] right-[16%] z-10 hidden items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl lg:flex">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b58e39] text-[#1a1407]"><I.star className="h-5 w-5" /></span>
          <div><div className="font-heading text-lg font-extrabold text-white">4.9 / 5</div><div className="text-[11px] text-white/70">12,000+ reviews</div></div>
        </motion.div>

        {/* scroll cue */}
        <motion.div style={{ opacity: heroFade }} className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/70">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <span className="h-9 w-[1.5px] bg-gradient-to-b from-white/70 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Trust marquee ── */}
      <div className="border-y border-[#20362b]/10 bg-[#20362b] py-4 text-white">
        <div className="flex overflow-hidden">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="flex shrink-0 items-center gap-10 pr-10 text-sm font-medium uppercase tracking-[0.2em] text-[#c8dbbf]">
            {[...trust, ...trust].map((t, i) => (<span key={i} className="flex items-center gap-10"><I.leaf className="h-4 w-4 text-[#b58e39]" />{t}</span>))}
          </motion.div>
        </div>
      </div>

      {/* ── Featured collection ── */}
      <section id="collection" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <FadeUp><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#b58e39]">Featured collection</p></FadeUp>
            <h2 className="max-w-xl font-heading text-4xl font-extrabold leading-tight text-[#20362b] sm:text-5xl"><WordReveal text="Signature plants, styled to impress." /></h2>
          </div>
          <FadeUp delay={0.1}><a href="#bestsellers" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#20362b]">View all <I.arrow className="h-4 w-4 transition group-hover:translate-x-1" /></a></FadeUp>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p, i) => (
            <FadeUp key={p.name} delay={i * STAGGER}>
              <motion.article whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: EXPO }} className="group overflow-hidden rounded-[1.6rem] bg-white shadow-[0_20px_50px_rgba(31,42,33,0.08)]">
                <div className="relative h-80 overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#20362b]">{p.tag}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-[#20362b]">{p.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2"><span className="text-xl font-extrabold text-[#b58e39]">{p.price}</span><span className="text-sm text-[#9aa69b] line-through">{p.mrp}</span></div>
                    <Magnetic className="grid h-11 w-11 place-items-center rounded-full bg-[#20362b] text-white transition group-hover:bg-[#b58e39] group-hover:text-[#1a1407]"><I.bag className="h-5 w-5" /></Magnetic>
                  </div>
                </div>
              </motion.article>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Why plants (editorial split + benefits + stats) ── */}
      <section id="why-plants" className="bg-[#eef2e8]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_70px_rgba(31,42,33,0.14)]">
              <img src={EDITORIAL_IMG} alt="Indoor botanical water garden" className="h-[520px] w-full object-cover" />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur-xl sm:right-auto sm:w-72">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8c08a]">Living interiors</div>
                <div className="mt-1 text-sm">Water gardens, foliage & koi-calm corners — designed to breathe.</div>
              </motion.div>
            </div>
          </FadeUp>
          <div>
            <FadeUp><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#b58e39]">Why a plant?</p></FadeUp>
            <h2 className="mb-8 font-heading text-4xl font-extrabold leading-tight text-[#20362b] sm:text-5xl"><WordReveal text="More than décor. A daily dose of calm." /></h2>
            <div className="space-y-5">
              {benefits.map((b, i) => (
                <FadeUp key={b.title} delay={i * STAGGER}>
                  <div className="flex gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(31,42,33,0.05)]">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eef6ea] text-[#20362b]"><b.icon className="h-6 w-6" /></span>
                    <div><h3 className="font-heading text-lg font-bold text-[#20362b]">{b.title}</h3><p className="mt-1 text-sm leading-6 text-[#5e6d61]">{b.text}</p></div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
        {/* stats */}
        <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-[#20362b] px-8 py-12 text-center sm:grid-cols-4">
            {stats.map((s, i) => (
              <FadeUp key={s.label} delay={i * STAGGER}>
                <div className="font-heading text-4xl font-black text-[#d8c08a] sm:text-5xl"><Counter value={s.value} divide={s.divide} decimals={s.decimals} suffix={s.suffix} /></div>
                <div className="mt-2 text-xs uppercase tracking-wide text-white/70">{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers ── */}
      <section id="bestsellers" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <FadeUp><p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#b58e39]">Loved by 12,000+ homes</p></FadeUp>
        <h2 className="mx-auto mb-12 max-w-2xl text-center font-heading text-4xl font-extrabold leading-tight text-[#20362b] sm:text-5xl"><WordReveal text="This week’s bestsellers" /></h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {bestsellers.map((p, i) => (
            <FadeUp key={p.name} delay={(i % 6) * 0.05}>
              <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(31,42,33,0.07)]">
                <div className="relative h-40 overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-3.5">
                  <h3 className="truncate text-sm font-semibold text-[#20362b]">{p.name}</h3>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#b58e39]">{p.price}</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#6b786f]"><I.star className="h-3 w-3 text-[#b58e39]" />{p.rating}</span>
                  </div>
                </div>
              </motion.article>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Care promise strip ── */}
      <section id="care" className="bg-[#20362b] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-3">
          {[
            { icon: I.truck, t: 'Delivered thriving', d: 'Insulated, water-locked packaging keeps roots happy on every mile.' },
            { icon: I.shield, t: '30-day guarantee', d: 'If it doesn’t flourish in the first month, we replace it free.' },
            { icon: I.spark, t: 'Lifetime care support', d: 'Chat with our botanists anytime — watering, light, repotting, all of it.' },
          ].map((c, i) => (
            <FadeUp key={c.t} delay={i * STAGGER}>
              <div className="flex flex-col gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#d8c08a]"><c.icon className="h-7 w-7" /></span>
                <h3 className="font-heading text-xl font-bold">{c.t}</h3>
                <p className="text-sm leading-6 text-white/70">{c.d}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="reviews" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <FadeUp><p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#b58e39]">Reviews</p></FadeUp>
        <h2 className="mx-auto mb-14 max-w-2xl text-center font-heading text-4xl font-extrabold text-[#20362b] sm:text-5xl"><WordReveal text="Plant parents, in their words" /></h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * STAGGER}>
              <div className="flex h-full flex-col rounded-[1.6rem] bg-white p-7 shadow-[0_18px_40px_rgba(31,42,33,0.07)]">
                <I.quote className="h-8 w-8 text-[#e1d4b3]" />
                <p className="mt-4 flex-1 text-[15px] leading-7 text-[#3a4a3e]">“{t.quote}”</p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#eee7d8] pt-5">
                  <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  <div><div className="text-sm font-bold text-[#20362b]">{t.name}</div><div className="text-xs text-[#8a958c]">{t.city}</div></div>
                  <div className="ml-auto flex gap-0.5 text-[#b58e39]">{Array.from({ length: 5 }).map((_, k) => <I.star key={k} className="h-3.5 w-3.5" />)}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Editorial CTA ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#16241b]">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-10 sm:p-14">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d8c08a]">The PlantAtHome ritual</p>
              <h2 className="font-heading text-4xl font-black leading-tight text-white sm:text-5xl"><WordReveal text="More than a store. A botanical ritual." /></h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/70">Start your green journey with a curated box, expert onboarding, and a community of 12,000+ plant parents.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Magnetic className="rounded-full bg-[#b58e39] px-7 py-4 text-sm font-bold text-[#1a1407] shadow-[0_14px_40px_rgba(181,142,57,0.35)]">Start shopping</Magnetic>
                <Magnetic className="rounded-full border border-white/25 px-7 py-4 text-sm font-semibold text-white">Book a styling call</Magnetic>
              </div>
            </div>
            <div className="relative min-h-[340px]">
              <img src={EDITORIAL_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#16241b] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter + footer ── */}
      <footer className="bg-[#0e1a12] pt-20 text-white/80">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FadeUp>
            <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-br from-[#20362b] to-[#16241b] px-8 py-12 text-center">
              <h3 className="max-w-xl font-heading text-3xl font-extrabold text-white sm:text-4xl">Get ₹200 off your first plant.</h3>
              <p className="max-w-md text-sm text-white/70">Join the newsletter for care tips, new drops, and member-only offers.</p>
              <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5">
                <input placeholder="you@email.com" className="w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/40" />
                <Magnetic className="shrink-0 rounded-full bg-[#b58e39] px-6 py-3 text-sm font-bold text-[#1a1407]">Subscribe</Magnetic>
              </div>
            </div>
          </FadeUp>

          <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1"><Brand light /><p className="mt-4 max-w-xs text-sm text-white/55">India’s premium plant studio. Bringing the wild indoors, one healthy plant at a time.</p></div>
            {[
              { h: 'Shop', l: ['Indoor Plants', 'Water Gardens', 'Flowering', 'Gifts & Planters'] },
              { h: 'Care', l: ['Plant Doctor', 'Care Guides', 'Repotting', 'Contact'] },
              { h: 'Company', l: ['Our Story', 'Sustainability', 'Reviews', 'Careers'] },
            ].map((col) => (
              <div key={col.h}>
                <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#d8c08a]">{col.h}</div>
                <ul className="space-y-2.5 text-sm text-white/60">{col.l.map((x) => <li key={x}><a href="#" className="transition hover:text-white">{x}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-white/45 sm:flex-row">
            <span>© {new Date().getFullYear()} PlantAtHome. Crafted with care in India.</span>
            <span className="flex gap-5"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><a href="#" className="hover:text-white">Shipping</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

(Prototype as any).standalone = true;
export default Prototype;
