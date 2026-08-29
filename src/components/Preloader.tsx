"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ndotFont } from "@/components/NothingDotText";

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

export function Preloader({ onLoadingComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Store the callback in a ref so we don't re-trigger the effect on every render
  const onCompleteRef = React.useRef(onLoadingComplete);
  useEffect(() => {
    onCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  useEffect(() => {
    // Lock scroll during loading safely
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let completionTimeout: NodeJS.Timeout;
    let overflowTimeout: NodeJS.Timeout;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completionTimeout = setTimeout(() => {
            setIsLoading(false);
            if (onCompleteRef.current) onCompleteRef.current();
            
            // Wait for the slide-up animation (0.85s) before restoring scroll
            overflowTimeout = setTimeout(() => {
              document.body.style.overflow = originalOverflow;
            }, 900);
          }, 300);
          return 100;
        }

        // Fast organic number jumps
        const jump = Math.floor(Math.random() * 8) + 2;
        return Math.min(prev + jump, 100);
      });
    }, 32);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimeout);
      clearTimeout(overflowTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader-overlay"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#0f0f11] text-white p-8 md:p-16 select-none"
        >
          {/* Top Status */}
          <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-zinc-400">
            <span>Portfolio 2026</span>
            <span>Initializing Experience</span>
          </div>

          {/* Bottom Huge Number Counter */}
          <div className="flex flex-col">
            <div className={`text-8xl sm:text-9xl md:text-[14rem] font-bold tracking-tighter leading-none ${ndotFont.className} text-[var(--color-primary)] drop-shadow-[0_0_15px_var(--color-primary)]`}>
              {count < 10 ? `0${count}` : count}
            </div>

            {/* Progress Line */}
            <div className="w-full h-[2px] bg-zinc-800 mt-6 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ width: `${count}%`, backgroundColor: "var(--color-primary)" }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
