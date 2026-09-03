---
name: digi-grow-portfolio
description: >
  Comprehensive architecture, animation, scrolling mechanics, and component
  blueprint for the high-end 3D Digi Grow portfolio. Use when maintaining,
  expanding, or replicating the stacking cards layout, Framer Motion scroll
  transforms, 3D interactive pins, Nothing OS dot-matrix aesthetics, or Supabase
  dynamic content pipelines.
---

# Digi Grow Portfolio: Master Architecture & Animation Skill

This skill documents the complete technical stack, mathematical scroll mechanics, visual animation techniques, 3D canvas systems, and database patterns used in the **Digi Grow Portfolio** (`digi-grow-portfolio`).

---

## 1. Core Technology Stack

- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS + Custom CSS Variables (Runtime theme tokens)
- **Motion & Scroll Engine**: `framer-motion` (`useScroll`, `useTransform`, `motion.div`, `AnimatePresence`)
- **3D & Canvas**: Custom HTML5 Canvas (3D interactive particle grids, mountain parallax, cyberpunk city)
- **Icons**: `lucide-react` + Custom optimized SVG paths
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Typography**: Inter (Headings/Body), JetBrains Mono (Micro-labels, stats), Nothing OS Dotted Font

---

## 2. Global Stacking Scroll Architecture (The Core Engine)

The portfolio utilizes a **Unified Stacking Scroll System** where all major sections act as individual cards that scale down and stack beneath subsequent cards during scrolling.

### A. Mathematical Scaling & Offset Formula
In `src/components/StickyStackSection.tsx`:
```tsx
const targetScale = 1 - (total - index) * 0.04;
const startRange = index / total;
const endRange = 1;

const scale = useTransform(scrollYProgress, [startRange, endRange], [1, targetScale]);
const opacity = useTransform(scrollYProgress, [startRange, endRange], [1, 0.88]);
```
- **Scale Factor**: Each preceding card scales down smoothly by `0.04` per depth step.
- **Top Offset**: Stacks nest with a vertical offset: `top: calc(${index * 16}px)`.
- **Z-Index & Viewport**: Cards are sticky positioned at `top-6 md:top-10` within a `min-h-[92vh]` wrapper.

### B. Outer Canvas & Card Framing
- **Outer Canvas**: Wrapped in a dark crimson ambient mesh (`bg-black` with gradient glow overlays and subtle noise grain).
- **Card Enclosure**:
  ```tsx
  className="relative w-full max-w-7xl h-[90vh] flex flex-col rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden will-change-transform"
  ```
- **Internal Overflow**: Each card body uses `overflow-y-auto custom-scrollbar` so that expansive content remains accessible without breaking outer viewport sticky calculations.

### C. Critical Rule: Zero Black Gaps
- **Never** use artificial `150vh` or `200vh` spacer wrappers around sticky containers; this causes empty black dead-zones between cards.
- Keep outer card wrappers at `min-h-[92vh]` and inner containers at `h-[90vh]`.

---

## 3. Animation & Interactive 3D Effects Suite

### 1. 3D Pin Cards (`src/components/ui/3d-pin.tsx`)
- Provides interactive 3D perspective tilt on hover with dynamic glare and floating pin indicators.
- **Perspective**: `perspective: 1000px` with `rotateX` and `rotateY` driven by pointer coordinates.
- **Dynamic Links**: In `src/components/ContactPinSection.tsx`, pins dynamically generate based on database profiles (`profile.social_links`). If an admin leaves a link blank, the card is safely hidden to avoid broken UI links.

### 2. Nothing OS Dot Matrix Glitch (`src/components/NothingDotText.tsx`)
- Renders high-tech dotted typography resembling the Nothing OS design language.
- Generates random character scrambles and glitch pulses on hover or timed interval loops.

### 3. Scroll-Driven Text Lighting (`src/components/ui/ScrollTextHighlight.tsx`)
- Paragraph text splits into individual words.
- Each word's opacity transitions from `0.15` (dark muted) to `1.0` (bright white) progressively as the user scrolls through the section viewport.

### 4. Canvas Parallax Hero (`src/components/canvas/MountainParallaxHero.tsx`)
- Multi-layered procedural canvas rendering with depth sorting.
- Moves layers in response to both mouse cursor displacement and vertical scroll velocity.

### 5. High-Tech Preloader (`src/components/Preloader.tsx`)
- Displays a cyberpunk initialization sequence with progress counter (`00%` to `100%`).
- Emits audio-reactive / tech status strings (`INITIALIZING ENGINE`, `MOUNTING 3D CANVAS`, `READY`).

---

## 4. Supabase Database & Security Patterns

### A. RLS Infinite Recursion Prevention
When securing tables via admin-check roles in Supabase:
- **WRONG (Causes 500 Infinite Recursion)**:
  ```sql
  create policy "admin_read" on public.admin_users
    using (auth.uid() in (select user_id from public.admin_users));
  ```
- **CORRECT (Zero-Recursion Direct Match)**:
  ```sql
  create policy "Admins can read admin list" on public.admin_users
    for select to authenticated
    using (auth.uid() = user_id);
  ```

### B. Admin Authorization Setup
To grant admin privileges to registered user accounts:
```sql
insert into public.admin_users (user_id)
select id from auth.users
on conflict do nothing;
```

### C. Runtime Theme Tokens
Tokens are stored in `public.profile.theme` (JSONB) and injected dynamically into root CSS variables:
- `--color-primary`: Signal Crimson (`#C72E1E`)
- `--color-background`: Obsidian Black (`#080808`)
- `--color-surface`: Antique Cream (`#F7F3EB`)
- `--color-text`: Neutral Zinc (`#F4F4F5`)
- `--font-heading`: Inter
- `--font-mono`: JetBrains Mono

---

## 5. Performance & Viewport Optimization

### 1. Viewport-Based Lazy Mounting (`src/components/ui/LazyRender.tsx`)
Heavy 3D Canvas, WebGL, or complex SVG clusters must be wrapped in `<LazyRender>`:
```tsx
<LazyRender>
  <SkillsCloudSection />
</LazyRender>
```
Uses `IntersectionObserver` with a root margin (`200px`) so that off-screen WebGL contexts do not consume GPU cycles or degrade frame rates.

### 2. Client-Side Only Mounting for Canvas
All Three.js / Canvas components must be dynamically imported with `ssr: false`:
```tsx
const MountainParallaxHero = dynamic(
  () => import("@/components/canvas/MountainParallaxHero"),
  { ssr: false }
);
```

### 3. Hardware Acceleration
Enforce GPU compositing layers on animated cards:
- CSS classes: `transform-gpu`, `will-change-transform`.

---

## 6. How to Add a New Section to the Stacking Layout

To add a new section (such as an **Experience** section):

1. **Update Total Count**:
   In `src/app/page.tsx`:
   ```tsx
   const TOTAL_SECTIONS = 6; // increment total
   ```

2. **Insert `<StickyStackSection>`**:
   ```tsx
   <StickyStackSection
     index={4}
     total={TOTAL_SECTIONS}
     scrollYProgress={scrollYProgress}
     className="bg-[var(--color-background)]"
   >
     <div className="h-full w-full flex flex-col overflow-y-auto custom-scrollbar p-8">
       <ExperienceSection />
     </div>
   </StickyStackSection>
   ```

3. **Maintain Card Constraints**:
   - Top level wrapper inside card must have `h-full w-full overflow-y-auto custom-scrollbar`.
   - Never remove `overflow-y-auto` from overflowing content.
