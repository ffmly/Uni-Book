-- Drop existing policies
drop policy if exists "Projects are viewable by authenticated users." on public.projects;
drop policy if exists "Users can insert their own projects." on public.projects;
drop policy if exists "Users can update own projects." on public.projects;
drop policy if exists "Team members are viewable by authenticated users." on public.team_members;
drop policy if exists "Users can insert team members for their projects." on public.team_members;

-- Create new policies with correct roles
create policy "Projects are viewable by authenticated users."
  on public.projects for select
  to authenticated
  using (true);

create policy "Users can insert their own projects."
  on public.projects for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Users can update own projects."
  on public.projects for update
  to authenticated
  using (auth.uid() = owner_id);

create policy "Team members are viewable by authenticated users."
  on public.team_members for select
  to authenticated
  using (true);

create policy "Users can insert team members for their projects."
  on public.team_members for insert
  to authenticated
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