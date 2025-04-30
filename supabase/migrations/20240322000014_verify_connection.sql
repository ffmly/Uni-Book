-- Check if the tables exist and are accessible
SELECT 
    table_name,
    table_schema,
    table_type
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
    AND table_name IN ('projects', 'team_members');

-- Check if the user has the correct role
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin
FROM 
    pg_roles
WHERE 
    rolname = 'authenticated';

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

-- Check if the user exists in auth.users
SELECT 
    id,
    email,
    role,
    raw_app_meta_data,
    raw_user_meta_data
FROM 
    auth.users
WHERE 
    id = '5261028e-0793-4cea-a785-a974bda12409'; 