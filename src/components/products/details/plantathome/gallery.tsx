'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type GalleryImage = { original?: string; thumbnail?: string; id?: string | number };

type Props = {
  gallery: GalleryImage[];
  productName: string;
};

// Multi-lobe organic curve on the image's RIGHT edge (objectBoundingBox 0..1).
const CURVE =
  'M0,0 L1,0 C0.82,0.10 0.95,0.20 0.84,0.30 C0.73,0.40 0.95,0.50 0.84,0.60 C0.73,0.70 0.92,0.83 1,1 L0,1 Z';

const PlantAtHomeGallery: React.FC<Props> = ({ gallery, productName }) => {
  const images = (gallery?.length ? gallery : [{ original: '', thumbnail: '' }]) as GalleryImage[];
  const [active, setActive] = useState(0);
  const [err, setErr] = useState<Record<number, boolean>>({});

  const mainSrc = images[active]?.original || images[active]?.thumbnail || '';
  const thumbs = images.slice(0, 4);
  const clip = { clipPath: 'url(#pdp-img-curve)', WebkitClipPath: 'url(#pdp-img-curve)' } as React.CSSProperties;

  return (
    <div className="relative h-full min-h-[460px] w-full lg:min-h-[620px]">
      {/* responsive clip-path def */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="pdp-img-curve" clipPathUnits="objectBoundingBox">
            <path d={CURVE} />
          </clipPath>
        </defs>
      </svg>

      {/* back echo layer — same curve, shifted right → a 2nd visible curve */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-[14px] bg-gradient-to-br from-sage-200 to-sage-100 sm:translate-x-[22px]"
        style={clip}
      />

      {/* front image panel — bleeds left, multi-curve right edge */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#E9F0E2] via-[#F1F3E8] to-[#F6F2E6]"
        style={clip}
      >
        {mainSrc && !err[active] ? (
          <Image
            src={mainSrc}
            alt={productName}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 55vw"
            onError={() => setErr((e) => ({ ...e, [active]: true }))}
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center px-6 text-center font-poppins text-2xl font-semibold text-forest-800/40">
            {productName}
          </span>
        )}
      </div>

      {/* vertical thumbnail strip — outer (left) side */}
      <div className="absolute left-3 top-8 z-10 flex flex-col gap-3 sm:left-6 sm:top-10">
        {thumbs.map((img, i) => {
          const src = img.thumbnail || img.original || '';
          return (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-[52px] w-[52px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_20px_-8px_rgba(34,48,26,0.4)] transition sm:h-[68px] sm:w-[68px] ${
                active === i
                  ? 'ring-2 ring-forest-600 ring-offset-2 ring-offset-[#F4F1E6]'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {src ? (
                <Image src={src} alt="" fill sizes="68px" className="object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-forest-700/30">🌿</span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="360 degree view"
          className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-forest-900 text-white shadow-[0_8px_20px_-8px_rgba(34,48,26,0.5)] transition hover:bg-forest-800 sm:h-[68px] sm:w-[68px]"
        >
          <span className="flex flex-col items-center gap-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v4h4" />
            </svg>
            <span className="text-[7.5px] font-semibold leading-none">360° View</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlantAtHomeGallery;
