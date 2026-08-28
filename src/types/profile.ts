/** Custom social link with a unique ID for repeater keying */
export interface CustomSocialLink {
  id: string;
  label: string;
  url: string;
  active: boolean;
}

/** Social links structure matching the DB jsonb column */
export interface SocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
  github: string;
  twitter: string;
  youtube: string;
  discord: string;
  custom_links: CustomSocialLink[];
}

/** Theme tokens — every color/font is runtime-editable via admin */
export interface Theme {
  color_primary: string;
  color_background: string;
  color_surface: string;
  color_text: string;
  color_muted: string;
  font_heading: string;
  font_mono: string;
}

/** Full user profile row from the `profile` table */
export interface UserProfile {
  id: string;
  brand_name: string;
  full_name: string;
  role_title: string;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  location: string | null;
  social_links: SocialLinks;
  theme: Theme;
  updated_at: string;
}

/** Default theme values — fallback when DB is unreachable */
export const DEFAULT_THEME: Theme = {
  color_primary: "#C72E1E",
  color_background: "#080808",
  color_surface: "#F7F3EB",
  color_text: "#F4F4F5",
  color_muted: "#A1A1AA",
  font_heading: "Inter",
  font_mono: "JetBrains Mono",
};

/** Default social links — empty but structured */
export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: "",
  facebook: "",
  linkedin: "",
  github: "",
  twitter: "",
  youtube: "",
  discord: "",
  custom_links: [],
};

/** Fallback profile when Supabase is unreachable — seeded from head.md */
export const FALLBACK_PROFILE: UserProfile = {
  id: "fallback",
  brand_name: "Digi Grow",
  full_name: "",
  role_title: "",
  tagline: "",
  bio: "",
  avatar_url: "",
  resume_url: "",
  location: "",
  social_links: DEFAULT_SOCIAL_LINKS,
  theme: DEFAULT_THEME,
  updated_at: new Date().toISOString(),
};
