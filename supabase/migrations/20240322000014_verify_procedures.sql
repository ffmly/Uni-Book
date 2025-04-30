-- Check if the stored procedures exist
SELECT 
    p.proname as procedure_name,
    pg_get_function_arguments(p.oid) as arguments,
    p.prosecdef as security_definer,
    array_to_string(p.proacl, ',') as permissions
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('insert_project', 'insert_team_member', 'delete_project');

-- Check if the tables exist and have the correct structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN ('projects', 'team_members')
ORDER BY table_name, ordinal_position;

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