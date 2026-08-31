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
  
  // We will build `dynamicLinks` array based on populated profile.social_links
  // plus fallback email if none exists, and custom links if present.
  const dynamicLinks: ContactItem[] = [];

  const addLink = (
    platformId: string,
    title: string,
    url: string,
    desc: string,
    gradient: string,
    icon: React.ReactNode
  ) => {
    if (!url || url.trim() === "") return;
    const cleanUrl = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    let handle = cleanUrl;
    if (url.startsWith("mailto:")) {
      handle = url.replace("mailto:", "");
    } else {
      const parts = cleanUrl.split("/");
      if (parts.length > 1) {
        handle = "@" + parts.pop();
      }
    }

    dynamicLinks.push({
      id: dynamicLinks.length + 1,
      title,
      href: url.startsWith("http") || url.startsWith("mailto") ? url : `https://${url}`,
      pinText: cleanUrl,
      handle,
      desc,
      gradient,
      icon,
    });
  };

  const links = profile?.social_links;
  if (links) {
    if (links.instagram) addLink("instagram", "Instagram", links.instagram, "Behind the scenes, creative motion design & visual experiments.", "from-pink-500 via-red-500 to-yellow-500", contactLinks[0].icon);
    if (links.linkedin) addLink("linkedin", "LinkedIn", links.linkedin, "Professional career updates, leadership & engineering connections.", "from-blue-600 via-cyan-500 to-teal-400", contactLinks[1].icon);
    if (links.twitter) addLink("twitter", "Twitter / X", links.twitter, "Quick updates, tech thoughts, and daily musings.", "from-zinc-700 via-zinc-800 to-zinc-950", contactLinks[2].icon);
    if (links.github) addLink("github", "GitHub", links.github, "Open source repositories, WebGL shaders & code experiments.", "from-zinc-700 via-zinc-800 to-zinc-950", contactLinks[2].icon);
    if (links.youtube) addLink("youtube", "YouTube", links.youtube, "Video tutorials, creative showcases and long-form content.", "from-red-600 via-red-700 to-red-900", <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>);
    if (links.facebook) addLink("facebook", "Facebook", links.facebook, "Community updates, events, and brand announcements.", "from-blue-700 via-blue-800 to-blue-900", <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
    if (links.discord) addLink("discord", "Discord", links.discord, "Join the community server to chat and collaborate.", "from-indigo-500 via-indigo-600 to-purple-600", <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M21 8.5c0-1.8-1.5-3.5-4-4-1-1.5-2.5-2.5-5-2.5S8 3 7 4.5c-2.5.5-4 2.2-4 4 0 5 1.5 8 4.5 9 1.5.5 3.5 1.5 4.5 2.5 1-1 3-2 4.5-2.5 3-1 4.5-4 4.5-9z"/></svg>);
    
    // Custom links
    const customLinks = links.custom_links || [];
    customLinks.forEach((c: any) => {
      if (c.url && c.active !== false) {
        addLink("custom", c.label || "Link", c.url, "Visit my custom featured link.", "from-zinc-500 via-zinc-600 to-zinc-700", contactLinks[2].icon); // Default icon for custom
      }
    });
  }

  // Always ensure at least email is present if nothing else, or add email to the end if present
  const email = profile?.contact_email || "hello@digigrow.com";
  addLink("email", "Direct Email", `mailto:${email}`, "Inquiries regarding collaborative projects & web engineering.", "from-emerald-500 via-teal-600 to-cyan-700", contactLinks[3].icon);

  return (
    <section id="contact" className="relative w-full py-16 md:py-32 bg-black overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-[600px] h-[350px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />

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
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 md:gap-y-28 gap-x-6 place-items-center relative z-10">
        {dynamicLinks.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-[23rem] w-full flex items-center justify-center"
          >
            <PinContainer title={item.pinText} href={item.href}>
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
                  <p className="text-xs font-mono text-zinc-400 mt-1 transition-colors group-hover/card:text-zinc-300 truncate max-w-full">
                    {item.handle}
                  </p>
                  <p className="text-xs text-zinc-500 mt-3 leading-relaxed transition-colors group-hover/card:text-zinc-400 line-clamp-3">
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
