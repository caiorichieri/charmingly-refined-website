create schema if not exists internal;

create or replace function internal.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

revoke all on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant usage on schema internal to anon, authenticated;
grant execute on function internal.has_role(uuid, public.app_role) to anon, authenticated;

alter policy "Admins manage posts" on public.blog_posts
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read all posts" on public.blog_posts
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage faqs" on public.faqs
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read all faqs" on public.faqs
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage media" on public.media_assets
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage paths" on public.paths
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read all paths" on public.paths
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage plans" on public.plans
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read all plans" on public.plans
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage profiles" on public.profiles
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage leads" on public.quiz_leads
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read leads" on public.quiz_leads
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage options" on public.quiz_options
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage questions" on public.quiz_questions
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read all questions" on public.quiz_questions
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage responses" on public.quiz_responses
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read responses" on public.quiz_responses
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage testimonials" on public.testimonials
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins read all testimonials" on public.testimonials
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins manage roles" on public.user_roles
  using (internal.has_role(auth.uid(), 'admin'::public.app_role))
  with check (internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins view all roles" on public.user_roles
  using (internal.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "Admins delete media" on storage.objects
  using ((bucket_id = 'media'::text) and internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins update media" on storage.objects
  using ((bucket_id = 'media'::text) and internal.has_role(auth.uid(), 'admin'::public.app_role));
alter policy "Admins upload media" on storage.objects
  with check ((bucket_id = 'media'::text) and internal.has_role(auth.uid(), 'admin'::public.app_role));