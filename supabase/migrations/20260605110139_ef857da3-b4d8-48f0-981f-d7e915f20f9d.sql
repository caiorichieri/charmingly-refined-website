
-- 1. Add 'athlete' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'athlete';

-- 2. Update handle_new_user trigger to assign 'athlete' by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email,'@',1)
    )
  )
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'caiorichieri@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    -- All other new users get 'athlete' role by default
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'athlete')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3. Athlete <-> Therapist assignments
CREATE TABLE public.athlete_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  active boolean NOT NULL DEFAULT true,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX athlete_assignments_active_unique
  ON public.athlete_assignments(athlete_id) WHERE active = true;

CREATE INDEX athlete_assignments_therapist_idx ON public.athlete_assignments(therapist_id) WHERE active = true;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.athlete_assignments TO authenticated;
GRANT ALL ON public.athlete_assignments TO service_role;

ALTER TABLE public.athlete_assignments ENABLE ROW LEVEL SECURITY;

-- Admin full control
CREATE POLICY "admin manage assignments"
  ON public.athlete_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Athletes see their own
CREATE POLICY "athlete sees own assignment"
  ON public.athlete_assignments FOR SELECT TO authenticated
  USING (athlete_id = auth.uid());

-- Therapists see their assigned athletes
CREATE POLICY "therapist sees own athletes"
  ON public.athlete_assignments FOR SELECT TO authenticated
  USING (therapist_id = auth.uid());

CREATE TRIGGER set_athlete_assignments_updated_at
  BEFORE UPDATE ON public.athlete_assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Helper: get current therapist for an athlete
CREATE OR REPLACE FUNCTION public.get_my_therapist(_athlete_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT therapist_id FROM public.athlete_assignments
  WHERE athlete_id = _athlete_id AND active = true
  LIMIT 1;
$$;
