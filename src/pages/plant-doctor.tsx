import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import {
  useDiagnose,
  usePlantDoctorEnabled,
  DiagnosisResponse,
  Severity,
} from '@/framework/plant-doctor';

export { getStaticProps } from '@/framework/general.ssr';

const SEVERITY_STYLE: Record<Severity, { label: string; cls: string; bar: string }> = {
  low:      { label: 'Low',      cls: 'bg-sage-100 text-forest-800 border-sage-300',      bar: '#3f7d3a' },
  medium:   { label: 'Medium',   cls: 'bg-[#FBF1DD] text-[#8A6A23] border-[#E8D4A8]',    bar: '#C79A3A' },
  high:     { label: 'High',     cls: 'bg-[#FBE7DA] text-[#9A4F1E] border-[#E6C3A3]',    bar: '#C07035' },
  critical: { label: 'Critical', cls: 'bg-[#FBE2DE] text-[#A23022] border-[#E9B7AE]',    bar: '#C0492B' },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function fileToScaledBase64(file: File, max = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no canvas'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1] ?? '');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function HealthGauge({ score }: { score: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, score)) * 100);
  const color = pct >= 70 ? '#3f7d3a' : pct >= 40 ? '#C79A3A' : '#C0492B';
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EAE6DC" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-cormorant text-xl font-bold text-forest-900">{pct}</span>
      </div>
      <div>
        <p className="font-cormorant text-lg font-semibold text-forest-900">Overall health</p>
        <p className="text-sm text-stone-500">
          {pct >= 70 ? 'Looking good — minor care needed.' : pct >= 40 ? 'Needs attention soon.' : 'Urgent care recommended.'}
        </p>
      </div>
    </div>
  );
}

function Col({ title, items, accent }: { title: string; items?: string[]; accent?: boolean }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-stone-400">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className={`flex gap-2 text-[13px] leading-snug ${accent ? 'text-forest-800' : 'text-stone-600'}`}>
            <span className={`mt-0.5 shrink-0 ${accent ? 'text-[#4ADE80]' : 'text-stone-300'}`}>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiagnosisView({ result, onReset }: { result: DiagnosisResponse; onReset: () => void }) {
  return (
    <div className="space-y-5">
      {/* plant identity + health */}
      <div className="rounded-2xl border border-kraft-200 bg-white p-6 shadow-[0_2px_12px_rgba(34,48,26,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#4ADE80]">Diagnosis for</p>
            <h2 className="font-cormorant mt-1 text-[2rem] font-bold leading-none text-forest-900">
              {result.identification?.common_name || result.plant_name || 'Your plant'}
            </h2>
            {(result.identification?.scientific_name || (result.identification?.confidence ?? 0) > 0) && (
              <p className="mt-1 font-cormorant text-[15px] italic text-stone-500">
                {result.identification?.scientific_name}
                {typeof result.identification?.confidence === 'number' && result.identification.confidence > 0
                  ? ` · ${Math.round(result.identification.confidence * 100)}% match`
                  : ''}
              </p>
            )}
          </div>
          <HealthGauge score={result.overall_health_score} />
        </div>
      </div>

      {/* per-condition cards */}
      {result.diagnosis?.map((d, i) => {
        const sev = SEVERITY_STYLE[d.severity] ?? SEVERITY_STYLE.medium;
        return (
          <div key={i} className="overflow-hidden rounded-2xl border border-kraft-200 bg-white shadow-[0_2px_12px_rgba(34,48,26,0.07)]">
            {/* severity accent bar */}
            <div className="h-1 w-full" style={{ background: sev.bar }} />
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-cormorant text-[1.4rem] font-bold text-forest-900">{d.condition}</h3>
                <span className={`rounded-full border px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-wide ${sev.cls}`}>
                  {sev.label}
                </span>
                {typeof d.confidence === 'number' && (
                  <span className="text-[11.5px] text-stone-400">{Math.round(d.confidence * 100)}% confidence</span>
                )}
              </div>
              {d.description && <p className="mt-2 text-[13.5px] leading-relaxed text-stone-600">{d.description}</p>}

              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <Col title="Likely causes" items={d.causes} />
                <Col title="What to do" items={d.solutions} accent />
                <Col title="Prevent next time" items={d.preventive_measures} />
              </div>

              {d.products_recommended && d.products_recommended.length > 0 && (
                <div className="mt-5 border-t border-kraft-100 pt-4">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-stone-400">Recommended remedies</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {d.products_recommended.map((p) => (
                      <Link key={p} href={`/plants/search?text=${encodeURIComponent(p)}`}
                        className="rounded-full border border-forest-700/25 bg-sage-100 px-3 py-1 text-[12px] font-medium text-forest-800 transition hover:bg-forest-700 hover:text-white">
                        {p}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {d.vet_consultation_needed && (
                <p className="mt-4 rounded-xl bg-[#FBE2DE] px-4 py-2.5 text-[13px] text-[#A23022]">
                  ⚠️ May need an in-person expert.{' '}
                  <Link href="/garden-service" className="font-semibold underline">Book a garden visit →</Link>
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* immediate + long term */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-[#0c1e12] p-6 text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }} />
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(ellipse,rgba(74,222,128,0.18)_0%,transparent_70%)]" />
          <p className="relative text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#86EFAC]">Do this now</p>
          <p className="relative mt-2 text-[13.5px] leading-relaxed text-white/85">{result.immediate_action}</p>
        </div>
        <div className="rounded-2xl border border-kraft-200 bg-white p-6 shadow-[0_2px_12px_rgba(34,48,26,0.07)]">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-stone-400">Long-term care</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-stone-600">{result.long_term_care}</p>
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button onClick={onReset}
          className="inline-flex items-center gap-2 rounded-[13px] bg-[#4ADE80] px-6 py-3 font-hanken text-[13.5px] font-bold text-[#061a0b] transition hover:bg-[#22c55e] active:scale-[0.97]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          Diagnose another plant
        </button>
        <Link href="/garden-service" className="font-hanken text-[13px] font-medium text-forest-700 underline underline-offset-2">
          Need a real gardener? Book a visit →
        </Link>
      </div>
      <p className="text-[11.5px] text-stone-400">
        Dr. Planty is AI-powered and can be wrong. For valuable or severely affected plants, consult a horticulturist.
      </p>
    </div>
  );
}

function RejectionView({ result, onReset }: { result: DiagnosisResponse; onReset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-kraft-200 bg-white p-8 text-center shadow-[0_2px_12px_rgba(34,48,26,0.07)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-forest-200 bg-sage-50 text-forest-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.4 5.08-6" />
        </svg>
      </div>
      <h2 className="mt-4 font-cormorant text-[1.8rem] font-bold text-forest-900">We couldn't find a plant in that photo</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-stone-600">
        {result.rejection_reason || 'Please upload a clear, well-lit photo of the plant or the affected leaf.'}
      </p>
      <button onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-[13px] bg-[#4ADE80] px-6 py-3 font-hanken text-[13.5px] font-bold text-[#061a0b] transition hover:bg-[#22c55e]">
        Try another photo
      </button>
    </div>
  );
}

export default function PlantDoctorPage() {
  const { locale } = useRouter();
  const { data: flag } = usePlantDoctorEnabled();
  const enabled = flag?.data?.enabled ?? true;
  const { mutate, isLoading } = useDiagnose();

  const [preview, setPreview] = useState<string | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [plantName, setPlantName] = useState('');
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const b64 = await fileToScaledBase64(file);
      setImageB64(b64);
      setPreview(`data:image/jpeg;base64,${b64}`);
    } catch {
      setError('Could not read that image. Try a different photo.');
    }
  }

  async function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setError(null);
    try {
      const b64 = await fileToScaledBase64(file);
      setImageB64(b64);
      setPreview(`data:image/jpeg;base64,${b64}`);
    } catch {
      setError('Could not read that image. Try a different photo.');
    }
  }

  function submit() {
    setError(null);
    if (!imageB64 && !symptoms.trim()) {
      setError('Add a photo or describe the symptoms.');
      return;
    }
    mutate(
      { image_base64: imageB64 ?? undefined, symptoms: symptoms.trim() || undefined, plant_name: plantName.trim() || undefined, language: locale || 'en' },
      {
        onSuccess: (res) => setResult(res.data),
        onError: (e: any) => {
          const status = e?.response?.status;
          setError(status === 503
            ? 'Plant Doctor is taking a break right now. Please try later.'
            : "We couldn't complete the diagnosis. Please try again.");
        },
      },
    );
  }

  function reset() {
    setResult(null); setPreview(null); setImageB64(null);
    setSymptoms(''); setPlantName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="bg-[#F8F7F2]">
      <Seo
        title="Plant Doctor — instant AI plant health diagnosis"
        description="Snap a photo of an unwell plant and get an instant AI diagnosis — disease, pests, watering or nutrient issues — with clear fixes and remedies available in India."
        url="plant-doctor"
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-kraft-200">
        {/* background */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#e8f0e2_0%,#f0ede4_55%,#F8F7F2_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(ellipse,rgba(74,222,128,0.13)_0%,transparent_65%)]" />

        <div className="relative mx-auto max-w-5xl px-5 py-12 text-center sm:px-8 sm:py-16">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-forest-600/20 bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#4ADE80]" />
            </span>
            <span className="font-hanken text-[10.5px] font-bold uppercase tracking-[0.2em] text-forest-700">AI Plant Doctor</span>
          </div>

          <h1 className="font-cormorant mt-5 text-[2.6rem] font-bold leading-[1.05] tracking-[-0.015em] text-forest-900 sm:text-[3.8rem]">
            Is your plant unwell?<br className="hidden sm:block" /> Find out in seconds.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-hanken text-[15px] leading-relaxed text-stone-600">
            Upload a photo of the leaves or describe the symptoms. Dr. Planty checks for disease,
            pests, over/under-watering and nutrient issues — and tells you exactly how to fix it.
          </p>

          {/* trust chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6Z" /><path d="m9 12 2 2 4-4" /></svg>), label: 'AI-powered diagnosis' },
              { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" /></svg>), label: 'Results in seconds' },
              { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>), label: 'Photo not stored' },
            ].map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full border border-kraft-200 bg-white/80 px-3.5 py-1.5 font-hanken text-[12px] text-forest-700">
                <span className="text-[#4ADE80]">{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        {!enabled ? (
          <div className="rounded-2xl border border-kraft-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 text-forest-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" /></svg>
            </div>
            <p className="font-cormorant text-2xl font-bold text-forest-900">Plant Doctor is coming soon</p>
            <p className="mt-2 text-[13.5px] text-stone-500">We're putting the finishing touches on it. Check back shortly.</p>
          </div>
        ) : result ? (
          result.is_plant === false
            ? <RejectionView result={result} onReset={reset} />
            : <DiagnosisView result={result} onReset={reset} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">

            {/* ── upload zone ── */}
            <div>
              <label
                htmlFor="pd-file"
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                className={`group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 bg-white text-center transition-all duration-200 ${
                  drag
                    ? 'border-[#4ADE80] bg-[#4ADE80]/5 shadow-[0_0_0_4px_rgba(74,222,128,0.15)]'
                    : 'border-kraft-200 hover:border-forest-400 hover:shadow-[0_4px_20px_rgba(34,48,26,0.1)]'
                }`}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Your plant" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-8">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-forest-200 bg-sage-50 text-forest-500 transition-colors group-hover:border-forest-400 group-hover:text-forest-700">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </span>
                    <span className="mt-4 block font-cormorant text-[1.3rem] font-bold text-forest-900">Add a photo of your plant</span>
                    <span className="mt-1 block font-hanken text-[12.5px] text-stone-400">Tap to upload · drag & drop · or take a picture</span>
                  </span>
                )}
              </label>
              <input id="pd-file" ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onPick} className="hidden" />
              {preview && (
                <button
                  onClick={() => { setPreview(null); setImageB64(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="mt-2 font-hanken text-[12px] text-stone-400 underline underline-offset-2 transition hover:text-stone-600"
                >
                  Remove photo
                </button>
              )}
            </div>

            {/* ── form ── */}
            <div className="flex flex-col">
              <label className="font-hanken text-[13px] font-semibold text-forest-900">
                Plant name <span className="font-normal text-stone-400">(optional)</span>
              </label>
              <input
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Money Plant, Tulsi, Snake Plant"
                className="mt-1.5 rounded-xl border border-kraft-200 bg-white px-4 py-2.5 font-hanken text-[13.5px] text-forest-900 shadow-[0_1px_4px_rgba(34,48,26,0.06)] outline-none placeholder:text-stone-400 focus:border-[#4ADE80]/70 focus:ring-2 focus:ring-[#4ADE80]/20"
              />

              <label className="mt-5 font-hanken text-[13px] font-semibold text-forest-900">
                What's wrong? <span className="font-normal text-stone-400">(optional)</span>
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={5}
                placeholder="e.g. Leaves turning yellow with brown spots, drooping despite regular watering…"
                className="mt-1.5 resize-none rounded-xl border border-kraft-200 bg-white px-4 py-2.5 font-hanken text-[13.5px] text-forest-900 shadow-[0_1px_4px_rgba(34,48,26,0.06)] outline-none placeholder:text-stone-400 focus:border-[#4ADE80]/70 focus:ring-2 focus:ring-[#4ADE80]/20"
              />

              {error && (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#E9B7AE] bg-[#FBE2DE] px-4 py-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-[#A23022]" aria-hidden><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <p className="font-hanken text-[13px] text-[#A23022]">{error}</p>
                </div>
              )}

              <button
                onClick={submit}
                disabled={isLoading}
                className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-[13px] bg-[#4ADE80] px-7 py-3.5 font-hanken text-[14px] font-bold text-[#061a0b] shadow-[0_0_28px_rgba(74,222,128,0.22)] transition duration-200 hover:bg-[#22c55e] active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#061a0b]/30 border-t-[#061a0b]" />
                    Dr. Planty is examining…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.4 5.08-6" />
                    </svg>
                    Diagnose my plant
                  </>
                )}
              </button>

              <p className="mt-3 font-hanken text-[11.5px] text-stone-400">
                Your photo is used only for this diagnosis and is not stored. Results are AI-generated guidance.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

PlantDoctorPage.getLayout = getSiteLayout;
