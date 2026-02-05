"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  stopPropagation?: boolean; // true when inside clickable card
};

export default function TourImageCarousel({
  images,
  alt,
  className = "",
  stopPropagation = false,
}: Props) {
  const imgs = useMemo(
    () => Array.from(new Set((images || []).filter(Boolean))),
    [images]
  );

  const [idx, setIdx] = useState(0);
  const hasMany = imgs.length > 1;

  if (imgs.length === 0) return null;

  const stop = (e: React.SyntheticEvent) => {
    if (stopPropagation) e.stopPropagation();
  };

  const prev = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    setIdx((v) => (v - 1 + imgs.length) % imgs.length);
  };

  const next = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    setIdx((v) => (v + 1) % imgs.length);
  };

  return (
    <div className={`relative w-full aspect-[16/10] ${className}`} onClick={stop}>
      <Image
        src={imgs[idx]}
        alt={`${alt} image ${idx + 1}`}
        fill
        className="object-cover rounded-xl"
        sizes="(max-width: 768px) 100vw, 50vw"
        draggable={false}
      />

      {hasMany && (
        <>
                <button
        type="button"
        aria-label="Previous image"
        onClick={prev}
        className="absolute z-20 left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-black border border-white shadow-md flex items-center justify-center hover:bg-white"
        >
        ‹
        </button>

        <button
        type="button"
        aria-label="Next image"
        onClick={next}
        className="absolute z-20 right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-black border border-white shadow-md flex items-center justify-center hover:bg-white"
        >
        ›
        </button>


          <div className="absolute z-20 bottom-2 left-0 right-0 flex justify-center gap-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  stop(e);
                  setIdx(i);
                }}
                className={`h-2 w-2 rounded-full ${
                  i === idx ? "bg-white" : "bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
