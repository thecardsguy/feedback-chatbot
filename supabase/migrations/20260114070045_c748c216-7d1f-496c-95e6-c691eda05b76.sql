-- Create notification_reads table for tracking read/unread notification states
CREATE TABLE public.notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feedback_id UUID NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, feedback_id)
);

-- Enable Row Level Security
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Create policies for notification_reads
CREATE POLICY "Users can manage own notification reads"
  ON public.notification_reads FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Enable realtime for feedback table
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;