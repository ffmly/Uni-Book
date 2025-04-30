-- Check and update projects table structure
DO $$ 
BEGIN
    -- Add missing columns to projects table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'title') THEN
        ALTER TABLE public.projects ADD COLUMN title TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'description') THEN
        ALTER TABLE public.projects ADD COLUMN description TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'department') THEN
        ALTER TABLE public.projects ADD COLUMN department TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'status') THEN
        ALTER TABLE public.projects ADD COLUMN status TEXT NOT NULL DEFAULT 'pending_review';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'owner_id') THEN
        ALTER TABLE public.projects ADD COLUMN owner_id UUID NOT NULL REFERENCES auth.users(id);
    END IF;
END $$;

-- Check and update team_members table structure
DO $$ 
BEGIN
    -- Add missing columns to team_members table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'first_name') THEN
        ALTER TABLE public.team_members ADD COLUMN first_name TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'last_name') THEN
        ALTER TABLE public.team_members ADD COLUMN last_name TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.team_members ADD COLUMN date_of_birth DATE NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'place_of_birth') THEN
        ALTER TABLE public.team_members ADD COLUMN place_of_birth TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'faculty') THEN
        ALTER TABLE public.team_members ADD COLUMN faculty TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'student_id') THEN
        ALTER TABLE public.team_members ADD COLUMN student_id TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'field_of_study') THEN
        ALTER TABLE public.team_members ADD COLUMN field_of_study TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_members' AND column_name = 'is_leader') THEN
        ALTER TABLE public.team_members ADD COLUMN is_leader BOOLEAN NOT NULL DEFAULT FALSE;
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