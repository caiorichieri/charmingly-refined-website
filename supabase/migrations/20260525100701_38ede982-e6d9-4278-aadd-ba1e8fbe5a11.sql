CREATE OR REPLACE FUNCTION internal.quiz_response_valid(_lead_id uuid, _question_id uuid, _option_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _lead_id IS NOT NULL
    AND _question_id IS NOT NULL
    AND _option_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.quiz_leads l WHERE l.id = _lead_id)
    AND EXISTS (SELECT 1 FROM public.quiz_questions q WHERE q.id = _question_id)
    AND EXISTS (
      SELECT 1 FROM public.quiz_options o
      WHERE o.id = _option_id AND o.question_id = _question_id
    );
$$;

DROP POLICY IF EXISTS "Public can submit valid responses" ON public.quiz_responses;
CREATE POLICY "Public can submit valid responses"
  ON public.quiz_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (internal.quiz_response_valid(lead_id, question_id, option_id));