"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CustomCursor from "@/components/brand/CustomCursor";
import MountainParallaxHero from "@/components/canvas/MountainParallaxHero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import HeroSocialRow from "@/components/public/HeroSocialRow";
import { ScrollTextHighlight } from "@/components/ui/ScrollTextHighlight";
import { ContactPinSection } from "@/components/ContactPinSection";
import { StickyStackSection } from "@/components/StickyStackSection";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { Preloader } from "@/components/Preloader";
import dynamic from 'next/dynamic';

const GridScan = dynamic(() => import('@/components/GridScan').then(mod => mod.GridScan), { ssr: false });
const SkillsCloudSection = dynamic(() => import('@/components/SkillsCloudSection').then(mod => mod.SkillsCloudSection), { ssr: false });
import { NothingDotText } from "@/components/NothingDotText";

const TOTAL_SECTIONS = 5;

// Module-level state: Survives SPA routing, but resets on F5 refresh.
// Perfect for showing Preloader on initial visit/refresh, but skipping it on internal navigation.
let hasCompletedPreloaderSession = false;

/**
 * §10 — The Main Page assembly.
 *
 * Full-page sticky stacking scroll layout.
 * Each section sticks to the viewport top and gets covered
 * by the next section sliding up from below — like a card deck.
 */
export default function Home() {
  const { profile } = useProfile();
  useTheme(profile?.theme);
  const [isReady, setIsReady] = useState(hasCompletedPreloaderSession);
  const [skipPreloader, setSkipPreloader] = useState(hasCompletedPreloaderSession);

  React.useEffect(() => {
    // Just as a fallback in case state got out of sync
    if (hasCompletedPreloaderSession && !isReady) {
      setSkipPreloader(true);
      setIsReady(true);
    }
  }, [isReady]);

  const handleLoadingComplete = () => {
    hasCompletedPreloaderSession = true;
    setIsReady(true);
  };

  const tagline =
    profile?.tagline ||
    "We build digital experiences that grow your brand.";

  return (
    <>
      {!skipPreloader && <Preloader onLoadingComplete={handleLoadingComplete} />}
      <motion.main 
        initial={{ scale: 1.05, opacity: 0 }}
        animate={isReady ? { scale: 1, opacity: 1 } : { scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen pb-24"
      >
      <CustomCursor />

      {/* ░░ GLOBAL AMBIENT BACKGROUND ░░ */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {/* Dark/Crimson Mesh */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-zinc-950 to-black" />
        {/* SVG Grain Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* ░░ CARD STACK CONTAINER ░░ */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 pt-6 md:pt-10 flex flex-col">
        
        {/* ═══════════════════════════════════════════════════
            CARD 1 — Hero (Mountain Parallax)
            ═══════════════════════════════════════════════════ */}
        <StickyStackSection index={0} total={TOTAL_SECTIONS} className="bg-[var(--color-background)]">
          <MountainParallaxHero />
        </StickyStackSection>

        {/* ═══════════════════════════════════════════════════
            CARD 2 — About / Digital Systems (GridScan BG)
            ═══════════════════════════════════════════════════ */}
        <StickyStackSection
          index={1}
          total={TOTAL_SECTIONS}
          className="bg-[var(--color-background)]"
        >
          <section
            id="about"
            className="relative w-full h-full overflow-hidden flex flex-col justify-center py-10"
          >
            {/* GridScan Three.js Background Layer */}
            <div
              className="absolute inset-0 z-0"
              style={{ pointerEvents: "auto" }}
            >
              <GridScan
                className=""
                style={{}}
                sensitivity={0.55}
                lineThickness={1}
                linesColor="#1c1917"
                gridScale={0.1}
                scanColor="#ef4444"
                scanOpacity={0.4}
                enablePost
                bloomIntensity={0.6}
                chromaticAberration={0.002}
                noiseIntensity={0.01}
                lineJitter={0.1}
                scanGlow={0.5}
                scanSoftness={2}
                
              />
            </div>

            {/* Gradient fades */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-background)] to-transparent z-[1] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent z-[1] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 space-y-6 pointer-events-none">
              <motion.span
                className="block pointer-events-auto w-fit"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-10 w-full relative z-10">
                  <NothingDotText text="ABOUT" variant="red" size="sm" />
                </div>
              </motion.span>

              <div className="pointer-events-auto">
                <ScrollTextHighlight text={tagline} />
              </div>

              <motion.p
                className="text-lg leading-relaxed max-w-2xl pointer-events-auto"
                style={{ color: "var(--color-muted)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {profile?.bio ||
                  "Creative studio specializing in B-Roll, Video Editing, Website Design, and Brand Identity. Let's work together to make something extraordinary."}
              </motion.p>

              <motion.div
                className="pt-8 pointer-events-auto w-fit"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <HeroSocialRow socialLinks={profile?.social_links} />
              </motion.div>
            </div>
          </section>
        </StickyStackSection>

        {/* ═══════════════════════════════════════════════════
            CARD 3 — Projects Grid
            ═══════════════════════════════════════════════════ */}
        <StickyStackSection
          index={2}
          total={TOTAL_SECTIONS}
          className="bg-[var(--color-background)]"
        >
          <div id="work" className="h-full w-full flex flex-col justify-center overflow-y-auto custom-scrollbar">
            <ProjectGrid />
          </div>
        </StickyStackSection>

        {/* ═══════════════════════════════════════════════════
            CARD 4 — Skills & Technologies (3D Icon Cloud)
            ═══════════════════════════════════════════════════ */}
        <StickyStackSection
          index={3}
          total={TOTAL_SECTIONS}
          className="bg-[var(--color-background)]"
        >
          <div className="h-full w-full flex flex-col justify-center">
            <SkillsCloudSection />
          </div>
        </StickyStackSection>

        {/* ═══════════════════════════════════════════════════
            CARD 5 — Contact + Footer (Last Card)
            ═══════════════════════════════════════════════════ */}
        <StickyStackSection
          index={4}
          total={TOTAL_SECTIONS}
          className="bg-[var(--color-background)]"
        >
          <div className="h-full w-full flex flex-col justify-between pt-10">
            <div className="flex-1 flex items-center justify-center pb-10">
              <ContactPinSection />
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 shrink-0">
              <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-muted)" }}
                >
                  © {new Date().getFullYear()}{" "}
                  {profile?.brand_name || "Digi Grow"}. All rights reserved.
                </p>

                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <HeroSocialRow socialLinks={profile?.social_links} />
                </div>
              </div>
            </footer>
          </div>
        </StickyStackSection>

      </div>
    </motion.main>
    </>
  );
}
