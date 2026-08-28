"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { SubCard } from "@/types/project";
import { ndotFont } from "@/components/NothingDotText";

export function ProjectSubCards({ cards }: { cards: SubCard[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!cards?.length) return null;

  const totalCards = cards.length;
  const middleIndex = Math.floor(totalCards / 2);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full p-8 overflow-hidden select-none mb-16">
      {/* Toggle / Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        data-cursor-hover
        className="mb-14 px-5 py-2.5 rounded-full bg-white/5 text-[var(--color-text)] border border-white/10 text-xs font-mono tracking-wider uppercase hover:bg-white/10 transition-all shadow-md active:scale-95"
      >
        {isExpanded ? "Stack Cards (Collapse)" : "Fan Out Deck (Expand)"}
      </button>

      {/* Cards Deck Container */}
      <div className="relative w-[280px] h-[380px] flex items-center justify-center">
        {cards.map((card, index) => {
          const offset = index - middleIndex;

          // Fan-out calculations
          const xSpread = isExpanded ? offset * 140 : offset * 4;
          const rotation = isExpanded ? offset * 6 : offset * 2;
          const yArc = isExpanded ? Math.abs(offset) * 12 : offset * 3;
          const isHovered = hoveredIndex === index;

          const Wrapper = card.url ? "a" : "div";
          const wrapperProps = card.url 
            ? { href: card.url, target: "_blank", rel: "noopener noreferrer", className: "block h-full w-full flex flex-col justify-between" } 
            : { className: "block h-full w-full flex flex-col justify-between" };

          return (
            <motion.div
              key={index}
              onClick={() => setIsExpanded(!isExpanded)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={false}
              data-cursor-hover={card.url ? true : undefined}
              animate={{
                x: xSpread,
                y: isHovered ? yArc - 24 : yArc,
                rotateZ: isHovered ? 0 : rotation,
                scale: isHovered ? 1.05 : 1,
                zIndex: isHovered ? 50 : 10 + index,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.8,
              }}
              className="absolute top-0 left-0 w-[270px] h-[370px] rounded-3xl p-6 cursor-pointer border border-white/10 shadow-2xl bg-[#0f0f11] text-white transition-colors hover:border-white/20"
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Wrapper {...(wrapperProps as any)}>
                {/* Top Section */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wide text-zinc-500">
                      Card {String(index + 1).padStart(2, "0")}
                    </span>
                    {card.url && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Image or Placeholder */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-full h-32 rounded-2xl flex items-center justify-center overflow-hidden bg-white/5 border border-white/5">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest px-2 text-center line-clamp-2">
                          {card.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-4">
                  <h3 className={`text-xl font-black tracking-widest uppercase line-clamp-1 text-white ${ndotFont.className}`}>
                    {card.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mt-2 line-clamp-3 text-white/70 uppercase tracking-widest ${ndotFont.className}`}>
                    {card.description}
                  </p>
                </div>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
