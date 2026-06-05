-- Explicit admin-only INSERT policy on user_roles to make privilege boundary unambiguous
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (internal.has_role(auth.uid(), 'admin'::app_role));

-- Admin read visibility on email_send_state for operational management
CREATE POLICY "Admins can read send state"
ON public.email_send_state
FOR SELECT
TO authenticated
USING (internal.has_role(auth.uid(), 'admin'::app_role));