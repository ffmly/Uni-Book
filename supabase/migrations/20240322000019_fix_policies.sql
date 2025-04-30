-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "Projects are viewable by authenticated users." ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects." ON projects;
DROP POLICY IF EXISTS "Users can update their own projects." ON projects;
DROP POLICY IF EXISTS "Admin can update any project." ON projects;

DROP POLICY IF EXISTS "Team members are viewable by authenticated users." ON team_members;
DROP POLICY IF EXISTS "Users can insert team members for their projects." ON team_members;
DROP POLICY IF EXISTS "Users can update team members for their projects." ON team_members;

-- Enable RLS if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create new policies for projects table
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
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Create new policies for team_members table
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
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = team_members.project_id
        AND projects.owner_id = auth.uid()
    )
);

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated;
GRANT ALL ON team_members TO authenticated;
GRANT USAGE ON SEQUENCE projects_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE team_members_id_seq TO authenticated;

-- Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('projects', 'team_members')
ORDER BY tablename, policyname; 