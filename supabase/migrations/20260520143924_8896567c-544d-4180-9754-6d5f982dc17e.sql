CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  cover_url TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  price_detail TEXT NOT NULL DEFAULT '',
  info TEXT NOT NULL DEFAULT '',
  sold_out BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published events"
  ON public.events FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins read all events"
  ON public.events FOR SELECT
  TO authenticated
  USING (internal.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (internal.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (internal.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();