create table if not exists public.jarvis_einstellungen (
  schluessel text primary key,
  wert text not null
);

create table if not exists public.jarvis_gedaechtnis (
  id bigint generated always as identity primary key,
  kategorie text not null,
  inhalt text not null check (length(inhalt) < 2000),
  aktiv boolean not null default true,
  erstellt timestamptz not null default now()
);

create table if not exists public.jarvis_verlauf (
  id bigint generated always as identity primary key,
  rolle text not null check (rolle in ('user', 'assistant')),
  kanal text not null default 'telegram',
  text text not null,
  zeit timestamptz not null default now()
);

create table if not exists public.jarvis_wochenzahlen (
  woche date primary key,
  ansprachen int,
  gespraeche int,
  angebote int,
  neue_kunden int,
  umsatz_eur numeric(10,2),
  stunden numeric(5,1),
  notiz text,
  erfasst timestamptz not null default now()
);

create table if not exists public.jarvis_erinnerungen (
  id bigint generated always as identity primary key,
  faellig timestamptz not null,
  text text not null check (length(text) < 1000),
  gesendet boolean not null default false
);

create index if not exists jarvis_verlauf_zeit on public.jarvis_verlauf (zeit desc);
create index if not exists jarvis_erinnerungen_offen on public.jarvis_erinnerungen (faellig) where not gesendet;

alter table public.jarvis_einstellungen enable row level security;
alter table public.jarvis_gedaechtnis enable row level security;
alter table public.jarvis_verlauf enable row level security;
alter table public.jarvis_wochenzahlen enable row level security;
alter table public.jarvis_erinnerungen enable row level security;

revoke all on public.jarvis_einstellungen, public.jarvis_gedaechtnis, public.jarvis_verlauf,
  public.jarvis_wochenzahlen, public.jarvis_erinnerungen from anon, authenticated;

insert into public.jarvis_gedaechtnis (kategorie, inhalt)
select * from (values
  ('person', 'Semih, 20, lebt in Köln, duales Studium Gesundheitsmanagement (DHfPG), arbeitet als EMS-Personal-Trainer.'),
  ('finanzen', 'Verdient ca. 600 € im Monat, ca. 550 € Fixkosten inkl. Sprit, rund 50 € Puffer, fast kein Kapital.'),
  ('ziel', 'Nach 6 Monaten Gewinn, nach 12 Monaten mindestens Vollzeit-Mindestlohn (ca. 1.800 € zusätzlich zu den 600 €).'),
  ('plan', 'Gestaffelter Plan: Monat 1-2 eigene Personal-Training-Kunden, Monat 3-6 KI-Systeme erst am eigenen Training bauen und dann Studios/Physios in Köln anbieten, Monat 7-12 Firmenkurse (betriebliche Gesundheitsförderung).'),
  ('rhythmus', 'Wochen-Check jeden Sonntag mit 5 Zahlen: Ansprachen, Gespräche, Angebote, neue Kunden plus Umsatz, investierte Stunden.'),
  ('vorliebe', 'Interessen: Social Media, KI, Systeme. Skeptisch gegenüber teuren Erfolgsseminaren, will ehrliche und belegte Ratschläge.')
) as start (kategorie, inhalt)
where not exists (select 1 from public.jarvis_gedaechtnis);

insert into public.jarvis_einstellungen (schluessel, wert) values
  ('geheim', replace(gen_random_uuid()::text, '-', '')),
  ('telegram_geheim', replace(gen_random_uuid()::text, '-', '')),
  ('start_code', left(replace(gen_random_uuid()::text, '-', ''), 8))
on conflict (schluessel) do nothing;

create extension if not exists pg_cron;
create extension if not exists pg_net schema extensions;

select cron.unschedule('jarvis-takt') where exists (select 1 from cron.job where jobname = 'jarvis-takt');
select cron.schedule('jarvis-takt', '*/5 * * * *', $$
  select net.http_post(
    url := 'https://yddyimqmkfbpwxanokaj.supabase.co/functions/v1/jarvis/takt',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-jarvis-geheim', (select wert from public.jarvis_einstellungen where schluessel = 'geheim')
    ),
    body := '{}'::jsonb
  );
$$);
