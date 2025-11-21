"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultAssets } from "@/content/assets";

type Slide = {
  src: string;
  alt: string;
};

const MIDDLE_SLIDES: Slide[] = [
  { src: "/carousel/middle-1.jpg", alt: "Middle carousel image 1" },
  { src: "/carousel/middle-2.jpg", alt: "Middle carousel image 2" },
  { src: "/carousel/middle-3.jpg", alt: "Middle carousel image 3" },
];

const INTERVAL_MS = 6000;

type MiniCarouselProps = {
  slides: Slide[];
  priority?: boolean;
};

function MiniCarousel({ slides, priority }: MiniCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const active = slides[index];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#D9A441]/80 bg-black/80">
      <Image
        src={active.src}
        alt={active.alt}
        fill
        sizes="(min-width: 1024px) 30vw, 100vw"
        priority={priority}
        className="object-cover transition-opacity duration-700 ease-out will-change-opacity"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-[#D9A441]"
                : "w-2 bg-white/70 hover:w-4 hover:bg-[#D9A441]/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type HeroCarouselProps = {
  heroPrimary?: string;
  heroSecondary?: string;
};

export function HeroCarousel({
  heroPrimary,
  heroSecondary,
}: HeroCarouselProps) {
  const leftSlides: Slide[] = [
    {
      src: heroPrimary ?? defaultAssets.heroPrimary,
      alt: "Hero primary image",
    },
    { src: "/carousel/left-2.jpg", alt: "Left carousel image 2" },
    { src: "/carousel/left-3.jpg", alt: "Left carousel image 3" },
  ];

  const rightSlides: Slide[] = [
    {
      src: heroSecondary ?? defaultAssets.heroSecondary,
      alt: "Hero secondary image",
    },
    { src: "/carousel/right-2.jpg", alt: "Right carousel image 2" },
    { src: "/carousel/right-3.jpg", alt: "Right carousel image 3" },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#D9A441]/60 bg-[#FFF9F2] shadow-lg shadow-black/30">
      <div className="relative flex h-full w-full flex-col gap-3 px-3 py-3 sm:h-[320px] sm:flex-row md:h-[360px]">
        <div className="h-52 w-full sm:h-full sm:flex-1">
          <MiniCarousel slides={leftSlides} priority />
        </div>
        <div className="h-52 w-full sm:h-full sm:flex-1">
          <MiniCarousel slides={MIDDLE_SLIDES} />
        </div>
        <div className="h-52 w-full sm:h-full sm:flex-1">
          <MiniCarousel slides={rightSlides} />
        </div>
      </div>
    </div>
  );
}
