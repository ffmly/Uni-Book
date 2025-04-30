-- Check if tables exist
SELECT 
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_name IN ('projects', 'team_members')
AND table_schema = 'public';

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Check RLS policies
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
WHERE tablename IN ('projects', 'team_members');

-- Check permissions
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('projects', 'team_members');

-- Try to insert a test project
INSERT INTO projects (
    title,
    description,
    department,
    status,
    owner_id
) VALUES (
    'test_project',
    'test_description',
    'engineering',
    'pending_review',
    '5261028e-0793-4cea-a785-a974bda12409'
) ON CONFLICT DO NOTHING;

-- Check if the insert worked
SELECT * FROM projects WHERE title = 'test_project'; 