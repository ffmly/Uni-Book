-- Add temporary debugging policies
DROP POLICY IF EXISTS "Debug projects policy" ON projects;
DROP POLICY IF EXISTS "Debug team members policy" ON team_members;

-- Create temporary policies that allow all operations
CREATE POLICY "Debug projects policy" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Debug team members policy" ON team_members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify the current data
SELECT * FROM projects;
SELECT * FROM team_members;

-- Check if the tables are accessible
SELECT 
    table_name,
    table_schema,
    table_type,
    is_insertable_into
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
    AND table_name IN ('projects', 'team_members');

-- Check if the user has the correct permissions
SELECT 
    grantee,
    privilege_type,
    table_name
FROM 
    information_schema.role_table_grants
WHERE 
    table_schema = 'public'
    AND table_name IN ('projects', 'team_members')
    AND grantee = 'authenticated';

-- Check if RLS is enabled
SELECT 
    relname,
    relrowsecurity,
    relforcerowsecurity
FROM 
    pg_class
WHERE 
    relname IN ('projects', 'team_members');

-- Check current policies
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