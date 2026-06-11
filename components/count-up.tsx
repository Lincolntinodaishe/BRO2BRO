"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  active: boolean;
  className?: string;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({
  end,
  suffix = "",
  decimals = 0,
  duration = 1800,
  active,
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!active) {
      setDisplay((0).toFixed(decimals));
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = end * easeOutCubic(progress);
      setDisplay(current.toFixed(decimals));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, decimals, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {display}
      {suffix}
    </span>
  );
}

export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: "-5% 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
