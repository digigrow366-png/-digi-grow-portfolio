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

/**
 * Sticky stacking card section.
 * Each card sticks to the viewport top. As the user scrolls,
 * earlier cards scale down, dim, and get "pushed behind" by the next card
 * sliding up from below — like a physical card deck.
 *
 * Mobile: Uses dvh for correct viewport on iOS Safari.
 * Performance: will-change-transform for GPU compositing.
 */
export function StickyStackSection({
  children,
  index,
  total,
  scrollYProgress,
  className = "bg-zinc-950",
}: StickyStackSectionProps) {
  // Each card starts scaling when the NEXT card begins to appear
  const segmentSize = 1 / total;
  const startRange = index * segmentSize;
  const endRange = 1;

  // Scale: 1 → ~0.92 (more dramatic stacking feel)
  const targetScale = 1 - (total - index) * 0.025;
  const scale = useTransform(scrollYProgress, [startRange, endRange], [1, targetScale]);

  // Opacity: 1 -> 1 (Cards remain fully visible, no fading to black)
  const opacity = useTransform(scrollYProgress, [startRange, endRange], [1, 1]);

  // Brightness: no dimming effect
  const filterVal = "none";

  return (
    <div
      className="sticky top-0 w-full flex items-start justify-center pt-4 md:pt-8"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          filter: filterVal,
          top: `calc(${index * 14}px)`,
          height: `calc(100dvh - 32px - ${index * 14}px)`,
          minHeight: `calc(100vh - 32px - ${index * 14}px)`,
        }}
        className={`relative w-full max-w-7xl flex flex-col rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
