-- ═══════════════════════════════════════════════════════════════
-- DIGI GROW — Admin Roles Migration
-- ═══════════════════════════════════════════════════════════════

-- 1. Create admin_users table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Ensure user_id is unique
create unique index if not exists admin_users_user_id_idx on public.admin_users (user_id);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Only admins can read the admin list
create policy "Admins can read admin list"
  on public.admin_users for select
  to authenticated
  using ( auth.uid() in (select user_id from public.admin_users) );

-- 2. Update Profile Policies
drop policy if exists "Profile: authenticated write" on public.profile;

create policy "Profile: admin write"
  on public.profile for all
  to authenticated
  using ( auth.uid() in (select user_id from public.admin_users) )
  with check ( auth.uid() in (select user_id from public.admin_users) );

-- 3. Update Projects Policies
drop policy if exists "Projects: authenticated write" on public.projects;

create policy "Projects: admin write"
  on public.projects for all
  to authenticated
  using ( auth.uid() in (select user_id from public.admin_users) )
  with check ( auth.uid() in (select user_id from public.admin_users) );

-- 4. Update Storage Policies
drop policy if exists "Auth Upload to project-media" on storage.objects;

create policy "Admin Upload to project-media"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'project-media' and auth.uid() in (select user_id from public.admin_users) );

create policy "Admin Update to project-media"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'project-media' and auth.uid() in (select user_id from public.admin_users) );

create policy "Admin Delete from project-media"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'project-media' and auth.uid() in (select user_id from public.admin_users) );
