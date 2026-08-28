/** Sub-card for the project detail page grid (Stage 7) */
export interface SubCard {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

/** Full project row from the `projects` table */
export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  cover_image_url: string | null;
  gallery: string[];
  sub_cards: SubCard[];
  external_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Fallback seed projects — used when Supabase is unreachable */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "seed-1",
    title: "B-Roll & Video Editing",
    slug: "b-roll-video-editing",
    category: "B-Roll & Video Editing",
    summary:
      "Professional B-Roll footage and video editing services that bring your brand story to life.",
    cover_image_url: null,
    gallery: [],
    sub_cards: [],
    external_url: null,
    published: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Website Design",
    slug: "website-design",
    category: "Website Design",
    summary:
      "Modern, responsive website design built for performance and visual impact.",
    cover_image_url: null,
    gallery: [],
    sub_cards: [],
    external_url: null,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "Brand Identity",
    slug: "brand-identity",
    category: "Brand Identity",
    summary:
      "Comprehensive brand identity packages including logo, color palette, and style guides.",
    cover_image_url: null,
    gallery: [],
    sub_cards: [],
    external_url: null,
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
