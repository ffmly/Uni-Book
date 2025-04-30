-- Drop existing policies
drop policy if exists "Projects are viewable by everyone." on projects;
drop policy if exists "Users can insert their own projects." on projects;
drop policy if exists "Users can update own projects." on projects;
drop policy if exists "Team members are viewable by everyone." on team_members;
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