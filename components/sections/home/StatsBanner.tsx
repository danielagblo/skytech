import { useEffect, useRef, useState } from "react";

function CountUp({
  target,
  suffix = "",
  duration = 1500,
  isVisible,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    setCount(0);

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <>
      {count >= 1000 ? "1k" : count}
      {suffix}
    </>
  );
}

function StatsBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={bannerRef}
      className="bg-white grid grid-cols-4 px-10 py-6 w-screen uppercase text-lg font-medium leading-5"
    >
      <div>
        <p className="text-center px-17.5">
          <span className="block text-7xl font-semibold">
            <CountUp target={8} suffix="+" isVisible={isVisible} />
          </span>
          years in operation
        </p>
      </div>

      <div>
        <p className="text-center px-17.5">
          <span className="block text-7xl font-semibold">
            <CountUp target={8} suffix="+" isVisible={isVisible} />
          </span>
          Satisfied Customers
        </p>
      </div>

      <div>
        <p className="text-center px-17.5">
          <span className="block text-7xl font-semibold">
            <CountUp target={1000} suffix="+" isVisible={isVisible} />
          </span>
          Projects Completed
        </p>
      </div>

      <div>
        <p className="text-center px-17.5">
          <span className="block text-7xl font-semibold">
            <CountUp target={4} suffix="+" isVisible={isVisible} />
          </span>
          Countries Served
        </p>
      </div>
    </div>
  );
}

export default StatsBanner;