"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { NothingDotText } from "@/components/NothingDotText";
import { useProfile } from "@/hooks/useProfile";
import Wordmark from "@/components/brand/Wordmark";

export default function MountainParallaxHero() {
  const { profile } = useProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Cursor Tracking Logic for Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 250, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 250, damping: 25 });

  useEffect(() => {
    // Initialize to center of screen
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      // For fixed viewport elements, clientX/clientY are perfect if we offset by half the element size
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 2. Scroll Parallax Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
  });

  // Parallax transforms
  // Text slides down incredibly fast so it ducks behind the avatar
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.5, 0]);
  
  // Avatar scales up slightly as we scroll down
  const avatarScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);
  // Avatar also moves up slightly to meet the scrolling content
  const avatarY = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);

  const roleTitle = profile?.role_title || "Creative Lead";
  const brandName = profile?.brand_name || "Digi Grow";
  const tagline = profile?.tagline || "We build digital experiences that grow your brand.";
  const [word1, ...rest] = brandName.split(" ");
  const word2 = rest.join(" ") || "";

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[92vh] flex items-center justify-center select-none" style={{ backgroundColor: "var(--color-background)" }}>

        
        {/* ░░ LAYER 1: Background Ambient & Interactive Glow (z-0) ░░ */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className="absolute inset-0 opacity-30 blur-[120px]"
            style={{
              background: "radial-gradient(circle at center, var(--color-primary) 0%, transparent 60%)"
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px]"
            style={{
              x: smoothMouseX,
              y: smoothMouseY,
              background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
              opacity: 0.65,
            }}
          />
          {/* Subtle tech grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>

        {/* ░░ LAYER 2: Parallax Text & UI Elements (z-10) ░░ */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute inset-0 z-10 w-full h-full flex items-center justify-between px-8 md:px-16 pointer-events-none"
        >
          {/* LEFT SIDE — HEADLINE TYPOGRAPHY */}
          <div className="relative flex flex-col items-start justify-center w-1/2">
            <div className="flex flex-col items-start justify-start gap-1">
              <NothingDotText
                text={word1}
                variant="white"
                size="lg"
                enableGlitch={true}
              />
              {word2 && (
                <NothingDotText
                  text={word2}
                  variant="theme"
                  size="md"
                  enableGlitch={false}
                />
              )}
            </div>
            <p className="text-sm md:text-base mt-6 leading-relaxed font-light max-w-sm text-left" style={{ color: "var(--color-muted)" }}>
              {tagline}
            </p>
          </div>

          {/* RIGHT SIDE — METADATA & PILLS */}
          <div className="relative flex flex-col items-end justify-center w-1/2 gap-6 mt-12 md:mt-24">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md"
              style={{
                borderColor: "color-mix(in srgb, var(--color-primary) 35%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-primary)" }} />
              <span className="text-[11px] font-mono tracking-[0.18em] uppercase" style={{ color: "color-mix(in srgb, var(--color-primary) 75%, var(--color-text))" }}>
                {roleTitle}
              </span>
            </div>

            {/* LIVE PROJECT NOTIFICATION PILL */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-white/10 rounded-sm bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors cursor-default pointer-events-auto">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
              </div>
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white">
                LIVE PROJECT
              </span>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[10px] font-mono tracking-widest" style={{ color: "var(--color-muted)", opacity: 0.55 }}>
              <span>SCROLL TO EXPLORE</span>
              <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-primary)" }} />
            </div>
          </div>
        </motion.div>

        {/* ░░ LAYER 3: Foreground Avatar Cutout (z-20) ░░ */}
        <motion.div
          style={{ scale: avatarScale, y: avatarY }}
          className="absolute inset-x-0 bottom-0 z-20 w-full h-[75%] md:h-[85%] pointer-events-none flex items-end justify-center"
        >
          <img
            src="/avatar.png"
            alt={profile?.full_name || "Avatar"}
            draggable={false}
            className="w-auto h-full object-contain object-bottom origin-bottom"
            style={{
              filter: `drop-shadow(0 -10px 40px color-mix(in srgb, var(--color-primary) 40%, transparent))`,
              maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            }}
          />
        </motion.div>

        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30 pointer-events-auto">
          <Wordmark />
        </div>

        {/* ░░ LAYER 4: Fixed Navigation (z-40) ░░ */}
        <nav className="fixed top-6 right-6 md:top-10 md:right-10 z-[60] flex items-center gap-3 md:gap-6 flex-wrap justify-end max-w-[150px] md:max-w-none pointer-events-auto">
          {[
            { label: "About", href: "#about" },
            { label: "Work", href: "#work" },
            { label: "Tools", href: "#tools" },
            { label: "Contact", href: "#contact" },
          ].map(({ label, href }) => (
            <a 
              key={label} 
              href={href} 
              data-cursor-hover 
              className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
    </div>
  );
}
