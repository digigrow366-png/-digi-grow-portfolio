"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyStackSectionProps {
  children: React.ReactNode;
  index: number;
  total: number;
  /** Extra classes on the sticky inner card */
  className?: string;
}

/**
 * Global Stacking Cards Scroll Architecture
 *
 * Each section acts as a Card. It is natively sticky.
 * Because all cards share the same containing block (`<main>`),
 * they naturally stack on top of each other as the user scrolls down.
 * 
 * Card 1 pins to `top-6` and scales down/dims as the user scrolls further.
 * Card 2 slides up, hits `top-6`, pins, and so on.
 */
export function StickyStackSection({
  children,
  index,
  total,
  className = "",
}: StickyStackSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  // We track the scroll progress of THIS specific card.
  // When this card hits the top of the viewport ("start start")
  // and until its bottom hits the top of the viewport ("end start"),
  // we apply the scale down effect.
  // Wait: if it's sticky, its layout position (which useScroll uses)
  // still triggers exactly as if it scrolled normally.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const isLast = index === total - 1;
  
  // Use continuous [0, 1] mapping for buttery smooth 60fps animation, 
  // but with gentler endpoints so the transition feels slower and less aggressive.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.65]);
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(4px)"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);

  if (isLast) {
    return (
      <div ref={ref} className={`relative w-full pb-12`} style={{ zIndex: index + 1 }}>
        <div
          className={`w-full h-auto overflow-hidden 
            rounded-[2rem] md:rounded-[2.8rem] border border-white/10 shadow-2xl
            ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full h-[115dvh] lg:h-[150dvh]">
      <div className="sticky top-4 md:top-8 h-[92dvh] w-full z-10 flex items-center justify-center">
        <motion.div
          style={{
            scale,
            opacity,
            filter,
            y,
            transformOrigin: "top center",
          }}
          className={`w-full h-full overflow-hidden will-change-transform 
            rounded-[2rem] md:rounded-[2.8rem] border border-white/10 shadow-2xl
            ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
