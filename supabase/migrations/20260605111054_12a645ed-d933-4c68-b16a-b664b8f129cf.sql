
CREATE POLICY "Materials: athlete and therapist can read"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'shared-materials'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.athlete_assignments aa
      WHERE aa.athlete_id::text = (storage.foldername(name))[1]
        AND aa.therapist_id = auth.uid()
        AND aa.active = true
    )
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Materials: assigned therapist can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'shared-materials'
  AND EXISTS (
    SELECT 1 FROM public.athlete_assignments aa
    WHERE aa.athlete_id::text = (storage.foldername(name))[1]
      AND aa.therapist_id = auth.uid()
      AND aa.active = true
  )
);

CREATE POLICY "Materials: therapist can delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'shared-materials'
  AND (
    EXISTS (
      SELECT 1 FROM public.athlete_assignments aa
      WHERE aa.athlete_id::text = (storage.foldername(name))[1]
        AND aa.therapist_id = auth.uid()
        AND aa.active = true
    )
    OR public.has_role(auth.uid(), 'admin')
  )
);
