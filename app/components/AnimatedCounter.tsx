"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * Smooth animated counter that triggers when scrolled into view.
 */
export function AnimatedCounter({
  value,
  duration = 2,
  className = "",
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const start = 0;
    const startTime = performance.now();
    const targetValue = value;
    const animDuration = duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animDuration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (targetValue - start) * eased);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={`number-ticker ${className}`}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </motion.span>
  );
}
