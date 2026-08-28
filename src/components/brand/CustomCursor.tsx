"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom brand cursor — adapted from InvertedCursor reference.
 *
 * Mounts once in the root layout, overlays the entire site.
 * Color comes from --color-primary (theme), not hardcoded.
 * mix-blend-difference makes it read correctly over any background.
 *
 * BUG-08: Only renders on pointer-fine (desktop) devices.
 *         Never disables the native cursor on touch/mobile.
 *
 * Delegated hover: any element with data-cursor-hover triggers the scale-up,
 * so ProjectGrid cards, nav links, and buttons opt in without prop drilling.
 */
export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    /* BUG-08: Check for pointer-fine device */
    const pointerQuery = window.matchMedia("(pointer: fine)");
    setIsPointerFine(pointerQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    pointerQuery.addEventListener("change", handlePointerChange);

    /* Respect prefers-reduced-motion */
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      pointerQuery.removeEventListener("change", handlePointerChange);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    if (!isPointerFine) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    /* Delegated hover: any element with data-cursor-hover triggers scale-up */
    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor-hover]");
      setIsHovered(Boolean(target));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [isPointerFine, mouseX, mouseY]);

  /* Don't render on touch devices, when reduced motion is preferred, or in the Admin panel */
  if (!isPointerFine || prefersReducedMotion || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          html, body, a, button, [data-cursor-hover], input, textarea, select { 
            cursor: none !important; 
          }
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "var(--color-primary)",
        }}
        animate={{
          width: isHovered ? 72 : 36,
          height: isHovered ? 72 : 36,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </>
  );
}
