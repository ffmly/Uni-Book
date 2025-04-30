-- Verify and create projects table if it doesn't exist
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  department text not null,
  status text not null default 'pending_review',
  owner_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Verify and create team_members table if it doesn't exist
create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  place_of_birth text not null,
  faculty text not null,
  student_id text not null,
  field_of_study text not null,
  is_leader boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drop existing policies to ensure clean state
drop policy if exists "Projects are viewable by authenticated users." on projects;
drop policy if exists "Users can insert their own projects." on projects;
drop policy if exists "Users can update own projects." on projects;
drop policy if exists "Admins can update any project." on projects;
drop policy if exists "Team members are viewable by authenticated users." on team_members;
drop policy if exists "Users can insert team members for their projects." on team_members;

-- Create new policies for projects
create policy "Projects are viewable by authenticated users."
  on projects for select
  using ( auth.role() = 'authenticated' );

create policy "Users can insert their own projects."
  on projects for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update own projects."
  on projects for update
  using ( auth.uid() = owner_id );

create policy "Admins can update any project."
  on projects for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('main_admin', 'institution_admin')
    )
  );

-- Create new policies for team_members
create policy "Team members are viewable by authenticated users."
  on team_members for select
  using ( auth.role() = 'authenticated' );

create policy "Users can insert team members for their projects."
  on team_members for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = team_members.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on projects to authenticated;
grant all on team_members to authenticated;
grant usage, select on all sequences in schema public to authenticated; 