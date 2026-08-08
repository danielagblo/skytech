"use client";

import {
  useRef,
  useEffect,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

export interface TestimonialData {
  quote: string;
  name: string;
  title: string;
}

function TestimonialCard({ quote, name, title }: TestimonialData) {
  return (
    <div className="shrink-0 w-80 border border-gray-500 rounded-none p-6 flex flex-col justify-between gap-4 bg-[#f9f9f9]">
      <p className="text-gray-800 text-base leading-relaxed">{quote}</p>
      <div className="text-center">
        <p className="text-xl font-bold font-serif">-{name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  );
}

function ScrollRow({
  items,
  speed = 0.4,
  reverse = false,
}: {
  items: TestimonialData[];
  speed?: number;
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isPausedRef = useRef(false);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!isPausedRef.current) {
        posRef.current += reverse ? -speed : speed;
        const half = track.scrollWidth / 2;

        if (posRef.current >= half) posRef.current = 0;
        if (posRef.current < 0) posRef.current = half;
        track.style.transform = `translateX(${-posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, reverse]);

  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    isPausedRef.current = true;
    startX.current = e.clientX;
    startScroll.current = posRef.current;
  };

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.clientX;
    posRef.current = startScroll.current + delta;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    isPausedRef.current = false;
  };

  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    isPausedRef.current = true;
    startX.current = e.touches[0].clientX;
    startScroll.current = posRef.current;
  };

  const onTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    const delta = startX.current - e.touches[0].clientX;
    posRef.current = startScroll.current + delta;
  };

  const onTouchEnd = () => {
    isPausedRef.current = false;
  };

  return (
    <div
      className="cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex flex-row gap-4 w-max will-change-transform"
        style={{ userSelect: "none" }}
      >
        {items.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsBanner({ testimonials }: { testimonials?: TestimonialData[] }) {
  const list = testimonials && testimonials.length > 0 ? testimonials : [];
  if (list.length === 0) return null;

  const doubled = [...list, ...list];

  const rows = doubled.reduce<TestimonialData[][]>((acc, item, i) => {
    const rowIndex = Math.floor(i / (doubled.length / 2)) % 2;
    if (!acc[rowIndex]) acc[rowIndex] = [];
    acc[rowIndex].push(item);
    return acc;
  }, []);

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="section-shell mb-10 text-center md:mb-14">
        <span className="pill">Testimonials</span>
        <h2 className="section-title mt-3 text-balance">
          What our partners say
        </h2>
        <p className="section-lead mx-auto mt-4 max-w-2xl">
          Real words from real businesses we have helped grow across borders.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <ScrollRow items={rows[0] || []} speed={0.4} />
        <ScrollRow items={rows[1] || []} speed={0.4} reverse />
      </div>
    </section>
  );
}
