"use client";

import React from "react";
import { motion, useTransform, MotionValue, useScroll } from "framer-motion";

interface StickyStackSectionProps {
  children: React.ReactNode;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  className?: string;
}

export function StickyStackSection({
  children,
  index,
  total,
  scrollYProgress,
  className = "bg-zinc-950",
}: StickyStackSectionProps) {
  // Use a local ref for this specific card's scroll tracking
  const ref = React.useRef<HTMLDivElement>(null);
  
  // Track scroll of THIS card wrapper to animate its scale/opacity
  // as it gets covered by the next card.
  const { scrollYProgress: cardScrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Calculate scaling
  const targetScale = 1 - (total - index) * 0.04;
  
  const scale = useTransform(cardScrollY, [0, 1], [1, targetScale]);
  const opacity = useTransform(cardScrollY, [0, 1], [1, 0.88]);

  // Last card doesn't need to scale down or be sticky in a tall wrapper
  const isLast = index === total - 1;

  if (isLast) {
    return (
      <div ref={ref} className="relative w-full pb-12 z-10">
        <div className={`relative w-full max-w-7xl mx-auto min-h-[90vh] rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full h-[150vh]">
      <div className="sticky top-6 md:top-10 h-[92vh] w-full flex items-center justify-center">
        <motion.div
          style={{
            scale,
            opacity,
            top: `calc(${index * 16}px)`,
            transformOrigin: "top center",
          }}
          className={`relative w-full max-w-7xl h-full rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden will-change-transform ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
