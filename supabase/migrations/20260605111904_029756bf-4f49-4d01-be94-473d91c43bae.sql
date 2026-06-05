
DROP POLICY IF EXISTS "Anyone can insert cookie consent" ON public.cookie_consents;
CREATE POLICY "Anyone can insert cookie consent" ON public.cookie_consents
FOR INSERT TO anon, authenticated
WITH CHECK (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR (user_id IS NULL AND anonymous_id IS NOT NULL AND length(anonymous_id) BETWEEN 8 AND 64)
);
