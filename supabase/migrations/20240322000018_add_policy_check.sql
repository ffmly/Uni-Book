-- Create a function to get table policies
CREATE OR REPLACE FUNCTION get_table_policies(table_name text)
RETURNS TABLE (
    schemaname text,
    tablename text,
    policyname text,
    permissive text,
    roles text[],
    cmd text,
    qual text,
    with_check text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.schemaname,
        p.tablename,
        p.policyname,
        p.permissive,
        p.roles,
        p.cmd,
        p.qual,
        p.with_check
    FROM pg_policies p
    WHERE p.tablename = table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_table_policies(text) TO authenticated; 