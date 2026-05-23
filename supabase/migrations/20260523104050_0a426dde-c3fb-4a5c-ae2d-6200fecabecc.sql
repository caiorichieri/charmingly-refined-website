-- 1. Restrict profiles public read (expose emails only to owner + admins)
DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- (Admins manage profiles policy already grants admin SELECT.)

-- 2. Quiz responses: require the referenced lead to exist
DROP POLICY IF EXISTS "Public can submit valid responses" ON public.quiz_responses;

CREATE POLICY "Public can submit valid responses"
  ON public.quiz_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    lead_id IS NOT NULL
    AND question_id IS NOT NULL
    AND option_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.quiz_leads l WHERE l.id = lead_id)
    AND EXISTS (SELECT 1 FROM public.quiz_questions q WHERE q.id = question_id)
    AND EXISTS (SELECT 1 FROM public.quiz_options o WHERE o.id = option_id AND o.question_id = quiz_responses.question_id)
  );

-- 3. Lock down internal email-queue SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

-- 4. Pin search_path on those same functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;