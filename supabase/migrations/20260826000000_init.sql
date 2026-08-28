-- ═══════════════════════════════════════════════════════════════
-- DIGI GROW — Supabase Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. PROFILE TABLE (singleton row) ───────────────────────
create table if not exists public.profile (
  id          uuid primary key default gen_random_uuid(),
  brand_name  text not null default 'Digi Grow',
  full_name   text not null default '',
  role_title  text not null default '',
  tagline     text default '',
  bio         text default '',
  avatar_url  text default '',
  resume_url  text default '',
  location    text default '',
  social_links jsonb default '{
    "instagram": "",
    "facebook": "",
    "linkedin": "",
    "github": "",
    "twitter": "",
    "youtube": "",
    "discord": "",
    "custom_links": []
  }'::jsonb,
  theme jsonb default '{
    "color_primary": "#C72E1E",
    "color_background": "#080808",
    "color_surface": "#F7F3EB",
    "color_text": "#F4F4F5",
    "color_muted": "#A1A1AA",
    "font_heading": "Inter",
    "font_mono": "JetBrains Mono"
  }'::jsonb,
  updated_at  timestamptz default now()
);

-- ─── 2. PROJECTS TABLE ──────────────────────────────────────
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  category        text default '',
  summary         text default '',
  cover_image_url text default '',
  gallery         jsonb default '[]'::jsonb,
  sub_cards       jsonb default '[]'::jsonb,
  external_url    text default '',
  published       boolean not null default false,
  sort_order      integer not null default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Unique index on slug for fast lookups and collision detection
create unique index if not exists projects_slug_idx on public.projects (slug);

-- ─── 3. RLS POLICIES ────────────────────────────────────────

-- Enable RLS on both tables
alter table public.profile enable row level security;
alter table public.projects enable row level security;

-- Profile: public read for everyone
drop policy if exists "Profile: public read" on public.profile;
create policy "Profile: public read"
  on public.profile for select
  to anon, authenticated
  using (true);

-- Profile: authenticated users can insert/update/delete
drop policy if exists "Profile: authenticated write" on public.profile;
create policy "Profile: authenticated write"
  on public.profile for all
  to authenticated
  using (true)
  with check (true);

-- Projects: public read only published rows
drop policy if exists "Projects: public read published" on public.projects;
create policy "Projects: public read published"
  on public.projects for select
  to anon
  using (published = true);

-- Projects: authenticated read all (including unpublished)
drop policy if exists "Projects: authenticated read all" on public.projects;
create policy "Projects: authenticated read all"
  on public.projects for select
  to authenticated
  using (true);

-- Projects: authenticated users can insert/update/delete
drop policy if exists "Projects: authenticated write" on public.projects;
create policy "Projects: authenticated write"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- ─── 4. UPDATED_AT TRIGGER ──────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profile_updated_at
  before update on public.profile
  for each row execute function public.handle_updated_at();

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- ─── 5. SEED DATA (from head.md) ────────────────────────────

-- Singleton profile row
insert into public.profile (
  brand_name, full_name, role_title, tagline, bio,
  avatar_url, resume_url, location,
  social_links, theme
) values (
  'Digi Grow',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '{
    "instagram": "",
    "facebook": "",
    "linkedin": "",
    "github": "",
    "twitter": "",
    "youtube": "",
    "discord": "",
    "custom_links": []
  }'::jsonb,
  '{
    "color_primary": "#C72E1E",
    "color_background": "#080808",
    "color_surface": "#F7F3EB",
    "color_text": "#F4F4F5",
    "color_muted": "#A1A1AA",
    "font_heading": "Inter",
    "font_mono": "JetBrains Mono"
  }'::jsonb
) on conflict do nothing;

-- Seed projects so queries never hit an empty table
insert into public.projects (title, slug, category, summary, published, sort_order)
values
  ('B-Roll & Video Editing', 'b-roll-video-editing', 'B-Roll & Video Editing',
   'Professional B-Roll footage and video editing services that bring your brand story to life.',
   true, 0),
  ('Website Design', 'website-design', 'Website Design',
   'Modern, responsive website design built for performance and visual impact.',
   true, 1),
  ('Brand Identity', 'brand-identity', 'Brand Identity',
   'Comprehensive brand identity packages including logo, color palette, and style guides.',
   true, 2)
on conflict (slug) do nothing;

-- ─── 6. STORAGE BUCKET ──────────────────────────────────────
-- Create the project-media bucket if it doesn't exist
insert into storage.buckets (id, name, public) values ('project-media', 'project-media', true)
on conflict do nothing;

-- Ensure public access to the project-media bucket
drop policy if exists "Public Access to project-media" on storage.objects;
create policy "Public Access to project-media"
  on storage.objects for select
  using ( bucket_id = 'project-media' );

drop policy if exists "Auth Upload to project-media" on storage.objects;
create policy "Auth Upload to project-media"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'project-media' );
