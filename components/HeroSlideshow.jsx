'use client';

import { useState, useEffect } from 'react';

const images = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 w-full h-full">
      {images.map((img, idx) => {
        // Calculate wrapping sliding offset (-1, 0, or 1)
        let offset = idx - currentIndex;
        if (offset < -1) offset += images.length;
        if (offset > 1) offset -= images.length;

        return (
          <div
            key={img}
            className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{
              transform: `translateX(${offset * 100}%)`,
              zIndex: idx === currentIndex ? 10 : 5,
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${img})`,
                backgroundPosition: 'center 20%',
              }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-slate-950/40 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
