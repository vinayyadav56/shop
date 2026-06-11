'use client';
import React from 'react';

// Staging-only palette picker: 5 green options the user can flip live.
// Deep links: ?green=1..5 ; choice persists in localStorage.
const PALETTES = [
  { n: '1', name: 'Fresh Emerald', dot: '#1E8A62' },
  { n: '2', name: 'Mint Breeze', dot: '#3DB87F' },
  { n: '3', name: 'Sage Calm', dot: '#5E8F6B' },
  { n: '4', name: 'Tropical Teal', dot: '#14998C' },
  { n: '5', name: 'Classic Forest', dot: '#27754C' },
];

const IS_STAGING =
  (process.env.NEXT_PUBLIC_SITE_URL ?? '').includes('staging');

export default function GreenPicker() {
  const [active, setActive] = React.useState('1');
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('green');
    const saved = window.localStorage.getItem('green');
    const n = fromUrl && PALETTES.some((p) => p.n === fromUrl) ? fromUrl : saved && PALETTES.some((p) => p.n === saved) ? saved : '1';
    apply(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(n: string) {
    document.documentElement.dataset.green = n;
    window.localStorage.setItem('green', n);
    setActive(n);
  }

  if (!IS_STAGING) return null;

  return (
    <div className="fixed bottom-16 left-3 z-[90] lg:bottom-5">
      {open ? (
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/95 py-2 pl-3 pr-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-stone-500">Green</span>
          {PALETTES.map((p) => (
            <button
              key={p.n}
              type="button"
              title={`${p.n}. ${p.name}`}
              aria-label={`Use palette ${p.name}`}
              onClick={() => apply(p.n)}
              className={`grid h-7 w-7 place-items-center rounded-full transition ${
                active === p.n ? 'ring-2 ring-offset-1 ring-[#B58E39]' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: p.dot }}
            >
              <span className="text-[10.5px] font-bold text-white">{p.n}</span>
            </button>
          ))}
          <button
            type="button"
            aria-label="Hide palette picker"
            onClick={() => setOpen(false)}
            className="ml-1 grid h-6 w-6 place-items-center rounded-full text-stone-400 hover:bg-black/5"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Show palette picker"
          onClick={() => setOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/95 shadow-lg backdrop-blur"
          style={{ color: PALETTES.find((p) => p.n === active)?.dot }}
        >
          ●
        </button>
      )}
    </div>
  );
}
