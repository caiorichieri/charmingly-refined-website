INSERT INTO public.profiles (id, email, display_name)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email,'@',1))
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;