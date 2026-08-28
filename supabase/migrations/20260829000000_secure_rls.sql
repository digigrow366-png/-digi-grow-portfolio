-- Create admins table for least-privilege RLS
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Enable RLS on admins
alter table public.admins enable row level security;

-- Admins can read their own row
create policy "Admins can read own row"
  on public.admins for select
  to authenticated
  using (auth.uid() = id);

-- ----------------------------------------------------
-- Update Profile Policies
-- ----------------------------------------------------

drop policy if exists "Profile: authenticated write" on public.profile;

create policy "Profile: admins write"
  on public.profile for all
  to authenticated
  using (exists (select 1 from public.admins where id = auth.uid()))
  with check (exists (select 1 from public.admins where id = auth.uid()));

-- ----------------------------------------------------
-- Update Projects Policies
-- ----------------------------------------------------

drop policy if exists "Projects: authenticated write" on public.projects;

create policy "Projects: admins write"
  on public.projects for all
  to authenticated
  using (exists (select 1 from public.admins where id = auth.uid()))
  with check (exists (select 1 from public.admins where id = auth.uid()));

-- ----------------------------------------------------
-- Update Storage Policies
-- ----------------------------------------------------

drop policy if exists "Auth Upload to project-media" on storage.objects;

create policy "Admin Upload to project-media"
  on storage.objects for insert
  to authenticated
  with check ( 
    bucket_id = 'project-media' 
    and exists (select 1 from public.admins where id = auth.uid())
  );

create policy "Admin Update to project-media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-media'
    and exists (select 1 from public.admins where id = auth.uid())
  )
  with check ( 
    bucket_id = 'project-media' 
    and exists (select 1 from public.admins where id = auth.uid())
  );

create policy "Admin Delete from project-media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-media'
    and exists (select 1 from public.admins where id = auth.uid())
  );
