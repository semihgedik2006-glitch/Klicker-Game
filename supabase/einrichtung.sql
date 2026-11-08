create table if not exists public.fortschritt (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  daten jsonb not null default '{}'::jsonb,
  schluessel text,
  salz text,
  aktualisiert timestamptz not null default now(),
  constraint daten_groesse check (pg_column_size(daten) < 5000000),
  constraint schluessel_laenge check (schluessel is null or length(schluessel) < 2000)
);

alter table public.fortschritt enable row level security;

drop policy if exists "fortschritt lesen" on public.fortschritt;
drop policy if exists "fortschritt anlegen" on public.fortschritt;
drop policy if exists "fortschritt aendern" on public.fortschritt;
drop policy if exists "fortschritt loeschen" on public.fortschritt;
create policy "fortschritt lesen" on public.fortschritt for select to authenticated using ((select auth.uid()) = user_id);
create policy "fortschritt anlegen" on public.fortschritt for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "fortschritt aendern" on public.fortschritt for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "fortschritt loeschen" on public.fortschritt for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.fortschritt from anon;
grant select, insert, update, delete on public.fortschritt to authenticated;

create or replace function public.fortschritt_zeit() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.aktualisiert := now();
  return new;
end $$;

drop trigger if exists fortschritt_zeit on public.fortschritt;
create trigger fortschritt_zeit before insert or update on public.fortschritt
for each row execute function public.fortschritt_zeit();

create or replace function public.konto_loeschen() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.konto_loeschen() from public, anon;
grant execute on function public.konto_loeschen() to authenticated;
