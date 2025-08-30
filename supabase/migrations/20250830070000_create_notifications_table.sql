CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (true);
