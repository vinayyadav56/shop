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

const SEVERITY_STYLE: Record<Severity, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'bg-sage-100 text-forest-800 border-sage-300' },
  medium: { label: 'Medium', cls: 'bg-[#FBF1DD] text-[#8A6A23] border-[#E8D4A8]' },
  high: { label: 'High', cls: 'bg-[#FBE7DA] text-[#9A4F1E] border-[#E6C3A3]' },
  critical: { label: 'Critical', cls: 'bg-[#FBE2DE] text-[#A23022] border-[#E9B7AE]' },
};

/** Downscale an image file to a JPEG base64 (max ~1024px) to keep payload + AI cost low. */
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
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no canvas'));
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl.split(',')[1] ?? '');
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
          <circle
            cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-serif text-xl font-semibold text-forest-900">
          {pct}
        </span>
      </div>
      <div>
        <p className="font-serif text-lg text-forest-900">Overall health</p>
        <p className="text-sm text-stone-500">
          {pct >= 70 ? 'Looking good — minor care needed.' : pct >= 40 ? 'Needs attention soon.' : 'Urgent care recommended.'}
        </p>
      </div>
    </div>
  );
}

function DiagnosisView({ result, onReset }: { result: DiagnosisResponse; onReset: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-kraft-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Diagnosis for</p>
            <h2 className="font-serif text-2xl text-forest-900">
              {result.identification?.common_name || result.plant_name || 'Your plant'}
            </h2>
            {(result.identification?.scientific_name || (result.identification?.confidence ?? 0) > 0) && (
              <p className="mt-1 text-sm italic text-stone-500">
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

      {result.diagnosis?.map((d, i) => {
        const sev = SEVERITY_STYLE[d.severity] ?? SEVERITY_STYLE.medium;
        return (
          <div key={i} className="rounded-2xl border border-kraft-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-xl text-forest-900">{d.condition}</h3>
              <span className={`rounded-full border px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-wide ${sev.cls}`}>
                {sev.label}
              </span>
              {typeof d.confidence === 'number' && (
                <span className="text-xs text-stone-400">{Math.round(d.confidence * 100)}% confidence</span>
              )}
            </div>
            {d.description && <p className="mt-2 text-sm text-stone-600">{d.description}</p>}

            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Col title="Likely causes" items={d.causes} />
              <Col title="What to do" items={d.solutions} accent />
              <Col title="Prevent it next time" items={d.preventive_measures} />
            </div>

            {d.products_recommended && d.products_recommended.length > 0 && (
              <div className="mt-5 border-t border-kraft-200 pt-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Recommended remedies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {d.products_recommended.map((p) => (
                    <Link
                      key={p}
                      href={`/plants/search?text=${encodeURIComponent(p)}`}
                      className="rounded-full border border-forest-700/30 bg-sage-100 px-3 py-1 text-xs font-medium text-forest-800 transition hover:bg-forest-700 hover:text-white"
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {d.vet_consultation_needed && (
              <p className="mt-4 rounded-lg bg-[#FBE2DE] px-3 py-2 text-sm text-[#A23022]">
                ⚠️ This may need an expert in person. Consider our{' '}
                <Link href="/garden-service" className="underline">garden service</Link>.
              </p>
            )}
          </div>
        );
      })}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-forest-900 p-6 text-white">
          <p className="text-[11px] uppercase tracking-[0.16em] text-sage-200">Do this now</p>
          <p className="mt-2 text-sm leading-relaxed text-sage-100">{result.immediate_action}</p>
        </div>
        <div className="rounded-2xl border border-kraft-200 bg-white p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Long-term care</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{result.long_term_care}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          onClick={onReset}
          className="rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-800"
        >
          Diagnose another plant
        </button>
        <Link href="/garden-service" className="text-sm font-medium text-forest-700 underline">
          Need a real gardener? Book a visit →
        </Link>
      </div>
      <p className="pt-1 text-xs text-stone-400">
        Dr. Planty is an AI assistant and can be wrong. For valuable or severely affected plants, consult a horticulturist.
      </p>
    </div>
  );
}

/** Shown when the AI / botanical gate decides the image is not a plant — never a fake diagnosis. */
function RejectionView({ result, onReset }: { result: DiagnosisResponse; onReset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-kraft-200 bg-white p-8 text-center shadow-sm">
      <span className="text-4xl">🌱</span>
      <h2 className="mt-4 font-serif text-2xl text-forest-900">We couldn’t find a plant in that photo</h2>
      <p className="mt-3 leading-relaxed text-stone-600">
        {result.rejection_reason ||
          'This doesn’t look like a plant. Please upload a clear, well-lit photo of the plant or the affected leaf.'}
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-800"
      >
        Try another photo
      </button>
    </div>
  );
}

function Col({ title, items, accent }: { title: string; items?: string[]; accent?: boolean }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className={`flex gap-2 text-sm ${accent ? 'text-forest-800' : 'text-stone-600'}`}>
            <span className={accent ? 'text-forest-600' : 'text-stone-300'}>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
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

  function submit() {
    setError(null);
    if (!imageB64 && !symptoms.trim()) {
      setError('Add a photo or describe what’s wrong.');
      return;
    }
    mutate(
      {
        image_base64: imageB64 ?? undefined,
        symptoms: symptoms.trim() || undefined,
        plant_name: plantName.trim() || undefined,
        language: locale || 'en',
      },
      {
        onSuccess: (res) => setResult(res.data),
        onError: (e: any) => {
          const status = e?.response?.status;
          setError(
            status === 503
              ? 'Plant Doctor is taking a break right now. Please try later.'
              : 'We couldn’t complete the diagnosis. Please try again.',
          );
        },
      },
    );
  }

  function reset() {
    setResult(null);
    setPreview(null);
    setImageB64(null);
    setSymptoms('');
    setPlantName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="bg-[#FAF9F6]">
      <Seo
        title="Plant Doctor — instant AI plant health diagnosis"
        description="Snap a photo of an unwell plant and get an instant AI diagnosis — disease, pests, watering or nutrient issues — with clear fixes and remedies available in India."
        url="plant-doctor"
      />

      {/* HERO */}
      <section className="border-b border-kraft-200 bg-gradient-to-b from-sage-100 to-[#FAF9F6]">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center sm:px-8 sm:py-16">
          <span className="inline-block rounded-full border border-forest-700/20 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-700">
            🩺 AI Plant Doctor
          </span>
          <h1 className="mt-5 font-serif text-3xl leading-tight text-forest-900 sm:text-5xl">
            Is your plant unwell? Find out in seconds.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Upload a photo of the leaves or describe the symptoms. Dr. Planty checks for disease,
            pests, over/under-watering and nutrient issues — and tells you exactly how to fix it.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        {!enabled ? (
          <div className="rounded-2xl border border-kraft-200 bg-white p-10 text-center">
            <p className="font-serif text-2xl text-forest-900">Plant Doctor is coming soon 🌱</p>
            <p className="mt-2 text-stone-500">We’re putting the finishing touches on it. Check back shortly.</p>
          </div>
        ) : result ? (
          result.is_plant === false ? (
            <RejectionView result={result} onReset={reset} />
          ) : (
            <DiagnosisView result={result} onReset={reset} />
          )
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* uploader */}
            <div>
              <label
                htmlFor="pd-file"
                className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-kraft-300 bg-white text-center transition hover:border-forest-600"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Your plant" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-6">
                    <span className="text-4xl">📷</span>
                    <span className="mt-3 block font-serif text-lg text-forest-900">Add a photo of your plant</span>
                    <span className="mt-1 block text-sm text-stone-400">Tap to upload or take a picture</span>
                  </span>
                )}
              </label>
              <input
                id="pd-file"
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onPick}
                className="hidden"
              />
              {preview && (
                <button onClick={() => { setPreview(null); setImageB64(null); if (fileRef.current) fileRef.current.value=''; }}
                  className="mt-2 text-xs text-stone-400 underline">
                  Remove photo
                </button>
              )}
            </div>

            {/* details + submit */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-forest-900">Plant name <span className="text-stone-400">(optional)</span></label>
              <input
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Money Plant, Tulsi, Snake Plant"
                className="mt-1.5 rounded-lg border border-kraft-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-600"
              />

              <label className="mt-4 text-sm font-medium text-forest-900">What’s wrong? <span className="text-stone-400">(optional)</span></label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                placeholder="e.g. Leaves turning yellow with brown spots, drooping despite watering…"
                className="mt-1.5 resize-none rounded-lg border border-kraft-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-600"
              />

              {error && <p className="mt-3 rounded-lg bg-[#FBE9E7] px-3 py-2 text-sm text-[#C0492B]">{error}</p>}

              <button
                onClick={submit}
                disabled={isLoading}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-7 py-3.5 font-semibold text-white transition hover:bg-forest-800 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Dr. Planty is examining…
                  </>
                ) : (
                  'Diagnose my plant'
                )}
              </button>
              <p className="mt-3 text-xs text-stone-400">
                Your photo is used only for this diagnosis. Results are AI-generated guidance.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

PlantDoctorPage.getLayout = getSiteLayout;
