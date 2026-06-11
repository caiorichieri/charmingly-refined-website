CREATE TABLE public.ambassadors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  tagline text,
  location text,
  bio text,
  photo_url text,
  cover_url text,
  website_url text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  organizations jsonb NOT NULL DEFAULT '[]'::jsonb,
  honors jsonb NOT NULL DEFAULT '[]'::jsonb,
  values jsonb NOT NULL DEFAULT '[]'::jsonb,
  quote_text text,
  published boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ambassadors TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ambassadors TO authenticated;
GRANT ALL ON public.ambassadors TO service_role;

ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published ambassadors"
  ON public.ambassadors FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert ambassadors"
  ON public.ambassadors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ambassadors"
  ON public.ambassadors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ambassadors"
  ON public.ambassadors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER ambassadors_set_updated_at
  BEFORE UPDATE ON public.ambassadors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX ambassadors_published_order_idx
  ON public.ambassadors (published, display_order);