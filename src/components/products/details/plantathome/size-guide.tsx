import React from 'react';
import type { Product } from '@/types';

const Person = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 110" fill="currentColor" aria-hidden preserveAspectRatio="xMidYMax meet">
    <circle cx="20" cy="12" r="9" />
    <path d="M20 23c-7 0-12 5-12 13v28a4 4 0 0 0 8 0V52h1v54a4 4 0 0 0 8 0V52h1v12a4 4 0 0 0 8 0V36c0-8-5-13-12-13z" />
  </svg>
);

type SizeRow = {
  name: string;
  inch: string;
  cm: string;
  scale: number; // plant height vs the human silhouette (0..1)
  best: string[];
  highlight?: boolean;
};

const SIZES: SizeRow[] = [
  { name: 'Small', inch: '12-18 inches', cm: '30-45 cm', scale: 0.42, best: ['Study Table', 'Office Desk', 'Kitchen Counter'] },
  { name: 'Medium', inch: '24-30 inches', cm: '60-75 cm', scale: 0.58, best: ['Bedroom Corner', 'Living Room Shelf', 'Balcony'] },
  { name: 'Large', inch: '36-48 inches', cm: '90-120 cm', scale: 0.8, best: ['Living Room', 'Office Lobby', 'Hotel Spaces'], highlight: true },
  { name: 'XL Statement', inch: '60+ inches', cm: '150+ cm', scale: 1, best: ['Luxury Homes', 'Villa Entrance', 'Statement Decor'] },
];

export default function SizeGuide({ product }: { product: Product }) {
  const plant = (product as any)?.image?.original || (product as any)?.image?.thumbnail || '/brand/mark-house.png';

  return (
    <div>
      <h3 className="font-poppins text-[1.5rem] font-bold italic text-forest-600">
        Choose the perfect size for your space
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SIZES.map((s) => (
          <div
            key={s.name}
            className={`relative flex min-h-[280px] flex-col rounded-2xl border bg-white p-5 ${
              s.highlight ? 'border-forest-600 shadow-[0_14px_34px_-20px_rgba(46,94,42,0.45)]' : 'border-kraft-200'
            }`}
          >
            {/* size + dimensions */}
            <div>
              <h4 className="font-poppins text-[17px] font-bold text-forest-900">{s.name}</h4>
              <p className="mt-1.5 text-[13px] font-semibold text-stone-700">{s.inch}</p>
              <p className="text-[12px] text-stone-400">{s.cm}</p>
            </div>

            {/* scale illustration — plant vs human + amber height line */}
            <div className="pointer-events-none absolute bottom-[92px] right-4 flex h-[120px] items-end gap-1.5">
              {/* amber measure line */}
              <div className="relative flex items-end" style={{ height: `${s.scale * 100}%` }}>
                <div className="relative h-full w-px bg-[#E6A23C]">
                  <span className="absolute -left-1 top-0 h-px w-2 bg-[#E6A23C]" />
                  <span className="absolute -left-1 bottom-0 h-px w-2 bg-[#E6A23C]" />
                </div>
              </div>
              {/* plant */}
              <div className="flex items-end" style={{ height: `${s.scale * 100}%` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plant} alt={`${s.name} plant`} className="h-full w-auto max-w-[64px] object-contain" />
              </div>
              {/* human silhouette (constant) */}
              <Person className="h-full w-auto text-stone-300" />
            </div>

            {/* best for */}
            <div className="mt-auto pt-3">
              <p className="text-[12px] font-semibold text-forest-900">Best for:</p>
              <ul className="mt-1.5 space-y-1 text-[11.5px] text-stone-500">
                {s.best.map((b) => (
                  <li key={b} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-forest-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
