-- First, let's check if we have a valid user ID
select id from auth.users limit 1;

-- Then try to insert a test project
insert into public.projects (
  title,
  description,
  department,
  status,
  owner_id
) values (
  'Test Project',
  'This is a test project description',
  'engineering',
  'pending_review',
  '5261028e-0793-4cea-a785-a974bda12409'  -- Replace this with your actual user ID from the query above
) returning *;

-- If the project insert succeeds, try to insert a team member
insert into public.team_members (
  project_id,
  first_name,
  last_name,
  date_of_birth,
  place_of_birth,
  faculty,
  student_id,
  field_of_study,
  is_leader
) values (
  '00000000-0000-0000-0000-000000000000',  -- Replace this with the project ID from the insert above
  'John',
  'Doe',
  '2000-01-01',
  'New York',
  'Engineering',
  '123456',
  'Computer Science',
  true
) returning *; 