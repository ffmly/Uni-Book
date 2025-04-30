-- Test database connection and permissions
DO $$
BEGIN
    -- Check if we can access the projects table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        RAISE NOTICE 'Projects table exists';
    ELSE
        RAISE NOTICE 'Projects table does not exist';
    END IF;

    -- Check if we can access the team_members table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'team_members') THEN
        RAISE NOTICE 'Team members table exists';
    ELSE
        RAISE NOTICE 'Team members table does not exist';
    END IF;

    -- Check current user and permissions
    RAISE NOTICE 'Current user: %', current_user;
    RAISE NOTICE 'Current role: %', current_role;
    RAISE NOTICE 'Current database: %', current_database();
END $$;

-- Test insert permissions
INSERT INTO projects (title, description, department, status, owner_id)
VALUES ('test_project', 'test_description', 'engineering', 'pending_review', '5261028e-0793-4cea-a785-a974bda12409')
ON CONFLICT DO NOTHING;

-- Check if the insert worked
SELECT * FROM projects WHERE title = 'test_project'; 