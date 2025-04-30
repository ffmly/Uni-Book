-- Drop existing tables if they exist
drop table if exists public.team_members;
drop table if exists public.projects;

-- Create projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  department text not null,
  status text not null check (status in ('pending_review', 'approved', 'rejected')),
  owner_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create team_members table
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects on delete cascade not null,
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

-- Enable RLS
alter table public.projects enable row level security;
alter table public.team_members enable row level security;

-- Drop existing policies
drop policy if exists "Projects are viewable by everyone." on public.projects;
drop policy if exists "Users can insert their own projects." on public.projects;
drop policy if exists "Users can update own projects." on public.projects;
drop policy if exists "Team members are viewable by everyone." on public.team_members;
drop policy if exists "Users can insert team members for their projects." on public.team_members;

-- Create new policies
create policy "Projects are viewable by authenticated users."
  on public.projects for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own projects."
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Users can update own projects."
  on public.projects for update
  using (auth.uid() = owner_id);

create policy "Team members are viewable by authenticated users."
  on public.team_members for select
  using (auth.role() = 'authenticated');

create policy "Users can insert team members for their projects."
  on public.team_members for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = team_members.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Grant necessary permissions
grant all on public.projects to authenticated;
grant all on public.team_members to authenticated; 