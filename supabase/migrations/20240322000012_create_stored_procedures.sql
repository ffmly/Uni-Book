-- Create function to insert project
create or replace function public.insert_project(
  p_title text,
  p_description text,
  p_department text,
  p_status text,
  p_owner_id uuid
) returns projects
language plpgsql
security definer
as $$
declare
  v_project projects;
begin
  insert into public.projects (
    title,
    description,
    department,
    status,
    owner_id
  ) values (
    p_title,
    p_description,
    p_department,
    p_status,
    p_owner_id
  ) returning * into v_project;
  
  return v_project;
end;
$$;

-- Create function to insert team member
create or replace function public.insert_team_member(
  p_project_id uuid,
  p_first_name text,
  p_last_name text,
  p_date_of_birth date,
  p_place_of_birth text,
  p_faculty text,
  p_student_id text,
  p_field_of_study text,
  p_is_leader boolean
) returns team_members
language plpgsql
security definer
as $$
declare
  v_team_member team_members;
begin
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
    p_project_id,
    p_first_name,
    p_last_name,
    p_date_of_birth,
    p_place_of_birth,
    p_faculty,
    p_student_id,
    p_field_of_study,
    p_is_leader
  ) returning * into v_team_member;
  
  return v_team_member;
end;
$$;

-- Create function to delete project
create or replace function public.delete_project(
  p_id uuid
) returns void
language plpgsql
security definer
as $$
begin
  delete from public.projects where id = p_id;
end;
$$;

-- Grant execute permissions
grant execute on function public.insert_project to authenticated;
grant execute on function public.insert_team_member to authenticated;
grant execute on function public.delete_project to authenticated; 