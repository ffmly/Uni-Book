-- Update projects table structure
DO $$ 
BEGIN
    -- Change project_id in team_members to match projects.id type
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'team_members' 
               AND column_name = 'project_id'
               AND data_type = 'bigint') THEN
        ALTER TABLE public.team_members 
        ALTER COLUMN project_id TYPE uuid USING project_id::text::uuid;
    END IF;
END $$;

-- Verify foreign key constraint
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_type = 'FOREIGN KEY' 
                  AND table_name = 'team_members' 
                  AND constraint_name = 'team_members_project_id_fkey') THEN
        ALTER TABLE public.team_members
        ADD CONSTRAINT team_members_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Verify current table structure
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