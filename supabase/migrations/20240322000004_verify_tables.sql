-- Check if tables exist
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'projects'
) as projects_table_exists;

SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'team_members'
) as team_members_table_exists;

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'projects'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'team_members'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('projects', 'team_members');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('projects', 'team_members');

-- Check current data
SELECT * FROM projects;
SELECT * FROM team_members;

-- Check user permissions
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name IN ('projects', 'team_members'); 