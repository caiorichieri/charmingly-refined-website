DROP POLICY IF EXISTS "Public can view published ambassadors" ON public.ambassadors;

CREATE POLICY "Anyone can view published ambassadors"
  ON public.ambassadors FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all ambassadors"
  ON public.ambassadors FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));