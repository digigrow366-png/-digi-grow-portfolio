"use client";

import React from "react";
import { motion } from "framer-motion";
import { NothingDotText } from "@/components/NothingDotText";

/**
 * "Digi Grow" logotype — using the custom 3D Pixel Art Typography engine.
 */
export default function Wordmark({ className = "", word1 = "Digi", word2 = "GROW" }: { className?: string, word1?: string, word2?: string }) {
  return (
    <motion.div
      className={`flex items-center select-none ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center group">
        <span className="font-sans tracking-tighter text-xl md:text-2xl" style={{ color: "var(--color-text)" }}>
          {word1}
        </span>
        <div className="ml-1.5 md:ml-2">
          <NothingDotText text={word2} variant="theme" size="sm" enableGlitch={true} />
        </div>
      </div>
    </motion.div>
  );
}
