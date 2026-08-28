# SYSTEM DIRECTIVE: DIGI GROW — MASTER PORTFOLIO BUILD LOOP

**ROLE:** Senior Principal Full-Stack Creative Engineer (React 19 / Next.js, TypeScript Strict, Supabase, Motion, Canvas)
**DOMAIN:** Dark, editorial, Web3/AI-grade 3D portfolio for **Digi Grow**, with a full admin CMS to edit every piece of content — profile, socials, theme, and every project/work item — with zero redeploys.

> **How to use this file:** feed this whole document to your coding agent (Cursor, Codex, Claude Code) as the first message, with `head.md` + `avatar.jpg` attached. This supersedes the earlier `loop_prompt.md` — that file's Stages 1–5 (profile/social system) are folded into Stage 2–3 below and extended with a full project CMS.
>
> Run the same discipline on every stage: **[A] PLAN → [B] IMPLEMENT (no placeholders, no `...`) → [C] SELF-AUDIT against the Bug Matrix → [D] FIX & PASS** before moving on.

---

## 0. FILE MAP

Everything below writes to one of these locations. Create the tree first.

```
src/
  app/
    page.tsx                      # Home (Stage 9 assembly)
    work/[slug]/page.tsx          # Project detail page (Stage 6)
    admin/
      page.tsx                    # Admin shell / auth gate (Stage 8)
      profile/page.tsx            # Identity + Socials + Theme editor
      projects/page.tsx           # Project list (CRUD)
      projects/[id]/page.tsx      # Project editor form
  components/
    brand/
      CustomCursor.tsx            # adapted InvertedCursor (Stage 4)
      Wordmark.tsx                # "Digi Grow" logotype, theme-driven
    canvas/
      ScrollFrameHero.tsx         # scroll-scrub canvas hero (Stage 5)
      useFramePreloader.ts
    projects/
      ui/comet-card.tsx           # from `npx shadcn add @aceternity/comet-card`
      ProjectGrid.tsx             # Comet Card index (Stage 6)
      ProjectSubCards.tsx         # adapted CardsComponent (Stage 7)
    public/
      FloatingSocialDock.tsx
      HeroSocialRow.tsx
    admin/
      AdminShell.tsx
      ProfileEditor.tsx
      ThemeEditor.tsx
      SocialLinksEditor.tsx
      ProjectsTable.tsx
      ProjectForm.tsx
      MediaUploader.tsx
  hooks/
    useProfile.ts
    useProjects.ts
    useTheme.ts                   # applies profile.theme as CSS vars on :root
  types/
    profile.ts
    project.ts
  lib/
    utils.ts                      # cn() = clsx + tailwind-merge
    supabaseClient.ts
  styles/
    globals.css                   # design tokens, font-face, base resets
public/
  frames/frame_001.jpg … frame_NNN.jpg   # scroll hero sequence (you supply)
```

**Install once, at Stage 0:**
```bash
npm install motion clsx tailwind-merge @supabase/supabase-js
npx shadcn@latest add @aceternity/comet-card
```
Use **`motion`** (the current package name) everywhere — not `framer-motion`. Every snippet below imports from `motion/react`. If `npx shadcn add @aceternity/comet-card` fails because that registry isn't configured, skip it and use the reference implementation in Stage 6 directly — do not block the loop on it.

---

## 1. DESIGN SYSTEM — TYPOGRAPHY, COLOR, LAYOUT

Dark, geometric, Web3/AI-editorial aesthetic (per the ChainGPT-Labs-style reference), but **every color and font token is data, not code** — sourced from `profile.theme` in the database (seeded from `head.md`) so the admin can restyle the whole site live.

### 1.1 Typography

| Element | Typeface | Treatment |
|---|---|---|
| Headings (h1–h3) | `theme.font_heading` (default Inter) | `font-extrabold`/`font-black`, `tracking-tight` to `tracking-tighter` |
| Micro-labels / badges / `01`, `02` numbering | `theme.font_mono` (default JetBrains Mono) | uppercase, `letter-spacing: 0.25em–0.5em` |
| Body copy | same as heading font, regular weight | `text-[var(--color-muted)]`, `leading-relaxed` |
| Stat/metric numbers | heading font | ultra-bold, scaled up (`text-5xl`+) |

```css
/* styles/globals.css — read theme.* at runtime via useTheme(), these are fallbacks only */
:root {
  --color-primary: #C72E1E;
  --color-background: #080808;
  --color-surface: #F7F3EB;
  --color-text: #F4F4F5;
  --color-muted: #A1A1AA;
  --font-heading: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
.badge-label { font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.35em; font-size: 0.75rem; color: var(--color-muted); }
h1, h2, h3 { font-family: var(--font-heading); font-weight: 800; letter-spacing: -0.03em; color: var(--color-text); }
```

`useTheme()` (Stage 3) overwrites these `:root` custom properties from `profile.theme` on mount — components never hardcode a hex value, they always read the CSS var.

### 1.2 Layout — Dark Neo-Brutalist Bento

- Content blocks (project grid, service tiles, stats) are rounded bento cards: `bg-zinc-950/60 border border-white/[0.08] rounded-2xl backdrop-blur-md`.
- Grids collapse 3–4 cols desktop → 1 col mobile.
- Sticky glassmorphic navbar: `backdrop-filter: blur(12px)`, pill nav items.
- Soft radial glows behind panels for depth (`bg-[radial-gradient(...)]`, low opacity), never full-saturation color blocks.
- Infinite marquee optional for client/tooling logos, monochrome + low opacity.

### 1.3 Visual Hierarchy Map — which scan pattern per section

| Section | Pattern | Why |
|---|---|---|
| Home hero (over the canvas sequence) | **Z-pattern** | Wordmark top-left, nav top-right, headline drops to bottom-left, primary CTA bottom-right — single conversion goal (view work / contact). |
| Project index / services grid (Comet Cards: "B-Roll & Video Editing", "Website Design", …) | **Commitment / grid** | Equal-weight items, predictable scan — this is a catalog, not a narrative. |
| Featured/flagship project spotlight (if pinned above the grid) | **Spotted** | One large image → bold title → CTA, high-contrast jump targets for the strongest piece of work. |
| Project detail page body / about / case-study text | **F-pattern** | Text-heavy, left-aligned scanning — sub-cards (Stage 7) sit as scannable blocks, not paragraphs. |

Keep this mapping explicit in code comments where each section is composed (Stage 9) so future edits don't accidentally mix patterns.

---

## 2. DATABASE SCHEMA (Supabase)

**Table `public.profile`** (singleton row — same as before, extended):
- `id` uuid pk default `gen_random_uuid()`
- `brand_name` text (not null, default `'Digi Grow'`)
- `full_name`, `role_title` text (not null)
- `tagline`, `bio`, `avatar_url`, `resume_url`, `location` text
- `social_links` jsonb — `{ instagram, facebook, linkedin, github, twitter, youtube, discord, custom_links: [] }`
- `theme` jsonb — `{ color_primary, color_background, color_surface, color_text, color_muted, font_heading, font_mono }`
- `updated_at` timestamptz default `now()`

**Table `public.projects`** (the "every work" the admin needs to edit):
- `id` uuid pk default `gen_random_uuid()`
- `title` text not null
- `slug` text not null unique (auto-slugified from title, editable)
- `category` text (e.g. `"B-Roll & Video Editing"`, `"Website Design"` — free text, not enum)
- `summary` text
- `cover_image_url` text
- `gallery` jsonb default `[]` — array of image URLs
- `sub_cards` jsonb default `[]` — array of `{ title, description }` for the project-detail card grid (Stage 7)
- `external_url` text
- `published` boolean not null default `false`
- `sort_order` integer not null default `0`
- `created_at`, `updated_at` timestamptz default `now()`

**RLS (both tables):**
- Public `SELECT`: `anon` + `authenticated`, but on `projects` restrict the public policy to `published = true` (`using (published = true)`); admin queries use the authenticated client which bypasses that filter via a second `authenticated`-only `SELECT ALL` policy.
- `INSERT`/`UPDATE`/`DELETE`: `authenticated` only, on both tables.
- Seed one `profile` row and 2–3 `projects` rows from `head.md` so `.maybeSingle()`/list queries never hit an empty-table edge case.

**Bug checks:**
- [ ] RLS enabled on both tables explicitly.
- [ ] `slug` has a unique index; generate via slugify + collision suffix (`-2`, `-3`, …) rather than crashing on conflict.
- [ ] `sort_order` persisted on every drag-reorder — never rely on client array order alone.

---

## 3. TYPESCRIPT CONTRACTS & DATA LAYER

**`src/types/profile.ts`**
- `Theme`, `CustomSocialLink`, `SocialLinks`, `UserProfile` (as before, `UserProfile.theme: Theme`).

**`src/types/project.ts`**
- `SubCard: { title: string; description: string }`
- `Project: { id: string; title: string; slug: string; category: string; summary: string | null; cover_image_url: string | null; gallery: string[]; sub_cards: SubCard[]; external_url: string | null; published: boolean; sort_order: number }`

**`src/hooks/useProfile.ts`** — as in the previous loop prompt: Supabase fetch, offline/empty-table fallback from `head.md`, `{ profile, loading, error, refetchProfile }`, `isMounted`/`AbortController` guard.

**`src/hooks/useProjects.ts`** — fetch published projects ordered by `sort_order`; separate `useAdminProjects()` (or a `published` flag param) for the dashboard that fetches all rows regardless of publish state. Same resilience rules as `useProfile`.

**`src/hooks/useTheme.ts`** — reads `profile.theme` (once `useProfile` resolves) and writes each value onto `document.documentElement.style.setProperty('--color-primary', theme.color_primary)` etc. Falls back to the `:root` defaults in `globals.css` while loading, so there's never a flash of unstyled color.

**`src/lib/utils.ts`**
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Bug checks:**
- [ ] No `any`; nullable DB fields typed `| null`.
- [ ] `gallery`/`sub_cards`/`custom_links` default to `[]`, never `undefined`.
- [ ] `useTheme` writes vars in a `useEffect`, not during render (avoids hydration mismatch).

---

## 4. BRAND CURSOR

**File:** `src/components/brand/CustomCursor.tsx` — adapted from the supplied `InvertedCursor`. The demo page wrapper (`bg-slate-900`, headline, button) is **removed** — this mounts once in the root layout and overlays the whole site. Color comes from `--color-primary` (theme), not a hardcoded `bg-white`; `mix-blend-difference` is what makes it read correctly over any background, which is exactly why the wrapper background is dropped.

```tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    // Delegated hover: any element with data-cursor-hover triggers the scale-up,
    // so ProjectGrid cards, nav links, and buttons opt in without prop drilling.
    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor-hover]");
      setIsHovered(Boolean(target));
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[999] mix-blend-difference bg-[var(--color-primary)]"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: isHovered ? 72 : 36, height: isHovered ? 72 : 36 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    />
  );
}
```

Mount once in the root layout; add `cursor-none` only on pointer-fine devices (`@media (pointer: fine)`), and skip mounting entirely on touch devices — never hide the native cursor on mobile.

**Bug checks:**
- [ ] Cursor doesn't render (or is disabled) on touch/coarse-pointer devices.
- [ ] `mix-blend-difference` has a known Safari/GPU-layer bug on some transforms — test on Safari; fall back to a plain colored dot (no blend mode) if it flickers.

---

## 5. SCROLL-DRIVEN CANVAS HERO

### 5.0 Generate the source footage (Google Flow / Veo 3.1)

You need real footage before there's anything to extract frames from. Generate it in **Google Flow** (flow.google), which runs on Veo 3.1 — text-to-video with camera controls and native audio, plus an **Ingredients to Video** mode that accepts up to 3 reference images so `avatar.jpg` can anchor the character's likeness. Flow's prompt formula is short and specific: **subject → setting → light → camera movement**, plus a one-line audio cue and a quality anchor, kept to roughly 30–80 words — longer prompts lose precision.

**Option A — Avatar-driven orbit** (upload `avatar.jpg` as an Ingredient):
> A polished glossy 3D character bust floating in a deep obsidian-black void, faint volumetric dust drifting past. Slow 360-degree orbiting camera circles the figure at eye level, a soft crimson rim light sweeping across the glossy hoodie and hair as it turns. Low ambient synth hum, no dialogue. Cinematic, high-detail, dark editorial studio lighting, 4K.

**Option B — Abstract brand flythrough** (no likeness needed, safer for a public hero if you'd rather not put your face front-and-center):
> Camera flies slowly forward through a dark obsidian void filled with thin glowing crimson wireframe lines forming an ascending growth graph and drifting network nodes. Soft volumetric light glows from deep within the structure ahead. Low ambient hum with subtle digital pulses, no dialogue. Cinematic, minimal, high-contrast render, 4K.

**Pipeline:**
1. Generate either prompt in Flow (default clip is 5–8s). Use **Scene Extension** to chain 2–3 more clips of the same camera move, keeping character/scene consistency, until you have 10–15 continuous seconds — that's what gives the scroll enough frames to feel smooth rather than looping visibly.
2. Assemble/trim the chained clips in Scenebuilder and export a single `.mp4`.
3. Extract frames with ffmpeg, matching the naming convention `ScrollFrameHero` expects:
   ```bash
   ffmpeg -i digi-grow-hero.mp4 -vf fps=24 public/frames/frame_%03d.jpg
   ```
4. Set `totalFrames` in `ScrollFrameHero.tsx` to the **actual** number of files ffmpeg produced — don't hardcode 370, count the output.
5. For the mobile fallback (BUG-09 below), re-export at a lower fps (e.g. `fps=12`) into `public/frames-mobile/` so the sequence is shorter without changing the camera move itself.

**Bug check:** if a chained Scene-Extension clip drifts in lighting/color between segments, regenerate that segment alone rather than the whole sequence — Flow's `Regenerate` (same prompt, new seed) is cheaper than a full re-render.

### 5.1 Implementation

**Files:** `src/components/canvas/ScrollFrameHero.tsx`, `src/components/canvas/useFramePreloader.ts`

Apple/Nothing-style: a numbered frame sequence (`public/frames/frame_001.jpg … frame_NNN.jpg`) scrubbed on a `<canvas>` as the user scrolls, pinned inside a tall virtual scroll container.

**Requirements:**
- Sticky/fixed `<canvas>` inside a `height: 400vh–600vh` scroll container — taller container = slower/more controllable scrub.
- Preload every frame into memory before scrubbing starts; show a loading/progress state while buffering.
- Map scroll progress (0–1) to frame index with `requestAnimationFrame`, never on raw scroll events:
  `frameIndex = clamp(floor(scrollProgress * totalFrames), 0, totalFrames - 1)`
- `drawImage` with center-crop `object-fit: cover` logic, accounting for device pixel ratio (crisp on Retina).
- Overlay content (Wordmark, headline, CTA — the Z-pattern hero copy) is layered on top with `pointer-events: none` except on the actual CTA, fading in/out at scroll milestones (e.g. title 0–20%, feature line 30–55%, CTA reveal 65–85%).
- Use an `<img>`-array + `drawImage`, not a `<video>` element, for scrub accuracy.

**Bug checks:**
- [ ] Canvas resizes correctly on window resize/orientation change without re-triggering a full frame re-download.
- [ ] Preloader shows real progress (`loaded / total`), never a fake/timed spinner.
- [ ] Large frame counts (300+) are memory-checked — warn in code comments if `totalFrames * avgFrameSize` risks mobile memory pressure; recommend a reduced mobile frame set (`public/frames-mobile/`) if the sequence exceeds ~150 frames.
- [ ] Scroll container height doesn't fight with the sticky navbar's own scroll-lock logic (test with `FloatingSocialDock` mounted).

---

## 6. PROJECT SHOWCASE GRID (Comet Card)

**Files:** `src/components/projects/ui/comet-card.tsx` (from the shadcn/aceternity install — use as-is, it's already theme-agnostic since it only wraps `children`), `src/components/projects/ProjectGrid.tsx`.

This is the **Commitment/grid** section (services like *B-Roll & Video Editing*, *Website Design*) — each card is one `Project` from `useProjects()`, wrapped in `CometCard`, linking to `/work/[slug]`.

```tsx
// ProjectGrid.tsx
import { CometCard } from "./ui/comet-card";
import { useProjects } from "@/hooks/useProjects";

export function ProjectGrid() {
  const { projects, loading } = useProjects();
  if (loading) return <ProjectGridSkeleton />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto">
      {projects.map((p) => (
        <a key={p.id} href={`/work/${p.slug}`} data-cursor-hover>
          <CometCard>
            <img src={p.cover_image_url ?? "/placeholder.jpg"} alt={p.title} className="rounded-2xl object-cover w-full h-64" />
            <div className="p-4">
              <span className="badge-label">{p.category}</span>
              <h3 className="text-xl font-black tracking-tight mt-1">{p.title}</h3>
            </div>
          </CometCard>
        </a>
      ))}
    </div>
  );
}
```

**Bug checks:**
- [ ] `CometCard`'s `perspective-distant transform-3d` classes require Tailwind's 3D-transform utilities — confirm the Tailwind version supports them, or add the raw CSS fallback.
- [ ] Card tilt math (`rotateX`/`rotateY`) disabled or dampened when `prefers-reduced-motion` is set.
- [ ] Empty state (`projects.length === 0`) renders a clear "no published work yet" message instead of a blank grid.

---

## 7. PROJECT DETAIL PAGE (Sub-Card Grid)

**File:** `src/components/projects/ProjectSubCards.tsx` — adapted from the supplied `CardsComponent`. The hardcoded `cards` array becomes a prop, sourced from `project.sub_cards`.

```tsx
"use client";
import React from "react";
import { motion } from "motion/react";
import type { SubCard } from "@/types/project";

export function ProjectSubCards({ cards }: { cards: SubCard[] }) {
  if (!cards?.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          data-cursor-hover
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900 border border-white/[0.08] rounded-2xl p-6 text-[var(--color-text)] shadow-xl cursor-pointer"
        >
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-[var(--color-muted)] text-sm">{card.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

`app/work/[slug]/page.tsx` composes: cover image / gallery → **F-pattern** summary text block → `ProjectSubCards` → external link CTA.

**Bug checks:**
- [ ] 404s gracefully (styled empty state, not a raw Next.js error) when `slug` doesn't match a published project.
- [ ] `ProjectSubCards` renders `null` cleanly when a project has zero sub-cards, rather than an empty grid gap.

---

## 8. SOCIAL DOCK

**Files:** `src/components/public/FloatingSocialDock.tsx`, `HeroSocialRow.tsx` — same requirements as the earlier profile loop prompt (Stage 5 there): render only links that are populated **and** `active !== false`; Lucide icon map with `Globe` fallback for custom links; `target="_blank" rel="noopener noreferrer"`; `whileHover={{ scale: 1.15, y: -2 }}` / `whileTap={{ scale: 0.95 }}` via `motion/react`. Colors from theme vars, not hardcoded Crimson/Cream/Obsidian.

**Bug check:** dock position must not collide with the canvas hero's sticky container or the custom cursor's fixed z-index stack — verify `z-index` ordering: cursor `999` > dock `60` > canvas overlay content `40` > canvas `0`.

---

## 9. ADMIN DASHBOARD ("all access to edit")

Auth-gated (`/admin/*`) behind Supabase Auth (single admin account, email+password or magic link). Everything below must be editable **without a redeploy**.

### 9.1 Profile & Theme tab (`src/components/admin/ProfileEditor.tsx`, `ThemeEditor.tsx`)
- Identity form: brand name, full name, role, tagline, bio, location, avatar upload, resume URL.
- `SocialLinksEditor`: as specified before — grid of platform inputs + toggles, dynamic custom-links repeater (`crypto.randomUUID()`), auto-`https://` prefixing, delete removes only the targeted index.
- **Theme editor**: color pickers for `color_primary`/`color_background`/`color_surface`/`color_text`/`color_muted`, font pickers (or free-text font-family input) for `font_heading`/`font_mono`. Live preview pane showing the Wordmark + a sample bento card re-rendering as values change, **before** saving.
- Single `Save` button → `supabase.from('profile').upsert()`; disabled while saving; success/error toast.

### 9.2 Projects tab (`ProjectsTable.tsx`, `ProjectForm.tsx`)
- List view: thumbnail, title, category, published toggle (instant write), sort handle (drag-to-reorder, persists `sort_order` for every affected row on drop, not just the moved one), Edit/Delete.
- Editor form: title (auto-slugifies into an editable `slug` field), category (free-text with autocomplete from existing categories), summary, cover image upload, gallery (multi-image repeater with drag-reorder), `sub_cards` repeater (title + description pairs — same repeater pattern as custom links), external URL, published toggle.
- `MediaUploader.tsx`: uploads to a Supabase Storage bucket (e.g. `project-media`), shows per-file progress, returns the public URL into the relevant field (`cover_image_url`, a `gallery[]` entry).
- Delete requires a confirm step (destructive action).

**Bug checks:**
- [ ] Auth guard redirects unauthenticated visitors from any `/admin/*` route before any data fetch fires (no flash of admin UI).
- [ ] Drag-reorder writes all affected `sort_order` values in one batched request, not N sequential ones.
- [ ] Slug auto-generation checks uniqueness against existing rows and appends `-2`, `-3`, … on collision instead of throwing a DB constraint error to the user.
- [ ] Image upload failures show an inline error on that specific field, not a full-form failure.
- [ ] Deep-copy form state on load (as in the original profile editor) so cancelling an edit never mutates the source list before Save is pressed.

---

## 10. PAGE ASSEMBLY (Home)

`app/page.tsx` composition order, each block tagged with its hierarchy pattern from §1.3:
1. `<CustomCursor />` (mounted once, outside scroll flow)
2. `<ScrollFrameHero />` — canvas sequence + Z-pattern overlay copy (Wordmark, nav, headline, CTA)
3. `<ProjectGrid />` — Commitment/grid, "Selected Work"
4. Optional flagship spotlight block — Spotted pattern, only if one project should be pinned above the grid
5. About/bio block — F-pattern, sourced from `profile.bio`
6. `<HeroSocialRow />` / `<FloatingSocialDock />`
7. Footer

---

## 11. MANDATORY BUG RESOLUTION MATRIX

| ID | Failure Mode | Fix Requirement |
|---|---|---|
| BUG-01 | `Cannot read properties of undefined (reading 'social_links'/'theme')` | Optional chaining + empty-object defaults everywhere `profile` is read. |
| BUG-02 | `PGRST116` on `.single()` with an empty/duplicated table | `.maybeSingle()` / `.limit(1)` + deterministic upsert; seed data from `head.md`. |
| BUG-03 | RLS 403 on profile/project writes | Confirm the authenticated session token is attached before `.upsert()`/`.insert()`. |
| BUG-04 | State mutation in custom-links / gallery / sub-card repeaters | Always clone (`[...items]`) — never mutate `prev` directly. |
| BUG-05 | Broken relative URLs (`localhost:3000/instagram.com/...`) | Prepend `https://` when the value doesn't already start with `http://`/`https://`. |
| BUG-06 | Infinite re-render / hydration mismatch in hooks | Stable `useEffect` deps; `useTheme` writes CSS vars only in an effect, never during render. |
| BUG-07 | Mixed `motion`/`framer-motion` imports bundling two copies of the library | Standardize every import on `motion/react`; remove `framer-motion` from `package.json` if present. |
| BUG-08 | Custom cursor breaks touch/mobile UX | Mount `CustomCursor` only inside `@media (pointer: fine)`; never disable the native cursor on touch devices. |
| BUG-09 | Scroll-hero frame set exhausts mobile memory | Cap or serve a reduced frame set on mobile; verify preload progress is real, not simulated. |
| BUG-10 | Public queries leaking unpublished projects | RLS `using (published = true)` on the public `SELECT` policy for `projects`; admin client uses the authenticated policy instead. |
| BUG-11 | Drag-reorder loses order on refresh | Persist `sort_order` for every row in the same reorder transaction, not just the dragged item. |
| BUG-12 | `totalFrames` constant doesn't match the actual exported frame count from Flow/ffmpeg | Count the files in `public/frames/` after export and set `totalFrames` from that — never hardcode a guessed number. |

## 12. QUALITY BAR — "BEST PORTFOLIO"

- **Performance:** Lighthouse ≥ 90 across the board; canvas frames lazy-preloaded with a real progress bar; `/admin` code-split away from the public bundle.
- **Accessibility:** keyboard-reachable nav and CTAs even with the custom cursor active; `aria-label` on icon-only social buttons; contrast-check theme colors on save (warn in the Theme editor if contrast fails WCAG AA).
- **Motion:** every animated component (`CustomCursor`, `CometCard` tilt, dock hover, sub-card hover) respects `prefers-reduced-motion`.
- **SEO:** dynamic `<meta>` per project page from `title`/`summary`/`cover_image_url`; `sitemap.xml` generated from published `projects`.
- **Resilience:** every Supabase call wrapped per the Bug Matrix; the site never renders a blank screen if the DB is unreachable — falls back to `head.md` seed data.
- **Testing:** minimum one smoke test per stage — e.g. `useProjects` fallback with no env vars, drag-reorder persists order, slug collision resolves without a thrown error.

## 13. OUTPUT FORMAT INSTRUCTION

Execute in order: **§0 install/file map → §2 schema → §3 types/hooks → §4 cursor → §5 canvas hero → §6 project grid → §7 detail page → §8 dock → §9 admin → §10 assembly.**
Conclude with a **Verification & Loop Status Report**: confirm all 11 Bug Matrix entries are guarded, list which Quality Bar items are met vs. still open, and flag any `head.md` field still holding a bracket placeholder that blocks a clean production seed.
