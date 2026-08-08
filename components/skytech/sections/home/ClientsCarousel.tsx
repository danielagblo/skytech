"use client";

import React, { useState, useEffect } from "react";

interface Partner {
  name: string;
  logoUrl: string;
}

export default function ClientsCarousel({ partners }: { partners: Partner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [rowsPerSlide, setRowsPerSlide] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(3);
        setRowsPerSlide(6); // More rows on mobile (6 rows)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
        setRowsPerSlide(4); // 4 rows on tablet
      } else {
        setItemsPerView(6);
        setRowsPerSlide(4); // 4 rows on desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerSlide = itemsPerView * rowsPerSlide;
  const totalSlides = Math.ceil(partners.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Support swipe on mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const offset = currentIndex * -100;

  return (
    <div className="relative border-y border-slate-200 bg-slate-50/60 py-10">
      <div className="section-shell relative flex items-center group px-8">
        {/* Left Button - Desktop Only */}
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 hidden items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-soft transition hover:bg-slate-50 hover:text-slate-900 md:group-hover:flex"
          aria-label="Previous clients"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Window */}
        <div
          className="w-full overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${offset}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIdx) => {
              const slidePartners = partners.slice(
                slideIdx * itemsPerSlide,
                (slideIdx + 1) * itemsPerSlide
              );
              return (
                <div
                  key={slideIdx}
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-8 w-full shrink-0 items-center justify-center py-4"
                >
                  {slidePartners.map((partner, idx) => (
                    <div
                      key={`${idx}-${partner.name || partner.logoUrl}`}
                      className="flex items-center justify-center"
                    >
                      <img
                        src={partner.logoUrl}
                        alt={partner.name || "Brand"}
                        className="h-10 w-auto max-w-[10rem] object-contain sm:h-12 md:h-14 md:max-w-[12.5rem]"
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Button - Desktop Only */}
        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 hidden items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-soft transition hover:bg-slate-50 hover:text-slate-900 md:group-hover:flex"
          aria-label="Next clients"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile/Tablet Indicators */}
      {totalSlides > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, slideIdx) => (
            <button
              key={slideIdx}
              onClick={() => setCurrentIndex(slideIdx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === slideIdx ? "w-6 bg-brand-600" : "w-2 bg-slate-300"
              }`}
              aria-label={`Go to slide ${slideIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
