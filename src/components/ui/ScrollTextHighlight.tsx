"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ndotFont } from "@/components/NothingDotText";

/**
 * A single word that transitions opacity & color as the parent
 * container scrolls through the viewport.
 */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(progress, range, [
    "var(--color-muted, #52525b)",
    "var(--color-primary, #d946ef)",
  ]);

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.3em] will-change-[opacity,color]"
    >
      {children}
    </motion.span>
  );
}

/**
 * ScrollTextHighlight — wraps a text string and highlights
 * each word sequentially as the user scrolls.
 *
 * Uses the portfolio's CSS custom properties for colors so it
 * respects whatever theme is active.
 */
export function ScrollTextHighlight({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "end 0.1"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={className}>
      <p className={`text-2xl md:text-3xl leading-relaxed flex flex-wrap ${ndotFont.className}`} style={{ imageRendering: "pixelated" }}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}
