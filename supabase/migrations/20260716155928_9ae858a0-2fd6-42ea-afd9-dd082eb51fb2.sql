
-- Tighten quiz_options: only expose options belonging to published questions
DROP POLICY IF EXISTS "Anyone can view quiz options" ON public.quiz_options;
DROP POLICY IF EXISTS "Public can view quiz options" ON public.quiz_options;
DROP POLICY IF EXISTS "quiz_options_public_read" ON public.quiz_options;
CREATE POLICY "Public can view options of published questions"
  ON public.quiz_options FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.quiz_questions q WHERE q.id = quiz_options.question_id AND q.published = true));

-- Scope media_assets public read to a known key prefix so future rows aren't automatically public
DROP POLICY IF EXISTS "Anyone can view media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_public_read" ON public.media_assets;
CREATE POLICY "Public can view public media assets"
  ON public.media_assets FOR SELECT
  USING (key LIKE 'public/%' OR key LIKE 'site/%' OR key LIKE 'ambassadors/%' OR key LIKE 'blog/%');

-- Revoke EXECUTE on internal SECURITY DEFINER email queue functions from authenticated
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;

-- Restrict realtime.messages to prevent any Broadcast/Presence subscription (only postgres_changes is used)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='realtime' AND tablename='messages') THEN
    EXECUTE 'ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Deny all broadcast/presence" ON realtime.messages';
    EXECUTE 'CREATE POLICY "Deny all broadcast/presence" ON realtime.messages FOR ALL TO authenticated, anon USING (false) WITH CHECK (false)';
  END IF;
END $$;
