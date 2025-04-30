-- Check if tables exist and their structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name IN ('projects', 'team_members')
ORDER BY 
    table_name,
    ordinal_position;

-- Check if sequences exist and their current values
SELECT 
    sequence_schema,
    sequence_name,
    start_value,
    increment,
    maximum_value,
    minimum_value,
    cycle_option
FROM 
    information_schema.sequences
WHERE 
    sequence_schema = 'public'
    AND sequence_name IN ('projects_id_seq', 'team_members_id_seq');

-- Check RLS status
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
    AND tablename IN ('projects', 'team_members');

-- Check current permissions
SELECT 
    grantee,
    privilege_type,
    table_name
FROM 
    information_schema.role_table_grants
WHERE 
    table_schema = 'public'
    AND table_name IN ('projects', 'team_members'); 