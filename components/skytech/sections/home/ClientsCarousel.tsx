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
        setRowsPerSlide(6);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
        setRowsPerSlide(4);
      } else {
        setItemsPerView(6);
        setRowsPerSlide(4);
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
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
  };

  const offset = currentIndex * -100;

  return (
    <div className="relative bg-[#1a2332] rounded-2xl mx-4 sm:mx-8 lg:mx-auto lg:max-w-[80rem]">
      <div className="relative flex items-center group">
        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute -left-4 z-10 hidden items-center justify-center rounded-full border border-white/10 bg-[#1a2332] p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white md:group-hover:flex"
          aria-label="Previous clients"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel */}
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
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 w-full shrink-0"
                >
                  {slidePartners.map((partner, idx) => (
                    <div
                      key={`${idx}-${partner.name || partner.logoUrl}`}
                      className="flex items-center justify-center border-[0.5px] border-white/[0.08] px-4 py-7 sm:px-6 sm:py-9"
                    >
                      <img
                        src={partner.logoUrl}
                        alt={partner.name || "Brand"}
                        className="h-8 sm:h-10 md:h-12 w-auto max-w-[9rem] sm:max-w-[11rem] object-contain"
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute -right-4 z-10 hidden items-center justify-center rounded-full border border-white/10 bg-[#1a2332] p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white md:group-hover:flex"
          aria-label="Next clients"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {totalSlides > 1 && (
        <div className="py-4 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, slideIdx) => (
            <button
              key={slideIdx}
              onClick={() => setCurrentIndex(slideIdx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === slideIdx ? "w-6 bg-white/60" : "w-1.5 bg-white/15"
              }`}
              aria-label={`Go to slide ${slideIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
