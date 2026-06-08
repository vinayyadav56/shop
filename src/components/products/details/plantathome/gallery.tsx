'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useInWishlist, useToggleWishlist } from '@/framework/wishlist';
import { useUser } from '@/framework/user';

type GalleryImage = { original?: string; thumbnail?: string; id?: string | number };

const Heart = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? '#C26B45' : 'none'} stroke={active ? '#C26B45' : '#2E5E2A'} strokeWidth="1.7">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'left' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
  </svg>
);

type Props = {
  gallery: GalleryImage[];
  productId: number;
  productName: string;
  badge?: string | null;
};

const PlantAtHomeGallery: React.FC<Props> = ({ gallery, productId, productName, badge }) => {
  const images = (gallery?.length ? gallery : [{ original: '', thumbnail: '' }]) as GalleryImage[];
  const [active, setActive] = useState(0);
  const [imgErr, setImgErr] = useState<Record<number, boolean>>({});

  const { openModal } = useModalAction();
  const { isAuthorized } = useUser();
  const pid = String(productId);
  const { toggleWishlist } = useToggleWishlist(pid);
  const { inWishlist } = useInWishlist({ product_id: pid, enabled: isAuthorized });

  const go = (dir: number) =>
    setActive((i) => (i + dir + images.length) % images.length);

  const onHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthorized) return openModal('LOGIN_VIEW');
    toggleWishlist({ product_id: pid });
  };

  const mainSrc = images[active]?.original || images[active]?.thumbnail || '';

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* vertical thumbnails */}
      {images.length > 1 && (
        <div className="flex w-[68px] shrink-0 flex-col gap-3 sm:w-[88px] lg:w-[104px]">
          {images.slice(0, 4).map((img, i) => {
            const src = img.thumbnail || img.original || '';
            return (
              <button
                key={img.id ?? i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-[#EBE2CF] transition ${
                  active === i ? 'ring-2 ring-forest-600 ring-offset-1 ring-offset-cream-100' : 'hover:opacity-90'
                }`}
              >
                {src ? (
                  <Image src={src} alt={`${productName} ${i + 1}`} fill sizes="104px" className="object-contain p-1.5" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-forest-700/40">🌿</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* main image card */}
      <div className="relative flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-24px_rgba(34,48,26,0.25)]">
          {mainSrc && !imgErr[active] ? (
            <Image
              src={mainSrc}
              alt={productName}
              fill
              priority
              sizes="(max-width:1024px) 90vw, 560px"
              onError={() => setImgErr((e) => ({ ...e, [active]: true }))}
              className="object-contain p-8 sm:p-10"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-forest-800/40">
              <span className="font-cormorant text-2xl italic">{productName}</span>
            </span>
          )}

          {/* badge top-left */}
          {badge && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-[#F3E7CF] px-4 py-1.5 text-[13px] font-medium text-forest-900 shadow-sm">
              {badge}
            </span>
          )}

          {/* wishlist top-right */}
          <button
            type="button"
            onClick={onHeart}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-[#F3E7CF] text-forest-900 shadow-sm transition hover:scale-105"
          >
            <Heart active={inWishlist} />
          </button>

          {/* prev / next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute bottom-[14%] left-5 z-10 grid h-12 w-12 place-items-center rounded-full border border-kraft-300 bg-white text-forest-900 shadow-sm transition hover:bg-cream-100"
              >
                <Arrow dir="left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute bottom-[14%] right-5 z-10 grid h-12 w-12 place-items-center rounded-full bg-forest-700 text-white shadow-[0_10px_24px_-8px_rgba(34,48,26,0.6)] transition hover:bg-forest-800"
              >
                <Arrow dir="right" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantAtHomeGallery;
