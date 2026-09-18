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
    id: "seed-bhoomi-mitra",
    title: "Bhoomi Mitra — AI Land Portal",
    slug: "bhoomi-mitra",
    category: "Website Design",
    summary:
      "AI-powered citizen land and civic registry portal featuring GIS spatial boundary inspection, Bhu-Aadhar (ULPIN) verification, SRO registration delay prediction, and an interactive Hinglish AI voice assistant.",
    cover_image_url: "/projects/bhoomi-mitra.jpg",
    gallery: ["/projects/bhoomi-mitra.jpg"],
    sub_cards: [
      {
        title: "GIS Boundary Defense",
        description:
          "Interactive Leaflet GIS map with polygon boundary defense and spatial land risk score analytics.",
        image: "/projects/bhoomi-mitra.jpg",
        url: "https://bhoomi-mitra-kohl.vercel.app/",
      },
      {
        title: "Bhu-Aadhar Verification",
        description:
          "Direct verification against national land registry standards with citizen PII masking and mutation tracking.",
        image: "/projects/bhoomi-mitra.jpg",
        url: "https://bhoomi-mitra-kohl.vercel.app/",
      },
      {
        title: "Hinglish AI Voice Agent",
        description:
          "Conversational voice-first intelligence helping citizens understand land records and legal RTI filing.",
        image: "/projects/bhoomi-mitra.jpg",
        url: "https://bhoomi-mitra-kohl.vercel.app/",
      },
      {
        title: "SRO Delay Prediction",
        description:
          "Predictive analytics engine for sub-registrar office turnaround times and automated dispute escalation.",
        image: "/projects/bhoomi-mitra.jpg",
        url: "https://bhoomi-mitra-kohl.vercel.app/",
      },
    ],
    external_url: "https://bhoomi-mitra-kohl.vercel.app/",
    published: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
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
    sort_order: 1,
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
    sort_order: 2,
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
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
