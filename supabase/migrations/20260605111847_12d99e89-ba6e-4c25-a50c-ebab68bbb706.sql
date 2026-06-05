
-- USER CONSENTS (registry per documento legale accettato)
CREATE TABLE public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document text NOT NULL CHECK (document IN ('privacy','terms','marketing','dpa')),
  version text NOT NULL,
  granted boolean NOT NULL DEFAULT true,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_consents_user ON public.user_consents (user_id, document, created_at DESC);

GRANT SELECT, INSERT ON public.user_consents TO authenticated;
GRANT ALL ON public.user_consents TO service_role;

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own consents" ON public.user_consents
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own consents" ON public.user_consents
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- COOKIE CONSENTS (banner)
CREATE TABLE public.cookie_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id text,
  necessary boolean NOT NULL DEFAULT true,
  analytics boolean NOT NULL DEFAULT false,
  marketing boolean NOT NULL DEFAULT false,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cookie_consents_user ON public.cookie_consents (user_id, created_at DESC);
CREATE INDEX idx_cookie_consents_anon ON public.cookie_consents (anonymous_id, created_at DESC);

GRANT SELECT, INSERT ON public.cookie_consents TO anon, authenticated;
GRANT ALL ON public.cookie_consents TO service_role;

ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert cookie consent" ON public.cookie_consents
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users read own cookie consents" ON public.cookie_consents
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ACCESS LOG (audit accountability)
CREATE TABLE public.access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject_id uuid,
  action text NOT NULL,
  resource text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_access_log_subject ON public.access_log (subject_id, created_at DESC);
CREATE INDEX idx_access_log_actor ON public.access_log (actor_id, created_at DESC);

GRANT INSERT ON public.access_log TO authenticated;
GRANT SELECT ON public.access_log TO authenticated;
GRANT ALL ON public.access_log TO service_role;

ALTER TABLE public.access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can insert own actions" ON public.access_log
FOR INSERT TO authenticated
WITH CHECK (actor_id = auth.uid());

CREATE POLICY "Users see logs about themselves; admins see all" ON public.access_log
FOR SELECT TO authenticated
USING (subject_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ACCOUNT DELETION REQUESTS
CREATE TABLE public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text CHECK (reason IS NULL OR length(reason) <= 2000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (user_id, status) DEFERRABLE INITIALLY DEFERRED
);

GRANT SELECT, INSERT ON public.account_deletion_requests TO authenticated;
GRANT ALL ON public.account_deletion_requests TO service_role;

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own deletion requests" ON public.account_deletion_requests
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own deletion request" ON public.account_deletion_requests
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
