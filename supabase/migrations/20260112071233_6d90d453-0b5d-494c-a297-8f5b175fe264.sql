-- Fix admin_users policies - only admins can view full list
DROP POLICY IF EXISTS "Only admins can view admin list" ON public.admin_users;

-- Admins can view all admin users
CREATE POLICY "Admins can view admin list"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());

-- Add INSERT policy for admin management (only existing admins can add new admins)
CREATE POLICY "Admins can add new admins"
  ON public.admin_users FOR INSERT
  WITH CHECK (public.is_admin());

-- Add DELETE policy for admin management
CREATE POLICY "Admins can remove admins"
  ON public.admin_users FOR DELETE
  USING (public.is_admin());

-- Fix feedback SELECT policy to be more explicit
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;

-- Recreate with explicit conditions
CREATE POLICY "Users and admins can view feedback"
  ON public.feedback FOR SELECT
  USING (
    -- Authenticated user viewing their own feedback
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    -- OR admin viewing any feedback
    OR public.is_admin()
  );