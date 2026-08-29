"use client";

import React from "react";
import { motion } from "framer-motion";
import { DotGothic16 } from "next/font/google";

export const ndotFont = DotGothic16({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

interface NothingDotTextProps {
  text: string;
  variant?: "red" | "white" | "muted" | "theme";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  bracketed?: boolean;
  enableGlitch?: boolean;
}

export const NothingDotText: React.FC<NothingDotTextProps> = ({
  text,
  variant = "red",
  size = "lg",
  className = "",
  bracketed = false,
  enableGlitch = false,
}) => {
  const variantStyles = {
    red: "text-[var(--color-primary)] drop-shadow-[0_0_12px_var(--color-primary)]",
    white: "text-zinc-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]",
    muted: "text-zinc-400 drop-shadow-none",
    theme: "text-[var(--color-primary)] drop-shadow-[0_0_12px_var(--color-primary)]",
  };

  const sizeClasses = {
    sm: "text-[clamp(0.875rem,2.5vw,1rem)] tracking-[0.15em]",
    md: "text-[clamp(1.25rem,4vw,1.875rem)] tracking-[0.18em]",
    lg: "text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[0.2em]",
    xl: "text-[clamp(3.5rem,9vw,8rem)] leading-none tracking-[0.2em]",
  };

  const displayText = bracketed ? `[ ${text.toUpperCase()} ]` : text.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`inline-flex items-center select-none font-bold uppercase ${ndotFont.className} ${variantStyles[variant]} ${sizeClasses[size]} ${className}`}
    >
      {/* Nothing OS LED Dot Effect */}
      <span className="relative">
        {displayText}
        {enableGlitch && (
          <motion.span
            animate={{
              opacity: [1, 0.4, 1, 0.8, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 blur-[1.5px] opacity-70"
            style={{ color: "inherit" }}
          >
            {displayText}
          </motion.span>
        )}
      </span>
    </motion.div>
  );
};
