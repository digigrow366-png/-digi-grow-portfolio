-- ═══════════════════════════════════════════════════════════════
-- DIGI GROW — Add Bhoomi Mitra Project
-- ═══════════════════════════════════════════════════════════════

insert into public.projects (
  title,
  slug,
  category,
  summary,
  cover_image_url,
  gallery,
  sub_cards,
  external_url,
  published,
  sort_order
)
values (
  'Bhoomi Mitra — AI Land Portal',
  'bhoomi-mitra',
  'AI & Civic Tech Platform',
  'AI-powered citizen land and civic registry portal featuring GIS spatial boundary inspection, Bhu-Aadhar (ULPIN) verification, SRO registration delay prediction, and an interactive Hinglish AI voice assistant.',
  '/projects/bhoomi-mitra.jpg',
  '["/projects/bhoomi-mitra.jpg"]'::jsonb,
  '[
    {
      "title": "GIS Boundary Defense",
      "description": "Interactive Leaflet GIS map with polygon boundary defense and spatial land risk score analytics.",
      "image": "/projects/bhoomi-mitra.jpg",
      "url": "https://bhoomi-mitra-kohl.vercel.app/"
    },
    {
      "title": "Bhu-Aadhar Verification",
      "description": "Direct verification against national land registry standards with citizen PII masking and mutation tracking.",
      "image": "/projects/bhoomi-mitra.jpg",
      "url": "https://bhoomi-mitra-kohl.vercel.app/"
    },
    {
      "title": "Hinglish AI Voice Agent",
      "description": "Conversational voice-first intelligence helping citizens understand land records and legal RTI filing.",
      "image": "/projects/bhoomi-mitra.jpg",
      "url": "https://bhoomi-mitra-kohl.vercel.app/"
    },
    {
      "title": "SRO Delay Prediction",
      "description": "Predictive analytics engine for sub-registrar office turnaround times and automated dispute escalation.",
      "image": "/projects/bhoomi-mitra.jpg",
      "url": "https://bhoomi-mitra-kohl.vercel.app/"
    }
  ]'::jsonb,
  'https://bhoomi-mitra-kohl.vercel.app/',
  true,
  0
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  cover_image_url = excluded.cover_image_url,
  gallery = excluded.gallery,
  sub_cards = excluded.sub_cards,
  external_url = excluded.external_url,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();
