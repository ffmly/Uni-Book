-- Add temporary debugging policies
CREATE POLICY "Debug: Allow all operations on projects"
ON projects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Debug: Allow all operations on team_members"
ON team_members FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Check current data in projects table
SELECT * FROM projects;

-- Check current data in team_members table
SELECT * FROM team_members;

-- Check if the user exists in auth.users
SELECT id, email, role 
FROM auth.users 
WHERE id = '5261028e-0793-4cea-a785-a974bda12409';

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