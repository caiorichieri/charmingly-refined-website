
CREATE POLICY "Admins read send log" ON public.email_send_log FOR SELECT TO authenticated USING (internal.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins read suppressed emails" ON public.suppressed_emails FOR SELECT TO authenticated USING (internal.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins read unsubscribe tokens" ON public.email_unsubscribe_tokens FOR SELECT TO authenticated USING (internal.has_role(auth.uid(), 'admin'::app_role));
