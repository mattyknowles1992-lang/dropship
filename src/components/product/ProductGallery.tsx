"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  featured: string;
  gallery: string[];
  alt: string;
};

export function ProductGallery({ featured, gallery, alt }: ProductGalleryProps) {
  const images = useMemo(() => {
    const ordered = [featured, ...gallery];
    return ordered.filter((src, index) => ordered.indexOf(src) === index);
  }, [featured, gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? featured;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#D9A441]/40 bg-black/60">
        <Image
          src={activeImage}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl border transition ${
                activeIndex === index
                  ? "border-[#D9A441] shadow-lg shadow-black/70"
                  : "border-[#374151] hover:border-[#D9A441]/70"
              }`}
              aria-label={`View product image ${index + 1}`}
            >
              <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
