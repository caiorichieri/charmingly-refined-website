
REVOKE EXECUTE ON FUNCTION public.get_my_therapist(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_therapist(uuid) TO authenticated, service_role;
