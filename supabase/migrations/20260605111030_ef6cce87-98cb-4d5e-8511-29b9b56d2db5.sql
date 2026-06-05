
-- MESSAGES
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (length(body) > 0 AND length(body) <= 4000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_thread ON public.messages (athlete_id, therapist_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT TO authenticated
USING (
  auth.uid() = athlete_id
  OR auth.uid() = therapist_id
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND (auth.uid() = athlete_id OR auth.uid() = therapist_id)
  AND EXISTS (
    SELECT 1 FROM public.athlete_assignments aa
    WHERE aa.athlete_id = messages.athlete_id
      AND aa.therapist_id = messages.therapist_id
      AND aa.active = true
  )
);

CREATE POLICY "Recipient can mark as read"
ON public.messages FOR UPDATE TO authenticated
USING (auth.uid() IN (athlete_id, therapist_id) AND sender_id <> auth.uid())
WITH CHECK (auth.uid() IN (athlete_id, therapist_id));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- SHARED MATERIALS
CREATE TABLE public.shared_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  description text CHECK (description IS NULL OR length(description) <= 2000),
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_materials_athlete ON public.shared_materials (athlete_id, created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.shared_materials TO authenticated;
GRANT ALL ON public.shared_materials TO service_role;

ALTER TABLE public.shared_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view materials"
ON public.shared_materials FOR SELECT TO authenticated
USING (
  auth.uid() = athlete_id
  OR auth.uid() = therapist_id
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Therapist can upload for assigned athlete"
ON public.shared_materials FOR INSERT TO authenticated
WITH CHECK (
  therapist_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.athlete_assignments aa
    WHERE aa.athlete_id = shared_materials.athlete_id
      AND aa.therapist_id = auth.uid()
      AND aa.active = true
  )
);

CREATE POLICY "Therapist can delete own materials"
ON public.shared_materials FOR DELETE TO authenticated
USING (therapist_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
