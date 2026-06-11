
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
  final_role public.app_role;
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
    requested_role := NEW.raw_user_meta_data->>'requested_role';
    IF requested_role = 'therapist' THEN
      final_role := 'therapist'::public.app_role;
    ELSE
      final_role := 'athlete'::public.app_role;
    END IF;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, final_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;
