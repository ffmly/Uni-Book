-- Drop all existing policies
DROP POLICY IF EXISTS "Projects are viewable by authenticated users." ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects." ON projects;
DROP POLICY IF EXISTS "Users can update own projects." ON projects;
DROP POLICY IF EXISTS "Users can update their own projects." ON projects;
DROP POLICY IF EXISTS "Team members are viewable by authenticated users." ON team_members;
DROP POLICY IF EXISTS "Users can insert team members for their projects." ON team_members;
DROP POLICY IF EXISTS "Users can update team members for their projects." ON team_members;

-- Create clean set of policies
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

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
    AND tablename IN ('projects', 'team_members')
ORDER BY
    tablename,
    cmd; 