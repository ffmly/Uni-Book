-- Drop existing policies
DROP POLICY IF EXISTS "Projects are viewable by authenticated users." ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects." ON projects;
DROP POLICY IF EXISTS "Users can update their own projects." ON projects;
DROP POLICY IF EXISTS "Team members are viewable by authenticated users." ON team_members;
DROP POLICY IF EXISTS "Users can insert team members for their projects." ON team_members;
DROP POLICY IF EXISTS "Users can update team members for their projects." ON team_members;

-- Create sequences if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'projects_id_seq') THEN
        CREATE SEQUENCE public.projects_id_seq;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'team_members_id_seq') THEN
        CREATE SEQUENCE public.team_members_id_seq;
    END IF;
END $$;

-- Create new policies with correct roles
CREATE POLICY "Projects are viewable by authenticated users."
ON projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own projects."
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects."
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Team members are viewable by authenticated users."
ON team_members FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert team members for their projects."
ON team_members FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = team_members.project_id
    AND projects.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update team members for their projects."
ON team_members FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = team_members.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated;
GRANT ALL ON team_members TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.projects_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.team_members_id_seq TO authenticated; 