CREATE POLICY "Admins can delete any blog" 
ON public.blogs 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
