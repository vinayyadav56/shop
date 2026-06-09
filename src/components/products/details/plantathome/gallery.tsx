'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type GalleryImage = { original?: string; thumbnail?: string; id?: string | number };

type Props = {
  gallery: GalleryImage[];
  productName: string;
};

const PlantAtHomeGallery: React.FC<Props> = ({ gallery, productName }) => {
  const images = (gallery?.length ? gallery : [{ original: '', thumbnail: '' }]) as GalleryImage[];
  const [active, setActive] = useState(0);
  const [err, setErr] = useState<Record<number, boolean>>({});

  const mainSrc = images[active]?.original || images[active]?.thumbnail || '';
  const thumbs = images.slice(0, 4);

  return (
    <div className="relative">
      {/* main image — soft sunlit panel, organic rounded edge */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E9F0E2] via-[#F1F3E8] to-[#F6F2E6] shadow-[0_34px_80px_-34px_rgba(34,48,26,0.32)] sm:rounded-[2.5rem] sm:rounded-tl-[6rem]">
        {mainSrc && !err[active] ? (
          <Image
            src={mainSrc}
            alt={productName}
            fill
            priority
            sizes="(max-width:1024px) 92vw, 620px"
            onError={() => setErr((e) => ({ ...e, [active]: true }))}
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center px-6 text-center font-poppins text-2xl font-semibold text-forest-800/40">
            {productName}
          </span>
        )}
      </div>

      {/* floating vertical thumbnail strip (right edge) */}
      <div className="absolute right-2.5 top-6 flex flex-col gap-3 sm:right-4 sm:top-9">
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

        {/* 360° view thumb (decorative, matches mockup) */}
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
