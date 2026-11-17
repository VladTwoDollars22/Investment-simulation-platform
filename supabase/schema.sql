-- Starcup investment quiz — Supabase schema
-- Run this file in the Supabase SQL editor (or with `supabase db push`).
--
-- All reads and writes happen through Next.js Route Handlers using the
-- server-side secret key. Row Level Security is enabled with no public
-- policies, so the browser can never read the unlock_code or submit directly.

create extension if not exists pgcrypto;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  unlock_code text not null,
  created_at timestamptz not null default now(),
  constraint games_room_code_format check (room_code ~ '^[A-Z0-9]{4,6}$'),
  constraint games_unlock_code_format check (unlock_code ~ '^[A-Z0-9]{4,12}$')
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  player_name text not null,
  allocations jsonb not null default '{}'::jsonb,
  uninvested_cash numeric(12, 2) not null default 0,
  final_balance numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  constraint submissions_player_name_length check (char_length(player_name) between 2 and 30),
  constraint submissions_allocations_object check (jsonb_typeof(allocations) = 'object'),
  constraint submissions_uninvested_non_negative check (uninvested_cash >= 0),
  constraint submissions_final_balance_non_negative check (final_balance >= 0),
  -- Lets POST /api/games/submit upsert a player who plays the room again.
  constraint submissions_game_player_unique unique (game_id, player_name)
);

create index if not exists submissions_leaderboard_idx
  on public.submissions (game_id, final_balance desc, created_at asc);

alter table public.games enable row level security;
alter table public.submissions enable row level security;

comment on table public.games is
  'One live quiz room. room_code is shared publicly; unlock_code is host-only until the reveal.';
comment on table public.submissions is
  'A player portfolio. final_balance is calculated server-side from src/data/startups.json multipliers.';
