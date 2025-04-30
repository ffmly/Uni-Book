-- Check if tables exist
select exists (
  select from pg_tables 
  where schemaname = 'public' 
  and tablename = 'projects'
) as projects_table_exists;

select exists (
  select from pg_tables 
  where schemaname = 'public' 
  and tablename = 'team_members'
) as team_members_table_exists;

-- Check table structure
select 
    column_name,
    data_type,
    is_nullable,
    column_default
from 
    information_schema.columns
where 
    table_schema = 'public'
    and table_name = 'projects'
order by 
    ordinal_position;

-- Check RLS status
select 
    tablename,
    rowsecurity
from 
    pg_tables
where 
    schemaname = 'public'
    and tablename in ('projects', 'team_members');

-- Check current data
select * from projects;
select * from team_members;

-- Check user permissions
select 
    grantee,
    table_name,
    privilege_type
from 
    information_schema.role_table_grants
where 
    table_schema = 'public'
    and table_name in ('projects', 'team_members'); 