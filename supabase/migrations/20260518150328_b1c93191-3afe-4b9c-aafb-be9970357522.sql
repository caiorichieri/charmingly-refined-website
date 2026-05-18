-- Recreate insert policies explicitly targeting anon + authenticated roles
DROP POLICY IF EXISTS "Public can submit leads" ON public.quiz_leads;
CREATE POLICY "Public can submit leads"
ON public.quiz_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit responses" ON public.quiz_responses;
CREATE POLICY "Public can submit responses"
ON public.quiz_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure table-level grants for REST access
GRANT INSERT ON public.quiz_leads TO anon, authenticated;
GRANT INSERT ON public.quiz_responses TO anon, authenticated;
GRANT SELECT ON public.quiz_questions TO anon, authenticated;
GRANT SELECT ON public.quiz_options TO anon, authenticated;