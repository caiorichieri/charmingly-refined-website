
CREATE TABLE public.therapist_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  codice_fiscale text,
  citta text,
  paese text DEFAULT 'Italia',
  numero_albo text,
  ordine_regionale text,
  titolo_studio text,
  formazione text,
  specializzazioni text[] DEFAULT '{}',
  anni_esperienza int,
  bio text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.therapist_profiles TO authenticated;
GRANT ALL ON public.therapist_profiles TO service_role;

ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can view own profile"
ON public.therapist_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Therapist can insert own profile"
ON public.therapist_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Therapist can update own profile"
ON public.therapist_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete therapist profile"
ON public.therapist_profiles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tg_therapist_profiles_updated_at
BEFORE UPDATE ON public.therapist_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
