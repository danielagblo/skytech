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
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      {images.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              animation: idx === currentIndex ? 'kenburns 15s ease-out forwards' : 'none',
            }}
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>
      ))}
      <style jsx>{`
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
