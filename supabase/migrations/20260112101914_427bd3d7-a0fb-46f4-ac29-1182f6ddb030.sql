-- Fix: Add explicit SECURITY DEFINER and search_path to trigger function
CREATE OR REPLACE FUNCTION public.feedback_update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix: Add UPDATE policy for admin_users table (currently missing)
CREATE POLICY "Admins can update admin list"
  ON public.admin_users
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add comment for documentation
COMMENT ON FUNCTION public.feedback_update_timestamp() IS 
  'Updates the updated_at timestamp on feedback table modifications. Runs as SECURITY DEFINER with restricted search_path.';

COMMENT ON FUNCTION public.is_admin() IS 
  'Checks if the current authenticated user is in the admin_users table. Used for RLS policies.';