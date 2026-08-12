"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value,
  suffix = "",
  compact = false,
  duration = 1800,
  className = "",
}: {
  value: number;
  suffix?: string;
  compact?: boolean;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const decimals = value % 1 !== 0 ? (value.toString().split(".")[1]?.length || 0) : 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Number((value * eased).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  const text = compact
    ? display >= 1000
      ? `${display % 1000 === 0 ? display / 1000 : (display / 1000).toFixed(1)}k`
      : `${display}`
    : display.toString();

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}
