-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;

-- Drop the update policy that allows anyone
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;

-- Create admin_users table for role-based access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admin list
CREATE POLICY "Only admins can view admin list"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = user_id);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create secure admin policies for feedback
CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (
    auth.uid() = user_id  -- Own feedback
    OR public.is_admin()  -- Admin access
  );

CREATE POLICY "Admins can update all feedback"
  ON public.feedback FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete feedback"
  ON public.feedback FOR DELETE
  USING (public.is_admin());

-- Update the existing user view policy to be more specific
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;