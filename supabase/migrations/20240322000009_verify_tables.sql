-- Check if tables exist
select 
  table_name,
  table_schema
from information_schema.tables 
where table_schema = 'public' 
  and table_name in ('projects', 'team_members');

-- Check table structure
select 
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public' 
  and table_name = 'projects';

-- Check RLS status
select 
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('projects', 'team_members');

-- Check existing policies
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('projects', 'team_members');

-- Check current data
select * from public.projects;
select * from public.team_members; 