"use client";

import React, { useState, useEffect } from "react";
import {
  PARTNER_GRID_ROW_HEIGHT,
  getPartnerLogoStyle,
} from "@/app/lib/partnerLogo";

interface Partner {
  name: string;
  logoUrl: string;
  colSpan?: number;
  rowSpan?: number;
  logoScale?: number;
  visible?: boolean;
}

export default function ClientsCarousel({ partners }: { partners: Partner[] }) {
  const visiblePartners = partners.filter((p) => p.visible !== false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cols, setCols] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCols(3);
      else if (window.innerWidth < 1024) setCols(4);
      else setCols(6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Paginate based on how many "cell units" each partner takes
  const cellsPerSlide = cols * 4;
  const slides: Partner[][] = [];
  let currentSlide: Partner[] = [];
  let cellCount = 0;

  for (const p of visiblePartners) {
    const span = Math.min(p.colSpan || 1, cols);
    const rSpan = p.rowSpan || 1;
    const units = span * rSpan;
    if (cellCount + units > cellsPerSlide && currentSlide.length > 0) {
      slides.push(currentSlide);
      currentSlide = [];
      cellCount = 0;
    }
    currentSlide.push(p);
    cellCount += units;
  }
  if (currentSlide.length > 0) slides.push(currentSlide);

  const totalSlides = slides.length;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50) nextSlide();
    else if (d < -50) prevSlide();
  };

  const offset = currentIndex * -100;

  return (
    <div className="relative bg-white border-y border-slate-200 w-full">
      <div className="relative flex items-center group">
        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 z-10 hidden items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 md:group-hover:flex"
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
            {slides.map((slidePartners, slideIdx) => (
              <div
                key={slideIdx}
                className="w-full shrink-0"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridAutoRows: `${PARTNER_GRID_ROW_HEIGHT}px`,
                }}
              >
                {slidePartners.map((partner, idx) => {
                  const cSpan = Math.min(partner.colSpan || 1, cols);
                  const rSpan = partner.rowSpan || 1;
                  return (
                    <div
                      key={`${idx}-${partner.name || partner.logoUrl}`}
                      className="flex items-center justify-center overflow-hidden border-[0.5px] border-slate-100 bg-white p-4 min-h-0"
                      style={{
                        gridColumn: `span ${cSpan}`,
                        gridRow: `span ${rSpan}`,
                      }}
                    >
                      <img
                        src={partner.logoUrl}
                        alt={partner.name || "Brand"}
                        className="w-auto max-w-[85%] object-contain"
                        style={getPartnerLogoStyle(partner.logoScale)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 z-10 hidden items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 md:group-hover:flex"
          aria-label="Next clients"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {totalSlides > 1 && (
        <div className="py-4 flex justify-center gap-2">
          {slides.map((_, slideIdx) => (
            <button
              key={slideIdx}
              onClick={() => setCurrentIndex(slideIdx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === slideIdx ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300"
              }`}
              aria-label={`Go to slide ${slideIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
