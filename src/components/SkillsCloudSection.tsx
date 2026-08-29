"use client";

import React from "react";
import Image from "next/image";
import { TechIconCloud } from "./TechIconCloud";
import { motion } from "framer-motion";
import { NothingDotText, ndotFont } from "./NothingDotText";

const floatingBadges = [
  {
    id: 1,
    title: "Google Gemini",
    icon: <Image src="https://cdn.simpleicons.org/googlegemini/8E75B2" alt="Google Gemini" className="w-5 h-5" width={20} height={20} />,
    position: "top-[5%] left-[2%] md:top-[15%] md:left-[5%]",
    delay: 0,
  },
  {
    id: 2,
    title: "Claude AI",
    icon: <Image src="https://cdn.simpleicons.org/anthropic/D97757" alt="Claude AI" className="w-5 h-5" width={20} height={20} />,
    position: "bottom-[15%] left-[5%] md:bottom-[20%] md:left-[10%]",
    delay: 1.5,
  },
  {
    id: 3,
    title: "Figma",
    icon: <Image src="https://cdn.simpleicons.org/figma/F24E1E" alt="Figma" className="w-5 h-5" width={20} height={20} />,
    position: "top-[45%] left-[-2%] md:top-[50%] md:left-[2%]",
    delay: 0.9,
  },
  {
    id: 4,
    title: "After Effects",
    icon: <Image src="https://cdn.simpleicons.org/adobeaftereffects/9999FF" alt="After Effects" className="w-5 h-5" width={20} height={20} />,
    position: "top-[10%] right-[2%] md:top-[20%] md:right-[5%]",
    delay: 0.8,
  },
  {
    id: 5,
    title: "Premiere Pro",
    icon: <Image src="https://cdn.simpleicons.org/adobepremierepro/9999FF" alt="Premiere Pro" className="w-5 h-5" width={20} height={20} />,
    position: "top-[45%] right-[-2%] md:top-[50%] md:right-[2%]",
    delay: 1.2,
  },
  {
    id: 6,
    title: "Omni Flash",
    icon: (
      <svg className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    position: "bottom-[20%] right-[5%] md:bottom-[25%] md:right-[8%]",
    delay: 2.2,
  },
];

export function SkillsCloudSection() {
  return (
    <section id="tools" className="relative w-full py-10 md:py-12 overflow-hidden flex flex-col items-center justify-center h-full" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Background Ambient Glow (Red Light Effect matching the theme) */}
      <div 
        className="absolute w-[800px] h-[500px] blur-[150px] pointer-events-none rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 60%)",
          opacity: 0.15,
        }}
      />

      {/* Decorative Orbital Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-white/[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/[0.08] pointer-events-none" />

      {/* Section Typography */}
      <div className="text-center mb-4 md:mb-10 relative z-10 px-4 mt-2 md:mt-8">
        <div className="flex justify-center mb-2">
          <NothingDotText text="SYSTEM ACTIVE" variant="white" size="sm" />
        </div>
        <div className="flex justify-center mt-4">
          <NothingDotText
            text={"Technologies & AI Models"}
            variant="theme"
            size="md"
            enableGlitch={false}
          />
        </div>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mt-3 font-mono">
          Drag or hover over the sphere to explore the full interactive ecosystem.
        </p>
      </div>

      {/* Core Display Area */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center md:justify-between px-4 md:px-12 gap-8 md:gap-4 pb-12">
        
        {/* Left Side: Tech Badges (Tools) */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 w-full md:w-1/2 z-20">
          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: badge.delay * 0.2 }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-950/80 border border-zinc-800 backdrop-blur-md shadow-lg transition-all hover:border-zinc-600 hover:scale-105 cursor-default"
            >
              <div className="p-1 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800">
                {badge.icon}
              </div>
              <span className={`text-[11px] md:text-xs font-semibold tracking-widest uppercase pr-1 ${ndotFont.className}`} style={{ color: "var(--color-primary)" }}>
                {badge.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right Side: 3D Sphere Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-30 flex items-center justify-center w-full md:w-1/2 aspect-square max-w-[240px] md:max-w-[450px]"
        >
          <TechIconCloud />
        </motion.div>

      </div>
    </section>
  );
}
