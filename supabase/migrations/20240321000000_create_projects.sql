-- Create projects table
create table if not exists public.projects (
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
create table if not exists public.team_members (
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

-- Set up Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.team_members enable row level security;

-- Create policies for projects
create policy "Projects are viewable by everyone."
  on projects for select
  using ( true );

create policy "Users can insert their own projects."
  on projects for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update own projects."
  on projects for update
  using ( auth.uid() = owner_id );

-- Create policies for team_members
create policy "Team members are viewable by everyone."
  on team_members for select
  using ( true );

create policy "Users can insert team members for their projects."
  on team_members for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = team_members.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updating updated_at
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute procedure public.update_updated_at_column(); 