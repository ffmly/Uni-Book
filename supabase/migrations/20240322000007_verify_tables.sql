-- Check if tables exist
DO $$ 
BEGIN
    -- Create projects table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        CREATE TABLE public.projects (
            id BIGSERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            department TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending_review',
            owner_id UUID NOT NULL REFERENCES auth.users(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    END IF;

    -- Create team_members table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'team_members') THEN
        CREATE TABLE public.team_members (
            id BIGSERIAL PRIMARY KEY,
            project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            date_of_birth DATE NOT NULL,
            place_of_birth TEXT NOT NULL,
            faculty TEXT NOT NULL,
            student_id TEXT NOT NULL,
            field_of_study TEXT NOT NULL,
            is_leader BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    END IF;

    -- Enable RLS if not already enabled
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
END $$;

-- Create sequences if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'projects_id_seq') THEN
        CREATE SEQUENCE public.projects_id_seq;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'team_members_id_seq') THEN
        CREATE SEQUENCE public.team_members_id_seq;
    END IF;
END $$;

-- Verify table structure
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

-- Verify sequences
SELECT 
    sequence_schema,
    sequence_name,
    start_value,
    increment,
    maximum_value,
    minimum_value,
    cycle_option
FROM 
    information_schema.sequences
WHERE 
    sequence_schema = 'public'
    AND sequence_name IN ('projects_id_seq', 'team_members_id_seq'); 