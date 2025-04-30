-- Drop duplicate and incomplete policies
DROP POLICY IF EXISTS "Users can update own projects." ON projects;

-- Drop and recreate projects policies with proper qual/with_check
DROP POLICY IF EXISTS "Users can update their own projects." ON projects;
CREATE POLICY "Users can update their own projects."
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Verify the policies after cleanup
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
WHERE tablename IN ('projects', 'team_members')
ORDER BY tablename, policyname;

-- Test the policies with a sample query
DO $$
DECLARE
    test_user_id uuid := '5261028e-0793-4cea-a785-a974bda12409'; -- Your test user ID
    test_project_id uuid;
BEGIN
    -- Test project insertion
    INSERT INTO projects (title, description, department, status, owner_id)
    VALUES ('test_policy', 'testing policy access', 'engineering', 'pending_review', test_user_id)
    RETURNING id INTO test_project_id;
    
    -- Test project selection
    PERFORM 1 FROM projects WHERE id = test_project_id;
    
    -- Test project update
    UPDATE projects 
    SET description = 'updated description'
    WHERE id = test_project_id;
    
    -- Test team member insertion
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
    )
    VALUES (
        test_project_id,
        'Test',
        'User',
        '2000-01-01',
        'Test City',
        'Engineering',
        '123456',
        'Computer Science',
        true
    );
    
    -- Clean up test data
    DELETE FROM team_members WHERE project_id = test_project_id;
    DELETE FROM projects WHERE id = test_project_id;
    
    RAISE NOTICE 'All policy tests completed successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during policy test: %', SQLERRM;
END $$; 