import Link from 'next/link';

/**
 * Homepage CTA band promoting the home-garden service (lead-gen + packages).
 * Links to /garden-service where customers get a free consultation for their
 * curated needs or buy a gardening package.
 */
export function GardenServiceBand() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <img
          src="/images/garden/hero.jpg"
          alt="Home garden built by experts"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/70 to-green-900/40" />
        <div className="relative grid items-center gap-6 px-7 py-12 sm:px-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              🌿 New · Home Garden Service
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Want a garden built &amp; cared for at home?
            </h2>
            <p className="mt-3 max-w-xl text-green-50/90">
              Free consultation, then a package tailored to your space — plants, seeds, soil,
              tools and a gardener who visits on schedule. You just enjoy the green.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <Link
              href="/garden-service"
              className="rounded-full bg-leaf px-7 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-leaf/90"
            >
              Get my free garden plan →
            </Link>
            <Link
              href="/garden-service#quote"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-4 text-center text-base font-semibold text-white backdrop-blur"
            >
              Browse packages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GardenServiceBand;
