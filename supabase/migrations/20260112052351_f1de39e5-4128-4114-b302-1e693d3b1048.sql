-- Fix security warnings

-- 1. Fix function search_path
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

-- 2. Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;

-- 3. Create more secure policies
-- Anyone can submit feedback but only with their own user_id or null (anonymous)
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Only authenticated users can update feedback they own, or service role
CREATE POLICY "Users can update own feedback"
  ON public.feedback FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);