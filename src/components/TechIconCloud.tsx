"use client";

import React from "react";
import { IconCloud } from "@/registry/magicui/icon-cloud";

// Modern AI Tools + Creative UI/UX + Full Stack Dev Slugs
const slugs = [
  // --- AI Models & AI Development Tools ---
  "googlegemini",    // Google Gemini
  "anthropic",       // Claude / Anthropic
  "openai",          // ChatGPT / GPT-4
  "huggingface",     // Hugging Face AI Models
  "replicate",       // Model Deployment / Open Source AI
  "langchain",       // AI Agent Architecture
  
  // --- UI/UX & Creative Design Tools ---
  "figma",           // Figma UI Design
  "framer",          // Framer Motion & Interactions
  "blender",         // 3D Visuals & Assets
  "adobexd",         // Adobe UI/UX
  "adobephotoshop",  // Photoshop Visual Design
  "adobeaftereffects", // Motion Graphics

  // --- Frontend, 3D & WebGL Frameworks ---
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "threedotjs",      // Three.js / WebGL 3D
  "tailwindcss",     // Modern Styling
  "html5",
  "css3",

  // --- Backend, DB & Infrastructure ---
  "nodedotjs",
  "supabase",        // Database & Backend
  "postgresql",
  "firebase",
  "docker",          // Containerization
  "git",
  "github",
  "vercel",          // Fast Edge Deployment
  "postman",
];

export function TechIconCloud() {
  // SimpleIcons CDN endpoint
  const images = [
    ...slugs.map((slug) => `https://cdn.simpleicons.org/${slug}`),
    // Custom Antigravity Logo (Rocket SVG) requested by the user
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`
  ];

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-transparent select-none cursor-grab active:cursor-grabbing">
      {/* 3D Interactive Interactive Cloud */}
      <IconCloud images={images} />
    </div>
  );
}
