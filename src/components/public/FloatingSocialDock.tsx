"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import type { SocialLinks, CustomSocialLink } from "@/types/profile";

const BrandIcons = {
  instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  facebook: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  linkedin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  github: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  ),
  twitter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  ),
  youtube: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <path d="m10 15 5-3-5-3z"/>
    </svg>
  ),
};

const ICON_MAP: Record<string, React.ElementType> = {
  instagram: BrandIcons.instagram,
  facebook: BrandIcons.facebook,
  linkedin: BrandIcons.linkedin,
  github: BrandIcons.github,
  twitter: BrandIcons.twitter,
  youtube: BrandIcons.youtube,
};

/* Known platform keys (order matters for rendering) */
const PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "github",
  "twitter",
  "youtube",
  "discord",
] as const;

/**
 * Ensures URLs have https:// prefix (BUG-05).
 */
function ensureHttps(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ElementType;
}

function SocialButton({ href, label, icon: Icon }: SocialButtonProps) {
  return (
    <motion.a
      href={ensureHttps(href)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-cursor-hover
      whileHover={{ scale: 1.15, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        color: "var(--color-muted)",
      }}
    >
      <Icon size={18} />
    </motion.a>
  );
}

interface SocialDockProps {
  socialLinks: SocialLinks | null | undefined;
}

/**
 * Floating social dock — renders only links that are populated.
 * Fixed position, z-index 60 (below cursor 999, above canvas overlay 40).
 *
 * Colors from theme vars, not hardcoded.
 */
export default function FloatingSocialDock({ socialLinks }: SocialDockProps) {
  if (!socialLinks) return null;

  const links: { href: string; label: string; icon: React.ElementType }[] = [];

  for (const platform of PLATFORMS) {
    const url = socialLinks[platform as keyof SocialLinks];
    if (typeof url === "string" && url.trim().length > 0) {
      links.push({
        href: url,
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
        icon: ICON_MAP[platform] ?? Globe,
      });
    }
  }

  /* Custom links */
  const customLinks = socialLinks.custom_links ?? [];
  for (const custom of customLinks) {
    const c = custom as CustomSocialLink;
    if (c.url && c.active !== false) {
      links.push({
        href: c.url,
        label: c.label || "Link",
        icon: Globe,
      });
    }
  }

  if (links.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-[60] flex-col gap-3 p-2 rounded-full"
      style={{
        backgroundColor: "rgba(8, 8, 8, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {links.map((link) => (
        <SocialButton
          key={link.label}
          href={link.href}
          label={link.label}
          icon={link.icon}
        />
      ))}
    </motion.div>
  );
}
