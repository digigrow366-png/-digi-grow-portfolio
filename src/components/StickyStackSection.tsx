"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

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
  className = "bg-[var(--color-background)]",
}: StickyStackSectionProps) {
  // Each card's scaling threshold
  const targetScale = 1 - (total - index - 1) * 0.04;
  
  // Calculate when this card should start scaling down
  // (when the next card starts covering it)
  const startRange = index / total;
  const endRange = 1;

  const scale = useTransform(scrollYProgress, [startRange, endRange], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [startRange, endRange], [1, 0.65]);
  const filter = useTransform(scrollYProgress, [startRange, endRange], ["blur(0px)", "blur(4px)"]);

  // We don't apply scale to the last card because nothing covers it
  const isLast = index === total - 1;

  return (
    <div className="sticky top-4 md:top-8 min-h-[92vh] w-full flex items-center justify-center mb-12 lg:mb-24">
      <motion.div
        style={{
          scale: isLast ? 1 : scale,
          opacity: isLast ? 1 : opacity,
          filter: isLast ? "blur(0px)" : filter,
          top: `calc(${index * 12}px)`,
          transformOrigin: "top center",
        }}
        className={`relative w-full max-w-7xl min-h-[90vh] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
