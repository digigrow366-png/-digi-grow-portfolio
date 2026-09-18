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
  // Exact user scaling threshold
  const targetScale = 1 - (total - index) * 0.04;
  const startRange = index / total;
  const endRange = 1;

  const scale = useTransform(scrollYProgress, [startRange, endRange], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [startRange, endRange], [1, 0.88]);

  return (
    <div className="sticky top-0 min-h-[100vh] w-full flex items-start justify-center pt-6 md:pt-10">
      <motion.div
        style={{
          scale,
          opacity,
          top: `calc(${index * 16}px)`,
        }}
        className={`relative w-full max-w-7xl h-[calc(100vh-24px)] md:h-[calc(100vh-40px)] flex flex-col rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
