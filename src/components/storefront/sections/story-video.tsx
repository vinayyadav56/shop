import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { WordReveal, Magnetic } from '../motion';
import { Icon } from '../icons';

// Premium nature footage (Pexels, hotlinkable) + local poster fallback.
const STORY_VIDEO =
  'https://videos.pexels.com/video-files/1918465/1918465-uhd_2560_1440_24fps.mp4';
const STORY_VIDEO_ALT =
  'https://videos.pexels.com/video-files/1918465/1918465-hd_1920_1080_24fps.mp4';
const STORY_POSTER = '/story-poster.jpg';

/** Pinned full-screen video story block: content reveals over the clip on scroll. */
export function StoryVideo() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const op = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section id="story" ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* video bg + parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-[-10%]">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={STORY_POSTER}
            >
              <source src={STORY_VIDEO} type="video/mp4" />
              <source src={STORY_VIDEO_ALT} type="video/mp4" />
            </video>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STORY_POSTER}
              alt=""
              aria-hidden
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-deep/85 via-deep/55 to-deep/85" />
        </div>

        {/* content */}
        <motion.div
          style={{ y: textY, opacity: op }}
          className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center"
        >
          <span className="mb-5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
            Our story
          </span>
          <h2 className="font-heading text-5xl font-black leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            <WordReveal text="From wild greenhouses to your living room." />
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Every plant is nurtured in living water-gardens, acclimatised for
            Indian homes, and delivered at its absolute peak — roots happy,
            leaves glossy, ready to thrive.
          </p>
          <Link href="#products" scroll={false}>
            <Magnetic className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-forest">
              Discover the craft <Icon.arrow className="h-4 w-4" />
            </Magnetic>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
