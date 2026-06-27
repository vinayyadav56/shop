import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import { useGardenTemplates, useSubmitGardenLead, GardenLeadInput } from '@/framework/garden';

export { getStaticProps } from '@/framework/general.ssr';

const PHONE = '+918000000000';
const GARDEN_TYPES = ['Balcony', 'Terrace', 'Backyard', 'Indoor', 'Rooftop'];
const BUDGETS = ['Under ₹15,000', '₹15,000–₹40,000', '₹40,000–₹90,000', '₹90,000+'];

const STEPS = [
  { img: '/images/garden/step1.jpg', title: 'Tell us about your space', text: 'Share your balcony, terrace or backyard and what you dream of. Takes 30 seconds.' },
  { img: '/images/garden/step2.jpg', title: 'We design your package', text: 'Our botanists build a plan tailored to your light, space and budget — plants, soil, tools, visits.' },
  { img: '/images/garden/step3.jpg', title: 'We plant & maintain', text: 'Experts set it up and visit on schedule to keep everything thriving. You just enjoy it.' },
];

const INCLUDED = [
  { icon: '🌱', title: 'Hand-picked plants & seeds', text: 'Chosen for your exact light and climate — nothing dies on you.' },
  { icon: '🪴', title: 'Premium soil & fertilizer', text: 'Organic potting mix, compost and plant food for healthy growth.' },
  { icon: '🧰', title: 'Tools & planters', text: 'Everything you need, delivered and set up — no hardware-store runs.' },
  { icon: '👩‍🌾', title: 'Scheduled gardener visits', text: 'Trained gardeners visit to prune, feed and care — you track every visit.' },
];

const FAQS = [
  { q: 'Do you build gardens for small balconies and apartments?', a: 'Absolutely. Most of our gardens are for balconies, terraces and small urban spaces. Every package is sized to your space.' },
  { q: 'What does a gardener visit include?', a: 'Watering guidance, pruning, repotting, pest care, fertilizing and replacing any plant that isn’t thriving — all tracked in your account.' },
  { q: 'Can I customise the package?', a: 'Yes — after you share your space we tailor the plants, number of visits and budget. You approve before anything is charged.' },
  { q: 'Is there a guarantee?', a: 'Yes. Every package includes our plant-health guarantee — if a plant doesn’t make it under our care, we replace it.' },
];

function LeadForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GardenLeadInput>();
  const { mutate, isLoading } = useSubmitGardenLead();
  const [done, setDone] = useState(false);

  const onSubmit = (values: GardenLeadInput) => {
    mutate(values, {
      onSuccess: () => { setDone(true); reset(); toast.success('Thanks! Our garden team will reach out shortly.'); },
      onError: () => toast.error('Something went wrong. Please call us instead.'),
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-3 text-4xl">🌿</div>
        <h3 className="text-xl font-bold text-gray-900">Request received!</h3>
        <p className="mt-2 text-gray-600">Our garden experts will call you within one business day to design your free plan.</p>
        <a href={`tel:${PHONE}`} className="pa-btn pa-btn-primary mt-5">Or call us now</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
      <h3 className="text-xl font-bold text-gray-900">Get your free garden plan</h3>
      <p className="mt-1 text-sm text-gray-500">No cost, no obligation. We’ll call you within a day.</p>
      <div className="mt-5 space-y-3">
        <div>
          <input {...register('name', { required: true })} placeholder="Your name *"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
          {errors.name && <span className="text-xs text-red-500">Name is required</span>}
        </div>
        <div>
          <input {...register('phone', { required: true, minLength: 8 })} placeholder="Phone number *" inputMode="tel"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
          {errors.phone && <span className="text-xs text-red-500">A valid phone number is required</span>}
        </div>
        <input {...register('city')} placeholder="City"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
        <div className="grid grid-cols-2 gap-3">
          <select {...register('garden_type')} className="rounded-lg border border-gray-300 px-3 py-3 text-gray-600 focus:border-green-500 focus:outline-0">
            <option value="">Garden type</option>
            {GARDEN_TYPES.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
          </select>
          <select {...register('budget_range')} className="rounded-lg border border-gray-300 px-3 py-3 text-gray-600 focus:border-green-500 focus:outline-0">
            <option value="">Budget</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <textarea {...register('message')} placeholder="Tell us about your space (optional)" rows={2}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
      </div>
      <button type="submit" disabled={isLoading}
        className="pa-btn pa-btn-primary pa-btn-lg mt-5 w-full">
        {isLoading ? 'Sending…' : 'Get my free garden plan →'}
      </button>
      <p className="mt-3 text-center text-xs text-gray-400">🔒 We never share your details. Trusted by 2,000+ plant parents.</p>
    </form>
  );
}

export default function GardenServicePage() {
  const { data } = useGardenTemplates();
  const templates = data?.data ?? [];
  const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

  return (
    <div className="bg-white">
      <Seo
        title="Garden Service — bespoke home gardens, planted & maintained"
        description="Get a free, no-obligation garden plan tailored to your balcony, terrace or backyard. Hand-picked plants, premium soil, tools and scheduled gardener visits — all tracked in your account."
        url="garden-service"
      />
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src="/images/garden/hero.jpg" alt="Lush home garden" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/70 to-green-900/30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              🌿 Home garden experts
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Turn your home into a thriving garden — <span className="text-green-300">built & cared for by experts</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-green-50/90">
              Balcony, terrace or backyard — we design, plant and maintain a beautiful green space tailored to you. Seeds, soil, tools and a gardener who visits, all in one package.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#quote" className="pa-btn pa-btn-primary pa-btn-lg">
                Get my free garden plan
              </a>
              <a href={`tel:${PHONE}`} className="pa-btn pa-btn-outline pa-btn-lg border-white/40 bg-white/10 text-white backdrop-blur hover:border-white hover:bg-white/20">
                📞 Call an expert
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-green-50/80">
              <span>✓ Plant-health guarantee</span>
              <span>✓ Trained gardeners</span>
              <span>✓ Eco-friendly setup</span>
            </div>
          </div>
          {/* lead form in hero (above the fold) */}
          <div id="quote" className="lg:justify-self-end lg:w-[26rem]">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-6 text-center sm:px-8 md:grid-cols-4">
          {[['2,000+', 'Gardens delivered'], ['4.9★', 'Average rating'], ['100%', 'Plant-health guarantee'], ['Same-day', 'Metro delivery']].map(([a, b]) => (
            <div key={b}><div className="text-2xl font-extrabold text-green-700">{a}</div><div className="text-sm text-gray-600">{b}</div></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">How it works</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">From bare space to thriving garden in three simple steps.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <img src={s.img} alt={s.title} className="h-44 w-full object-cover" />
              <div className="p-6">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">{i + 1}</div>
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Real transformations</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <figure className="relative overflow-hidden rounded-2xl">
              <img src="/images/garden/before.jpg" alt="Before" className="h-72 w-full object-cover" />
              <figcaption className="absolute left-4 top-4 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-white">Before</figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-2xl">
              <img src="/images/garden/after.jpg" alt="After" className="h-72 w-full object-cover" />
              <figcaption className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">After</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Everything’s included</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">One package, zero hassle. We bring the green thumb.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-green-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold">Popular garden packages</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-green-100/80">Starting points — every package is customised to your space and budget.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {(templates.length ? templates : []).map((t, i) => (
              <div key={t.id} className={`rounded-2xl bg-white/5 p-7 ring-1 ${i === 1 ? 'ring-2 ring-green-400' : 'ring-white/10'}`}>
                {i === 1 && <div className="mb-3 inline-block rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-green-950">MOST POPULAR</div>}
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-green-100/70">{t.tagline}</p>
                <div className="mt-4 text-3xl font-extrabold">From {fmt(t.suggested_price)}</div>
                <div className="mt-1 text-sm text-green-100/70">{t.suggested_visits} gardener visits · {t.duration_days} days</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {(t.items ?? []).slice(0, 6).map((it, j) => (
                    <li key={j} className="flex gap-2"><span className="text-green-400">✓</span><span>{it.name}{it.qty && it.qty > 1 ? ` (${it.qty})` : ''}</span></li>
                  ))}
                </ul>
                <a href="#quote" className="pa-btn pa-btn-primary mt-6 w-full">Get a custom quote</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Loved by plant parents</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['Ananya R.', 'Bengaluru', 'My empty balcony is now a jungle. The gardener visits keep everything alive — I do nothing!'],
            ['Rohan M.', 'Mumbai', 'They designed a terrace garden around my budget. Setup was spotless and the plants are thriving.'],
            ['Priya S.', 'Delhi', 'Best decision. The package had everything and I can track every visit in my account.'],
          ].map(([n, c, q]) => (
            <div key={n} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-green-500">★★★★★</div>
              <p className="mt-3 text-gray-700">“{q}”</p>
              <div className="mt-4 text-sm font-semibold text-gray-900">{n} <span className="font-normal text-gray-400">· {c}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Questions, answered</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:hidden">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-green-600 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-3xl font-bold">Ready for a garden you’ll actually keep alive?</h2>
          <p className="mt-2 text-green-50/90">Get a free, no-obligation plan tailored to your space today.</p>
          <a href="#quote" className="pa-btn pa-btn-outline pa-btn-lg mt-6 border-white bg-white text-green-700 shadow-lg hover:bg-green-700 hover:text-white">Get my free garden plan →</a>
        </div>
      </section>
    </div>
  );
}

GardenServicePage.getLayout = getSiteLayout;
