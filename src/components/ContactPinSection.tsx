"use client";

import React from "react";
import { motion } from "framer-motion";
import { PinContainer } from "./ui/3d-pin";
import { Mail, ArrowUpRight } from "lucide-react";
import { NothingDotText } from "@/components/NothingDotText";
import { useProfile } from "@/hooks/useProfile";

interface ContactItem {
  id: number;
  title: string;
  pinText: string;
  handle: string;
  href: string;
  desc: string;
  gradient: string;
  icon: React.ReactNode;
}

const contactLinks: ContactItem[] = [
  {
    id: 1,
    title: "Instagram",
    pinText: "instagram.com/yourhandle",
    handle: "@yourhandle",
    href: "https://instagram.com",
    desc: "Behind the scenes, creative motion design & visual experiments.",
    gradient: "from-pink-500 via-red-500 to-yellow-500",
    icon: (
      <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "LinkedIn",
    pinText: "linkedin.com/in/yourprofile",
    handle: "in/yourprofile",
    href: "https://linkedin.com",
    desc: "Professional career updates, leadership & engineering connections.",
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    icon: (
      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "GitHub / X",
    pinText: "github.com/yourusername",
    handle: "@yourusername",
    href: "https://github.com",
    desc: "Open source repositories, WebGL shaders & code experiments.",
    gradient: "from-zinc-700 via-zinc-800 to-zinc-950",
    icon: (
      <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Direct Email",
    pinText: "mailto:yourname@gmail.com",
    handle: "yourname@gmail.com",
    href: "mailto:yourname@gmail.com",
    desc: "Inquiries regarding collaborative projects & web engineering.",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    icon: <Mail className="w-5 h-5 text-emerald-400" />,
  },
];

export function ContactPinSection() {
  const { profile } = useProfile();
  
  const getHref = (id: number) => {
    const links = profile?.social_links;
    if (!links) return "#";
    if (id === 1) return links.instagram || "https://instagram.com";
    if (id === 2) return links.linkedin || "https://linkedin.com";
    if (id === 3) return links.github || links.twitter || "https://github.com";
    if (id === 4) return "mailto:hello@digigrow.com"; // Fallback email
    return "#";
  };

  const getHandle = (id: number) => {
    const links = profile?.social_links;
    if (!links) return "";
    if (id === 1 && links.instagram) return links.instagram.split('/').pop();
    if (id === 2 && links.linkedin) return links.linkedin.split('/').pop();
    if (id === 3 && (links.github || links.twitter)) return (links.github || links.twitter).split('/').pop();
    if (id === 4) return "hello@digigrow.com";
    return "";
  };

  return (
    <section id="contact" className="relative w-full py-32 bg-black overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center px-6 mb-16 relative z-10"
      >
        <div className="flex justify-center mb-4">
          <NothingDotText text="GET IN TOUCH" variant="red" size="sm" />
        </div>
        <div className="flex justify-center mt-6">
          <NothingDotText
            text={"Let's Build Together"}
            variant="white"
            size="md"
            enableGlitch={false}
          />
        </div>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mt-3">
          Hover over any portal to initiate contact or view personal social channels.
        </p>
      </motion.div>

      {/* 4 Pin Cards Staggered Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-28 gap-x-6 place-items-center relative z-10">
        {contactLinks.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15, // Line-by-line staggered entry
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-[23rem] w-full flex items-center justify-center"
          >
            <PinContainer title={item.pinText} href={getHref(item.id) !== '#' ? getHref(item.id) : item.href}>
              <div className="flex basis-full flex-col p-5 tracking-tight text-slate-100/50 w-[17rem] h-[19rem] bg-zinc-950/80 border border-zinc-800/90 rounded-2xl backdrop-blur-md justify-between group/card transition-all duration-300 hover:shadow-xl hover:border-zinc-700 active:scale-95 cursor-pointer">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                      {item.icon}
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="p-1 rounded-full bg-zinc-900/50"
                    >
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 transition-colors group-hover/card:text-white" />
                    </motion.div>
                  </div>

                  <h3 className="font-bold text-lg text-white mt-4">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 transition-colors group-hover/card:text-zinc-300">
                    {getHandle(item.id) || item.handle}
                  </p>
                  <p className="text-xs text-zinc-500 mt-3 leading-relaxed transition-colors group-hover/card:text-zinc-400">
                    {item.desc}
                  </p>
                </div>

                {/* Card Gradient Banner */}
                <div
                  className={`w-full h-14 rounded-xl mt-4 bg-gradient-to-br ${item.gradient} opacity-80 border border-white/10 transition-transform duration-500 group-hover/card:scale-[1.02]`}
                />
              </div>
            </PinContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
