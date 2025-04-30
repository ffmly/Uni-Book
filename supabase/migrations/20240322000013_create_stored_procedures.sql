-- Create function to insert a project
CREATE OR REPLACE FUNCTION insert_project(
  p_title text,
  p_description text,
  p_department text,
  p_status text,
  p_owner_id uuid
) RETURNS projects AS $$
DECLARE
  new_project projects;
BEGIN
  INSERT INTO projects (
    title,
    description,
    department,
    status,
    owner_id
  ) VALUES (
    p_title,
    p_description,
    p_department,
    p_status,
    p_owner_id
  ) RETURNING * INTO new_project;
  
  RETURN new_project;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to insert a team member
CREATE OR REPLACE FUNCTION insert_team_member(
  p_project_id uuid,
  p_first_name text,
  p_last_name text,
  p_date_of_birth date,
  p_place_of_birth text,
  p_faculty text,
  p_student_id text,
  p_field_of_study text,
  p_is_leader boolean
) RETURNS team_members AS $$
DECLARE
  new_member team_members;
BEGIN
  INSERT INTO team_members (
    project_id,
    first_name,
    last_name,
    date_of_birth,
    place_of_birth,
    faculty,
    student_id,
    field_of_study,
    is_leader
  ) VALUES (
    p_project_id,
    p_first_name,
    p_last_name,
    p_date_of_birth,
    p_place_of_birth,
    p_faculty,
    p_student_id,
    p_field_of_study,
    p_is_leader
  ) RETURNING * INTO new_member;
  
  RETURN new_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to delete a project
CREATE OR REPLACE FUNCTION delete_project(
  p_id uuid
) RETURNS void AS $$
BEGIN
  DELETE FROM projects WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION insert_project TO authenticated;
GRANT EXECUTE ON FUNCTION insert_team_member TO authenticated;
GRANT EXECUTE ON FUNCTION delete_project TO authenticated; 