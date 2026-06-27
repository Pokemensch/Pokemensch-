-- ============================================
-- POKEMENSCH — Initiales Datenbankschema
-- Phase 1: Alle Tabellen + RLS + Auth-Trigger
-- ============================================

-- 1. PROFILES (wird automatisch bei Registrierung angelegt)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Eigenes Profil lesen"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Eigenes Profil bearbeiten"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. CHARACTERS
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  class text not null default 'krieger',
  element text not null default 'erde',
  level integer not null default 1,
  xp integer not null default 0,
  evolution_stage integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.characters enable row level security;

create policy "Eigenen Charakter lesen"
  on public.characters for select
  using (auth.uid() = user_id);

create policy "Eigenen Charakter erstellen"
  on public.characters for insert
  with check (auth.uid() = user_id);

create policy "Eigenen Charakter bearbeiten"
  on public.characters for update
  using (auth.uid() = user_id);

-- 3. LIFE_INPUTS (echte Lebensdaten)
create table public.life_inputs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  profession text not null default '',
  years_experience integer not null default 0,
  sports jsonb not null default '[]',
  body jsonb not null default '{}',
  degrees jsonb not null default '[]',
  hobbies jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.life_inputs enable row level security;

create policy "Eigene Life-Inputs lesen"
  on public.life_inputs for select
  using (auth.uid() = user_id);

create policy "Eigene Life-Inputs erstellen"
  on public.life_inputs for insert
  with check (auth.uid() = user_id);

create policy "Eigene Life-Inputs bearbeiten"
  on public.life_inputs for update
  using (auth.uid() = user_id);

-- 4. STATS (abgeleitete Werte)
create table public.stats (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  str integer not null default 10,
  aus integer not null default 10,
  int integer not null default 10,
  ges integer not null default 10,
  wil integer not null default 10,
  cha integer not null default 10,
  updated_at timestamptz not null default now()
);

alter table public.stats enable row level security;

create policy "Eigene Stats lesen"
  on public.stats for select
  using (
    auth.uid() = (select user_id from public.characters where id = character_id)
  );

create policy "Eigene Stats erstellen"
  on public.stats for insert
  with check (
    auth.uid() = (select user_id from public.characters where id = character_id)
  );

create policy "Eigene Stats bearbeiten"
  on public.stats for update
  using (
    auth.uid() = (select user_id from public.characters where id = character_id)
  );

-- 5. TALENTS (Talentbaum-Knoten pro Klasse)
create table public.talents (
  id uuid primary key default gen_random_uuid(),
  class text not null,
  node_key text not null,
  name text not null,
  branch text not null,
  requires jsonb not null default '[]',
  unlocks jsonb not null default '{}',
  unique (class, node_key)
);

alter table public.talents enable row level security;

create policy "Talents sind öffentlich lesbar"
  on public.talents for select
  using (true);

-- 6. CHARACTER_TALENTS (freigeschaltete Talente)
create table public.character_talents (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  talent_id uuid not null references public.talents(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (character_id, talent_id)
);

alter table public.character_talents enable row level security;

create policy "Eigene Talente lesen"
  on public.character_talents for select
  using (
    auth.uid() = (select user_id from public.characters where id = character_id)
  );

create policy "Eigene Talente freischalten"
  on public.character_talents for insert
  with check (
    auth.uid() = (select user_id from public.characters where id = character_id)
  );

-- 7. ATTACKS (Attacken-Definitionen)
create table public.attacks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  element text,
  type text not null default 'physical',
  base_power integer not null default 5,
  effect jsonb not null default '{}',
  cost integer not null default 0
);

alter table public.attacks enable row level security;

create policy "Attacken sind öffentlich lesbar"
  on public.attacks for select
  using (true);

-- 8. QUESTS
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text not null default '',
  category text not null default 'allgemein',
  reward jsonb not null default '{}'
);

alter table public.quests enable row level security;

create policy "Quests sind öffentlich lesbar"
  on public.quests for select
  using (true);

-- 9. QUEST_LOG (erledigte Quests pro User)
create table public.quest_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quest_id uuid not null references public.quests(id) on delete cascade,
  completed_at timestamptz not null default now(),
  buff jsonb not null default '{}'
);

alter table public.quest_log enable row level security;

create policy "Eigenes Quest-Log lesen"
  on public.quest_log for select
  using (auth.uid() = user_id);

create policy "Eigenes Quest-Log schreiben"
  on public.quest_log for insert
  with check (auth.uid() = user_id);

-- 10. BATTLES (asynchrone Kämpfe)
create table public.battles (
  id uuid primary key default gen_random_uuid(),
  attacker_id uuid not null references public.profiles(id) on delete cascade,
  defender_id uuid not null references public.profiles(id) on delete cascade,
  defender_snapshot jsonb not null default '{}',
  log jsonb not null default '[]',
  result text, -- 'win', 'loss', 'draw', null = noch offen
  created_at timestamptz not null default now()
);

alter table public.battles enable row level security;

create policy "Eigene Kämpfe lesen (Angreifer oder Verteidiger)"
  on public.battles for select
  using (auth.uid() = attacker_id or auth.uid() = defender_id);

create policy "Kampf erstellen"
  on public.battles for insert
  with check (auth.uid() = attacker_id);

-- 11. FRIENDS
create table public.friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending', -- 'pending', 'accepted', 'blocked'
  created_at timestamptz not null default now(),
  unique (user_id, friend_id)
);

alter table public.friends enable row level security;

create policy "Eigene Freundschaften lesen"
  on public.friends for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Freundschaftsanfrage senden"
  on public.friends for insert
  with check (auth.uid() = user_id);

create policy "Freundschaft akzeptieren/ablehnen"
  on public.friends for update
  using (auth.uid() = friend_id);

-- 12. APP_CONNECTIONS (verbundene Drittanbieter-Apps)
create table public.app_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  tokens jsonb not null default '{}',
  last_sync timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.app_connections enable row level security;

create policy "Eigene App-Verbindungen lesen"
  on public.app_connections for select
  using (auth.uid() = user_id);

create policy "Eigene App-Verbindungen erstellen"
  on public.app_connections for insert
  with check (auth.uid() = user_id);

create policy "Eigene App-Verbindungen bearbeiten"
  on public.app_connections for update
  using (auth.uid() = user_id);

create policy "Eigene App-Verbindungen löschen"
  on public.app_connections for delete
  using (auth.uid() = user_id);

-- ============================================
-- AUTH-TRIGGER: Profil automatisch anlegen
-- ============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Freundes-Werte für PvP: öffentliche Sicht auf Basis-Infos
create policy "Freunde können Profil-Basics sehen"
  on public.profiles for select
  using (
    id in (
      select friend_id from public.friends
      where user_id = auth.uid() and status = 'accepted'
      union
      select user_id from public.friends
      where friend_id = auth.uid() and status = 'accepted'
    )
  );

-- Freunde können Stats für PvP-Schnappschuss sehen
create policy "Freunde können Stats sehen"
  on public.stats for select
  using (
    character_id in (
      select c.id from public.characters c
      where c.user_id in (
        select friend_id from public.friends
        where user_id = auth.uid() and status = 'accepted'
        union
        select user_id from public.friends
        where friend_id = auth.uid() and status = 'accepted'
      )
    )
  );
