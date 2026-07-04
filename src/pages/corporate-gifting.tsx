import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import { authorizationAtom } from '@/store/authorization-atom';
import { useModalAction } from '@/components/ui/modal/modal.context';
import {
  useGiftingTemplates, useSubmitCorporateLead, useGiftingCheckout, GardenLeadInput,
} from '@/framework/garden';

export { getStaticProps } from '@/framework/general.ssr';

type CorporateInput = GardenLeadInput & { company?: string; occasion?: string; quantity?: string };

const PHONE = '+918000000000';
const OCCASIONS = ['Diwali / Festivals', 'Employee onboarding', 'Work anniversaries', 'Client gifting', 'Events / Conferences', 'Other'];
const QTY = ['10–50', '50–200', '200–500', '500+'];

const AUDIENCE = [
  { icon: '🎉', title: 'Festive & Diwali gifting', text: 'Sustainable, memorable gifts that outlast the season — for clients, partners and teams.' },
  { icon: '🧑‍💼', title: 'Employee gifting', text: 'Onboarding kits, milestones and appreciation gifts that bring the outdoors to every desk.' },
  { icon: '🤝', title: 'Client & VIP gifting', text: 'Premium curated hampers with custom branding that leave a lasting impression.' },
];
const WHY = [
  { icon: '🌱', title: 'Memorable & sustainable', text: 'A living gift that keeps growing — far better recall than chocolates or generic kits.' },
  { icon: '🎨', title: 'Custom branding', text: 'Branded pots, tags and packaging tailored to your company and occasion.' },
  { icon: '🚚', title: 'Bulk, pan-India delivery', text: 'Any quantity, coordinated delivery to one office or hundreds of addresses.' },
  { icon: '✅', title: 'Healthy-plant guarantee', text: 'Hardy, easy-care plants picked to thrive in office and home environments.' },
];
const FAQS = [
  { q: 'What’s the minimum order quantity?', a: 'We handle orders from 10 to thousands of gifts. Per-unit pricing improves with volume — share your numbers for a quote.' },
  { q: 'Can you add our branding?', a: 'Yes — custom pots, message tags, sleeves and packaging with your logo and a personalised note.' },
  { q: 'Do you deliver to multiple addresses?', a: 'Absolutely. We can ship to a single office or split-ship to individual employee/client addresses pan-India.' },
  { q: 'How do we order?', a: 'Buy a standard hamper online, or send an enquiry for custom/bulk and our gifting team will share a tailored proposal.' },
];

function EnquiryForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CorporateInput>();
  const { mutate, isLoading } = useSubmitCorporateLead();
  const [done, setDone] = useState(false);

  const onSubmit = (values: CorporateInput) =>
    mutate(values, {
      onSuccess: () => { setDone(true); reset(); toast.success('Thanks! Our gifting team will reach out.'); },
      onError: () => { toast.error('Something went wrong. Please call us instead.'); },
    });

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-3 text-4xl">🎁</div>
        <h3 className="text-xl font-bold text-gray-900">Enquiry received!</h3>
        <p className="mt-2 text-gray-600">Our corporate gifting team will reach out with a tailored proposal.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
      <h3 className="text-xl font-bold text-gray-900">Get a custom gifting quote</h3>
      <p className="mt-1 text-sm text-gray-500">Tell us your needs — we’ll tailor a proposal & pricing.</p>
      <div className="mt-5 space-y-3">
        <input {...register('company', { required: true })} placeholder="Company name *" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
        {errors.company && <span className="text-xs text-red-500">Company is required</span>}
        <input {...register('name', { required: true })} placeholder="Your name *" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
        <div className="grid grid-cols-2 gap-3">
          <input {...register('phone', { required: true })} placeholder="Phone *" inputMode="tel" className="rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
          <input {...register('email')} placeholder="Work email" className="rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select {...register('occasion')} className="rounded-lg border border-gray-300 px-3 py-3 text-gray-600 focus:border-green-500 focus:outline-0">
            <option value="">Occasion</option>{OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select {...register('quantity')} className="rounded-lg border border-gray-300 px-3 py-3 text-gray-600 focus:border-green-500 focus:outline-0">
            <option value="">Quantity</option>{QTY.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <textarea {...register('message')} placeholder="Anything specific? (branding, budget, timeline)" rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-0" />
      </div>
      <button type="submit" disabled={isLoading} className="pa-btn pa-btn-primary pa-btn-lg mt-5 w-full">
        {isLoading ? 'Sending…' : 'Request a quote →'}
      </button>
      <p className="mt-3 text-center text-xs text-gray-400">🔒 B2B enquiries only · Trusted by teams across India</p>
    </form>
  );
}

export default function CorporateGiftingPage() {
  const { data } = useGiftingTemplates();
  const tiers = data?.data ?? [];
  const [isAuthorize] = useAtom(authorizationAtom);
  const { openModal } = useModalAction();
  const { mutate: checkout, isLoading: buying } = useGiftingCheckout();
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

  const buy = (id: number) => {
    if (!isAuthorize) { openModal('LOGIN_VIEW'); return; }
    setBuyingId(id);
    checkout(id, {
      onSuccess: (res) => {
        const url = res?.data?.url;
        if (url) window.location.href = url;
        else toast.success('Order created — see it in My Packages.');
        setBuyingId(null);
      },
      onError: () => { toast.error('Could not start checkout. Please try the enquiry form.'); setBuyingId(null); },
    });
  };

  return (
    <div className="bg-white">
      <Seo
        title="Corporate Plant Gifting — festive hampers & employee kits"
        description="Memorable, sustainable plant gifts for employees, clients and festive occasions. Ready-to-buy hampers and kits, or enquire for bespoke bulk gifting tailored to your brand."
        url="corporate-gifting"
      />
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src="/images/gifting/hero.jpg" alt="Corporate plant gifting" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/70 to-green-900/30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">🎁 Corporate Gifting</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Gift something that <span className="text-green-300">grows</span></h1>
            <p className="mt-4 max-w-xl text-lg text-green-50/90">
              Memorable, sustainable plant gifts for clients and teams — custom branded, delivered in bulk across India. Buy a ready hamper or get a tailored quote.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#tiers" className="pa-btn pa-btn-primary pa-btn-lg">Browse gift hampers</a>
              <a href="#quote" className="pa-btn pa-btn-outline pa-btn-lg border-white/40 bg-white/10 text-white backdrop-blur hover:border-white hover:bg-white/20">Get a bulk quote</a>
            </div>
          </div>
          <div id="quote" className="lg:justify-self-end lg:w-[26rem]"><EnquiryForm /></div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Perfect for every occasion</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((a) => (
            <div key={a.title} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
              <div className="text-3xl">{a.icon}</div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{a.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section id="tiers" className="bg-green-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold">Ready-to-gift hampers</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-green-100/80">Buy online, or request a custom quote for bulk & branding.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <div key={t.id} className={`flex flex-col rounded-2xl bg-white/5 p-7 ring-1 ${i === 2 ? 'ring-2 ring-green-400' : 'ring-white/10'}`}>
                {i === 2 && <div className="mb-3 inline-block rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-green-950">PREMIUM</div>}
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-green-100/70">{t.tagline}</p>
                <div className="mt-4 text-3xl font-extrabold">From {fmt(t.suggested_price)}<span className="text-sm font-medium text-green-100/60"> /gift</span></div>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {(t.items ?? []).map((it, j) => <li key={j} className="flex gap-2"><span className="text-green-400">✓</span><span>{it.name}</span></li>)}
                </ul>
                <button onClick={() => buy(t.id)} disabled={buying && buyingId === t.id}
                  className="pa-btn pa-btn-primary mt-6 w-full">
                  {buying && buyingId === t.id ? 'Starting…' : isAuthorize ? 'Buy now' : 'Login to buy'}
                </button>
                <a href="#quote" className="mt-2 text-center text-sm text-green-200 underline">or get a bulk quote</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Why plant gifts work</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
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
                <summary className="cursor-pointer list-none font-semibold text-gray-900">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-green-600 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-3xl font-bold">Gifting at scale, made effortless</h2>
          <p className="mt-2 text-green-50/90">Tell us your occasion and quantity — we’ll handle the rest.</p>
          <a href="#quote" className="pa-btn pa-btn-outline pa-btn-lg mt-6 border-white bg-white text-green-700 shadow-lg hover:bg-green-700 hover:text-white">Get a custom quote →</a>
        </div>
      </section>
    </div>
  );
}

CorporateGiftingPage.getLayout = getSiteLayout;
