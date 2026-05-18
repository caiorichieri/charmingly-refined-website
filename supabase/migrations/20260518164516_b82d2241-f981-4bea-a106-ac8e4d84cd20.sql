drop policy if exists "Public can submit leads" on public.quiz_leads;
create policy "Public can submit valid leads"
on public.quiz_leads
for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 120
  and length(trim(email)) between 5 and 254
  and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and length(trim(phone)) between 5 and 40
);

drop policy if exists "Public can submit responses" on public.quiz_responses;
create policy "Public can submit valid responses"
on public.quiz_responses
for insert
to anon, authenticated
with check (
  lead_id is not null
  and question_id is not null
  and option_id is not null
);

drop policy if exists "Public read media bucket" on storage.objects;